import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Clock } from 'lucide-react';
import { getContent } from '@/lib/content-store';
import { formatDate } from '@/lib/utils';
import { articleSchema } from '@/lib/schema';
import ShareButtons from '@/components/blog/ShareButtons';
import BlogCard from '@/components/blog/BlogCard';
import BlogEngagement from '@/components/blog/BlogEngagement';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const post = (await getContent()).blogPosts.find((item) => item.slug === slug && item.status !== 'draft'); if (!post) return {}; return { title: post.title, description: post.excerpt, openGraph: { images: post.coverImage ? [{ url: post.coverImage }] : [] } }; }
function escapeHtml(value: string) { return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { blogPosts, site } = await getContent();
  const published = blogPosts.filter((item) => item.status !== 'draft');
  const post = published.find((item) => item.slug === slug); if (!post) notFound();
  const related = published.filter((item) => item.slug !== post.slug && item.category === post.category).slice(0, 3);
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || site.url}/blog/${post.slug}`;
  const html = post.contentHtml?.trim() || post.content.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');
  return <div className="pb-24 pt-32 sm:pt-40"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema(post)) }} /><div className="container-site"><nav aria-label="breadcrumb" className="mb-8 flex items-center gap-1.5 text-xs text-ink-faint"><Link href="/" className="hover:text-clay">Ana Sayfa</Link><ChevronRight className="h-3 w-3" /><Link href="/blog" className="hover:text-clay">Blog</Link><ChevronRight className="h-3 w-3" /><span className="line-clamp-1 text-ink-soft">{post.title}</span></nav><div className="mx-auto max-w-3xl"><RevealOnScroll><span className="eyebrow">{post.category}</span><h1 className="mt-3 text-balance font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">{post.title}</h1><div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-b border-ink/[0.06] pb-6"><div className="flex flex-wrap items-center gap-3 text-sm text-ink-faint"><span>{post.author}</span><span>·</span><span>{formatDate(post.publishedAt)}</span><span>·</span><span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readMinutes} dk</span></div><div className="flex flex-wrap items-center gap-3"><BlogEngagement slug={post.slug} initialViews={post.views} initialLikes={post.likes} /><ShareButtons title={post.title} url={url} /></div></div></RevealOnScroll>
  <div className="mt-8 aspect-[16/9] overflow-hidden rounded-xl2 bg-sage-50">{post.coverImage ? <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-wide text-sage-600">Kapak görseli</div>}</div>
  <article className="blog-rich-content mt-10" dangerouslySetInnerHTML={{ __html: html }} />
</div></div>{related.length > 0 && <div className="container-site mt-24"><h2 className="font-display text-2xl text-ink">Benzer yazılar</h2><div className="mt-6 grid gap-5 sm:grid-cols-3">{related.map((item) => <BlogCard key={item.slug} post={item} />)}</div></div>}</div>;
}
