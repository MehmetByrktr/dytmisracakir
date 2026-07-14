import { MenuPlan } from '@/types';

export const menus: MenuPlan[] = [
  {
    slug: 'dengeli-beslenme-7-gunluk-menu',
    title: '7 Günlük Dengeli Beslenme Menüsü',
    categories: ['Dengeli Beslenme'],
    durationDays: 7,
    mealsPerDay: 5,
    calories: 'Kişiye göre düzenlenir',
    image: '/images/menus/dengeli-menu.jpg',
    summary: 'Günlük rutine uyarlanabilen, ana ve ara öğünleri dengeli şekilde planlayan örnek haftalık menü.',
    days: [
      {
        day: '1. Gün',
        meals: [
          { name: 'Kahvaltı', description: 'Yumurta, peynir, tam tahıllı ekmek ve mevsim sebzeleri' },
          { name: 'Ara Öğün', description: 'Yoğurt ve taze meyve' },
          { name: 'Öğle', description: 'Izgara tavuklu bol yeşillikli salata ve ayran' },
          { name: 'Ara Öğün', description: 'Çiğ badem ve bitki çayı' },
          { name: 'Akşam', description: 'Zeytinyağlı sebze yemeği, yoğurt ve bulgur pilavı' },
        ],
      },
      {
        day: '2. Gün',
        meals: [
          { name: 'Kahvaltı', description: 'Yoğurtlu yulaf kasesi, tarçın ve meyve' },
          { name: 'Ara Öğün', description: 'Kefir' },
          { name: 'Öğle', description: 'Mercimek çorbası, tam tahıllı ekmek ve salata' },
          { name: 'Ara Öğün', description: 'Meyve ve ceviz' },
          { name: 'Akşam', description: 'Fırında balık, sebze ve roka salatası' },
        ],
      },
    ],
    notes: [
      'Bu menü örnek amaçlıdır; porsiyonlar kişisel gereksinime göre düzenlenmelidir.',
      'Sağlık durumu ve ilaç kullanımı bulunan kişiler kişisel danışmanlık almalıdır.',
    ],
  },
  {
    slug: 'kilo-kontrolu-ornek-menu',
    title: 'Kilo Kontrolüne Yönelik Örnek Menü',
    categories: ['Kilo Kontrolü'],
    durationDays: 3,
    mealsPerDay: 4,
    calories: 'Kişiye göre düzenlenir',
    image: '/images/menus/kilo-kontrolu.jpg',
    summary: 'Tokluk, öğün düzeni ve sürdürülebilir porsiyon kontrolünü merkeze alan üç günlük örnek plan.',
    days: [
      {
        day: '1. Gün',
        meals: [
          { name: 'Kahvaltı', description: 'Sebzeli omlet ve tam tahıllı ekmek' },
          { name: 'Öğle', description: 'Baklagil salatası ve ayran' },
          { name: 'Ara Öğün', description: 'Meyve ve yoğurt' },
          { name: 'Akşam', description: 'Izgara köfte, fırın sebze ve cacık' },
        ],
      },
    ],
    notes: ['Uzun süreli açlık yerine düzenli ve yeterli öğün yaklaşımı benimsenmiştir.'],
  },
  {
    slug: 'vejetaryen-haftalik-menu',
    title: 'Vejetaryen Haftalık Menü',
    categories: ['Vejetaryen', 'Dengeli Beslenme'],
    durationDays: 7,
    mealsPerDay: 5,
    calories: 'Kişiye göre düzenlenir',
    image: '/images/menus/vejetaryen.jpg',
    summary: 'Bitkisel protein çeşitliliği, demir ve kalsiyum kaynakları gözetilerek hazırlanmış örnek menü.',
    days: [
      {
        day: '1. Gün',
        meals: [
          { name: 'Kahvaltı', description: 'Peynirli tost, domates ve yeşillik' },
          { name: 'Ara Öğün', description: 'Meyve ve kabak çekirdeği' },
          { name: 'Öğle', description: 'Nohutlu kinoa salatası' },
          { name: 'Ara Öğün', description: 'Kefir veya yoğurt' },
          { name: 'Akşam', description: 'Yeşil mercimek yemeği, bulgur ve salata' },
        ],
      },
    ],
    notes: ['B12, demir ve D vitamini düzeyleri kişisel olarak değerlendirilmelidir.'],
  },
  {
    slug: 'sporcu-beslenmesi-antrenman-gunu',
    title: 'Antrenman Günü Sporcu Menüsü',
    categories: ['Sporcu'],
    durationDays: 1,
    mealsPerDay: 6,
    calories: 'Antrenman yüküne göre',
    image: '/images/menus/sporcu.jpg',
    summary: 'Antrenman öncesi enerji, antrenman sonrası toparlanma ve yeterli hidrasyonu destekleyen örnek gün.',
    days: [
      {
        day: 'Antrenman Günü',
        meals: [
          { name: 'Kahvaltı', description: 'Yulaf, süt, muz ve fıstık ezmesi' },
          { name: 'Ara Öğün', description: 'Peynirli sandviç' },
          { name: 'Öğle', description: 'Tavuk, pirinç ve sebze' },
          { name: 'Antrenman Öncesi', description: 'Muz ve yoğurt' },
          { name: 'Antrenman Sonrası', description: 'Süt veya kefir ve meyve' },
          { name: 'Akşam', description: 'Balık, patates ve salata' },
        ],
      },
    ],
    notes: ['Sıvı ve elektrolit gereksinimi terleme düzeyine göre kişiselleştirilmelidir.'],
  },
];
