import Hero from '@/components/home/Hero';
import AboutPreview from '@/components/home/AboutPreview';
import ServicesGrid from '@/components/home/ServicesGrid';
import ApproachSection from '@/components/home/ApproachSection';
import BlogPreview from '@/components/home/BlogPreview';
import { getContent } from '@/lib/content-store';
export const dynamic = 'force-dynamic';
export default async function HomePage() { const { services, blogPosts, site } = await getContent(); return <div className="home-page"><Hero siteData={site} /><AboutPreview siteData={site} /><ServicesGrid services={services} siteData={site} /><BlogPreview posts={blogPosts} siteData={site} /><ApproachSection siteData={site} /></div>; }
