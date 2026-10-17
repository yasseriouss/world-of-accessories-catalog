# وثيقة التسليم الكاملة لأي AI Agent — WOA Platform
> اقرأ هذا الملف أولاً. فيه كل سياق المشروع، ماذا تم، وماذا يتبقى.

---

## 1. ما هذا المشروع؟
منظومة تجارة إلكترونية مصرية لمتجر «عالم الاكسسوار» — بيع إكسسوارات أثاث ومطابخ (مفصلات هيدروليك، سكك تاندم، مقابض، مواسير تعليق، بساتم غاز). السوق المستهدف: مصر بالكامل (27 محافظة) + توريد B2B للمصانع والورش.

**المواقع الحالية القديمة (قيد الاستبدال):**
- اللاندنج: https://ha-woa.vercel.app (SPA — لا يُفهرس، لا مدونة)
- المتجر: https://woa-market.vercel.app/market (SPA — المنتجات لا تظهر لجوجل)
- الداشبورد: https://woa-admin.vercel.app/admin (فقط إدارة بنرات)

**الهاتف الرسمي / واتساب:** 01140030036 — المعرض: سيلا مول، المحور المركزي، 6 أكتوبر، يومياً 10ص–10م.

---

## 2. المعمارية المبنية (Monorepo)
```
woa-platform/
├── apps/
│   ├── web/     # اللاندنج + المدونة + B2B + تواصل  (Next.js 14, SSG/ISR) ← ha-woa.vercel.app
│   ├── store/   # المتجر: كتالوج/منتج/سلة/طلب/تتبع/مقارنة (Next.js 14, SSR/ISR) ← woa-market.vercel.app/market
│   └── admin/   # الداشبورد (Next.js 14, محمي بـ Supabase Auth) ← woa-admin.vercel.app
├── packages/
│   ├── db/      # migrations/0001_init.sql + seed/0001_seed.sql (27 محافظة + 4 أقسام)
│   ├── ui/      # tokens.css (هوية ذهبي مطفي #B08D2E) + theme-init.js
│   ├── i18n/    # messages/ar.json + en.json (عربي RTL افتراضي)
│   └── (lib/ مشترك منسوخ داخل كل app: supabase, queries, format, seo)
├── docs/
│   ├── ARCHITECTURE.md      # المعمارية وقرارات التصميم
│   ├── API_SPEC.md          # مواصفة الـ API
│   ├── DEPLOYMENT_GUIDE.md  # دليل النشر 8 مراحل (المرجع الرئيسي للتنفيذ)
│   └── blog/                # 10 مقالات SEO كاملة جاهزة للنشر (00_INDEX.md أولاً)
└── README.md                # ملخص المراحل المنجزة
```

**قاعدة البيانات:** PostgreSQL على Supabase. 12 جدول: products, categories, orders, order_items, customers, coupons, posts, post_sections, banners, b2b_quotes, shipping_zones, admin_users, audit_log.
**منطق مدمج مهم:** Trigger `confirm_order_stock` يخصم المخزون ويزيد `sold_count` عند تأكيد الطلب. Trigger `next_order_no` يولّد أرقام طلبات WOA-YYYY-XXXXX. RLS: العامة تقرأ الكتالوج فقط.

---

## 3. ما تم إنجازه (6 مراحل كاملة)
| المرحلة | الحالة | التفاصيل في |
|---|---|---|
| 1–2 الأساس + DB | ✅ | migrations, seed, tokens.css, i18n, docs |
| 3 المتجر | ✅ 26 ملفاً | كتالوج بفلاتر، صفحة منتج JSON-LD، سلة، checkout (COD/VF Cash/InstaPay)، تتبع بدون حساب، مقارنة، sitemap ديناميكي |
| 4 اللاندنج + المدونة | ✅ 25 ملفاً | هيرو، 4 عوالم SSG، مدونة FAQ Schema + بيع من المقال، نموذج B2B، صفحات قانونية |
| 5 الداشبورد | ✅ 18 ملفاً | لوحة قيادة، طلبات (تغيير حالة)، منتجات، محرر مقالات + FAQ، بنرات بعداد نقرات |
| 6 تحسينات UI | ✅ | Dark mode يدوي، Drawer موبايل، Scroll Reveal، Scroll-to-top، شارات Sale/New/Best، إيقاف marquee عند hover |
| محتوى | ✅ | 10 مقالات SEO كاملة في docs/blog/ |

