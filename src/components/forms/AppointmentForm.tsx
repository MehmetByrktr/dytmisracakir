'use client';

import { FormEvent, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';
import type { Service } from '@/types';
import Button from '@/components/ui/Button';

interface FormState {
  service: string;
  date: string;
  time: string;
  format: 'Online' | 'Yüz Yüze';
  name: string;
  phone: string;
  email: string;
  note: string;
}

const initialState: FormState = {
  service: '',
  date: '',
  time: '',
  format: 'Online',
  name: '',
  phone: '',
  email: '',
  note: '',
};

type Errors = Partial<Record<keyof FormState, string>>;

export default function AppointmentForm({ services }: { services: Service[] }) {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): Errors {
    const next: Errors = {};
    if (!form.service) next.service = 'Lütfen bir danışmanlık türü seçin.';
    if (!form.date) next.date = 'Lütfen bir tarih seçin.';
    if (!form.time) next.time = 'Lütfen bir saat seçin.';
    if (!form.name.trim()) next.name = 'Adınızı ve soyadınızı girin.';
    if (!/^[\d\s()+-]{7,}$/.test(form.phone)) next.phone = 'Geçerli bir telefon numarası girin.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Geçerli bir e-posta adresi girin.';
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus('submitting');
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error('Randevu talebi gönderilemedi.');
      setStatus('success');
      setForm(initialState);
    } catch {
      setStatus('idle');
      setErrors({ note: 'Randevu talebi gönderilemedi. Lütfen tekrar deneyin.' });
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="paper-card flex flex-col items-center px-8 py-16 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 14 }}
        >
          <CheckCircle2 className="h-14 w-14 text-sage-600" />
        </motion.div>
        <h3 className="mt-6 font-display text-2xl text-ink">Randevu talebiniz alındı</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
          En kısa sürede size e-posta veya WhatsApp üzerinden dönüş yapılacaktır. İlginiz için teşekkür ederiz.
        </p>
        <Button variant="secondary" className="mt-8" onClick={() => setStatus('idle')}>
          Yeni Randevu Oluştur
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="paper-card space-y-6 p-7 sm:p-9">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="service" className="mb-2 block text-sm font-medium text-ink">
            Danışmanlık Türü
          </label>
          <select
            id="service"
            value={form.service}
            onChange={(e) => update('service', e.target.value)}
            aria-invalid={!!errors.service}
            className="w-full rounded-lg border border-ink/15 bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-clay"
          >
            <option value="">Seçiniz</option>
            {services.map((s) => (
              <option key={s.slug} value={s.title}>
                {s.title}
              </option>
            ))}
          </select>
          {errors.service && <p className="mt-1.5 text-xs text-clay-deep">{errors.service}</p>}
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-ink">Görüşme Biçimi</span>
          <div className="flex gap-3">
            {(['Online', 'Yüz Yüze'] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => update('format', opt)}
                aria-pressed={form.format === opt}
                className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                  form.format === opt
                    ? 'border-clay bg-clay/10 text-clay-deep'
                    : 'border-ink/15 text-ink-soft hover:border-clay/40'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="date" className="mb-2 block text-sm font-medium text-ink">
            Tarih
          </label>
          <input
            id="date"
            type="date"
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
            aria-invalid={!!errors.date}
            className="w-full rounded-lg border border-ink/15 bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-clay"
          />
          {errors.date && <p className="mt-1.5 text-xs text-clay-deep">{errors.date}</p>}
        </div>

        <div>
          <label htmlFor="time" className="mb-2 block text-sm font-medium text-ink">
            Saat
          </label>
          <input
            id="time"
            type="time"
            value={form.time}
            onChange={(e) => update('time', e.target.value)}
            aria-invalid={!!errors.time}
            className="w-full rounded-lg border border-ink/15 bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-clay"
          />
          {errors.time && <p className="mt-1.5 text-xs text-clay-deep">{errors.time}</p>}
        </div>

        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink">
            Ad Soyad
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            aria-invalid={!!errors.name}
            placeholder="Adınız Soyadınız"
            className="w-full rounded-lg border border-ink/15 bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-clay"
          />
          {errors.name && <p className="mt-1.5 text-xs text-clay-deep">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-medium text-ink">
            Telefon Numarası
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            aria-invalid={!!errors.phone}
            placeholder="0532 000 00 00"
            className="w-full rounded-lg border border-ink/15 bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-clay"
          />
          {errors.phone && <p className="mt-1.5 text-xs text-clay-deep">{errors.phone}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">
            E-posta Adresi
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            aria-invalid={!!errors.email}
            placeholder="ornek@eposta.com"
            className="w-full rounded-lg border border-ink/15 bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-clay"
          />
          {errors.email && <p className="mt-1.5 text-xs text-clay-deep">{errors.email}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="note" className="mb-2 block text-sm font-medium text-ink">
            Kısa Notunuz <span className="text-ink-faint">(isteğe bağlı)</span>
          </label>
          <textarea
            id="note"
            rows={4}
            value={form.note}
            onChange={(e) => update('note', e.target.value)}
            placeholder="Belirtmek istediğiniz bir sağlık durumu veya hedef var mı?"
            className="w-full resize-none rounded-lg border border-ink/15 bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-clay"
          />
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto">
        <AnimatePresence mode="wait" initial={false}>
          {status === 'submitting' ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="h-4 w-4 animate-spin" /> Gönderiliyor
            </motion.span>
          ) : (
            <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Randevu Talebi Gönder
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </form>
  );
}
