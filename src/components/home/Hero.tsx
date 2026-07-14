'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Leaf, Apple, Carrot, Ruler, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import { site as defaultSite } from '@/data/site';

export default function Hero({ siteData = defaultSite }: { siteData?: typeof defaultSite }) {
  const site = siteData;
  const text = site.texts.home;
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 60]);
  const decorY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -40]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setPointer({ x: (e.clientX - rect.left) / rect.width - 0.5, y: (e.clientY - rect.top) / rect.height - 0.5 });
  }

  return (
    <section ref={sectionRef} onMouseMove={handleMouseMove} className="relative overflow-hidden pb-20 pt-36 sm:pt-44 lg:pb-28">
      <div className="container-site grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative">
          <RevealOnScroll><span className="eyebrow inline-flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" /> {text.heroEyebrow}</span></RevealOnScroll>
          <h1 className="mt-5 text-balance font-display text-[2.5rem] font-medium leading-[1.08] text-ink sm:text-5xl lg:text-6xl">
            {text.heroTitle}
          </h1>
          <RevealOnScroll delay={0.4}><p className="mt-6 max-w-lg text-balance text-base leading-relaxed text-ink-soft sm:text-lg">{text.heroDescription}</p></RevealOnScroll>
          <RevealOnScroll delay={0.5}><div className="mt-9 flex flex-wrap items-center gap-4">
            <Button href="/randevu" size="lg" icon={<ArrowRight className="h-4 w-4" />}>{text.heroPrimaryButton}</Button>
            <Button href="/danismanliklar" variant="secondary" size="lg">{text.heroSecondaryButton}</Button>
          </div></RevealOnScroll>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-md lg:max-w-none">
          <motion.div style={{ y: decorY }} className="absolute -left-6 -top-6 z-0 h-24 w-24 rounded-full bg-sage-100 sm:h-32 sm:w-32" aria-hidden />
          <motion.div style={{ y: imageY, x: shouldReduceMotion ? 0 : pointer.x * 10 }} className="relative z-10 h-full w-full overflow-hidden rounded-blob border border-ink/[0.06] shadow-soft">
            {site.heroImage ? (
              <Image src={site.heroImage} alt={`${site.name} profesyonel portresi`} fill priority sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sage-100 via-cream-deep to-clay-soft/40 font-display text-sm text-ink-faint"><span className="px-10 text-center">Diyetisyenin profesyonel fotoğrafı için görsel alanı<br />(1000×1250px önerilir)</span></div>
            )}
          </motion.div>
          {[{ Icon: Leaf, pos: 'left-[-10%] top-[8%]' }, { Icon: Apple, pos: 'right-[-6%] top-[18%]' }, { Icon: Carrot, pos: 'left-[-8%] bottom-[16%]' }, { Icon: Ruler, pos: 'right-[2%] bottom-[-4%]' }].map(({ Icon, pos }, i) => (
            <motion.div key={i} style={{ x: shouldReduceMotion ? 0 : pointer.x * (10 + i * 4) * -1, y: shouldReduceMotion ? 0 : pointer.y * (10 + i * 4) * -1 }} className={`absolute z-20 ${pos} flex h-12 w-12 items-center justify-center rounded-full border border-ink/[0.06] bg-white/80 shadow-card backdrop-blur-sm animate-floaty`}>
              <Icon className="h-5 w-5 text-sage-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
