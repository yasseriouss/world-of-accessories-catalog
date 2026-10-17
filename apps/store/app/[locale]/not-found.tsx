import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('notFound');
  const locale = useLocale();
  return (
    <div className="container section" style={{ textAlign:'center', padding:'100px 0' }}>
      <div style={{ fontSize:'5rem', fontWeight:800, color:'var(--color-line-strong)' }}>404</div>
      <p style={{ color:'var(--color-text-2)', margin:'16px 0 24px' }}>{t('message')}</p>
      <Link href={`/${locale}`} className="btn btn-primary">{t('back')}</Link>
    </div>
  );
}
