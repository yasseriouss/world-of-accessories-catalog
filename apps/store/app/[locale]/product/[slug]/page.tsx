import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { getProduct, getRelated, getPostsByCategory, getReviews } from '@/lib/queries';
import { productJsonLd } from '@/lib/seo';
import { egp, discountPct, whatsappLink } from '@/lib/format';
import ProductCard from '@/components/ProductCard';
import AddToCartButton from '@/components/AddToCartButton';
import ProductGallery from '@/components/ProductGallery';
import ProductReviews from '@/components/ProductReviews';

export const revalidate = 120;
export const dynamicParams = true;

export async function generateMetadata({ params }: any) {
  const p = await getProduct(params.slug);
  if (!p) return {};
  const ar = params.locale === 'ar';
  return {
    title: ar ? p.seo_title_ar ?? p.name_ar : p.seo_title_en ?? p.name_en ?? p.name_ar,
    description: ar ? p.seo_desc_ar ?? p.desc_ar : p.seo_desc_en ?? p.desc_en,
    openGraph: { images: p.images?.map((i: any) => i.url) }
  };
}

export default async function ProductPage({ params }: any) {
  unstable_setRequestLocale(params.locale);
  const p = await getProduct(params.slug);
  if (!p) notFound();
  const t = await getTranslations({ locale: params.locale, namespace: 'product' });
  const tb = await getTranslations({ locale: params.locale, namespace: 'blog' });
  const locale = params.locale;
  const ar = locale === 'ar';
  const name = ar ? p.name_ar : p.name_en ?? p.name_ar;
  const price = p.sale_price ?? p.price_egp;
  const related = await getRelated(p.category_id, p.id);
  const posts = await getPostsByCategory(p.category_slug ?? '', 2);
  const reviews = await getReviews(p.id);

  return (
    <div className="container section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(p, locale, reviews)) }} />
      <nav style={{ fontSize:'.8rem', color:'var(--color-text-3)', marginBottom:'20px' }}>
        <Link href={`/${locale}`} style={{ color:'inherit' }}>{ar ? 'المتجر' : 'Shop'}</Link> / <span>{name}</span>
      </nav>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'40px' }}>
        {/* Gallery */}
        <ProductGallery images={p.images} name={name} />

        {/* Info */}
        <div style={{ display:'grid', gap:'16px', alignContent:'start' }}>
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
            {p.sale_price && <span className="chip chip-sale">{t('sale')} {discountPct(p.price_egp, p.sale_price)}%</span>}
            <span className="chip">{t('code')}: {p.code}</span>
            {p.stock > 0 ? <span className="chip chip-stock">{t('stockIn')} ({p.stock})</span>
                         : <span className="chip chip-out">{t('stockOut')}</span>}
          </div>
          <h1 style={{ fontSize:'var(--fs-h1)', margin:0, lineHeight:1.3 }}>{name}</h1>
          {p.rating_count > 0 && (
            <div style={{ color:'var(--brand-gold)', fontWeight:700 }}>★ {p.rating_avg} ({p.rating_count} {t('reviews')})</div>
          )}
          <div style={{ display:'flex', alignItems:'baseline', gap:'12px' }}>
            <span className="price" style={{ fontSize:'1.8rem', color: p.sale_price ? 'var(--color-sale)' : 'var(--color-text)' }}>
              {egp(price, locale)}</span>
            {p.sale_price && <span className="price-old" style={{ fontSize:'1.1rem' }}>{egp(p.price_egp, locale)}</span>}
          </div>
          <p style={{ color:'var(--color-text-2)', lineHeight:1.9, margin:0 }}>{ar ? p.desc_ar : p.desc_en ?? p.desc_ar}</p>

          <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
            <AddToCartButton p={p} />
            <a className="btn btn-outline" target="_blank" rel="noopener"
              href={whatsappLink('01140030036', `أريد طلب: ${p.code} - ${p.name_ar} | ${price} ج.م`)}>
              {t('orderWhats')}
            </a>
          </div>

          {/* Specs */}
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.9rem' }}>
            <tbody>
              {[['الماركة', p.brand], ['الخامة', p.material], ['الحمولة', p.load_kg && `${p.load_kg} كجم`],
                ['الوزن', p.weight_kg && `${p.weight_kg} كجم`], ['الألوان', p.colors?.join('، ')]]
                .filter(([,v]) => v).map(([k,v]: any) => (
                <tr key={k} style={{ borderBottom:'1px solid var(--color-line)' }}>
                  <td style={{ padding:'10px 0', color:'var(--color-text-3)', width:'120px' }}>{k}</td>
                  <td style={{ padding:'10px 0', fontWeight:600 }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Reviews & Ratings */}
      <ProductReviews
        productId={p.id}
        productName={name}
        initialReviews={reviews}
        initialAvg={Number(p.rating_avg ?? 0)}
        initialCount={Number(p.rating_count ?? 0)}
      />

      {/* Related + articles */}
      <section style={{ marginTop:'64px' }}>
        <h2 className="sec-title">{t('related')}</h2>
        <div className="pgrid">{related.map((r: any) => <ProductCard key={r.id} p={r} />)}</div>
      </section>
      {posts.length > 0 && (
        <section style={{ marginTop:'48px' }}>
          <h2 className="sec-title">{tb('title')}</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'16px' }}>
            {posts.map((post: any) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="card" style={{ padding:'20px', textDecoration:'none' }}>
                <div style={{ fontWeight:700, color:'var(--color-text)', marginBottom:'8px' }}>{post.title_ar}</div>
                <div style={{ fontSize:'.85rem', color:'var(--color-text-2)' }} className="line-clamp-2">{post.excerpt_ar}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
