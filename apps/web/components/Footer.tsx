import { getLocale, getTranslations } from 'next-intl/server';
import { whatsappLink } from '@/lib/format';
import { SITE } from '@/lib/site';
import { LEGAL_SLUGS } from '@/lib/legal';

export default async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations('footer');
  const tb = await getTranslations('brand');
  const tl = await getTranslations('legal');
  const tc = await getTranslations('contact');
  return (
    <footer style={{ borderTop:'1px solid var(--color-line)', padding:'48px 0 24px', marginTop:'64px' }}>
      <div className="container" style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'24px' }}>
        <div>
          <div style={{ fontWeight:800, marginBottom:'8px' }}>{tb('first')} <span style={{ color: 'var(--color-accent-text)' }}>{tb('accent')}</span></div>
          <div style={{ fontSize:'.85rem', color:'var(--color-text-2)' }}>{t('location')}<br />{t('hours')}</div>
        </div>
        <nav aria-label={t('links')} style={{ display:'grid', gap:'8px', fontSize:'.88rem' }}>
          {LEGAL_SLUGS.map((slug) => (
            <a key={slug} href={`/${locale}/legal/${slug}`}>{tl(`${slug}.short`)}</a>
          ))}
        </nav>
        <a href={whatsappLink(SITE.whatsapp, tc('whatsappGreeting'))} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent-text)', fontWeight:600 }}>{tc('whatsapp')}</a>
      </div>
      <div className="container" style={{ marginTop:'32px', fontSize:'.78rem', color:'var(--color-text-3)' }}>
        © {new Date().getFullYear()} {tb('short')} — {t('rights')}</div>
    </footer>
  );
}
