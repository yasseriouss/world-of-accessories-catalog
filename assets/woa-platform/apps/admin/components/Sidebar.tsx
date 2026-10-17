'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabaseBrowser } from '../lib/supabase-client';

const LINKS = [
  { href: '/', label: 'لوحة القيادة', icon: '▦' },
  { href: '/orders', label: 'الطلبات', icon: '🛒' },
  { href: '/b2b', label: 'طلبات الجملة (B2B)', icon: '🏢' },
  { href: '/coupons', label: 'الكوبونات', icon: '🏷️' },
  { href: '/products', label: 'المنتجات', icon: '📦' },
  { href: '/blog', label: 'المدونة', icon: '✎' },
  { href: '/banners', label: 'البنرات', icon: '📢' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === '/login') return null;

  return (
    <aside style={{ borderInlineEnd:'1px solid var(--color-line)', background:'var(--color-bg-elev)',
      padding:'24px 0', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'0 24px 20px', fontWeight:800, fontSize:'1.05rem' }}>
        عالم <span style={{ color:'var(--color-accent)' }}>الاكسسوار</span>
        <div style={{ fontSize:'.7rem', fontWeight:400, color:'var(--color-text-3)', marginTop:2 }}>لوحة التحكم</div>
      </div>
      <nav style={{ display:'grid', gap:2, flex:1 }}>
        {LINKS.map(l => (
          <Link key={l.href} href={l.href} style={{ padding:'11px 24px', fontSize:'.92rem', fontWeight:500,
            background: pathname === l.href ? 'rgba(176,141,46,.1)' : 'transparent',
            color: pathname === l.href ? 'var(--color-accent)' : 'var(--color-text-2)',
            borderInlineStart: pathname === l.href ? '3px solid var(--color-accent)' : '3px solid transparent' }}>
            {l.icon} {l.label}
          </Link>
        ))}
      </nav>
      <button onClick={async () => { await supabaseBrowser().auth.signOut(); router.push('/login'); }}
        className="btn btn-ghost btn-sm" style={{ margin:'0 16px' }}>تسجيل الخروج</button>
    </aside>
  );
}
