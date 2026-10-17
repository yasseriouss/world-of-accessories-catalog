'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { t } from '@/lib/i18n';

export function CouponToggle({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    await supabaseBrowser().from('coupons').update({ is_active: !isActive }).eq('id', id);
    setBusy(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={toggle}
      className={`chip ${isActive ? 'chip-stock' : 'chip-out'}`}
      style={{ cursor: 'pointer', border: 'none' }}
    >
      {isActive ? t('coupons.active') : t('coupons.inactive')}
    </button>
  );
}

export function NewCouponForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const code = (fd.get('code') as string).trim().toUpperCase();
    const type = fd.get('type') as string;
    const value = +fd.get('value')!;
    const minOrder = fd.get('min_order') ? +fd.get('min_order')! : 0;
    const maxUses = fd.get('max_uses') ? +fd.get('max_uses')! : null;

    const { error: insertError } = await supabaseBrowser().from('coupons').insert({
      code,
      type,
      value,
      min_order: minOrder,
      max_uses: maxUses,
      used_count: 0,
      is_active: true,
    });

    setLoading(false);
    if (!insertError) {
      setOpen(false);
      router.refresh();
    } else {
      setError(insertError.message);
    }
  }

  return (
    <div>
      <button onClick={() => setOpen(!open)} className="btn btn-primary btn-sm">
        {open ? t('common.cancel') : t('coupons.add')}
      </button>

      {open && (
        <form
          onSubmit={submit}
          className="card"
          style={{
            marginTop: '16px',
            padding: '24px',
            display: 'grid',
            gap: '16px',
            maxWidth: '640px',
            background: 'var(--color-bg-elev)',
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{t('coupons.formTitle')}</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="lbl">{t('coupons.codeRequired')}</label>
              <input
                name="code"
                required
                placeholder={t('coupons.codePlaceholder')}
                dir="ltr"
                className="input"
                style={{ textTransform: 'uppercase' }}
              />
            </div>
            <div>
              <label className="lbl">{t('coupons.typeRequired')}</label>
              <select name="type" required className="input">
                <option value="percent">{t('coupons.types.percentLong')}</option>
                <option value="fixed">{t('coupons.types.fixedLong')}</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div>
              <label className="lbl">{t('coupons.value')}</label>
              <input name="value" type="number" step="0.5" min="0.5" required placeholder="10" className="input" />
            </div>
            <div>
              <label className="lbl">{t('coupons.minOrderEgp')}</label>
              <input name="min_order" type="number" step="1" min="0" defaultValue={0} className="input" />
            </div>
            <div>
              <label className="lbl">{t('coupons.maxUses')}</label>
              <input name="max_uses" type="number" step="1" min="1" placeholder={t('coupons.maxUsesPlaceholder')} className="input" />
            </div>
          </div>

          {error && <div style={{ color: 'var(--color-danger)', fontSize: '.85rem' }}>⚠️ {error}</div>}

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost btn-sm">
              {t('common.close')}
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              {loading ? t('common.saving') : t('coupons.save')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

