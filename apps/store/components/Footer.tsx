import { useTranslations } from 'next-intl';
import { whatsappLink } from '../lib/format';

export default function Footer() {
  const t = useTranslations('contact');
  const tf = useTranslations('footer');
  return (
    <footer style={{ borderTop:'1px solid var(--color-line)', marginTop:'64px', padding:'48px 0 24px' }}>
      <div className="container" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'32px' }}>
        <div>
          <div style={{ fontWeight:800, fontSize:'1.1rem', marginBottom:'12px' }}>عالم <span style={{ color:'var(--color-accent)' }}>الاكسسوار</span></div>
          <p style={{ color:'var(--color-text-2)', fontSize:'.9rem', lineHeight:1.8, margin:0 }}>
            {t('showroom')}<br />{t('address')}<br />{t('hours')}</p>
        </div>
        <div>
          <div style={{ fontWeight:700, marginBottom:'12px' }}>{tf('contact')}</div>
          <div style={{ display:'grid', gap:'10px', fontSize:'.9rem' }}>
            <a href="tel:+201140030036" style={{ color:'var(--color-text)' }} dir="ltr">0114 003 0036</a>
            <a href={whatsappLink('01140030036','مرحباً، لدي استفسار')} target="_blank" rel="noopener"
              style={{ color:'var(--color-accent)', fontWeight:600 }}>{t('whatsapp')}</a>
          </div>
        </div>
      </div>
      <div className="container" style={{ marginTop:'32px', paddingTop:'16px', borderTop:'1px solid var(--color-line)',
        fontSize:'.8rem', color:'var(--color-text-3)' }}>
        © {new Date().getFullYear()} WOA — {tf('rights')}
      </div>
    </footer>
  );
}
