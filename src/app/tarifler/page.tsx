import type { Metadata } from 'next';
import { recipes } from '@/data/recipes';
import SectionHeading from '@/components/ui/SectionHeading';
import RecipeFilter from '@/components/recipes/RecipeFilter';

export const metadata: Metadata = {
  title: 'Tarifler',
  description: 'Kahvaltıdan tatlıya, sağlıklı ve besin değerleri paylaşılmış tarifler.',
};

export default function RecipesPage() {
  return (
    <div className="pb-24 pt-36 sm:pt-44">
      <div className="container-site">
        <SectionHeading
          eyebrow="Tarifler"
          title="Sağlıklı ve pratik tarifler"
          description="Her tarifte hazırlama süresi, porsiyon ve yaklaşık enerji değerini bulabilirsiniz."
          className="mb-14"
        />
        <RecipeFilter recipes={recipes} />
      </div>
    </div>
  );
}
