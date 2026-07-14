'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { navLinks } from '@/data/site';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function Navbar({ siteName, logo }: { siteName: string; logo?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled ? 'bg-cream/80 shadow-[0_1px_0_0_rgba(10,51,35,0.06)] backdrop-blur-md' : 'bg-transparent'
      )}
    >
      <nav className="container-site flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-ink" aria-label={`Dyt. ${siteName} ana sayfa`}>
          {logo ? <img src={logo} alt="" className="h-11 w-11 shrink-0 object-contain" /> : null}
          <span className="font-brand text-[1.35rem] font-normal tracking-[-0.02em] sm:text-2xl">
            Dyt. {siteName}
          </span>
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'relative text-sm font-medium text-ink-soft transition-colors hover:text-ink',
                  'after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-clay after:transition-all after:duration-300 hover:after:w-full',
                  pathname === link.href && 'text-ink after:w-full'
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button href="/randevu" size="md">
            Randevu Al
          </Button>
        </div>

        <button
          aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 text-ink lg:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-[82%] max-w-sm flex-col bg-cream px-8 py-8 shadow-2xl lg:hidden"
          >
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
                {logo ? <img src={logo} alt="" className="h-10 w-10 object-contain" /> : null}
                <span className="font-brand text-xl">Dyt. {siteName}</span>
              </Link>
              <button
                aria-label="Menüyü kapat"
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ul className="mt-12 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="block border-b border-ink/[0.06] py-4 font-display text-2xl text-ink"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="mt-auto pt-8">
              <Button href="/randevu" className="w-full" size="lg">
                Randevu Al
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
