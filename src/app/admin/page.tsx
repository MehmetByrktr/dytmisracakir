'use client';
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3, CalendarDays, CheckCircle2, ChevronDown, ChevronRight, CircleDot, Eye,
  FileText, HelpCircle, Home, Image as ImageIcon, LayoutDashboard, Loader2, LogOut,
  Mail, Menu as MenuIcon, MessageSquare, Plus, Save, Settings, Stethoscope, Trash2,
  Type, Heart, ExternalLink, Phone, Send, PencilLine,
} from 'lucide-react';
import type { AppointmentRecord, BlogPost, ContactRecord, FaqItem, MenuPlan, Service } from '@/types';
import { site as defaultSite } from '@/data/site';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageUploader from '@/components/admin/ImageUploader';

interface AdminContent {
  site: typeof defaultSite;
  services: Service[];
  blogPosts: BlogPost[];
  menus: MenuPlan[];
  faq: FaqItem[];
  appointments: AppointmentRecord[];
  messages: ContactRecord[];
  updatedAt: string;
}

type Tab = 'overview' | 'site' | 'texts' | 'services' | 'blog' | 'menus' | 'faq' | 'appointments' | 'messages';
type TabDefinition = { id: Tab; label: string; icon: typeof LayoutDashboard };
const tabs: TabDefinition[] = [
  { id: 'overview', label: 'Genel Bakış', icon: LayoutDashboard },
  { id: 'site', label: 'Site Ayarları', icon: Settings },
  { id: 'texts', label: 'Sayfa Metinleri', icon: Type },
  { id: 'services', label: 'Danışmanlıklar', icon: Stethoscope },
  { id: 'blog', label: 'Blog Yazıları', icon: FileText },
  { id: 'menus', label: 'Menüler', icon: MenuIcon },
  { id: 'faq', label: 'Sık Sorulan Sorular', icon: HelpCircle },
  { id: 'appointments', label: 'Randevular', icon: CalendarDays },
  { id: 'messages', label: 'Mesajlar', icon: Mail },
];

const fieldClass = 'w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/10';
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink-faint';

