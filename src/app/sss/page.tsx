import type { Metadata } from 'next';
import { faqSchema } from '@/lib/schema';
import SectionHeading from '@/components/ui/SectionHeading';
import Accordion from '@/components/faq/Accordion';
import Button from '@/components/ui/Button';
import { getContent } from '@/lib/content-store';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Sık Sorulan Sorular', description: 'Danışmanlık süreci, randevu, ödeme ve daha fazlası hakkında merak edilenler.' };
export default async function FaqPage() { const { faq, site } = await getContent(); const text = site.texts.faqPage; return <div className="pb-24 pt-36 sm:pt-44"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faq)) }} /><div className="container-site"><SectionHeading eyebrow={text.eyebrow} title={text.title} description={text.description} align="center" className="mx-auto mb-14 max-w-xl" /><div className="mx-auto max-w-2xl"><Accordion items={faq} /><div className="mt-10 text-center"><Button href="/iletisim" variant="secondary">{text.button}</Button></div></div></div></div>; }
