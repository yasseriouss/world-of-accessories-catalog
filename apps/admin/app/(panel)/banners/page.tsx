'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-client';
import { t } from '@/lib/i18n';

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
      <h1 style={{ fontSize:'1.5rem' }}>{t('banners.title')}</h1>

      <form onSubmit={add} className="card" style={{ padding:'20px', display:'grid',
        gridTemplateColumns:'2fr 1fr 1fr 1fr auto', gap:'12px', alignItems:'end' }}>
        <div><label className="lbl">{t('banners.text')}</label><input name="text_ar" required className="input" /></div>
        <div><label className="lbl">{t('banners.tag')}</label><input name="tag_ar" className="input" placeholder={t('banners.tagPlaceholder')} /></div>
        <div><label className="lbl">{t('banners.link')}</label><input name="link_url" className="input" dir="ltr" placeholder={t('banners.linkPlaceholder')} /></div>
        <div><label className="lbl">{t('banners.placement')}</label>
          <select name="placement" className="input">
            <option value="store_top">{t('banners.placements.store_top')}</option>
            <option value="store_hero">{t('banners.placements.store_hero')}</option>
            <option value="web_hero">{t('banners.placements.web_hero')}</option>
          </select></div>
        <button className="btn btn-primary">{t('common.add')}</button>
      </form>

      <table className="admin">
        <thead><tr><th>{t('banners.textCol')}</th><th>{t('banners.placement')}</th><th>{t('banners.clicks')}</th><th>{t('common.status')}</th><th></th></tr></thead>
        <tbody>{banners.map(b => (
          <tr key={b.id}>
            <td>{b.text_ar} {b.tag_ar && <span className="chip" style={{ marginInlineStart:'8px' }}>{b.tag_ar}</span>}</td>
            <td style={{ fontSize:'.85rem' }}>{b.placement}</td>
            <td className="price">{b.clicks}</td>
            <td>{b.is_active ? <span className="chip chip-stock">{t('banners.active')}</span> : <span className="chip">{t('common.paused')}</span>}</td>
            <td><button className="btn btn-outline btn-sm" onClick={() => toggle(b)}>{b.is_active ? t('banners.deactivate') : t('banners.activate')}</button></td>
          </tr>))}
        </tbody>
      </table>
    </div>
  );
}

