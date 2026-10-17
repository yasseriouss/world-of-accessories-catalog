import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { apiError } from '@/lib/api-errors';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { product_id, author_name, author_phone, rating, comment } = body;

    if (!product_id || typeof product_id !== 'string') {
      return apiError('review_invalid_product', 400);
    }

    if (!author_name || typeof author_name !== 'string' || author_name.trim().length < 2) {
      return apiError('review_invalid_name', 400);
    }

    const numRating = Number(rating);
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      return apiError('review_invalid_rating', 400);
    }

    // Verify product exists
    const { data: product, error: prodErr } = await supabase
      .from('products')
      .select('id, name_ar')
      .eq('id', product_id)
      .single();

    if (prodErr || !product) {
      return apiError('review_product_not_found', 404);
    }

    const cleanComment = typeof comment === 'string' ? comment.trim().slice(0, 1000) : null;
    const cleanPhone = typeof author_phone === 'string' ? author_phone.trim().slice(0, 20) : null;

    const { data: newReview, error: insertErr } = await supabase
      .from('reviews')
      .insert({
        product_id,
        author_name: author_name.trim().slice(0, 100),
        author_phone: cleanPhone,
        rating: numRating,
        comment: cleanComment,
        is_approved: true,
      })
      .select()
      .single();

    if (insertErr) {
      console.error('Review insert error:', insertErr);
      return apiError('review_save_failed', 500);
    }

    return NextResponse.json({
      ok: true,
      success: true,
      review: newReview,
    });
  } catch (err: any) {
    console.error('Reviews API error:', err);
    return apiError('generic', 500);
  }
}
