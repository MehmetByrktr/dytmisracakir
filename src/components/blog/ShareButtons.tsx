'use client';

import { useState } from 'react';
import { Check, Instagram, Link2 } from 'lucide-react';
import TikTokIcon from '@/components/icons/TikTokIcon';

interface ShareButtonsProps {
  url: string;
  instagramUrl: string;
  tiktokUrl: string;
}

export default function ShareButtons({ url, instagramUrl, tiktokUrl }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard kullanılamıyorsa sayfanın çalışmasını etkileme.
    }
  }

  const socialClass =
    'flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink-soft transition-colors hover:border-clay hover:text-clay';

  return (
    <div className="flex items-center gap-2">
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram profilini aç"
        className={socialClass}
      >
        <Instagram className="h-4 w-4" />
      </a>
      <a
        href={tiktokUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TikTok profilini aç"
        className={socialClass}
      >
        <TikTokIcon className="h-4 w-4" />
      </a>
      <button onClick={copyLink} aria-label="Bağlantıyı kopyala" className={socialClass}>
        {copied ? <Check className="h-4 w-4 text-sage-600" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
