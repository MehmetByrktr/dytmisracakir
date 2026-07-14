'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-clay/10">
        <AlertTriangle className="h-7 w-7 text-clay" />
      </div>
      <h1 className="mt-6 font-display text-3xl text-ink">Bir şeyler ters gitti</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
        Sayfa yüklenirken beklenmedik bir hata oluştu. Lütfen tekrar deneyin; sorun devam ederse bizimle
        iletişime geçebilirsiniz.
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Tekrar Dene</Button>
        <Button href="/iletisim" variant="secondary">
          İletişime Geç
        </Button>
      </div>
    </div>
  );
}