function slugify(value: string) {
  return value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function htmlFromParagraphs(paragraphs: string[]) { return paragraphs.map((p) => `<p>${p.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join(''); }
function phoneDigits(phone: string) { return phone.replace(/\D/g, '').replace(/^0/, '90'); }

function Field({ label, value, onChange, type = 'text', placeholder = '', readOnly = false }: { label: string; value: string | number; onChange?: (value: string) => void; type?: string; placeholder?: string; readOnly?: boolean }) {
  return <label><span className={labelClass}>{label}</span><input className={`${fieldClass} ${readOnly ? 'bg-cream-deep/50 text-ink-faint' : ''}`} type={type} value={value ?? ''} placeholder={placeholder} readOnly={readOnly} onChange={(e) => onChange?.(e.target.value)} /></label>;
}
function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string } | string> }) {
  return <label><span className={labelClass}>{label}</span><div className="relative"><select className={`${fieldClass} appearance-none pr-10`} value={value} onChange={(e) => onChange(e.target.value)}>{options.map((option) => typeof option === 'string' ? <option key={option} value={option}>{option}</option> : <option key={option.value} value={option.value}>{option.label}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-clay" /></div></label>;
}
function TextArea({ label, value, onChange, rows = 5, hint }: { label: string; value: string; onChange: (value: string) => void; rows?: number; hint?: string }) {
  return <label><span className={labelClass}>{label}</span><textarea className={`${fieldClass} resize-y`} rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />{hint && <span className="mt-1 block text-xs text-ink-faint">{hint}</span>}</label>;
}
function Panel({ title, description, children, action }: { title: string; description?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return <section className="rounded-xl2 border border-cream-line bg-card/90 p-5 shadow-card sm:p-7"><div className="mb-6 flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-display text-2xl text-ink">{title}</h2>{description && <p className="mt-1 text-sm leading-relaxed text-ink-faint">{description}</p>}</div>{action}</div>{children}</section>;
}
function Badge({ count }: { count: number }) { return count > 0 ? <span className="ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">{count > 99 ? '99+' : count}</span> : null; }
function SectionDivider({ title, description }: { title: string; description?: string }) { return <div className="border-b border-ink/[0.07] pb-3 pt-2"><h3 className="font-display text-lg text-ink">{title}</h3>{description && <p className="mt-1 text-xs text-ink-faint">{description}</p>}</div>; }

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [content, setContent] = useState<AdminContent | null>(null);
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState(0);
  const [selectedPost, setSelectedPost] = useState(0);
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [selectedFaq, setSelectedFaq] = useState(0);

  useEffect(() => { void loadContent(''); }, []);

  async function loadContent(pass = password) {
    setLoading(true); setError('');
    try {
      if (pass) {
        const loginResponse = await fetch('/api/admin/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pass }) });
        if (!loginResponse.ok) throw new Error(loginResponse.status === 429 ? 'Çok fazla giriş denemesi. Lütfen daha sonra tekrar deneyin.' : 'Şifre hatalı.');
      }
      const response = await fetch('/api/admin/content', { cache: 'no-store', credentials: 'same-origin' });
      if (!response.ok) {
        if (response.status === 401 && !pass) return;
        throw new Error(response.status === 401 ? 'Oturum açılamadı.' : 'İçerikler yüklenemedi.');
      }
      const data = await response.json() as AdminContent;
      setContent(data); setAuthenticated(true); setPassword('');
    } catch (err) { setAuthenticated(false); setError(err instanceof Error ? err.message : 'Giriş yapılamadı.'); }
    finally { setLoading(false); }
  }

  async function saveContent(nextContent = content) {
    if (!nextContent) return;
    setSaving(true); setNotice(''); setError('');
    try {
      const response = await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(nextContent) });
      if (!response.ok) throw new Error('Değişiklikler kaydedilemedi.');
      const data = await response.json() as AdminContent;
      setContent(data); setNotice('Değişiklikler kaydedildi ve siteye yansıtıldı.');
      window.setTimeout(() => setNotice(''), 3500);
    } catch (err) { setError(err instanceof Error ? err.message : 'Kaydetme başarısız.'); }
    finally { setSaving(false); }
  }

  async function logout() { await fetch('/api/admin/session', { method: 'DELETE', credentials: 'same-origin' }); setAuthenticated(false); setContent(null); setPassword(''); }

  const newMessages = content?.messages.filter((item) => item.status === 'Yeni').length || 0;
  const newAppointments = content?.appointments.filter((item) => item.status === 'Yeni').length || 0;
  const badgeFor = (id: Tab) => id === 'messages' ? newMessages : id === 'appointments' ? newAppointments : 0;

  if (!authenticated || !content) return <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cream via-cream-deep to-sage-50 px-5"><div className="w-full max-w-md rounded-[1.75rem] border border-cream-line bg-card/90 p-8 shadow-soft backdrop-blur"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-clay/12 text-clay-deep"><Settings className="h-6 w-6" /></div><h1 className="mt-6 font-display text-3xl text-ink">Mısra Çakır Yönetim Paneli</h1><p className="mt-2 text-sm leading-relaxed text-ink-faint">Site içeriklerini, randevuları, mesajları ve blog istatistiklerini yönetin.</p><form className="mt-7 space-y-4" onSubmit={(e) => { e.preventDefault(); void loadContent(); }}><Field label="Yönetici şifresi" type="password" value={password} onChange={setPassword} /><button disabled={loading || !password} className="flex w-full items-center justify-center gap-2 rounded-full bg-clay px-5 py-3.5 text-sm font-semibold text-porcelain transition hover:bg-clay-deep disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}Panele Giriş Yap</button></form>{error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}</div></div>;

  return <div className="min-h-screen lg:grid lg:grid-cols-[270px_1fr]">
    <aside className="border-b border-sage-700/40 bg-sage px-4 py-5 text-porcelain lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:px-5 lg:py-7">
      <div className="flex items-center justify-between gap-4 lg:block"><div><p className="font-display text-xl">Mısra Çakır</p><p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-powder">Yönetim Paneli</p></div><button onClick={logout} className="rounded-full border border-porcelain/20 p-2 text-porcelain/75 hover:bg-porcelain/10 hover:text-porcelain lg:hidden"><LogOut className="h-4 w-4" /></button></div>
      <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:mt-10 lg:block lg:space-y-1.5 lg:overflow-visible">{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition lg:w-full ${tab === id ? 'bg-cream/95 font-semibold text-ink shadow-sm' : 'text-porcelain/75 hover:bg-porcelain/10 hover:text-porcelain'}`}><Icon className="h-4 w-4 shrink-0" /><span>{label}</span><Badge count={badgeFor(id)} /></button>)}</nav>
      <div className="mt-auto hidden pt-8 lg:block"><a href="/" target="_blank" className="flex items-center gap-2 rounded-xl border border-cream/15 px-4 py-3 text-sm text-cream/70 transition hover:bg-cream/10 hover:text-cream"><Home className="h-4 w-4" />Siteyi Görüntüle<ExternalLink className="ml-auto h-3.5 w-3.5" /></a><button onClick={logout} className="mt-2 flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm text-cream/60 transition hover:bg-red-500/15 hover:text-red-200"><LogOut className="h-4 w-4" />Çıkış Yap</button></div>
    </aside>

    <main className="min-w-0 px-4 py-6 sm:px-7 lg:px-10 lg:py-9"><div className="mx-auto max-w-[1280px]">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4"><div><p className="eyebrow">İçerik Yönetimi</p><h1 className="mt-1 font-display text-3xl text-ink">{tabs.find((item) => item.id === tab)?.label}</h1></div><div className="flex items-center gap-3">{notice && <span className="hidden rounded-full bg-sage-100 px-4 py-2 text-xs font-semibold text-sage-700 sm:inline">{notice}</span>}<button onClick={() => void saveContent()} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-clay px-5 py-3 text-sm font-semibold text-cream shadow-card transition hover:bg-clay-deep disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Tüm Değişiklikleri Kaydet</button></div></div>
      {error && <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {notice && <p className="mb-5 rounded-xl bg-sage-50 px-4 py-3 text-sm text-sage-700 sm:hidden">{notice}</p>}

      {tab === 'overview' && <Overview content={content} setTab={setTab} />}
      {tab === 'site' && <SiteEditor content={content} setContent={setContent} password={password} />}
      {tab === 'texts' && <PageTextsEditor content={content} setContent={setContent} />}
      {tab === 'services' && <ServicesEditor content={content} setContent={setContent} selected={selectedService} setSelected={setSelectedService} password={password} />}
      {tab === 'blog' && <BlogEditor content={content} setContent={setContent} selected={selectedPost} setSelected={setSelectedPost} password={password} />}
      {tab === 'menus' && <MenusEditor content={content} setContent={setContent} selected={selectedMenu} setSelected={setSelectedMenu} password={password} />}
      {tab === 'faq' && <FaqEditor content={content} setContent={setContent} selected={selectedFaq} setSelected={setSelectedFaq} />}
      {tab === 'appointments' && <AppointmentsEditor content={content} setContent={setContent} siteEmail={content.site.email} />}
      {tab === 'messages' && <MessagesEditor content={content} setContent={setContent} />}
    </div></main>
  </div>;
}

