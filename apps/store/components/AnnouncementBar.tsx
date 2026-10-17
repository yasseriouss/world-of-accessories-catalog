import { getBanners } from '../lib/queries';
import Link from 'next/link';

export default async function AnnouncementBar() {
  const banners = await getBanners('store_top');
  if (!banners.length) return null;
  const doubled = [...banners, ...banners];
  return (
    <div className="annbar" role="region" aria-label="Offers">
      <div className="annbar-track">
        {doubled.map((b: any, i: number) => (
          <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:'10px', fontSize:'.875rem', fontWeight:600 }}>
            {b.tag_ar && <span style={{ background:'var(--color-accent)', color:'#fff', borderRadius:'999px',
              padding:'2px 10px', fontSize:'.72rem' }}>{b.tag_ar}</span>}
            {b.link_url
              ? <Link href={b.link_url} style={{ color:'inherit', textDecoration:'underline' }}>{b.text_ar}</Link>
              : b.text_ar}
          </span>
        ))}
      </div>
    </div>
  );
}
