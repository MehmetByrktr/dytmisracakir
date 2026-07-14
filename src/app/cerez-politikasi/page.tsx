import type { Metadata } from 'next';
import { site } from '@/data/site';

export const metadata: Metadata = { title: 'Çerez Politikası' };

export default function CookiePage() {
  return (
    <div className="pb-24 pt-36 sm:pt-44">
      <div className="container-site mx-auto max-w-2xl">
        <span className="eyebrow">Yasal</span>
        <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Çerez Politikası</h1>
        <div className="prose-content mt-8 space-y-5 text-sm leading-relaxed text-ink-soft">
          <p>
            Web sitemiz, kullanıcı deneyimini iyileştirmek ve site trafiğini analiz etmek amacıyla çerezler
            (cookies) kullanabilir. Bu sayfa, çerez kullanımımıza dair genel bilgi vermektedir.
          </p>
          <h2 className="font-display text-lg text-ink">Çerez Türleri</h2>
          <p>
            Sitemizde, temel işlevselliği sağlayan zorunlu çerezler ile site kullanımını anlamamıza yardımcı
            olan analitik çerezler kullanılabilir. Pazarlama amaçlı üçüncü taraf çerezleri yalnızca açık
            onayınız alındıktan sonra etkinleştirilir.
          </p>
          <h2 className="font-display text-lg text-ink">Çerezleri Yönetme</h2>
          <p>
            Tarayıcı ayarlarınız üzerinden çerezleri silebilir veya engelleyebilirsiniz. Ancak bazı çerezlerin
            devre dışı bırakılması, sitenin bazı bölümlerinin beklendiği gibi çalışmamasına neden olabilir.
          </p>
          <h2 className="font-display text-lg text-ink">İletişim</h2>
          <p>Çerez politikamızla ilgili sorularınız için {site.email} adresinden bize ulaşabilirsiniz.</p>
        </div>
      </div>
    </div>
  );
}
