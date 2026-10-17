'use client';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useCart } from '../../lib/store-context';
import { egp } from '../../lib/format';

const GOVS = ["القاهرة","الجيزة","الإسكندرية","القليوبية","الدقهلية","الشرقية","الغربية","المنوفية","البحيرة","كفر الشيخ","دمياط","بورسعيد","الإسماعيلية","السويس","الفيوم","بني سويف","المنيا","أسيوط","سوهاج","قنا","الأقصر","أسوان","البحر الأحمر","مطروح","شمال سيناء","جنوب سيناء"];

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const locale = useLocale();
  const t = useTranslations('checkout');
  const tc = useTranslations('common');
  const [done, setDone] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [gov, setGov] = useState('');

  if (done) return (
    <div className="container section" style={{ textAlign:'center', padding:'80px 0' }}>
      <div style={{ fontSize:'3rem' }}>✓</div>
      <h1 style={{ fontSize:'var(--fs-h2)' }}>{t('success')}</h1>
      <p style={{ color:'var(--color-text-2)' }}>رقم طلبك: <strong>{done}</strong></p>
    </div>
  );

  if (items.length === 0) return (
    <div className="container section" style={{ textAlign:'center', padding:'80px 0' }}>
      <p style={{ color:'var(--color-text-2)' }}>السلة فارغة</p>
    </div>
  );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch('/api/orders', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: fd.get('name'), customer_phone: fd.get('phone'),
        governorate: fd.get('governorate'), city: fd.get('city'),
        address: fd.get('address'), notes: fd.get('notes'),
        payment: fd.get('payment'), items
      })
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) { setDone(json.data.order_no); clear(); }
    else alert(json.error ?? 'حدث خطأ');
  }

  return (
    <div className="container section" style={{ maxWidth:'720px' }}>
      <h1 style={{ fontSize:'var(--fs-h2)' }}>{t('title')}</h1>
      <form onSubmit={submit} style={{ display:'grid', gap:'16px', marginTop:'24px' }}>
        <div><label className="lbl">{t('name')} *</label>
          <input name="name" required className="input" /></div>
        <div><label className="lbl">{t('phone')} *</label>
          <input name="phone" required className="input" pattern="01[0-9]{9}" dir="ltr" placeholder="01xxxxxxxxx" /></div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div><label className="lbl">{t('governorate')} *</label>
            <select name="governorate" required className="input" value={gov} onChange={e => setGov(e.target.value)}>
              <option value="">—</option>
              {GOVS.map(g => <option key={g} value={g}>{g}</option>)}
            </select></div>
          <div><label className="lbl">{t('city')}</label>
            <input name="city" className="input" /></div>
        </div>
        <div><label className="lbl">{t('address')} *</label>
          <textarea name="address" required className="input" rows={2} /></div>
        <div><label className="lbl">{t('payment')}</label>
          <div style={{ display:'grid', gap:'8px' }}>
            {[['cash_on_delivery', t('cod')], ['vodafone_cash', 'Vodafone Cash'], ['instapay', 'InstaPay'], ['bank_transfer', 'تحويل بنكي']]
              .map(([val, label]) => (
              <label key={val} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px 16px',
                border:'1.5px solid var(--color-line)', borderRadius:'var(--r-md)', cursor:'pointer' }}>
                <input type="radio" name="payment" value={val} defaultChecked={val === 'cash_on_delivery'} />
                {label}
              </label>
            ))}
          </div></div>
        <div><label className="lbl">{t('notes')}</label>
          <textarea name="notes" className="input" rows={2} /></div>
        <div className="card" style={{ padding:'16px 20px', display:'flex', justifyContent:'space-between' }}>
          <span>{tc('total')}</span><span className="price" style={{ fontSize:'1.2rem' }}>{egp(subtotal, locale)}</span>
        </div>
        <button className="btn btn-primary btn-lg" disabled={loading}>{loading ? tc('loading') : t('placeOrder')}</button>
      </form>
    </div>
  );
}
