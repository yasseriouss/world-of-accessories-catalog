import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { supabase } from '@/lib/supabase';
import { intlLocale } from '@/lib/format';

export const revalidate = 300;
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'blog' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

export default async function BlogIndex({ params: { locale } }: any) {
  const t = await getTranslations({ locale, namespace: 'blog' });
  const ar = locale === 'ar';
  const { data: posts } = await supabase.from('posts')
    .select('slug,title_ar,title_en,excerpt_ar,excerpt_en,cover_url,tags,published_at')
    .eq('status', 'published').order('published_at', { ascending: false });

  return (
    <div className="container section">
      <div className="eyebrow">{t('eyebrow')}</div>
      <h1 className="sec-title" style={{ fontSize:'var(--fs-h1)' }}>{t('title')}</h1>
      <div className="posts-grid" style={{ marginTop:'32px' }}>
        {(posts ?? []).map((p: any) => (
          <Link key={p.slug} href={`/${locale}/blog/${p.slug}`} className="card post-card">
            {p.cover_url && (
              <div className="post-cover">
                <Image src={p.cover_url} alt={ar ? p.title_ar : p.title_en ?? p.title_ar} fill sizes="(max-width:640px) 100vw, 380px"
                  style={{ objectFit:'cover' }} loading="lazy" />
              </div>
            )}
            <div style={{ padding:'18px' }}>
              <h2 style={{ fontSize:'1.1rem', lineHeight:1.5 }}>{ar ? p.title_ar : p.title_en ?? p.title_ar}</h2>
              <p style={{ fontSize:'.87rem', color:'var(--color-text-2)', marginTop:'8px' }} className="line-clamp-2">
                {ar ? p.excerpt_ar : p.excerpt_en ?? p.excerpt_ar}</p>
              <div style={{ fontSize:'.78rem', color:'var(--color-text-3)', marginTop:'12px' }}>
                {new Date(p.published_at).toLocaleDateString(intlLocale(locale))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
