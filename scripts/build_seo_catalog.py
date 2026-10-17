"""
World of Accessories - Comprehensive SEO & Catalog Integration Script
Generates 588 Product Pages, 10 Category Pages, WebP Images, Schema.org JSON-LD, Sitemap & Robots.txt.
"""

import os
import sys
import csv
import json
import shutil
import html
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = r"c:\Users\yasse\Documents\Catalogue"
ASSETS_DIR = os.path.join(ROOT_DIR, "assets", "woa-product-images")
LANDING_DIR = os.path.join(ROOT_DIR, "apps", "landing")
LIVE_DOMAIN = "https://ha-woa.vercel.app"
MARKET_DOMAIN = "https://woa-market.vercel.app"
PHONE = "01140030036"
WHATSAPP = "201140030036"

# Category Slug Mapping
CAT_MAP = {
    "المفصلات": "hinges",
    "المقابض والمسكات": "handles-knobs",
    "أنظمة الأدراج وسكك الحركة": "drawer-slides",
    "الأذرع والميكانيزمات الهيدروليكية": "hydraulic-arms",
    "المسامير والمثبتات ومواد اللصق": "fasteners-adhesives",
    "الوزرات والبروفيلات والتهوية": "profiles-plinths-vents",
    "إكسسوارات المطبخ والدريسنج": "kitchen-dressing-storage",
    "الأقفال والكوالين وأصابع التاتش": "locks-latches-push",
    "الأرجل والعجلات والكوابيل": "legs-wheels-brackets",
    "الإضاءة الذكية والأنظمة الخاصة": "smart-tech-lighting"
}

CAT_ICONS = {
    "hinges": "🔧",
    "handles-knobs": "🚪",
    "drawer-slides": "📦",
    "hydraulic-arms": "💪",
    "fasteners-adhesives": "🔩",
    "profiles-plinths-vents": "✨",
    "kitchen-dressing-storage": "🍽️",
    "locks-latches-push": "🔐",
    "legs-wheels-brackets": "🛠️",
    "smart-tech-lighting": "💡"
}

print("1. Loading raw data...")
report_path = os.path.join(ASSETS_DIR, "report.csv")
with open(report_path, "r", encoding="utf-8-sig") as f:
    report = list(csv.DictReader(f))

cats_path = os.path.join(ASSETS_DIR, "categories-content.json")
with open(cats_path, "r", encoding="utf-8") as f:
    categories_content = json.load(f)

# Load prices from market data
market_products_path = os.path.join(ROOT_DIR, "apps", "market", "data", "products.json")
price_map = {}
if os.path.exists(market_products_path):
    with open(market_products_path, "r", encoding="utf-8") as f:
        m_prods = json.load(f)
        for p in m_prods:
            price_map[int(p["id"])] = str(p.get("price", "")).strip()

print(f"Loaded {len(report)} products and {len(categories_content)} categories.")
print(f"Loaded {len(price_map)} price records.")

# 2. Image Processing (Convert to WebP & Copy JPG)
print("2. Converting images to WebP...")
src_images_dir = os.path.join(ASSETS_DIR, "seo-images")
dest_images_landing = os.path.join(LANDING_DIR, "seo-images")
dest_images_root = os.path.join(ROOT_DIR, "seo-images")
os.makedirs(dest_images_landing, exist_ok=True)
os.makedirs(dest_images_root, exist_ok=True)

converted_count = 0
for r in report:
    slug = r["slug"]
    src_jpg = os.path.join(src_images_dir, f"{slug}.jpg")
    dest_webp_landing = os.path.join(dest_images_landing, f"{slug}.webp")
    dest_jpg_landing = os.path.join(dest_images_landing, f"{slug}.jpg")
    dest_webp_root = os.path.join(dest_images_root, f"{slug}.webp")
    dest_jpg_root = os.path.join(dest_images_root, f"{slug}.jpg")

    if os.path.exists(src_jpg):
        # Copy JPG if not already there or different
        if not os.path.exists(dest_jpg_landing):
            shutil.copy2(src_jpg, dest_jpg_landing)
        if not os.path.exists(dest_jpg_root):
            shutil.copy2(src_jpg, dest_jpg_root)
        
        # Convert to WebP if missing
        if not os.path.exists(dest_webp_landing):
            try:
                with Image.open(src_jpg) as img:
                    img.save(dest_webp_landing, "WEBP", quality=85, method=4)
                    shutil.copy2(dest_webp_landing, dest_webp_root)
                converted_count += 1
            except Exception as e:
                print(f"Error converting {slug}.jpg: {e}")

print(f"WebP conversion complete ({converted_count} new WebP created, all 588 synced).")

