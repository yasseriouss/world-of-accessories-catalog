import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ ok: false, error: 'برجاء إدخال كود الكوبون' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', cleanCode)
      .eq('is_active', true)
      .single();

    if (error || !coupon) {
      return NextResponse.json({ ok: false, error: 'كود الكوبون غير صالح أو منتهي الصلاحية' }, { status: 404 });
    }

    const now = new Date();
    if (coupon.starts_at && new Date(coupon.starts_at) > now) {
      return NextResponse.json({ ok: false, error: 'هذا الكوبون لم يبدأ بعد' }, { status: 400 });
    }
    if (coupon.ends_at && new Date(coupon.ends_at) < now) {
      return NextResponse.json({ ok: false, error: 'انتهت صلاحية هذا الكوبون' }, { status: 400 });
    }
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json({ ok: false, error: 'وصل هذا الكوبون إلى الحد الأقصى للاستخدام' }, { status: 400 });
    }
    if (coupon.min_order && subtotal < Number(coupon.min_order)) {
      return NextResponse.json(
        { ok: false, error: `الحد الأدنى لتطبيق هذا الكوبون هو ${coupon.min_order} ج.م` },
        { status: 400 }
      );
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
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || 'خطأ في معالجة الكوبون' }, { status: 500 });
  }
}
