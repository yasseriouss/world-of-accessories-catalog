'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-client';
import { t } from '@/lib/i18n';

export default function LoginPage() {
  const router = useRouter();
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr('');
    const fd = new FormData(e.currentTarget);
    const { error } = await supabaseBrowser().auth.signInWithPassword({
      email: fd.get('email') as string,
      password: fd.get('password') as string,
    });
    setLoading(false);
    if (error) setErr(t('login.invalid'));
    else router.push('/');
  }

  return (
    <main style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'var(--color-inverse-bg)', padding: '20px' }}>
      <form onSubmit={submit} className="card" style={{ padding:'36px 32px', width:'min(420px,100%)', display:'grid', gap:'16px', borderRadius:'var(--r-md)' }}>
        <h1 style={{ fontSize:'1.4rem', textAlign:'center', margin:0 }}>{t('brand.first')} <span style={{ color: 'var(--color-accent-text)' }}>{t('brand.accent')}</span></h1>
        <p style={{ textAlign:'center', fontSize:'.85rem', color:'var(--color-text-3)', margin:0 }}>{t('brand.panelFull')}</p>
        
        <div>
          <label htmlFor="admin-email" className="lbl" style={{ marginBottom: '6px' }}>{t('login.email')}</label>
          <input
            id="admin-email"
            name="email"
            type="email"
            required
            className="input"
            placeholder={t('login.emailPlaceholder')}
            dir="ltr"
            aria-label={t('login.email')}
          />
        </div>

        <div>
          <label htmlFor="admin-password" className="lbl" style={{ marginBottom: '6px' }}>{t('login.password')}</label>
          <input
            id="admin-password"
            name="password"
            type="password"
            required
            className="input"
            placeholder="••••••••"
            dir="ltr"
            aria-label={t('login.password')}
          />
        </div>

        {err && <p style={{ color:'var(--color-danger)', fontSize:'.85rem', textAlign:'center', margin: 0 }} role="alert">{err}</p>}
        
        <button
          className="btn btn-primary btn-lg"
          disabled={loading}
          style={{ width: '100%', minHeight: '48px', marginTop: '8px' }}
        >
          {loading ? t('login.signingIn') : t('login.signIn')}
        </button>
      </form>
    </main>
  );
}
