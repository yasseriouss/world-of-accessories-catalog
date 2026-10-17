import { getTranslations } from 'next-intl/server';
import { getProducts, getCategories } from '../../lib/queries';
import ProductCard from '../../components/ProductCard';

export const revalidate = 60;

export async function generateMetadata({ params: { locale }, searchParams }: any) {
  const q = searchParams.q ?? '';
  return {
    title: q ? `نتائج البحث: ${q}` : 'الكتالوج الكامل',
    description: 'تصفح تشكيلة إكسسوارات الأثاث والمطابخ كاملة مع فلاتر السعر والقسم.'
  };
}

export default async function Catalog({ params: { locale }, searchParams }: any) {
  const tc = await getTranslations({ locale, namespace: 'common' });
  const { products, total, pages } = await getProducts({
    category: searchParams.category, q: searchParams.q,
    sort: searchParams.sort, min: searchParams.min ? +searchParams.min : undefined,
    max: searchParams.max ? +searchParams.max : undefined,
    page: searchParams.page ? +searchParams.page : 1 });
  const cats = await getCategories();
  const sp = new URLSearchParams(searchParams);

  return (
    <div className="container section" style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:'32px' }}
      className-mobile="">
      {/* Filters — becomes drawer on mobile via CSS */}
      <aside className="filters" style={{ position:'sticky', top:'calc(var(--header-h) + 16px)', alignSelf:'start',
        display:'grid', gap:'20px' }}>
        <form method="GET" style={{ display:'grid', gap:'16px' }}>
          <div>
            <label className="lbl">{tc('all')}</label>
            <select name="category" className="input" defaultValue={searchParams.category ?? ''}>
              <option value="">{tc('all')}</option>
              {cats.filter((c:any)=>!c.parent_id).map((c:any) =>
                <option key={c.id} value={c.slug}>{locale==='ar'?c.name_ar:c.name_en}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl">{tc('sort')}</label>
            <select name="sort" className="input" defaultValue={searchParams.sort ?? ''}>
              <option value="">{tc('newest')}</option>
              <option value="price_asc">{tc('priceAsc')}</option>
              <option value="price_desc">{tc('priceDesc')}</option>
              <option value="best">{tc('bestSeller')}</option>
            </select>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
            <input name="min" type="number" className="input" placeholder={tc('from')} defaultValue={searchParams.min} />
            <input name="max" type="number" className="input" placeholder={tc('to')} defaultValue={searchParams.max} />
          </div>
          {searchParams.q && <input type="hidden" name="q" value={searchParams.q} />}
          <button className="btn btn-dark" type="submit">{tc('apply')}</button>
        </form>
      </aside>

      <div>
        <div style={{ marginBottom:'20px', color:'var(--color-text-2)', fontSize:'.9rem' }}>{total} منتج</div>
        {products.length === 0
          ? <p style={{ color:'var(--color-text-3)' }}>لا توجد نتائج — جرّب تعديل الفلاتر</p>
          : <div className="pgrid">{products.map((p:any) => <ProductCard key={p.id} p={p} />)}</div>}
        {pages > 1 && (
          <nav style={{ display:'flex', gap:'8px', justifyContent:'center', marginTop:'32px' }} aria-label="pagination">
            {Array.from({length: pages}, (_,i) => {
              const p = i+1; sp.set('page', String(p));
              return <a key={p} href={`?${sp}`} className="btn btn-sm"
                style={p === +(searchParams.page ?? 1) ? { background:'var(--color-text)', color:'var(--color-bg)' } : { border:'1px solid var(--color-line)' }}>{p}</a>;
            })}
          </nav>
        )}
      </div>
    </div>
  );
}
