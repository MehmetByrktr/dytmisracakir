export interface Service {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: string;
  duration: string;
  format: string;
  highlights: string[];
  image: string;
}

export interface Testimonial {
  id: string;
  initials: string;
  name: string;
  service: string;
  rating: number;
  quote: string;
  beforeAfter?: string;
}

export type BlogStatus = 'published' | 'draft';

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  /** Backwards compatible plain paragraphs. New articles use contentHtml. */
  content: string[];
  contentHtml?: string;
  coverImage: string;
  readMinutes: number;
  publishedAt: string;
  author: string;
  status?: BlogStatus;
  views?: number;
  likes?: number;
}

export type MenuCategory =
  | 'Kilo Kontrolü'
  | 'Dengeli Beslenme'
  | 'Sporcu'
  | 'Vejetaryen'
  | 'Glutensiz'
  | 'Kurumsal';

export interface MenuMeal {
  name: string;
  description: string;
}

export interface MenuDay {
  day: string;
  meals: MenuMeal[];
}

export interface MenuPlan {
  slug: string;
  title: string;
  categories: MenuCategory[];
  durationDays: number;
  mealsPerDay: number;
  calories: string;
  image: string;
  summary: string;
  /** Zengin metin editörüyle hazırlanan tarif içeriği. Eski kayıtlar days alanını kullanmaya devam eder. */
  contentHtml?: string;
  status?: BlogStatus;
  days: MenuDay[];
  notes: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export type RecipeCategory =
  | 'Kahvaltı'
  | 'Ana Öğün'
  | 'Ara Öğün'
  | 'Tatlı'
  | 'Vegan'
  | 'Glutensiz'
  | 'Yüksek Proteinli';

export interface Recipe {
  slug: string;
  title: string;
  categories: RecipeCategory[];
  prepMinutes: number;
  servings: number;
  calories: number;
  image: string;
  summary: string;
  ingredients: string[];
  steps: string[];
  nutrition: Array<{ label: string; value: string }>;
  substitutions: string[];
}

export type AppointmentStatus = 'Yeni' | 'Görüldü' | 'İletişime Geçildi' | 'Görüşüldü' | 'Tamamlandı';

export interface AppointmentRecord {
  id: string;
  createdAt: string;
  status: AppointmentStatus;
  service: string;
  date: string;
  time: string;
  format: string;
  name: string;
  phone: string;
  email: string;
  note: string;
}

export type ContactStatus = 'Yeni' | 'Görüldü' | 'Yanıtlandı' | 'Görüşüldü';

export interface ContactRecord {
  id: string;
  createdAt: string;
  status: ContactStatus;
  name: string;
  email: string;
  phone: string;
  message: string;
}
