'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '../lib/supabase-client';

export default function LoginPage() {
  const router = useRouter();
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabaseBrowser().auth.signInWithPassword({
      email: fd.get('email') as string, password: fd.get('password') as string });
    setLoading(false);
    if (error) setErr('بيانات الدخول غير صحيحة');
    else router.push('/');
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'linear-gradient(135deg,#141311,#26220f)' }}>
      <form onSubmit={submit} className="card" style={{ padding:'40px', width:'min(400px,90vw)', display:'grid', gap:'16px' }}>
        <h1 style={{ fontSize:'1.3rem', textAlign:'center' }}>عالم <span style={{ color:'var(--color-accent)' }}>الاكسسوار</span></h1>
        <p style={{ textAlign:'center', fontSize:'.85rem', color:'var(--color-text-3)', marginTop:'-10px' }}>لوحة التحكم الإدارية</p>
        <input name="email" type="email" required className="input" placeholder="البريد الإلكتروني" dir="ltr" />
        <input name="password" type="password" required className="input" placeholder="كلمة المرور" dir="ltr" />
        {err && <p style={{ color:'var(--color-danger)', fontSize:'.85rem', textAlign:'center' }}>{err}</p>}
        <button className="btn btn-primary btn-lg" disabled={loading}>{loading ? '...' : 'دخول'}</button>
      </form>
    </div>
  );
}
