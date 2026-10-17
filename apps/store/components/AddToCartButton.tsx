'use client';
import { useTranslations } from 'next-intl';
import { useCart } from '../lib/store-context';
import { useState } from 'react';

export default function AddToCartButton({ p }: { p: any }) {
  const t = useTranslations('product');
  const { add, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.find(i => i.slug === p.slug)?.qty ?? 0;
  const out = p.stock <= 0;

  return (
    <button className="btn btn-primary btn-lg" disabled={out}
      onClick={() => { add({ slug: p.slug, code: p.code, name_ar: p.name_ar, name_en: p.name_en,
        price: p.price_egp, sale: p.sale_price, image: p.images?.[0]?.url ?? '', stock: p.stock });
        setAdded(true); setTimeout(() => setAdded(false), 1500); }}>
      {out ? t('stockOut') : added ? '✓' : inCart > 0 ? `${t('addToCart')} (${inCart})` : t('addToCart')}
    </button>
  );
}
