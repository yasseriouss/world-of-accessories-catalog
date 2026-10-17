import { getTranslations } from 'next-intl/server';
import { whatsappLink } from '@/lib/format';
import { SITE } from '@/lib/site';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'contact' });
  return { title: t('metaTitle') };
}

export default async function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'contact' });
  return (
    <div className="container section">
      <div className="eyebrow">{t('eyebrow')}</div>
      <h1 style={{ fontSize:'var(--fs-h1)' }}>{t('showroom')}</h1>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'24px', marginTop:'32px' }}>
        <div className="card" style={{ padding:'28px' }}>
          <h2 style={{ fontSize:'var(--fs-h3)', marginBottom:'12px' }}>📍 {t('showroom')}</h2>
          <p style={{ color:'var(--color-text-2)', lineHeight:1.9 }}>{t('address')}</p>
          <p style={{ color:'var(--color-text-3)', fontSize:'.88rem', marginTop:'10px' }}>{t('hours')}</p>
          <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer"
            className="btn btn-outline" style={{ marginTop:'16px' }}>{t('maps')}</a>
        </div>
        <div className="card" style={{ padding:'28px' }}>
          <h2 style={{ fontSize:'var(--fs-h3)', marginBottom:'12px' }}>📞 {t('call')}</h2>
          <a href={`tel:${SITE.phoneE164}`} className="price" style={{ fontSize:'1.5rem', textDecoration:'none', display:'block' }} dir="ltr">{SITE.phoneDisplay}</a>
          <p style={{ color:'var(--color-text-3)', fontSize:'.85rem', margin:'8px 0 20px' }}>{t('availability')}</p>
          <a href={whatsappLink(SITE.whatsapp, t('whatsappGreeting'))} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            {t('whatsapp')}</a>
        </div>
      </div>
    </div>
  );
}
