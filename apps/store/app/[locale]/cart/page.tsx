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

  if (items.length === 0) {
    return (
      <main id="main-content" className="container section" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h1 className="sec-title" style={{ fontSize: 'var(--fs-h2)', margin: '0 0 12px' }}>{t('title')}</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-2)', margin: '0 0 24px' }}>{t('empty')}</p>
        <Link href={`/${locale}/catalog`} className="btn btn-primary" style={{ minHeight: '48px' }}>
          {t('continue')}
        </Link>
      </main>
    );
  }

  return (
    <main id="main-content" className="container section">
      <h1 className="sec-title" style={{ fontSize: 'var(--fs-h1)', margin: '0 0 24px' }}>
        {t('title')} ({items.reduce((s, i) => s + i.qty, 0)})
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '32px',
          alignItems: 'start',
        }}
        id="cart-grid"
      >
        <div style={{ display: 'grid', gap: '16px' }}>
          {items.map((i) => (
            <div
              key={i.slug}
              className="card"
              style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--r-md)',
                  overflow: 'hidden',
                  flex: 'none',
                  background: 'var(--color-line)',
                }}
              >
                {i.image ? (
                  <Image src={i.image} alt={i.name_ar} fill sizes="80px" style={{ objectFit: 'cover' }} />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      color: 'var(--color-text-3)',
                    }}
                  >
                    WOA
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: '180px' }}>
                <Link
                  href={`/${locale}/product/${i.slug}`}
                  style={{ fontWeight: 600, color: 'var(--color-text)', textDecoration: 'none' }}
                  className="line-clamp-2"
                >
                  {locale === 'ar' ? i.name_ar : i.name_en || i.name_ar}
                </Link>
                <div style={{ fontSize: '.8rem', color: 'var(--color-text-3)', margin: '2px 0' }}>{i.code}</div>
                <div className="price" style={{ marginTop: '4px' }}>{egp(i.sale ?? i.price, locale)}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setQty(i.slug, i.qty - 1)}
                  aria-label={t('decrease')}
                  style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px', padding: 0, fontSize: '1.2rem' }}
                >
                  −
                </button>
                <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {i.qty}
                </span>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setQty(i.slug, i.qty + 1)}
                  disabled={i.qty >= i.stock}
                  aria-label={t('increase')}
                  style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px', padding: 0, fontSize: '1.2rem' }}
                >
                  +
                </button>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => remove(i.slug)}
                aria-label={t('remove')}
                style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px', padding: 0, color: 'var(--color-danger)' }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <aside className="card" style={{ padding: '24px', height: 'fit-content', position: 'sticky', top: 'calc(var(--header-h) + 16px)' }}>
          <h2 style={{ marginTop: 0, fontSize: '1.2rem' }}>{t('orderSummary')}</h2>
          <div style={{ display: 'grid', gap: '12px', fontSize: '.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{t('subtotal')}</span>
              <span className="price">{egp(subtotal, locale)}</span>
            </div>
            {savings > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)', fontWeight: 600 }}>
                <span>{t('savings')}</span>
                <span className="price">-{egp(savings, locale)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-3)', fontSize: '0.85rem' }}>
              <span>{t('shipping')}</span>
              <span>{t('shippingNotice')}</span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--color-line)', margin: '4px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.15rem' }}>
              <span>{t('total')}</span>
              <span className="price">{egp(subtotal, locale)}</span>
            </div>
          </div>
          <Link href={`/${locale}/checkout`} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '20px', minHeight: '50px' }}>
            {t('checkout')}
          </Link>
        </aside>
      </div>
    </main>
  );
}
