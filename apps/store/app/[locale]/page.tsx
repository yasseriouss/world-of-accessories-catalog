import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { getFeatured, getBestSellers, getCategories, getBanners } from '@/lib/queries';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export const revalidate = 60; // ISR

function getCategoryIcon(slug: string) {
  if (slug.includes('kitchen') || slug.includes('مطابخ')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28" aria-hidden="true">
        <path d="M3 3h18v18H3z" />
        <path d="M3 9h18M9 21V9" />
        <circle cx="6" cy="15" r="1" fill="currentColor" />
        <circle cx="15" cy="15" r="1" fill="currentColor" />
      </svg>
    );
  }
  if (slug.includes('dressing') || slug.includes('wardrobe') || slug.includes('دريسينج')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28" aria-hidden="true">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="9" y1="12" x2="10" y2="12" />
        <line x1="14" y1="12" x2="15" y2="12" />
      </svg>
    );
  }
  if (slug.includes('handle') || slug.includes('مقابض')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28" aria-hidden="true">
        <path d="M6 4h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
        <path d="M9 10v10M15 10v10" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export default async function MarketHome({ params: { locale } }: any) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'nav' });
  const [featured, best, cats, heroes] = await Promise.all([
    getFeatured(8), getBestSellers(8), getCategories(), getBanners('store_hero')]);

  return (
    <main id="main-content">
      {/* Hero section with semantic H1 */}
      <section className="container" style={{ paddingTop:'32px', paddingBottom:'16px' }}>
        <h1 className="sec-title" style={{ fontSize:'var(--fs-h1)', margin:'0 0 8px' }}>
          {locale === 'ar' ? 'عالم الاكسسوار | متجر إكسسوارات الأثاث والمطابخ' : 'WOA | Architectural Furniture & Kitchen Hardware'}
        </h1>
        <p style={{ color:'var(--color-text-2)', fontSize:'1.05rem', margin:'0 0 24px', maxWidth:'720px' }}>
          {locale === 'ar'
            ? 'أنظمة الحركة الهيدروليكية، مفصلات 3D، سكك الأدراج المخفية، وإكسسوارات الدريسينج المعتمدة للمصانع والمنازل الراقية.'
            : 'Precision hydraulic motion systems, 3D concealed hinges, tandem slides, and certified dressing accessories.'}
        </p>

        {heroes.length > 0 && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'16px' }}>
            {heroes.slice(0,2).map((b: any) => (
              <Link key={b.id} href={b.link_url ?? '#'} style={{ position:'relative', borderRadius:'var(--r-md)',
                overflow:'hidden', minHeight:'200px', display:'flex', alignItems:'flex-end', padding:'24px',
                background:'linear-gradient(120deg, #1d1b17, #3a3220)', color:'#fff', textDecoration:'none' }}>
                <div>
                  {b.tag_ar && <span className="chip" style={{ marginBottom:'8px', color: 'var(--brand-gold)' }}>{locale === 'ar' ? b.tag_ar : (b.tag_en || b.tag_ar)}</span>}
                  <h2 style={{ margin:'8px 0 0', fontSize:'1.4rem' }}>{locale === 'ar' ? b.text_ar : (b.text_en || b.text_ar)}</h2>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Worlds / categories */}
      <section className="section">
        <div className="container">
          <h2 className="sec-title">
            {locale === 'ar' ? 'أقسام الإكسسوارات المعمارية' : 'Hardware Categories'}
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'16px' }}>
            {cats.filter((c: any) => !c.parent_id).map((c: any) => (
              <Link
                key={c.id}
                href={`/${locale}/catalog?category=${c.slug}`}
                className="card"
                style={{
                  padding:'24px 16px',
                  textAlign:'center',
                  fontWeight:600,
                  color:'var(--color-text)',
                  textDecoration:'none',
                  display:'grid',
                  gap:'12px',
                  justifyItems:'center',
                  borderRadius:'var(--r-md)'
                }}
              >
                <div style={{ color:'var(--color-accent)' }}>
                  {getCategoryIcon(c.slug)}
                </div>
                <span>{locale === 'ar' ? c.name_ar : (c.name_en || c.name_ar)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" style={{ paddingTop:0 }}>
        <div className="container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'20px', flexWrap:'wrap', gap:'12px' }}>
            <h2 className="sec-title" style={{ margin:0 }}>
              {locale === 'ar' ? 'تشكيلة مختارة للمهندسين والمصانع' : 'Featured Architectural Hardware'}
            </h2>
            <Link href={`/${locale}/catalog`} style={{ color:'var(--color-accent)', fontWeight:600, fontSize:'0.9rem', textDecoration:'none' }}>
              {locale === 'ar' ? 'عرض الكتالوج كامل ←' : 'View Full Catalog →'}
            </Link>
          </div>
          <div className="pgrid">
            {featured.map((p: any) => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* Best sellers */}
      <section className="section" style={{ paddingTop:0 }}>
        <div className="container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'20px', flexWrap:'wrap', gap:'12px' }}>
            <h2 className="sec-title" style={{ margin:0 }}>
              {locale === 'ar' ? 'الأكثر طلباً للمشاريع والمنازل' : 'Top Specified & Best Sellers'}
            </h2>
            <Link href={`/${locale}/catalog?sort=best`} style={{ color:'var(--color-accent)', fontWeight:600, fontSize:'0.9rem', textDecoration:'none' }}>
              {locale === 'ar' ? 'الأعلى مبيعاً ←' : 'Top Sellers →'}
            </Link>
          </div>
          <div className="pgrid">
            {best.map((p: any) => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
