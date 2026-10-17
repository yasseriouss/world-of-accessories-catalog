import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'عالم الاكسسوار | متجر إكسسوارات الأثاث والمطابخ',
    short_name: 'عالم الاكسسوار',
    description: 'تسوق إكسسوارات المطابخ والدريسينج: مفصلات هيدروليك، سكك تاندم، مقابض فاخرة. شحن لجميع محافظات مصر.',
    start_url: '/ar',
    display: 'standalone',
    background_color: '#0B0D10',
    theme_color: '#B08D2E',
    lang: 'ar',
    dir: 'rtl',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any',
      },
    ],
  };
}
