'use client';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const other = locale === 'ar' ? 'en' : 'ar';
  const [open, setOpen] = useState(false);
  return (
    <>
    <header style={{ position:'sticky', top:0, zIndex:50, background:'var(--color-bg-elev)',
      borderBottom:'1px solid var(--color-line)', backdropFilter:'blur(8px)' }}>
      <div className="container" style={{ display:'flex', alignItems:'center', gap:'16px', height:'var(--header-h)' }}>
        <button className="btn btn-ghost btn-sm drawer-btn" onClick={() => setOpen(true)} aria-label="القائمة"
          style={{ width:'40px', height:'40px', padding:0 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
        <Link href={`/${locale}`} style={{ fontWeight:800, fontSize:'1.15rem', textDecoration:'none' }}>
          عالم <span style={{ color:'var(--color-accent)' }}>الاكسسوار</span></Link>
        <nav style={{ display:'flex', gap:'20px', flex:1, fontSize:'.92rem', fontWeight:500 }} className="main-nav">
          <Link href={`/${locale}/world/kitchen`}>{t('kitchens')}</Link>
          <Link href={`/${locale}/world/dressing`}>{t('dressing')}</Link>
          <Link href={`/${locale}/blog`}>{t('blog')}</Link>
          <Link href={`/${locale}/b2b`}>{t('b2b')}</Link>
          <Link href={`/${locale}/contact`}>{t('contact')}</Link>
        </nav>
        <ThemeToggle />
        <Link href={`/${other}`} className="btn btn-ghost btn-sm">{other === 'en' ? 'EN' : 'ع'}</Link>
        <Link href="https://woa-market.vercel.app/market" className="btn btn-primary btn-sm">{t('market')}</Link>
      </div>
    </header>
    <div className={`drawer-ov ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
    <aside className={`drawer ${open ? 'open' : ''}`}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
        <strong>عالم الاكسسوار</strong>
        <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)} aria-label="إغلاق">✕</button>
      </div>
      <Link href={`/${locale}/world/kitchen`} onClick={() => setOpen(false)}>{t('kitchens')}</Link>
      <Link href={`/${locale}/world/dressing`} onClick={() => setOpen(false)}>{t('dressing')}</Link>
      <Link href={`/${locale}/blog`} onClick={() => setOpen(false)}>{t('blog')}</Link>
      <Link href={`/${locale}/b2b`} onClick={() => setOpen(false)}>{t('b2b')}</Link>
      <Link href={`/${locale}/contact`} onClick={() => setOpen(false)}>{t('contact')}</Link>
    </aside>
    </>
  );
}
