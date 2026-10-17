import { supabaseServer } from '@/lib/supabase-server';
import ProductsManager from './ProductsManager';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }: any) {
  const supabase = supabaseServer();
  let qb = supabase
    .from('products')
    .select('id, code, name_ar, price_egp, sale_price, stock, is_active, is_featured')
    .order('created_at', { ascending: false })
    .limit(250);

  if (searchParams?.q) {
    qb = qb.or(`name_ar.ilike.%${searchParams.q}%,code.ilike.%${searchParams.q}%`);
  }

  const { data: products } = await qb;

  return (
    <ProductsManager
      initialProducts={products || []}
      initialQuery={searchParams?.q || ''}
    />
  );
}
