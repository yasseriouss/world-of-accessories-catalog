'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-client';

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
    if (error) setErr('بيانات الدخول غير صحيحة');
    else router.push('/');
  }

  return (
    <main style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'linear-gradient(135deg, var(--brand-ink), #26220f)', padding: '20px' }}>
      <form onSubmit={submit} className="card" style={{ padding:'36px 32px', width:'min(420px,100%)', display:'grid', gap:'16px', borderRadius:'var(--r-md)' }}>
        <h1 style={{ fontSize:'1.4rem', textAlign:'center', margin:0 }}>عالم <span style={{ color:'var(--color-accent)' }}>الاكسسوار</span></h1>
        <p style={{ textAlign:'center', fontSize:'.85rem', color:'var(--color-text-3)', margin:0 }}>لوحة التحكم الإدارية</p>
        
        <div>
          <label htmlFor="admin-email" className="lbl" style={{ marginBottom: '6px' }}>البريد الإلكتروني</label>
          <input
            id="admin-email"
            name="email"
            type="email"
            required
            className="input"
            placeholder="admin@woa.eg"
            dir="ltr"
            aria-label="البريد الإلكتروني"
          />
        </div>

        <div>
          <label htmlFor="admin-password" className="lbl" style={{ marginBottom: '6px' }}>كلمة المرور</label>
          <input
            id="admin-password"
            name="password"
            type="password"
            required
            className="input"
            placeholder="••••••••"
            dir="ltr"
            aria-label="كلمة المرور"
          />
        </div>

        {err && <p style={{ color:'var(--color-danger)', fontSize:'.85rem', textAlign:'center', margin: 0 }} role="alert">{err}</p>}
        
        <button
          className="btn btn-primary btn-lg"
          disabled={loading}
          style={{ width: '100%', minHeight: '48px', marginTop: '8px' }}
        >
          {loading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
        </button>
      </form>
    </main>
  );
}
