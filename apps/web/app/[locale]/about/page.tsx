export const metadata = { title: 'من نحن' };

export default function AboutPage() {
  return (
    <div className="container section">
      <div className="eyebrow">About</div>
      <h1 style={{ fontSize:'var(--fs-h1)' }}>عالم الاكسسوار</h1>
      <div className="prose" style={{ margin:0 }}>
        <p>منذ تأسيسنا في مدينة 6 أكتوبر، ونحن الشريك المعتمد لتوريد إكسسوارات الأثاث والمطابخ في مصر — للمصانع والورش ومهندسي الديكور.</p>
        <h2>ماذا يميزنا؟</h2>
        <ul>
          <li><strong>اعتمادية هندسية:</strong> خامات ستانلس مقاومة للرطوبة وبساتم مختبرة لأكثر من 80,000 دورة.</li>
          <li><strong>مخزون فوري:</strong> أكثر من 590 منتجاً جاهزاً من معرضنا داخل سيلا مول.</li>
          <li><strong>تغطية شاملة:</strong> شحن آمن لجميع المحافظات مع إمكانية المعاينة.</li>
        </ul>
      </div>
    </div>
  );
}
