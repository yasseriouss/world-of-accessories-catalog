'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { egp, discountPct, whatsappLink } from '../lib/format';
import { useCart } from '../lib/store-context';

export default function ProductCard({ p }: { p: any }) {
  const locale = useLocale();
  const t = useTranslations('product');
  const tc = useTranslations('common');
  const { add } = useCart();
  const price = p.sale_price ?? p.price_egp;
  const img = p.images?.[0];
  const out = p.stock <= 0;
  const name = locale === 'ar' ? p.name_ar : p.name_en ?? p.name_ar;

  return (
    <article className="card">
      <Link href={`/${locale}/product/${p.slug}`} className="card-media" aria-label={name}>
        {img && <Image src={img.url} alt={img.alt_ar ?? name} fill sizes="(max-width:480px) 50vw, 300px"
          style={{ objectFit:'cover' }} loading="lazy" />}
        <div className="bdg">
          {p.sale_price && <span className="sale">{t('sale')} {discountPct(p.price_egp, p.sale_price)}%</span>}
          {p.created_at && (Date.now() - new Date(p.created_at).getTime()) < 14*864e5 && <span className="new">جديد</span>}
          {p.sold_count >= 30 && <span className="best">الأكثر مبيعاً</span>}
          {out && <span className="out">{t('stockOut')}</span>}
        </div>
      </Link>
      <div style={{ padding:'14px', display:'grid', gap:'8px' }}>
        <div style={{ fontSize:'.72rem', color:'var(--color-text-3)' }}>{t('code')}: {p.code}</div>
        <Link href={`/${locale}/product/${p.slug}`} style={{ fontWeight:600, fontSize:'.95rem', color:'var(--color-text)',
          textDecoration:'none' }} className="line-clamp-2">{name}</Link>
        <div style={{ display:'flex', alignItems:'baseline', gap:'8px', flexWrap:'wrap' }}>
          <span className="price" style={{ color: p.sale_price ? 'var(--color-sale)' : 'var(--color-text)', fontSize:'1.05rem' }}>
            {egp(price, locale)}</span>
          {p.sale_price && <span className="price-old">{egp(p.price_egp, locale)}</span>}
        </div>
        <div style={{ display:'flex', gap:'8px' }}>
          <button className="btn btn-primary btn-sm" style={{ flex:1 }} disabled={out}
            onClick={() => add({ slug:p.slug, code:p.code, name_ar:p.name_ar, name_en:p.name_en,
              price:p.price_egp, sale:p.sale_price, image:img?.url ?? '', stock:p.stock })}>
            {t('addToCart')}
          </button>
          <a className="btn btn-outline btn-sm" aria-label="WhatsApp"
            href={whatsappLink('01140030036', `أريد المنتج ${p.code} - ${p.name_ar}`)} target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1.1 2.2 1.4 2.5 1.5.3.2.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.3 0 .1 0 .7-.2 1.2Z"/>
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}
