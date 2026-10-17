import { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api', '/admin', '/en/cart', '/en/checkout'] }],
    sitemap: 'https://woa-market.vercel.app/sitemap.xml'
  };
}
