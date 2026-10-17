import { supabaseServer } from '@/lib/supabase-server';
import { egp } from '@/lib/format';
import OrderActions from './OrderActions';

export const dynamic = 'force-dynamic';

const STATUS: Record<string,string> = { new:'جديد', confirmed:'مؤكد', packed:'تجهيز', shipped:'شحن', delivered:'تم التسليم', cancelled:'ملغي' };

export default async function OrdersPage({ searchParams }: any) {
  const supabase = supabaseServer();
  let qb = supabase.from('orders').select('id, order_no, customer_name, customer_phone, governorate, total_egp, payment, status, created_at')
    .order('created_at', { ascending: false }).limit(100);
  if (searchParams.q) qb = qb.eq('order_no', searchParams.q);
  if (searchParams.status) qb = qb.eq('status', searchParams.status);
  const { data: orders } = await qb;

  return (
    <div style={{ display:'grid', gap:'20px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
        <h1 style={{ fontSize:'1.5rem' }}>الطلبات</h1>
        <form style={{ display:'flex', gap:'8px' }}>
          <input name="q" className="input" placeholder="رقم الطلب" defaultValue={searchParams.q} style={{ width:'180px' }} />
          <select name="status" className="input" defaultValue={searchParams.status ?? ''} style={{ width:'140px' }}>
            <option value="">كل الحالات</option>
            {Object.entries(STATUS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <button className="btn btn-dark btn-sm">بحث</button>
        </form>
      </div>
      <div className="table-responsive">
        <table className="admin">
          <thead><tr><th>الطلب</th><th>العميل</th><th>الهاتف</th><th>المحافظة</th><th>الإجمالي</th><th>الدفع</th><th>الحالة</th><th></th></tr></thead>
          <tbody>{orders?.map((o: any) => (
            <tr key={o.id}>
              <td style={{ fontWeight:600 }}>{o.order_no}<div style={{ fontSize:'.75rem', color:'var(--color-text-3)' }}>
                {new Date(o.created_at).toLocaleDateString('ar-EG')}</div></td>
              <td>{o.customer_name}</td>
              <td dir="ltr" style={{ textAlign:'end' }}>{o.customer_phone}</td>
              <td>{o.governorate}</td>
              <td className="price">{egp(o.total_egp,'ar')}</td>
              <td style={{ fontSize:'.8rem' }}>{{cash_on_delivery:'COD', vodafone_cash:'VF Cash', instapay:'InstaPay', bank_transfer:'تحويل'}[o.payment as keyof any]}</td>
              <td><span className={`chip ${o.status==='cancelled'?'chip-out':'chip-stock'}`}>{STATUS[o.status]}</span></td>
              <td><OrderActions id={o.id} status={o.status} /></td>
            </tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

