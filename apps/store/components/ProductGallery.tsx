'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface ProductImage {
  url: string;
  alt_ar?: string;
  alt_en?: string;
  sort?: number;
}

export default function ProductGallery({
  images,
  name,
}: {
  images?: ProductImage[];
  name: string;
}) {
  const tg = useTranslations('gallery');
  const validImages = images && images.length > 0 ? images : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const currentImage = validImages[activeIndex] || {
    url: '/placeholder.webp',
    alt_ar: name,
  };

  return (
    <div style={{ display: 'grid', gap: '14px' }}>
      {/* Main Image */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '1/1',
          borderRadius: 'var(--r-md)',
          overflow: 'hidden',
          background: 'var(--color-bg-elev)',
          border: '1px solid var(--color-line)',
          cursor: validImages.length > 0 ? 'zoom-in' : 'default',
        }}
        onClick={() => {
          if (validImages.length > 0) setZoomOpen(true);
        }}
      >
        <Image
          src={currentImage.url}
          alt={currentImage.alt_ar ?? name}
          fill
          priority
          sizes="(max-width:768px) 100vw, 50vw"
          style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
        />

        {/* Zoom badge icon */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            background: 'var(--color-bg-elev)',
            backdropFilter: 'blur(4px)',
            borderRadius: 'var(--r-sm)',
            border: '1px solid var(--color-line)',
            padding: '6px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            color: 'var(--color-text)',
            pointerEvents: 'none',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          <span>{tg('zoom')}</span>
        </div>
      </div>

      {/* Thumbnails (when multiple images exist) */}
      {validImages.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '4px',
            scrollbarWidth: 'thin',
          }}
        >
          {validImages.map((img, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={img.url + idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                style={{
                  position: 'relative',
                  width: '74px',
                  height: '74px',
                  flexShrink: 0,
                  borderRadius: 'var(--r-md)',
                  overflow: 'hidden',
                  background: 'var(--color-bg-elev)',
                  border: isSelected ? '2px solid var(--brand-gold)' : '1px solid var(--color-line)',
                  opacity: isSelected ? 1 : 0.65,
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'border var(--t-fast), opacity var(--t-fast)',
                }}
              >
                <Image
                  src={img.url}
                  alt={img.alt_ar ?? `${name} - ${idx + 1}`}
                  fill
                  sizes="74px"
                  style={{ objectFit: 'cover' }}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox / Zoom Modal */}
      {zoomOpen && (
        <div
          onClick={() => setZoomOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'var(--color-scrim-strong)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            cursor: 'zoom-out',
          }}
        >
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            aria-label={tg('close')}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'var(--color-bg-elev)',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              color: 'var(--color-text)',
              fontSize: '1.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
          <div
            style={{
              position: 'relative',
              width: 'min(90vw, 800px)',
              height: 'min(85vh, 800px)',
            }}
          >
            <Image
              src={currentImage.url}
              alt={currentImage.alt_ar ?? name}
              fill
              sizes="90vw"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
