/** Intl locale tag for an app locale (Egyptian formatting for both languages). */
export const intlLocale = (locale: string) => (locale === 'ar' ? 'ar-EG' : 'en-EG'); // allow-hardcoded: BCP-47 tags, not copy

export const egp = (n: number, locale: string) =>
  new Intl.NumberFormat(intlLocale(locale), {
    style: 'currency', currency: 'EGP', maximumFractionDigits: 0
  }).format(n);

export const whatsappLink = (phone: string, text: string) =>
  `https://wa.me/2${phone.replace(/^0/, '')}?text=${encodeURIComponent(text)}`;

export const discountPct = (price: number, sale: number | null) =>
  sale ? Math.round((1 - sale / price) * 100) : 0;