# Global CSS and Styles for SEO pages
SHARED_HEAD_STYLES = """
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #1A3F7F;
            --primary-dark: #0F2752;
            --accent: #FF8C3D;
            --accent-hover: #E67628;
            --bg: #F8FAFC;
            --card-bg: #FFFFFF;
            --text-main: #0F172A;
            --text-muted: #64748B;
            --border: #E2E8F0;
            --font-ar: 'Tajawal', sans-serif;
            --font-en: 'Comfortaa', sans-serif;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: var(--font-ar);
            direction: rtl;
            text-align: right;
            background-color: var(--bg);
            color: var(--text-main);
            line-height: 1.6;
        }
        a { color: inherit; text-decoration: none; }
        .site-header {
            background: #FFFFFF;
            border-bottom: 1px solid var(--border);
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.03);
        }
        .header-inner {
            max-width: 1240px;
            margin: 0 auto;
            padding: 12px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .brand-logo-wrap {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .brand-logo-wrap img {
            height: 48px;
            width: auto;
        }
        .brand-text h1, .brand-text span {
            font-size: 18px;
            font-weight: 800;
            color: var(--primary);
            display: block;
            line-height: 1.2;
        }
        .brand-text small {
            font-family: var(--font-en);
            font-size: 11px;
            color: var(--text-muted);
        }
        .nav-links {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        .nav-link {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-main);
            padding: 6px 12px;
            border-radius: 6px;
            transition: all 0.2s;
        }
        .nav-link:hover {
            color: var(--accent);
            background: #FFF7ED;
        }
        .nav-btn-market {
            background: var(--primary);
            color: #FFFFFF !important;
            padding: 8px 16px;
            border-radius: 8px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: background 0.2s;
        }
        .nav-btn-market:hover {
            background: var(--primary-dark);
        }
        .container {
            max-width: 1240px;
            margin: 0 auto;
            padding: 24px 20px 60px;
        }
        .breadcrumbs {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: var(--text-muted);
            margin-bottom: 24px;
            flex-wrap: wrap;
        }
        .breadcrumbs a { color: var(--primary); font-weight: 600; }
        .breadcrumbs a:hover { text-decoration: underline; }
        .breadcrumb-sep { font-size: 11px; opacity: 0.6; }
        
        /* Product Layout */
        .product-grid {
            display: grid;
            grid-template-columns: 1fr 1.15fr;
            gap: 40px;
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 32px;
            margin-bottom: 40px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        }
        .gallery-box {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .main-img-wrap {
            background: #FAFAFA;
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            aspect-ratio: 1;
            overflow: hidden;
        }
        .main-img-wrap img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            transition: transform 0.3s ease;
        }
        .main-img-wrap:hover img {
            transform: scale(1.05);
        }
        .trust-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-top: 8px;
        }
        .trust-card {
            background: #F8FAFC;
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 10px 8px;
            text-align: center;
            font-size: 11px;
            font-weight: 600;
            color: var(--primary);
        }
        .trust-card .t-icon {
            font-size: 18px;
            display: block;
            margin-bottom: 4px;
        }
        
        .product-info {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .cat-tag {
            align-self: flex-start;
            background: #EEF2FF;
            color: var(--primary);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
        }
        .product-sku {
            font-family: var(--font-en);
            font-size: 13px;
            font-weight: 700;
            color: var(--text-muted);
        }
        .product-title {
            font-size: 26px;
            font-weight: 900;
            color: var(--primary-dark);
            line-height: 1.3;
        }
        .product-en-title {
            font-family: var(--font-en);
            font-size: 14px;
            color: var(--text-muted);
            margin-top: -6px;
        }
        .price-badge-wrap {
            display: flex;
            align-items: baseline;
            gap: 8px;
            background: #FFF7ED;
            border: 1px solid #FFEDD5;
            padding: 12px 18px;
            border-radius: 10px;
            width: fit-content;
        }
        .price-val {
            font-size: 28px;
            font-weight: 900;
            color: var(--accent);
        }
        .price-curr {
            font-size: 14px;
            font-weight: 700;
            color: var(--accent);
        }
        .price-tax {
            font-size: 12px;
            color: var(--text-muted);
        }
        .actions-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 10px;
        }
        .btn-wa-order {
            background: #25D366;
            color: #FFFFFF !important;
            padding: 14px 24px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);
            transition: all 0.2s;
        }
        .btn-wa-order:hover {
            background: #20BD5A;
            transform: translateY(-2px);
        }
        .btn-phone-call {
            background: #FFFFFF;
            border: 2px solid var(--primary);
            color: var(--primary);
            padding: 12px 24px;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.2s;
        }
        .btn-phone-call:hover {
            background: #F0F4FF;
        }
        
        .section-desc {
            margin-top: 12px;
            border-top: 1px solid var(--border);
            padding-top: 18px;
        }
        .section-desc h3 {
            font-size: 17px;
            font-weight: 800;
            color: var(--primary);
            margin-bottom: 10px;
        }
        .section-desc p {
            color: #334155;
            font-size: 14px;
            line-height: 1.8;
        }
        
        /* Specs Table */
        .specs-box {
            background: #F8FAFC;
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 20px;
            margin-top: 16px;
        }
        .specs-table {
            width: 100%;
            border-collapse: collapse;
        }
        .specs-table tr {
            border-bottom: 1px solid #E2E8F0;
        }
        .specs-table tr:last-child {
            border-bottom: none;
        }
        .specs-table td {
            padding: 10px 12px;
            font-size: 13px;
        }
        .specs-table .sp-label {
            width: 35%;
            font-weight: 700;
            color: var(--text-muted);
            background: #F1F5F9;
            border-radius: 4px;
        }
        .specs-table .sp-value {
            color: var(--text-main);
            font-weight: 600;
        }
        .spec-source-note {
            font-size: 11px;
            color: var(--text-muted);
            margin-top: 10px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        /* Related Products */
        .related-section {
            margin-top: 50px;
        }
        .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
        }
        .section-header h2 {
            font-size: 22px;
            font-weight: 900;
            color: var(--primary-dark);
        }
        .card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 20px;
        }
        .card-product {
            background: #FFFFFF;
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: all 0.2s;
        }
        .card-product:hover {
            transform: translateY(-4px);
            border-color: var(--accent);
            box-shadow: 0 10px 25px rgba(0,0,0,0.06);
        }
        .card-img-wrap {
            aspect-ratio: 1;
            background: #FAFAFA;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 12px;
            margin-bottom: 12px;
            overflow: hidden;
        }
        .card-img-wrap img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        .card-sku {
            font-family: var(--font-en);
            font-size: 11px;
            color: var(--text-muted);
            font-weight: 700;
        }
        .card-title {
            font-size: 14px;
            font-weight: 800;
            color: var(--text-main);
            margin: 6px 0;
            line-height: 1.4;
            min-height: 40px;
        }
        .card-price {
            font-size: 18px;
            font-weight: 900;
            color: var(--accent);
            margin: 8px 0;
        }
        .card-btn {
            background: #F1F5F9;
            color: var(--primary);
            text-align: center;
            padding: 8px 12px;
            border-radius: 6px;
            font-weight: 700;
            font-size: 13px;
            transition: all 0.2s;
        }
        .card-product:hover .card-btn {
            background: var(--primary);
            color: #FFFFFF;
        }
        
        /* Category Page Elements */
        .cat-hero {
            background: linear-gradient(135deg, #0F2752 0%, #1A3F7F 100%);
            color: #FFFFFF;
            border-radius: 16px;
            padding: 40px 32px;
            margin-bottom: 32px;
            position: relative;
            overflow: hidden;
        }
        .cat-hero h1 {
            font-size: 32px;
            font-weight: 900;
            margin-bottom: 12px;
            line-height: 1.3;
        }
        .cat-hero-badge {
            display: inline-block;
            background: rgba(255, 140, 61, 0.25);
            border: 1px solid var(--accent);
            color: #FFD5B2;
            padding: 4px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 16px;
        }
        .cat-body-text {
            background: #FFFFFF;
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 32px;
            margin-bottom: 40px;
            font-size: 15px;
            line-height: 1.9;
            color: #334155;
        }
        .cat-body-text h2 {
            font-size: 20px;
            color: var(--primary);
            margin: 20px 0 10px;
        }
        .cat-body-text p {
            margin-bottom: 14px;
        }
        
        .faq-section {
            background: #FFFFFF;
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 32px;
            margin-top: 40px;
        }
        .faq-section h2 {
            font-size: 22px;
            font-weight: 900;
            color: var(--primary);
            margin-bottom: 20px;
        }
        .faq-item {
            border: 1px solid var(--border);
            border-radius: 10px;
            margin-bottom: 14px;
            overflow: hidden;
        }
        .faq-question {
            background: #F8FAFC;
            padding: 16px 20px;
            font-weight: 800;
            font-size: 15px;
            color: var(--primary-dark);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .faq-answer {
            padding: 16px 20px;
            font-size: 14px;
            color: #334155;
            line-height: 1.7;
            background: #FFFFFF;
            border-top: 1px solid var(--border);
        }
        
        /* Footer */
        .site-footer {
            background: #0F172A;
            color: #94A3B8;
            padding: 50px 20px 24px;
            margin-top: 60px;
            border-top: 1px solid #1E293B;
        }
        .footer-inner {
            max-width: 1240px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            gap: 40px;
        }
        .footer-col h4 {
            color: #FFFFFF;
            font-size: 16px;
            font-weight: 800;
            margin-bottom: 16px;
        }
        .footer-col p {
            font-size: 13px;
            line-height: 1.8;
            margin-bottom: 16px;
        }
        .footer-links {
            list-style: none;
        }
        .footer-links li {
            margin-bottom: 10px;
        }
        .footer-links a {
            color: #94A3B8;
            font-size: 13px;
            transition: color 0.2s;
        }
        .footer-links a:hover {
            color: var(--accent);
        }
        .footer-bottom {
            max-width: 1240px;
            margin: 40px auto 0;
            padding-top: 20px;
            border-top: 1px solid #1E293B;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            flex-wrap: wrap;
            gap: 12px;
        }

        @media (max-width: 900px) {
            .product-grid { grid-template-columns: 1fr; padding: 20px; gap: 24px; }
            .header-inner { flex-direction: column; gap: 12px; align-items: flex-start; }
            .nav-links { width: 100%; justify-content: space-between; flex-wrap: wrap; }
            .footer-inner { grid-template-columns: 1fr; gap: 30px; }
            .cat-hero { padding: 24px 20px; }
            .cat-hero h1 { font-size: 24px; }
            .trust-grid { grid-template-columns: 1fr; }
        }
    </style>
"""

