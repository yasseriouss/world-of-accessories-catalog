import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase-server';
import { egp } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }: any) {
  const supabase = supabaseServer();
  let qb = supabase.from('products').select('id, code, name_ar, price_egp, sale_price, stock, is_active, is_featured')
    .order('created_at', { ascending: false }).limit(200);
  if (searchParams.q) qb = qb.or(`name_ar.ilike.%${searchParams.q}%,code.ilike.%${searchParams.q}%`);
  const { data: products } = await qb;

  return (
    <div style={{ display:'grid', gap:'20px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
        <h1 style={{ fontSize:'1.5rem' }}>المنتجات ({products?.length})</h1>
        <div style={{ display:'flex', gap:'8px' }}>
          <form><input name="q" className="input" placeholder="بحث بالاسم أو الكود" defaultValue={searchParams.q} style={{ width:'220px' }} /></form>
          <Link href="/products/new" className="btn btn-primary">+ منتج جديد</Link>
        </div>
      </div>
      <table className="admin">
        <thead><tr><th>الكود</th><th>الاسم</th><th>السعر</th><th>الخصم</th><th>المخزون</th><th>مميز</th><th>الحالة</th></tr></thead>
        <tbody>{products?.map((p: any) => (
          <tr key={p.id}>
            <td style={{ fontWeight:600 }}>{p.code}</td>
            <td>{p.name_ar}</td>
            <td className="price">{egp(p.price_egp,'ar')}</td>
            <td>{p.sale_price ? <span className="chip chip-sale">{egp(p.sale_price,'ar')}</span> : '—'}</td>
            <td>{p.stock <= 0 ? <span className="chip chip-out">نفد</span> :
                 p.stock <= 5 ? <span className="chip chip-sale">{p.stock} — منخفض</span> : p.stock}</td>
            <td>{p.is_featured ? '⭐' : '—'}</td>
            <td>{p.is_active ? <span className="chip chip-stock">نشط</span> : <span className="chip">موقوف</span>}</td>
          </tr>))}
        </tbody>
      </table>
    </div>
  );
}

