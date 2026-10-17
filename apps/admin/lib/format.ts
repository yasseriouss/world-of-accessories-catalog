export const egp = (n: number, locale: string) =>
  new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', {
    style: 'currency', currency: 'EGP', maximumFractionDigits: 0
  }).format(n);

export const whatsappLink = (phone: string, text: string) =>
  `https://wa.me/2${phone.replace(/^0/, '')}?text=${encodeURIComponent(text)}`;

export const discountPct = (price: number, sale: number | null) =>
  sale ? Math.round((1 - sale / price) * 100) : 0;
