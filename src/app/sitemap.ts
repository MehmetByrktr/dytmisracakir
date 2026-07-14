import type { MetadataRoute } from 'next';
import { getContent } from '@/lib/content-store';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { site, services, blogPosts, menus } = await getContent();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || site.url;
  const staticRoutes = ['', '/hakkimda', '/danismanliklar', '/blog', '/menuler', '/sss', '/randevu', '/iletisim', '/kvkk', '/gizlilik-politikasi', '/cerez-politikasi', '/kullanim-kosullari'].map((route) => ({
    url: `${baseUrl}${route}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: route === '' ? 1 : 0.7,
  }));
  const serviceRoutes = services.map((item) => ({ url: `${baseUrl}/danismanliklar/${item.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 }));
  const blogRoutes = blogPosts.filter((item) => item.status !== 'draft').map((item) => ({ url: `${baseUrl}/blog/${item.slug}`, lastModified: new Date(item.publishedAt), changeFrequency: 'monthly' as const, priority: 0.5 }));
  const menuRoutes = menus.map((item) => ({ url: `${baseUrl}/menuler/${item.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 }));
  return [...staticRoutes, ...serviceRoutes, ...blogRoutes, ...menuRoutes];
}
