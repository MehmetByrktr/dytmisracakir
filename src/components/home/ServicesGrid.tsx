import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Service } from '@/types';
import { iconMap } from '@/lib/icon-map';
import SectionHeading from '@/components/ui/SectionHeading';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import { site as defaultSite } from '@/data/site';

export default function ServicesGrid({ services, siteData = defaultSite }: { services: Service[]; siteData?: typeof defaultSite }) {
  const text = siteData.texts.home;
  return <section className="section-pad bg-cream"><div className="container-site">
    <SectionHeading eyebrow={text.servicesEyebrow} title={text.servicesTitle} description={text.servicesDescription} className="mb-14" />
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{services.map((service, i) => { const Icon = iconMap[service.icon]; return <RevealOnScroll key={service.slug} delay={(i % 3) * 0.08}><Link href={`/danismanliklar/${service.slug}`} className="paper-card group flex h-full flex-col !border-clay/20 !bg-[#EFE6F5] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:!border-clay/35 hover:shadow-card-hover">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-clay/10 transition-transform duration-300 group-hover:scale-110">{Icon && <Icon className="h-5 w-5 text-clay" />}</div>
      <h3 className="mt-5 font-display text-xl text-illusion">{service.title}</h3><p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{service.shortDescription}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-clay-deep">Detayları İncele<ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
    </Link></RevealOnScroll>; })}</div>
  </div></section>;
}
