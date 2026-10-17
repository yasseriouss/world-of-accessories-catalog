import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import '../globals.css';
import { CartProvider } from '@/lib/store-context';
import Header from '@/components/Header';
import AnnouncementBar from '@/components/AnnouncementBar';
import Footer from '@/components/Footer';
import ScrollTop from '@/components/ScrollTop';
import PWARegister from '@/components/PWARegister';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { siteJsonLd } from '@/lib/seo';

export const viewport: Viewport = { themeColor: '#B08D2E' };

export const metadata: Metadata = {
  metadataBase: new URL('https://woa-market.vercel.app'),
  title: { default: 'عالم الاكسسوار | متجر إكسسوارات الأثاث والمطابخ', template: '%s | عالم الاكسسوار' },
  description: 'تسوق إكسسوارات المطابخ والدريسينج: مفصلات هيدروليك، سكك تاندم، مقابض فاخرة. شحن لجميع محافظات مصر.',
  manifest: '/manifest.webmanifest',
  openGraph: { locale: 'ar_EG', type: 'website', siteName: 'عالم الاكسسوار' },
  alternates: { languages: { ar: '/ar', en: '/en' } }
};

export default async function LocaleLayout({ children, params: { locale } }: any) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head><script src="/theme-init.js" defer /></head>
      <body>
        <PWARegister />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <AnnouncementBar />
            <Header />
            <main>{children}</main>
            <Footer />
            <ScrollTop />
          </CartProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
