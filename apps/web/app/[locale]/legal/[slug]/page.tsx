import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { LEGAL_SLUGS, isLegalSlug } from '@/lib/legal';

export const revalidate = 86400;

type Section = { heading?: string; text: string };

export function generateStaticParams() {
  return LEGAL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'legal' });
  return { title: isLegalSlug(params.slug) ? t(`${params.slug}.title`) : t('fallbackTitle') };
}

export default async function LegalPage({ params }: { params: { locale: string; slug: string } }) {
  if (!isLegalSlug(params.slug)) notFound();
  const t = await getTranslations({ locale: params.locale, namespace: 'legal' });
  const sections = t.raw(`${params.slug}.sections`) as Section[];
  return (
    <div className="container section">
      <article className="prose">
        <h1 style={{ fontSize: 'var(--fs-h1)' }}>{t(`${params.slug}.title`)}</h1>
        {sections.map((s, i) => (
          <section key={i}>
            {s.heading && <h2>{s.heading}</h2>}
            <p>{s.text}</p>
          </section>
        ))}
      </article>
    </div>
  );
}