function Overview({ content, setTab }: { content: AdminContent; setTab: (tab: Tab) => void }) {
  const published = content.blogPosts.filter((x) => x.status !== 'draft').length;
  const drafts = content.blogPosts.filter((x) => x.status === 'draft').length;
  const newAppointments = content.appointments.filter((x) => x.status === 'Yeni').length;
  const newMessages = content.messages.filter((x) => x.status === 'Yeni').length;
  const totalViews = content.blogPosts.reduce((sum, x) => sum + Number(x.views || 0), 0);
  const totalLikes = content.blogPosts.reduce((sum, x) => sum + Number(x.likes || 0), 0);
  const maxViews = Math.max(1, ...content.blogPosts.map((x) => Number(x.views || 0)));
  const chartPosts = [...content.blogPosts].sort((a, b) => Number(b.views || 0) - Number(a.views || 0)).slice(0, 8);
  const cards = [
    { label: 'Yayındaki Blog', value: published, sub: `${drafts} taslak`, icon: FileText, tab: 'blog' as Tab },
    { label: 'Blog Görüntülenme', value: totalViews, sub: `${totalLikes} toplam beğeni`, icon: Eye, tab: 'blog' as Tab },
    { label: 'Yeni Randevu', value: newAppointments, sub: `${content.appointments.length} toplam talep`, icon: CalendarDays, tab: 'appointments' as Tab, alert: newAppointments },
    { label: 'Yeni Mesaj', value: newMessages, sub: `${content.messages.length} toplam mesaj`, icon: Mail, tab: 'messages' as Tab, alert: newMessages },
  ];
  return <div className="space-y-6"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, sub, icon: Icon, tab, alert }) => <button key={label} onClick={() => setTab(tab)} className="relative overflow-hidden rounded-xl2 border border-cream-line bg-card/90 p-5 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"><div className="flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-clay/10 text-clay-deep"><Icon className="h-5 w-5" /></div>{alert ? <Badge count={alert} /> : <ChevronRight className="h-4 w-4 text-ink-faint" />}</div><p className="mt-5 font-display text-3xl text-ink">{value}</p><p className="mt-1 text-sm font-semibold text-ink-soft">{label}</p><p className="mt-1 text-xs text-ink-faint">{sub}</p></button>)}</div>
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]"><Panel title="Blog Performansı" description="Yazıların görüntülenme ve beğeni istatistikleri grafiksel olarak gösterilir."><div className="space-y-4">{chartPosts.length === 0 && <p className="text-sm text-ink-faint">Henüz blog yazısı yok.</p>}{chartPosts.map((post) => <div key={post.slug}><div className="mb-1.5 flex items-center justify-between gap-3 text-xs"><span className="line-clamp-1 font-medium text-ink-soft">{post.title}</span><span className="shrink-0 text-ink-faint">{post.views || 0} görüntülenme · {post.likes || 0} beğeni</span></div><div className="h-3 overflow-hidden rounded-full bg-cream-deep"><div className="h-full rounded-full bg-gradient-to-r from-sage-600 to-clay transition-all" style={{ width: `${Math.max(2, Number(post.views || 0) / maxViews * 100)}%` }} /></div></div>)}</div></Panel>
      <Panel title="Hızlı Durum" description="Yeni kayıtlar kırmızı rozetle görünür."><div className="space-y-3"><button onClick={() => setTab('messages')} className="flex w-full items-center gap-3 rounded-xl border border-ink/[0.07] p-4 text-left hover:bg-cream-deep/50"><MessageSquare className="h-5 w-5 text-clay" /><div><p className="text-sm font-semibold text-ink">Mesajlar</p><p className="text-xs text-ink-faint">İçeriği açın, görüldü veya görüşüldü işaretleyin.</p></div><Badge count={newMessages} /></button><button onClick={() => setTab('appointments')} className="flex w-full items-center gap-3 rounded-xl border border-ink/[0.07] p-4 text-left hover:bg-cream-deep/50"><CalendarDays className="h-5 w-5 text-clay" /><div><p className="text-sm font-semibold text-ink">Randevular</p><p className="text-xs text-ink-faint">Yeni randevu taleplerini yönetin.</p></div><Badge count={newAppointments} /></button></div></Panel>
    </div>
  </div>;
}

function SiteEditor({ content, setContent, password }: { content: AdminContent; setContent: (value: AdminContent) => void; password: string }) {
  const site = content.site;
  const update = (key: keyof typeof site, value: any) => setContent({ ...content, site: { ...site, [key]: value } });
  return <div className="space-y-6"><Panel title="Temel Site Bilgileri" description="Marka, iletişim ve arama motorlarında kullanılan bilgiler."><div className="grid gap-5 sm:grid-cols-2"><Field label="Diyetisyen adı" value={site.name} onChange={(v) => update('name', v)} /><Field label="Site başlığı" value={site.title} onChange={(v) => update('title', v)} /><Field label="Kısa site adı" value={site.shortTitle} onChange={(v) => update('shortTitle', v)} /><Field label="Web sitesi adresi" value={site.url} onChange={(v) => update('url', v)} /><div className="sm:col-span-2"><TextArea label="SEO / site açıklaması" value={site.description} onChange={(v) => update('description', v)} rows={4} /></div><div className="sm:col-span-2"><TextArea label="Footer açıklaması" value={site.footerDescription} onChange={(v) => update('footerDescription', v)} rows={3} /></div></div></Panel>
    <Panel title="Site Görselleri" description="Logo, hero fotoğrafı, hakkımda fotoğrafı ve tarayıcı sekmesindeki site ikonunu yükleyin."><div className="space-y-6"><ImageUploader label="Navbar logosu" value={site.logo} onChange={(v) => update('logo', v)} password={password} accept="image/png,image/svg+xml,image/webp,image/jpeg" compact /><ImageUploader label="Hero ana görseli" value={site.heroImage} onChange={(v) => update('heroImage', v)} password={password} /><ImageUploader label="Hakkımda görseli (boşsa hero kullanılır)" value={site.aboutImage} onChange={(v) => update('aboutImage', v)} password={password} /><ImageUploader label="Site ikonu / favicon" value={site.siteIcon} onChange={(v) => update('siteIcon', v)} password={password} accept="image/png,image/x-icon,image/vnd.microsoft.icon,image/svg+xml,image/webp" compact /></div></Panel>
    <Panel title="İletişim ve Sosyal Medya"><div className="grid gap-5 sm:grid-cols-2"><Field label="Telefon (görünen)" value={site.phoneDisplay} onChange={(v) => update('phoneDisplay', v)} /><Field label="Telefon bağlantısı" value={site.phone} onChange={(v) => update('phone', v)} /><Field label="WhatsApp (ülke koduyla)" value={site.whatsapp} onChange={(v) => update('whatsapp', v)} /><Field label="Admin e-posta" type="email" value={site.email} onChange={(v) => update('email', v)} /><Field label="Instagram" value={site.social.instagram} onChange={(v) => update('social', { ...site.social, instagram: v })} /><Field label="LinkedIn" value={site.social.linkedin} onChange={(v) => update('social', { ...site.social, linkedin: v })} /><Field label="TikTok" value={site.social.youtube} onChange={(v) => update('social', { ...site.social, youtube: v })} /></div></Panel>
    <Panel title="Adres ve Çalışma Saatleri"><div className="grid gap-5 sm:grid-cols-2"><Field label="Adres" value={site.address.street} onChange={(v) => update('address', { ...site.address, street: v })} /><Field label="İlçe" value={site.address.district} onChange={(v) => update('address', { ...site.address, district: v })} /><Field label="Şehir" value={site.address.city} onChange={(v) => update('address', { ...site.address, city: v })} /><Field label="Posta kodu" value={site.address.postalCode} onChange={(v) => update('address', { ...site.address, postalCode: v })} /><div className="sm:col-span-2"><TextArea label="Çalışma saatleri" value={site.workingHours.map((x) => `${x.day}|${x.hours}`).join('\n')} onChange={(v) => update('workingHours', v.split('\n').filter(Boolean).map((line) => { const [day, ...hours] = line.split('|'); return { day: day.trim(), hours: hours.join('|').trim() }; }))} hint="Her satır: Gün|Saat biçiminde olmalı. Örnek: Pazartesi – Cuma|09:00 – 19:00" /></div></div></Panel>
  </div>;
}

