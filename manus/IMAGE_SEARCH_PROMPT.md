# برومبت Manus: جلب صور المنتجات

## طريقة الاستخدام

1. افتح Manus وأرفق الملف `manus/products-for-images.csv` (591 منتج، منها 590 بلا صورة).
2. انسخ البرومبت أدناه كما هو والصقه.
3. عند انتهاء Manus نزّل `woa-product-images.zip` وفك الضغط.
4. من الداشبورد: **المنتجات → 🖼️ ربط صور تلقائياً → 📁 اختيار مجلد** واختر مجلد `images`.
   - الأسماء مثل `WOA-0001.jpg` تُربط تلقائياً بالمنتج صاحب الكود 1.
   - الصور تُصغَّر وتُحوَّل إلى WebP وتُرفع وتظهر في المتجر مباشرة.
5. راجع ملف `report.csv` و`not_found.csv` وكرّر العملية للمنتجات الناقصة (القائمة تُنزَّل من نفس النافذة: «قائمة المنتجات بلا صور»).

> تنبيه حقوق: الصور من الإنترنت قد تكون محمية بحقوق نشر. فضّل صور الشركة المصنّعة/الموزّع، وراجع عمود `source_page_url` قبل النشر.

---

## البرومبت (انسخه كاملاً)

```text
ROLE
You are a meticulous product-data researcher. Your job is to find one correct, clean product photo for each item of an Egyptian furniture & kitchen hardware catalog ("World of Accessories": hinges, handles, drawer slides, hydraulic arms, kitchen/dressing storage, fasteners, profiles, locks, legs/wheels, LED/smart items).

INPUT
Attached file: products-for-images.csv with columns:
id, file_name_base, name_ar, name_en, category_ar, category_en, brand_hint, has_image
- Process only rows where has_image = "no".
- name_ar is the SOURCE OF TRUTH. name_en is machine-translated and often garbled (mixed Arabic/English fragments) - use it only as a hint.
- brand_hint lists brands/origins detected in the name (e.g. Summit, Palma, COPRA, SIS, Hi-Tech, Ocean, Turkish, Egyptian).

TASK
For every product, find ONE photo of that exact kind of item and save it as images/<file_name_base>.jpg (example: images/WOA-0001.jpg).

HOW TO MATCH (do this for every product)
1. Parse the Arabic name into attributes: item type, brand/origin, mechanism (سوفت كلوز, هيدروليك, تاتش/كبس, تاندم, ...), size/dimensions (cm, mm, number of arms/فرع), color/finish (أسود, أبيض, رصاصي, فضي, ذهبي, كروم, ستانلس ...), material and quantity/pack.
2. Search in Arabic AND English (e.g. "مفصلة ساميت سوفت كلوز" + "Summit soft close hinge"). Use the brand name when present.
3. Prefer sources in this order: (a) the manufacturer/brand official site or catalog, (b) authorized distributors / hardware catalogs, (c) large marketplaces (Alibaba, AliExpress, Amazon, Noon, Jumia, Egyptian hardware shops), (d) anything else.
4. Open the page and look at the image. Accept it only if item type AND color/finish AND size/mechanism visibly match the Arabic name.
5. If the exact variant (e.g. black 80 cm) is unavailable but the same product exists in another color/size, you may use it ONLY with confidence = "medium" and say what differs in notes.
6. If you cannot verify a match, do NOT guess and do NOT use an unrelated product: put the row in not_found.csv.

IMAGE QUALITY RULES
- One product per image, centered, clean white/neutral/transparent-to-white background (studio style). No people, hands, rooms or lifestyle scenes.
- No watermarks, no store logos/banners, no promotional text, no price stickers, no collage of several different products.
- At least 600x600 px (prefer 1000+). Square or near-square after trimming; if not square, pad with white, never stretch.
- Save as JPG (quality ~85), max edge 1600 px, under 800 KB.
- File name must be EXACTLY the file_name_base followed by .jpg (e.g. WOA-0123.jpg). Nothing else in the name.

WORKFLOW
- Work in batches of 25 products. After each batch append to report.csv and keep going; do not stop until all rows are processed.
- Every 150 products, publish a partial woa-product-images-partN.zip so progress is not lost.
- If the same generic item appears in several sizes and no size-specific photo exists, you may reuse the best matching photo for those rows with confidence = "medium" and set shared_with in the notes.
- Respect site terms and robots rules; do not log in anywhere or bypass paywalls; do not use sites that require accounts.

DELIVERABLES (final ZIP: woa-product-images.zip)
1. images/ - the JPG files named WOA-XXXX.jpg
2. report.csv with columns:
   id, file_name, source_page_url, image_url, source_type (manufacturer|distributor|marketplace|other), confidence (high|medium), matched_attributes, notes
3. not_found.csv with columns: id, file_name_base, name_ar, reason, what_you_tried
4. summary.txt: totals (processed / found high / found medium / not found), most common sources, and any systematic problems.

CONSTRAINTS
- Do not rename or edit product names, do not change prices, do not invent products.
- Never include an image you could not visually verify.
- Quality over quantity: a smaller set of correct images is better than a complete set with wrong ones.
```
