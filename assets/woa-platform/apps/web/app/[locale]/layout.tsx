import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '../globals.css';
import Header from '../../components/Header';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ScrollTop from '../../components/ScrollTop';
import { siteJsonLd } from '../../lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://ha-woa.vercel.app'),
  title: { default: 'عالم الاكسسوار | البوابة الرسمية لتوريد إكسسوارات الأثاث والمطابخ', template: '%s | عالم الاكسسوار' },
  description: 'المرجع الأول في مصر لإكسسوارات المطابخ والدريسينج: مفصلات هيدروليك 3D، سكك تاندم، مقابض فاخرة. توريد مباشر B2B للمصانع والورش.',
  openGraph: { locale: 'ar_EG', type: 'website', siteName: 'عالم الاكسسوار' },
  alternates: { languages: { ar: '/ar', en: '/en' } }
};
export function generateStaticParams() { return [{ locale: 'ar' }, { locale: 'en' }]; }

export default async function LocaleLayout({ children, params: { locale } }: any) {
  const messages = await getMessages();
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head><script src="/theme-init.js" defer /></head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
        <NextIntlClientProvider messages={messages}><Header />{children}</NextIntlClientProvider>
        <Footer />
        <ScrollTop />
      </body>
    </html>
  );
}
