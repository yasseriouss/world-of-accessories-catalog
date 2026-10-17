# دليل النشر الكامل — WOA Platform
**من الصفر إلى موقعين + داشبورد عاملين بنسبة 100%**
المدة المتوقعة: 3–4 ساعات عمل متواصلة

---

## المرحلة 0: المتطلبات قبل البدء
- حساب GitHub (لرفع الكود)
- حساب Vercel (سجّل دخولك بحساب GitHub)
- حساب Supabase (مجاني كافٍ للبداية)
- حساب Google (لـ Search Console)
- رقم الواتساب التجاري: 01140030036

---

## المرحلة 1: إعداد قاعدة البيانات (Supabase) — 20 دقيقة

### 1.1 إنشاء المشروع
1. ادخل https://supabase.com ← New Project
2. الاسم: `woa-platform`، كلمة مرور قوية، المنطقة: **Frankfurt** (أقرب لمصر)
3. انتظر دقيقتين حتى يجهز المشروع

### 1.2 تنفيذ قاعدة البيانات
1. من القائمة الجانبية: **SQL Editor** ← New query
2. افتح ملف `packages/db/migrations/0001_init.sql` من المشروع، انسخه كاملاً والصقه ← **Run**
3. افتح `packages/db/seed/0001_seed.sql`، الصقه ← **Run**
4. تحقق: **Table Editor** ← يجب أن ترى 12 جدولاً (products, orders, posts...)

### 1.3 إنشاء مستخدم الإدارة
1. **Authentication** ← Users ← **Add User** ← Create New User
2. البريد: `yassersalllam@gmail.com` + **كلمة مرور جديدة قوية** (غيّرها الآن!)
3. Confirm the user (اضغط Confirm email)

### 1.4 حماية إضافية للـ API
1. **Authentication** ← Settings ← يجب أن يكون "Allow new users to sign up" = **OFF** (مستخدم الإدارة أُنشئ يدوياً)

### 1.5 جمع المفاتيح (ستحتاجها الآن)
1. **Project Settings** ← **API**
2. انسخ: `Project URL` و `anon public key`

---

## المرحلة 2: تجهيز الكود — 30 دقيقة

### 2.1 رفع المشروع على GitHub
```bash
cd woa-platform
git init
git add .
git commit -m "WOA Platform: store + web + admin + db"
git branch -M main
git remote add origin https://github.com/YOUR_USER/woa-platform.git
git push -u origin main
```

### 2.2 ملفات البيئة
في كل تطبيق من الثلاثة، انسخ `.env.example` إلى `.env.local`:
```bash
cp apps/store/.env.example apps/store/.env.local
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.local
```
ثم املأ الثلاثة بنفس القيم:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...(الـ anon key)
WA_WEBHOOK_URL=سنضبطه في المرحلة 5
```

---

## المرحلة 3: النشر على Vercel — 60 دقيقة

### 3.1 المتجر (woa-market.vercel.app)
1. Vercel ← **Add New Project** ← استورد `woa-platform`
2. **Root Directory** ← اختر `apps/store`
3. Framework: Next.js (يتعرف تلقائياً)
4. Environment Variables ← أضف المفاتيح الثلاثة
5. **Build & Output Settings** ← لا تغيّر شيئاً
6. Deploy ← انتظر 2 دقيقة
7. **Settings** ← Domains ← أضف: `woa-market.vercel.app` (أو دومينك الخاص)
8. ⚠️ **مهم جداً** لأن رابط المتجر الحالي `/market`:
   - Settings ← General ← **Build & Development Settings**
   - أو أنشئ `apps/store/vercel.json`:
```json
{ "rewrites": [{ "source": "/market/:path*", "destination": "/:path*" }] }
```
   - ثم أعد الـ Deploy — الروابط القديمة `/market` ستعمل كما هي

### 3.2 اللاندنج (ha-woa.vercel.app)
1. نفس المشروع ← **Add New Project** (لنفس الريبو!)
2. **Root Directory** ← `apps/web`
3. نفس متغيرات البيئة ← Deploy
4. Domains ← `ha-woa.vercel.app`

### 3.3 الداشبورد (woa-admin.vercel.app)
1. نفس المشروع ← **Add New Project**
2. **Root Directory** ← `apps/admin`
3. نفس المتغيرات ← Deploy
4. Domains ← `woa-admin.vercel.app`

**الآن لديك 3 مشاريع على Vercel تشترك في نفس الريبو — أي تحديث للكود يُبنيهم الثلاثة.**

### 3.4 ربط روابط داخلية بين المواقع (اختياري لكن مفيد)
بدلاً من كتابة الروابط يدوياً، أضف في Vercel ← Environment Variables:
```
NEXT_PUBLIC_STORE_URL=https://woa-market.vercel.app
```
ثم استبدل في الكود روابط `https://woa-market.vercel.app/market` بـ `${process.env.NEXT_PUBLIC_STORE_URL}/market`.

