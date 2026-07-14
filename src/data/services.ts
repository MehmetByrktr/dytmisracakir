import { Service } from '@/types';

export const services: Service[] = [
  {
    slug: 'online-beslenme-danismanligi',
    title: 'Online Beslenme Danışmanlığı',
    shortDescription: 'Görüntülü görüşme ile her yerden, düzenli takip ve esnek program güncellemeleriyle.',
    description:
      'Yaşadığınız şehir fark etmeksizin, görüntülü görüşme üzerinden detaylı bir değerlendirme yapıyor ve size özel bir beslenme programı hazırlıyorum. Program, yaşam temponuza göre esnek biçimde güncellenir; sorularınızı mesaj yoluyla istediğiniz an iletebilirsiniz.',
    icon: 'Video',
    duration: '45 dakika',
    format: 'Görüntülü görüşme',
    highlights: [
      'İlk görüşmede detaylı sağlık ve beslenme geçmişi analizi',
      'Haftalık mesaj üzerinden takip desteği',
      '2 haftada bir program güncellemesi',
      'Uygulama üzerinden öğün takibi',
    ],
    image: '/images/services/online-danismanlik.jpg',
  },
  {
    slug: 'yuz-yuze-danismanlik',
    title: 'Yüz Yüze Danışmanlık',
    shortDescription: 'Kadıköy’deki ofisimde, vücut analizi ve birebir değerlendirme ile derinlemesine görüşme.',
    description:
      'Ofisimde gerçekleştirdiğimiz görüşmelerde vücut analiz cihazıyla ölçüm alıyor, bulgularınızı birlikte yorumluyor ve programınızı yüz yüze planlıyoruz. Sürecin her adımında sorularınızı doğrudan yanıtlıyorum.',
    icon: 'Users',
    duration: '60 dakika',
    format: 'Yüz yüze, Kadıköy',
    highlights: [
      'Biyoelektrik empedans analizi ile vücut kompozisyonu ölçümü',
      'Detaylı beslenme alışkanlığı görüşmesi',
      'Basılı ve dijital program',
      'Randevu sonrası 15 gün mesaj desteği',
    ],
    image: '/images/services/yuz-yuze-danismanlik.jpg',
  },
  {
    slug: 'kilo-yonetimi',
    title: 'Kilo Yönetimi',
    shortDescription: 'Sürdürülebilir alışkanlıklarla kalıcı sonuç odaklı, esnek kilo verme/alma programı.',
    description:
      'Hızlı ama kalıcı olmayan çözümler yerine, uzun vadede sürdürebileceğiniz bir beslenme düzeni kuruyoruz. Metabolik hızınız, hareket düzeyiniz ve yaşam tarzınız birlikte değerlendirilerek gerçekçi bir hedef planı oluşturulur.',
    icon: 'TrendingDown',
    duration: '45 dakika',
    format: 'Online veya yüz yüze',
    highlights: [
      'Kişiye özel kalori ve makro planlaması',
      'Davranış değişikliği odaklı takip',
      'Plato dönemlerinde program revizyonu',
      'Sürdürülebilirlik odaklı hedef belirleme',
    ],
    image: '/images/services/kilo-yonetimi.jpg',
  },
  {
    slug: 'sporcu-beslenmesi',
    title: 'Sporcu Beslenmesi',
    shortDescription: 'Performans, toparlanma ve vücut kompozisyonu hedeflerine göre planlanan spor beslenmesi.',
    description:
      'Antrenman yükünüze, branşınıza ve müsabaka takviminize göre enerji ve makro besin planlaması yapıyorum. Performans artışı, toparlanma süresi ve vücut kompozisyonu hedefleri birlikte ele alınır.',
    icon: 'Dumbbell',
    duration: '45 dakika',
    format: 'Online veya yüz yüze',
    highlights: [
      'Antrenman periyoduna göre karbonhidrat döngüsü',
      'Müsabaka öncesi ve sonrası beslenme planı',
      'Takviye kullanımı hakkında bilimsel değerlendirme',
      'Toparlanma odaklı öğün zamanlaması',
    ],
    image: '/images/services/sporcu-beslenmesi.jpg',
  },
  {
    slug: 'hastaliklarda-beslenme',
    title: 'Hastalıklarda Beslenme',
    shortDescription: 'Diyabet, tiroid, hipertansiyon ve sindirim rahatsızlıklarında tıbbi beslenme tedavisi.',
    description:
      'Diyabet, tiroid hastalıkları, hipertansiyon, reflü ve irritabl bağırsak sendromu gibi durumlarda, hekiminizin tedavi planıyla uyumlu bir beslenme programı hazırlıyorum. Gerekli görüldüğünde kan tahlili sonuçlarınız birlikte değerlendirilir.',
    icon: 'HeartPulse',
    duration: '50 dakika',
    format: 'Online veya yüz yüze',
    highlights: [
      'Kan tahlili sonuçlarının beslenme açısından yorumlanması',
      'Tedavi sürecinizle uyumlu program tasarımı',
      'Semptom takibi ile beslenme güncellemesi',
      'Gerektiğinde ilgili hekiminizle koordineli çalışma',
    ],
    image: '/images/services/hastaliklarda-beslenme.jpg',
  },
  {
    slug: 'gebelik-ve-emzirme-donemi',
    title: 'Gebelik ve Emzirme Döneminde Beslenme',
    shortDescription: 'Anne ve bebek sağlığını gözeten, trimesterlere özel beslenme planlaması.',
    description:
      'Gebelik dönemindeki her trimesterin farklı besin ihtiyaçlarını, emzirme sürecinin gerektirdiği enerji ve besin öğesi artışını göz önünde bulundurarak size özel bir plan hazırlıyorum. Amaç, hem anne hem bebek için güvenli ve dengeli bir beslenme düzeni kurmak.',
    icon: 'Baby',
    duration: '45 dakika',
    format: 'Online veya yüz yüze',
    highlights: [
      'Trimesterlere özel besin öğesi planlaması',
      'Gebelik diyabeti riskine yönelik takip',
      'Emzirme döneminde süt üretimini destekleyen beslenme',
      'Bulantı ve iştahsızlık dönemlerine yönelik pratik öneriler',
    ],
    image: '/images/services/gebelik-beslenmesi.jpg',
  },
  {
    slug: 'cocuk-ve-ergen-beslenmesi',
    title: 'Çocuk ve Ergen Beslenmesi',
    shortDescription: 'Büyüme çağına uygun, seçici yeme davranışlarını da gözeten aile odaklı beslenme desteği.',
    description:
      'Çocuğunuzun yaşına, büyüme eğrisine ve varsa seçici yeme alışkanlıklarına uygun bir beslenme planı hazırlıyorum. Süreç, aileyle birlikte yürütülür; evde uygulanabilir pratik öneriler sunulur.',
    icon: 'Sprout',
    duration: '45 dakika',
    format: 'Online veya yüz yüze',
    highlights: [
      'Büyüme eğrisi takibi',
      'Seçici yeme davranışına yönelik aile rehberliği',
      'Okul çağı için pratik beslenme çantası önerileri',
      'Ebeveyn görüşmeleriyle desteklenen süreç',
    ],
    image: '/images/services/cocuk-beslenmesi.jpg',
  },
  {
    slug: 'kurumsal-beslenme-danismanligi',
    title: 'Kurumsal Beslenme Danışmanlığı',
    shortDescription: 'Şirket çalışanlarına yönelik grup seminerleri ve bireysel danışmanlık paketleri.',
    description:
      'Şirketinizin çalışan sağlığı programlarına, beslenme seminerleri ve bireysel danışmanlık paketleriyle katkı sağlıyorum. İçerik, çalışma temposu ve ofis ortamına uygun, uygulanabilir öneriler etrafında kurgulanır.',
    icon: 'Building2',
    duration: 'Pakete göre değişir',
    format: 'Şirket lokasyonu veya online',
    highlights: [
      'Çalışanlara yönelik beslenme seminerleri',
      'Bireysel danışmanlık paketleri',
      'Ofis ortamına uygun pratik öneriler',
      'Şirket etkinliklerinde sağlıklı beslenme atölyeleri',
    ],
    image: '/images/services/kurumsal-danismanlik.jpg',
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}
