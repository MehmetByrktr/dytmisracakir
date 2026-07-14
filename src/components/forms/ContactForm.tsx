'use client';

import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const initialState: FormState = { name: '', email: '', phone: '', message: '' };
type Errors = Partial<Record<keyof FormState, string>>;

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): Errors {
    const next: Errors = {};
    if (!form.name.trim()) next.name = 'Adınızı ve soyadınızı girin.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Geçerli bir e-posta adresi girin.';
    if (!form.message.trim() || form.message.trim().length < 10)
      next.message = 'Mesajınızı en az 10 karakter olacak şekilde yazın.';
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus('submitting');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error('Mesaj gönderilemedi.');
      setStatus('success');
      setForm(initialState);
    } catch {
      setStatus('idle');
      setErrors({ message: 'Mesaj gönderilemedi. Lütfen tekrar deneyin.' });
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="paper-card flex flex-col items-center px-8 py-14 text-center"
      >
        <CheckCircle2 className="h-12 w-12 text-sage-600" />
        <h3 className="mt-5 font-display text-xl text-ink">Mesajınız iletildi</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
          En kısa sürede size dönüş yapılacaktır.
        </p>
        <Button variant="secondary" className="mt-6" onClick={() => setStatus('idle')}>
          Yeni Mesaj Gönder
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="paper-card space-y-5 p-7 sm:p-9">
      <div>
        <label htmlFor="c-name" className="mb-2 block text-sm font-medium text-ink">
          Ad Soyad
        </label>
        <input
          id="c-name"
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
        <label htmlFor="c-email" className="mb-2 block text-sm font-medium text-ink">
          E-posta Adresi
        </label>
        <input
          id="c-email"
          type="email"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          aria-invalid={!!errors.email}
          placeholder="ornek@eposta.com"
          className="w-full rounded-lg border border-ink/15 bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-clay"
        />
        {errors.email && <p className="mt-1.5 text-xs text-clay-deep">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="c-phone" className="mb-2 block text-sm font-medium text-ink">
          Telefon Numarası <span className="text-ink-faint">(isteğe bağlı)</span>
        </label>
        <input
          id="c-phone"
          type="tel"
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
          placeholder="0532 000 00 00"
          className="w-full rounded-lg border border-ink/15 bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-clay"
        />
      </div>

      <div>
        <label htmlFor="c-message" className="mb-2 block text-sm font-medium text-ink">
          Mesajınız
        </label>
        <textarea
          id="c-message"
          rows={5}
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          aria-invalid={!!errors.message}
          placeholder="Size nasıl yardımcı olabilirim?"
          className="w-full resize-none rounded-lg border border-ink/15 bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-clay"
        />
        {errors.message && <p className="mt-1.5 text-xs text-clay-deep">{errors.message}</p>}
      </div>

      <Button type="submit" size="lg" className="w-full">
        {status === 'submitting' ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Gönderiliyor
          </span>
        ) : (
          'Mesajı Gönder'
        )}
      </Button>
    </form>
  );
}
