import { getBanners } from '../lib/queries';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';

export default async function AnnouncementBar() {
  const banners = await getBanners('store_top');
  if (!banners.length) return null;
  const locale = await getLocale();
  const t = await getTranslations('common');
  const pick = (ar?: string | null, en?: string | null) => (locale === 'ar' ? ar : en || ar);
  const doubled = [...banners, ...banners];
  return (
    <div className="annbar" role="region" aria-label={t('offers')}>
      <div className="annbar-track">
        {doubled.map((b: any, i: number) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '.875rem', fontWeight: 600 }}>
            {b.tag_ar && (
              <span
                style={{
                  background: 'var(--color-accent)',
                  color: 'var(--color-on-primary)',
                  borderRadius: 'var(--r-full)',
                  padding: '2px 10px',
                  fontSize: '.72rem',
                  fontWeight: 700,
                }}
              >
                {pick(b.tag_ar, b.tag_en)}
              </span>
            )}
            {b.link_url ? (
              <Link href={b.link_url} style={{ color: 'inherit', textDecoration: 'underline' }}>
                {pick(b.text_ar, b.text_en)}
              </Link>
            ) : (
              pick(b.text_ar, b.text_en)
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
