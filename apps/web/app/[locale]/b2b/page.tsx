'use client';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';

export default function B2BPage() {
  const t = useTranslations('b2b');
  const locale = useLocale();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const fd = Object.fromEntries(new FormData(e.currentTarget).entries());
      const res = await fetch('/api/b2b-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fd)
      });
      const data = await res.json();
      setLoading(false);
      if (data.ok) {
        setDone(true);
      } else {
        setErrorMsg(locale === 'ar' ? 'يرجى مراجعة البيانات المدخلة والمحاولة مرة أخرى.' : 'Please verify your information and try again.');
      }
    } catch {
      setLoading(false);
      setErrorMsg(locale === 'ar' ? 'حدث خطأ في الاتصال بالخادم. يرجى إعادة المحاولة أو التواصل عبر واتساب.' : 'Connection error. Please try again or reach out via WhatsApp.');
    }
  }

  if (done) return (
    <main id="main-content" className="container section" style={{ textAlign:'center', padding:'80px 20px', maxWidth:'640px' }}>
      <div style={{ fontSize:'3.5rem', color:'var(--color-success)', marginBottom:'16px' }}>✓</div>
      <h1 className="sec-title" style={{ fontSize:'var(--fs-h1)' }}>{t('success')}</h1>
      <p style={{ color:'var(--color-text-2)', fontSize:'1.05rem', margin:'16px 0 24px' }}>
        {locale === 'ar'
          ? 'تم استلام طلب التوريد بنجاح. سيقوم مهندس المبيعات والمشاريع بالتواصل معكم خلال 4 ساعات عمل لمراجعة جداول الكميات والأسعار.'
          : 'Your wholesale inquiry has been received. A project sales engineer will contact you within 4 business hours.'}
      </p>
      <a href={`/${locale}`} className="btn btn-outline" style={{ minHeight:'48px' }}>
        {locale === 'ar' ? 'العودة للرئيسية' : 'Return Home'}
      </a>
    </main>
  );

  return (
    <main id="main-content" className="container section" style={{ maxWidth:'680px' }}>
      <h1 className="sec-title" style={{ fontSize:'var(--fs-h1)', margin:'0 0 12px' }}>
        {t('title')}
      </h1>
      <p style={{ color:'var(--color-text-2)', fontSize:'1rem', margin:'0 0 28px' }}>
        {locale === 'ar'
          ? 'خدمات التوريد المباشر من مصانع ومستودعات عالم الاكسسوار لمصانع الأثاث والمشاريع المعمارية والفندقية بأسعار الجملة المعتمدة.'
          : 'Direct factory supply and wholesale procurement for furniture manufacturers and architectural projects.'}
      </p>

      {errorMsg && (
        <div style={{
          padding:'14px 18px',
          background:'rgba(192, 57, 43, 0.1)',
          border:'1px solid var(--color-danger)',
          borderRadius:'var(--r-md)',
          color:'var(--color-danger)',
          fontSize:'0.95rem',
          marginBottom:'20px'
        }} role="alert">
          {errorMsg}
        </div>
      )}

      <form onSubmit={submit} style={{ display:'grid', gap:'20px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'16px' }}>
          <div>
            <label htmlFor="b2b-company" className="lbl">
              {t('company')} *
            </label>
            <input
              id="b2b-company"
              name="company"
              required
              className="input"
              placeholder={locale === 'ar' ? 'اسم المصنع أو الشركة' : 'Company or Factory Name'}
            />
          </div>
          <div>
            <label htmlFor="b2b-contact" className="lbl">
              {t('contact')} *
            </label>
            <input
              id="b2b-contact"
              name="contact"
              required
              className="input"
              placeholder={locale === 'ar' ? 'اسم المسؤول' : 'Contact Person'}
            />
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'16px' }}>
          <div>
            <label htmlFor="b2b-phone" className="lbl">
              {t('phone')} *
            </label>
            <input
              id="b2b-phone"
              name="phone"
              required
              className="input"
              pattern="01[0-9]{9}"
              dir="ltr"
              placeholder="01xxxxxxxxx"
              aria-describedby="phone-hint"
            />
            <span id="phone-hint" style={{ fontSize:'0.75rem', color:'var(--color-text-3)', display:'block', marginTop:'4px' }}>
              {locale === 'ar' ? 'رقم هاتف مصري متاح عليه واتساب' : 'Egyptian phone number with WhatsApp'}
            </span>
          </div>
          <div>
            <label htmlFor="b2b-email" className="lbl">
              {locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <input
              id="b2b-email"
              name="email"
              type="email"
              className="input"
              dir="ltr"
              placeholder="name@company.com"
            />
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'16px' }}>
          <div>
            <label htmlFor="b2b-type" className="lbl">
              {locale === 'ar' ? 'نوع النشاط / المشروع' : 'Business / Project Type'}
            </label>
            <select id="b2b-type" name="project_type" className="input">
              <option value="factory">{locale === 'ar' ? 'مصنع أثاث أو مطابخ' : 'Furniture or Kitchen Factory'}</option>
              <option value="contractor">{locale === 'ar' ? 'مقاولات وديكور داخلي' : 'Interior Contracting & Architecture'}</option>
              <option value="hotel">{locale === 'ar' ? 'مشروع فندقي أو سكني' : 'Hospitality or Residential Project'}</option>
              <option value="workshop">{locale === 'ar' ? 'ورشة نجارة وتصنيع' : 'Custom Woodworking Workshop'}</option>
            </select>
          </div>
          <div>
            <label htmlFor="b2b-tax" className="lbl">
              {locale === 'ar' ? 'السجل التجاري / البطاقة الضريبية (اختياري)' : 'Commercial Registration (Optional)'}
            </label>
            <input
              id="b2b-tax"
              name="tax_id"
              className="input"
              placeholder={locale === 'ar' ? 'رقم السجل التجاري' : 'Registration No.'}
            />
          </div>
        </div>

        <div>
          <label htmlFor="b2b-qty" className="lbl">
            {locale === 'ar' ? 'تقدير الكميات المطلوبة' : 'Estimated Monthly Volume'}
          </label>
          <input
            id="b2b-qty"
            name="qty_estimate"
            className="input"
            placeholder={locale === 'ar' ? 'مثال: 500 طقم مفصلات + 120 سكة درج شهرياً' : 'e.g. 500 hinge pairs + 120 drawer slides monthly'}
          />
        </div>

        <div>
          <label htmlFor="b2b-details" className="lbl">
            {t('details')} *
          </label>
          <textarea
            id="b2b-details"
            name="details"
            required
            className="input"
            rows={4}
            placeholder={locale === 'ar' ? 'اكتب تفاصيل المنتجات والمقاسات وجدول التشطيبات المطلوبة...' : 'Specify codes, sizes, load requirements, and finishes...'}
          />
        </div>

        <button
          className="btn btn-primary btn-lg"
          disabled={loading}
          style={{ width:'100%', minHeight:'52px' }}
        >
          {loading ? (locale === 'ar' ? 'جارٍ الإرسال...' : 'Submitting...') : t('submit')}
        </button>
      </form>
    </main>
  );
}
