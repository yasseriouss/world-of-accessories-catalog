import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase-server';
import { t, tOr } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export default async function BlogAdmin() {
  const { data: posts } = await supabaseServer().from('posts')
    .select('id, slug, title_ar, status, views, published_at').order('created_at', { ascending: false });

  return (
    <div style={{ display:'grid', gap:'20px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h1 style={{ fontSize:'1.5rem' }}>{t('nav.blog')}</h1>
        <Link href="/blog/new" className="btn btn-primary">{t('blog.new')}</Link>
      </div>
      <table className="admin">
        <thead><tr><th>{t('blog.colTitle')}</th><th>{t('common.status')}</th><th>{t('blog.views')}</th><th>{t('blog.published')}</th></tr></thead>
        <tbody>{posts?.map((p: any) => (
          <tr key={p.id}>
            <td>{p.title_ar}<div style={{ fontSize:'.75rem', color:'var(--color-text-3)' }} dir="ltr">/blog/{p.slug}</div></td>
            <td><span className={`chip ${p.status==='published'?'chip-stock':''}`}>{tOr(`blog.status.${p.status}`, p.status)}</span></td>
            <td className="price">{p.views}</td>
            <td style={{ fontSize:'.85rem', color:'var(--color-text-2)' }}>{p.published_at ? new Date(p.published_at).toLocaleDateString('ar-EG') : '—'}</td>
          </tr>))}
        </tbody>
      </table>
    </div>
  );
}

