import { MetadataRoute } from 'next';
import { createTranslator } from 'next-intl';
import arMessages from '@/messages/ar.json';

// The installable app defaults to the Arabic storefront.
export default function manifest(): MetadataRoute.Manifest {
  const t = createTranslator({ locale: 'ar', messages: arMessages, namespace: 'meta' });
  return {
    name: t('title'),
    short_name: t('siteName'),
    description: t('description'),
    start_url: '/ar',
    display: 'standalone',
    background_color: '#FBFAF7', // allow-hardcoded: manifest needs a literal (= --brand-paper, light default)
    theme_color: '#B08D2E', // allow-hardcoded: manifest needs a literal (= --brand-gold)
    lang: 'ar',
    dir: 'rtl',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
