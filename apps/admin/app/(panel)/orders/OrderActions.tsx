'use client';
import { supabaseBrowser } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { t, tOr } from '@/lib/i18n';

const FLOW = ['new','confirmed','packed','shipped','delivered'];

export default function OrderActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(next: string) {
    setBusy(true);
    await supabaseBrowser().from('orders').update({ status: next }).eq('id', id);
    setBusy(false);
    router.refresh();
  }

  const idx = FLOW.indexOf(status);
  return (
    <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
      {status !== 'cancelled' && status !== 'delivered' && FLOW.slice(idx + 1, idx + 2).map(next => (
        <button key={next} className="btn btn-primary btn-sm" disabled={busy} onClick={() => setStatus(next)}>
          {tOr(`orderAction.${next}`, next)} ←
        </button>
      ))}
      {(status === 'new' || status === 'confirmed') && (
        <button className="btn btn-ghost btn-sm" disabled={busy} onClick={() => setStatus('cancelled')}>{t('common.cancel')}</button>
      )}
    </div>
  );
}

