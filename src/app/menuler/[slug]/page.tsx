import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarDays, ChevronRight, Info, Utensils } from 'lucide-react';
import MenuCard from '@/components/menus/MenuCard';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import { getContent } from '@/lib/content-store';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const menu = (await getContent()).menus.find((item) => item.slug === slug);
  if (!menu) return {};
  return { title: menu.title, description: menu.summary };
}

export default async function MenuDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { menus } = await getContent();
  const menu = menus.find((item) => item.slug === slug);
  if (!menu) notFound();
  const others = menus.filter((item) => item.slug !== menu.slug).slice(0, 3);

  return (
    <div className="pb-24 pt-32 sm:pt-40">
      <div className="container-site">
        <nav aria-label="breadcrumb" className="mb-8 flex items-center gap-1.5 text-xs text-ink-faint">
          <Link href="/" className="hover:text-clay">Ana Sayfa</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/menuler" className="hover:text-clay">Menüler</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-ink-soft">{menu.title}</span>
        </nav>

        <div className="grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <RevealOnScroll className="min-w-0">
            <div className="paper-card overflow-hidden p-6">
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-sage-50 font-mono text-xs uppercase tracking-wide text-sage-600">{menu.image ? <Image src={menu.image} alt={menu.title} fill sizes="(max-width: 1024px) 100vw, 36vw" className="object-cover" /> : 'Menü görseli'}</div>
              <div className="mt-6 flex flex-wrap gap-2">
                {menu.categories.map((category) => (
                  <span key={category} className="rounded-full bg-clay/10 px-3 py-1 text-xs font-medium text-clay-deep">
                    {category}
                  </span>
                ))}
              </div>
              <h1 className="mt-5 font-display text-3xl font-medium leading-tight text-ink">{menu.title}</h1>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">{menu.summary}</p>
              <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-cream-deep p-4">
                  <dt className="flex items-center gap-2 text-xs text-ink-faint"><CalendarDays className="h-4 w-4" /> Süre</dt>
                  <dd className="mt-2 font-medium text-ink">{menu.durationDays} gün</dd>
                </div>
                <div className="rounded-xl bg-cream-deep p-4">
                  <dt className="flex items-center gap-2 text-xs text-ink-faint"><Utensils className="h-4 w-4" /> Öğün</dt>
                  <dd className="mt-2 font-medium text-ink">Günde {menu.mealsPerDay}</dd>
                </div>
              </dl>
              <div className="mt-3 rounded-xl border border-ink/[0.06] p-4 text-sm">
                <span className="text-ink-faint">Enerji:</span> <span className="font-medium text-ink">{menu.calories}</span>
              </div>
            </div>
          </RevealOnScroll>

          <div className="space-y-8">
            {menu.days.map((day, dayIndex) => (
              <RevealOnScroll key={`${day.day}-${dayIndex}`} delay={dayIndex * 0.08}>
                <section className="paper-card p-6 sm:p-8">
                  <span className="eyebrow">Gün Planı</span>
                  <h2 className="mt-2 font-display text-2xl text-ink">{day.day}</h2>
                  <div className="mt-6 space-y-4">
                    {day.meals.map((meal, mealIndex) => (
                      <div key={`${meal.name}-${mealIndex}`} className="grid gap-1 border-b border-ink/[0.06] pb-4 last:border-0 last:pb-0 sm:grid-cols-[150px_1fr]">
                        <h3 className="font-medium text-ink">{meal.name}</h3>
                        <p className="text-sm leading-relaxed text-ink-soft">{meal.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </RevealOnScroll>
            ))}

            {menu.notes.length > 0 && (
              <div className="rounded-xl2 border border-sage-300/40 bg-sage-50 p-6">
                <h2 className="flex items-center gap-2 font-display text-xl text-ink"><Info className="h-5 w-5 text-sage-700" /> Önemli notlar</h2>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-soft">
                  {menu.notes.map((note) => <li key={note}>• {note}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {others.length > 0 && (
        <div className="container-site mt-24">
          <h2 className="font-display text-2xl text-ink">Diğer menüler</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {others.map((item) => <MenuCard key={item.slug} menu={item} />)}
          </div>
        </div>
      )}
    </div>
  );
}
