'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function B2BPage() {
  const t = useTranslations('b2b');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch('/api/b2b-quotes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fd) });
    setLoading(false);
    if ((await res.json()).ok) setDone(true);
    else alert('تأكد من البيانات');
  }

  if (done) return (
    <div className="container section" style={{ textAlign:'center', padding:'100px 0' }}>
      <div style={{ fontSize:'3rem' }}>✓</div>
      <h1 style={{ fontSize:'var(--fs-h2)' }}>{t('success')}</h1>
    </div>
  );

  return (
    <div className="container section" style={{ maxWidth:'640px' }}>
      <div className="eyebrow">B2B</div>
      <h1 style={{ fontSize:'var(--fs-h1)' }}>{t('title')}</h1>
      <form onSubmit={submit} style={{ display:'grid', gap:'16px', marginTop:'28px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div><label className="lbl">{t('company')} *</label><input name="company" required className="input" /></div>
          <div><label className="lbl">{t('contact')} *</label><input name="contact" required className="input" /></div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div><label className="lbl">{t('phone')} *</label><input name="phone" required className="input" pattern="01[0-9]{9}" dir="ltr" /></div>
          <div><label className="lbl">Email</label><input name="email" type="email" className="input" dir="ltr" /></div>
        </div>
        <div><label className="lbl">تقدير الكميات</label><input name="qty_estimate" className="input" placeholder="مثال: 500-1000 قطعة شهرياً" /></div>
        <div><label className="lbl">{t('details')} *</label><textarea name="details" required className="input" rows={4} /></div>
        <button className="btn btn-primary btn-lg" disabled={loading}>{loading ? '...' : t('submit')}</button>
      </form>
    </div>
  );
}
