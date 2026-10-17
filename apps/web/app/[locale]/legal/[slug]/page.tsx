export const revalidate = 86400;

const CONTENT: Record<string, { ar: string }> = {
  'shipping': { ar: '<h2>سياسة الشحن</h2><p>نشحن لجميع محافظات جمهورية مصر العربية خلال 2-5 أيام عمل. رسوم الشحن تحسب حسب المحافظة وتظهر قبل تأكيد الطلب.</p><h3>الدفع عند الاستلام</h3><p>متاح في معظم المحافظات مع إمكانية المعاينة قبل الاستلام.</p>' },
  'returns': { ar: '<h2>سياسة الاسترجاع</h2><p>يمكنك استرجاع المنتج خلال 14 يوماً بحالته الأصلية مع الفاتورة. المنتجات المخصصة بالطلب غير قابلة للاسترجاع.</p>' },
  'privacy': { ar: '<h2>سياسة الخصوصية</h2><p>نحترم خصوصيتك. بياناتك (الاسم، الهاتف، العنوان) تُستخدم لغرض التوصيل فقط ولا تُشارك مع أي طرف ثالث.</p>' },
  'terms': { ar: '<h2>الشروط والأحكام</h2><p>بتصفحك الموقع أو إتمام طلبك فأنت توافق على هذه الشروط. الأسعار بالجنيه المصري وشاملة ضريبة القيمة المضافة ما لم يُذكر خلاف ذلك.</p>' }
};

export function generateStaticParams() {
  return Object.keys(CONTENT).map(slug => ({ slug }));
}

export function generateMetadata({ params }: any) {
  const titles: Record<string, string> = { shipping:'سياسة الشحن', returns:'سياسة الاسترجاع', privacy:'سياسة الخصوصية', terms:'الشروط والأحكام' };
  return { title: titles[params.slug] ?? 'سياسات' };
}

export default function LegalPage({ params }: any) {
  const c = CONTENT[params.slug];
  if (!c) return <div className="container section">غير موجود</div>;
  return <div className="container section"><div className="prose" dangerouslySetInnerHTML={{ __html: c.ar }} /></div>;
}
