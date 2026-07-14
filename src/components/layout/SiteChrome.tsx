'use client';

import { usePathname } from 'next/navigation';
import type { site as defaultSite } from '@/data/site';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EmailButton from '@/components/ui/EmailButton';
import ScrollToTop from '@/components/ui/ScrollToTop';

type SiteData = typeof defaultSite;

export default function SiteChrome({ siteData, children }: { siteData: SiteData; children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <main id="ana-icerik" className="admin-main min-h-screen bg-cream">{children}</main>;
  }

  return (
    <>
      <a
        href="#ana-icerik"
        className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-porcelain transition-transform focus:translate-y-0"
      >
        İçeriğe geç
      </a>
      <Navbar siteName={siteData.name} logo={siteData.logo} />
      <main id="ana-icerik" className="site-main bg-cream">{children}</main>
      <Footer siteData={siteData} />
      <EmailButton email={siteData.email} instagram={siteData.social.instagram} tiktok={siteData.social.youtube} />
      <ScrollToTop />
    </>
  );
}