---

## 4. كيف تكمل العمل؟ (حسب الحالة)

### الحالة أ: لم يُنشر شيء بعد
اتبع `docs/DEPLOYMENT_GUIDE.md` حرفياً — 8 مراحل: Supabase ← GitHub ← Vercel ×3 ← محتوى ← واتساب ← Search Console ← اختبار ← خطة 30 يوم.

### الحالة ب: النشر تم — تريد تطويرات
البيئة: كل app فيه `.env.example` ← انسخه `.env.local` واملأ مفاتيح Supabase. `npm i` داخل app ثم `npm run dev` (web:3001, store:3002, admin:3000).

### أولويات التطوير المقترحة (بالترتيب)
1. **رفع الصور**: ربط Supabase Storage bucket `products` (public) + واجهة رفع في الداشبورد (حالياً الحقول نصوص URLs)
2. **دفع إلكتروني**: Paymob أو Stripe للبطاقات (COD يبقى) — endpoint `/api/payments`
3. **OTP للعملاء**: تسجيل دخول بالموبايل (Supabase Auth phone) لحفظ العناوين
4. **مراجعات المنتجات**: جدول reviews + نجوم في صفحة المنتج (يرفع CTR في جوجل)
5. **Wishlist**: localStorage مثل السلة + صفحة /wishlist
6. **إشعارات واتساب تلقائية للعميل**: عند تأكيد/شحن الطلب (via Make.com)
7. **كوبونات**: الجدول جاهز `coupons` — واجهة إدخال الكود في checkout + CRUD في الداشبورد
8. **PWA**: manifest + Service Worker للمتجر (مصر: نت ضعيف — offline browsing)
9. **تعدد صور المنتج**: ProductCard وصفحة المنتج تدعم gallery (البيانات JSONB جاهزة)
10. **لوحة B2B في الداشبورد**: عرض طلبات b2b_quotes وتغيير حالتها (الجدول والنموذج يعملان، القائمة غير مبنية)

### قواعد العمل إلزامية
- **لا تكسر**: عربي RTL هو الافتراضي (السوق المصري) — أي UI جديد يجب أن يعمل بالاتجاهين
- **SEO أولاً**: أي صفحة عامة جديدة ← `generateMetadata` + رابط نظيف `/[locale]/...`
- **الأمان**: لا تثق بمدخلات العميل أبداً (الأمراض موجودة في `apps/store/app/api/orders/route.ts`) — الأسعار دائماً من DB
- **الهوية**: استخدم tokens من `packages/ui/tokens.css` — لا ألوان مكتوبة يدوياً
- **i18n**: أي نص جديد يُضاف لـ `packages/i18n/messages/ar.json` + `en.json`
- **الأداء**: الصور `next/image` + lazy، Lighthouse ≥ 90

---

## 5. مفاتيح الاختبار
- إنشاء طلب تجريبي ← يجب أن يظهر في الداشبورد + خصم المخزون عند «تأكيد»
- تفعيل بنر ← يظهر في المتجر/اللاندنج حسب placement
- نشر مقال ← يظهر في `/ar/blog` + sitemap فوراً
- تبديل اللغة/الثيم ← محفوظ بعد إعادة الفتح

## 6. تنبيهات
- **غيّر كلمة مرور الداشبورد القديمة** فور الوصول للمشروع القديم
- لا ترفع `.env.local` لجيت أبداً
- قبل أي تعديل على `0001_init.sql` أنشئ migration جديد `0002_xxx.sql` (لا تعدّل القديم)

**آخر تحديث:** 2026-10-17 — المراحل 1–6 مكتملة، المشروع جاهز للنشر أو التطوير.
