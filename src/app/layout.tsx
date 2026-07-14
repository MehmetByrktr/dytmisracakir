import type { Metadata } from 'next';
import './globals.css';
import SiteChrome from '@/components/layout/SiteChrome';
import { site } from '@/data/site';
import { localBusinessSchema } from '@/lib/schema';
import { getContent } from '@/lib/content-store';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || site.url),
  title: { default: site.title, template: `%s | ${site.shortTitle}` },
  description: site.description,
  keywords: ['diyetisyen', 'beslenme danışmanlığı', 'online diyetisyen', 'kilo yönetimi', 'İstanbul diyetisyen'],
  openGraph: {
    type: 'website', locale: site.locale, url: process.env.NEXT_PUBLIC_SITE_URL || site.url, siteName: site.shortTitle,
    title: site.title, description: site.description,
    images: [{ url: '/images/og/og-cover.jpg', width: 1200, height: 630, alt: site.shortTitle }],
  },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description, images: ['/images/og/og-cover.jpg'] },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { site: managedSite } = await getContent();
  return (
    <html lang="tr">
      <head>{managedSite.siteIcon ? <link rel="icon" href={managedSite.siteIcon} /> : null}</head>
      <body className="bg-noise">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }} />
        <SiteChrome siteData={managedSite}>{children}</SiteChrome>
      </body>
    </html>
  );
}
