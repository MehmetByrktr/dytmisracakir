import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import sanitizeHtml from 'sanitize-html';
import { site } from '@/data/site';
import { services } from '@/data/services';
import { blogPosts } from '@/data/blogPosts';
import { menus } from '@/data/menus';
import { faqItems } from '@/data/faq';
import { getSupabaseAdmin, hasSupabaseConfig, readableSupabaseError } from '@/lib/supabase-server';
import type { AppointmentRecord, BlogPost, ContactRecord, FaqItem, MenuPlan, Service } from '@/types';

export interface ContentData {
  site: typeof site;
  services: Service[];
  blogPosts: BlogPost[];
  menus: MenuPlan[];
  faq: FaqItem[];
  appointments: AppointmentRecord[];
  messages: ContactRecord[];
  updatedAt: string;
}

const storageDirectory = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(process.cwd(), 'storage');
const contentFile = path.join(storageDirectory, 'content.json');

function normalizePosts(posts: BlogPost[]): BlogPost[] {
  return posts.map((post) => ({
    ...post,
    status: post.status || 'published',
    views: Number(post.views || 0),
    likes: Number(post.likes || 0),
    content: Array.isArray(post.content) ? post.content : [],
    contentHtml: post.contentHtml ? sanitizeBlogHtml(post.contentHtml) : undefined,
  }));
}

function normalizeMenus(items: MenuPlan[]): MenuPlan[] {
  return items.map((item) => ({
    ...item,
    status: item.status || 'published',
    days: Array.isArray(item.days) ? item.days : [],
    notes: Array.isArray(item.notes) ? item.notes : [],
    contentHtml: item.contentHtml ? sanitizeBlogHtml(item.contentHtml) : undefined,
  }));
}

function sanitizeBlogHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ['p', 'br', 'h2', 'h3', 'strong', 'b', 'em', 'i', 'u', 's', 'blockquote', 'ul', 'ol', 'li', 'a', 'img', 'div', 'span', 'font', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
    allowedAttributes: {
      a: ['href', 'target', 'rel'], img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      div: ['class'], span: ['class', 'style'], p: ['class', 'style'], h2: ['id', 'class', 'style'], h3: ['id', 'class', 'style'],
      li: ['class'], ol: ['class'], ul: ['class'], font: ['face', 'size', 'color'], table: ['class'], th: ['colspan', 'rowspan'], td: ['colspan', 'rowspan'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https'] },
    allowProtocolRelative: false,
    allowedStyles: {
      '*': {
        'text-align': [/^(left|right|center|justify)$/],
        'font-family': [/^[a-zA-Z0-9 ,'-]{1,80}$/],
        'font-size': [/^[0-9.]+(px|rem|em|%)$/],
        'text-decoration': [/^(none|underline|line-through|overline)( solid)?$/],
      },
    },
    transformTags: {
      a: (_tagName, attribs) => ({ tagName: 'a', attribs: { ...attribs, rel: 'noopener noreferrer' } }),
      img: (_tagName, attribs) => ({ tagName: 'img', attribs: { ...attribs, loading: 'lazy' } }),
    },
  });
}

function defaults(): ContentData {
  return {
    site,
    services,
    blogPosts: normalizePosts(blogPosts),
    menus: normalizeMenus(menus),
    faq: faqItems,
    appointments: [],
    messages: [],
    updatedAt: new Date().toISOString(),
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge<T>(base: T, patch: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(patch)) return (patch ?? base) as T;
  const output: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(patch)) {
    const original = output[key];
    output[key] = isPlainObject(original) && isPlainObject(value) ? deepMerge(original, value) : value;
  }
  return output as T;
}

function mergeContent(patch: Partial<ContentData>): ContentData {
  const base = defaults();
  return {
    ...base,
    ...patch,
    site: deepMerge(base.site, patch.site || {}),
    services: Array.isArray(patch.services) ? patch.services : base.services,
    blogPosts: normalizePosts(Array.isArray(patch.blogPosts) ? patch.blogPosts : base.blogPosts),
    menus: normalizeMenus(Array.isArray(patch.menus) ? patch.menus : base.menus),
    faq: Array.isArray(patch.faq) ? patch.faq : base.faq,
    appointments: Array.isArray(patch.appointments) ? patch.appointments : [],
    messages: Array.isArray(patch.messages) ? patch.messages : [],
    updatedAt: patch.updatedAt || base.updatedAt,
  };
}

function getLocalContent(): ContentData {
  if (!fs.existsSync(storageDirectory)) fs.mkdirSync(storageDirectory, { recursive: true });
  if (!fs.existsSync(contentFile)) return defaults();
  try {
    return mergeContent(JSON.parse(fs.readFileSync(contentFile, 'utf8')) as Partial<ContentData>);
  } catch {
    return defaults();
  }
}

function saveLocalContent(content: ContentData): ContentData {
  if (!fs.existsSync(storageDirectory)) fs.mkdirSync(storageDirectory, { recursive: true });
  const next = { ...content, blogPosts: normalizePosts(content.blogPosts), menus: normalizeMenus(content.menus), updatedAt: new Date().toISOString() };
  const temporaryFile = `${contentFile}.tmp`;
  fs.writeFileSync(temporaryFile, JSON.stringify(next, null, 2), 'utf8');
  fs.renameSync(temporaryFile, contentFile);
  return next;
}

function requireProductionDatabase() {
  if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
    throw new Error('Üretim ortamında Supabase yapılandırması zorunludur.');
  }
}

export async function getContent(): Promise<ContentData> {
  if (!hasSupabaseConfig()) {
    requireProductionDatabase();
    return getLocalContent();
  }

  const supabase = getSupabaseAdmin();
  const [contentResult, appointmentsResult, messagesResult, metricsResult] = await Promise.all([
    supabase.from('site_content').select('content, updated_at').eq('id', 'main').maybeSingle(),
    supabase.from('appointments').select('*').order('created_at', { ascending: false }),
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
    supabase.from('blog_metrics').select('slug, views, likes'),
  ]);

  const error = contentResult.error || appointmentsResult.error || messagesResult.error || metricsResult.error;
  if (error) throw new Error(`Supabase verisi okunamadı: ${readableSupabaseError(error)}`);

  if (!contentResult.data) {
    const initial = fs.existsSync(contentFile) ? getLocalContent() : defaults();
    const { error: seedError } = await supabase.from('site_content').upsert({ id: 'main', content: { ...initial, appointments: [], messages: [] } });
    if (seedError) throw new Error(`Başlangıç içeriği oluşturulamadı: ${readableSupabaseError(seedError)}`);
    const initialMetrics = initial.blogPosts.map((post) => ({ slug: post.slug, views: Number(post.views || 0), likes: Number(post.likes || 0) }));
    if (initialMetrics.length) await supabase.from('blog_metrics').upsert(initialMetrics, { onConflict: 'slug', ignoreDuplicates: true });
    return initial;
  }

  const content = mergeContent(contentResult.data.content as Partial<ContentData>);
  const metrics = new Map((metricsResult.data || []).map((item) => [item.slug, item]));
  content.blogPosts = content.blogPosts.map((post) => {
    const metric = metrics.get(post.slug);
    return metric ? { ...post, views: Number(metric.views || 0), likes: Number(metric.likes || 0) } : post;
  });
  content.appointments = (appointmentsResult.data || []).map((row) => ({
    id: row.id, createdAt: row.created_at, status: row.status, service: row.service, date: row.date || '', time: row.time || '',
    format: row.format || '', name: row.name, phone: row.phone, email: row.email, note: row.note || '',
  })) as AppointmentRecord[];
  content.messages = (messagesResult.data || []).map((row) => ({
    id: row.id, createdAt: row.created_at, status: row.status, name: row.name, email: row.email, phone: row.phone || '', message: row.message,
  })) as ContactRecord[];
  content.updatedAt = contentResult.data.updated_at || content.updatedAt;
  return content;
}

async function syncRows(table: 'appointments' | 'contact_messages', rows: Array<Record<string, unknown>>, ids: string[]) {
  const supabase = getSupabaseAdmin();
  if (rows.length) {
    const { error } = await supabase.from(table).upsert(rows, { onConflict: 'id' });
    if (error) throw error;
  }
  const { data: existing, error: selectError } = await supabase.from(table).select('id');
  if (selectError) throw selectError;
  const removed = (existing || []).map((row) => row.id as string).filter((id) => !ids.includes(id));
  if (removed.length) {
    const { error } = await supabase.from(table).delete().in('id', removed);
    if (error) throw error;
  }
}

export async function saveContent(content: ContentData): Promise<ContentData> {
  const next = { ...content, blogPosts: normalizePosts(content.blogPosts), menus: normalizeMenus(content.menus), updatedAt: new Date().toISOString() };
  if (!hasSupabaseConfig()) {
    requireProductionDatabase();
    return saveLocalContent(next);
  }

  const supabase = getSupabaseAdmin();
  const core = { ...next, appointments: [], messages: [] };
  const appointmentRows = next.appointments.map((item) => ({
    id: item.id, created_at: item.createdAt, status: item.status, service: item.service, date: item.date, time: item.time,
    format: item.format, name: item.name, phone: item.phone, email: item.email, note: item.note,
  }));
  const messageRows = next.messages.map((item) => ({
    id: item.id, created_at: item.createdAt, status: item.status, name: item.name, email: item.email, phone: item.phone, message: item.message,
  }));
  const metricRows = next.blogPosts.map((post) => ({ slug: post.slug, views: Number(post.views || 0), likes: Number(post.likes || 0) }));

  const { error } = await supabase.from('site_content').upsert({ id: 'main', content: core, updated_at: next.updatedAt });
  if (error) throw new Error(`İçerik kaydedilemedi: ${readableSupabaseError(error)}`);
  await Promise.all([
    syncRows('appointments', appointmentRows, next.appointments.map((item) => item.id)),
    syncRows('contact_messages', messageRows, next.messages.map((item) => item.id)),
    metricRows.length ? supabase.from('blog_metrics').upsert(metricRows, { onConflict: 'slug', ignoreDuplicates: true }).then(({ error: metricError }) => { if (metricError) throw metricError; }) : Promise.resolve(),
  ]);
  return next;
}

export async function createAppointment(record: AppointmentRecord) {
  if (!hasSupabaseConfig()) {
    const content = getLocalContent();
    saveLocalContent({ ...content, appointments: [record, ...content.appointments] });
    return;
  }
  const { error } = await getSupabaseAdmin().from('appointments').insert({
    id: record.id, created_at: record.createdAt, status: record.status, service: record.service, date: record.date, time: record.time,
    format: record.format, name: record.name, phone: record.phone, email: record.email, note: record.note,
  });
  if (error) throw new Error(readableSupabaseError(error));
}

export async function createContactMessage(record: ContactRecord) {
  if (!hasSupabaseConfig()) {
    const content = getLocalContent();
    saveLocalContent({ ...content, messages: [record, ...content.messages] });
    return;
  }
  const { error } = await getSupabaseAdmin().from('contact_messages').insert({
    id: record.id, created_at: record.createdAt, status: record.status, name: record.name, email: record.email, phone: record.phone, message: record.message,
  });
  if (error) throw new Error(readableSupabaseError(error));
}

export async function incrementBlogMetric(slug: string, metric: 'views' | 'likes'): Promise<number | null> {
  if (!hasSupabaseConfig()) {
    const content = getLocalContent();
    let value: number | null = null;
    const blogPosts = content.blogPosts.map((post) => {
      if (post.slug !== slug || post.status === 'draft') return post;
      value = Number(post[metric] || 0) + 1;
      return { ...post, [metric]: value };
    });
    saveLocalContent({ ...content, blogPosts });
    return value;
  }
  const { data, error } = await getSupabaseAdmin().rpc('increment_blog_metric', { target_slug: slug, metric_name: metric });
  if (error) throw new Error(readableSupabaseError(error));
  return typeof data === 'number' ? data : Number(data ?? 0);
}
