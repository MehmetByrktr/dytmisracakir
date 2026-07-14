'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WhatsAppButton({ whatsapp }: { whatsapp: string }) {
  return (
    <motion.a
      href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Merhaba, danışmanlık hakkında bilgi almak istiyorum.')}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp üzerinden hızlı iletişim"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.4 }}
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft animate-pulse-soft motion-reduce:animate-none"
    >
      <MessageCircle className="h-5 w-5" fill="white" strokeWidth={0} />
    </motion.a>
  );
}
