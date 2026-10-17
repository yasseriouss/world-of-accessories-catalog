'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useWishlist, useCart } from '@/lib/store-context';
import { egp, discountPct, whatsappLink } from '@/lib/format';

export default function WishlistPage() {
  const locale = useLocale();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { add } = useCart();

  const isAr = locale === 'ar';

  return (
    <div className="container section" style={{ minHeight: '60vh', padding: '40px 16px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: 'var(--fs-h2)', fontWeight: 800 }}>
          {isAr ? 'قائمة المفضلة' : 'My Wishlist'}
        </h1>
        <p style={{ color: 'var(--color-text-3)', fontSize: '.9rem', marginTop: '4px' }}>
          {isAr
            ? `المنتجات التي قمت بحفظها للرجوع إليها لاحقاً (${wishlist.length})`
            : `Products you have saved for later (${wishlist.length})`}
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
            {isAr ? 'قائمة المفضلة فارغة حالياً' : 'Your wishlist is currently empty'}
          </h2>
          <p style={{ color: 'var(--color-text-3)', maxWidth: '400px', fontSize: '.9rem' }}>
            {isAr
              ? 'تصفح تشكيلة إكسسوارات المطابخ والأثاث واضغط على علامة القلب لحفظ المنتجات التي تعجبك.'
              : 'Explore our catalog of kitchen and furniture accessories and tap the heart icon to save items.'}
          </p>
          <Link href={`/${locale}/catalog`} className="btn btn-primary btn-lg" style={{ marginTop: '8px' }}>
            {isAr ? 'تصفح الكتالوج الآن' : 'Browse Catalog'}
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
                    onClick={() => removeFromWishlist(item.slug)}
                    title={isAr ? 'حذف من المفضلة' : 'Remove from wishlist'}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      zIndex: 4,
                      background: 'rgba(20,19,17,0.75)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    ✕
                  </button>

                  <div className="bdg">
                    {item.sale && (
                      <span className="sale">
                        {isAr ? 'خصم' : 'Sale'} {discountPct(item.price, item.sale)}%
                      </span>
                    )}
                    {out && <span className="out">{isAr ? 'نفد' : 'Out of stock'}</span>}
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
                      {isAr ? 'إضافة للسلة' : 'Add to Cart'}
                    </button>
                    <a
                      className="btn btn-outline btn-sm"
                      aria-label="WhatsApp"
                      href={whatsappLink('01140030036', `أريد الاستفسار عن المنتج ${item.code} - ${item.name_ar}`)}
                      target="_blank"
                      rel="noopener"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
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