---

## المرحلة 4: ملء المحتوى الأولي — 60 دقيقة

### 4.1 المنتجات (يدوياً أو بالاستيراد)
**الطريقة السريعة — CSV:**
1. جهّز ملف Excel بالأعمدة: code, name_ar, price_egp, stock, category(slug)
2. Supabase ← Table Editor ← products ← **Import Data via CSV**
3. للصور: **Storage** ← أنشئ bucket اسمه `products` (public) ← ارفع الصور ← انسخ الروابط

**ملاحظة عن الصور للـ SEO:**
- الأسماء: `soft-close-hinge-3d.jpg` وليس `IMG_1234.jpg`
- الأبعاد: مربع 800×800 على الأقل
- الحجم: أقل من 200KB (استخدم https://squoosh.app)

### 4.2 المقالات العشرة
1. ادخل `woa-admin.vercel.app` ← سجّل الدخول
2. **المدونة** ← مقال جديد
3. افتح `docs/blog/01_best-hydraulic-hinges-egypt.md` ← انسخ:
   - العنوان من `title:`
   - المحتوى من `<h2>...` حتى نهاية النص (قبل `### FAQ`)
   - الصورة من `cover_url` (ارفعها للـ Storage أولاً)
4. في خانة **أسئلة شائعة**: انسخ من جدول الـ FAQ أسفل الملف
5. فعّل **نشر فوراً** ← حفظ
6. كرر للمقالات العشرة (كل مقال يستغرق ~4 دقائق)

### 4.3 بنرات الإطلاق
**البنرات** ← أضف 3 بنرات:
| النص | التاج | المكان | الرابط |
|---|---|---|---|
| شحن مجاني للطلبات فوق 2000 ج.م | عرض الإطلاق | شريط المتجر | /ar/catalog |
| خصم 10% على أول طلب — كود WELCOME10 | خصم | Hero المتجر | /ar/catalog |
| زوروا معرضنا الجديد في سيلا مول 6 أكتوبر | جديد | Hero اللاندنج | https://maps.google.com/?q=Silla+Mall |

### 4.4 منتجات مميزة
**المنتجات** ← اختر 8 منتجات مميزة (⭐) — ستظهر في هوم المتجر واللاندنج تلقائياً.

---

## المرحلة 5: الواتساب والإشعارات — 20 دقيقة

### 5.1 إنشاء Webhook مجاني
الأسهل: استخدم **Make.com** (الخطة المجانية كافية):
1. أنشئ Scenario جديد ← Webhook (HTTP) ← انسخ الـ URL
2. أضف module: **WhatsApp Cloud API** ← أو الأبسط: **HTTP** ← اطلب من مطوّرك ربط WhatsApp Cloud API الرسمي برقم 01140030036
3. ضع الـ URL في `WA_WEBHOOK_URL` في Vercel (Environment Variables) لكل مشروع ← **Redeploy**

**البديل الفوري بدون برمجة:** أنشئ بوت واتساب عبر **WATI** أو **Interakt** (باقات مصرية رخيصة) واربطه بـ Make.com.

### 5.2 اختبار الإشعار
1. أنشئ طلباً تجريبياً من المتجر
2. يجب أن يصل إشعار واتساب للإدارة خلال ثوانٍ

---

## المرحلة 6: SEO — الفهرسة — 30 دقيقة

### 6.1 Search Console (لكل موقع على حدة)
1. https://search.google.com/search-console ← أضف موقعين:
   - `ha-woa.vercel.app` (اللاندنج — الأهم)
   - `woa-market.vercel.app` (المتجر)
2. تحقق بالـ DNS (Vercel ← Domains ← DNS Records ← أضف TXT)

### 6.2 إرسال Sitemaps
| الموقع | الـ Sitemap |
|---|---|
| اللاندنج | `https://ha-woa.vercel.app/sitemap.xml` |
| المتجر | `https://woa-market.vercel.app/sitemap.xml` |

### 6.3 الفهرسة اليدوية الفورية
1. Search Console ← URL Inspection
2. الصق: `https://ha-woa.vercel.app/ar/blog/best-hydraulic-hinges-egypt` ← Request Indexing
3. كرر مع صفحة منتج واحدة وصفحة عالم واحدة
4. خلال 24–72 ساعة ستبدأ المقالات بالظهور

### 6.4 Google Business Profile (أهم خطوة محلياً!)
1. business.google.com ← أنشئ ملف: «عالم الاكسسوار - سيلا مول»
2. العنوان بالعربية + الإنجليزية، الهاتف، الصور (10 صور على الأقل للمعرض والمنتجات)
3. أضف **الموقع الإلكتروني** = اللاندنج
4. اطلب من زبائنك الحقيقيين التقييمات — هذا يجلب أكثر زيارات من SEO نفسه!

### 6.5 Analytics
1. أنشئ Google Analytics 4 ← انسخ الـ Measurement ID (G-XXXX)
2. أضفه في Vercel ← Environment Variables:
   `NEXT_PUBLIC_GA_ID=G-XXXXXXX` لكل مشروع ← Redeploy
3. (يحتاج إضافة بسيطة في layout — أو استخدم @vercel/analytics بنقرة واحدة)

---

## المرحلة 7: الاختبار النهائي — Checklist الجودة

### المتجر
- [ ] افتح الموقع من **موبايل فعلي** (ليس المتصفح الضيق فقط): المنتجات عمودين، القائمة Drawer تعمل
- [ ] أضف منتجاً للسلة ← أغلق المتصفح ← افتحه ← السلة محفوظة
- [ ] أتمم طلباً تجريبياً ← تأكد أن الطلب وصل للداشبورد والواتساب
- [ ] جرّب اللغة الإنجليزية — كل شيء ينقلب LTR
- [ ] جرّب الوضع الليلي (زر القمر في الهيدر) ← أغلق وافتح ← محفوظ
- [ ] Lighthouse (F12 ← Lighthouse): Performance ≥ 90، SEO = 100
- [ ] من Search Console ← Mobile Usability ← لا أخطاء

### اللاندنج
- [ ] فتح `/ar/blog` ← المقالات العشرة ظاهرة
- [ ] فتح مقال ← الـ FAQ مفتوح والمنتجات المرتبطة في آخره
- [ ] Lighthouse: SEO = 100
- [ ] اختبر Rich Results: https://search.google.com/test/rich-results ← الصق رابط مقال ← يجب أن يظهر FAQ

### الداشبورد
- [ ] سجّل دخول ← لوحة القيادة تعرض أرقاماً
- [ ] غيّر حالة الطلب التجريبي من «جديد» إلى «مؤكد» ← تحقق أن المخزون نقص في صفحة المنتجات
- [ ] أضف بنراً ← فعّله ← تأكد ظهوره في المتجر

---

## المرحلة 8: ما بعد الإطلاق (أول 30 يوم)

| الأسبوع | المهمة |
|---|---|
| 1 | نشر 2 مقال جديد (راجع اقتراحات: «ألوان المقابض 2026»، «سكة تاندم vs سكك البلتي»)، طلب تقييمات Google من أول 5 زبائن |
| 2 | نشر مقالين، بدء إعلانات فيسبوك/انستجرام على المناطق المحيطة بـ 6 أكتوبر |
| 3 | مراجعة Search Console ← أي مقال ظهر ← اكتب جزءاً ثانياً منه |
| 4 | تقرير أولي: أكثر المنتجات طلباً ← اجعلها مميزة + خصم عليها |

---

## استكشاف الأخطاء السريع

| المشكلة | الحل |
|---|---|
| «جاري تحميل المنتجات» يستمر | مفاتيح Supabase غير صحيحة في Vercel ← Environment Variables ← أعد الـ Deploy |
| الداشبورد يرفض الدخول | Authentication ← Users ← تأكد Confirm Email = true |
| البنرات لا تظهر | تأكد «is_active» = مفعّل + التواريخ ضمن الفترة |
| المقال لا يظهر في جوجل | أرسله يدوياً في Search Console ← Request Indexing |
| صور المنتجات لا تظهر | Storage bucket يجب أن يكون **public** |
| الطلب لا يخصم المخزون | يخصم فقط عند «تأكيد» الطلب — هذا مقصود |

---

**نهاية الدليل. عند أي خطوة توقف عندها، أرسل لي رسالة الخطأ وسأحلها فوراً.**
