'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ScrollTop() {
  const t = useTranslations('common');
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 600);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <button className={`scrolltop ${show ? 'show' : ''}`} aria-label={t('scrollTop')}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7"/></svg>
    </button>
  );
}
