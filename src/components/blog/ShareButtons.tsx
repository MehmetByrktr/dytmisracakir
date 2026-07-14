'use client';

import { useState } from 'react';
import { Link2, Check, Twitter, Linkedin } from 'lucide-react';

export default function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — silently ignore
    }
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="X'te paylaş"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink-soft transition-colors hover:border-clay hover:text-clay"
      >
        <Twitter className="h-4 w-4" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn'de paylaş"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink-soft transition-colors hover:border-clay hover:text-clay"
      >
        <Linkedin className="h-4 w-4" />
      </a>
      <button
        onClick={copyLink}
        aria-label="Bağlantıyı kopyala"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink-soft transition-colors hover:border-clay hover:text-clay"
      >
        {copied ? <Check className="h-4 w-4 text-sage-600" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
