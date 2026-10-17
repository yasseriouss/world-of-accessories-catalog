'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabase-client';
import { t } from '@/lib/i18n';

export interface ProductItem {
  id: string;
  code: string;
  name_ar: string;
  price_egp: number;
  sale_price?: number | null;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
}

interface QuickProductModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (updatedProduct: ProductItem) => void;
}

export default function QuickProductModal({
  product,
  isOpen,
  onClose,
  onSaved,
}: QuickProductModalProps) {
  const [nameAr, setNameAr] = useState('');
  const [code, setCode] = useState('');
  const [priceEgp, setPriceEgp] = useState<number | ''>('');
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync form state when a product is selected
  useEffect(() => {
    if (product) {
      setNameAr(product.name_ar || '');
      setCode(product.code || '');
      setPriceEgp(product.price_egp ?? '');
      setSalePrice(product.sale_price ?? '');
      setStock(product.stock ?? 0);
      setIsActive(Boolean(product.is_active));
      setIsFeatured(Boolean(product.is_featured));
      setErrorMsg('');
    }
  }, [product]);

  // Handle escape key to close modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  // Calculate discount percentage preview
  const numPrice = Number(priceEgp) || 0;
  const numSale = Number(salePrice) || 0;
  const hasDiscount = numSale > 0 && numSale < numPrice;
  const discountPercent = hasDiscount ? Math.round(((numPrice - numSale) / numPrice) * 100) : 0;
  const savingsEgp = hasDiscount ? numPrice - numSale : 0;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!product) return;

    if (!nameAr.trim()) {
      setErrorMsg(t('quickEdit.errors.name'));
      return;
    }
    if (!code.trim()) {
      setErrorMsg(t('quickEdit.errors.code'));
      return;
    }
    if (numPrice <= 0) {
      setErrorMsg(t('quickEdit.errors.price'));
      return;
    }
    if (numSale > 0 && numSale >= numPrice) {
      setErrorMsg(t('quickEdit.errors.sale'));
      return;
    }
    if (stock < 0) {
      setErrorMsg(t('quickEdit.errors.stock'));
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const payload = {
        name_ar: nameAr.trim(),
        code: code.trim(),
        price_egp: numPrice,
        sale_price: numSale > 0 ? numSale : null,
        stock: Number(stock),
        is_active: isActive,
        is_featured: isFeatured,
      };

      const { error } = await supabaseBrowser()
        .from('products')
        .update(payload)
        .eq('id', product.id);

      if (error) {
        throw new Error(error.message);
      }

      const updated: ProductItem = {
        ...product,
        ...payload,
      };

      onSaved(updated);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || t('quickEdit.errors.save'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-dialog">
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2 id="modal-title" style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
              {t('quickEdit.title')} <span style={{ color: 'var(--color-accent-text)' }}>{product.name_ar}</span>
            </h2>
            <div style={{ fontSize: '.78rem', color: 'var(--color-text-3)', marginTop: 2 }}>
              {t('quickEdit.codeLabel', { code: product.code })}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            aria-label={t('quickEdit.close')}
            style={{ width: '44px', height: '44px', padding: 0, fontSize: '1.2rem' }}
          >
            ✕
          </button>
        </div>

        {/* Modal Form Body */}
        <form id="quick-edit-form" onSubmit={handleSave}>
          <div className="modal-body">
            {errorMsg && (
              <div
                role="alert"
                style={{
                  background: 'var(--color-danger-soft)',
                  border: '1px solid var(--color-danger)',
                  color: 'var(--color-danger)',
                  padding: '10px 14px',
                  borderRadius: 'var(--r-md)',
                  fontSize: '.88rem',
                  fontWeight: 600,
                }}
              >
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Product Name & SKU */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
              <div>
                <label htmlFor="quick-name" className="lbl">{t('quickEdit.name')}</label>
                <input
                  id="quick-name"
                  type="text"
                  required
                  className="input"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="quick-code" className="lbl">{t('quickEdit.code')}</label>
                <input
                  id="quick-code"
                  type="text"
                  required
                  dir="ltr"
                  className="input"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>

            {/* Pricing Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label htmlFor="quick-price" className="lbl">{t('quickEdit.price')}</label>
                <input
                  id="quick-price"
                  type="number"
                  step="0.5"
                  min="0"
                  required
                  className="input"
                  value={priceEgp}
                  onChange={(e) => setPriceEgp(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>

              <div>
                <label htmlFor="quick-sale" className="lbl">{t('productNew.salePrice')}</label>
                <input
                  id="quick-sale"
                  type="number"
                  step="0.5"
                  min="0"
                  placeholder={t('common.optional')}
                  className="input"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
            </div>

            {/* Discount Preview Badge */}
            {hasDiscount && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: 'var(--color-accent-soft)',
                  borderRadius: 'var(--r-md)',
                  fontSize: '.85rem',
                  color: 'var(--color-accent-text)',
                  fontWeight: 600,
                }}
              >
                <span>{t('quickEdit.discountPct', { pct: discountPercent })}</span>
                <span>•</span>
                <span>{t('quickEdit.savings', { amount: savingsEgp.toFixed(1) })}</span>
              </div>
            )}

            {/* Stock / Inventory */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label htmlFor="quick-stock" className="lbl" style={{ margin: 0 }}>{t('quickEdit.stock')}</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setStock(0)}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '2px 8px', fontSize: '.75rem', minHeight: 'auto', minWidth: 'auto' }}
                  >
                    {t('quickEdit.zero')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStock((s) => s + 5)}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '2px 8px', fontSize: '.75rem', minHeight: 'auto', minWidth: 'auto' }}
                  >
                    +5
                  </button>
                  <button
                    type="button"
                    onClick={() => setStock((s) => s + 20)}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '2px 8px', fontSize: '.75rem', minHeight: 'auto', minWidth: 'auto' }}
                  >
                    +20
                  </button>
                </div>
              </div>
              <input
                id="quick-stock"
                type="number"
                min="0"
                required
                className="input"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
              <div style={{ marginTop: '6px' }}>
                {stock <= 0 ? (
                  <span className="chip chip-out">{t('quickEdit.stockOut')}</span>
                ) : stock <= 5 ? (
                  <span className="chip chip-sale">{t('quickEdit.stockLow', { count: stock })}</span>
                ) : (
                  <span className="chip chip-stock">{t('quickEdit.stockOk', { count: stock })}</span>
                )}
              </div>
            </div>

            {/* Status & Featured Toggles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', paddingTop: '8px', borderTop: '1px solid var(--color-line)' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  padding: '10px 14px',
                  border: '1px solid var(--color-line)',
                  borderRadius: 'var(--r-md)',
                  background: isActive ? 'var(--color-success-soft)' : 'transparent',
                }}
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-accent)' }}
                />
                <span style={{ fontSize: '.9rem', fontWeight: 600 }}>
                  {isActive ? t('quickEdit.active') : t('quickEdit.paused')}
                </span>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  padding: '10px 14px',
                  border: '1px solid var(--color-line)',
                  borderRadius: 'var(--r-md)',
                  background: isFeatured ? 'var(--color-accent-soft)' : 'transparent',
                }}
              >
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-accent)' }}
                />
                <span style={{ fontSize: '.9rem', fontWeight: 600 }}>
                  {t('quickEdit.featured')}
                </span>
              </label>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="btn btn-outline btn-sm"
              style={{ minHeight: '44px' }}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary btn-sm"
              style={{ minHeight: '44px', minWidth: '120px' }}
            >
              {saving ? t('common.saving') : t('quickEdit.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
