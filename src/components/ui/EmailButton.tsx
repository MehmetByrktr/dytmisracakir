'use client';

import { Instagram, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import TikTokIcon from '@/components/icons/TikTokIcon';

interface SocialRailProps {
  email: string;
  instagram: string;
  tiktok: string;
}

export default function EmailButton({ email, instagram, tiktok }: SocialRailProps) {
  const subject = encodeURIComponent('Beslenme danışmanlığı hakkında bilgi');
  const body = encodeURIComponent('Merhaba Mısra Hanım, danışmanlık hakkında bilgi almak istiyorum.');
  const items = [
    { href: instagram, label: 'Instagram', title: 'Instagram', Icon: Instagram, external: true },
    { href: tiktok, label: 'TikTok', title: 'TikTok', Icon: TikTokIcon, external: true },
    {
      href: `mailto:${email}?subject=${subject}&body=${body}`,
      label: 'E-posta ile hızlı iletişim',
      title: 'E-posta gönder',
      Icon: Mail,
      external: false,
    },
  ].filter((item) => item.href);

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.55, duration: 0.4 }}
      className="fixed right-3 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-2 sm:right-5"
      aria-label="Hızlı iletişim bağlantıları"
    >
      {items.map(({ href, label, title, Icon, external }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          title={title}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-sage/35 bg-transparent text-sage-700 shadow-card backdrop-blur-sm transition duration-300 hover:-translate-x-1 hover:border-sage-700 hover:bg-sage/10 hover:shadow-soft sm:h-12 sm:w-12"
        >
          <Icon className="h-5 w-5" />
        </a>
      ))}
    </motion.div>
  );
}
