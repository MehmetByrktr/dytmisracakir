import type { Metadata } from 'next';
import SectionHeading from '@/components/ui/SectionHeading';
import BlogListing from '@/components/blog/BlogListing';
import { getContent } from '@/lib/content-store';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Blog', description: 'Beslenme bilimi, kilo yönetimi, tarifler ve daha fazlası hakkında güvenilir yazılar.' };
export default async function BlogPage() { const { blogPosts, site } = await getContent(); const text = site.texts.blogPage; const published = blogPosts.filter((post) => post.status !== 'draft'); return <div className="pb-24 pt-36 sm:pt-44"><div className="container-site"><SectionHeading eyebrow={text.eyebrow} title={text.title} description={text.description} className="mb-14" /><BlogListing posts={published} labels={text} /></div></div>; }