NAV_HTML = f"""
    <header class="site-header">
        <div class="header-inner">
            <a href="/" class="brand-logo-wrap">
                <img src="/Branding/logo-150.png" alt="World of Accessories" width="150" height="48">
                <div class="brand-text">
                    <h1>عالم الإكسسوارات</h1>
                    <small>WORLD OF ACCESSORIES</small>
                </div>
            </a>
            <nav class="nav-links">
                <a href="/" class="nav-link">الرئيسية</a>
                <a href="/categories" class="nav-link">الأقسام</a>
                <a href="/about.html" class="nav-link">عن الشركة</a>
                <a href="{MARKET_DOMAIN}" target="_blank" rel="noopener" class="nav-btn-market">
                    🛒 تصفح المتجر الرقمي
                </a>
            </nav>
        </div>
    </header>
"""

FOOTER_HTML = f"""
    <footer class="site-footer">
        <div class="footer-inner">
            <div class="footer-col">
                <h4>عالم الإكسسوارات • World of Accessories</h4>
                <p>الرائدون في إكسسوارات ومفصلات ومقابض الأثاث والمطابخ الفاخرة في مصر. توريد مباشر، أسعار رسمية معتمدة، ودعم فني متخصص لتلبية احتياجات المصانع والورش والعملاء.</p>
                <p>📍 مدينة 6 أكتوبر – المحور المركزي – بجوار ميدان النجدة – داخل سيلا مول</p>
            </div>
            <div class="footer-col">
                <h4>روابط سريعة</h4>
                <ul class="footer-links">
                    <li><a href="/">الرئيسية</a></li>
                    <li><a href="/categories">كافة الأقسام</a></li>
                    <li><a href="{MARKET_DOMAIN}">المتجر الرقمي والطلب</a></li>
                    <li><a href="/about.html">المعرض والتواصل</a></li>
                    <li><a href="https://wa.me/{WHATSAPP}">خدمة العملاء (واتساب)</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>خدمة العملاء والتوريد</h4>
                <p>📞 هاتف: <a href="tel:{PHONE}" style="color:#FFF;">{PHONE}</a></p>
                <p>💬 واتساب: <a href="https://wa.me/{WHATSAPP}" style="color:#25D366;">{WHATSAPP}</a></p>
                <p>⏰ مواعيد العمل: يومياً من 10 صباحاً حتى 10 مساءً</p>
                <p>🚚 الشحن والتوصيل: لجميع محافظات جمهورية مصر العربية</p>
            </div>
        </div>
        <div class="footer-bottom">
            <div>جميع الحقوق محفوظة &copy; 2026 عالم الإكسسوارات</div>
            <div>World of Accessories Official Catalog</div>
        </div>
    </footer>
"""

