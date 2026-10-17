'use client';
import { supabaseBrowser } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { t } from '@/lib/i18n';

const STATUS_LABELS: Record<string, string> = {
  new: t('b2bStatus.new'),
  contacted: t('b2bStatus.contacted'),
  quoted: t('b2bStatus.quoted'),
  won: t('b2bStatus.won'),
  lost: t('b2bStatus.lost'),
};

export default function B2BActions({ id, status, phone }: { id: string; status: string; phone?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function updateStatus(next: string) {
    setBusy(true);
    await supabaseBrowser().from('b2b_quotes').update({ status: next }).eq('id', id);
    setBusy(false);
    router.refresh();
  }

  // Format clean Egyptian phone number for WhatsApp
  const cleanPhone = phone?.replace(/\D/g, '').replace(/^0/, '20');

  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
      {cleanPhone && (
        <a
          href={`https://wa.me/${cleanPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm"
          style={{
            background: 'var(--color-success)',
            color: 'var(--color-on-status)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '.78rem',
            padding: '4px 8px',
          }}
          title={t('b2b.whatsappChat')}
        >
          {t('b2b.whatsapp')}
        </a>
      )}

      <select
        value={status}
        disabled={busy}
        onChange={(e) => updateStatus(e.target.value)}
        className="input"
        style={{
          fontSize: '.8rem',
          padding: '4px 8px',
          height: 'auto',
          width: '130px',
          background: 'var(--color-bg-elev)',
        }}
      >
        {Object.entries(STATUS_LABELS).map(([val, label]) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

