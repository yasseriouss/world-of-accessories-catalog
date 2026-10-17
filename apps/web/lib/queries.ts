import { supabase } from './supabase';

export type Product = {
  id: string; slug: string; code: string;
  name_ar: string; name_en: string | null;
  price_egp: number; sale_price: number | null;
  stock: number; images: { url: string; alt_ar?: string }[];
  rating_avg: number; rating_count: number; sold_count: number;
  category_id: string; is_featured: boolean;
};

const PRODUCT_COLS = 'id,slug,code,name_ar,name_en,price_egp,sale_price,stock,images,rating_avg,rating_count,sold_count,category_id,is_featured';

export async function getBanners(placement = 'store_top') {
  const now = new Date().toISOString();
  const { data } = await supabase.from('banners').select('*')
    .eq('placement', placement).eq('is_active', true)
    .or(`starts_at.is.null,starts_at.lte.${now}`).or(`ends_at.is.null,ends_at.gte.${now}`)
    .order('sort_order');
  return data ?? [];
}

export async function getCategories() {
  const { data } = await supabase.from('categories').select('id,slug,name_ar,name_en,image_url,parent_id')
    .eq('is_active', true).order('sort_order');
  return data ?? [];
}

export async function getProducts(opts: {
  category?: string; q?: string; sort?: string;
  min?: number; max?: number; page?: number; pageSize?: number;
} = {}) {
  const { category, q, sort, min, max, page = 1, pageSize = 24 } = opts;
  let qb = supabase.from('products').select(PRODUCT_COLS, { count: 'exact' }).eq('is_active', true);
  if (category) {
    const { data: cats } = await supabase.from('categories').select('id').eq('slug', category);
    const ids = (cats ?? []).map(c => c.id);
    if (ids.length) qb = qb.in('category_id', ids);
  }
  if (q) qb = qb.or(`name_ar.ilike.%${q}%,name_en.ilike.%${q}%,code.ilike.%${q}%`);
  if (min != null) qb = qb.gte('price_egp', min);
  if (max != null) qb = qb.lte('price_egp', max);
  if (sort === 'price_asc') qb = qb.order('price_egp', { ascending: true });
  else if (sort === 'price_desc') qb = qb.order('price_egp', { ascending: false });
  else if (sort === 'best') qb = qb.order('sold_count', { ascending: false });
  else qb = qb.order('created_at', { ascending: false });
  const from = (page - 1) * pageSize;
  const { data, count } = await qb.range(from, from + pageSize - 1);
  return { products: (data ?? []) as Product[], total: count ?? 0, pages: Math.ceil((count ?? 0) / pageSize) };
}

export async function getFeatured(limit = 8) {
  const { data } = await supabase.from('products').select(PRODUCT_COLS)
    .eq('is_active', true).eq('is_featured', true).limit(limit);
  return (data ?? []) as Product[];
}

export async function getBestSellers(limit = 8) {
  const { data } = await supabase.from('products').select(PRODUCT_COLS)
    .eq('is_active', true).order('sold_count', { ascending: false }).limit(limit);
  return (data ?? []) as Product[];
}

export async function getProduct(slug: string) {
  const { data } = await supabase.from('products').select('*').eq('slug', slug).eq('is_active', true).single();
  return data;
}

export async function getRelated(categoryId: string, excludeId: string, limit = 4) {
  const { data } = await supabase.from('products').select(PRODUCT_COLS)
    .eq('is_active', true).eq('category_id', categoryId).neq('id', excludeId).limit(limit);
  return (data ?? []) as Product[];
}

export async function getShippingZones() {
  const { data } = await supabase.from('shipping_zones').select('*').order('fee_egp');
  return data ?? [];
}

export async function getPostsByCategory(catSlug: string, limit = 3) {
  const { data } = await supabase.from('posts').select('slug,title_ar,title_en,excerpt_ar,cover_url,published_at')
    .eq('status', 'published').eq('category_slug', catSlug).order('published_at', { ascending: false }).limit(limit);
  return data ?? [];
}
