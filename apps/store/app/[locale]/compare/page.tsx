'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useCompare } from '@/lib/store-context';
import { egp } from '@/lib/format';

export default function ComparePage() {
  const locale = useLocale();
  const t = useTranslations('product');
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const compared = compareList.slice(0, 4);

  if (compared.length === 0) return (
    <div className="container section" style={{ textAlign:'center', padding: '60px 20px' }}>
      <h1 className="sec-title" style={{ fontSize:'var(--fs-h2)' }}>{t('compare')}</h1>
      <p style={{ color:'var(--color-text-2)', margin: '16px 0 24px' }}>
        {locale === 'ar' ? 'لا توجد منتجات في قائمة المقارنة حالياً.' : 'No products in comparison list.'}
      </p>
      <Link href={`/${locale}/catalog`} className="btn btn-primary">
        {locale === 'ar' ? 'تصفح الكتالوج' : 'Browse Catalog'}
      </Link>
    </div>
  );

  return (
    <div className="container section">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px', marginBottom:'20px' }}>
        <h1 className="sec-title" style={{ fontSize:'var(--fs-h2)', margin:0 }}>{t('compare')} ({compared.length})</h1>
        <button className="btn btn-outline btn-sm" onClick={clearCompare}>
          {locale === 'ar' ? 'إفراغ المقارنة' : 'Clear All'}
        </button>
      </div>
      <div style={{ overflowX:'auto', marginTop:'16px' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'600px' }}>
          <thead><tr>
            <th style={{ textAlign:'start', padding:'12px' }}></th>
            {compared.map(i => <th key={i.slug} style={{ padding:'12px' }}>
              <div style={{ display:'grid', gap:'8px', justifyItems:'center' }}>
                {i.image && <Image src={i.image} alt="" width={100} height={100} style={{ borderRadius:'var(--r-md)', objectFit:'cover' }} />}
                <Link href={`/${locale}/product/${i.slug}`} style={{ fontWeight:600, maxWidth:'180px' }}
                  className="line-clamp-2">{locale==='ar'?i.name_ar:i.name_en ?? i.name_ar}</Link>
                <button className="btn btn-ghost btn-sm" aria-label={locale === 'ar' ? 'إزالة' : 'Remove'} onClick={() => removeFromCompare(i.slug)}>✕</button>
              </div></th>)}
          </tr></thead>
          <tbody>
            <tr style={{ borderTop:'1px solid var(--color-line)' }}>
              <td style={{ padding:'12px', color:'var(--color-text-3)' }}>{t('code')}</td>
              {compared.map(i => <td key={i.slug} style={{ padding:'12px', textAlign:'center' }}>{i.code}</td>)}
            </tr>
            <tr style={{ borderTop:'1px solid var(--color-line)' }}>
              <td style={{ padding:'12px', color:'var(--color-text-3)' }}>السعر</td>
              {compared.map(i => <td key={i.slug} style={{ padding:'12px', textAlign:'center' }} className="price">
                {egp(i.sale ?? i.price, locale)}</td>)}
            </tr>
            <tr style={{ borderTop:'1px solid var(--color-line)' }}>
              <td style={{ padding:'12px', color:'var(--color-text-3)' }}>{t('stockIn')}</td>
              {compared.map(i => <td key={i.slug} style={{ padding:'12px', textAlign:'center' }}>
                {i.stock > 0 ? <span className="chip chip-stock">{i.stock}</span> : <span className="chip chip-out">✕</span>}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
