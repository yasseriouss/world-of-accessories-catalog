/** Non-translatable business constants. Copy that describes them lives in messages/*.json. */
export const SITE = {
  url: 'https://ha-woa.vercel.app',
  storeUrl: 'https://woa-market.vercel.app',
  mapsUrl: 'https://maps.google.com/?q=Silla+Mall+6th+October',
  /** Local format, used for wa.me links via whatsappLink(). */
  whatsapp: '01140030036',
  /** E.164, used for tel: links and structured data. */
  phoneE164: '+201140030036',
  phoneDisplay: '0114 003 0036',
} as const;

/** Absolute URL of a storefront page for the given locale. */
export const storeHref = (locale: string, path = '') => `${SITE.storeUrl}/${locale}${path}`;
