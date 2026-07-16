import type { Metadata } from 'next';
import SectionHeading from '@/components/ui/SectionHeading';
import MenuFilter from '@/components/menus/MenuFilter';
import { getContent } from '@/lib/content-store';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Tarifler',
  description: 'Farklı hedeflere uygun örnek beslenme tariflerini inceleyin.',
};

function renameMenuTerms(value: string) {
  return value.replaceAll('Menüler', 'Tarifler').replaceAll('menüler', 'tarifler');
}

export default async function MenusPage() {
  const { menus, site } = await getContent();
  const publishedMenus = menus.filter((item) => item.status !== 'draft');
  const savedText = site.texts.menusPage;
  const text = {
    ...savedText,
    eyebrow: renameMenuTerms(savedText.eyebrow),
    title: renameMenuTerms(savedText.title),
    description: renameMenuTerms(savedText.description),
    searchPlaceholder: renameMenuTerms(savedText.searchPlaceholder),
  };

  return (
    <div className="pb-24 pt-36 sm:pt-44">
      <div className="container-site">
        <SectionHeading eyebrow={text.eyebrow} title={text.title} description={text.description} className="mb-14" />
        <MenuFilter menus={publishedMenus} labels={text} />
      </div>
    </div>
  );
}
