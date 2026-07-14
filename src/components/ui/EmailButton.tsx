'use client';

import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmailButton({ email }: { email: string }) {
  const subject = encodeURIComponent('Beslenme danışmanlığı hakkında bilgi');
  const body = encodeURIComponent('Merhaba Mısra Hanım, danışmanlık hakkında bilgi almak istiyorum.');
  return (
    <motion.a
      href={`mailto:${email}?subject=${subject}&body=${body}`}
      aria-label="E-posta ile hızlı iletişim"
      title="E-posta gönder"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.7, duration: 0.35 }}
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-sage-300/40 bg-sage-700 text-cream shadow-soft transition hover:-translate-y-0.5 hover:bg-clay-deep motion-reduce:transition-none"
    >
      <Mail className="h-5 w-5" />
    </motion.a>
  );
}
