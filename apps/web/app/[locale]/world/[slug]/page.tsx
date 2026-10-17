import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { supabase } from '@/lib/supabase';
import { getProducts, getPostsByCategory } from '@/lib/queries';
import { egp } from '@/lib/format';
import { storeHref } from '@/lib/site';

export const revalidate = 300;
export const dynamicParams = true;

export async function generateMetadata({ params }: any) {
  const { data: c } = await supabase.from('categories').select('*').eq('slug', params.slug).single();
  if (!c) return {};
  const ar = params.locale === 'ar';
  return {
    title: ar ? c.seo_title_ar ?? c.name_ar : c.seo_title_en ?? c.name_en,
    description: ar ? c.seo_desc_ar : c.seo_desc_en
  };
}

export default async function WorldPage({ params }: any) {
  const { data: cat } = await supabase.from('categories').select('*').eq('slug', params.slug).single();
  if (!cat) notFound();
  const ar = params.locale === 'ar';
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: 'world' });
  const { products } = await getProducts({ category: params.slug, pageSize: 12 });
  const posts = await getPostsByCategory(params.slug, 3);

  return (
    <div>
      <section className="hero" style={{ padding:'clamp(48px,8vw,96px) 0' }}>
        <div className="container">
          <div className="eyebrow" style={{ color:'var(--brand-gold-soft)' }}>{t('eyebrow')}</div>
          <h1>{ar ? cat.name_ar : cat.name_en ?? cat.name_ar}</h1>
          <p>{ar ? cat.seo_desc_ar : cat.seo_desc_en}</p>
        </div>
      </section>

      <div className="container section">
        <h2 className="sec-title">{t('products')}</h2>
        <div className="pgrid">
          {products.map((p: any) => (
            <a key={p.id} href={storeHref(locale, `/product/${p.slug}`)} className="card"
              style={{ padding:'20px', textDecoration:'none', display:'grid', gap:'8px' }}>
              <div style={{ fontSize:'.75rem', color:'var(--color-text-3)' }}>{p.code}</div>
              <div style={{ fontWeight:600 }}>{ar ? p.name_ar : p.name_en ?? p.name_ar}</div>
              <div className="price" style={{ color: 'var(--color-accent-text)' }}>{egp(p.sale_price ?? p.price_egp, locale)}</div>
            </a>
          ))}
        </div>

        {posts.length > 0 && (<>
          <h2 className="sec-title" style={{ marginTop:'56px' }}>{t('fromBlog')}</h2>
          <div className="posts-grid">
            {posts.map((p: any) => (
              <Link key={p.slug} href={`/${locale}/blog/${p.slug}`} className="card post-card" style={{ overflow:'hidden' }}>
                <div className="post-cover">
                  <img src={p.cover_url} alt={ar ? p.title_ar : p.title_en ?? p.title_ar} loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                </div>
                <div style={{ padding:'18px' }}>
                  <h3 style={{ fontSize:'1.05rem', lineHeight:1.5 }}>{ar ? p.title_ar : p.title_en ?? p.title_ar}</h3>
                  <p style={{ fontSize:'.85rem', color:'var(--color-text-2)', marginTop:'8px' }} className="line-clamp-2">{ar ? p.excerpt_ar : p.excerpt_en ?? p.excerpt_ar}</p>
                </div>
              </Link>
            ))}
          </div>
        </>)}
      </div>
    </div>
  );
}
