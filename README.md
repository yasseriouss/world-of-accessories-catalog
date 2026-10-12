# 🛠️ عالم الإكسسوارات | World of Accessories Ecosystem

إعادة هيكلة كاملة للمشروع إلى **نموذج Monorepo** مع **موقعين منفصلين على Vercel**:

## 📊 Architecture: Separate Vercel Deployments

```text
Catalogue/
├── apps/
│   ├── 🛒 ecommerce/              # الموقع الرئيسي العام (E-Commerce)
│   │   ├── index.html             # صفحة الهبوط
│   │   ├── landing.html           # صفحة الترحيب
│   │   ├── market.html            # سوق المنتجات
│   │   ├── about.html             # عن الشركة
│   │   ├── printed_catalogs.html  # مركز الكتالوجات
│   │   ├── vercel.json            # إعدادات النشر المستقلة
│   │   ├── Branding/              # الهوية البصرية
│   │   ├── styles/                # الأنماط المشتركة
│   │   ├── static/                # ملفات JavaScript
│   │   └── README.md
│   │
│   └── 📊 dashboard/              # لوحة التحكم الإدارية (Admin Panel)
│       ├── index.html             # الصفحة الرئيسية
│       ├── admin.html             # لوحة التحكم (Supabase Auth)
│       ├── vercel.json            # إعدادات النشر المستقلة
│       ├── Branding/              # الهوية البصرية
│       ├── styles/                # الأنماط المشتركة
│       ├── static/                # ملفات JavaScript
│       └── README.md
│
├── shared/                       # الموارد المشتركة
│   ├── Branding/                 # الشعارات والخطوط والصور
│   ├── styles/                   # أنماط عام (fonts.css)
│   └── data/                     # البيانات المشتركة
│
├── docs/                         # التوثيق
├── vercel.json                   # إعدادات Monorepo (Vercel)
├── DEPLOYMENT.md                 # دليل النشر الكامل
└── README.md                     # هذا الملف
```

---

## 🛒 1. موقع الإلكترونيات العام - E-Commerce (`apps/ecommerce/`)

### الميزات الرئيسية:
- **🌍 ثنائي اللغة:** دعم كامل للعربية (RTL) والإنجليزية (LTR)
- **📱 متجاوب بنسبة 100%:** مثالي للهاتف والتابلت وأجهزة الحاسوب
- **🛍️ سوق كامل:** عرض المنتجات مع بحث وفلترة متقدمة
- **🛒 سلة تسوق:** نظام تسوق متكامل
- **📖 الكتالوجات:** كتالوجات رقمية ومطبوعة
- **♿ وصول سهل:** معايير الويب والوصولية
- **🎨 تصميم فاخر:** هوية بصرية احترافية

### الصفحات الرئيسية:
- `/` - صفحة الهبوط الرئيسية
- `/market` - سوق المنتجات
- `/about` - عن الشركة
- `/print` - مركز الكتالوجات المطبوعة

### بيانات النشر:
- **Vercel Project**: `accessories-world`
- **URL**: `https://accessories-world.vercel.app`
- **Root Directory**: `apps/ecommerce`
- **Configuration**: `apps/ecommerce/vercel.json`

---

## 📊 2. لوحة التحكم الإدارية - Admin Dashboard (`apps/dashboard/`)

### الميزات الرئيسية:
- **🔐 أمان عالي:** تسجيل دخول عبر Supabase Auth، والكتابة على قاعدة البيانات مقيّدة بسياسات RLS لحساب المسؤول فقط
- **📦 إدارة المنتجات:** إضافة وتعديل وحذف المنتجات (CRUD)
- **🖼️ إدارة الصور:** رفع الصور والتعديل عليها
- **📊 إحصائيات:** لوحة تحليلات ومراقبة الأداء
- **⚡ توليد الكتالوجات:** إنشاء الكتالوجات المطبوعة في ثانية واحدة
- **🔄 المزامنة:** تحديث تلقائي مع الموقع الرئيسي
- **🛠️ أدوات الإدارة:** إدارة الفئات والعروضات والمبيعات

### الصفحات الرئيسية:
- `/` - الصفحة الرئيسية للإدارة
- `/admin` - لوحة التحكم الكاملة

### بيانات النشر:
- **Vercel Project**: `admin-accessories`
- **URL**: `https://admin-accessories.vercel.app`
- **Root Directory**: `apps/dashboard`
- **Configuration**: `apps/dashboard/vercel.json`
- **Authentication**: Supabase Auth (email + password), writes enforced by RLS

---

## 🚀 البدء والنشر

### النشر على Vercel (الطريقة الموصى بها):

1. **ربط المستودع:**
   ```bash
   git remote -v  # تحقق من الربط مع GitHub
   ```

2. **إنشاء مشروعين على Vercel:**
   - اذهب إلى https://vercel.com
   - استورد من GitHub
   - أنشئ مشروعين:
     - **المشروع 1**: E-Commerce (Root: `apps/ecommerce`)
     - **المشروع 2**: Admin Dashboard (Root: `apps/dashboard`)

3. **التكوين:**
   - عيّن "Root Directory" للمسار المناسب
   - استخدم `vercel.json` من كل تطبيق
   - بدون أوامر بناء (ملفات ثابتة)

4. **النشر التلقائي:**
   - يتم النشر تلقائياً عند الدفع إلى `main`
   - تم إنشاء preview deployments لـ PRs

### الدفع والنشر:

```bash
# أضف التعديلات
git add .

# قم بالالتزام
git commit -m "feat: update website structure"

# ادفع إلى GitHub
git push origin main

# سيتم النشر تلقائياً على Vercel
```

---

## 📁 هيكل المشروع المفصل
