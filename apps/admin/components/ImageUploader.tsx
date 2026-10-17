'use client';
import { useState, useRef } from 'react';
import { supabaseBrowser } from '../lib/supabase-client';
import { t } from '@/lib/i18n';

export type UploadedImage = {
  url: string;
  alt_ar?: string;
  alt_en?: string;
};

interface ImageUploaderProps {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  bucket?: string;
  folder?: string;
  maxFiles?: number;
}

export default function ImageUploader({
  value = [],
  onChange,
  bucket = 'products',
  folder = 'catalog',
  maxFiles = 6,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (value.length + files.length > maxFiles) {
      setError(t('uploader.maxFiles', { count: maxFiles }));
      return;
    }

    setUploading(true);
    setError(null);

    const newImages: UploadedImage[] = [...value];
    const supabase = supabaseBrowser();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Generate clean safe filename with timestamp
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanBase = file.name
        .substring(0, file.name.lastIndexOf('.'))
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'product';
      const filePath = `${folder}/${Date.now()}-${cleanBase}.${ext}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: '31536000',
            upsert: false,
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        newImages.push({
          url: publicUrlData.publicUrl,
          alt_ar: '',
          alt_en: '',
        });
      } catch (err: any) {
        console.error('Upload failed:', err);
        setError(t('uploader.failed', { file: file.name, message: err.message || t('uploader.unknownError') }));
      }
    }

    onChange(newImages);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removeImage(index: number) {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  }

  function updateAltText(index: number, alt_ar: string) {
    const updated = value.map((img, i) =>
      i === index ? { ...img, alt_ar } : img
    );
    onChange(updated);
  }

  return (
    <div style={{ display: 'grid', gap: '12px' }}>
      <label className="lbl">{t('uploader.label')}</label>
      
      {/* Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '2px dashed var(--color-line)',
          borderRadius: 'var(--r-lg)',
          padding: '28px 16px',
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          background: 'var(--color-bg)',
          transition: 'border-color var(--t-fast), background var(--t-fast)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--brand-gold)';
          e.currentTarget.style.background = 'var(--color-accent-soft)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-line)';
          e.currentTarget.style.background = 'var(--color-bg)';
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          multiple
          disabled={uploading}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
          {uploading ? '⏳' : '📸'}
        </div>
        <div style={{ fontWeight: 600, fontSize: '.95rem' }}>
          {uploading ? t('uploader.uploading') : t('uploader.prompt')}
        </div>
        <div style={{ fontSize: '.78rem', color: 'var(--color-text-3)', marginTop: '4px' }}>
          {t('uploader.formats', { bucket })}
        </div>
      </div>

      {error && (
        <div style={{ color: 'var(--color-danger)', fontSize: '.85rem', fontWeight: 500 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Thumbnails list */}
      {value.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '12px',
            marginTop: '8px',
          }}
        >
          {value.map((img, idx) => (
            <div
              key={img.url + idx}
              style={{
                border: '1px solid var(--color-line)',
                borderRadius: 'var(--r-md)',
                overflow: 'hidden',
                background: 'var(--color-bg-elev)',
                position: 'relative',
              }}
            >
              <div style={{ aspectRatio: '1', position: 'relative', background: 'var(--color-surface-2)' }}>
                <img
                  src={img.url}
                  alt={img.alt_ar || t('uploader.imageAlt', { n: idx + 1 })}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(idx);
                  }}
                  title={t('uploader.remove')}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    background: 'var(--color-scrim)',
                    color: 'var(--color-on-scrim)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    lineHeight: 1,
                  }}
                >
                  ✕
                </button>
                {idx === 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      right: '4px',
                      background: 'var(--brand-gold)',
                      color: 'var(--color-on-scrim)',
                      fontSize: '.68rem',
                      padding: '2px 6px',
                      borderRadius: 'var(--r-sm)',
                      fontWeight: 600,
                    }}
                  >
                    {t('uploader.primary')}
                  </span>
                )}
              </div>
              <div style={{ padding: '6px' }}>
                <input
                  type="text"
                  placeholder={t('uploader.altPlaceholder')}
                  value={img.alt_ar || ''}
                  onChange={(e) => updateAltText(idx, e.target.value)}
                  style={{
                    width: '100%',
                    fontSize: '.75rem',
                    border: '1px solid var(--color-line)',
                    borderRadius: 'var(--r-sm)',
                    padding: '4px 6px',
                    background: 'var(--color-bg)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
