# 🛠️ كتالوج عالم الإكسسوارات | World of Accessories Catalog

نظام كتالوج احترافي ثنائي اللغة (عربي / إنجليزي) لمنتجات وإكسسوارات الأثاث والمطابخ والأبواب (591 منتجاً موزعة على 10 فئات).

---

## 📁 هيكلية المشروع المنظمة (Project Structure)

```text
Catalogue/
├── index.html                   # الصفحة الرئيسية التفاعلية (Landing Page)
├── catalog_ar.html              # الكتالوج الكامل بالعربية (591 منتج - 60 صفحة A4 جاهزة للطباعة)
├── catalog_en.html              # الكتالوج الكامل بالإنجليزية (591 منتج - 60 صفحة A4)
├── catalog_en_branded.html      # نسخة العرض الخاصة بالهوية البصرية (Branded Edition)
├── parsed_products.json         # بيانات المنتجات المعالجة (591 منتج)
│
├── Categories/                  # صفحات وتصفح الفئات العشر
│   ├── categories_index_ar.html # فهرس الفئات بالعربية (روابط تفاعلية)
│   ├── categories_index_en.html # فهرس الفئات بالإنجليزية
│   ├── category_01_ar.html .. category_10_ar.html # صفحات الفئات بالعربية
│   └── category_01_en.html .. category_10_en.html # صفحات الفئات بالإنجليزية
│
├── Branding/                    # أصول الهوية البصرية وشعارات الشركة
│   ├── logo.png / logo-150.png / logo-100.png / logo-80.png  # أحجام الشعار المختلفة
│   ├── Comfortaa-VariableFont_wght.ttf                      # خط النصوص الإنجليزية
│   ├── Tajawal-Regular.ttf                                  # خط النصوص العربية
│   ├── pattern-01 .. pattern-04                             # أنماط وخلفيات الهوية
│   └── *.pdf                                                # ملفات المتجهات الأصلية وكروت الطباعة
│
├── styles/                      # ملفات التنسيق والخطوط
│   └── fonts.css                # تعريف الخطوط المحلية مع Fallback لـ Google Fonts
│
├── data/                        # البيانات الأصلية والمصادر
│   ├── data.xlsx                # ملف الإكسيل الأصلي الوارد
│   ├── parsed_products.json     # ملف JSON للمنتجات بالأسماء والأسعار
│   └── categories_data.json     # بيانات وتعريفات الفئات والكلمات المفتاحية
│
├── scripts/                     # نصوص المعالجة وتوليد الكتالوجات (Python & JS)
│   ├── generate_professional_catalog_v2.py  # توليد صفحات الفئات والفهارس بالكامل
│   ├── generate_professional_catalog.py     # توليد الكتالوجات الكاملة الشاملة
│   ├── create_branded_catalogs.py           # إنشاء الكتالوج المعزز بالهوية
│   ├── create_logo_assets.py                # استخراج وتوليد مقاسات الشعار
│   └── ...                                  # نصوص التحقق والمعالجة
│
└── Documentation/               # التوثيق والتقارير وخطط العمل
    ├── PROJECT_ARCHITECTURE.md              # معمارية النظام التفصيلية
    ├── PRODUCT_CATEGORIES_ANALYSIS.md       # تحليل الفئات وتوزيع المنتجات
    ├── LOGO_INTEGRATION_GUIDE.md            # دليل استخدام الشعار والألوان
    ├── QUICK_START_GUIDE.md                 # دليل البدء السريع
    └── ...                                  # كافة تقارير المراحل السابقة
```

---

## 🎨 الهوية البصرية المعتمدة (Brand Identity)

- **الكحلي الملكي (Navy)**: `#1A3F7F` — للعناوين الرئيسية والهيدر.
- **البرتقالي الحيوي (Orange)**: `#FF8C3D` — للأسعار والأزرار البارزة والتمييز.
- **الكريمي (Cream)**: `#F5E6D3` — لخلفيات البطاقات والأقسام الهادئة.
- **الخطوط**: خط `Tajawal` للمحتوى العربي، وخط `Comfortaa` للمحتوى الإنجليزي.

---

## 🚀 كيفية تشغيل المشروع (How to Run)

المشروع مصمم ليعمل مباشرة عبر أي خادم ويب محلي:

### الخيار 1: باستخدام Python (الأسهل والأسرع)
افتح موجه الأوامر (Terminal / PowerShell) في مجلد المشروع ونفذ:
```bash
python -m http.server 8080
```
ثم افتح المتصفح على:
👉 **`http://localhost:8080`**

### الخيار 2: باستخدام Node.js
```bash
npx serve .
```

---

## 🔄 إعادة توليد الصفحات (Regeneration)

في حال تحديث المنتجات أو الأسعار في `data/parsed_products.json` أو تعديل الفئات:
```bash
# لتحديث صفحات الفئات العشر والفهارس
python scripts/generate_professional_catalog_v2.py

# لتحديث الكتالوج الكامل (A4 Print 60 صفحة)
python scripts/generate_professional_catalog.py
```