function PageTextsEditor({ content, setContent }: { content: AdminContent; setContent: (value: AdminContent) => void }) {
  const site: any = content.site;
  function setPath(path: string, value: any) { const clone: any = structuredClone(site); const keys = path.split('.'); let target = clone; keys.slice(0, -1).forEach((key) => { target = target[key]; }); target[keys[keys.length - 1]] = value; setContent({ ...content, site: clone }); }
  const home = site.texts.home; const about = site.texts.about;
  return <div className="space-y-6">
    <Panel title="Ana Sayfa Metinleri" description="Hero, hakkımda, danışmanlık, blog ve yaklaşım alanlarındaki tüm temel metinler."><div className="space-y-7"><SectionDivider title="Hero Alanı" /><div className="grid gap-5 sm:grid-cols-2"><Field label="Üst kısa başlık" value={home.heroEyebrow} onChange={(v) => setPath('texts.home.heroEyebrow', v)} /><Field label="Ana başlık" value={home.heroTitle} onChange={(v) => setPath('texts.home.heroTitle', v)} /><div className="sm:col-span-2"><TextArea label="Açıklama" value={home.heroDescription} onChange={(v) => setPath('texts.home.heroDescription', v)} /></div><Field label="Birincil buton" value={home.heroPrimaryButton} onChange={(v) => setPath('texts.home.heroPrimaryButton', v)} /><Field label="İkincil buton" value={home.heroSecondaryButton} onChange={(v) => setPath('texts.home.heroSecondaryButton', v)} /></div>
      <SectionDivider title="Ana Sayfa Hakkımda" /><div className="grid gap-5 sm:grid-cols-2"><Field label="Üst başlık" value={home.aboutEyebrow} onChange={(v) => setPath('texts.home.aboutEyebrow', v)} /><Field label="Başlık" value={home.aboutTitle} onChange={(v) => setPath('texts.home.aboutTitle', v)} /><div className="sm:col-span-2"><TextArea label="Açıklama" value={home.aboutDescription} onChange={(v) => setPath('texts.home.aboutDescription', v)} /></div><Field label="Buton" value={home.aboutButton} onChange={(v) => setPath('texts.home.aboutButton', v)} /></div>
      <ArrayCards title="Hakkımda bilgi kartları" items={home.aboutCards} onChange={(items) => setPath('texts.home.aboutCards', items)} fields={['title', 'text']} />
      <SectionDivider title="Danışmanlık Bölümü" /><div className="grid gap-5 sm:grid-cols-2"><Field label="Üst başlık" value={home.servicesEyebrow} onChange={(v) => setPath('texts.home.servicesEyebrow', v)} /><Field label="Başlık" value={home.servicesTitle} onChange={(v) => setPath('texts.home.servicesTitle', v)} /><div className="sm:col-span-2"><TextArea label="Açıklama" value={home.servicesDescription} onChange={(v) => setPath('texts.home.servicesDescription', v)} /></div></div>
      <SectionDivider title="Yaklaşım Bölümü" /><div className="grid gap-5 sm:grid-cols-2"><Field label="Üst başlık" value={home.approachEyebrow} onChange={(v) => setPath('texts.home.approachEyebrow', v)} /><Field label="Başlık" value={home.approachTitle} onChange={(v) => setPath('texts.home.approachTitle', v)} /><div className="sm:col-span-2"><TextArea label="Yaklaşım maddeleri" value={home.approachItems.join('\n')} onChange={(v) => setPath('texts.home.approachItems', v.split('\n').filter(Boolean))} hint="Her madde ayrı satırda." /></div></div>
      <SectionDivider title="Blog Önizleme" /><div className="grid gap-5 sm:grid-cols-2"><Field label="Üst başlık" value={home.blogEyebrow} onChange={(v) => setPath('texts.home.blogEyebrow', v)} /><Field label="Başlık" value={home.blogTitle} onChange={(v) => setPath('texts.home.blogTitle', v)} /><TextArea label="Açıklama" value={home.blogDescription} onChange={(v) => setPath('texts.home.blogDescription', v)} /><Field label="Buton" value={home.blogButton} onChange={(v) => setPath('texts.home.blogButton', v)} /></div>
    </div></Panel>

    <Panel title="Hakkımda Sayfası" description="Sayfadaki başlıklar, açıklamalar, zaman çizelgesi ve çalışma yöntemi kartları."><div className="space-y-7"><div className="grid gap-5 sm:grid-cols-2"><Field label="Üst başlık" value={about.eyebrow} onChange={(v) => setPath('texts.about.eyebrow', v)} /><Field label="Ana başlık" value={about.title} onChange={(v) => setPath('texts.about.title', v)} /><div className="sm:col-span-2"><TextArea label="Giriş yazısı" value={about.intro} onChange={(v) => setPath('texts.about.intro', v)} rows={5} /></div><Field label="Buton" value={about.button} onChange={(v) => setPath('texts.about.button', v)} /><Field label="Zaman çizelgesi üst başlığı" value={about.timelineEyebrow} onChange={(v) => setPath('texts.about.timelineEyebrow', v)} /><Field label="Zaman çizelgesi başlığı" value={about.timelineTitle} onChange={(v) => setPath('texts.about.timelineTitle', v)} /><Field label="Çalışma yöntemi üst başlığı" value={about.methodEyebrow} onChange={(v) => setPath('texts.about.methodEyebrow', v)} /><Field label="Çalışma yöntemi başlığı" value={about.methodTitle} onChange={(v) => setPath('texts.about.methodTitle', v)} /></div><TimelineEditor items={about.timeline} onChange={(items) => setPath('texts.about.timeline', items)} /><ArrayCards title="Çalışma yöntemi kartları" items={about.methods} onChange={(items) => setPath('texts.about.methods', items)} fields={['title', 'text']} /><div className="grid gap-5 sm:grid-cols-2"><Field label="Eğitim kartı başlığı" value={about.educationTitle} onChange={(v) => setPath('texts.about.educationTitle', v)} /><TextArea label="Eğitim kartı yazısı" value={about.educationText} onChange={(v) => setPath('texts.about.educationText', v)} /><Field label="Sertifika kartı başlığı" value={about.certificatesTitle} onChange={(v) => setPath('texts.about.certificatesTitle', v)} /><TextArea label="Sertifika kartı yazısı" value={about.certificatesText} onChange={(v) => setPath('texts.about.certificatesText', v)} /></div></div></Panel>

    <Panel title="Alt Sayfa Başlıkları" description="Danışmanlıklar, blog, menüler, SSS, iletişim ve randevu sayfalarının üst metinleri."><div className="space-y-7">{[
      ['servicesPage', 'Danışmanlıklar Sayfası'], ['blogPage', 'Blog Sayfası'], ['menusPage', 'Menüler Sayfası'], ['faqPage', 'Sık Sorulan Sorular Sayfası'], ['contactPage', 'İletişim Sayfası'], ['appointmentPage', 'Randevu Sayfası'],
    ].map(([key, title]) => { const page = site.texts[key]; return <div key={key}><SectionDivider title={title} /><div className="mt-4 grid gap-5 sm:grid-cols-2"><Field label="Üst başlık" value={page.eyebrow} onChange={(v) => setPath(`texts.${key}.eyebrow`, v)} /><Field label="Başlık" value={page.title} onChange={(v) => setPath(`texts.${key}.title`, v)} /><div className="sm:col-span-2"><TextArea label="Açıklama" value={page.description} onChange={(v) => setPath(`texts.${key}.description`, v)} /></div>{key === 'blogPage' || key === 'menusPage' ? <><Field label="Arama alanı metni" value={page.searchPlaceholder} onChange={(v) => setPath(`texts.${key}.searchPlaceholder`, v)} /><Field label="Kategori butonu" value={page.categoryButton} onChange={(v) => setPath(`texts.${key}.categoryButton`, v)} /><Field label="Filtrele butonu" value={page.filterButton} onChange={(v) => setPath(`texts.${key}.filterButton`, v)} /></> : null}{key === 'faqPage' ? <Field label="Alt buton" value={page.button} onChange={(v) => setPath(`texts.${key}.button`, v)} /> : null}{key === 'contactPage' ? <><Field label="İletişim bilgileri başlığı" value={page.infoTitle} onChange={(v) => setPath(`texts.${key}.infoTitle`, v)} /><Field label="Çalışma saatleri başlığı" value={page.hoursTitle} onChange={(v) => setPath(`texts.${key}.hoursTitle`, v)} /><Field label="Sosyal medya başlığı" value={page.socialTitle} onChange={(v) => setPath(`texts.${key}.socialTitle`, v)} /><Field label="Harita alanı metni" value={page.mapText} onChange={(v) => setPath(`texts.${key}.mapText`, v)} /></> : null}</div></div>; })}</div></Panel>
  </div>;
}

