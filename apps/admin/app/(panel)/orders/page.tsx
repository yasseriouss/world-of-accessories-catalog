import { supabaseServer } from '@/lib/supabase-server';
import { egp } from '@/lib/format';
import OrderActions from './OrderActions';
import { t, tOr } from '@/lib/i18n';
import { ORDER_STATUSES, orderStatusLabel } from '@/lib/order-status';

export const dynamic = 'force-dynamic';


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
        <h1 style={{ fontSize:'1.5rem' }}>{t('nav.orders')}</h1>
        <form style={{ display:'flex', gap:'8px' }}>
          <input name="q" className="input" placeholder={t('orders.orderNo')} defaultValue={searchParams.q} style={{ width:'180px' }} />
          <select name="status" className="input" defaultValue={searchParams.status ?? ''} style={{ width:'140px' }}>
            <option value="">{t('common.allStatuses')}</option>
            {ORDER_STATUSES.map((k) => <option key={k} value={k}>{orderStatusLabel(k)}</option>)}
          </select>
          <button className="btn btn-dark btn-sm">{t('common.search')}</button>
        </form>
      </div>
      <div className="table-responsive">
        <table className="admin">
          <thead><tr><th>{t('orders.order')}</th><th>{t('common.customer')}</th><th>{t('common.phone')}</th><th>{t('common.governorate')}</th><th>{t('common.total')}</th><th>{t('orders.payment')}</th><th>{t('common.status')}</th><th></th></tr></thead>
          <tbody>{orders?.map((o: any) => (
            <tr key={o.id}>
              <td style={{ fontWeight:600 }}>{o.order_no}<div style={{ fontSize:'.75rem', color:'var(--color-text-3)' }}>
                {new Date(o.created_at).toLocaleDateString('ar-EG')}</div></td>
              <td>{o.customer_name}</td>
              <td dir="ltr" style={{ textAlign:'end' }}>{o.customer_phone}</td>
              <td>{o.governorate}</td>
              <td className="price">{egp(o.total_egp,'ar')}</td>
              <td style={{ fontSize:'.8rem' }}>{tOr(`payment.${o.payment}`, o.payment)}</td>
              <td><span className={`chip ${o.status==='cancelled'?'chip-out':'chip-stock'}`}>{orderStatusLabel(o.status)}</span></td>
              <td><OrderActions id={o.id} status={o.status} /></td>
            </tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

