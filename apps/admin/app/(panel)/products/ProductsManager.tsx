'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { egp } from '@/lib/format';
import { supabaseBrowser } from '@/lib/supabase-client';
import QuickProductModal, { ProductItem } from '@/components/QuickProductModal';

interface ProductsManagerProps {
  initialProducts: ProductItem[];
  initialQuery?: string;
}

export default function ProductsManager({
  initialProducts,
  initialQuery = '',
}: ProductsManagerProps) {
  const router = useRouter();
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'out_of_stock' | 'featured' | 'paused'>('all');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name_ar?.toLowerCase().includes(q) ||
          p.code?.toLowerCase().includes(q)
      );
    }

    // Tab filter
    if (activeTab === 'active') {
      list = list.filter((p) => p.is_active && p.stock > 0);
    } else if (activeTab === 'out_of_stock') {
      list = list.filter((p) => p.stock <= 0);
    } else if (activeTab === 'featured') {
      list = list.filter((p) => p.is_featured);
    } else if (activeTab === 'paused') {
      list = list.filter((p) => !p.is_active);
    }

    return list;
  }, [products, searchQuery, activeTab]);

  // Counts for tabs
  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.is_active && p.stock > 0).length;
    const outOfStock = products.filter((p) => p.stock <= 0).length;
    const featured = products.filter((p) => p.is_featured).length;
    const paused = products.filter((p) => !p.is_active).length;
    return { total, active, outOfStock, featured, paused };
  }, [products]);

  // Trigger modal for a product
  function openEditModal(prod: ProductItem) {
    setSelectedProduct(prod);
    setModalOpen(true);
  }

  // Handle successful save from modal
  function handleSavedProduct(updated: ProductItem) {
    setProducts((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    setToastMessage(`✓ تم تحديث بيانات "${updated.name_ar}" بنجاح`);
    setTimeout(() => setToastMessage(null), 4000);
    router.refresh();
  }

  // Quick toggle active status directly from row
  async function handleToggleActive(prod: ProductItem) {
    setTogglingId(prod.id);
    const newActive = !prod.is_active;

    try {
      const { error } = await supabaseBrowser()
        .from('products')
        .update({ is_active: newActive })
        .eq('id', prod.id);

      if (!error) {
        setProducts((prev) =>
          prev.map((item) =>
            item.id === prod.id ? { ...item, is_active: newActive } : item
          )
        );
        setToastMessage(newActive ? '✓ تم تفعيل المنتج في المتجر' : 'تم إيقاف ظهور المنتج');
        setTimeout(() => setToastMessage(null), 3500);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {/* Toast notification banner */}
      {toastMessage && (
        <div
          role="status"
          style={{
            position: 'fixed',
            top: '24px',
            insetInlineEnd: '24px',
            zIndex: 9999,
            background: 'var(--brand-ink)',
            color: 'var(--brand-gold-soft)',
            border: '1.5px solid var(--color-accent)',
            padding: '12px 20px',
            borderRadius: 'var(--r-md)',
            boxShadow: 'var(--sh-3)',
            fontWeight: 700,
            fontSize: '.92rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'fadeIn .2s ease',
          }}
        >
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-3)',
              cursor: 'pointer',
              fontSize: '1.1rem',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            إدارة المنتجات ({stats.total})
          </h1>
          <p style={{ color: 'var(--color-text-3)', fontSize: '.88rem', marginTop: '2px' }}>
            تعديل فوري للأسعار، الخصومات، المخزون، وحالة العرض في المتجر
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="input"
              placeholder="بحث بالاسم أو الكود..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '240px', paddingInlineStart: '34px', minHeight: '44px' }}
            />
            <span
              style={{
                position: 'absolute',
                insetInlineStart: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-3)',
                pointerEvents: 'none',
              }}
            >
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="btn btn-ghost btn-sm"
                style={{
                  position: 'absolute',
                  insetInlineEnd: '4px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '2px 8px',
                  minHeight: 'auto',
                  minWidth: 'auto',
                }}
              >
                ✕
              </button>
            )}
          </div>

          <Link href="/products/new" className="btn btn-primary" style={{ minHeight: '44px' }}>
            + إضافة منتج جديد
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
          borderBottom: '1px solid var(--color-line)',
        }}
      >
        <button
          onClick={() => setActiveTab('all')}
          className={`btn ${activeTab === 'all' ? 'btn-dark' : 'btn-ghost'} btn-sm`}
          style={{ minHeight: '40px' }}
        >
          الكل ({stats.total})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`btn ${activeTab === 'active' ? 'btn-dark' : 'btn-ghost'} btn-sm`}
          style={{ minHeight: '40px' }}
        >
          متوفر ونشط ({stats.active})
        </button>
        <button
          onClick={() => setActiveTab('out_of_stock')}
          className={`btn ${activeTab === 'out_of_stock' ? 'btn-dark' : 'btn-ghost'} btn-sm`}
          style={{ minHeight: '40px', color: activeTab === 'out_of_stock' ? undefined : 'var(--color-danger)' }}
        >
          نفد المخزون ({stats.outOfStock})
        </button>
        <button
          onClick={() => setActiveTab('featured')}
          className={`btn ${activeTab === 'featured' ? 'btn-dark' : 'btn-ghost'} btn-sm`}
          style={{ minHeight: '40px' }}
        >
          مميز ⭐ ({stats.featured})
        </button>
        <button
          onClick={() => setActiveTab('paused')}
          className={`btn ${activeTab === 'paused' ? 'btn-dark' : 'btn-ghost'} btn-sm`}
          style={{ minHeight: '40px' }}
        >
          موقوف ({stats.paused})
        </button>
      </div>

      {/* Products Table */}
      <div className="table-responsive">
        <table className="admin">
          <thead>
            <tr>
              <th style={{ width: '120px' }}>الكود</th>
              <th>الاسم والمواصفات</th>
              <th>السعر الرسمي</th>
              <th>سعر الخصم</th>
              <th>المخزون</th>
              <th style={{ textAlign: 'center' }}>مميز</th>
              <th style={{ textAlign: 'center' }}>حالة العرض</th>
              <th style={{ textAlign: 'center', width: '130px' }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-3)' }}>
                  لا توجد منتجات مطابقة لخيارات البحث
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id}>
                  {/* Code */}
                  <td style={{ fontWeight: 700, letterSpacing: '.04em' }}>
                    <span
                      style={{
                        padding: '4px 8px',
                        background: 'rgba(20, 19, 17, 0.05)',
                        borderRadius: 'var(--r-sm)',
                        fontFamily: 'monospace',
                        fontSize: '.85rem',
                      }}
                    >
                      {p.code}
                    </span>
                  </td>

                  {/* Name */}
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.name_ar}</div>
                  </td>

                  {/* Price */}
                  <td className="price" style={{ fontWeight: 700 }}>
                    {egp(p.price_egp, 'ar')}
                  </td>

                  {/* Sale Price */}
                  <td>
                    {p.sale_price ? (
                      <span className="chip chip-sale" style={{ fontWeight: 700 }}>
                        {egp(p.sale_price, 'ar')}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-text-3)' }}>—</span>
                    )}
                  </td>

                  {/* Stock */}
                  <td>
                    {p.stock <= 0 ? (
                      <span className="chip chip-out">نفد</span>
                    ) : p.stock <= 5 ? (
                      <span className="chip chip-sale">{p.stock} (منخفض)</span>
                    ) : (
                      <span className="chip chip-stock">{p.stock} قطعة</span>
                    )}
                  </td>

                  {/* Featured */}
                  <td style={{ textAlign: 'center' }}>
                    {p.is_featured ? (
                      <span title="منتج مميز في الرئيسية" style={{ fontSize: '1.1rem' }}>⭐</span>
                    ) : (
                      <span style={{ color: 'var(--color-text-3)' }}>—</span>
                    )}
                  </td>

                  {/* Active Toggle */}
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      disabled={togglingId === p.id}
                      onClick={() => handleToggleActive(p)}
                      title={p.is_active ? 'انقر لإيقاف المنتج' : 'انقر لتفعيل المنتج'}
                      className={`chip ${p.is_active ? 'chip-stock' : ''}`}
                      style={{
                        cursor: 'pointer',
                        border: 'none',
                        outline: 'none',
                        background: p.is_active ? 'rgba(46,125,91,.14)' : 'rgba(138,143,152,.15)',
                        color: p.is_active ? 'var(--color-success)' : 'var(--color-text-3)',
                      }}
                    >
                      {togglingId === p.id ? '...' : p.is_active ? '✓ نشط' : '✕ موقوف'}
                    </button>
                  </td>

                  {/* Quick Edit Action Button */}
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => openEditModal(p)}
                      className="btn btn-outline btn-sm"
                      style={{
                        minHeight: '38px',
                        padding: '6px 12px',
                        fontSize: '.85rem',
                        borderColor: 'var(--color-accent)',
                        color: 'var(--color-text)',
                      }}
                    >
                      ✏️ تعديل سريع
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* The Quick Product Edit Modal */}
      <QuickProductModal
        product={selectedProduct}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSavedProduct}
      />
    </div>
  );
}
