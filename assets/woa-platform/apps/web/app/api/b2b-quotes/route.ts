import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '../../../lib/supabase';

const Schema = z.object({
  company: z.string().min(2), contact: z.string().min(2),
  phone: z.string().regex(/^01[0-9]{9}$/),
  email: z.string().email().optional().or(z.literal('')),
  qty_estimate: z.string().optional(), details: z.string().min(10)
});

export async function POST(req: NextRequest) {
  try {
    const body = Schema.parse(await req.json());
    const { error } = await supabase.from('b2b_quotes').insert({
      ...body, email: body.email || null, status: 'new'
    });
    if (error) throw error;
    fetch(`${process.env.WA_WEBHOOK_URL}?text=${encodeURIComponent(`📋 طلب B2B: ${body.company} — ${body.contact} — ${body.phone}`)}`).catch(() => {});
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.errors?.[0]?.message ?? 'خطأ' }, { status: 400 });
  }
}
