import type { Metadata } from 'next';
import { site } from '@/data/site';

export const metadata: Metadata = { title: 'Gizlilik Politikası' };

export default function PrivacyPage() {
  return (
    <div className="pb-24 pt-36 sm:pt-44">
      <div className="container-site mx-auto max-w-2xl">
        <span className="eyebrow">Yasal</span>
        <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Gizlilik Politikası</h1>
        <div className="prose-content mt-8 space-y-5 text-sm leading-relaxed text-ink-soft">
          <p>
            {site.shortTitle} olarak, web sitemizi ziyaret eden ve hizmetlerimizden faydalanan kullanıcılarımızın
            gizliliğine önem veriyoruz. Bu politika, hangi bilgilerin toplandığını ve nasıl kullanıldığını
            açıklamaktadır.
          </p>
          <h2 className="font-display text-lg text-ink">Toplanan Bilgiler</h2>
          <p>
            Randevu ve iletişim formları aracılığıyla paylaştığınız ad, e-posta, telefon ve mesaj içerikleri
            ile web sitesi kullanımına ilişkin temel istatistiksel veriler toplanabilir.
          </p>
          <h2 className="font-display text-lg text-ink">Bilgilerin Kullanımı</h2>
          <p>
            Toplanan bilgiler yalnızca randevu ve danışmanlık süreçlerinin yürütülmesi, size dönüş
            yapılabilmesi ve hizmet kalitesinin iyileştirilmesi amacıyla kullanılır. Bilgileriniz izniniz
            olmaksızın üçüncü taraflarla pazarlama amacıyla paylaşılmaz.
          </p>
          <h2 className="font-display text-lg text-ink">Veri Güvenliği</h2>
          <p>
            Kişisel verilerinizin güvenliğini sağlamak amacıyla makul teknik ve idari önlemler alınmaktadır.
            Ancak internet üzerinden veri iletiminin %100 güvenli olduğu garanti edilemez.
          </p>
          <h2 className="font-display text-lg text-ink">İletişim</h2>
          <p>
            Gizlilik politikamızla ilgili sorularınız için {site.email} adresinden bize ulaşabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
