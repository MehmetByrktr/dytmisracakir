import { GraduationCap, Award, Stethoscope, HeartHandshake } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import Button from '@/components/ui/Button';
import { site as defaultSite } from '@/data/site';

const icons = { GraduationCap, Award, Stethoscope, HeartHandshake };

export default function AboutPreview({ siteData = defaultSite }: { siteData?: typeof defaultSite }) {
  const text = siteData.texts.home;
  return <section className="section-pad relative"><div className="container-site grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
    <div><SectionHeading eyebrow={text.aboutEyebrow} title={text.aboutTitle} description={text.aboutDescription} /><RevealOnScroll delay={0.2} className="mt-8"><Button href="/hakkimda" variant="secondary">{text.aboutButton}</Button></RevealOnScroll></div>
    <div className="grid gap-5 sm:grid-cols-2">{text.aboutCards.map((card, i) => { const Icon = icons[card.icon as keyof typeof icons] || HeartHandshake; return <RevealOnScroll key={`${card.title}-${i}`} delay={i * 0.08}><div className="paper-card h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"><Icon className="h-6 w-6 text-sage-700" /><h3 className="mt-4 font-display text-lg text-ink">{card.title}</h3><p className="mt-2 text-sm leading-relaxed text-ink-soft">{card.text}</p></div></RevealOnScroll>; })}</div>
  </div></section>;
}
