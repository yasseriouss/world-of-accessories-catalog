import { supabaseServer } from '@/lib/supabase-server';
import { ReviewStatusToggle, ReviewDeleteButton } from './ReviewActions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ReviewsPage({ searchParams }: any) {
  const supabase = supabaseServer();
  let qb = supabase
    .from('reviews')
    .select('id, product_id, author_name, author_phone, rating, comment, is_approved, created_at, products(name_ar, code, slug)')
    .order('created_at', { ascending: false })
    .limit(100);

  if (searchParams?.q) {
    qb = qb.or(`author_name.ilike.%${searchParams.q}%,comment.ilike.%${searchParams.q}%`);
  }
  if (searchParams?.status === 'approved') {
    qb = qb.eq('is_approved', true);
  } else if (searchParams?.status === 'hidden') {
    qb = qb.eq('is_approved', false);
  }

  const { data: reviews } = await qb;

  // Stats
  const { data: allReviews } = await supabase.from('reviews').select('rating, is_approved');
  const totalCount = allReviews?.length || 0;
  const approvedCount = allReviews?.filter((r: any) => r.is_approved).length || 0;
  const hiddenCount = allReviews?.filter((r: any) => !r.is_approved).length || 0;
  const avgRating = totalCount > 0
    ? (allReviews!.reduce((sum: number, r: any) => sum + r.rating, 0) / totalCount).toFixed(1)
    : '0.0';

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>مراجعات وتقييمات المنتجات</h1>
          <p style={{ color: 'var(--color-text-3)', fontSize: '.88rem', marginTop: '4px' }}>
            إدارة آراء العملاء واعتماد التقييمات التي تظهر في المتجر ونتائج بحث جوجل ({totalCount})
          </p>
        </div>

        <form style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <input
            name="q"
            className="input"
            placeholder="بحث بالاسم أو التعليق..."
            defaultValue={searchParams?.q}
            style={{ width: '220px' }}
          />
          <select
            name="status"
            className="input"
            defaultValue={searchParams?.status ?? ''}
            style={{ width: '150px' }}
          >
            <option value="">كل الحالات</option>
            <option value="approved">معتمد فقط</option>
            <option value="hidden">محجوب فقط</option>
          </select>
          <button type="submit" className="btn btn-outline btn-sm">تصفية</button>
        </form>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '.82rem', color: 'var(--color-text-3)' }}>إجمالي المراجعات</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)', marginTop: '4px' }}>
            {totalCount}
          </div>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '.82rem', color: 'var(--color-text-3)' }}>متوسط التقييم العام</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-accent)', marginTop: '4px' }}>
            ★ {avgRating}
          </div>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '.82rem', color: 'var(--color-text-3)' }}>المراجعات المعتمدة</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#047857', marginTop: '4px' }}>
            {approvedCount}
          </div>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '.82rem', color: 'var(--color-text-3)' }}>المحجوبة أو المعلقة</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: hiddenCount > 0 ? '#B91C1C' : 'var(--color-text-3)', marginTop: '4px' }}>
            {hiddenCount}
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,.02)', borderBottom: '1px solid var(--color-line)', textAlign: 'right' }}>
                <th style={{ padding: '12px 16px' }}>المنتج</th>
                <th style={{ padding: '12px 16px' }}>العميل</th>
                <th style={{ padding: '12px 16px' }}>التقييم</th>
                <th style={{ padding: '12px 16px', maxWidth: '350px' }}>التعليق</th>
                <th style={{ padding: '12px 16px' }}>التاريخ</th>
                <th style={{ padding: '12px 16px' }}>الحالة</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>إجراء</th>
              </tr>
            </thead>
            <tbody>
              {(!reviews || reviews.length === 0) ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-3)' }}>
                    لا توجد مراجعات مسجلة
                  </td>
                </tr>
              ) : (
                reviews.map((r: any) => {
                  const product = r.products;
                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid var(--color-line)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        {product ? (
                          <a
                            href={`https://woa-market.vercel.app/ar/product/${product.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontWeight: 600, color: 'var(--color-accent)', textDecoration: 'none' }}
                          >
                            {product.name_ar}
                            <div style={{ fontSize: '.75rem', color: 'var(--color-text-3)' }}>{product.code}</div>
                          </a>
                        ) : (
                          <span style={{ color: 'var(--color-text-3)' }}>منتج محذوف</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600 }}>{r.author_name}</div>
                        {r.author_phone && (
                          <div style={{ fontSize: '.75rem', color: 'var(--color-text-3)', direction: 'ltr', textAlign: 'right' }}>
                            {r.author_phone}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '2px' }}>
                          {'★'.repeat(r.rating)}
                          <span style={{ color: 'var(--color-line)' }}>{'★'.repeat(Math.max(0, 5 - r.rating))}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', maxWidth: '350px', lineHeight: 1.6, color: 'var(--color-text-2)' }}>
                        {r.comment || <span style={{ color: 'var(--color-text-3)', fontStyle: 'italic' }}>بدون تعليق مكتوب</span>}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--color-text-3)', fontSize: '.8rem', whiteSpace: 'nowrap' }}>
                        {new Date(r.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <ReviewStatusToggle id={r.id} isApproved={r.is_approved} />
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <ReviewDeleteButton id={r.id} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

