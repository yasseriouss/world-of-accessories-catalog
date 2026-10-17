import { NextResponse } from 'next/server';

/**
 * Stable error codes returned by the store API. Routes never send user-facing text;
 * the client renders `t('errors.<code>', params)` from messages/*.json.
 */
export type ApiErrorCode =
  | 'coupon_required'
  | 'coupon_invalid'
  | 'coupon_not_started'
  | 'coupon_expired'
  | 'coupon_exhausted'
  | 'coupon_min_order'
  | 'coupon_failed'
  | 'products_unavailable'
  | 'stock_insufficient'
  | 'invalid_phone'
  | 'invalid_order'
  | 'order_lookup_required'
  | 'order_not_found'
  | 'review_invalid_product'
  | 'review_invalid_name'
  | 'review_invalid_rating'
  | 'review_product_not_found'
  | 'review_save_failed'
  | 'generic';

export type ApiErrorParams = Record<string, string | number>;

/** JSON error response: `{ ok: false, error: code, params? }`. */
export function apiError(code: ApiErrorCode, status: number, params?: ApiErrorParams) {
  return NextResponse.json({ ok: false, error: code, ...(params ? { params } : {}) }, { status });
}

type Translate = ((key: string, values?: ApiErrorParams) => string) & { has: (key: string) => boolean };

/**
 * Client side: turn an API error payload into localized text.
 * `t` must be scoped to the `errors` namespace; unknown codes fall back to `fallback`.
 */
export function apiErrorText(t: Translate, payload: { error?: unknown; params?: ApiErrorParams } | null | undefined, fallback: ApiErrorCode = 'generic') {
  const code = typeof payload?.error === 'string' && t.has(payload.error) ? payload.error : fallback;
  return t(code, payload?.params);
}
