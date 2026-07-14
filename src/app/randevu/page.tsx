import type { Metadata } from 'next';
import SectionHeading from '@/components/ui/SectionHeading';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import AppointmentForm from '@/components/forms/AppointmentForm';
import { getContent } from '@/lib/content-store';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Randevu Al', description: 'Online veya yüz yüze danışmanlık randevunuzu birkaç dakikada oluşturun.' };
export default async function AppointmentPage() { const { services, site } = await getContent(); const text = site.texts.appointmentPage; return <div className="pb-24 pt-36 sm:pt-44"><div className="container-site"><SectionHeading eyebrow={text.eyebrow} title={text.title} description={text.description} align="center" className="mx-auto mb-12 max-w-xl" /><RevealOnScroll className="mx-auto max-w-2xl"><AppointmentForm services={services} /></RevealOnScroll></div></div>; }
