'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ButtonProps {
  href?: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
  icon?: ReactNode;
}

export default function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  onClick,
  icon,
}: ButtonProps) {
  const base =
    'group relative inline-flex items-center justify-center gap-2 rounded-full font-body font-semibold transition-transform duration-300 ease-out will-change-transform overflow-hidden focus-visible:outline-2';

  const sizes = {
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const variants = {
    primary: 'bg-clay text-porcelain shadow-soft hover:bg-clay-deep hover:text-porcelain hover:scale-[1.03] active:scale-[0.98]',
    secondary:
      'bg-transparent text-ink border border-ink/20 hover:border-sage-600 hover:text-sage-700 hover:scale-[1.02]',
    ghost: 'bg-sage-50 text-sage-700 hover:bg-sage-100 hover:scale-[1.02]',
  };

  const content = (
    <>
      {variant === 'primary' && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {icon}
      </span>
    </>
  );

  const classes = cn(base, sizes[size], variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
