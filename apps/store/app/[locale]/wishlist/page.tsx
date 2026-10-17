'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useWishlist, useCart } from '@/lib/store-context';
import { egp, discountPct, whatsappLink } from '@/lib/format';
import { SITE } from '@/lib/site';

export default function WishlistPage() {
  const locale = useLocale();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { add } = useCart();

  const isAr = locale === 'ar';
  const t = useTranslations('wishlist');
  const tp = useTranslations('product');

  return (
    <div className="container section" style={{ minHeight: '60vh', padding: '40px 16px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: 'var(--fs-h2)', fontWeight: 800 }}>
          {t('title')}
        </h1>
        <p style={{ color: 'var(--color-text-3)', fontSize: '.9rem', marginTop: '4px' }}>
          {t('subtitle', { count: wishlist.length })}
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            display: 'grid',
            gap: '16px',
            justifyItems: 'center',
          }}
        >
          <div style={{ fontSize: '3rem' }}>🤍</div>
          <h2 style={{ fontSize: '1.25rem' }}>
            {t('emptyTitle')}
          </h2>
          <p style={{ color: 'var(--color-text-3)', maxWidth: '400px', fontSize: '.9rem' }}>
            {t('emptyText')}
          </p>
          <Link href={`/${locale}/catalog`} className="btn btn-primary btn-lg" style={{ marginTop: '8px' }}>
            {t('browse')}
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px',
          }}
        >
          {wishlist.map((item) => {
            const name = isAr ? item.name_ar : item.name_en || item.name_ar;
            const price = item.sale ?? item.price;
            const out = item.stock <= 0;

            return (
              <article key={item.slug} className="card" style={{ position: 'relative' }}>
                <div className="card-media" style={{ position: 'relative', aspectRatio: '1' }}>
                  <Link href={`/${locale}/product/${item.slug}`} style={{ position: 'absolute', inset: 0 }} aria-label={name}>
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={name}
                        fill
                        sizes="(max-width:480px) 50vw, 300px"
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </Link>

                  <button
                    type="button"
                    className="card-fab"
                    onClick={() => removeFromWishlist(item.slug)}
                    aria-label={t('remove')}
                    title={t('remove')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="bdg">
                    {item.sale && (
                      <span className="sale">
                        {tp('sale')} {discountPct(item.price, item.sale)}%
                      </span>
                    )}
                    {out && <span className="out">{tp('stockOut')}</span>}
                  </div>
                </div>

                <div style={{ padding: '14px', display: 'grid', gap: '8px' }}>
                  <div style={{ fontSize: '.72rem', color: 'var(--color-text-3)' }}>{item.code}</div>
                  <Link
                    href={`/${locale}/product/${item.slug}`}
                    style={{
                      fontWeight: 600,
                      fontSize: '.95rem',
                      color: 'var(--color-text)',
                      textDecoration: 'none',
                    }}
                    className="line-clamp-2"
                  >
                    {name}
                  </Link>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                    <span
                      className="price"
                      style={{
                        color: item.sale ? 'var(--color-sale)' : 'var(--color-text)',
                        fontSize: '1.05rem',
                      }}
                    >
                      {egp(price, locale)}
                    </span>
                    {item.sale && <span className="price-old">{egp(item.price, locale)}</span>}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                      disabled={out}
                      onClick={() =>
                        add({
                          slug: item.slug,
                          code: item.code,
                          name_ar: item.name_ar,
                          name_en: item.name_en,
                          price: item.price,
                          sale: item.sale,
                          image: item.image,
                          stock: item.stock,
                        })
                      }
                    >
                      {tp('addToCart')}
                    </button>
                    <a
                      className="btn btn-outline btn-sm"
                      aria-label={tp('orderWhats')}
                      href={whatsappLink(SITE.whatsapp, tp('whatsappInquiry', { code: item.code, name: item.name_ar }))}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                        <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1.1 2.2 1.4 2.5 1.5.3.2.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.3 0 .1 0 .7-.2 1.2Z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
