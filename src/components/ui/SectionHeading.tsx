import SplitHeading from './SplitHeading';
import RevealOnScroll from './RevealOnScroll';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      <RevealOnScroll>
        <span className="eyebrow">{eyebrow}</span>
      </RevealOnScroll>
      <SplitHeading
        text={title}
        as="h2"
        className="mt-3 text-balance font-display text-4xl font-medium leading-[1.08] text-illusion sm:text-5xl lg:text-[3.35rem]"
      />
      {description && (
        <RevealOnScroll delay={0.15}>
          <p className="mt-5 text-balance text-base leading-relaxed text-ink-soft">{description}</p>
        </RevealOnScroll>
      )}
    </div>
  );
}