# Map products by category
products_by_cat = {}
for r in report:
    cat = r["category_ar"]
    if cat not in products_by_cat:
        products_by_cat[cat] = []
    products_by_cat[cat].append(r)

# 3. Generate 10 Category Pages
print("3. Generating 10 Category Pages...")
os.makedirs(os.path.join(LANDING_DIR, "category"), exist_ok=True)

for cat_obj in categories_content:
    cat_slug = cat_obj["slug"]
    cat_title = cat_obj["title"]
    cat_meta = cat_obj["meta"]
    cat_body = cat_obj["body"]
    cat_body_en = cat_obj.get("body_en", "")
    cat_faqs = cat_obj.get("faqs", [])
    cat_kw = cat_obj.get("kw", "")
    
    # Find matching category_ar name
    cat_ar_name = ""
    for ar_name, s in CAT_MAP.items():
        if s == cat_slug:
            cat_ar_name = ar_name
            break
            
    cat_products = products_by_cat.get(cat_ar_name, [])
    cat_icon = CAT_ICONS.get(cat_slug, "📦")
    
    # Build FAQ Schema
    faq_schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": []
    }
    for q, a in cat_faqs:
        faq_schema["mainEntity"].append({
            "@type": "Question",
            "name": q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": a
            }
        })
        
    breadcrumb_schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "الرئيسية",
                "item": f"{LIVE_DOMAIN}/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "الأقسام",
                "item": f"{LIVE_DOMAIN}/categories"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": cat_title,
                "item": f"{LIVE_DOMAIN}/category/{cat_slug}"
            }
        ]
    }
    
    # FAQ HTML
    faqs_html = ""
    for q, a in cat_faqs:
        faqs_html += f"""
        <div class="faq-item">
            <div class="faq-question"><span>❓ {html.escape(q)}</span></div>
            <div class="faq-answer">{html.escape(a)}</div>
        </div>
        """
        
    # Product Cards Grid HTML
    prod_cards_html = ""
    for p in cat_products:
        p_id = int(p["id"])
        p_slug = p["slug"]
        p_name = p["name_ar"]
        p_price = price_map.get(p_id, "")
        p_price_display = f"{p_price} ج.م" if p_price and p_price != "0" else "طلب تسعير"
        p_alt = p["alt_text_ar"]
        
        prod_cards_html += f"""
        <div class="card-product">
            <div>
                <a href="/product/{p_slug}" class="card-img-wrap">
                    <picture>
                        <source srcset="/seo-images/{p_slug}.webp" type="image/webp">
                        <img src="/seo-images/{p_slug}.jpg" alt="{html.escape(p_alt)}" loading="lazy" width="300" height="300">
                    </picture>
                </a>
                <div class="card-sku">WOA-{p_id:04d}</div>
                <h3 class="card-title"><a href="/product/{p_slug}">{html.escape(p_name)}</a></h3>
            </div>
            <div>
                <div class="card-price">{p_price_display}</div>
                <a href="/product/{p_slug}" class="card-btn">عرض المواصفات والطلب ←</a>
            </div>
        </div>
        """
        
    cat_page_html = f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{html.escape(cat_title)} | عالم الإكسسوارات</title>
    <meta name="description" content="{html.escape(cat_meta)}">
    <link rel="canonical" href="{LIVE_DOMAIN}/category/{cat_slug}">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <meta property="og:title" content="{html.escape(cat_title)}">
    <meta property="og:description" content="{html.escape(cat_meta)}">
    <meta property="og:url" content="{LIVE_DOMAIN}/category/{cat_slug}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    {SHARED_HEAD_STYLES}
    <script type="application/ld+json">
    {json.dumps(breadcrumb_schema, ensure_ascii=False, indent=2)}
    </script>
    <script type="application/ld+json">
    {json.dumps(faq_schema, ensure_ascii=False, indent=2)}
    </script>
