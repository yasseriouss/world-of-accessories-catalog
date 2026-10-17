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
    <a href="#main-content" className="skip-link">
      {locale === 'ar' ? 'الانتقال إلى المحتوى الرئيسي' : 'Skip to main content'}
    </a>
    <header style={{ position:'sticky', top:0, zIndex:50, background:'var(--color-bg-elev)',
      borderBottom:'1px solid var(--color-line)', backdropFilter:'blur(8px)' }}>
      <div className="container" style={{ display:'flex', alignItems:'center', gap:'16px', height:'var(--header-h)' }}>
        <button
          className="btn btn-ghost btn-sm drawer-btn"
          onClick={() => setOpen(true)}
          aria-label={locale === 'ar' ? 'القائمة الرئيسية' : 'Main Menu'}
          style={{ width:'44px', height:'44px', minWidth:'44px', minHeight:'44px', padding:0 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
        <Link href={`/${locale}`} style={{ fontWeight:800, fontSize:'1.15rem', textDecoration:'none', color:'var(--color-text)' }}>
          {locale === 'ar' ? (
            <>عالم <span style={{ color:'var(--color-accent)' }}>الاكسسوار</span></>
          ) : (
            <>WOA <span style={{ color:'var(--color-accent)' }}>Architectural</span></>
          )}
        </Link>
        <nav style={{ display:'flex', gap:'20px', flex:1, fontSize:'.92rem', fontWeight:600 }} className="main-nav">
          <Link href={`/${locale}/world/kitchen`}>{t('kitchens')}</Link>
          <Link href={`/${locale}/world/dressing`}>{t('dressing')}</Link>
          <Link href={`/${locale}/blog`}>{t('blog')}</Link>
          <Link href={`/${locale}/b2b`}>{t('b2b')}</Link>
          <Link href={`/${locale}/contact`}>{t('contact')}</Link>
        </nav>
        <ThemeToggle />
        <Link
          href={`/${other}`}
          className="btn btn-ghost btn-sm header-lang-btn"
          aria-label={other === 'en' ? 'Switch to English' : 'التحويل إلى العربية'}
          style={{ minWidth: '44px', minHeight: '44px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {other === 'en' ? 'EN' : 'ع'}
        </Link>
        <Link
          href="https://woa-market.vercel.app/market"
          className="btn btn-primary btn-sm"
          style={{ minHeight: '44px', padding: '0 20px', display: 'inline-flex', alignItems: 'center' }}
        >
          {t('market')}
        </Link>
      </div>
    </header>
    <div className={`drawer-ov ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
    <aside className={`drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
        <strong>{locale === 'ar' ? 'عالم الاكسسوار' : 'WOA Architectural'}</strong>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setOpen(false)}
          aria-label={locale === 'ar' ? 'إغلاق القائمة' : 'Close Menu'}
          style={{ minWidth: '44px', minHeight: '44px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ✕
        </button>
      </div>
      <Link href={`/${locale}/world/kitchen`} onClick={() => setOpen(false)}>{t('kitchens')}</Link>
      <Link href={`/${locale}/world/dressing`} onClick={() => setOpen(false)}>{t('dressing')}</Link>
      <Link href={`/${locale}/blog`} onClick={() => setOpen(false)}>{t('blog')}</Link>
      <Link href={`/${locale}/b2b`} onClick={() => setOpen(false)}>{t('b2b')}</Link>
      <Link href={`/${locale}/contact`} onClick={() => setOpen(false)}>{t('contact')}</Link>
      <Link href={`/${other}`} onClick={() => setOpen(false)}>
        {other === 'en' ? 'English' : 'العربية'}
      </Link>
    </aside>
    </>
  );
}
