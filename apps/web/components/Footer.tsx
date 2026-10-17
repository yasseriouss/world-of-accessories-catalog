import { getTranslations } from 'next-intl/server';
import { whatsappLink } from '@/lib/format';

export default async function Footer() {
  const t = await getTranslations('footer');
  return (
    <footer style={{ borderTop:'1px solid var(--color-line)', padding:'48px 0 24px', marginTop:'64px' }}>
      <div className="container" style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'24px' }}>
        <div>
          <div style={{ fontWeight:800, marginBottom:'8px' }}>عالم <span style={{ color:'var(--color-accent)' }}>الاكسسوار</span></div>
          <div style={{ fontSize:'.85rem', color:'var(--color-text-2)' }}>6 أكتوبر — سيلا مول<br />يومياً 10ص - 10م</div>
        </div>
        <nav style={{ display:'grid', gap:'8px', fontSize:'.88rem' }}>
          <a href="/ar/legal/shipping">سياسة الشحن</a>
          <a href="/ar/legal/returns">الاسترجاع</a>
          <a href="/ar/legal/privacy">الخصوصية</a>
          <a href="/ar/legal/terms">الشروط</a>
        </nav>
        <a href={whatsappLink('01140030036','مرحباً')} target="_blank" rel="noopener" style={{ color:'var(--color-accent)', fontWeight:600 }}>WhatsApp</a>
      </div>
      <div className="container" style={{ marginTop:'32px', fontSize:'.78rem', color:'var(--color-text-3)' }}>
        © {new Date().getFullYear()} WOA — {t('rights')}</div>
    </footer>
  );
}
