'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useCart } from '@/lib/store-context';
import { egp } from '@/lib/format';

const GOVS = ["القاهرة","الجيزة","الإسكندرية","القليوبية","الدقهلية","الشرقية","الغربية","المنوفية","البحيرة","كفر الشيخ","دمياط","بورسعيد","الإسماعيلية","السويس","الفيوم","بني سويف","المنيا","أسيوط","سوهاج","قنا","الأقصر","أسوان","البحر الأحمر","مطروح","شمال سيناء","جنوب سيناء"];

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const locale = useLocale();
  const t = useTranslations('checkout');
  const tc = useTranslations('common');
  const [done, setDone] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [gov, setGov] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  if (done) return (
    <main id="main-content" className="container section" style={{ textAlign:'center', padding:'80px 20px', maxWidth:'600px' }}>
      <div style={{ fontSize:'3.5rem', color:'var(--color-success)', marginBottom:'16px' }}>✓</div>
      <h1 className="sec-title" style={{ fontSize:'var(--fs-h1)' }}>{t('success')}</h1>
      <div style={{
        background:'var(--color-bg-elev)',
        border:'1px solid var(--color-line)',
        borderRadius:'var(--r-md)',
        padding:'24px',
        margin:'24px 0',
        textAlign:'start',
        display:'grid',
        gap:'12px'
      }}>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <span style={{ color:'var(--color-text-3)' }}>{locale === 'ar' ? 'رقم الطلب' : 'Order Number'}</span>
          <strong style={{ color:'var(--color-accent)' }}>{done}</strong>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <span style={{ color:'var(--color-text-3)' }}>{locale === 'ar' ? 'موعد التسليم المتوقع' : 'Estimated Delivery'}</span>
          <span>{locale === 'ar' ? '2-3 أيام عمل (القاهرة والجيزة)' : '2-3 business days'}</span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <span style={{ color:'var(--color-text-3)' }}>{locale === 'ar' ? 'المعاينة والضمان' : 'Inspection'}</span>
          <span style={{ color:'var(--color-success)', fontWeight:600 }}>{locale === 'ar' ? 'متاح فحص الشحنة عند الاستلام' : 'Inspect before payment'}</span>
        </div>
      </div>
      <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
        <Link href={`/${locale}/account`} className="btn btn-primary" style={{ minHeight:'48px' }}>
          {locale === 'ar' ? 'تتبع الطلب في حسابي' : 'Track in My Account'}
        </Link>
        <Link href={`/${locale}/catalog`} className="btn btn-outline" style={{ minHeight:'48px' }}>
          {locale === 'ar' ? 'مواصلة التسوق' : 'Continue Shopping'}
        </Link>
      </div>
    </main>
  );

  if (items.length === 0) return (
    <main id="main-content" className="container section" style={{ textAlign:'center', padding:'80px 20px' }}>
      <h1 className="sec-title" style={{ fontSize:'var(--fs-h2)', margin:'0 0 16px' }}>{locale === 'ar' ? 'السلة فارغة' : 'Your cart is empty'}</h1>
      <Link href={`/${locale}/catalog`} className="btn btn-primary" style={{ minHeight:'48px' }}>
        {locale === 'ar' ? 'تصفح الكتالوج' : 'Browse Catalog'}
      </Link>
    </main>
  );

  async function handleApplyCoupon(e: React.MouseEvent) {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCheckingCoupon(true);
    setCouponError(null);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      const json = await res.json();
      if (json.valid) {
        setAppliedCoupon({ code: couponCode, discount: json.discount });
        setCouponError(null);
      } else {
        setCouponError(json.error || (locale === 'ar' ? 'كود غير صالح' : 'Invalid coupon'));
        setAppliedCoupon(null);
      }
    } catch {
      setCouponError(locale === 'ar' ? 'تعذر التحقق من الكوبون' : 'Failed to validate coupon');
    } finally {
      setCheckingCoupon(false);
    }
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: fd.get('name'),
          customer_phone: fd.get('phone'),
          governorate: fd.get('governorate'),
          city: fd.get('city'),
          address: fd.get('address'),
          notes: fd.get('notes'),
          payment: fd.get('payment'),
          coupon_code: appliedCoupon?.code,
          items
        })
      });
      const json = await res.json();
      setLoading(false);
      if (json.ok) {
        setDone(json.data.order_no);
        clear();
      } else {
        setSubmitError(json.error ?? (locale === 'ar' ? 'حدث خطأ أثناء حفظ الطلب. يرجى مراجعة البيانات.' : 'Error placing order. Please verify your details.'));
      }
    } catch {
      setLoading(false);
      setSubmitError(locale === 'ar' ? 'فشل الاتصال بالخادم. يرجى إعادة المحاولة.' : 'Network error. Please try again.');
    }
  }

  const discount = appliedCoupon?.discount ?? 0;
  const finalTotal = Math.max(0, subtotal - discount);

  return (
    <main id="main-content" className="container section" style={{ maxWidth:'720px' }}>
      <h1 className="sec-title" style={{ fontSize:'var(--fs-h1)', margin:'0 0 16px' }}>{t('title')}</h1>
      
      {submitError && (
        <div style={{
          padding:'14px 18px',
          background:'rgba(192, 57, 43, 0.1)',
          border:'1px solid var(--color-danger)',
          borderRadius:'var(--r-md)',
          color:'var(--color-danger)',
          fontSize:'0.95rem',
          marginBottom:'20px'
        }} role="alert">
          {submitError}
        </div>
      )}

      <form onSubmit={submit} style={{ display:'grid', gap:'20px', marginTop:'16px' }}>
        <div>
          <label htmlFor="chk-name" className="lbl">{t('name')} *</label>
          <input id="chk-name" name="name" required className="input" placeholder={locale === 'ar' ? 'الاسم بالكامل' : 'Full Name'} />
        </div>
        
        <div>
          <label htmlFor="chk-phone" className="lbl">{t('phone')} *</label>
          <input id="chk-phone" name="phone" required className="input" pattern="01[0-9]{9}" dir="ltr" placeholder="01xxxxxxxxx" />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'16px' }}>
          <div>
            <label htmlFor="chk-gov" className="lbl">{t('governorate')} *</label>
            <select id="chk-gov" name="governorate" required className="input" value={gov} onChange={e => setGov(e.target.value)}>
              <option value="">—</option>
              {GOVS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="chk-city" className="lbl">{t('city')}</label>
            <input id="chk-city" name="city" className="input" placeholder={locale === 'ar' ? 'المدينة / الحي' : 'City / District'} />
          </div>
        </div>

        <div>
          <label htmlFor="chk-addr" className="lbl">{t('address')} *</label>
          <textarea id="chk-addr" name="address" required className="input" rows={2} placeholder={locale === 'ar' ? 'الشارع، رقم العمارة، رقم الشقة، علامة مميزة' : 'Street address, building, apartment'} />
        </div>

        <div>
          <span className="lbl">{t('payment')}</span>
          <div style={{ display:'grid', gap:'10px' }}>
            {[
              ['cash_on_delivery', t('cod')],
              ['instapay', 'InstaPay (الدفع الفوري)'],
              ['vodafone_cash', 'Vodafone Cash'],
              ['bank_transfer', 'تحويل بنكي / CIB']
            ].map(([val, label]) => (
              <label key={val} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'14px 16px',
                border:'1.5px solid var(--color-line)', borderRadius:'var(--r-md)', cursor:'pointer', minHeight:'48px' }}>
                <input type="radio" name="payment" value={val} defaultChecked={val === 'cash_on_delivery'} />
                <span style={{ fontWeight: 600 }}>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* كود الكوبون */}
        <div>
          <label htmlFor="chk-coupon" className="lbl">{locale === 'ar' ? 'كود الخصم (كوبون)' : 'Discount Coupon'}</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              id="chk-coupon"
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder={locale === 'ar' ? 'مثال: WELCOME10' : 'e.g. WELCOME10'}
              className="input"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="btn btn-outline"
              disabled={checkingCoupon || !couponCode.trim()}
              style={{ minHeight:'44px' }}
            >
              {checkingCoupon ? '...' : (locale === 'ar' ? 'تطبيق' : 'Apply')}
            </button>
          </div>
          {couponError && <div style={{ color: 'var(--color-danger)', fontSize: '.85rem', marginTop: '6px' }}>⚠️ {couponError}</div>}
          {appliedCoupon && (
            <div style={{ color: 'var(--color-stock)', fontSize: '.85rem', marginTop: '6px', fontWeight: 600 }}>
              ✓ تم تطبيق الكوبون {appliedCoupon.code} بنجاح (-{egp(appliedCoupon.discount, locale)})
            </div>
          )}
        </div>

        <div>
          <label htmlFor="chk-notes" className="lbl">{t('notes')}</label>
          <textarea id="chk-notes" name="notes" className="input" rows={2} placeholder={locale === 'ar' ? 'تعليمات التوصيل أو مواعيد الاستلام المناسبة...' : 'Special delivery instructions...'} />
        </div>

        {/* ملخص الإجمالي */}
        <div className="card" style={{ padding:'24px', display:'grid', gap:'12px', borderRadius:'var(--r-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.95rem', color: 'var(--color-text-2)' }}>
            <span>{locale === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
            <span className="price">{egp(subtotal, locale)}</span>
          </div>
          {discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.95rem', color: 'var(--color-stock)', fontWeight: 600 }}>
              <span>{locale === 'ar' ? `خصم الكوبون (${appliedCoupon?.code})` : `Coupon (${appliedCoupon?.code})`}</span>
              <span className="price">- {egp(discount, locale)}</span>
            </div>
          )}
          <div style={{ borderTop: '1px solid var(--color-line)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize:'1.15rem' }}>
            <span>{tc('total')}</span>
            <span className="price" style={{ fontSize:'1.35rem', color:'var(--color-accent)' }}>{egp(finalTotal, locale)}</span>
          </div>
        </div>

        <button
          className="btn btn-primary btn-lg"
          disabled={loading}
          style={{ width:'100%', minHeight:'52px', marginTop:'8px' }}
        >
          {loading ? (locale === 'ar' ? 'جارٍ تأكيد الطلب...' : 'Placing Order...') : (locale === 'ar' ? `تأكيد الطلب — ${egp(finalTotal, locale)}` : `Confirm Order — ${egp(finalTotal, locale)}`)}
        </button>
      </form>
    </main>
  );
}