function ArrayCards({ title, items, onChange, fields }: { title: string; items: any[]; onChange: (items: any[]) => void; fields: string[] }) {
  const update = (index: number, field: string, value: string) => onChange(items.map((item, i) => i === index ? { ...item, [field]: value } : item));
  return <div><div className="mb-3 flex items-center justify-between"><h4 className="text-sm font-semibold text-ink">{title}</h4><button type="button" onClick={() => onChange([...items, Object.fromEntries(fields.map((field) => [field, '']))])} className="inline-flex items-center gap-1 text-xs font-semibold text-clay"><Plus className="h-3.5 w-3.5" />Ekle</button></div><div className="grid gap-3 sm:grid-cols-2">{items.map((item, index) => <div key={index} className="relative rounded-xl border border-ink/[0.07] bg-cream/40 p-4"><button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))} className="absolute right-2 top-2 rounded-lg p-1.5 text-red-500 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button><div className="space-y-3 pr-7">{fields.map((field) => field === 'description' || field === 'text' ? <TextArea key={field} label={field === 'description' ? 'Açıklama' : 'Metin'} value={item[field] || ''} onChange={(v) => update(index, field, v)} rows={3} /> : <Field key={field} label="Başlık" value={item[field] || ''} onChange={(v) => update(index, field, v)} />)}</div></div>)}</div></div>;
}
function TimelineEditor({ items, onChange }: { items: any[]; onChange: (items: any[]) => void }) { const update = (index: number, field: string, value: string) => onChange(items.map((item, i) => i === index ? { ...item, [field]: value } : item)); return <div><div className="mb-3 flex items-center justify-between"><h4 className="text-sm font-semibold text-ink">Zaman çizelgesi</h4><button type="button" onClick={() => onChange([...items, { year: '', title: '', text: '' }])} className="inline-flex items-center gap-1 text-xs font-semibold text-clay"><Plus className="h-3.5 w-3.5" />Ekle</button></div><div className="space-y-3">{items.map((item, index) => <div key={index} className="grid gap-3 rounded-xl border border-ink/[0.07] bg-cream/40 p-4 sm:grid-cols-[120px_1fr_1.3fr_auto]"><Field label="Yıl" value={item.year} onChange={(v) => update(index, 'year', v)} /><Field label="Başlık" value={item.title} onChange={(v) => update(index, 'title', v)} /><Field label="Açıklama" value={item.text} onChange={(v) => update(index, 'text', v)} /><button type="button" aria-label="Sil" onClick={() => onChange(items.filter((_, i) => i !== index))} className="mt-6 h-10 rounded-lg border border-red-200 px-3 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div>)}</div></div>; }

function ListShell<T>({ items, selected, setSelected, onAdd, onDelete, renderLabel, children }: { items: T[]; selected: number; setSelected: (index: number) => void; onAdd: () => void; onDelete: () => void; renderLabel: (item: T) => string; children: React.ReactNode }) {
  return <div className="grid gap-6 xl:grid-cols-[290px_1fr]"><div className="rounded-xl2 border border-cream-line bg-card/90 p-4 shadow-card"><button onClick={onAdd} className="flex w-full items-center justify-center gap-2 rounded-full bg-clay px-4 py-3 text-sm font-semibold text-porcelain hover:bg-clay-deep"><Plus className="h-4 w-4" />Yeni Ekle</button><div className="mt-4 max-h-[70vh] space-y-1 overflow-y-auto pr-1">{items.map((item, index) => <button key={index} onClick={() => setSelected(index)} className={`w-full rounded-xl px-3 py-3 text-left text-sm transition ${selected === index ? 'bg-sage-100 font-semibold text-ink' : 'text-ink-soft hover:bg-cream-deep/60'}`}>{renderLabel(item)}</button>)}</div></div><Panel title={items[selected] ? renderLabel(items[selected]) : 'İçerik'} action={items.length ? <button onClick={onDelete} className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" />Sil</button> : null}>{children}</Panel></div>;
}

function ServicesEditor({ content, setContent, selected, setSelected, password }: { content: AdminContent; setContent: (v: AdminContent) => void; selected: number; setSelected: (v: number) => void; password: string }) {
  const item = content.services[selected];
  const update = (patch: Partial<Service>) => { const list = [...content.services]; list[selected] = { ...item, ...patch }; setContent({ ...content, services: list }); };
  const add = () => { const next: Service = { slug: 'yeni-danismanlik', title: 'Yeni Danışmanlık', shortDescription: '', description: '', icon: 'HeartPulse', duration: '45 dakika', format: 'Online', highlights: [], image: '' }; setContent({ ...content, services: [...content.services, next] }); setSelected(content.services.length); };
  const remove = () => { const list = content.services.filter((_, i) => i !== selected); setContent({ ...content, services: list }); setSelected(Math.max(0, selected - 1)); };
  return <ListShell items={content.services} selected={selected} setSelected={setSelected} onAdd={add} onDelete={remove} renderLabel={(x) => x.title}>{item && <div className="grid gap-5 sm:grid-cols-2"><Field label="Başlık" value={item.title} onChange={(v) => update({ title: v, slug: slugify(v) })} /><Field label="Slug" value={item.slug} onChange={(v) => update({ slug: slugify(v) })} /><div className="sm:col-span-2"><TextArea label="Kart kısa açıklaması" value={item.shortDescription} onChange={(v) => update({ shortDescription: v })} rows={3} /></div><div className="sm:col-span-2"><TextArea label="Detaylı açıklama" value={item.description} onChange={(v) => update({ description: v })} rows={7} /></div><Field label="Süre" value={item.duration} onChange={(v) => update({ duration: v })} /><Field label="Format" value={item.format} onChange={(v) => update({ format: v })} /><SelectField label="İkon" value={item.icon} onChange={(v) => update({ icon: v })} options={['Video', 'Users', 'TrendingDown', 'Dumbbell', 'HeartPulse', 'Baby', 'Sprout', 'Building2']} /><div className="sm:col-span-2"><ImageUploader label="Danışmanlık görseli" value={item.image} onChange={(v) => update({ image: v })} password={password} /></div><div className="sm:col-span-2"><TextArea label="Öne çıkanlar" value={item.highlights.join('\n')} onChange={(v) => update({ highlights: v.split('\n').filter(Boolean) })} hint="Her özellik ayrı satırda." /></div></div>}</ListShell>;
}

function BlogEditor({ content, setContent, selected, setSelected, password }: { content: AdminContent; setContent: (v: AdminContent) => void; selected: number; setSelected: (v: number) => void; password: string }) {
  const item = content.blogPosts[selected];
  const update = (patch: Partial<BlogPost>) => { const list = [...content.blogPosts]; list[selected] = { ...item, ...patch }; setContent({ ...content, blogPosts: list }); };
  const add = () => { const next: BlogPost = { slug: 'yeni-blog-yazisi', title: 'Yeni Blog Yazısı', category: 'Sağlıklı Beslenme', excerpt: '', content: [], contentHtml: '<p>Yazınıza buradan başlayın.</p>', coverImage: '', readMinutes: 5, publishedAt: new Date().toISOString().slice(0, 10), author: 'Mısra Çakır', status: 'draft', views: 0, likes: 0 }; setContent({ ...content, blogPosts: [next, ...content.blogPosts] }); setSelected(0); };
  const remove = () => { const list = content.blogPosts.filter((_, i) => i !== selected); setContent({ ...content, blogPosts: list }); setSelected(Math.max(0, selected - 1)); };
  return <ListShell items={content.blogPosts} selected={selected} setSelected={setSelected} onAdd={add} onDelete={remove} renderLabel={(x) => `${x.status === 'draft' ? '● Taslak · ' : ''}${x.title}`}>{item && <div className="space-y-6"><div className="grid gap-5 sm:grid-cols-2"><Field label="Başlık" value={item.title} onChange={(v) => update({ title: v, slug: slugify(v) })} /><Field label="Slug" value={item.slug} onChange={(v) => update({ slug: slugify(v) })} /><Field label="Kategori" value={item.category} onChange={(v) => update({ category: v })} /><Field label="Yazar" value={item.author} onChange={(v) => update({ author: v })} /><Field label="Yayın tarihi" value={item.publishedAt} type="date" onChange={(v) => update({ publishedAt: v })} /><Field label="Okuma süresi (dk)" value={item.readMinutes} type="number" onChange={(v) => update({ readMinutes: Number(v) || 1 })} /><SelectField label="Yayın durumu" value={item.status || 'published'} onChange={(v) => update({ status: v as BlogPost['status'] })} options={[{ value: 'draft', label: 'Taslak — sitede görünmez' }, { value: 'published', label: 'Yayında' }]} /><div className="grid grid-cols-2 gap-3"><Field label="Görüntülenme" value={item.views || 0} readOnly /><Field label="Beğeni" value={item.likes || 0} readOnly /></div><div className="sm:col-span-2"><ImageUploader label="Kapak görseli" value={item.coverImage} onChange={(v) => update({ coverImage: v })} password={password} /></div><div className="sm:col-span-2"><TextArea label="Kart ve SEO özeti" value={item.excerpt} onChange={(v) => update({ excerpt: v })} rows={4} /></div></div><div><span className={labelClass}>Detaylı Yazı Editörü</span><p className="mb-3 text-xs text-ink-faint">Font, yazı büyüklüğü, bağlantı, içindekiler, hizalama, kalın, italik, altı ve üstü çizili biçimlendirmeleri araç çubuğundan uygulayabilirsiniz.</p><RichTextEditor value={item.contentHtml || htmlFromParagraphs(item.content)} onChange={(value) => update({ contentHtml: value })} /></div></div>}</ListShell>;
}

function MenusEditor({ content, setContent, selected, setSelected, password }: { content: AdminContent; setContent: (v: AdminContent) => void; selected: number; setSelected: (v: number) => void; password: string }) {
  const item = content.menus[selected]; const update = (patch: Partial<MenuPlan>) => { const list = [...content.menus]; list[selected] = { ...item, ...patch }; setContent({ ...content, menus: list }); };
  const add = () => { const next: MenuPlan = { slug: 'yeni-menu', title: 'Yeni Menü', categories: ['Dengeli Beslenme'], durationDays: 1, mealsPerDay: 3, calories: 'Kişiye göre', image: '', summary: '', days: [{ day: '1. Gün', meals: [{ name: 'Kahvaltı', description: '' }] }], notes: [] }; setContent({ ...content, menus: [...content.menus, next] }); setSelected(content.menus.length); };
  const remove = () => { const list = content.menus.filter((_, i) => i !== selected); setContent({ ...content, menus: list }); setSelected(Math.max(0, selected - 1)); };
  return <ListShell items={content.menus} selected={selected} setSelected={setSelected} onAdd={add} onDelete={remove} renderLabel={(x) => x.title}>{item && <div className="grid gap-5 sm:grid-cols-2"><Field label="Başlık" value={item.title} onChange={(v) => update({ title: v, slug: slugify(v) })} /><Field label="Slug" value={item.slug} onChange={(v) => update({ slug: slugify(v) })} /><Field label="Kategoriler" value={item.categories.join(', ')} onChange={(v) => update({ categories: v.split(',').map((x) => x.trim()).filter(Boolean) as MenuPlan['categories'] })} /><Field label="Kaç günlük" value={item.durationDays} type="number" onChange={(v) => update({ durationDays: Number(v) || 1 })} /><Field label="Günlük öğün" value={item.mealsPerDay} type="number" onChange={(v) => update({ mealsPerDay: Number(v) || 1 })} /><Field label="Enerji bilgisi" value={item.calories} onChange={(v) => update({ calories: v })} /><div className="sm:col-span-2"><ImageUploader label="Menü görseli" value={item.image} onChange={(v) => update({ image: v })} password={password} /></div><div className="sm:col-span-2"><TextArea label="Kısa açıklama" value={item.summary} onChange={(v) => update({ summary: v })} rows={4} /></div><div className="sm:col-span-2"><TextArea label="Gün ve öğün planı (JSON)" value={JSON.stringify(item.days, null, 2)} onChange={(v) => { try { update({ days: JSON.parse(v) }); } catch { } }} rows={18} hint={'Örnek: [{"day":"1. Gün","meals":[{"name":"Kahvaltı","description":"..."}]}]'} /></div><div className="sm:col-span-2"><TextArea label="Önemli notlar" value={item.notes.join('\n')} onChange={(v) => update({ notes: v.split('\n').filter(Boolean) })} hint="Her not ayrı satırda." /></div></div>}</ListShell>;
}

function FaqEditor({ content, setContent, selected, setSelected }: { content: AdminContent; setContent: (v: AdminContent) => void; selected: number; setSelected: (v: number) => void }) {
  const item = content.faq[selected]; const update = (patch: Partial<FaqItem>) => { const list = [...content.faq]; list[selected] = { ...item, ...patch }; setContent({ ...content, faq: list }); };
  const add = () => { setContent({ ...content, faq: [...content.faq, { question: 'Yeni soru', answer: '' }] }); setSelected(content.faq.length); };
  const remove = () => { setContent({ ...content, faq: content.faq.filter((_, i) => i !== selected) }); setSelected(Math.max(0, selected - 1)); };
  return <ListShell items={content.faq} selected={selected} setSelected={setSelected} onAdd={add} onDelete={remove} renderLabel={(x) => x.question}>{item && <div className="space-y-5"><Field label="Soru" value={item.question} onChange={(v) => update({ question: v })} /><TextArea label="Cevap" value={item.answer} onChange={(v) => update({ answer: v })} rows={10} /></div>}</ListShell>;
}

function AppointmentsEditor({ content, setContent, siteEmail }: { content: AdminContent; setContent: (v: AdminContent) => void; siteEmail: string }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const update = (id: string, patch: Partial<AppointmentRecord>) => setContent({ ...content, appointments: content.appointments.map((x) => x.id === id ? { ...x, ...patch } : x) });
  const remove = (id: string) => setContent({ ...content, appointments: content.appointments.filter((x) => x.id !== id) });
  function toggle(item: AppointmentRecord) { const opening = openId !== item.id; setOpenId(opening ? item.id : null); if (opening && item.status === 'Yeni') update(item.id, { status: 'Görüldü' }); }
  return <Panel title="Randevu Talepleri" description="Randevuyu açınca yeni kayıt otomatik olarak Görüldü durumuna geçer. Durumu Görüşüldü veya Tamamlandı olarak değiştirebilirsiniz."><div className="space-y-3">{content.appointments.length === 0 && <p className="text-sm text-ink-faint">Henüz randevu talebi yok.</p>}{content.appointments.map((item) => { const open = openId === item.id; return <div key={item.id} className={`rounded-xl border transition ${item.status === 'Yeni' ? 'border-red-200 bg-red-50/40' : 'border-ink/[0.07] bg-white'}`}><button type="button" onClick={() => toggle(item)} className="flex w-full items-center gap-4 p-4 text-left sm:p-5"><span className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.status === 'Yeni' ? 'bg-red-600' : 'bg-sage-300'}`} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-ink">{item.name}</h3><span className="rounded-full bg-cream-deep px-2.5 py-1 text-[10px] font-semibold text-ink-faint">{item.status}</span></div><p className="mt-1 truncate text-xs text-ink-faint">{item.service} · {item.date} {item.time} · {new Date(item.createdAt).toLocaleString('tr-TR')}</p></div><ChevronDown className={`h-4 w-4 shrink-0 text-clay transition ${open ? 'rotate-180' : ''}`} /></button>{open && <div className="border-t border-ink/[0.07] px-4 pb-5 pt-4 sm:px-5"><div className="grid gap-3 text-sm text-ink-soft sm:grid-cols-2"><p><strong>Danışmanlık:</strong> {item.service}</p><p><strong>Format:</strong> {item.format}</p><p><strong>Tarih:</strong> {item.date} {item.time}</p><p><strong>Telefon:</strong> {item.phone}</p><p><strong>E-posta:</strong> {item.email}</p>{item.note && <p className="sm:col-span-2 rounded-xl bg-cream-deep p-4"><strong>Not:</strong> {item.note}</p>}</div><div className="mt-5 flex flex-wrap items-end gap-3"><div className="min-w-[210px]"><SelectField label="Durum" value={item.status} onChange={(v) => update(item.id, { status: v as AppointmentRecord['status'] })} options={['Yeni', 'Görüldü', 'İletişime Geçildi', 'Görüşüldü', 'Tamamlandı']} /></div><a href={`mailto:${item.email}?subject=${encodeURIComponent('Randevu talebiniz hakkında')}&body=${encodeURIComponent(`Merhaba ${item.name},\n\nRandevu talebiniz hakkında size dönüş sağlıyorum.\n\nMısra Çakır`)}`} className="inline-flex h-11 items-center gap-2 rounded-full border border-clay/25 px-4 text-xs font-semibold text-clay-deep hover:bg-clay hover:text-cream"><Mail className="h-4 w-4" />Mail ile Dön</a>{item.phone && <a href={`https://wa.me/${phoneDigits(item.phone)}?text=${encodeURIComponent(`Merhaba ${item.name}, randevu talebiniz hakkında dönüş sağlıyorum.`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full border border-sage-300 px-4 text-xs font-semibold text-sage-700 hover:bg-sage-700 hover:text-cream"><Phone className="h-4 w-4" />WhatsApp ile Dön</a>}<button onClick={() => remove(item.id)} className="ml-auto inline-flex h-11 items-center gap-2 rounded-full border border-red-200 px-4 text-xs font-semibold text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" />Sil</button></div></div>}</div>; })}</div></Panel>;
}

function MessagesEditor({ content, setContent }: { content: AdminContent; setContent: (v: AdminContent) => void }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const update = (id: string, patch: Partial<ContactRecord>) => setContent({ ...content, messages: content.messages.map((x) => x.id === id ? { ...x, ...patch } : x) });
  const remove = (id: string) => setContent({ ...content, messages: content.messages.filter((x) => x.id !== id) });
  function toggle(item: ContactRecord) { const opening = openId !== item.id; setOpenId(opening ? item.id : null); if (opening && item.status === 'Yeni') update(item.id, { status: 'Görüldü' }); }
  return <Panel title="İletişim Mesajları" description="Mesaj kartına tıklayarak içeriği açın. Mail veya WhatsApp üzerinden doğrudan dönüş yapabilirsiniz."><div className="space-y-3">{content.messages.length === 0 && <p className="text-sm text-ink-faint">Henüz mesaj yok.</p>}{content.messages.map((item) => { const open = openId === item.id; return <div key={item.id} className={`rounded-xl border transition ${item.status === 'Yeni' ? 'border-red-200 bg-red-50/40' : 'border-ink/[0.07] bg-white'}`}><button type="button" onClick={() => toggle(item)} className="flex w-full items-center gap-4 p-4 text-left sm:p-5"><span className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.status === 'Yeni' ? 'bg-red-600' : 'bg-sage-300'}`} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-ink">{item.name}</h3><span className="rounded-full bg-cream-deep px-2.5 py-1 text-[10px] font-semibold text-ink-faint">{item.status}</span></div><p className="mt-1 truncate text-xs text-ink-faint">{item.message} · {new Date(item.createdAt).toLocaleString('tr-TR')}</p></div><ChevronDown className={`h-4 w-4 shrink-0 text-clay transition ${open ? 'rotate-180' : ''}`} /></button>{open && <div className="border-t border-ink/[0.07] px-4 pb-5 pt-4 sm:px-5"><p className="text-xs text-ink-faint">{item.email}{item.phone ? ` · ${item.phone}` : ''}</p><p className="mt-3 whitespace-pre-wrap rounded-xl bg-cream-deep p-5 text-sm leading-relaxed text-ink-soft">{item.message}</p><div className="mt-5 flex flex-wrap items-end gap-3"><div className="min-w-[190px]"><SelectField label="Durum" value={item.status} onChange={(v) => update(item.id, { status: v as ContactRecord['status'] })} options={['Yeni', 'Görüldü', 'Yanıtlandı', 'Görüşüldü']} /></div><a href={`mailto:${item.email}?subject=${encodeURIComponent('Mesajınız hakkında')}&body=${encodeURIComponent(`Merhaba ${item.name},\n\nMesajınız için teşekkür ederim.\n\nMısra Çakır`)}`} className="inline-flex h-11 items-center gap-2 rounded-full border border-clay/25 px-4 text-xs font-semibold text-clay-deep hover:bg-clay hover:text-cream"><Mail className="h-4 w-4" />Mail ile Dön</a>{item.phone && <a href={`https://wa.me/${phoneDigits(item.phone)}?text=${encodeURIComponent(`Merhaba ${item.name}, iletişim formundan gönderdiğiniz mesaj için dönüş sağlıyorum.`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full border border-sage-300 px-4 text-xs font-semibold text-sage-700 hover:bg-sage-700 hover:text-cream"><Phone className="h-4 w-4" />WhatsApp ile Dön</a>}<button onClick={() => remove(item.id)} className="ml-auto inline-flex h-11 items-center gap-2 rounded-full border border-red-200 px-4 text-xs font-semibold text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" />Sil</button></div></div>}</div>; })}</div></Panel>;
}
