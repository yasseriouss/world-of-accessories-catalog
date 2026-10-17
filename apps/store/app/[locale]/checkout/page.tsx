'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useCart } from '@/lib/store-context';
import { egp } from '@/lib/format';

const GOVERNORATE_KEYS = [
  'cairo', 'giza', 'alexandria', 'qalyubia', 'dakahlia', 'sharqia', 'gharbia',
  'monufia', 'beheira', 'kafr_el_sheikh', 'damietta', 'port_said', 'ismailia',
  'suez', 'faiyum', 'beni_suef', 'minya', 'asyut', 'sohag', 'qena',
  'luxor', 'aswan', 'red_sea', 'matrouh', 'north_sinai', 'south_sinai'
];

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const locale = useLocale();
  const t = useTranslations('checkout');
  const tGov = useTranslations('governorates');
  const tc = useTranslations('common');

  const [done, setDone] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [gov, setGov] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalTotal = Math.max(0, subtotal - discount);

  if (done) {
    return (
      <main id="main-content" className="container section" style={{ textAlign: 'center', padding: '80px 20px', maxWidth: '600px' }}>
        <div style={{ fontSize: '3.5rem', color: 'var(--color-success)', marginBottom: '16px' }}>✓</div>
        <h1 className="sec-title" style={{ fontSize: 'var(--fs-h1)' }}>{t('success')}</h1>
        <div
          style={{
            background: 'var(--color-bg-elev)',
            border: '1px solid var(--color-line)',
            borderRadius: 'var(--r-md)',
            padding: '24px',
            margin: '24px 0',
            textAlign: 'start',
            display: 'grid',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-3)' }}>{t('orderNo')}</span>
            <strong style={{ color: 'var(--color-accent)' }}>{done}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-3)' }}>{t('estimatedDelivery')}</span>
            <span>{t('deliveryTime')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-3)' }}>{t('inspection')}</span>
            <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>{t('inspectionDetail')}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={`/${locale}/account`} className="btn btn-primary" style={{ minHeight: '48px' }}>
            {t('trackInAccount')}
          </Link>
          <Link href={`/${locale}/catalog`} className="btn btn-outline" style={{ minHeight: '48px' }}>
            {t('continueShopping')}
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main id="main-content" className="container section" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h1 className="sec-title" style={{ fontSize: 'var(--fs-h2)', margin: '0 0 16px' }}>{t('emptyCart')}</h1>
        <Link href={`/${locale}/catalog`} className="btn btn-primary" style={{ minHeight: '48px' }}>
          {t('browseCatalog')}
        </Link>
      </main>
    );
  }

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
        setCouponError(json.error || t('couponInvalid'));
        setAppliedCoupon(null);
      }
    } catch {
      setCouponError(t('couponError'));
    } finally {
      setCheckingCoupon(false);
    }
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null);
    const fd = new FormData(e.currentTarget);
    const body = {
      customer_name: fd.get('name'),
      customer_phone: fd.get('phone'),
      governorate: fd.get('governorate'),
      city: fd.get('city'),
      address: fd.get('address'),
      payment: fd.get('payment'),
      notes: fd.get('notes'),
      coupon_code: appliedCoupon?.code,
      discount_amount: discount,
      items: items.map((i) => ({ slug: i.slug, code: i.code, name_ar: i.name_ar, price: i.sale ?? i.price, qty: i.qty })),
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setLoading(false);
      if (data.order_no) {
        clear();
        setDone(data.order_no);
      } else {
        setSubmitError(data.error || t('couponError'));
      }
    } catch {
      setLoading(false);
      setSubmitError(t('couponError'));
    }
  }

  return (
    <main id="main-content" className="container section" style={{ maxWidth: '640px' }}>
      <h1 className="sec-title" style={{ fontSize: 'var(--fs-h1)', margin: '0 0 12px' }}>{t('title')}</h1>

      {submitError && (
        <div
          role="alert"
          style={{
            background: 'rgba(192, 57, 43, 0.1)',
            border: '1.5px solid var(--color-danger)',
            color: 'var(--color-danger)',
            padding: '14px 18px',
            borderRadius: 'var(--r-md)',
            fontWeight: 600,
            fontSize: '0.95rem',
            marginBottom: '16px',
          }}
        >
          ⚠️ {submitError}
        </div>
      )}

      <form onSubmit={submit} style={{ display: 'grid', gap: '20px', marginTop: '16px' }}>
        <div>
          <label htmlFor="chk-name" className="lbl">{t('name')} *</label>
          <input id="chk-name" name="name" required className="input" placeholder={t('name')} />
        </div>

        <div>
          <label htmlFor="chk-phone" className="lbl">{t('phone')} *</label>
          <input id="chk-phone" name="phone" required className="input" pattern="01[0-9]{9}" dir="ltr" placeholder="01xxxxxxxxx" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label htmlFor="chk-gov" className="lbl">{t('governorate')} *</label>
            <select id="chk-gov" name="governorate" required className="input" value={gov} onChange={(e) => setGov(e.target.value)}>
              <option value="">—</option>
              {GOVERNORATE_KEYS.map((k) => (
                <option key={k} value={tGov(k)}>
                  {tGov(k)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="chk-city" className="lbl">{t('city')}</label>
            <input id="chk-city" name="city" className="input" placeholder={t('city')} />
          </div>
        </div>

        <div>
          <label htmlFor="chk-addr" className="lbl">{t('address')} *</label>
          <textarea id="chk-addr" name="address" required className="input" rows={2} placeholder={t('address')} />
        </div>

        <div>
          <span className="lbl">{t('payment')}</span>
          <div style={{ display: 'grid', gap: '10px' }}>
            {[
              ['cash_on_delivery', t('cod')],
              ['instapay', t('instapay')],
              ['vodafone_cash', t('vodafoneCash')],
              ['bank_transfer', t('bankTransfer')],
            ].map(([val, label]) => (
              <label
                key={val}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  border: '1.5px solid var(--color-line)',
                  borderRadius: 'var(--r-md)',
                  cursor: 'pointer',
                  minHeight: '48px',
                }}
              >
                <input type="radio" name="payment" value={val} defaultChecked={val === 'cash_on_delivery'} />
                <span style={{ fontWeight: 600 }}>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Coupon Code Section */}
        <div>
          <label htmlFor="chk-coupon" className="lbl">{t('coupon')}</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              id="chk-coupon"
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder={t('couponPlaceholder')}
              className="input"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="btn btn-outline"
              disabled={checkingCoupon || !couponCode.trim()}
              style={{ minHeight: '44px' }}
            >
              {checkingCoupon ? '...' : t('couponApply')}
            </button>
          </div>
          {couponError && (
            <div style={{ color: 'var(--color-danger)', fontSize: '.85rem', marginTop: '6px' }}>
              ⚠️ {couponError}
            </div>
          )}
          {appliedCoupon && (
            <div style={{ color: 'var(--color-stock)', fontSize: '.85rem', marginTop: '6px', fontWeight: 600 }}>
              {t('couponApplied', { code: appliedCoupon.code, discount: egp(appliedCoupon.discount, locale) })}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="chk-notes" className="lbl">{t('notes')}</label>
          <textarea id="chk-notes" name="notes" className="input" rows={2} placeholder={t('notesPlaceholder')} />
        </div>

        {/* Order Summary Card */}
        <div className="card" style={{ padding: '24px', display: 'grid', gap: '12px', borderRadius: 'var(--r-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.95rem', color: 'var(--color-text-2)' }}>
            <span>{t('subtotal')}</span>
            <span className="price">{egp(subtotal, locale)}</span>
          </div>
          {discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.95rem', color: 'var(--color-stock)', fontWeight: 600 }}>
              <span>{t('couponDiscount', { code: appliedCoupon?.code })}</span>
              <span className="price">- {egp(discount, locale)}</span>
            </div>
          )}
          <div
            style={{
              borderTop: '1px solid var(--color-line)',
              paddingTop: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 800,
              fontSize: '1.15rem',
            }}
          >
            <span>{tc('total')}</span>
            <span className="price" style={{ fontSize: '1.35rem', color: 'var(--color-accent)' }}>
              {egp(finalTotal, locale)}
            </span>
          </div>
        </div>

        <button
          className="btn btn-primary btn-lg"
          disabled={loading}
          style={{ width: '100%', minHeight: '52px', marginTop: '8px' }}
        >
          {loading ? t('submitting') : t('confirmTotal', { total: egp(finalTotal, locale) })}
        </button>
      </form>
    </main>
  );
}