</head>
<body>
    {NAV_HTML}
    
    <main class="container">
        <nav class="breadcrumbs" aria-label="مسار التنقل">
            <a href="/">الرئيسية</a>
            <span class="breadcrumb-sep">/</span>
            <a href="/categories">الأقسام</a>
            <span class="breadcrumb-sep">/</span>
            <span>{html.escape(cat_title)}</span>
        </nav>
        
        <header class="cat-hero">
            <span class="cat-hero-badge">{cat_icon} {html.escape(cat_kw)} • {len(cat_products)} منتج معتمد</span>
            <h1>{html.escape(cat_title)}</h1>
        </header>
        
        <article class="cat-body-text">
            <h2>دليل ومواصفات {html.escape(cat_ar_name)}</h2>
            <p>{html.escape(cat_body).replace(chr(10), '</p><p>')}</p>
            {f'<details style="margin-top:20px; background:#F8FAFC; padding:12px; border-radius:8px;"><summary style="cursor:pointer; font-weight:700; color:var(--primary);">Technical Overview (English)</summary><p style="margin-top:8px; font-family:var(--font-en); font-size:13px;">{html.escape(cat_body_en)}</p></details>' if cat_body_en else ''}
        </article>
        
        <section class="products-section">
            <div class="section-header">
                <h2>منتجات قسم {html.escape(cat_ar_name)} ({len(cat_products)} منتج)</h2>
            </div>
            <div class="card-grid">
                {prod_cards_html}
            </div>
        </section>
        
        <section class="faq-section">
            <h2>الأسئلة الشائعة حول {html.escape(cat_ar_name)}</h2>
            {faqs_html}
        </section>
    </main>
    
    {FOOTER_HTML}
