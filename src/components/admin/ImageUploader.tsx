'use client';
import Image from 'next/image';
import { useState } from 'react';
import { ImagePlus, Loader2, Upload } from 'lucide-react';

export default function ImageUploader({ label, value, onChange, password, accept = 'image/*', compact = false }: { label: string; value: string; onChange: (url: string) => void; password: string; accept?: string; compact?: boolean }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  async function upload(file?: File) {
    if (!file) return;
    setUploading(true); setError('');
    try {
      const form = new FormData(); form.append('file', file);
      const response = await fetch('/api/admin/upload', { method: 'POST', credentials: 'same-origin', body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Görsel yüklenemedi.');
      onChange(data.url);
    } catch (err) { setError(err instanceof Error ? err.message : 'Görsel yüklenemedi.'); }
    finally { setUploading(false); }
  }
  return <div><span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink-faint">{label}</span><div className={`grid gap-3 ${compact ? 'sm:grid-cols-[100px_1fr]' : 'sm:grid-cols-[160px_1fr]'}`}><div className={`relative ${compact ? 'h-24' : 'h-32'} overflow-hidden rounded-xl border border-dashed border-clay/30 bg-cream-deep/50`}>{value ? <Image src={value} alt="Görsel önizleme" fill sizes={compact ? '100px' : '160px'} className="object-cover" /> : <div className="flex h-full flex-col items-center justify-center gap-2 text-xs text-ink-faint"><ImagePlus className="h-5 w-5 text-clay" />Önizleme</div>}</div><div className="space-y-2"><input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Görsel URL'si veya yüklenen dosya yolu" className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/10" /><label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-clay/25 bg-clay/10 px-4 py-2.5 text-xs font-semibold text-clay-deep transition hover:bg-clay hover:text-cream">{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}{uploading ? 'Yükleniyor...' : 'Bilgisayardan Yükle'}<input type="file" accept={accept} className="hidden" disabled={uploading} onChange={(e) => void upload(e.target.files?.[0])} /></label>{error && <p className="text-xs text-red-600">{error}</p>}</div></div></div>;
}
