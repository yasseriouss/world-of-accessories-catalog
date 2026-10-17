import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
const ST: Record<string,string> = { draft:'مسودة', published:'منشور', archived:'مؤرشف' };

export default async function BlogAdmin() {
  const { data: posts } = await supabaseServer().from('posts')
    .select('id, slug, title_ar, status, views, published_at').order('created_at', { ascending: false });

  return (
    <div style={{ display:'grid', gap:'20px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h1 style={{ fontSize:'1.5rem' }}>المدونة</h1>
        <Link href="/blog/new" className="btn btn-primary">+ مقال جديد</Link>
      </div>
      <table className="admin">
        <thead><tr><th>العنوان</th><th>الحالة</th><th>المشاهدات</th><th>النشر</th></tr></thead>
        <tbody>{posts?.map((p: any) => (
          <tr key={p.id}>
            <td>{p.title_ar}<div style={{ fontSize:'.75rem', color:'var(--color-text-3)' }} dir="ltr">/blog/{p.slug}</div></td>
            <td><span className={`chip ${p.status==='published'?'chip-stock':''}`}>{ST[p.status]}</span></td>
            <td className="price">{p.views}</td>
            <td style={{ fontSize:'.85rem', color:'var(--color-text-2)' }}>{p.published_at ? new Date(p.published_at).toLocaleDateString('ar-EG') : '—'}</td>
          </tr>))}
        </tbody>
      </table>
    </div>
  );
}

