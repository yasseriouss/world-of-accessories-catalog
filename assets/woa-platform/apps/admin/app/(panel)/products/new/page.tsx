'use client';
import { useState } from 'react';
import { supabaseBrowser } from '../../../lib/supabase-client';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const slug = (fd.get('name_ar') as string).trim().replace(/\s+/g, '-');
    const { error } = await supabaseBrowser().from('products').insert({
      code: fd.get('code'), name_ar: fd.get('name_ar'), name_en: fd.get('name_en') || null,
      slug, desc_ar: fd.get('desc_ar') || null,
      category_id: fd.get('category_id'),
      price_egp: +fd.get('price')!, sale_price: fd.get('sale') ? +fd.get('sale')! : null,
      stock: +fd.get('stock')!, is_featured: fd.get('featured') === 'on',
      images: [], is_active: true
    });
    setLoading(false);
    if (!error) router.push('/products');
    else alert(error.message);
  }

  return (
    <div style={{ maxWidth:'720px', display:'grid', gap:'20px' }}>
      <h1 style={{ fontSize:'1.5rem' }}>منتج جديد</h1>
      <form onSubmit={submit} className="card" style={{ padding:'28px', display:'grid', gap:'16px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div><label className="lbl">الكود *</label><input name="code" required className="input" placeholder="WOA-1042" dir="ltr" /></div>
          <div><label className="lbl">القسم *</label>
            <select name="category_id" required className="input"><option value="">اختر…</option></select></div>
        </div>
        <div><label className="lbl">الاسم بالعربية *</label><input name="name_ar" required className="input" /></div>
        <div><label className="lbl">الاسم بالإنجليزية</label><input name="name_en" className="input" dir="ltr" /></div>
        <div><label className="lbl">الوصف</label><textarea name="desc_ar" className="input" rows={3} /></div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
          <div><label className="lbl">السعر (ج.م) *</label><input name="price" type="number" step="0.5" required className="input" /></div>
          <div><label className="lbl">سعر الخصم</label><input name="sale" type="number" step="0.5" className="input" /></div>
          <div><label className="lbl">المخزون *</label><input name="stock" type="number" required className="input" /></div>
        </div>
        <label style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          <input type="checkbox" name="featured" /> منتج مميز (يظهر في الرئيسية)
        </label>
        <button className="btn btn-primary btn-lg" disabled={loading}>{loading ? '...' : 'حفظ المنتج'}</button>
      </form>
    </div>
  );
}
