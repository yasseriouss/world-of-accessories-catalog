'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-client';

const LINKS = [
  { href: '/', label: 'لوحة القيادة', icon: '▦' },
  { href: '/orders', label: 'الطلبات', icon: '🛒' },
  { href: '/b2b', label: 'طلبات الجملة (B2B)', icon: '🏢' },
  { href: '/coupons', label: 'الكوبونات', icon: '🏷️' },
  { href: '/reviews', label: 'المراجعات', icon: '⭐' },
  { href: '/products', label: 'المنتجات', icon: '📦' },
  { href: '/blog', label: 'المدونة', icon: '✎' },
  { href: '/banners', label: 'البنرات', icon: '📢' },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle escape key to close drawer
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (pathname === '/login') {
    return <div className="admin-login-wrapper">{children}</div>;
  }

  async function handleSignOut() {
    await supabaseBrowser().auth.signOut();
    router.push('/login');
  }

  return (
    <div className="admin-shell">
      {/* Mobile Sticky Header Bar */}
      <header className="admin-mobile-header">
        <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>
          عالم <span style={{ color: 'var(--color-accent)' }}>الاكسسوار</span>
          <span style={{ fontSize: '.75rem', fontWeight: 400, color: 'var(--color-text-3)', marginInlineStart: '8px' }}>
            لوحة التحكم
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة الإدارية'}
          aria-expanded={mobileMenuOpen}
          className="btn btn-outline btn-sm"
          style={{ width: '44px', height: '44px', padding: 0 }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="admin-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Admin Sidebar Navigation */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div style={{ padding: '0 24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>
              عالم <span style={{ color: 'var(--color-accent)' }}>الاكسسوار</span>
            </div>
            <div style={{ fontSize: '.75rem', fontWeight: 500, color: 'var(--color-text-3)', marginTop: 2 }}>
              لوحة التحكم الإدارية
            </div>
          </div>
          {mobileMenuOpen && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-ghost btn-sm"
              aria-label="إغلاق القائمة"
              style={{ width: '44px', height: '44px', padding: 0 }}
            >
              ✕
            </button>
          )}
        </div>

        <nav style={{ display: 'grid', gap: '4px', flex: 1, padding: '0 12px' }}>
          {LINKS.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: 'var(--r-md)',
                  fontSize: '.92rem',
                  fontWeight: isActive ? 700 : 500,
                  minHeight: '44px',
                  background: isActive ? 'rgba(176, 141, 46, 0.12)' : 'transparent',
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-2)',
                  borderInlineStart: isActive ? '3px solid var(--color-accent)' : '3px solid transparent',
                  transition: 'background var(--t-fast), color var(--t-fast)',
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{l.icon}</span>
                <span>{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--color-line)', marginTop: 'auto' }}>
          <a
            href="https://woa-market.vercel.app/ar"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
            style={{ width: '100%', marginBottom: '8px', minHeight: '44px' }}
          >
            زيارة المتجر ↗
          </a>
          <button
            onClick={handleSignOut}
            className="btn btn-ghost btn-sm"
            style={{ width: '100%', minHeight: '44px', color: 'var(--color-danger)' }}
          >
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
