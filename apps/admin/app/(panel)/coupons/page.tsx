import { supabaseServer } from '@/lib/supabase-server';
import { egp } from '@/lib/format';
import { NewCouponForm, CouponToggle } from './CouponForm';

export const dynamic = 'force-dynamic';

export default async function CouponsPage() {
  const supabase = supabaseServer();
  const { data: coupons } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>إدارة الكوبونات والخصومات</h1>
          <p style={{ color: 'var(--color-text-3)', fontSize: '.88rem', marginTop: '4px' }}>
            إنشاء وإدارة أكواد الخصم الترويجية لمتجر عالم الإكسسوارات ({coupons?.length || 0})
          </p>
        </div>

        <NewCouponForm />
      </div>

      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        <table className="admin">
          <thead>
            <tr>
              <th>كود الكوبون</th>
              <th>نوع الخصم</th>
              <th>القيمة</th>
              <th>الحد الأدنى للطلب</th>
              <th>مرات الاستخدام</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {!coupons || coupons.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-3)' }}>
                  لا توجد كوبونات مسجلة حالياً
                </td>
              </tr>
            ) : (
              coupons.map((c: any) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700, letterSpacing: '.5px', fontFamily: 'monospace', fontSize: '1rem' }}>
                    {c.code}
                  </td>
                  <td>{c.type === 'percent' ? 'نسبة مئوية' : 'مبلغ ثابت'}</td>
                  <td className="price">
                    {c.type === 'percent' ? `${c.value}%` : egp(c.value, 'ar')}
                  </td>
                  <td>{c.min_order ? egp(c.min_order, 'ar') : 'بدون حد أدنى'}</td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{c.used_count || 0}</span>
                    <span style={{ color: 'var(--color-text-3)', fontSize: '.8rem' }}>
                      {c.max_uses ? ` / ${c.max_uses}` : ' (غير محدود)'}
                    </span>
                  </td>
                  <td>
                    <CouponToggle id={c.id} isActive={c.is_active} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

