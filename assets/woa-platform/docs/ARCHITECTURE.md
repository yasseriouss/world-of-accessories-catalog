# WOA Platform — معمارية المشروع

## نظرة عامة
منظومة واحدة (Monorepo) بـ 3 تطبيقات على قاعدة بيانات ومصدر منتجات واحد:

| التطبيق | المسار | الوظيفة | الـ Rendering |
|---|---|---|---|
| `apps/web`   | `/`            | اللاندنج + المدونة + B2B | **SSG/ISR** (كامل الفهرسة) |
| `apps/store` | `/market`      | المتجر + السلة + الطلبات | **SSR/ISR** (المنتجات + SSG للصفحات الثابتة) |
| `apps/admin` | `/admin`       | الداشبورد | SPA محمي (لا حاجة لـ SEO) |

**التواصل بينها ليس نسخاً للبيانات** — كل التطبيقات تقرأ من نفس الـ Postgres (Supabase) عبر API واحد. اللاندنج يعرض «منتجات مميزة» من نفس جدول المتجر، والمقال يربط بمنتجات حقيقية.

## Stack
- **Framework:** Next.js 14 (App Router) لكل التطبيقات الثلاثة → وحدة كود مشتركة
- **DB:** Supabase (PostgreSQL + RLS + Storage للصور)
- **Auth:** Supabase Auth (الداشبورد) + OTP بالموبايل (عملاء المتجر)
- **i18n:** next-intl — عربي RTL افتراضي (السوق المصري) + إنجليزي LTR، توجيه `/ar` `/en`
- **Styling:** CSS Modules + Design Tokens من `packages/ui/tokens.css`
- **Images:** `next/image` + Supabase Storage + تلقائي WebP/AVIF
- **الإشعارات:** WhatsApp Cloud API عند تأكيد الطلب + تغيير حالته
- **الدفع:** COD + Vodafone Cash / InstaPay (تحويل يدوي مؤكد من الداشبورد)

## البنية
```
woa-platform/
├── apps/
│   ├── web/      # اللاندنج: الرئيسية، عوالم×4، blog/، b2b، contact، سياسات
│   ├── store/    # market: /product/[slug]، /cart، /checkout، /account، /compare
│   └── admin/    # /admin: products, orders, blog, banners, analytics
├── packages/
│   ├── db/       # migrations/ + seed/ + query helpers مشتركة
│   ├── ui/       # tokens.css + مكونات مشتركة (Button, Card, Price...)
│   ├── i18n/     # messages/ar.json + en.json
│   └── lib/      # formatters, seo helpers (jsonLd), whatsapp link builder
└── docs/         # هذا الملف + API_SPEC.md
```

## قواعد SEO (تُطبق من اليوم الأول)
1. كل صفحة عامة لها `metadata` ديناميكي + `generateStaticParams` حيثما أمكن
2. Schema.org: `Organization`+`LocalBusiness` (اللاندنج)، `Product`+`Offer` (صفحات المنتجات)، `Article`+`FAQPage` (المدونة)
3. `sitemap.ts` ديناميكي يسحب المنتجات/المقالات/الأقسام من الـ DB
4. الروابط: `/product/soft-close-hinge-3d` وليس `/product?id=123`
5. OpenGraph صور لكل منتج ومقال (1200×630)

## مؤشرات القبول (Definition of Done)
- Lighthouse: Performance ≥ 90, SEO = 100, Accessibility ≥ 95, Best Practices ≥ 95
- متجاوب 320px → 2560px بدون كسر
- فهرسة Google كاملة (URL Inspection نظيف)
- تبديل اللغة فوري بدون وميض
