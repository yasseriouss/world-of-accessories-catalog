'use client';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { egp, intlLocale } from '@/lib/format';
import { apiErrorText } from '@/lib/api-errors';

type Order = { order_no: string; status: string; total_egp: number; created_at: string;
  order_items: { qty: number; name_ar: string; unit_price: number }[] };

export default function AccountPage() {
  const locale = useLocale();
  const t = useTranslations('account');
  const tErr = useTranslations('errors');
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [err, setErr] = useState('');

  async function track(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const qs = new URLSearchParams({ phone: String(fd.get('phone') ?? ''), order_no: String(fd.get('order_no') ?? '') });
    try {
      const json = await (await fetch(`/api/orders/track?${qs}`)).json();
      if (json.ok) { setOrders([json.data]); setErr(''); }
      else { setOrders(null); setErr(apiErrorText(tErr, json, 'order_not_found')); }
    } catch {
      setOrders(null); setErr(tErr('generic'));
    }
  }

  const statusLabel = (s: string) => (t.has(`status.${s}`) ? t(`status.${s}`) : s);

  return (
    <div className="container section" style={{ maxWidth:'640px' }}>
      <h1 style={{ fontSize:'var(--fs-h2)' }}>{t('title')}</h1>
      <form onSubmit={track} style={{ display:'grid', gap:'12px', margin:'24px 0' }}>
        <input name="phone" required className="input" placeholder={t('phone')} aria-label={t('phone')} pattern="01[0-9]{9}" dir="ltr" />
        <input name="order_no" required className="input" placeholder={t('orderNo')} aria-label={t('orderNo')} dir="ltr" />
        <button className="btn btn-dark">{t('track')}</button>
      </form>
      {err && <p role="alert" style={{ color:'var(--color-danger)' }}>{err}</p>}
      {orders?.map(o => (
        <div key={o.order_no} className="card" style={{ padding:'20px', marginBottom:'12px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'8px' }}>
            <strong>{o.order_no}</strong>
            <span className="chip chip-stock">{statusLabel(o.status)}</span>
          </div>
          <div style={{ fontSize:'.85rem', color:'var(--color-text-3)', margin:'6px 0' }}>
            {new Date(o.created_at).toLocaleDateString(intlLocale(locale))}</div>
          {o.order_items.map((i, k) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:'.9rem', padding:'4px 0' }}>
              <span>{i.name_ar} × {i.qty}</span><span className="price">{egp(i.unit_price * i.qty, locale)}</span>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', fontWeight:800, marginTop:'8px',
            paddingTop:'8px', borderTop:'1px solid var(--color-line)' }}>
            <span>{t('total')}</span><span className="price">{egp(o.total_egp, locale)}</span></div>
        </div>
      ))}
    </div>
  );
}
