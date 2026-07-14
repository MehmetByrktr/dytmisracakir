import Link from 'next/link';
import { Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import TikTokIcon from '@/components/icons/TikTokIcon';
import { footerLinks, site as defaultSite } from '@/data/site';

export default function Footer({ siteData = defaultSite }: { siteData?: typeof defaultSite }) {
  const site = siteData;
  return (
    <footer className="relative overflow-hidden border-t border-ink/25 bg-clay text-ink [&_.eyebrow]:text-ink">
      <div className="container-site grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="font-display text-2xl font-semibold text-ink">
            {site.name}
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/75">
            {site.footerDescription}
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { href: site.social.instagram, Icon: Instagram, label: 'Instagram' },
              { href: site.social.linkedin, Icon: Linkedin, label: 'LinkedIn' },
              { href: site.social.youtube, Icon: TikTokIcon, label: 'TikTok' },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/25 text-sage-700 transition-colors hover:border-sage-700 hover:bg-cream/30"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="eyebrow mb-4">Hızlı Bağlantılar</h3>
          <ul className="space-y-3">
            {footerLinks.quick.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-ink/75 transition-colors hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-4">İletişim</h3>
          <ul className="space-y-3 text-sm text-ink/75">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
              <a href={`tel:${site.phone}`} className="hover:text-clay">
                {site.phoneDisplay}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
              <a href={`mailto:${site.email}`} className="hover:text-clay">
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
              <span>
                {site.address.street}, {site.address.district}/{site.address.city}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-4">Yasal</h3>
          <ul className="space-y-3">
            {footerLinks.legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-ink/75 transition-colors hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-ink/20 py-6">
        <p className="container-site text-center text-xs text-ink/60">
          © {new Date().getFullYear()} {site.name}. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}
