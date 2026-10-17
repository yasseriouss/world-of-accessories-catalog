import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="container section" style={{ textAlign:'center', padding:'100px 0' }}>
      <div style={{ fontSize:'5rem', fontWeight:800, color:'var(--color-line)' }}>404</div>
      <p style={{ color:'var(--color-text-2)', margin:'16px 0 24px' }}>الصفحة أو المنتج غير موجود</p>
      <Link href="/ar" className="btn btn-primary">العودة للمتجر</Link>
    </div>
  );
}
