'use client';

import { useEffect, useRef, useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonials } from '@/data/testimonials';
import SectionHeading from '@/components/ui/SectionHeading';
import { useReducedMotion } from 'framer-motion';

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;
    const track = trackRef.current;
    if (!track) return;

    const interval = setInterval(() => {
      if (paused || !track) return;
      const cardWidth = track.firstElementChild?.clientWidth ?? 320;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 10;
      track.scrollTo({
        left: atEnd ? 0 : track.scrollLeft + cardWidth + 20,
        behavior: 'smooth',
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [paused, shouldReduceMotion]);

  function scrollBy(dir: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.firstElementChild?.clientWidth ?? 320;
    track.scrollBy({ left: dir * (cardWidth + 20), behavior: 'smooth' });
  }

  return (
    <section className="section-pad">
      <div className="container-site">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Danışan Yorumları"
            title="Danışanlarımın deneyimleri"
            description="Süreçlerini bizimle paylaşmayı kabul eden danışanlarımdan gerçek yorumlar."
          />
          <div className="flex gap-2">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Önceki yorum"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 text-ink transition-colors hover:border-clay hover:text-clay"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Sonraki yorum"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 text-ink transition-colors hover:border-clay hover:text-clay"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="paper-card w-[300px] shrink-0 snap-start p-6 transition-shadow duration-300 hover:shadow-card-hover sm:w-[360px]"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < t.rating ? 'fill-clay text-clay' : 'fill-ink/10 text-ink/10'}`}
                  />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">“{t.quote}”</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 font-mono text-xs text-sage-700">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink">{t.name}</div>
                  <div className="text-xs text-ink-faint">{t.service}</div>
                </div>
                {t.beforeAfter && (
                  <span className="ml-auto rounded-full bg-clay/10 px-3 py-1 font-mono text-[11px] text-clay-deep">
                    {t.beforeAfter}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
