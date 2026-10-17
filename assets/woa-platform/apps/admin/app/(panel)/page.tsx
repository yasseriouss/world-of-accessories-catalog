import Link from 'next/link';
import { supabaseServer } from '../../lib/supabase-server';
import { egp } from '../../lib/format';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const supabase = supabaseServer();
  const since = new Date(Date.now() - 30 * 864e5).toISOString();

  const [
    { count: productsCount }, { count: outOfStock }, { count: ordersMonth },
    { data: revenueAgg }, { data: newOrders }, { data: b2bNew }, { data: top },
    { count: postsCount }
  ] = await Promise.all([
    supabase.from('products').select('id', { count:'exact', head:true }).eq('is_active', true),
    supabase.from('products').select('id', { count:'exact', head:true }).eq('is_active', true).lte('stock', 0),
    supabase.from('orders').select('id', { count:'exact', head:true }).gte('created_at', since),
    supabase.from('orders').select('total_egp').gte('created_at', since)
      .not('status', 'in', '("cancelled")'),
    supabase.from('orders').select('order_no, customer_name, total_egp, status, created_at')
      .eq('status', 'new').order('created_at', { ascending: false }).limit(6),
    supabase.from('b2b_quotes').select('id', { count:'exact', head:true }).eq('status', 'new'),
    supabase.from('products').select('name_ar, code, sold_count, stock')
      .order('sold_count', { ascending: false }).limit(5),
    supabase.from('posts').select('id', { count:'exact', head:true }).eq('status', 'published')
  ]);

  const revenue = (revenueAgg ?? []).reduce((s: number, o: any) => s + Number(o.total_egp), 0);
  const STATUS: Record<string,string> = { new:'جديد', confirmed:'مؤكد', packed:'تجهيز', shipped:'شحن', delivered:'تم التسليم', cancelled:'ملغي' };

  return (
    <div style={{ display:'grid', gap:'24px' }}>
      <h1 style={{ fontSize:'1.5rem' }}>لوحة القيادة</h1>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'16px' }}>
        <div className="stat-card"><div className="n">{revenue ? egp(revenue,'ar') : '—'}</div><div className="l">مبيعات آخر 30 يوم</div></div>
        <div className="stat-card"><div className="n">{ordersMonth}</div><div className="l">طلبات آخر 30 يوم</div></div>
        <div className="stat-card"><div className="n">{productsCount}</div><div className="l">منتج نشط</div></div>
        <div className="stat-card"><div className="n" style={{ color:'var(--color-danger)' }}>{outOfStock}</div><div className="l">نفد من المخزون</div></div>
        <Link href="/b2b" className="stat-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="n" style={{ color: 'var(--color-accent)' }}>{b2bNew}</div>
          <div className="l">طلبات B2B جديدة ←</div>
        </Link>
        <div className="stat-card"><div className="n">{postsCount}</div><div className="l">مقال منشور</div></div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:'24px' }} className="dash-grid">
        <section className="card" style={{ padding:'20px' }}>
          <h2 style={{ fontSize:'1.1rem', marginBottom:'14px' }}>أحدث الطلبات الجديدة</h2>
          {newOrders?.length === 0 && <p style={{ color:'var(--color-text-3)', fontSize:'.9rem' }}>لا توجد طلبات جديدة</p>}
          <table className="admin"><thead><tr><th>رقم الطلب</th><th>العميل</th><th>الإجمالي</th><th>الحالة</th></tr></thead>
            <tbody>{newOrders?.map((o: any) => (
              <tr key={o.order_no}>
                <td><a href={`/orders?q=${o.order_no}`} style={{ color:'var(--color-accent)', fontWeight:600 }}>{o.order_no}</a></td>
                <td>{o.customer_name}</td><td className="price">{egp(o.total_egp,'ar')}</td>
                <td><span className="chip chip-stock">{STATUS[o.status]}</span></td>
              </tr>))}
            </tbody></table>
        </section>

        <section className="card" style={{ padding:'20px' }}>
          <h2 style={{ fontSize:'1.1rem', marginBottom:'14px' }}>الأكثر مبيعاً</h2>
          <table className="admin"><thead><tr><th>المنتج</th><th>المبيعات</th><th>المخزون</th></tr></thead>
            <tbody>{top?.map((p: any) => (
              <tr key={p.code}>
                <td>{p.name_ar}<div style={{ fontSize:'.75rem', color:'var(--color-text-3)' }}>{p.code}</div></td>
                <td className="price">{p.sold_count}</td>
                <td>{p.stock <= 0 ? <span className="chip chip-out">نفد</span> : p.stock}</td>
              </tr>))}
            </tbody></table>
        </section>
      </div>
    </div>
  );
}
