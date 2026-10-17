import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { apiError } from '@/lib/api-errors';

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get('phone');
  const orderNo = req.nextUrl.searchParams.get('order_no');
  if (!phone || !orderNo)
    return apiError('order_lookup_required', 400);

  const { data } = await supabase.from('orders')
    .select('order_no, status, total_egp, created_at, order_items(qty, name_ar, unit_price)')
    .eq('order_no', orderNo).eq('customer_phone', phone).single();
  if (!data) return apiError('order_not_found', 404);
  return NextResponse.json({ ok: true, data });
}
