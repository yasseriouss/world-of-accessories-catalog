import { useTranslations } from 'next-intl';
import { whatsappLink } from '../lib/format';
import { SITE } from '../lib/site';

export default function Footer() {
  const t = useTranslations('contact');
  const tf = useTranslations('footer');
  const tb = useTranslations('brand');
  return (
    <footer style={{ borderTop:'1px solid var(--color-line)', marginTop:'64px', padding:'48px 0 24px' }}>
      <div className="container" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'32px' }}>
        <div>
          <div style={{ fontWeight:800, fontSize:'1.1rem', marginBottom:'12px' }}>{tb('first')} <span style={{ color:'var(--color-accent-text)' }}>{tb('accent')}</span></div>
          <p style={{ color:'var(--color-text-2)', fontSize:'.9rem', lineHeight:1.8, margin:0 }}>
            {t('showroom')}<br />{t('address')}<br />{t('hours')}</p>
        </div>
        <div>
          <div style={{ fontWeight:700, marginBottom:'12px' }}>{tf('contact')}</div>
          <div style={{ display:'grid', gap:'10px', fontSize:'.9rem' }}>
            <a href={`tel:${SITE.phoneE164}`} style={{ color:'var(--color-text)' }} dir="ltr">{SITE.phoneDisplay}</a>
            <a href={whatsappLink(SITE.whatsapp, t('whatsappGreeting'))} target="_blank" rel="noopener noreferrer"
              style={{ color:'var(--color-accent-text)', fontWeight:600 }}>{t('whatsapp')}</a>
          </div>
        </div>
      </div>
      <div className="container" style={{ marginTop:'32px', paddingTop:'16px', borderTop:'1px solid var(--color-line)',
        fontSize:'.8rem', color:'var(--color-text-3)' }}>
        © {new Date().getFullYear()} {tb('short')} — {tf('rights')}
      </div>
    </footer>
  );
}
