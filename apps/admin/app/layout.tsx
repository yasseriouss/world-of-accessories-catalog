import type { Metadata } from 'next';
import './globals.css';
import AdminShell from '@/components/AdminShell';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = { title: 'لوحة التحكم | عالم الاكسسوار', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AdminShell>{children}</AdminShell>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

