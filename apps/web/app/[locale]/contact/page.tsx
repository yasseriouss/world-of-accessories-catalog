import { getTranslations } from 'next-intl/server';
import { whatsappLink } from '../../lib/format';

export const metadata = { title: 'تواصل معنا' };

export default async function ContactPage({ params: { locale } }: any) {
  const t = await getTranslations({ locale, namespace: 'contact' });
  return (
    <div className="container section">
      <div className="eyebrow">Contact</div>
      <h1 style={{ fontSize:'var(--fs-h1)' }}>{t('showroom')}</h1>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'24px', marginTop:'32px' }}>
        <div className="card" style={{ padding:'28px' }}>
          <h3 style={{ marginBottom:'12px' }}>📍 {t('showroom')}</h3>
          <p style={{ color:'var(--color-text-2)', lineHeight:1.9 }}>{t('address')}</p>
          <p style={{ color:'var(--color-text-3)', fontSize:'.88rem', marginTop:'10px' }}>{t('hours')}</p>
          <a href="https://maps.google.com/?q=Silla+Mall+6th+October" target="_blank" rel="noopener"
            className="btn btn-outline" style={{ marginTop:'16px' }}>Google Maps</a>
        </div>
        <div className="card" style={{ padding:'28px' }}>
          <h3 style={{ marginBottom:'12px' }}>📞 {t('call')}</h3>
          <a href="tel:+201140030036" className="price" style={{ fontSize:'1.5rem', textDecoration:'none', display:'block' }} dir="ltr">0114 003 0036</a>
          <p style={{ color:'var(--color-text-3)', fontSize:'.85rem', margin:'8px 0 20px' }}>متاح يومياً لخدمة العملاء</p>
          <a href={whatsappLink('01140030036','مرحباً، لدي استفسار')} target="_blank" rel="noopener" className="btn btn-primary">
            {t('whatsapp')}</a>
        </div>
      </div>
    </div>
  );
}
