export const productJsonLd = (p: any, locale: string, reviews?: any[]) => ({
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
    ratingValue: p.rating_avg,
    reviewCount: p.rating_count
  } : undefined,
  review: (reviews && reviews.length > 0) ? reviews.slice(0, 5).map((r: any) => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: r.author_name },
    datePublished: r.created_at,
    reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
    reviewBody: r.comment || undefined
  })) : undefined
});

export const siteJsonLd = {
  '@context': 'https://schema.org', '@type': 'LocalBusiness',
  name: 'عالم الاكسسوار | WOA Accessories',
  telephone: '+20 1140030036',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'المحور المركزي، بجوار ميدان النجدة، سيلا مول',
    addressLocality: '6 أكتوبر', addressRegion: 'الجيزة', addressCountry: 'EG'
  },
  openingHours: 'Mo-Su 10:00-22:00',
  priceRange: '$$'
};
