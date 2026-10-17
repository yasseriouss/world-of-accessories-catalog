'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { t } from '@/lib/i18n';

export function ReviewStatusToggle({ id, isApproved }: { id: string; isApproved: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    await supabaseBrowser().from('reviews').update({ is_approved: !isApproved }).eq('id', id);
    setBusy(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={toggle}
      className={`chip ${isApproved ? 'chip-stock' : 'chip-out'}`}
      style={{ cursor: 'pointer', border: 'none', fontSize: '0.8rem' }}
      title={isApproved ? t('reviews.clickToHide') : t('reviews.clickToApprove')}
    >
      {isApproved ? t('reviews.approvedBadge') : t('reviews.hiddenBadge')}
    </button>
  );
}

export function ReviewDeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!confirm(t('reviews.confirmDelete'))) return;
    setBusy(true);
    await supabaseBrowser().from('reviews').delete().eq('id', id);
    setBusy(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={remove}
      className="btn btn-ghost btn-sm"
      style={{ color: 'var(--color-danger)', padding: '4px 8px', fontSize: '0.8rem' }}
      title={t('reviews.delete')}
    >
      🗑️
    </button>
  );
}

