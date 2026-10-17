'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { egp, discountPct, whatsappLink } from '../lib/format';
import { useCart, useWishlist } from '../lib/store-context';
import { SITE } from '../lib/site';

export default function ProductCard({ p, priorityImage = false }: { p: any; priorityImage?: boolean }) {
  const locale = useLocale();
  const t = useTranslations('product');
  const tb = useTranslations('brand');
  const { add } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const inWishlist = isInWishlist(p.slug);
  const price = p.sale_price ?? p.price_egp;
  const out = p.stock <= 0;
  const name = locale === 'ar' ? p.name_ar : p.name_en ?? p.name_ar;

  // Sanitize Supabase image URL
  const rawImgUrl = p.images?.[0]?.url;
  let validImgUrl: string | null =
    rawImgUrl && typeof rawImgUrl === 'string' && rawImgUrl.trim().length > 10
      ? rawImgUrl.trim()
      : null;
  if (validImgUrl) {
    if (validImgUrl.startsWith('https://jzllhisbgjfdnurfuzfb') && !validImgUrl.includes('.supabase.co')) {
      validImgUrl = validImgUrl.replace(
        'https://jzllhisbgjfdnurfuzfb',
        'https://jzllhisbgjfdnurfuzfb.supabase.co/storage/v1/object/public/catalogue-images'
      );
    } else if (validImgUrl === 'https://jzllhisbgjfdnurfuzfb' || validImgUrl.endsWith('jzllhisbgjfdnurfuzfb/')) {
      validImgUrl = null;
    }
  }

  const handleAddToCart = () => {
    add({
      slug: p.slug,
      code: p.code,
      name_ar: p.name_ar,
      name_en: p.name_en,
      price: p.price_egp,
      sale: p.sale_price,
      image: validImgUrl ?? '',
      stock: p.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article className="card" style={{ position: 'relative' }}>
      <div className="card-media" style={{ position: 'relative' }}>
        <Link href={`/${locale}/product/${p.slug}`} style={{ position: 'absolute', inset: 0 }} aria-label={name}>
          {validImgUrl ? (
            <Image
              src={validImgUrl}
              alt={(locale === 'ar' ? p.images?.[0]?.alt_ar : p.images?.[0]?.alt_en) ?? name}
              fill
              sizes="(max-width: 480px) 50vw, (max-width: 1024px) 33vw, 280px"
              style={{ objectFit: 'cover' }}
              priority={priorityImage}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--color-bg-elev), var(--color-line))',
                color: 'var(--color-text-3)',
                gap: '6px',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>{tb('name')}</span>
            </div>
          )}
        </Link>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist({
              slug: p.slug,
              code: p.code,
              name_ar: p.name_ar,
              name_en: p.name_en,
              price: p.price_egp,
              sale: p.sale_price,
              image: validImgUrl ?? '',
              stock: p.stock,
            });
          }}
          aria-label={inWishlist ? t('wishlistRemove') : t('wishlistAdd')}
          aria-pressed={inWishlist}
          className="card-fab"
        >
          <svg viewBox="0 0 24 24" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <div className="bdg">
          {p.sale_price && <span className="sale">{t('sale')} {discountPct(p.price_egp, p.sale_price)}%</span>}
          {p.created_at && Date.now() - new Date(p.created_at).getTime() < 14 * 864e5 && (
            <span className="new">{t('new')}</span>
          )}
          {p.sold_count >= 30 && <span className="best">{t('bestSeller')}</span>}
          {out && <span className="out">{t('stockOut')}</span>}
        </div>
      </div>
      <div style={{ padding: '14px', display: 'grid', gap: '8px' }}>
        <div style={{ fontSize: '.72rem', color: 'var(--color-text-3)' }}>
          {t('code')}: {p.code}
        </div>
        <Link
          href={`/${locale}/product/${p.slug}`}
          style={{ fontWeight: 600, fontSize: '.95rem', color: 'var(--color-text)', textDecoration: 'none' }}
          className="line-clamp-2"
        >
          {name}
        </Link>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
          <span className="price" style={{ color: p.sale_price ? 'var(--color-sale)' : 'var(--color-text)', fontSize: '1.05rem' }}>
            {egp(price, locale)}
          </span>
          {p.sale_price && <span className="price-old">{egp(p.price_egp, locale)}</span>}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${added ? 'btn-dark' : 'btn-primary'} btn-sm`}
            style={{ flex: 1, minHeight: '44px' }}
            disabled={out}
            onClick={handleAddToCart}
          >
            {added ? t('added') : t('addToCart')}
          </button>
          <a
            className="btn btn-outline btn-sm"
            aria-label={t('orderWhats')}
            style={{ minWidth: '44px', minHeight: '44px', padding: '0 12px' }}
            href={whatsappLink(SITE.whatsapp, t('whatsappOrder', { code: p.code, name: p.name_ar }))}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1.1 2.2 1.4 2.5 1.5.3.2.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.3 0 .1 0 .7-.2 1.2Z" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}
