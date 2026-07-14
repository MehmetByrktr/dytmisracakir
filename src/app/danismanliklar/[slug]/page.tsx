import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, Clock, MapPin, ArrowRight, ChevronRight } from 'lucide-react';
import { getContent } from '@/lib/content-store';
import { iconMap } from '@/lib/icon-map';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import Button from '@/components/ui/Button';

export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const service = (await getContent()).services.find((item) => item.slug === slug); return service ? { title: service.title, description: service.shortDescription } : {}; }

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { services } = await getContent(); const service = services.find((item) => item.slug === slug); if (!service) notFound();
  const Icon = iconMap[service.icon]; const others = services.filter((item) => item.slug !== service.slug).slice(0, 3);
  return <div className="pb-24 pt-32 sm:pt-40"><div className="container-site">
    <nav aria-label="breadcrumb" className="mb-8 flex items-center gap-1.5 text-xs text-ink-faint"><Link href="/" className="hover:text-clay">Ana Sayfa</Link><ChevronRight className="h-3 w-3" /><Link href="/danismanliklar" className="hover:text-clay">Danışmanlıklar</Link><ChevronRight className="h-3 w-3" /><span className="text-ink-soft">{service.title}</span></nav>
    <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]"><div><RevealOnScroll><div className="flex h-14 w-14 items-center justify-center rounded-full bg-clay/10">{Icon && <Icon className="h-6 w-6 text-clay" />}</div><h1 className="mt-6 text-balance font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">{service.title}</h1><p className="mt-5 max-w-2xl text-balance leading-relaxed text-ink-soft">{service.description}</p></RevealOnScroll><RevealOnScroll delay={0.15}><div className="mt-10"><h2 className="font-display text-xl text-ink">Bu danışmanlıkta neler var</h2><ul className="mt-5 space-y-3">{service.highlights.map((h) => <li key={h} className="flex items-start gap-3 text-sm text-ink-soft"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-50"><Check className="h-3 w-3 text-sage-700" /></span>{h}</li>)}</ul></div></RevealOnScroll></div>
    <RevealOnScroll delay={0.1}><div className="paper-card sticky top-28 p-7"><div className="relative aspect-video overflow-hidden rounded-lg bg-sage-50">{service.image ? <Image src={service.image} alt={service.title} fill sizes="(max-width: 1024px) 100vw, 36vw" className="object-cover" /> : <div className="flex h-full items-center justify-center px-6 text-center font-mono text-[11px] uppercase tracking-wide text-sage-600">Görsel alanı</div>}</div><dl className="mt-6 space-y-4 text-sm"><div className="flex items-center justify-between border-b border-ink/[0.06] pb-4"><dt className="flex items-center gap-2 text-ink-faint"><Clock className="h-4 w-4" /> Süre</dt><dd className="font-medium text-ink">{service.duration}</dd></div><div className="flex items-center justify-between"><dt className="flex items-center gap-2 text-ink-faint"><MapPin className="h-4 w-4" /> Format</dt><dd className="font-medium text-ink">{service.format}</dd></div></dl><Button href="/randevu" className="mt-7 w-full" icon={<ArrowRight className="h-4 w-4" />}>Bu Danışmanlık İçin Randevu Al</Button></div></RevealOnScroll></div>
  </div>{others.length > 0 && <div className="container-site mt-24"><h2 className="font-display text-2xl text-ink">Diğer danışmanlıklar</h2><div className="mt-6 grid gap-5 sm:grid-cols-3">{others.map((item) => { const OtherIcon = iconMap[item.icon]; return <Link key={item.slug} href={`/danismanliklar/${item.slug}`} className="paper-card group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-50">{OtherIcon && <OtherIcon className="h-4 w-4 text-sage-700" />}</div><h3 className="mt-4 font-display text-base text-ink">{item.title}</h3></Link>; })}</div></div>}</div>;
}
