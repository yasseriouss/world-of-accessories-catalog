'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useCart } from '@/lib/store-context';
import { egp } from '@/lib/format';

export default function CartPage() {
  const { items, setQty, remove, subtotal, savings } = useCart();
  const locale = useLocale();
  const t = useTranslations('cart');

  if (items.length === 0) return (
    <div className="container section" style={{ textAlign:'center', padding:'80px 0' }}>
      <p style={{ fontSize:'1.2rem', color:'var(--color-text-2)' }}>{t('empty')}</p>
      <Link href={`/${locale}/catalog`} className="btn btn-primary" style={{ marginTop:'16px' }}>{t('continue')}</Link>
    </div>
  );

  return (
    <div className="container section" style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:'32px' }} id="cart-grid">
      <div style={{ display:'grid', gap:'12px' }}>
        {items.map(i => (
          <div key={i.slug} className="card" style={{ padding:'12px', display:'flex', gap:'16px', alignItems:'center' }}>
            <div style={{ position:'relative', width:'80px', height:'80px', borderRadius:'var(--r-md)', overflow:'hidden', flex:'none' }}>
              {i.image && <Image src={i.image} alt={i.name_ar} fill sizes="80px" style={{ objectFit:'cover' }} />}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:600 }} className="line-clamp-2">{locale==='ar' ? i.name_ar : i.name_en ?? i.name_ar}</div>
              <div style={{ fontSize:'.8rem', color:'var(--color-text-3)' }}>{i.code}</div>
              <div className="price" style={{ marginTop:'4px' }}>{egp(i.sale ?? i.price, locale)}</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <button className="btn btn-outline btn-sm" onClick={() => setQty(i.slug, i.qty - 1)} aria-label="minus">−</button>
              <span style={{ minWidth:'24px', textAlign:'center', fontWeight:700 }}>{i.qty}</span>
              <button className="btn btn-outline btn-sm" onClick={() => setQty(i.slug, i.qty + 1)} disabled={i.qty >= i.stock} aria-label="plus">+</button>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => remove(i.slug)} aria-label="remove">✕</button>
          </div>
        ))}
      </div>

      <aside className="card" style={{ padding:'24px', height:'fit-content', position:'sticky', top:'calc(var(--header-h) + 16px)' }}>
        <h2 style={{ marginTop:0, fontSize:'1.2rem' }}>{t('title')}</h2>
        <div style={{ display:'grid', gap:'10px', fontSize:'.95rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span>{t('subtotal')}</span><span className="price">{egp(subtotal, locale)}</span></div>
          {savings > 0 && <div style={{ display:'flex', justifyContent:'space-between', color:'var(--color-success)' }}>
            <span>وفّرت</span><span className="price">-{egp(savings, locale)}</span></div>}
          <div style={{ display:'flex', justifyContent:'space-between', color:'var(--color-text-3)' }}>
            <span>{t('shipping')}</span><span>يُحسب عند إتمام الطلب</span></div>
          <hr style={{ border:'none', borderTop:'1px solid var(--color-line)' }} />
          <div style={{ display:'flex', justifyContent:'space-between', fontWeight:800, fontSize:'1.1rem' }}>
            <span>{t('total')}</span><span className="price">{egp(subtotal, locale)}</span></div>
        </div>
        <Link href={`/${locale}/checkout`} className="btn btn-primary btn-lg" style={{ width:'100%', marginTop:'16px' }}>{t('checkout')}</Link>
      </aside>
    </div>
  );
}
