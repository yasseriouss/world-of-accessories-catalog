# 📖 Catalog Generator Engine (محرك توليد الكتالوجات)

محرك مستقل لتوليد الكتالوجات المطبوعة الرسمية بمقاس A4 Portrait، والكتيبات المخصصة لكل فئة، بناءً على قاعدة بيانات المنتجات الموحدة `data/products.json`.

---

## 🚀 المميزات:
1. **الكتالوج الشامل الفاخر (عربي):** `catalog_ar.html` (غلاف، فهرس محتويات، أرقام مشرقية، عزل BiDi، تقسيم صفحات A4).
2. **الكتالوج الدولي الشامل (إنجليزي):** `catalog_en.html` (International Executive A4 Layout).
3. **كتيبات الفئات العشر المستقلة:** `Categories/category_01` إلى `category_10` باللغتين العربية والإنجليزية.
4. **سرعة فائقة:** توليد كامل لجميع الإصدارات والصفحات في أقل من ربع ثانية (0.2s).
5. **تكامل تلقائي:** يتم استدعاؤه تلقائياً من لوحة التحكم (Admin Dashboard) عند إضافة أو تعديل أي منتج، أو عند الضغط على زر التوليد اليدوي.

---

## 💻 الاستخدام من سطر الأوامر (CLI):
```bash
python catalog_generator/cli.py
```

أو برمجياً في بايثون:
```python
from catalog_generator.generator import CatalogGenerator

gen = CatalogGenerator()
status = gen.generate_all()
print(status)
```
