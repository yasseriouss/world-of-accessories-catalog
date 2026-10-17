import { MetadataRoute } from 'next';
import { getProducts, getCategories } from '../lib/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://woa-market.vercel.app';
  const [{ products }, cats] = await Promise.all([getProducts({ pageSize: 1000 }), getCategories()]);
  return [
    { url: `${base}/ar`, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/ar/catalog`, changeFrequency: 'daily', priority: 0.9 },
    ...cats.map((c: any) => ({ url: `${base}/ar/catalog?category=${c.slug}`, changeFrequency: 'daily' as const, priority: 0.8 })),
    ...products.map((p: any) => ({ url: `${base}/ar/product/${p.slug}`, lastModified: new Date(), priority: 0.7 }))
  ];
}
