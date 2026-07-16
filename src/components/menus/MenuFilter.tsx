'use client';

import { FormEvent, useMemo, useState } from 'react';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import type { MenuPlan } from '@/types';
import MenuCard from './MenuCard';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

export default function MenuFilter({ menus, labels }: { menus: MenuPlan[]; labels?: { searchPlaceholder?: string; filterButton?: string; categoryButton?: string } }) {
  const categories = useMemo(() => ['Tümü', ...Array.from(new Set(menus.flatMap((menu) => menu.categories))).sort((a, b) => a.localeCompare(b, 'tr'))], [menus]);
  const [queryDraft, setQueryDraft] = useState('');
  const [categoryDraft, setCategoryDraft] = useState('Tümü');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Tümü');
  const filtered = useMemo(() => { const normalized = query.toLocaleLowerCase('tr-TR').trim(); return menus.filter((menu) => (category === 'Tümü' || menu.categories.includes(category as never)) && (!normalized || `${menu.title} ${menu.summary} ${menu.categories.join(' ')}`.toLocaleLowerCase('tr-TR').includes(normalized))); }, [category, menus, query]);
  function submit(e: FormEvent) { e.preventDefault(); setQuery(queryDraft); setCategory(categoryDraft); }
  function clear() { setQuery(''); setQueryDraft(''); setCategory('Tümü'); setCategoryDraft('Tümü'); }
  const hasFilter = Boolean(query || category !== 'Tümü');
  return <div>
    <form onSubmit={submit} className="mb-10 rounded-xl2 border border-cream-line bg-card/80 p-3 shadow-card backdrop-blur-sm sm:p-4"><div className="grid gap-3 md:grid-cols-[1fr_240px_auto]">
      <label className="relative block"><span className="sr-only">Tariflerde ara</span><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-clay" /><input value={queryDraft} onChange={(e) => setQueryDraft(e.target.value)} placeholder={labels?.searchPlaceholder || 'Tariflerde ara...'} className="h-12 w-full rounded-full border border-ink/10 bg-cream/70 pl-11 pr-4 text-sm text-ink outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/10" /></label>
      <label className="relative block"><span className="sr-only">Kategori seç</span><select value={categoryDraft} onChange={(e) => setCategoryDraft(e.target.value)} className="h-12 w-full appearance-none rounded-full border border-ink/10 bg-cream/70 px-5 pr-11 text-sm font-medium text-ink outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/10"><option value="Tümü">{labels?.categoryButton || 'Kategori'}: Tümü</option>{categories.filter((x) => x !== 'Tümü').map((item) => <option key={item} value={item}>{item}</option>)}</select><ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-clay" /></label>
      <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-clay px-6 text-sm font-semibold text-cream transition hover:bg-clay-deep"><SlidersHorizontal className="h-4 w-4" />{labels?.filterButton || 'Filtrele'}</button>
    </div>{hasFilter && <div className="mt-3 flex items-center justify-between px-2 text-xs text-ink-faint"><span>{filtered.length} tarif bulundu</span><button type="button" onClick={clear} className="inline-flex items-center gap-1 font-semibold text-clay-deep hover:text-clay"><X className="h-3.5 w-3.5" />Filtreyi temizle</button></div>}</form>
    {filtered.length === 0 ? <p className="py-16 text-center text-sm text-ink-faint">Aramanıza uygun tarif bulunamadı.</p> : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((menu, i) => <RevealOnScroll key={menu.slug} delay={(i % 3) * 0.08}><MenuCard menu={menu} /></RevealOnScroll>)}</div>}
  </div>;
}
