import type { Metadata } from 'next';
import { GraduationCap, Award, Stethoscope, HeartHandshake, MessageSquareText } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import Button from '@/components/ui/Button';
import { getContent } from '@/lib/content-store';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Hakkımda', description: 'Eğitim, çalışma yaklaşımı ve danışmanlık yöntemi hakkında detaylı bilgi.' };
const methodIcons = { MessageSquareText, Stethoscope, HeartHandshake };

export default async function AboutPage() {
  const { site } = await getContent();
  const text = site.texts.about;
  const portrait = site.aboutImage || site.heroImage;
  return <div className="bg-cream [&>section]:!bg-cream">
    <section className="pb-16 pt-36 sm:pt-44"><div className="container-site grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <RevealOnScroll><div className="aspect-[4/5] w-full max-w-sm overflow-hidden rounded-blob border border-ink/[0.06] bg-gradient-to-br from-sage-100 via-cream-deep to-clay-soft/30 shadow-soft">{portrait ? <img src={portrait} alt={`${site.name} portresi`} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center px-8 text-center font-display text-sm text-ink-faint">Diyetisyenin profesyonel fotoğrafı için görsel alanı</div>}</div></RevealOnScroll>
      <div><span className="eyebrow">{text.eyebrow}</span><h1 className="mt-3 text-balance font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">{text.title}</h1><p className="mt-6 max-w-xl text-balance leading-relaxed text-ink-soft">{text.intro}</p><div className="mt-8"><Button href="/randevu">{text.button}</Button></div></div>
    </div></section>

    <section className="section-pad bg-cream-deep"><div className="container-site"><SectionHeading eyebrow={text.timelineEyebrow} title={text.timelineTitle} align="center" className="mx-auto mb-16 max-w-xl" /><ol className="relative mx-auto max-w-2xl"><div className="rota-line-v absolute left-[7px] top-2 h-[calc(100%-16px)] w-px sm:left-1/2" />{text.timeline.map((item, i) => <RevealOnScroll key={`${item.year}-${i}`} delay={i * 0.08} as="li"><div className={`relative mb-10 flex flex-col gap-1 pl-8 sm:mb-14 sm:w-1/2 sm:pl-0 sm:pr-10 sm:text-right ${i % 2 === 1 ? 'sm:ml-auto sm:pl-10 sm:pr-0 sm:text-left' : ''}`}><span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-cream bg-clay sm:left-1/2 sm:-translate-x-1/2" /><span className="font-mono text-xs text-sage-600">{item.year}</span><h3 className="font-display text-lg text-ink">{item.title}</h3><p className="text-sm leading-relaxed text-ink-soft">{item.text}</p></div></RevealOnScroll>)}</ol></div></section>

    <section className="section-pad"><div className="container-site"><SectionHeading eyebrow={text.methodEyebrow} title={text.methodTitle} align="center" className="mx-auto mb-14 max-w-xl" /><div className="grid gap-6 sm:grid-cols-3">{text.methods.map((item, i) => { const Icon = methodIcons[item.icon as keyof typeof methodIcons] || HeartHandshake; return <RevealOnScroll key={`${item.title}-${i}`} delay={i * 0.1}><div className="paper-card h-full p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage-50"><Icon className="h-5 w-5 text-sage-700" /></div><h3 className="mt-4 font-display text-lg text-ink">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.text}</p></div></RevealOnScroll>; })}</div></div></section>

    <section className="section-pad bg-sage-100"><div className="container-site grid gap-6 sm:grid-cols-2"><RevealOnScroll><div className="paper-card flex h-full items-start gap-4 p-7"><GraduationCap className="mt-1 h-6 w-6 shrink-0 text-clay" /><div><h3 className="font-display text-lg text-ink">{text.educationTitle}</h3><p className="mt-2 text-sm leading-relaxed text-ink-soft">{text.educationText}</p></div></div></RevealOnScroll><RevealOnScroll delay={0.1}><div className="paper-card flex h-full items-start gap-4 p-7"><Award className="mt-1 h-6 w-6 shrink-0 text-clay" /><div><h3 className="font-display text-lg text-ink">{text.certificatesTitle}</h3><p className="mt-2 text-sm leading-relaxed text-ink-soft">{text.certificatesText}</p></div></div></RevealOnScroll></div></section>
  </div>;
}
