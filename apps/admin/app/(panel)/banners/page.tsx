'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-client';

export default function BannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const sb = supabaseBrowser();
  const load = () => sb.from('banners').select('*').order('sort_order').then(r => setBanners(r.data ?? []));
  useEffect(() => { load(); }, []);

  async function toggle(b: any) {
    await sb.from('banners').update({ is_active: !b.is_active }).eq('id', b.id);
    load();
  }
  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await sb.from('banners').insert({
      text_ar: fd.get('text_ar'), tag_ar: fd.get('tag_ar') || null,
      link_url: fd.get('link_url') || null, placement: fd.get('placement'),
      is_active: true
    });
    (e.target as HTMLFormElement).reset();
    load();
  }

  return (
    <div style={{ display:'grid', gap:'24px' }}>
      <h1 style={{ fontSize:'1.5rem' }}>البنرات والعروض</h1>

      <form onSubmit={add} className="card" style={{ padding:'20px', display:'grid',
        gridTemplateColumns:'2fr 1fr 1fr 1fr auto', gap:'12px', alignItems:'end' }}>
        <div><label className="lbl">نص الإعلان *</label><input name="text_ar" required className="input" /></div>
        <div><label className="lbl">التاج</label><input name="tag_ar" className="input" placeholder="عرض خاص" /></div>
        <div><label className="lbl">الرابط</label><input name="link_url" className="input" dir="ltr" placeholder="https://wa.me/..." /></div>
        <div><label className="lbl">المكان</label>
          <select name="placement" className="input">
            <option value="store_top">شريط المتجر</option>
            <option value="store_hero">Hero المتجر</option>
            <option value="web_hero">Hero اللاندنج</option>
          </select></div>
        <button className="btn btn-primary">إضافة</button>
      </form>

      <table className="admin">
        <thead><tr><th>النص</th><th>المكان</th><th>النقرات</th><th>الحالة</th><th></th></tr></thead>
        <tbody>{banners.map(b => (
          <tr key={b.id}>
            <td>{b.text_ar} {b.tag_ar && <span className="chip" style={{ marginInlineStart:'8px' }}>{b.tag_ar}</span>}</td>
            <td style={{ fontSize:'.85rem' }}>{b.placement}</td>
            <td className="price">{b.clicks}</td>
            <td>{b.is_active ? <span className="chip chip-stock">مفعّل</span> : <span className="chip">موقوف</span>}</td>
            <td><button className="btn btn-outline btn-sm" onClick={() => toggle(b)}>{b.is_active ? 'إيقاف' : 'تفعيل'}</button></td>
          </tr>))}
        </tbody>
      </table>
    </div>
  );
}

