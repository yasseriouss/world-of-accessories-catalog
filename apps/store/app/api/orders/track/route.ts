import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get('phone');
  const orderNo = req.nextUrl.searchParams.get('order_no');
  if (!phone || !orderNo)
    return NextResponse.json({ ok: false, error: 'phone and order_no required' }, { status: 400 });

  const { data } = await supabase.from('orders')
    .select('order_no, status, total_egp, created_at, order_items(qty, name_ar, unit_price)')
    .eq('order_no', orderNo).eq('customer_phone', phone).single();
  if (!data) return NextResponse.json({ ok: false, error: 'غير موجود' }, { status: 404 });
  return NextResponse.json({ ok: true, data });
}
