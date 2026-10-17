'use client';
import { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import ImageUploader, { UploadedImage } from '@/components/ImageUploader';

interface Category {
  id: string;
  name_ar: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<UploadedImage[]>([]);

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabaseBrowser()
        .from('categories')
        .select('id, name_ar')
        .order('name_ar');
      if (data) setCategories(data);
    }
    loadCategories();
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const code = (fd.get('code') as string).trim();
    const nameAr = (fd.get('name_ar') as string).trim();
    const nameEn = (fd.get('name_en') as string)?.trim() || null;
    
    // Create SEO-friendly slug
    const baseSlug = (nameEn ? nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-') : nameAr.replace(/\s+/g, '-'))
      .replace(/^-+|-+$/g, '');
    const slug = `${baseSlug}-${code.toLowerCase()}`;

    const formattedImages = images.map((img, idx) => ({
      url: img.url,
      alt_ar: img.alt_ar || nameAr,
      alt_en: img.alt_en || nameEn || '',
      sort: idx + 1,
    }));

    const { error } = await supabaseBrowser().from('products').insert({
      code,
      name_ar: nameAr,
      name_en: nameEn,
      slug,
      desc_ar: (fd.get('desc_ar') as string)?.trim() || null,
      desc_en: (fd.get('desc_en') as string)?.trim() || null,
      category_id: fd.get('category_id'),
      price_egp: +fd.get('price')!,
      sale_price: fd.get('sale') ? +fd.get('sale')! : null,
      stock: +fd.get('stock')!,
      material: (fd.get('material') as string)?.trim() || null,
      brand: (fd.get('brand') as string)?.trim() || 'World of Accessories',
      is_featured: fd.get('featured') === 'on',
      images: formattedImages,
      is_active: true,
      seo_title_ar: `${nameAr} | عالم الإكسسوارات`,
      seo_desc_ar: (fd.get('desc_ar') as string)?.trim()?.slice(0, 160) || null,
    });

    setLoading(false);
    if (!error) {
      router.push('/products');
    } else {
      alert(`خطأ أثناء الحفظ: ${error.message}`);
    }
  }

  return (
    <div style={{ maxWidth: '800px', display: 'grid', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>منتج جديد</h1>
        <p style={{ color: 'var(--color-text-3)', fontSize: '.9rem', marginTop: '4px' }}>
          إضافة منتج جديد لكتالوج متجر عالم الإكسسوارات مع رفع الصور وربط الأقسام.
        </p>
      </div>

      <form onSubmit={submit} className="card" style={{ padding: '28px', display: 'grid', gap: '20px' }}>
        {/* Core Identifiers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label className="lbl">كود المعرض (SKU) *</label>
            <input name="code" required className="input" placeholder="WOA-1042" dir="ltr" />
          </div>
          <div>
            <label className="lbl">القسم *</label>
            <select name="category_id" required className="input">
              <option value="">اختر القسم...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name_ar}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Names */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label className="lbl">الاسم بالعربية *</label>
            <input name="name_ar" required className="input" placeholder="مفصلة سوفت كلوز 3D" />
          </div>
          <div>
            <label className="lbl">الاسم بالإنجليزية</label>
            <input name="name_en" className="input" placeholder="Soft-close 3D Hinge" dir="ltr" />
          </div>
        </div>

        {/* Descriptions */}
        <div>
          <label className="lbl">الوصف بالعربية</label>
          <textarea name="desc_ar" className="input" rows={3} placeholder="وصف تفصيلي ومواصفات المنتج..." />
        </div>

        {/* Pricing & Inventory */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div>
            <label className="lbl">السعر (ج.م) *</label>
            <input name="price" type="number" step="0.5" min="0" required className="input" placeholder="0.00" />
          </div>
          <div>
            <label className="lbl">سعر الخصم (ج.م)</label>
            <input name="sale" type="number" step="0.5" min="0" className="input" placeholder="اختياري" />
          </div>
          <div>
            <label className="lbl">المخزون المتوفر *</label>
            <input name="stock" type="number" min="0" required defaultValue={10} className="input" />
          </div>
        </div>

        {/* Attributes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label className="lbl">الخامة / المادة</label>
            <input name="material" className="input" placeholder="ستانلس ستيل 304، ألومنيوم..." />
          </div>
          <div>
            <label className="lbl">العلامة التجارية</label>
            <input name="brand" className="input" defaultValue="World of Accessories" />
          </div>
        </div>

        {/* Image Upload Component (Supabase Storage) */}
        <ImageUploader
          value={images}
          onChange={setImages}
          bucket="products"
          folder="catalog"
          maxFiles={6}
        />

        {/* Featured Flag */}
        <label style={{ display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer' }}>
          <input type="checkbox" name="featured" style={{ width: '18px', height: '18px' }} />
          <span style={{ fontSize: '.95rem', fontWeight: 500 }}>
            منتج مميز (يظهر في واجهة المتجر الرئيسية وقسم المنتجات المختارة)
          </span>
        </label>

        {/* Submit Button */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button
            type="button"
            onClick={() => router.push('/products')}
            className="btn"
            style={{ border: '1px solid var(--color-line)' }}
          >
            إلغاء
          </button>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'جاري الحفظ والرفع...' : 'حفظ المنتج'}
          </button>
        </div>
      </form>
    </div>
  );
}


