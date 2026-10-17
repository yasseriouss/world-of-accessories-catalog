'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { egp } from '@/lib/format';

type Order = { order_no: string; status: string; total_egp: number; created_at: string;
  order_items: { qty: number; name_ar: string; unit_price: number }[] };
const STATUS: Record<string, string> = { new:'جديد', confirmed:'مؤكد', packed:'جاري التجهيز', shipped:'تم الشحن', delivered:'تم التسليم', cancelled:'ملغي' };

export default function AccountPage() {
  const t = useTranslations('common');
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [err, setErr] = useState('');

  async function track(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/orders/track?phone=${fd.get('phone')}&order_no=${fd.get('order_no')}`);
    const json = await res.json();
    if (json.ok) { setOrders([json.data]); setErr(''); }
    else { setOrders(null); setErr(json.error); }
  }

  return (
    <div className="container section" style={{ maxWidth:'640px' }}>
      <h1 style={{ fontSize:'var(--fs-h2)' }}>حسابي — تتبع الطلب</h1>
      <form onSubmit={track} style={{ display:'grid', gap:'12px', margin:'24px 0' }}>
        <input name="phone" required className="input" placeholder="رقم الموبايل" pattern="01[0-9]{9}" dir="ltr" />
        <input name="order_no" required className="input" placeholder="رقم الطلب (WOA-...)" dir="ltr" />
        <button className="btn btn-dark">تتبع</button>
      </form>
      {err && <p style={{ color:'var(--color-danger)' }}>{err}</p>}
      {orders?.map(o => (
        <div key={o.order_no} className="card" style={{ padding:'20px', marginBottom:'12px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'8px' }}>
            <strong>{o.order_no}</strong>
            <span className="chip chip-stock">{STATUS[o.status] ?? o.status}</span>
          </div>
          <div style={{ fontSize:'.85rem', color:'var(--color-text-3)', margin:'6px 0' }}>
            {new Date(o.created_at).toLocaleDateString('ar-EG')}</div>
          {o.order_items.map((i, k) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:'.9rem', padding:'4px 0' }}>
              <span>{i.name_ar} × {i.qty}</span><span className="price">{egp(i.unit_price * i.qty, 'ar')}</span>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', fontWeight:800, marginTop:'8px',
            paddingTop:'8px', borderTop:'1px solid var(--color-line)' }}>
            <span>الإجمالي</span><span className="price">{egp(o.total_egp, 'ar')}</span></div>
        </div>
      ))}
    </div>
  );
}
