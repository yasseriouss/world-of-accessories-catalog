'use client';
import { useEffect } from 'react';

export default function PWARegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('WOA PWA ServiceWorker registered successfully:', registration.scope);
          })
          .catch((error) => {
            console.warn('WOA PWA ServiceWorker registration failed:', error);
          });
      });
    }
  }, []);

  return null;
}