</body>
</html>"""
    
    # Write category.html and category/slug/index.html
    cat_file_html = os.path.join(LANDING_DIR, "category", f"{cat_slug}.html")
    with open(cat_file_html, "w", encoding="utf-8") as f:
        f.write(cat_page_html)
        
    cat_dir_index = os.path.join(LANDING_DIR, "category", cat_slug)
    os.makedirs(cat_dir_index, exist_ok=True)
    with open(os.path.join(cat_dir_index, "index.html"), "w", encoding="utf-8") as f:
        f.write(cat_page_html)

print("10 Category Pages created successfully.")

# 4. Generate All Categories Page (/categories)
print("4. Generating All Categories Page (/categories)...")
cats_grid_html = ""
for cat_obj in categories_content:
    cat_slug = cat_obj["slug"]
    cat_title = cat_obj["title"]
    cat_meta = cat_obj["meta"]
    cat_ar_name = ""
    for ar_name, s in CAT_MAP.items():
        if s == cat_slug:
            cat_ar_name = ar_name
            break
    cat_products = products_by_cat.get(cat_ar_name, [])
    cat_icon = CAT_ICONS.get(cat_slug, "📦")
    
    cats_grid_html += f"""
    <div class="card-product" style="padding:24px;">
        <div>
            <div style="font-size:36px; margin-bottom:12px;">{cat_icon}</div>
            <h3 style="font-size:18px; font-weight:800; color:var(--primary); margin-bottom:8px;">
                <a href="/category/{cat_slug}">{html.escape(cat_ar_name)}</a>
            </h3>
            <p style="font-size:13px; color:var(--text-muted); line-height:1.6; margin-bottom:16px;">
                {html.escape(cat_meta)}
            </p>
        </div>
        <div>
            <div style="font-size:12px; font-weight:700; color:var(--accent); margin-bottom:10px;">
                {len(cat_products)} منتج متوفر
            </div>
            <a href="/category/{cat_slug}" class="card-btn" style="display:block;">تصفح القسم ←</a>
        </div>
    </div>
    """

all_cats_html = f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>أقسام الكتالوج الرسمي | عالم الإكسسوارات</title>
    <meta name="description" content="تصفح كافة أقسام إكسسوارات الأثاث والمطابخ: مفصلات، سكك أدراج، أذرع هيدروليك، مقابض، أرفف وسلات ومثبتات من كبرى الماركات العالمية.">
    <link rel="canonical" href="{LIVE_DOMAIN}/categories">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    {SHARED_HEAD_STYLES}
</head>
<body>
    {NAV_HTML}
    <main class="container">
        <nav class="breadcrumbs">
            <a href="/">الرئيسية</a>
            <span class="breadcrumb-sep">/</span>
            <span>كافة الأقسام</span>
        </nav>
        <header class="cat-hero">
            <span class="cat-hero-badge">10 أقسام رئيسية • 588 منتج معتمد</span>
            <h1>كتالوج أقسام وتصنيفات إكسسوارات الأثاث والمطابخ</h1>
            <p style="margin-top:8px; opacity:0.9;">نوفر تشكيلة هندسية متكاملة للمصانع والورش والمهندسين وأصحاب المنازل بأسعار رسمية وتوريد مباشر.</p>
        </header>
        <div class="card-grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
            {cats_grid_html}
        </div>
    </main>
    {FOOTER_HTML}
</body>
</html>"""

with open(os.path.join(LANDING_DIR, "categories.html"), "w", encoding="utf-8") as f:
    f.write(all_cats_html)
os.makedirs(os.path.join(LANDING_DIR, "categories"), exist_ok=True)
with open(os.path.join(LANDING_DIR, "categories", "index.html"), "w", encoding="utf-8") as f:
    f.write(all_cats_html)

# 5. Generate 588 Product Pages
print("5. Generating 588 Product Pages...")
os.makedirs(os.path.join(LANDING_DIR, "product"), exist_ok=True)

# Helper to parse datasheet_ar into key-value pairs
def parse_datasheet(text):
    pairs = []
    if not text:
        return pairs
    # split by Arabic semicolon or standard semicolon
    parts = [p.strip() for p in text.replace(";", "؛").split("؛") if p.strip()]
    for p in parts:
        if ":" in p or "：" in p:
            colon = ":" if ":" in p else "："
            k, v = p.split(colon, 1)
            pairs.append((k.strip(), v.strip()))
        else:
            pairs.append(("مواصفات", p))
    return pairs

