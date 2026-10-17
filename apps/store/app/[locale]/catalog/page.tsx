import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/queries';
import ProductCard from '@/components/ProductCard';

export const revalidate = 60;

export async function generateMetadata({ params: { locale }, searchParams }: any) {
  const q = searchParams.q ?? '';
  const t = await getTranslations({ locale, namespace: 'catalog' });
  return {
    title: q ? `${t('searchResults', { q })} | WOA` : `${t('title')} | WOA`,
    description: t('subtitle'),
  };
}

export default async function Catalog({ params: { locale }, searchParams }: any) {
  unstable_setRequestLocale(locale);
  const tc = await getTranslations({ locale, namespace: 'common' });
  const t = await getTranslations({ locale, namespace: 'catalog' });

  const { products, total, pages } = await getProducts({
    category: searchParams.category,
    q: searchParams.q,
    sort: searchParams.sort,
    min: searchParams.min ? +searchParams.min : undefined,
    max: searchParams.max ? +searchParams.max : undefined,
    page: searchParams.page ? +searchParams.page : 1,
  });
  const cats = await getCategories();
  const sp = new URLSearchParams(searchParams);

  const hasActiveFilters = !!(
    searchParams.category ||
    searchParams.sort ||
    searchParams.min ||
    searchParams.max ||
    searchParams.q
  );

  return (
    <div className="container section" style={{ maxWidth: '100%', overflowX: 'hidden' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="sec-title" style={{ fontSize: 'var(--fs-h1)', margin: '0 0 8px' }}>
          {searchParams.q ? t('searchResults', { q: searchParams.q }) : t('title')}
        </h1>
        <p style={{ color: 'var(--color-text-2)', fontSize: '0.95rem', margin: 0 }}>
          {t('subtitle')}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: '32px',
          alignItems: 'start',
        }}
      >
        {/* Filters Sidebar */}
        <aside
          style={{
            background: 'var(--color-bg-elev)',
            border: '1px solid var(--color-line)',
            borderRadius: 'var(--r-md)',
            padding: '20px',
            display: 'grid',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
              {t('filters')}
            </h2>
            {hasActiveFilters && (
              <Link
                href={`/${locale}/catalog`}
                style={{ fontSize: '0.8rem', color: 'var(--color-sale)', textDecoration: 'underline' }}
              >
                {t('reset')}
              </Link>
            )}
          </div>

          <form method="GET" style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label htmlFor="filter-category" className="lbl">
                {t('category')}
              </label>
              <select
                id="filter-category"
                name="category"
                className="input"
                aria-label={t('selectCategory')}
                defaultValue={searchParams.category ?? ''}
              >
                <option value="">{tc('all')}</option>
                {cats
                  .filter((c: any) => !c.parent_id)
                  .map((c: any) => (
                    <option key={c.id} value={c.slug}>
                      {locale === 'ar' ? c.name_ar : c.name_en || c.name_ar}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-sort" className="lbl">
                {tc('sort')}
              </label>
              <select
                id="filter-sort"
                name="sort"
                className="input"
                aria-label={tc('sort')}
                defaultValue={searchParams.sort ?? ''}
              >
                <option value="">{tc('newest')}</option>
                <option value="price_asc">{tc('priceAsc')}</option>
                <option value="price_desc">{tc('priceDesc')}</option>
                <option value="best">{tc('bestSeller')}</option>
              </select>
            </div>

            <div>
              <span className="lbl">{t('priceRange')}</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label
                    htmlFor="filter-min"
                    style={{ fontSize: '0.75rem', color: 'var(--color-text-3)', display: 'block', marginBottom: '2px' }}
                  >
                    {tc('from')}
                  </label>
                  <input
                    id="filter-min"
                    name="min"
                    type="number"
                    className="input"
                    placeholder="0"
                    aria-label={t('minPrice')}
                    defaultValue={searchParams.min}
                  />
                </div>
                <div>
                  <label
                    htmlFor="filter-max"
                    style={{ fontSize: '0.75rem', color: 'var(--color-text-3)', display: 'block', marginBottom: '2px' }}
                  >
                    {tc('to')}
                  </label>
                  <input
                    id="filter-max"
                    name="max"
                    type="number"
                    className="input"
                    placeholder="5000"
                    aria-label={t('maxPrice')}
                    defaultValue={searchParams.max}
                  />
                </div>
              </div>
            </div>

            {searchParams.q && <input type="hidden" name="q" value={searchParams.q} />}

            <button className="btn btn-dark" type="submit" style={{ width: '100%', minHeight: '44px' }}>
              {tc('apply')}
            </button>
          </form>
        </aside>

        {/* Products Grid Column */}
        <div style={{ minWidth: 0, width: '100%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              color: 'var(--color-text-2)',
              fontSize: '0.9rem',
            }}
          >
            <span>{t('productsAvailable', { count: total })}</span>
          </div>

          {products.length === 0 ? (
            <div
              style={{
                background: 'var(--color-bg-elev)',
                border: '1px solid var(--color-line)',
                borderRadius: 'var(--r-md)',
                padding: '48px 24px',
                textAlign: 'center',
              }}
            >
              <p style={{ color: 'var(--color-text-2)', fontSize: '1.05rem', margin: '0 0 16px' }}>
                {t('noResults')}
              </p>
              <Link href={`/${locale}/catalog`} className="btn btn-outline btn-sm">
                {t('viewAll')}
              </Link>
            </div>
          ) : (
            <div className="pgrid" style={{ width: '100%' }}>
              {products.map((p: any, idx: number) => (
                <ProductCard key={p.id} p={p} priorityImage={idx < 4} />
              ))}
            </div>
          )}

          {pages > 1 && (
            <nav
              style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '36px', flexWrap: 'wrap' }}
              aria-label="pagination"
            >
              {Array.from({ length: pages }, (_, i) => {
                const p = i + 1;
                sp.set('page', String(p));
                const isCurrent = p === +(searchParams.page ?? 1);
                return (
                  <a
                    key={p}
                    href={`?${sp}`}
                    className="btn btn-sm"
                    style={{
                      minWidth: '44px',
                      minHeight: '44px',
                      background: isCurrent ? 'var(--color-text)' : 'var(--color-bg-elev)',
                      color: isCurrent ? 'var(--color-bg)' : 'var(--color-text)',
                      border: '1px solid var(--color-line)',
                    }}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {p}
                  </a>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
