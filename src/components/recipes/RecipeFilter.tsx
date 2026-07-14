'use client';

import { useMemo, useState } from 'react';
import { Recipe, RecipeCategory } from '@/types';
import RecipeCard from './RecipeCard';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import { cn } from '@/lib/utils';

const filters: RecipeCategory[] = [
  'Kahvaltı',
  'Ana Öğün',
  'Ara Öğün',
  'Tatlı',
  'Vegan',
  'Glutensiz',
  'Yüksek Proteinli',
];

export default function RecipeFilter({ recipes }: { recipes: Recipe[] }) {
  const [active, setActive] = useState<RecipeCategory[]>([]);

  function toggle(cat: RecipeCategory) {
    setActive((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  }

  const filtered = useMemo(() => {
    if (active.length === 0) return recipes;
    return recipes.filter((r) => active.every((cat) => r.categories.includes(cat)));
  }, [active, recipes]);

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => toggle(f)}
            aria-pressed={active.includes(f)}
            className={cn(
              'rounded-full border px-4 py-2 text-xs font-medium transition-colors duration-200',
              active.includes(f)
                ? 'border-sage-600 bg-sage-600 text-cream'
                : 'border-ink/10 text-ink-soft hover:border-sage-600/50 hover:text-sage-700'
            )}
          >
            {f}
          </button>
        ))}
        {active.length > 0 && (
          <button
            onClick={() => setActive([])}
            className="rounded-full px-4 py-2 text-xs font-medium text-clay underline-offset-2 hover:underline"
          >
            Filtreleri temizle
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink-faint">Bu filtrelere uyan tarif bulunamadı.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((recipe, i) => (
            <RevealOnScroll key={recipe.slug} delay={(i % 3) * 0.08}>
              <RecipeCard recipe={recipe} />
            </RevealOnScroll>
          ))}
        </div>
      )}
    </div>
  );
}
