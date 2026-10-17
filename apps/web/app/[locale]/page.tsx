import Link from 'next/link';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { getCategories, getFeatured } from '@/lib/queries';
import { egp } from '@/lib/format';
import { SITE, storeHref } from '@/lib/site';

export const revalidate = 300;


const TRUST_ICONS = [
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
];

export default async function Home({ params: { locale } }: any) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'hero' });
  const tt = await getTranslations({ locale, namespace: 'trust' });
  const nav = await getTranslations({ locale, namespace: 'nav' });
  const tc = await getTranslations({ locale, namespace: 'contact' });
  const th = await getTranslations({ locale, namespace: 'home' });
  const stats = th.raw('stats') as { n: string; label: string }[];
  const ar = locale === 'ar';
  const [cats, featured] = await Promise.all([getCategories(), getFeatured(4)]);

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="container">
          <div className="eyebrow" style={{ color: 'var(--brand-gold-soft)' }}>
            {th('heroEyebrow', { year: new Date().getFullYear() })}
          </div>
          <h1>{t('title')}</h1>
          <p>{t('subtitle')}</p>
          <div style={{ display: 'flex', gap: '14px', marginTop: '32px', flexWrap: 'wrap' }}>
            <Link href={storeHref(locale)} className="btn btn-primary btn-lg">
              {t('cta1')}
            </Link>
            <Link
              href={`/${locale}/b2b`}
              className="btn btn-outline btn-lg"
              style={{ color: 'var(--color-inverse-text)', borderColor: 'var(--color-accent)' }}
            >
              {t('cta2')}
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Trust strip ===== */}
      <section className="section" style={{ paddingTop: '48px' }}>
        <div className="container">
          <div className="trust">
            {tt.raw('items').map((item: string, i: number) => (
              <div key={i} className="trust-item">
                <div className="ic">{TRUST_ICONS[i]}</div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Worlds ===== */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="eyebrow">{th('worldsEyebrow')}</div>
          <h2 className="sec-title">{t('worldsTitle')}</h2>
          <div className="world" style={{ marginTop: '28px' }}>
            {cats
              .filter((c: any) => !c.parent_id)
              .map((c: any) => {
                const descKey = `worlds.${c.slug}`;
                return (
                  <Link key={c.id} href={`/${locale}/world/${c.slug}`} className="world-card">
                    <h3>{ar ? c.name_ar : c.name_en ?? c.name_ar}</h3>
                    <p>{th.has(descKey) ? th(descKey) : ''}</p>
                    <span className="cta">{t('explore')}</span>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>

      {/* ===== Featured products (from store DB) ===== */}
      {featured.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <h2 className="sec-title" style={{ margin: 0 }}>
                {t('featuredShop')}
              </h2>
              <Link href={storeHref(locale)} style={{ color: 'var(--color-accent-text)', fontWeight: 700 }}>
                {t('fullShop')}
              </Link>
            </div>
            <div className="pgrid" style={{ marginTop: '24px' }}>
              {featured.map((p: any) => (
                <a
                  key={p.id}
                  href={storeHref(locale, `/product/${p.slug}`)}
                  className="card"
                  style={{ padding: '20px', textDecoration: 'none', display: 'grid', gap: '8px' }}
                >
                  <div style={{ fontSize: '.75rem', color: 'var(--color-text-3)' }}>{p.code}</div>
                  <div style={{ fontWeight: 600 }}>{ar ? p.name_ar : p.name_en ?? p.name_ar}</div>
                  <div className="price" style={{ color: 'var(--color-accent-text)' }}>
                    {egp(p.sale_price ?? p.price_egp, locale)}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Stats ===== */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
              gap: '16px',
              textAlign: 'center',
            }}
          >
            {stats.map((s) => (
              <div key={s.n} className="card" style={{ padding: '28px 16px' }}>
                <div
                  style={{
                    fontSize: '2.2rem',
                    fontWeight: 800,
                    color: 'var(--color-accent-text)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {s.n}
                </div>
                <div style={{ fontSize: '.9rem', color: 'var(--color-text-2)', marginTop: '6px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== B2B CTA ===== */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div
            style={{
              background: 'var(--color-inverse-bg)',
              color: 'var(--color-inverse-text)',
              borderRadius: 'var(--r-lg)',
              padding: 'clamp(32px,6vw,64px)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
              gap: '32px',
              alignItems: 'center',
            }}
          >
            <div>
              <h2 style={{ fontSize: 'var(--fs-h2)', marginBottom: '12px' }}>{t('b2bTitle')}</h2>
              <p style={{ color: 'var(--color-inverse-text-2)', lineHeight: 1.9 }}>{t('b2bSubtitle')}</p>
            </div>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link href={`/${locale}/b2b`} className="btn btn-primary btn-lg">
                {nav('b2b')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Showroom ===== */}
      <section className="section" id="contact" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="eyebrow">{th('showroomEyebrow')}</div>
          <h2 className="sec-title">{tc('showroom')}</h2>
          <p style={{ color: 'var(--color-text-2)', maxWidth: '520px' }}>{tc('address')}</p>
          <p style={{ color: 'var(--color-text-3)', fontSize: '.9rem', marginTop: '8px' }}>{tc('hours')}</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              {t('googleMaps')}
            </a>
            <a href={`tel:${SITE.phoneE164}`} className="btn btn-dark" dir="ltr">
              {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
