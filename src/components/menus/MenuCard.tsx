import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, Utensils, ArrowUpRight } from 'lucide-react';
import { MenuPlan } from '@/types';

export default function MenuCard({ menu }: { menu: MenuPlan }) {
  return (
    <Link
      href={`/menuler/${menu.slug}`}
      className="paper-card group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
    >
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-sage-50">
        {menu.image ? <Image src={menu.image} alt={menu.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.04]" /> : <span className="px-6 text-center font-mono text-[11px] uppercase tracking-wide text-sage-600">Menü görseli</span>}
        <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-clay-deep">
          {menu.categories[0]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg leading-snug text-ink transition-colors group-hover:text-clay-deep">
          {menu.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{menu.summary}</p>
        <div className="mt-5 flex flex-wrap gap-4 text-xs text-ink-faint">
          <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {menu.durationDays} gün</span>
          <span className="flex items-center gap-1"><Utensils className="h-3.5 w-3.5" /> Günde {menu.mealsPerDay} öğün</span>
        </div>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-clay">
          Menüyü İncele
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
      </div>
    </Link>
  );
}
