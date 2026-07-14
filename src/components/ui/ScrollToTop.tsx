'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Sayfanın başına dön"
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-clay/25 bg-cream/95 text-clay-deep shadow-card backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-clay hover:text-cream hover:shadow-card-hover"
        >
          <ArrowUp className="h-4.5 w-4.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
