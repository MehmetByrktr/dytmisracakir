import Link from 'next/link';
import { Compass } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-50">
        <Compass className="h-7 w-7 text-sage-700" />
      </div>
      <h1 className="mt-6 font-display text-3xl text-ink sm:text-4xl">Aradığınız sayfa bulunamadı</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
        Bu bağlantı taşınmış veya kaldırılmış olabilir. Ana sayfaya dönerek aradığınız içeriğe oradan
        ulaşabilirsiniz.
      </p>
      <div className="mt-8 flex gap-3">
        <Button href="/">Ana Sayfaya Dön</Button>
        <Button href="/iletisim" variant="secondary">
          İletişime Geç
        </Button>
      </div>
      <Link href="/sss" className="mt-6 text-xs text-ink-faint hover:text-clay">
        Belki de aradığınız cevap Sık Sorulan Sorular’dadır.
      </Link>
    </div>
  );
}
