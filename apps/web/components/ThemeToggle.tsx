'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

// Light is the default theme; dark is opt-in and persisted in localStorage.
export default function ThemeToggle() {
  const t = useTranslations('common');
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.getAttribute('data-theme') === 'dark');
    setReady(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    if (next) document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    try { localStorage.setItem('woa-theme', next ? 'dark' : 'light'); } catch {}
  }

  const label = dark ? t('themeLight') : t('themeDark');

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn btn-ghost btn-sm btn-icon"
      aria-label={label}
      aria-pressed={dark}
      title={label}
      style={{ visibility: ready ? 'visible' : 'hidden', flex: 'none' }}
    >
      {dark
        ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
        : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>}
    </button>
  );
}
