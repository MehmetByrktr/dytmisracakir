import { site } from '@/data/site';
import { BlogPost, FaqItem } from '@/types';

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Dietitian', 'LocalBusiness'],
    name: site.name,
    description: site.description,
    url: process.env.NEXT_PUBLIC_SITE_URL || site.url,
    telephone: site.phone,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.district,
      addressRegion: site.address.city,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '10:00',
        closes: '15:00',
      },
    ],
    sameAs: [site.social.instagram, site.social.linkedin, site.social.youtube],
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function articleSchema(post: BlogPost, baseUrl = process.env.NEXT_PUBLIC_SITE_URL || site.url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage.startsWith('http') ? post.coverImage : `${baseUrl}${post.coverImage}`,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: site.name,
    },
  };
}
