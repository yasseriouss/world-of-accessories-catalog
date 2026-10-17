'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

export interface ReviewItem {
  id: string;
  author_name: string;
  rating: number;
  comment?: string | null;
  created_at: string;
}

export default function ProductReviews({
  productId,
  productName,
  initialReviews,
  initialAvg,
  initialCount,
}: {
  productId: string;
  productName: string;
  initialReviews: ReviewItem[];
  initialAvg: number;
  initialCount: number;
}) {
  const locale = useLocale();
  const ar = locale === 'ar';
  const t = useTranslations('reviews');

  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [ratingAvg, setRatingAvg] = useState<number>(initialAvg);
  const [ratingCount, setRatingCount] = useState<number>(initialCount);

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorPhone, setAuthorPhone] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!authorName.trim() || authorName.trim().length < 2) {
      setStatusMsg({ type: 'error', text: t('errorName') });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          author_name: authorName,
          author_phone: authorPhone,
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setStatusMsg({ type: 'error', text: data.error || t('errorGeneric') });
      } else {
        setStatusMsg({ type: 'success', text: t('success') });
        if (data.review) {
          const newRev = data.review;
          const updated = [newRev, ...reviews];
          setReviews(updated);
          const newTotal = ratingCount + 1;
          const sum = reviews.reduce((acc, r) => acc + r.rating, 0) + newRev.rating;
          setRatingAvg(Number((sum / newTotal).toFixed(1)));
          setRatingCount(newTotal);
        }
        // Reset form
        setAuthorName('');
        setAuthorPhone('');
        setComment('');
        setRating(5);
        setTimeout(() => setFormOpen(false), 2000);
      }
    } catch {
      setStatusMsg({ type: 'error', text: t('errorGeneric') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={{ marginTop: '56px', borderTop: '1px solid var(--color-line)', paddingTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 className="sec-title" style={{ margin: 0 }}>
            {t('title')}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-gold)' }}>★ {ratingAvg > 0 ? ratingAvg : '5.0'}</span>
            <span style={{ color: 'var(--color-text-2)', fontSize: '0.9rem' }}>
              {t('ratingCount', { count: ratingCount })}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-outline"
          onClick={() => setFormOpen(!formOpen)}
          style={{ borderColor: 'var(--brand-gold)', color: 'var(--brand-gold)', minHeight: '44px' }}
        >
          {formOpen ? t('cancel') : t('writeReview')}
        </button>
      </div>

      {/* Review Submission Form */}
      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="card"
          style={{
            padding: '24px',
            marginBottom: '32px',
            background: 'var(--color-bg)',
            border: '1px solid var(--brand-gold)',
            borderRadius: 'var(--r-md)',
            display: 'grid',
            gap: '16px',
            maxWidth: '650px',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text)' }}>
            {ar ? `تقييمك لمنتج: ${productName}` : `Review: ${productName}`}
          </div>

          {/* Star selector */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text-2)' }}>
              {t('yourRating')}
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.8rem',
                    color: star <= rating ? 'var(--brand-gold)' : 'var(--color-line)',
                    padding: 0,
                    lineHeight: 1,
                  }}
                  aria-label={`${star} ${ar ? 'نجوم' : 'stars'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Name & Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-text-2)' }}>
                {t('namePlaceholder')} *
              </label>
              <input
                type="text"
                required
                className="input"
                placeholder={t('namePlaceholder')}
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-text-2)' }}>
                {t('phonePlaceholder')}
              </label>
              <input
                type="tel"
                className="input"
                placeholder="01xxxxxxxxx"
                value={authorPhone}
                onChange={(e) => setAuthorPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Comment */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-text-2)' }}>
              {t('yourReview')}
            </label>
            <textarea
              rows={3}
              className="input"
              style={{ width: '100%', resize: 'vertical' }}
              placeholder={t('placeholder')}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {statusMsg && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--r-md)',
                fontSize: '0.88rem',
                fontWeight: 600,
                background: statusMsg.type === 'success' ? 'rgba(46, 125, 91, 0.12)' : 'rgba(192, 57, 43, 0.1)',
                color: statusMsg.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)',
                border: `1px solid ${statusMsg.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)'}`,
              }}
            >
              {statusMsg.text}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setFormOpen(false)}
              style={{ minHeight: '44px' }}
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={submitting}
              style={{ minHeight: '44px', minWidth: '120px' }}
            >
              {submitting ? t('submitting') : t('submit')}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div
          style={{
            padding: '32px',
            textAlign: 'center',
            background: 'var(--color-bg-elev)',
            border: '1px dashed var(--color-line)',
            borderRadius: 'var(--r-md)',
            color: 'var(--color-text-2)',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💬</div>
          <div style={{ fontWeight: 600 }}>
            {ar ? 'لا توجد تقييمات بعد على هذا المنتج.' : 'No reviews yet for this product.'}
          </div>
          <div style={{ fontSize: '0.85rem', marginTop: '4px', color: 'var(--color-text-3)' }}>
            {ar ? 'كن أول من يشارك تجربته مع عملاء عالم الاكسسوار!' : 'Be the first to share your experience!'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="card"
              style={{
                padding: '18px 20px',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--color-line)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'var(--brand-gold)',
                      color: 'var(--color-on-primary, #111111)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                    }}
                  >
                    {rev.author_name ? rev.author_name.charAt(0).toUpperCase() : 'ع'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)' }}>
                      {rev.author_name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-3)' }}>
                      {new Date(rev.created_at).toLocaleDateString(ar ? 'ar-EG' : 'en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>

                <div style={{ color: 'var(--brand-gold)', fontSize: '1rem', letterSpacing: '2px' }}>
                  {'★'.repeat(rev.rating)}
                  {'☆'.repeat(Math.max(0, 5 - rev.rating))}
                </div>
              </div>

              {rev.comment && (
                <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--color-text-2)', lineHeight: 1.7 }}>
                  {rev.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
