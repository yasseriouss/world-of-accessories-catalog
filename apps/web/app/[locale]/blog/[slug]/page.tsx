import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { whatsappLink } from '@/lib/format';

export const revalidate = 300;
export const dynamicParams = true;

export async function generateMetadata({ params }: any) {
  const { data: p } = await supabase.from('posts').select('*').eq('slug', params.slug).eq('status', 'published').single();
  if (!p) return {};
  const ar = params.locale === 'ar';
  return {
    title: ar ? p.seo_title_ar ?? p.title_ar : p.seo_title_en ?? p.title_en,
    description: ar ? p.seo_desc_ar ?? p.excerpt_ar : p.seo_desc_en ?? p.excerpt_en,
    openGraph: { type: 'article', images: p.cover_url ? [p.cover_url] : [], publishedTime: p.published_at }
  };
}

export default async function BlogPost({ params }: any) {
  const { data: p } = await supabase.from('posts').select('*, authors(name_ar, avatar_url)').eq('slug', params.slug).eq('status', 'published').single();
  if (!p) notFound();
  const ar = params.locale === 'ar';
  const locale = params.locale;
  const title = ar ? p.title_ar : p.title_en ?? p.title_ar;
  const content = ar ? p.content_ar : p.content_en ?? p.content_ar;

  // FAQ sections → FAQPage schema (SEO rich results)
  const { data: faqs } = await supabase.from('post_sections')
    .select('content').eq('post_id', p.id).eq('type', 'faq').order('sort');
  const faqItems = (faqs ?? []).flatMap((f: any) => f.content);
  const jsonLd = faqItems.length ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqItems.map((f: any) => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  } : null;

  // Related products (cross-sell) + related posts
  const relatedIds = p.related_product_ids ?? [];
  const { data: relatedProducts } = relatedIds.length
    ? await supabase.from('products').select('slug,code,name_ar,name_en,price_egp,sale_price')
        .in('id', relatedIds).eq('is_active', true) : { data: [] };
  const { data: relatedPosts } = await supabase.from('posts')
    .select('slug,title_ar,cover_url').eq('status', 'published')
    .eq('category_slug', p.category_slug).neq('slug', p.slug).limit(3);

  return (
    <article className="container section" style={{ maxWidth: '860px' }}>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}

      <nav style={{ fontSize:'.8rem', color:'var(--color-text-3)', marginBottom:'24px' }}>
        <Link href={`/${locale}/blog`} style={{ color:'inherit' }}>{ar ? 'المدونة' : 'Blog'}</Link> / <span>{title}</span>
      </nav>

      <h1 style={{ fontSize:'var(--fs-h1)', lineHeight:1.35 }}>{title}</h1>
      <div style={{ display:'flex', gap:'12px', alignItems:'center', margin:'20px 0 28px', fontSize:'.85rem', color:'var(--color-text-3)' }}>
        {p.authors?.avatar_url && <Image src={p.authors.avatar_url} alt="" width={36} height={36} style={{ borderRadius:'50%' }} />}
        <span>{p.authors?.name_ar}</span>
        <span>•</span>
        <time dateTime={p.published_at}>{new Date(p.published_at).toLocaleDateString(ar ? 'ar-EG' : 'en-EG')}</time>
      </div>

      {p.cover_url && (
        <div style={{ position:'relative', aspectRatio:'16/9', borderRadius:'var(--r-lg)', overflow:'hidden', marginBottom:'32px' }}>
          <Image src={p.cover_url} alt={title} fill priority sizes="(max-width:860px) 100vw, 860px" style={{ objectFit:'cover' }} />
        </div>
      )}

      <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />

      {/* FAQ render */}
      {faqItems.length > 0 && (
        <section style={{ maxWidth:'760px', margin:'48px auto 0' }}>
          <h2 style={{ fontSize:'var(--fs-h2)' }}>{ar ? 'أسئلة شائعة' : 'FAQ'}</h2>
          {faqItems.map((f: any, i: number) => (
            <details key={i} style={{ borderBottom:'1px solid var(--color-line)', padding:'16px 0' }}>
              <summary style={{ fontWeight:600, cursor:'pointer' }}>{f.q}</summary>
              <p style={{ color:'var(--color-text-2)', marginTop:'10px', lineHeight:1.9 }}>{f.a}</p>
            </details>
          ))}
        </section>
      )}

      {/* Cross-sell: products inside article */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section style={{ maxWidth:'760px', margin:'56px auto 0' }}>
          <h2 style={{ fontSize:'var(--fs-h2)' }}>{ar ? 'منتجات المقال' : 'Products in this article'}</h2>
          <div style={{ display:'grid', gap:'12px' }}>
            {relatedProducts.map((rp: any) => (
              <a key={rp.id} href={`https://woa-market.vercel.app/${locale}/product/${rp.slug}`}
                style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'16px',
                  padding:'16px 20px', border:'1px solid var(--color-line)', borderRadius:'var(--r-lg)',
                  textDecoration:'none', background:'var(--color-bg-elev)' }}>
                <div>
                  <div style={{ fontWeight:600 }}>{ar ? rp.name_ar : rp.name_en ?? rp.name_ar}</div>
                  <div style={{ fontSize:'.78rem', color:'var(--color-text-3)' }}>{rp.code}</div>
                </div>
                <span className="price" style={{ color:'var(--color-accent)', whiteSpace:'nowrap' }}>
                  {rp.sale_price ?? rp.price_egp} {ar ? 'ج.م' : 'EGP'}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Related posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section style={{ marginTop:'56px' }}>
          <h2 className="sec-title">{ar ? 'مقالات ذات صلة' : 'Related posts'}</h2>
          <div className="posts-grid">
            {relatedPosts.map((rp: any) => (
              <Link key={rp.slug} href={`/${locale}/blog/${rp.slug}`} className="card post-card">
                <div style={{ padding:'18px' }}>
                  <h3 style={{ fontSize:'1rem' }}>{rp.title_ar}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* WhatsApp CTA */}
      <div style={{ maxWidth:'760px', margin:'56px auto 0', textAlign:'center',
        background:'var(--color-text)', color:'var(--color-bg)', borderRadius:'var(--r-lg)', padding:'40px 24px' }}>
        <h2 style={{ fontSize:'1.4rem', marginBottom:'8px' }}>{ar ? 'محتاج مساعدة في الاختيار؟' : 'Need help choosing?'}</h2>
        <p style={{ color:'#B9B2A0', marginBottom:'20px' }}>{ar ? 'فريقنا الهندسي يرد على استفساراتك يومياً' : 'Our team replies daily'}</p>
        <a href={whatsappLink('01140030036', `استفسار بعد قراءة مقال: ${title}`)} target="_blank" rel="noopener" className="btn btn-primary btn-lg">
          {ar ? 'تواصل واتساب' : 'WhatsApp us'}</a>
      </div>
    </article>
  );
}
