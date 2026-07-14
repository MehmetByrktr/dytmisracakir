import type { Metadata } from 'next';
import SectionHeading from '@/components/ui/SectionHeading';
import MenuFilter from '@/components/menus/MenuFilter';
import { getContent } from '@/lib/content-store';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Menüler', description: 'Farklı hedeflere uygun örnek beslenme menülerini inceleyin.' };
export default async function MenusPage() { const { menus, site } = await getContent(); const text = site.texts.menusPage; return <div className="pb-24 pt-36 sm:pt-44"><div className="container-site"><SectionHeading eyebrow={text.eyebrow} title={text.title} description={text.description} className="mb-14" /><MenuFilter menus={menus} labels={text} /></div></div>; }
