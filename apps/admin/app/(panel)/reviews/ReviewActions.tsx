'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';

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
      title={isApproved ? 'انقر لإخفاء المراجعة' : 'انقر لاعتماد المراجعة'}
    >
      {isApproved ? '✓ معتمد' : '✕ محجوب'}
    </button>
  );
}

export function ReviewDeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!confirm('هل أنت متأكد من حذف هذه المراجعة نهائياً؟')) return;
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
      style={{ color: '#B91C1C', padding: '4px 8px', fontSize: '0.8rem' }}
      title="حذف المراجعة"
    >
      🗑️
    </button>
  );
}

