import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { apiError } from '@/lib/api-errors';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();
    if (!code || typeof code !== 'string') {
      return apiError('coupon_required', 400);
    }

    const cleanCode = code.trim().toUpperCase();
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', cleanCode)
      .eq('is_active', true)
      .single();

    if (error || !coupon) {
      return apiError('coupon_invalid', 404);
    }

    const now = new Date();
    if (coupon.starts_at && new Date(coupon.starts_at) > now) {
      return apiError('coupon_not_started', 400);
    }
    if (coupon.ends_at && new Date(coupon.ends_at) < now) {
      return apiError('coupon_expired', 400);
    }
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return apiError('coupon_exhausted', 400);
    }
    if (coupon.min_order && subtotal < Number(coupon.min_order)) {
      return apiError('coupon_min_order', 400, { min: Number(coupon.min_order) });
    }

    let discount = 0;
    if (coupon.type === 'percent') {
      discount = (subtotal * Number(coupon.value)) / 100;
    } else {
      discount = Math.min(Number(coupon.value), subtotal);
    }

    return NextResponse.json({
      ok: true,
      data: {
        code: coupon.code,
        type: coupon.type,
        value: Number(coupon.value),
        discount: Math.round(discount * 100) / 100,
      },
    });
  } catch (err) {
    console.error('Coupon validation error:', err);
    return apiError('coupon_failed', 500);
  }
}
