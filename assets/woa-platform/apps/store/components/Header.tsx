'use client';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useCart, useWishlist } from '../lib/store-context';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const t = useTranslations('nav');
  const tc = useTranslations('common');
  const locale = useLocale();
  const { count } = useCart();
  const { wishlistCount } = useWishlist();
  const [open, setOpen] = useState(false);
  const other = locale === 'ar' ? 'en' : 'ar';
  const path = typeof window !== 'undefined' ? window.location.pathname.replace(/^\/(ar|en)/, '') : '/';
  const links = [
    { href: `/${locale}`, label: t('market') },
    { href: `/${locale}/catalog`, label: t('home') },
    { href: `/${locale}/wishlist`, label: locale === 'ar' ? 'المفضلة' : 'Wishlist' },
    { href: `/${locale}/account`, label: t('account') },
  ];

  return (
    <>
      <header style={{ position:'sticky', top:0, zIndex:50, background:'var(--color-bg-elev)',
        borderBottom:'1px solid var(--color-line)' }}>
        <div className="container" style={{ display:'flex', alignItems:'center', gap:'14px', height:'var(--header-h)' }}>
          <button className="btn btn-ghost btn-sm drawer-btn" onClick={() => setOpen(true)} aria-label="القائمة"
            style={{ width:'40px', height:'40px', padding:0 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
          <Link href={`/${locale}`} style={{ fontWeight:800, fontSize:'1.2rem', color:'var(--color-text)', textDecoration:'none' }}>
            عالم <span style={{ color:'var(--color-accent)' }}>الاكسسوار</span>
          </Link>
          <nav style={{ display:'flex', gap:'20px', marginInlineStart:'24px', flex:1 }} className="main-nav">
            {links.slice(0,2).map(l => <Link key={l.href} href={l.href}>{l.label}</Link>)}
          </nav>
          <form action={`/${locale}/catalog`} style={{ display:'flex', flex:1, maxWidth:'380px' }} className="search-form">
            <input name="q" className="input" placeholder={tc('search')} aria-label={tc('search')} />
          </form>
          <ThemeToggle />
          <Link href={`/${other}${path}`} className="btn btn-ghost btn-sm" aria-label="Switch language">
            {other === 'en' ? 'EN' : 'ع'}
          </Link>
          <Link href={`/${locale}/wishlist`} className="btn btn-ghost btn-sm" aria-label="المفضلة" style={{ position: 'relative', padding: '0 8px' }}>
            <svg viewBox="0 0 24 24" fill={wishlistCount > 0 ? 'var(--color-accent)' : 'none'} stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {wishlistCount > 0 && <span className="cart-count" style={{ background: 'var(--color-accent)' }}>{wishlistCount}</span>}
          </Link>
          <Link href={`/${locale}/cart`} className="btn btn-outline btn-sm" aria-label={t('cart')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <circle cx="9" cy="21" r="1.5"/><circle cx="19" cy="21" r="1.5"/>
              <path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L22 7H6"/>
            </svg>
            <span className="cart-count">{count > 0 ? count : ''}</span>
          </Link>
        </div>
      </header>

      {/* Drawer */}
      <div className={`drawer-ov ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
          <strong>عالم الاكسسوار</strong>
          <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)} aria-label="إغلاق">✕</button>
        </div>
        {links.map(l => <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>)}
        <Link href={`/${other}${path}`} onClick={() => setOpen(false)}>
          {other === 'en' ? 'English' : 'العربية'}</Link>
      </aside>
    </>
  );
}