for idx, r in enumerate(report):
    p_id = int(r["id"])
    slug = r["slug"]
    name_ar = r["name_ar"]
    cat_ar = r["category_ar"]
    cat_slug = CAT_MAP.get(cat_ar, "hinges")
    
    seo_title_ar = r["seo_title_ar"]
    seo_title_en = r["seo_title_en"]
    meta_desc_ar = r["meta_desc_ar"]
    meta_desc_en = r["meta_desc_en"]
    alt_text_ar = r["alt_text_ar"]
    seo_desc_ar = r["seo_desc_ar"]
    datasheet_ar = r["datasheet_ar"]
    spec_source = r.get("spec_source", "catalog attributes")
    
    price = price_map.get(p_id, "")
    has_price = bool(price and price != "0")
    price_display = f"{price} ج.م" if has_price else "طلب عرض سعر"
    
    # Specs table rows
    specs_pairs = parse_datasheet(datasheet_ar)
    specs_rows_html = ""
    for k, v in specs_pairs:
        specs_rows_html += f"""
        <tr>
            <td class="sp-label">{html.escape(k)}</td>
            <td class="sp-value">{html.escape(v)}</td>
        </tr>
        """
    if not specs_rows_html:
        specs_rows_html = f"""
        <tr>
            <td class="sp-label">الفئة</td>
            <td class="sp-value">{html.escape(cat_ar)}</td>
        </tr>
        <tr>
            <td class="sp-label">كود المنتج</td>
            <td class="sp-value">WOA-{p_id:04d}</td>
        </tr>
        """
        
    spec_source_text = "بيانات مواصفات رسمية من المصنع" if "official" in spec_source else "مواصفات مستخلصة من سمات الكتالوج الرسمية"
    
    # Breadcrumbs Schema
    p_breadcrumb_schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "الرئيسية",
                "item": f"{LIVE_DOMAIN}/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": cat_ar,
                "item": f"{LIVE_DOMAIN}/category/{cat_slug}"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": name_ar,
                "item": f"{LIVE_DOMAIN}/product/{slug}"
            }
        ]
    }
    
    # Product Schema
    p_schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": seo_title_ar,
        "alternateName": seo_title_en,
        "image": f"{LIVE_DOMAIN}/seo-images/{slug}.webp",
        "description": seo_desc_ar,
        "sku": f"WOA-{p_id:04d}",
        "category": cat_ar,
        "brand": {
            "@type": "Brand",
            "name": "World of Accessories"
        },
        "url": f"{LIVE_DOMAIN}/product/{slug}"
    }
    if has_price:
        p_schema["offers"] = {
            "@type": "Offer",
            "price": price,
            "priceCurrency": "EGP",
            "availability": "https://schema.org/InStock",
            "url": f"{LIVE_DOMAIN}/product/{slug}"
        }
        
    # Related products (4 products from same category)
    rel_products = [p for p in products_by_cat.get(cat_ar, []) if int(p["id"]) != p_id][:4]
    rel_html = ""
    for rp in rel_products:
        rp_id = int(rp["id"])
        rp_slug = rp["slug"]
        rp_name = rp["name_ar"]
        rp_price = price_map.get(rp_id, "")
        rp_price_display = f"{rp_price} ج.م" if rp_price and rp_price != "0" else "طلب تسعير"
        rel_html += f"""
        <div class="card-product">
            <div>
                <a href="/product/{rp_slug}" class="card-img-wrap">
                    <picture>
                        <source srcset="/seo-images/{rp_slug}.webp" type="image/webp">
                        <img src="/seo-images/{rp_slug}.jpg" alt="{html.escape(rp['alt_text_ar'])}" loading="lazy" width="200" height="200">
                    </picture>
                </a>
                <div class="card-sku">WOA-{rp_id:04d}</div>
                <h4 class="card-title"><a href="/product/{rp_slug}">{html.escape(rp_name)}</a></h4>
            </div>
            <div>
                <div class="card-price">{rp_price_display}</div>
                <a href="/product/{rp_slug}" class="card-btn">عرض التفاصيل ←</a>
            </div>
        </div>
        """
        
    wa_message = f"مرحباً، أود الاستفسار والطلب لكود WOA-{p_id:04d} ({name_ar}) - رابط المنتج: {LIVE_DOMAIN}/product/{slug}"
    wa_encoded = html.escape(wa_message).replace(" ", "%20")
    
    product_page_html = f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{html.escape(seo_title_ar)} | عالم الإكسسوارات</title>
    <meta name="description" content="{html.escape(meta_desc_ar)}">
    <link rel="canonical" href="{LIVE_DOMAIN}/product/{slug}">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <meta property="og:title" content="{html.escape(seo_title_ar)}">
    <meta property="og:description" content="{html.escape(meta_desc_ar)}">
    <meta property="og:image" content="{LIVE_DOMAIN}/seo-images/{slug}.webp">
    <meta property="og:url" content="{LIVE_DOMAIN}/product/{slug}">
    <meta property="og:type" content="product">
    <meta name="twitter:card" content="summary_large_image">
    {SHARED_HEAD_STYLES}
    <script type="application/ld+json">
    {json.dumps(p_breadcrumb_schema, ensure_ascii=False, indent=2)}
    </script>
    <script type="application/ld+json">
    {json.dumps(p_schema, ensure_ascii=False, indent=2)}
    </script>
</head>
<body>
    {NAV_HTML}
    
    <main class="container">
        <nav class="breadcrumbs" aria-label="مسار التنقل">
            <a href="/">الرئيسية</a>
            <span class="breadcrumb-sep">/</span>
            <a href="/category/{cat_slug}">{html.escape(cat_ar)}</a>
            <span class="breadcrumb-sep">/</span>
            <span>{html.escape(name_ar)}</span>
        </nav>
        
        <div class="product-grid">
            <!-- Gallery Column -->
            <div class="gallery-box">
                <div class="main-img-wrap">
                    <picture>
                        <source srcset="/seo-images/{slug}.webp" type="image/webp">
                        <img src="/seo-images/{slug}.jpg" alt="{html.escape(alt_text_ar)}" width="600" height="600">
                    </picture>
                </div>
                <div class="trust-grid">
                    <div class="trust-card">
                        <span class="t-icon">🚚</span>
                        توصيل لكافة المحافظات
                    </div>
                    <div class="trust-card">
                        <span class="t-icon">🛡️</span>
                        منتج أصلي معتمد
                    </div>
                    <div class="trust-card">
                        <span class="t-icon">💬</span>
                        دعم فني واستشارة
                    </div>
                </div>
            </div>
            
            <!-- Details Column -->
            <div class="product-info">
                <div>
                    <a href="/category/{cat_slug}" class="cat-tag">{html.escape(cat_ar)}</a>
                    <div class="product-sku" style="margin-top: 8px;">كود الصنف: WOA-{p_id:04d}</div>
                </div>
                
                <h1 class="product-title">{html.escape(seo_title_ar)}</h1>
                <div class="product-en-title">{html.escape(seo_title_en)}</div>
                
                <div class="price-badge-wrap">
                    <span class="price-val">{price_display}</span>
                    {f'<span class="price-tax">شامل ضريبة القيمة المضافة</span>' if has_price else ''}
                </div>
                
                <div class="actions-group">
                    <a href="https://wa.me/{WHATSAPP}?text={wa_encoded}" target="_blank" rel="noopener" class="btn-wa-order">
                        💬 طلب فوري واستفسار عبر واتساب
                    </a>
                    <a href="tel:{PHONE}" class="btn-phone-call">
                        📞 اتصال هاتفي بالمعرض ({PHONE})
                    </a>
                </div>
                
                <div class="section-desc">
                    <h3>الوصف والتفاصيل</h3>
                    <p>{html.escape(seo_desc_ar)}</p>
                </div>
                
                <div class="specs-box">
                    <h3 style="font-size:16px; font-weight:800; color:var(--primary); margin-bottom:12px;">جدول المواصفات الفنية</h3>
                    <table class="specs-table">
                        <tbody>
                            {specs_rows_html}
                        </tbody>
                    </table>
                    <div class="spec-source-note">
                        ℹ️ <span>{spec_source_text}</span>
                    </div>
                </div>
            </div>
        </div>
        
        {f'''
        <section class="related-section">
            <div class="section-header">
                <h2>منتجات ذات صلة من قسم {html.escape(cat_ar)}</h2>
                <a href="/category/{cat_slug}" style="color:var(--primary); font-weight:700;">عرض المزيد من القسم ←</a>
            </div>
            <div class="card-grid">
                {rel_html}
            </div>
        </section>
        ''' if rel_html else ''}
    </main>
    
    {FOOTER_HTML}
