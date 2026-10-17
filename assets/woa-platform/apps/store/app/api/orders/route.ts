import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '../../../lib/supabase';

const ItemSchema = z.object({
  slug: z.string(), code: z.string(), name_ar: z.string(),
  qty: z.number().int().positive(), price: z.number().nonnegative(), sale: z.number().nullable()
});

const OrderSchema = z.object({
  customer_name: z.string().min(2).max(120),
  customer_phone: z.string().regex(/^01[0-9]{9}$/, 'رقم موبايل مصري غير صحيح'),
  governorate: z.string().min(2),
  city: z.string().optional(),
  address: z.string().min(5),
  notes: z.string().optional(),
  payment: z.enum(['cash_on_delivery','bank_transfer','vodafone_cash','instapay']).default('cash_on_delivery'),
  items: z.array(ItemSchema).min(1).max(50)
});

export async function POST(req: NextRequest) {
  try {
    const body = OrderSchema.parse(await req.json());

    // جلب الأسعار الحقيقية من DB — الثقة بالعميل ممنوعة
    const slugs = body.items.map(i => i.slug);
    const { data: prods } = await supabase.from('products')
      .select('id, slug, code, name_ar, price_egp, sale_price, stock, is_active')
      .in('slug', slugs).eq('is_active', true);
    if (!prods || prods.length !== slugs.length)
      return NextResponse.json({ ok: false, error: 'بعض المنتجات لم تعد متاحة' }, { status: 409 });

    for (const item of body.items) {
      const p = prods.find((x: any) => x.slug === item.slug)!;
      if (p.stock < item.qty)
        return NextResponse.json({ ok: false, error: `الكمية المطلوبة من ${p.name_ar} غير متاحة (المتبقي ${p.stock})` }, { status: 409 });
    }

    const { data: zone } = await supabase.from('shipping_zones')
      .select('fee_egp, cod_extra').eq('governorate', body.governorate).single();

    const subtotal = body.items.reduce((s: number, i) => s + ((prods.find((x: any) => x.slug === i.slug)!.sale_price
      ?? prods.find((x: any) => x.slug === i.slug)!.price_egp) * i.qty), 0);
    const shipping = zone?.fee_egp ?? 75;
    const codExtra = body.payment === 'cash_on_delivery' ? (zone?.cod_extra ?? 0) : 0;
    const total = subtotal + shipping + codExtra;

    const { data: order, error } = await supabase.from('orders').insert({
      order_no: undefined, // trigger يولّده
      customer_name: body.customer_name, customer_phone: body.customer_phone,
      governorate: body.governorate, city: body.city ?? null, address: body.address,
      notes: body.notes ?? null, payment: body.payment,
      subtotal_egp: subtotal, shipping_egp: shipping + codExtra, total_egp: total
    }).select().single();
    if (error) throw error;

    await supabase.from('order_items').insert(body.items.map(i => {
      const p = prods.find((x: any) => x.slug === i.slug)!;
      return { order_id: order.id, product_id: p.id, code: p.code, name_ar: p.name_ar,
               qty: i.qty, unit_price: p.sale_price ?? p.price_egp };
    }));

    // إشعار واتساب للإدارة (Webhook خارجي على Vercel env)
    const waText = `🛒 طلب جديد ${order.order_no}%0A${body.customer_name} — ${body.customer_phone}%0A${body.governorate}: ${body.address}%0Aالإجمالي: ${total} ج.م (${body.payment})`;
    fetch(`${process.env.WA_WEBHOOK_URL}?text=${waText}`).catch(() => {});

    return NextResponse.json({ ok: true, data: { order_no: order.order_no, total } });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.errors?.[0]?.message ?? 'بيانات غير صحيحة' }, { status: 400 });
  }
}
