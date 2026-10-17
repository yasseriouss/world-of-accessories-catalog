import type { Metadata } from 'next';
import '../globals.css';
import Sidebar from '../../components/Sidebar';

export const metadata: Metadata = { title: 'لوحة التحكم | عالم الاكسسوار', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: any) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', minHeight:'100vh' }}>
          <Sidebar />
          <main style={{ padding:'32px', background:'var(--color-bg)' }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
