import type { Metadata } from 'next';
import { site } from '@/data/site';

export const metadata: Metadata = { title: 'KVKK Aydınlatma Metni' };

export default function KvkkPage() {
  return (
    <div className="pb-24 pt-36 sm:pt-44">
      <div className="container-site mx-auto max-w-2xl">
        <span className="eyebrow">Yasal</span>
        <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">KVKK Aydınlatma Metni</h1>
        <div className="prose-content mt-8 space-y-5 text-sm leading-relaxed text-ink-soft">
          <p>
            6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, {site.name} olarak veri sorumlusu
            sıfatıyla, randevu formu, iletişim formu ve web sitesi üzerinden tarafımıza ilettiğiniz kişisel
            verileriniz aşağıda açıklanan kapsamda işlenmektedir.
          </p>
          <h2 className="font-display text-lg text-ink">İşlenen Kişisel Veriler</h2>
          <p>
            Ad-soyad, telefon numarası, e-posta adresi, randevu talebine ilişkin bilgiler ve tarafınızca
            paylaşılması halinde sağlık durumunuza dair beslenme danışmanlığı sürecine özgü bilgiler
            işlenmektedir.
          </p>
          <h2 className="font-display text-lg text-ink">İşleme Amaçları</h2>
          <p>
            Verileriniz; randevu taleplerinin yönetilmesi, danışmanlık sürecinin yürütülmesi, tarafınızla
            iletişim kurulması ve yasal yükümlülüklerin yerine getirilmesi amaçlarıyla sınırlı olarak
            işlenmektedir.
          </p>
          <h2 className="font-display text-lg text-ink">Haklarınız</h2>
          <p>
            KVKK’nın 11. maddesi kapsamında, kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse
            buna ilişkin bilgi talep etme, işlenme amacını öğrenme, yurt içinde veya yurt dışında aktarıldığı
            üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme ve mevzuatta öngörülen
            diğer haklarınızı {site.email} adresi üzerinden bize ileterek kullanabilirsiniz.
          </p>
          <p>
            Bu metin, danışanlarımıza ve site ziyaretçilerine genel bilgilendirme amacıyla hazırlanmıştır; iş
            süreçlerinize özgü bir hukuki metin gerekiyorsa alanında uzman bir danışmandan destek almanızı
            öneririz.
          </p>
        </div>
      </div>
    </div>
  );
}
