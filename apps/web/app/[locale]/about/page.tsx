import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('metaTitle') };
}

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'about' });
  const points = t.raw('points') as { title: string; text: string }[];
  return (
    <div className="container section">
      <div className="eyebrow">{t('eyebrow')}</div>
      <h1 style={{ fontSize:'var(--fs-h1)' }}>{t('title')}</h1>
      <div className="prose" style={{ margin:0 }}>
        <p>{t('intro')}</p>
        <h2>{t('whyTitle')}</h2>
        <ul>
          {points.map((pt) => (
            <li key={pt.title}><strong>{pt.title}:</strong> {pt.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
