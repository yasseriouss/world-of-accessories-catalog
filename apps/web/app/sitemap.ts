import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://ha-woa.vercel.app';
  const { data: posts } = await supabase.from('posts').select('slug, updated_at').eq('status', 'published');
  return [
    { url: `${base}/ar`, priority: 1 },
    { url: `${base}/ar/b2b`, priority: 0.8 },
    { url: `${base}/ar/contact`, priority: 0.6 },
    ...['kitchen','dressing','handles','mechanisms'].map(s => ({ url: `${base}/ar/world/${s}`, priority: 0.9 })),
    { url: `${base}/ar/blog`, changeFrequency: 'daily' as const, priority: 0.9 },
    ...(posts ?? []).map((p: any) => ({ url: `${base}/ar/blog/${p.slug}`, lastModified: p.updated_at, priority: 0.7 }))
  ];
}
