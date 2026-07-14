import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Clock, Users, Flame, Lightbulb } from 'lucide-react';
import { recipes, getRecipeBySlug } from '@/data/recipes';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import RecipeCard from '@/components/recipes/RecipeCard';

export function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const recipe = getRecipeBySlug((await params).slug);
  if (!recipe) return {};
  return { title: recipe.title, description: recipe.summary };
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const recipe = getRecipeBySlug((await params).slug);
  if (!recipe) notFound();

  const others = recipes.filter((r) => r.slug !== recipe.slug).slice(0, 3);

  return (
    <div className="pb-24 pt-32 sm:pt-40">
      <div className="container-site">
        <nav aria-label="breadcrumb" className="mb-8 flex items-center gap-1.5 text-xs text-ink-faint">
          <Link href="/" className="hover:text-clay">Ana Sayfa</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/tarifler" className="hover:text-clay">Tarifler</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-ink-soft">{recipe.title}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <RevealOnScroll>
            <div className="aspect-[4/3] overflow-hidden rounded-xl2 bg-clay-soft/20">
              <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-wide text-clay-deep">
                Tarif görseli
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {recipe.categories.map((c) => (
                <span key={c} className="rounded-full bg-sage-50 px-3 py-1 font-mono text-[11px] text-sage-700">
                  {c}
                </span>
              ))}
            </div>
            <h1 className="mt-5 text-balance font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
              {recipe.title}
            </h1>
            <p className="mt-4 leading-relaxed text-ink-soft">{recipe.summary}</p>

            <div className="mt-6 grid grid-cols-3 gap-3 border-y border-ink/[0.06] py-5">
              <div className="text-center">
                <Clock className="mx-auto h-4 w-4 text-sage-600" />
                <div className="mt-1 font-mono text-sm text-ink">{recipe.prepMinutes} dk</div>
                <div className="text-[11px] text-ink-faint">Hazırlık</div>
              </div>
              <div className="text-center">
                <Users className="mx-auto h-4 w-4 text-sage-600" />
                <div className="mt-1 font-mono text-sm text-ink">{recipe.servings} kişilik</div>
                <div className="text-[11px] text-ink-faint">Porsiyon</div>
              </div>
              <div className="text-center">
                <Flame className="mx-auto h-4 w-4 text-sage-600" />
                <div className="mt-1 font-mono text-sm text-ink">{recipe.calories} kcal</div>
                <div className="text-[11px] text-ink-faint">Enerji</div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="font-display text-lg text-ink">Besin Değerleri (porsiyon başına)</h2>
              <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {recipe.nutrition.map((n) => (
                  <div key={n.label} className="paper-card p-3 text-center">
                    <dt className="text-[11px] text-ink-faint">{n.label}</dt>
                    <dd className="mt-1 font-mono text-sm text-ink">{n.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <div>
              <h2 className="font-display text-xl text-ink">Malzemeler</h2>
              <ul className="mt-4 space-y-2.5">
                {recipe.ingredients.map((ing) => (
                  <li key={ing} className="flex items-start gap-3 text-sm text-ink-soft">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                    {ing}
                  </li>
                ))}
              </ul>

              <h2 className="mt-9 font-display text-xl text-ink">Hazırlanışı</h2>
              <ol className="mt-4 space-y-4">
                {recipe.steps.map((step, i) => (
                  <li key={i} className="flex gap-4 text-sm leading-relaxed text-ink-soft">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-50 font-mono text-xs text-sage-700">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>

              <div className="mt-9 rounded-xl2 border border-sage-300/40 bg-sage-50/60 p-6">
                <h2 className="flex items-center gap-2 font-display text-lg text-ink">
                  <Lightbulb className="h-4 w-4 text-sage-700" /> Alternatif Malzeme Önerileri
                </h2>
                <ul className="mt-3 space-y-2">
                  {recipe.substitutions.map((s) => (
                    <li key={s} className="text-sm text-ink-soft">
                      • {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      <div className="container-site mt-24">
        <h2 className="font-display text-2xl text-ink">Diğer tarifler</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {others.map((r) => (
            <RecipeCard key={r.slug} recipe={r} />
          ))}
        </div>
      </div>
    </div>
  );
}
