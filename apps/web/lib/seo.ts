import { SITE } from './site';

export const productJsonLd = (p: any, locale: string) => ({
  '@context': 'https://schema.org', '@type': 'Product',
  name: locale === 'ar' ? p.name_ar : p.name_en ?? p.name_ar,
  image: (p.images ?? []).map((i: any) => i.url),
  sku: p.code,
  brand: { '@type': 'Brand', name: p.brand ?? 'WOA' },
  offers: {
    '@type': 'Offer', priceCurrency: 'EGP',
    price: p.sale_price ?? p.price_egp,
    availability: p.stock > 0
      ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    itemCondition: 'https://schema.org/NewCondition'
  },
  aggregateRating: p.rating_count > 0 ? {
    '@type': 'AggregateRating',
    ratingValue: p.rating_avg, reviewCount: p.rating_count
  } : undefined
});

/** LocalBusiness JSON-LD; `t` is a translator scoped to the `seo` namespace. */
export const siteJsonLd = (t: (key: string) => string) => ({
  '@context': 'https://schema.org', '@type': 'LocalBusiness',
  name: t('businessName'),
  telephone: SITE.phoneE164,
  address: {
    '@type': 'PostalAddress',
    streetAddress: t('street'),
    addressLocality: t('locality'), addressRegion: t('region'), addressCountry: 'EG'
  },
  openingHours: 'Mo-Su 10:00-22:00',
  priceRange: '$$'
});
