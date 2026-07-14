'use client';

import { motion } from 'framer-motion';

interface SplitHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  delay?: number;
}

export default function SplitHeading({ text, as = 'h2', className, delay = 0 }: SplitHeadingProps) {
  const words = text.split(' ');
  const Component = motion[as];

  return (
    <Component className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-1 pr-[0.28em] align-bottom">
          <motion.span
            className="inline-block"
            initial={false}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: delay + i * 0.045, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}
