import { PhoneCall, ClipboardList, NotebookPen, RefreshCcw } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import { site as defaultSite } from '@/data/site';
const icons = { PhoneCall, ClipboardList, NotebookPen, RefreshCcw };
export default function ProcessTimeline({ siteData = defaultSite }: { siteData?: typeof defaultSite }) {
  const text = siteData.texts.home;
  return <section className="section-pad"><div className="container-site"><SectionHeading eyebrow={text.processEyebrow} title={text.processTitle} description={text.processDescription} align="center" className="mx-auto mb-16 max-w-2xl" />
    <div className="relative"><div className="rota-line absolute left-0 right-0 top-6 hidden h-px lg:block" /><ol className="grid gap-10 lg:grid-cols-4 lg:gap-6">{text.processSteps.map((step, i) => { const Icon = icons[step.icon as keyof typeof icons] || RefreshCcw; return <RevealOnScroll key={`${step.title}-${i}`} delay={i * 0.12} as="li"><div className="relative flex flex-col items-start lg:items-center lg:text-center"><div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-clay/30 bg-cream text-clay shadow-card"><Icon className="h-5 w-5" /></div><span className="mt-4 font-mono text-xs text-sage-600">{String(i + 1).padStart(2, '0')}</span><h3 className="mt-1 font-display text-lg text-ink">{step.title}</h3><p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">{step.description}</p></div></RevealOnScroll>; })}</ol></div>
  </div></section>;
}
