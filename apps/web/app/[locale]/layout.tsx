import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import '../globals.css';
import { IBM_Plex_Sans_Arabic, Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollTop from '@/components/ScrollTop';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { siteJsonLd } from '@/lib/seo';
import { SITE } from '@/lib/site';

const plexAr = IBM_Plex_Sans_Arabic({ subsets: ['arabic'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--font-plex-ar' });
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

// Light is the default; dark only when the user chose it (mirrors public/theme-init.js).
const THEME_INIT = "try{if(localStorage.getItem('woa-theme')==='dark')document.documentElement.setAttribute('data-theme','dark')}catch(e){}";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    metadataBase: new URL(SITE.url),
    title: { default: t('title'), template: t('titleTemplate') },
    description: t('description'),
    openGraph: { locale: t('ogLocale'), type: 'website', siteName: t('siteName') },
    alternates: { languages: { ar: '/ar', en: '/en' } }
  };
}
export default async function LocaleLayout({ children, params: { locale } }: any) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages();
  const tSeo = await getTranslations('seo');
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={`${plexAr.variable} ${inter.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: THEME_INIT }} /></head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd(tSeo)) }} />
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </NextIntlClientProvider>
        <ScrollTop />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
