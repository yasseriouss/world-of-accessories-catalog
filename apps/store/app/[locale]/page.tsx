import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { getFeatured, getBestSellers, getCategories, getBanners } from '@/lib/queries';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export const revalidate = 60; // ISR

export default async function MarketHome({ params: { locale } }: any) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'nav' });
  const [featured, best, cats, heroes] = await Promise.all([
    getFeatured(8), getBestSellers(8), getCategories(), getBanners('store_hero')]);

  return (<>
    {/* Hero banner carousel */}
    {heroes.length > 0 && (
      <section className="container" style={{ paddingTop:'24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'16px' }}>
          {heroes.slice(0,2).map((b: any) => (
            <Link key={b.id} href={b.link_url ?? '#'} style={{ position:'relative', borderRadius:'var(--r-lg)',
              overflow:'hidden', minHeight:'200px', display:'flex', alignItems:'flex-end', padding:'24px',
              background:'linear-gradient(120deg, #1d1b17, #3a3220)', color:'#fff', textDecoration:'none' }}>
              <div>
                {b.tag_ar && <span className="chip" style={{ marginBottom:'8px' }}>{b.tag_ar}</span>}
                <h2 style={{ margin:'8px 0 0', fontSize:'1.4rem' }}>{b.text_ar}</h2>
              </div>
            </Link>
          ))}
        </div>
      </section>
    )}

    {/* Worlds / categories */}
    <section className="section">
      <div className="container">
        <div className="eyebrow">WOA</div>
        <h2 className="sec-title">{t('kitchens')} · {t('dressing')} · {t('handles')} · {t('mechanisms')}</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'12px' }}>
          {cats.filter((c: any) => !c.parent_id).map((c: any) => (
            <Link key={c.id} href={`/${locale}/catalog?category=${c.slug}`} className="card"
              style={{ padding:'20px 16px', textAlign:'center', fontWeight:600, color:'var(--color-text)',
                textDecoration:'none', display:'grid', gap:'8px', justifyItems:'center' }}>
              <span style={{ fontSize:'1.6rem' }}>◆</span>
              {locale === 'ar' ? c.name_ar : c.name_en ?? c.name_ar}
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* Featured */}
    <section className="section" style={{ paddingTop:0 }}>
      <div className="container">
        <h2 className="sec-title">✦ {t('market')}</h2>
        <div className="pgrid">
          {featured.map((p: any) => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>

    {/* Best sellers */}
    <section className="section" style={{ paddingTop:0 }}>
      <div className="container">
        <h2 className="sec-title">🔥 {t('market')} — Best Sellers</h2>
        <div className="pgrid">
          {best.map((p: any) => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  </>);
}
