import type { BlogPost } from '@/types';
import SectionHeading from '@/components/ui/SectionHeading';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import BlogCard from '@/components/blog/BlogCard';
import Button from '@/components/ui/Button';
import { site as defaultSite } from '@/data/site';
export default function BlogPreview({ posts, siteData = defaultSite }: { posts: BlogPost[]; siteData?: typeof defaultSite }) { const text = siteData.texts.home; const latest = posts.filter((post) => post.status !== 'draft').sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 3); return <section className="section-pad bg-cream"><div className="container-site"><div className="mb-14 flex flex-wrap items-end justify-between gap-6"><SectionHeading eyebrow={text.blogEyebrow} title={text.blogTitle} description={text.blogDescription} /><Button href="/blog" variant="secondary">{text.blogButton}</Button></div><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{latest.map((post, i) => <RevealOnScroll key={post.slug} delay={i * 0.1}><BlogCard post={post} /></RevealOnScroll>)}</div></div></section>; }
