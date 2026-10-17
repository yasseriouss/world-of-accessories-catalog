'use client';
import { supabaseBrowser } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const STATUS_LABELS: Record<string, string> = {
  new: 'جديد',
  contacted: 'تم التواصل',
  quoted: 'أُرسل عرض سعر',
  won: 'تم التعاقد',
  lost: 'ملغي / مفقود',
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
            background: '#25D366',
            color: '#fff',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '.78rem',
            padding: '4px 8px',
          }}
          title="محادثة واتساب مباشرة"
        >
          💬 واتساب
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

