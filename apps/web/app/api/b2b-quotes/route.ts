import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createTranslator } from 'next-intl';
import { supabase } from '@/lib/supabase';
import arMessages from '@/messages/ar.json';

// Staff notifications are always sent in Arabic.
const tNotify = createTranslator({ locale: 'ar', messages: arMessages, namespace: 'staffNotify' });

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
    if (process.env.WA_WEBHOOK_URL) {
      const text = tNotify('b2bQuote', { company: body.company, contact: body.contact, phone: body.phone });
      fetch(`${process.env.WA_WEBHOOK_URL}?text=${encodeURIComponent(text)}`).catch(() => {});
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    // Stable error codes only; the client renders the localized message.
    if (e instanceof z.ZodError) return NextResponse.json({ ok: false, error: 'invalid_quote' }, { status: 400 });
    console.error('B2B quote error:', e);
    return NextResponse.json({ ok: false, error: 'generic' }, { status: 500 });
  }
}
