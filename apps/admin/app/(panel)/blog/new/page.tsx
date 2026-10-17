'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [faq, setFaq] = useState([{ q: '', a: '' }]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const slug = (fd.get('title_ar') as string).trim().replace(/\s+/g, '-');
    const { data: post, error } = await supabaseBrowser().from('posts').insert({
      slug, title_ar: fd.get('title_ar'), title_en: fd.get('title_en') || null,
      excerpt_ar: (fd.get('content_ar') as string).replace(/<[^>]+>/g,'').slice(0, 155),
      content_ar: fd.get('content_ar'), content_en: fd.get('content_en') || null,
      cover_url: fd.get('cover_url') || null, category_slug: fd.get('category_slug') || null,
      status: fd.get('publish') === 'on' ? 'published' : 'draft',
      published_at: fd.get('publish') === 'on' ? new Date().toISOString() : null
    }).select().single();
    if (!error && post) {
      const faqs = faq.filter(f => f.q && f.a);
      if (faqs.length)
        await supabaseBrowser().from('post_sections').insert(
          faqs.map((f, i) => ({ post_id: post.id, type: 'faq', content: [f], sort: i })));
      router.push('/blog');
    } else alert(error?.message);
    setLoading(false);
  }

  return (
    <div style={{ maxWidth:'820px', display:'grid', gap:'20px' }}>
      <h1 style={{ fontSize:'1.5rem' }}>مقال جديد</h1>
      <form onSubmit={submit} className="card" style={{ padding:'28px', display:'grid', gap:'16px' }}>
        <div><label className="lbl">العنوان بالعربية *</label><input name="title_ar" required className="input" /></div>
        <div><label className="lbl">العنوان بالإنجليزية</label><input name="title_en" className="input" dir="ltr" /></div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div><label className="lbl">صورة الغلاف (رابط)</label><input name="cover_url" className="input" dir="ltr" placeholder="https://..." /></div>
          <div><label className="lbl">القسم المرتبط</label>
            <select name="category_slug" className="input">
              <option value="">—</option>
              <option value="kitchen">المطابخ</option><option value="dressing">الدريسينج</option>
              <option value="handles">المقابض</option><option value="mechanisms">الأنظمة</option>
            </select></div>
        </div>
        <div><label className="lbl">المحتوى بالعربية (HTML) *</label>
          <textarea name="content_ar" required className="input" rows={12}
            placeholder="<h2>عنوان فرعي</h2><p>النص...</p>" /></div>
        <div><label className="lbl">المحتوى بالإنجليزية</label>
          <textarea name="content_en" className="input" rows={8} dir="ltr" /></div>

        <fieldset style={{ border:'1px solid var(--color-line)', borderRadius:'var(--r-md)', padding:'16px', display:'grid', gap:'12px' }}>
          <legend style={{ fontSize:'.85rem', fontWeight:600, padding:'0 8px' }}>أسئلة شائعة (FAQ Schema — تظهر في جوجل)</legend>
          {faq.map((f, i) => (
            <div key={i} style={{ display:'grid', gap:'8px', gridTemplateColumns:'1fr 1fr auto' }}>
              <input className="input" placeholder="السؤال" value={f.q}
                onChange={e => setFaq(faq.map((x,j) => j===i ? { ...x, q: e.target.value } : x))} />
              <input className="input" placeholder="الإجابة" value={f.a}
                onChange={e => setFaq(faq.map((x,j) => j===i ? { ...x, a: e.target.value } : x))} />
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setFaq(faq.filter((_,j) => j!==i))}>✕</button>
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-sm" onClick={() => setFaq([...faq, { q:'', a:'' }])}>+ سؤال</button>
        </fieldset>

        <label style={{ display:'flex', gap:'8px', alignItems:'center', fontWeight:600 }}>
          <input type="checkbox" name="publish" /> نشر فوراً (وإلا يُحفظ مسودة)
        </label>
        <button className="btn btn-primary btn-lg" disabled={loading}>{loading ? '...' : 'حفظ المقال'}</button>
      </form>
    </div>
  );
}

