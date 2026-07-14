import type { Metadata } from 'next';
import { site } from '@/data/site';

export const metadata: Metadata = { title: 'Kullanım Koşulları' };

export default function TermsPage() {
  return (
    <div className="pb-24 pt-36 sm:pt-44">
      <div className="container-site mx-auto max-w-2xl">
        <span className="eyebrow">Yasal</span>
        <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Kullanım Koşulları</h1>
        <div className="prose-content mt-8 space-y-5 text-sm leading-relaxed text-ink-soft">
          <p>
            Bu web sitesini kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız. Lütfen siteyi kullanmadan
            önce bu metni dikkatlice okuyunuz.
          </p>
          <h2 className="font-display text-lg text-ink">İçeriğin Amacı</h2>
          <p>
            Sitede yer alan blog yazıları, menüler ve genel beslenme bilgileri yalnızca bilgilendirme
            amaçlıdır ve bireysel bir tıbbi teşhis veya tedavi yerine geçmez. Sağlık durumunuza özel kararlar
            için mutlaka bir uzmana danışınız.
          </p>
          <h2 className="font-display text-lg text-ink">Fikri Mülkiyet</h2>
          <p>
            Sitede yer alan tüm metin, görsel ve tasarım öğeleri {site.name}’a aittir ve izinsiz
            çoğaltılamaz, dağıtılamaz.
          </p>
          <h2 className="font-display text-lg text-ink">Sorumluluk Sınırı</h2>
          <p>
            {site.name}, site içeriğinin doğruluğu ve güncelliği için makul özeni gösterir; ancak sitenin
            kullanımından doğabilecek doğrudan veya dolaylı zararlardan sorumlu tutulamaz.
          </p>
          <h2 className="font-display text-lg text-ink">Değişiklikler</h2>
          <p>
            Bu kullanım koşulları zaman zaman güncellenebilir. Güncel koşulları takip etmek kullanıcının
            sorumluluğundadır.
          </p>
        </div>
      </div>
    </div>
  );
}
