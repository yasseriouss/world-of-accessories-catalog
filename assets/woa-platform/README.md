# WOA Platform — Starter (Phase 1 & 2 complete)

## ما تم إنجازه
- [x] هيكل Monorepo للتطبيقات الثلاثة
- [x] قاعدة البيانات الكاملة (0001_init.sql) — منتجات، أقسام، طلبات، مقالات، بنرات، B2B، شحن مصر، كوبونات، Audit
- [x] Seed للشحن (27 محافظة) + الأقسام الرئيسية الأربعة
- [x] Design Tokens كاملة (tokens.css) — هوية ذهبي مطفي/حبري
- [x] i18n عربي/إنجليزي كامل للنصوص المشتركة
- [x] توثيق المعمارية + مواصفة الـ API

## التشغيل
1. Supabase: نفّذ `packages/db/migrations/0001_init.sql` ثم `packages/db/seed/0001_seed.sql`
2. التطبيقات الثلاثة تُنشأ بـ `create-next-app` داخل مجلداتها وتستهلك `packages/*` عبر workspace


## Phase 3 — المتجر (apps/store) ✅
- [x] هوم متجر: بنرات hero + الأقسام الأربعة + منتجات مميزة + الأكثر مبيعاً
- [x] كتالوج بفلاتر (قسم/سعر/فرز/بحث) + ترقيم صفحات
- [x] صفحة منتج: معرض، مواصفات، JSON-LD Product schema، منتجات ذات صلة، مقالات مرتبطة
- [x] سلة (localStorage) + إتمام طلب (27 محافظة، COD/Vodafone Cash/InstaPay) + تتبع بدون حساب
- [x] مقارنة حتى 4 منتجات + صفحة 404
- [x] API طلبات: تحقق Zod، أسعار من DB (لا ثقة بالعميل)، تحقق مخزون، رسوم شحن حسب المحافظة، إشعار واتساب
- [x] sitemap.ts ديناميكي + robots.txt
- التشغيل: انسخ .env.example → .env.local، املأ مفاتيح Supabase، ثم `npm i && npm run dev`


## Phase 4 — اللاندنج + المدونة (apps/web) ✅
- [x] رئيسية: Hero + شريط ثقة (أيقونات SVG) + 4 عوالم + منتجات من متجر DB + إحصائيات + CTA للـ B2B + المعرض
- [x] صفحات العوالم: /world/kitchen|dressing|handles|mechanisms — منتجات القسم + مقالاته (SSG)
- [x] مدونة: أرشيف + صفحة مقال (prose، مؤلف، FAQ Schema، منتجات مرتبطة للبيع المباشر، مقالات ذات صلة، CTA واتساب)
- [x] B2B: نموذج → API → b2b_quotes → إشعار واتساب
- [x] تواصل معنا + من نحن + 4 صفحات قانونية + sitemap/robots


## Phase 5 — الداشبورد (apps/admin) ✅
- [x] مصادقة Supabase + middleware حماية تلقائي
- [x] لوحة قيادة: مبيعات 30 يوم، طلبات، مخزون منخفض، B2B جديد، الأكثر مبيعاً
- [x] الطلبات: بحث/فلترة + تغيير الحالة بخطوة واحدة (Trigger يخصم المخزون تلقائياً)
- [x] المنتجات: قائمة + نموذج إضافة + تنبيه المخزون المنخفض
- [x] المدونة: قائمة + محرر مقال مع FAQ Schema + نشر/مسودة
- [x] البنرات: إضافة/تفعيل/إيقاف + عداد النقرات + أماكن متعددة

## للإطلاق (Checklist)
1. Supabase: نفّذ migration + seed، أنشئ admin عبر Authentication
2. املأ .env.local في التطبيقات الثلاثة
3. Deploy: web → ha-woa.vercel.app، store → woa-market.vercel.app/market (basePath)، admin → woa-admin.vercel.app
4. Search Console: أضف sitemap للموقعين + فحص أول صفحة منتج
5. غيّر كلمة مرور الداشبورد القديمة فوراً


## Phase 6 — تحسينات الواجهة + محتوى المدونة ✅
- [x] تعلم من مستودع Maison: Dark Mode Toggle يدوي، Drawer موبايل، Scroll Reveal (IntersectionObserver)، Scroll-to-top، شارات Sale/New/Bestseller/Out، إيقاف الشريط عند الhover
- [x] 10 مقالات SEO كاملة في docs/blog/ — كل مقال: كلمات مفتاحية، meta، محتوى HTML، FAQ Schema، وروابط داخلية بين المقالات والمتجر
