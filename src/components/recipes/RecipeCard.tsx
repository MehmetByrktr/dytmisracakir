import Link from 'next/link';
import { Clock, Users, Flame } from 'lucide-react';
import { Recipe } from '@/types';

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      href={`/tarifler/${recipe.slug}`}
      className="paper-card group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
    >
      <div className="relative flex aspect-[4/3] items-center justify-center bg-clay-soft/20">
        <span className="px-6 text-center font-mono text-[11px] uppercase tracking-wide text-clay-deep">
          Tarif görseli
        </span>
        <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-sage-700">
          {recipe.categories[0]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg leading-snug text-ink transition-colors group-hover:text-clay-deep">
          {recipe.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{recipe.summary}</p>
        <div className="mt-5 flex items-center gap-4 text-xs text-ink-faint">
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {recipe.prepMinutes} dk</span>
          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {recipe.servings} kişilik</span>
          <span className="flex items-center gap-1"><Flame className="h-3.5 w-3.5" /> {recipe.calories} kcal</span>
        </div>
      </div>
    </Link>
  );
}
