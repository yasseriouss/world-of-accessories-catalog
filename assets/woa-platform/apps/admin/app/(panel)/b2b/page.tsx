import { supabaseServer } from '../../../lib/supabase-server';
import B2BActions from './B2BActions';

export const dynamic = 'force-dynamic';

const STATUS_MAP: Record<string, { label: string; chipClass: string }> = {
  new: { label: 'طلب جديد', chipClass: 'chip-sale' },
  contacted: { label: 'تم التواصل', chipClass: '' },
  quoted: { label: 'عرض سعر', chipClass: '' },
  won: { label: 'تم التعاقد', chipClass: 'chip-stock' },
  lost: { label: 'ملغي', chipClass: 'chip-out' },
};

export default async function B2BQuotesPage({ searchParams }: any) {
  const supabase = supabaseServer();
  let qb = supabase
    .from('b2b_quotes')
    .select('id, company, contact, phone, email, governorate, details, qty_estimate, status, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  if (searchParams?.q) {
    qb = qb.or(`company.ilike.%${searchParams.q}%,contact.ilike.%${searchParams.q}%,phone.ilike.%${searchParams.q}%`);
  }
  if (searchParams?.status) {
    qb = qb.eq('status', searchParams.status);
  }

  const { data: quotes } = await qb;

  // Counts for summary tabs
  const { data: allQuotes } = await supabase.from('b2b_quotes').select('status');
  const countNew = allQuotes?.filter((q: any) => q.status === 'new').length || 0;
  const countWon = allQuotes?.filter((q: any) => q.status === 'won').length || 0;

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>طلبات الجملة والمصانع (B2B)</h1>
          <p style={{ color: 'var(--color-text-3)', fontSize: '.88rem', marginTop: '4px' }}>
            طلبات عروض الأسعار والكميات الكبيرة من مصنعي المطابخ ومهندسي الديكور ({quotes?.length || 0})
            {countNew > 0 && <span className="chip chip-sale" style={{ marginInlineStart: '8px' }}>{countNew} جديد بحاجة للمتابعة</span>}
          </p>
        </div>

        <form style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <input
            name="q"
            className="input"
            placeholder="بحث بشركة، اسم، أو هاتف"
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
            {Object.entries(STATUS_MAP).map(([val, { label }]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
          <button className="btn btn-dark btn-sm">تصفية</button>
        </form>
      </div>

      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        <table className="admin">
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>الشركة / الورشة</th>
              <th>المسؤول</th>
              <th>الهاتف</th>
              <th>المحافظة</th>
              <th>الكمية المطلوبة</th>
              <th>التفاصيل</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {(!quotes || quotes.length === 0) ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-3)' }}>
                  لا توجد طلبات عروض أسعار تطابق البحث الحالي
                </td>
              </tr>
            ) : (
              quotes.map((q: any) => {
                const s = STATUS_MAP[q.status] || { label: q.status, chipClass: '' };
                return (
                  <tr key={q.id}>
                    <td style={{ fontSize: '.8rem', color: 'var(--color-text-3)', whiteSpace: 'nowrap' }}>
                      {new Date(q.created_at).toLocaleDateString('ar-EG', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td style={{ fontWeight: 600 }}>{q.company}</td>
                    <td>
                      <div>{q.contact}</div>
                      {q.email && (
                        <div style={{ fontSize: '.75rem', color: 'var(--color-text-3)' }}>
                          {q.email}
                        </div>
                      )}
                    </td>
                    <td dir="ltr" style={{ textAlign: 'end', fontWeight: 500 }}>
                      {q.phone}
                    </td>
                    <td>{q.governorate || '—'}</td>
                    <td>
                      <span className="chip" style={{ fontSize: '.78rem' }}>
                        {q.qty_estimate || 'غير محدد'}
                      </span>
                    </td>
                    <td style={{ maxWidth: '240px', fontSize: '.82rem', lineHeight: 1.4 }}>
                      {q.details || '—'}
                    </td>
                    <td>
                      <span className={`chip ${s.chipClass}`}>{s.label}</span>
                    </td>
                    <td>
                      <B2BActions id={q.id} status={q.status} phone={q.phone} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