</body>
</html>"""

    # Write product.html and product/slug/index.html
    p_file_html = os.path.join(LANDING_DIR, "product", f"{slug}.html")
    with open(p_file_html, "w", encoding="utf-8") as f:
        f.write(product_page_html)
        
    p_dir_index = os.path.join(LANDING_DIR, "product", slug)
    os.makedirs(p_dir_index, exist_ok=True)
    with open(os.path.join(p_dir_index, "index.html"), "w", encoding="utf-8") as f:
        f.write(product_page_html)

print("588 Product Pages created successfully.")

# 6. Update product-schema.jsonld
print("6. Updating product-schema.jsonld...")
schema_src_path = os.path.join(ASSETS_DIR, "product-schema.jsonld")
with open(schema_src_path, "r", encoding="utf-8") as f:
    schema_data = json.load(f)

for item in schema_data.get("@graph", []):
    sku_code = item.get("sku", "")
    try:
        pid = int(sku_code.replace("WOA-", ""))
    except:
        pid = 0
    # Update url
    old_url = item.get("url", "")
    item["url"] = old_url.replace("https://www.example.com", LIVE_DOMAIN)
    # Update image to webp
    old_img = item.get("image", "")
    img_name = os.path.basename(old_img).replace(".jpg", ".webp")
    item["image"] = f"{LIVE_DOMAIN}/seo-images/{img_name}"
    # Add real price offer if available
    real_price = price_map.get(pid)
    if real_price and real_price != "0":
        item["offers"] = {
            "@type": "Offer",
            "price": real_price,
            "priceCurrency": "EGP",
            "availability": "https://schema.org/InStock",
            "url": item["url"]
        }

schema_dest_landing = os.path.join(LANDING_DIR, "product-schema.jsonld")
schema_dest_root = os.path.join(ROOT_DIR, "product-schema.jsonld")
with open(schema_dest_landing, "w", encoding="utf-8") as f:
    json.dump(schema_data, f, ensure_ascii=False, indent=2)
with open(schema_dest_root, "w", encoding="utf-8") as f:
    json.dump(schema_data, f, ensure_ascii=False, indent=2)
print("product-schema.jsonld updated with live domain, webp images and real offers.")

# 7. Update sitemap.xml and robots.txt
print("7. Updating sitemap.xml & robots.txt...")
sitemap_src = os.path.join(ASSETS_DIR, "sitemap.xml")
with open(sitemap_src, "r", encoding="utf-8") as f:
    sitemap_content = f.read()

sitemap_content = sitemap_content.replace("https://www.example.com", LIVE_DOMAIN)
with open(os.path.join(LANDING_DIR, "sitemap.xml"), "w", encoding="utf-8") as f:
    f.write(sitemap_content)
with open(os.path.join(ROOT_DIR, "sitemap.xml"), "w", encoding="utf-8") as f:
    f.write(sitemap_content)

robots_txt = f"""User-agent: *
Allow: /
Disallow: /admin
Disallow: /cart
Disallow: /checkout

Sitemap: {LIVE_DOMAIN}/sitemap.xml
"""
with open(os.path.join(LANDING_DIR, "robots.txt"), "w", encoding="utf-8") as f:
    f.write(robots_txt)
with open(os.path.join(ROOT_DIR, "robots.txt"), "w", encoding="utf-8") as f:
    f.write(robots_txt)
print("sitemap.xml and robots.txt written to apps/landing and root.")

print("All tasks completed successfully!")
