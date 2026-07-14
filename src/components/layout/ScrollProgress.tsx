'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const markerTop = useTransform(scrollYProgress, (v) => `${v * 100}%`);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-4 top-1/2 z-40 hidden h-40 w-4 -translate-y-1/2 lg:block"
    >
      <div className="rota-line-v absolute left-1/2 top-0 h-full w-px -translate-x-1/2" />
      <motion.div
        style={{ scaleY, originY: 0 }}
        className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-clay"
      />
      <motion.div
        style={{ top: markerTop }}
        className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay shadow-[0_0_0_4px_rgba(252,248,248,1)]"
      />
    </div>
  );
}
