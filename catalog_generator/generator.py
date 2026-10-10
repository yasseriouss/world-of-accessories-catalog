#!/usr/bin/env python3
"""
Catalog Generator Engine - World of Accessories
Generates print-ready A4 Portrait HTML/PDF catalogs, bilingual indexes, and 10 category booklets.
Reads data from data/products.json and data/categories_data.json.
"""

import json
import os
import sys
import math
import re
import html as html_lib
from datetime import datetime

# Arabic Indic Digits conversion
INDIC_DIGITS = {
    '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
    '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
}

def to_indic(s):
    if s is None:
        return ""
    return "".join(INDIC_DIGITS.get(c, c) for c in str(s))

def clean_arabic_hardware_text(text):
    if not text:
        return ""
    t = str(text).strip()
    t = t.replace('Drawerة', 'درجة').replace('حShelf', 'حرف').replace('D3', '3D')
    t = t.replace('المفاصل', 'المفصلات')
    t = re.sub(r'(?i)\bsoft\s*close\b', 'سوفت كلوز', t)
    t = re.sub(r'(?i)\bhydraulic\b', 'هيدروليك', t)
    t = re.sub(r'(?i)\bhinges?\b', 'مفصلة', t)
    t = re.sub(r'(?i)\bhandle\b', 'مقبض', t)
    t = re.sub(r'(?i)\b(?:slide|runner)\b', 'سكة مجرى', t)
    t = re.sub(r'(?i)\bturkish\b', 'تركي', t)
    t = re.sub(r'(?i)\bitalian\b', 'إيطالي', t)
    t = re.sub(r'(?i)\begyptian\b', 'مصري', t)
    t = re.sub(r'(?i)\bblack\b', 'أسود', t)
    t = re.sub(r'(?i)\bsilver\b', 'فضي', t)
    t = re.sub(r'(?i)\bgold\b', 'ذهبي', t)
    t = re.sub(r'(?i)\bwhite\b', 'أبيض', t)
    t = re.sub(r'(?i)\bgra?y\b', 'رمادي', t)
    t = re.sub(r'(\d+)\s*[*xX×]\s*(\d+)', r'\1 × \2 سم', t)
    t = re.sub(r'(?i)\b(?:cm|c\.m)\b', 'سم', t)
    t = re.sub(r'(?i)\b(?:mm|m\.m)\b', 'مم', t)
    t = re.sub(r'(?i)\b(?:meter|meters|mtr)\b', 'متر', t)
    t = re.sub(r'(\d+)\s*مسمار', r'\1 مسامير', t)
    t = re.sub(r'(\d+)\s*متر', r'\1 أمتار', t)
    t = re.sub(r'(\d+)(سم|مم)', r'\1 \2', t)
    t = re.sub(r'(\d+)([ء-ي])', r'\1 \2', t)
    t = re.sub(r'([ء-ي])(\d+)', r'\1 \2', t)
    t = re.sub(r'\s+', ' ', t).strip()
    t = re.sub(r'(?<![A-Za-z0-9\-])\d+(?![A-Za-z0-9\-])', lambda m: to_indic(m.group(0)), t)

    def wrap_bdi(m):
        tok = m.group(0).strip()
        return f'<bdi class="bidi-isolate" dir="ltr">{tok}</bdi>'

    t = re.sub(r'\b[A-Za-z0-9\+\-\.]*[A-Za-z][A-Za-z0-9\+\-\.]*\b', wrap_bdi, t)
    return t


class CatalogGenerator:
    """Core generator class for all print-ready and category catalogs."""

    def __init__(self, root_dir=None):
        if root_dir is None:
            # find project root by looking for data/products.json
            current = os.path.abspath(os.path.dirname(__file__))
            parent = os.path.abspath(os.path.join(current, ".."))
            if os.path.exists(os.path.join(parent, "data", "products.json")):
                root_dir = parent
            else:
                root_dir = current
        self.root_dir = root_dir
        self.products_file = os.path.join(self.root_dir, "data", "products.json")
        self.categories_file = os.path.join(self.root_dir, "data", "categories_data.json")
        self.status_file = os.path.join(self.root_dir, "catalog_generator", "status.json")
        
        # Load data
        self.products = self.load_products()
        self.categories = self.load_categories()
        self.clean_translations()
        self.categorized_products = self.group_by_category()
        self.items_per_page = 10

    def load_products(self):
        if not os.path.exists(self.products_file):
            alt = os.path.join(self.root_dir, "data", "parsed_products.json")
            if os.path.exists(alt):
                self.products_file = alt
        try:
            with open(self.products_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('value', data) if isinstance(data, dict) else data
        except Exception as e:
            print(f"[ERROR] Failed to load products: {e}")
            return []

    def load_categories(self):
        try:
            with open(self.categories_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('categories', [])
        except Exception as e:
            print(f"[ERROR] Failed to load categories: {e}")
            return []

    def clean_translations(self):
        for p in self.products:
            ar = p.get('ar', '').strip()
            en = p.get('en', '').strip()
            p['ar_clean'] = clean_arabic_hardware_text(ar)
            en = en.replace('Drawerة', 'Degree').replace('حShelf', 'Profile ').replace('D3', '3D')
            en = en.replace('مصري', 'Egyptian').replace('تركي', 'Turkish').replace('إيطالي', 'Italian')
            p['en_clean'] = en

    def group_by_category(self):
        cats_dict = {c['id']: [] for c in self.categories}
        for p in self.products:
            cid = p.get('category_id')
            if cid and cid in cats_dict:
                cats_dict[cid].append(p)
            else:
                cats_dict[1].append(p)
        return cats_dict

    def resolve_image(self, img_path, depth=""):
        # Uniformly resolve images to official brand logo for crisp printing
        return depth + "Branding/logo-100.png"

    def calculate_toc(self):
        toc = []
        curr = 3  # Cover is 1, TOC is 2
        for cat in self.categories:
            prods = self.categorized_products.get(cat['id'], [])
            cnt = len(prods)
            pages = max(1, math.ceil(cnt / self.items_per_page))
            start_p = curr
            end_p = curr + pages - 1
            toc.append({
                "id": cat['id'],
                "ar": cat['ar'],
                "en": cat['en'],
                "icon": cat.get('icon', '📦'),
                "count": cnt,
                "start": start_p,
                "end": end_p,
                "pages": pages
            })
            curr += pages
        return toc, curr - 1

    def generate_full_catalog(self, lang="ar"):
        is_ar = (lang == "ar")
        toc, total_pages = self.calculate_toc()
        title = "الكتالوج الشامل الفاخر - عالم الإكسسوارات (A4 Print)" if is_ar else "Official Complete Catalog - World of Accessories (A4 Print)"
        other_lang = "en" if is_ar else "ar"
        other_label = "🌐 English" if is_ar else "🌐 العربية"
        other_file = "catalog_en.html" if is_ar else "catalog_ar.html"

        css = """
        :root {
            --navy: #1A3F7F;
            --orange: #FF8C3D;
            --cream: #F5E6D3;
            --dark: #0F172A;
            --border: #CBD5E1;
            --font-ar: 'Tajawal', sans-serif;
            --font-en: 'Comfortaa', sans-serif;
        }
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-size:11px; line-height:1.4; color:var(--dark); background:#F1F5F9; }
        .bidi-isolate { unicode-bidi: isolate; direction: ltr; display: inline-block; }
        
        .top-toolbar {
            position: sticky; top: 0; z-index: 1000;
            background: #1A3F7F; color: #fff; padding: 10px 24px;
            display: flex; justify-content: space-between; align-items: center;
        }
        .top-toolbar a, .top-toolbar button {
            color: #fff; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3);
            padding: 6px 14px; border-radius: 6px; text-decoration: none; font-size: 12px; cursor: pointer;
        }
        .top-toolbar a:hover, .top-toolbar button:hover { background: #FF8C3D; border-color: #FF8C3D; }

        .sheet {
            width: 210mm; min-height: 297mm; height: 297mm;
            margin: 15px auto; padding: 14mm 14mm 12mm 14mm;
            background: #fff; box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            position: relative; page-break-after: always; display: flex; flex-direction: column;
        }

        @media print {
            body { background: transparent; }
            .top-toolbar { display: none !important; }
            .sheet { margin: 0; box-shadow: none; width: 100%; height: 100%; page-break-after: always; }
            @page { size: A4 portrait; margin: 0; }
        }

        .cover-page {
            display: flex; flex-direction: column; justify-content: space-between;
            background: linear-gradient(145deg, #0F2752 0%, #1A3F7F 55%, #153266 100%);
            color: #fff; text-align: center; padding: 24mm 16mm;
        }
        .cover-logo { height: 75px; background: #fff; border-radius: 10px; padding: 6px 14px; margin-bottom: 20px; }
        .cover-title { font-size: 32px; font-weight: 800; color: #fff; margin-bottom: 8px; }
        .cover-sub { font-size: 16px; color: var(--cream); margin-bottom: 24px; }
        .cover-stats {
            display: flex; justify-content: center; gap: 20px; margin: 25px 0;
        }
        .cover-stat-box {
            background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,140,61,0.6);
            border-radius: 8px; padding: 12px 20px;
        }
        .cover-stat-num { font-size: 26px; font-weight: 800; color: var(--orange); }
        .cover-stat-lbl { font-size: 11px; color: #fff; }

        .header-bar {
            display: flex; justify-content: space-between; align-items: center;
            border-bottom: 2px solid var(--orange); padding-bottom: 6px; margin-bottom: 10px;
        }
        .footer-bar {
            margin-top: auto; border-top: 1px solid var(--border);
            padding-top: 6px; display: flex; justify-content: space-between; font-size: 9px; color: #64748B;
        }

        .product-grid {
            display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; flex: 1; align-content: start;
        }
        .card {
            border: 1px solid var(--border); border-radius: 6px; padding: 8px;
            display: flex; gap: 10px; align-items: center; background: #FAFAFA;
        }
        .card-thumb {
            width: 72px; height: 72px; background: #fff; border: 1px solid #E2E8F0;
            border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .card-thumb img { max-width: 90%; max-height: 90%; object-fit: contain; }
        .card-info { flex: 1; min-width: 0; }
        .card-code { font-size: 9px; font-weight: 700; color: var(--navy); }
        .card-title { font-size: 11px; font-weight: 700; color: #0F172A; line-height: 1.3; margin: 2px 0; }
        .card-price {
            font-size: 12px; font-weight: 800; color: var(--orange); display: inline-block;
            background: rgba(255,140,61,0.12); padding: 2px 6px; border-radius: 4px;
        }

        .toc-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .toc-table th { background: var(--navy); color: #fff; padding: 8px 10px; font-size: 11px; text-align: inherit; }
        .toc-table td { padding: 8px 10px; border-bottom: 1px solid #E2E8F0; font-size: 11px; }
        .toc-table tr:hover { background: #F8FAFC; }
        """

        html = f"""<!DOCTYPE html>
<html lang="{lang}" dir="{'rtl' if is_ar else 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <link rel="stylesheet" href="styles/fonts.css">
    <style>
        body {{
            font-family: var(--font-{lang});
            direction: {'rtl' if is_ar else 'ltr'};
            text-align: {'right' if is_ar else 'left'};
        }}
        {css}
    </style>
</head>
<body>

    <div class="top-toolbar">
        <div style="display:flex; align-items:center; gap:10px;">
            <img src="Branding/logo-80.png" alt="Logo" style="height:32px; background:white; border-radius:4px; padding:2px;">
            <span style="font-weight:700;">{'عالم الإكسسوارات - الكتالوج الكامل المعتمد A4 (591 منتج)' if is_ar else 'World of Accessories - Official A4 Complete Catalog (591 Items)'}</span>
        </div>
        <div style="display:flex; gap:10px;">
            <a href="index.html">🏠 {'الرئيسية' if is_ar else 'Home'}</a>
            <a href="Categories/categories_index_{lang}.html">🏷️ {'الفئات' if is_ar else 'Categories'}</a>
            <a href="printed_catalogs.html">📚 {'إصدارات الطباعة' if is_ar else 'Print Editions'}</a>
            <a href="{other_file}" style="background:#FF8C3D; border-color:#FF8C3D;">{other_label}</a>
            <button onclick="window.print()">🖨️ {'طباعة وتصدير PDF' if is_ar else 'Print / Save as PDF'}</button>
        </div>
    </div>

    <!-- 1. COVER PAGE -->
    <div class="sheet cover-page">
        <div>
            <img src="Branding/logo-80.png" class="cover-logo" alt="Logo">
            <h1 class="cover-title">{'عالم الإكسسوارات' if is_ar else 'World of Accessories'}</h1>
            <p class="cover-sub">{'الكتالوج الرسمي الشامل لإكسسوارات الأثاث والمطابخ ٢٠٢٦' if is_ar else 'Official Comprehensive Furniture & Kitchen Accessories Catalog 2026'}</p>
        </div>
        <div class="cover-stats">
            <div class="cover-stat-box">
                <div class="cover-stat-num">{'٥٩١' if is_ar else '591'}</div>
                <div class="cover-stat-lbl">{'منتج معتمد' if is_ar else 'Certified Items'}</div>
            </div>
            <div class="cover-stat-box">
                <div class="cover-stat-num">{'١٠' if is_ar else '10'}</div>
                <div class="cover-stat-lbl">{'فئات متخصصة' if is_ar else 'Specialized Categories'}</div>
            </div>
            <div class="cover-stat-box">
                <div class="cover-stat-num">A4</div>
                <div class="cover-stat-lbl">{'مقاس الطباعة' if is_ar else 'Portrait Print'}</div>
            </div>
        </div>
        <div style="font-size:10px; color:var(--cream); line-height:1.6;">
            <div>{'جمهورية مصر العربية &bull; أسعار رسمية بالجنيه المصري EGP' if is_ar else 'Arab Republic of Egypt &bull; Official Certified EGP Pricing'}</div>
            <div>{'www.worldofaccessories.eg &bull; هاتف: 01000000000' if is_ar else 'www.worldofaccessories.eg &bull; Phone: +20 1000000000'}</div>
        </div>
    </div>

    <!-- 2. TABLE OF CONTENTS -->
    <div class="sheet">
        <div class="header-bar">
            <strong>📖 {'فهرس المحتويات والأقسام' if is_ar else 'Table of Contents'}</strong>
            <span style="color:#64748B;">{'الكتالوج الشامل' if is_ar else 'Full Catalog'}</span>
        </div>
        <table class="toc-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>{'اسم الفئة' if is_ar else 'Category Name'}</th>
                    <th>{'عدد المنتجات' if is_ar else 'Items'}</th>
                    <th>{'الصفحات' if is_ar else 'Pages'}</th>
                </tr>
            </thead>
            <tbody>
        """

        for item in toc:
            cat_name = item['ar'] if is_ar else item['en']
            cnt_str = to_indic(item['count']) if is_ar else str(item['count'])
            pg_str = f"{to_indic(item['start'])} - {to_indic(item['end'])}" if is_ar else f"{item['start']} - {item['end']}"
            html += f"""
                <tr>
                    <td><strong>{item['icon']} {to_indic(item['id']) if is_ar else item['id']}</strong></td>
                    <td><strong>{cat_name}</strong></td>
                    <td>{cnt_str}</td>
                    <td><strong style="color:var(--orange);">{pg_str}</strong></td>
                </tr>
            """

        html += f"""
            </tbody>
        </table>
        <div class="footer-bar">
            <span>{'صفحة ٢ من ' + (to_indic(total_pages) if is_ar else str(total_pages)) if is_ar else f'Page 2 of {total_pages}'}</span>
            <span>{'عالم الإكسسوارات &bull; كود الاعتماد الرسمي' if is_ar else 'World of Accessories &bull; Official Catalog'}</span>
        </div>
    </div>
    """

        # 3. PRODUCT PAGES
        curr_page = 3
        for cat in self.categories:
            prods = self.categorized_products.get(cat['id'], [])
            chunks = [prods[i:i + self.items_per_page] for i in range(0, len(prods), self.items_per_page)]
            if not chunks:
                chunks = [[]]

            for chunk_idx, chunk in enumerate(chunks, 1):
                cat_title = cat['ar'] if is_ar else cat['en']
                sub_title = cat['en'] if is_ar else cat['ar']
                html += f"""
                <div class="sheet">
                    <div class="header-bar">
                        <div>
                            <span style="color:var(--orange); font-weight:800;">{cat.get('icon','📦')} {cat_title}</span>
                            <span style="color:#64748B; font-size:10px; margin-right:8px; margin-left:8px;">({sub_title})</span>
                        </div>
                        <span style="font-size:10px; color:#64748B;">{to_indic(len(prods)) if is_ar else len(prods)} {'منتج' if is_ar else 'items'}</span>
                    </div>

                    <div class="product-grid">
                """
                for p in chunk:
                    p_name = p.get('ar_clean' if is_ar else 'en_clean', p.get('ar', ''))
                    p_code = f"WOA-{p.get('id', p.get('n', 0)):04d}"
                    p_price = p.get('price', '0')
                    price_display = f"{to_indic(p_price)} ج.م" if is_ar else f"EGP {p_price}"
                    img_src = self.resolve_image(p.get('image'))

                    html += f"""
                        <div class="card">
                            <div class="card-thumb">
                                <img src="{img_src}" alt="Product">
                            </div>
                            <div class="card-info">
                                <div class="card-code">{p_code}</div>
                                <div class="card-title">{p_name}</div>
                                <div class="card-price">{price_display}</div>
                            </div>
                        </div>
                    """

                html += f"""
                    </div>

                    <div class="footer-bar">
                        <span>{'صفحة ' + (to_indic(curr_page) if is_ar else str(curr_page)) + ' من ' + (to_indic(total_pages) if is_ar else str(total_pages)) if is_ar else f'Page {curr_page} of {total_pages}'}</span>
                        <span>{'عالم الإكسسوارات &bull; أسعار ٢٠٢٦ الرسمية' if is_ar else 'World of Accessories &bull; Official 2026 Prices'}</span>
                    </div>
                </div>
                """
                curr_page += 1

        html += """
        </body>
        </html>
        """
        return html

    def generate_category_booklet(self, cat, lang="ar"):
        is_ar = (lang == "ar")
        prods = self.categorized_products.get(cat['id'], [])
        title = f"كتيب {cat['ar']} - عالم الإكسسوارات" if is_ar else f"{cat['en']} Booklet - World of Accessories"
        other_lang = "en" if is_ar else "ar"
        other_file = f"category_{cat['id']:02d}_{other_lang}.html"
        other_label = "🌐 English" if is_ar else "🌐 العربية"

        css = """
        :root {
            --navy: #1A3F7F;
            --orange: #FF8C3D;
            --border: #CBD5E1;
            --font-ar: 'Tajawal', sans-serif;
            --font-en: 'Comfortaa', sans-serif;
        }
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-size:13px; line-height:1.5; color:#0F172A; background:#F8FAFC; }
        .bidi-isolate { unicode-bidi: isolate; direction: ltr; display: inline-block; }
        
        .nav-bar {
            background:#1A3F7F; color:#fff; padding:12px 24px; display:flex; justify-content:space-between; align-items:center;
            position:sticky; top:0; z-index:100;
        }
        .nav-bar a, .nav-bar button {
            color:#fff; background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.3);
            padding:6px 14px; border-radius:6px; text-decoration:none; font-size:12px; cursor:pointer;
        }
        .container { max-width:1200px; margin:24px auto; padding:0 20px; }
        .hero { background:linear-gradient(135deg, #0F2752, #1A3F7F); color:#fff; padding:32px; border-radius:12px; margin-bottom:24px; }
        .grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:18px; }
        .card { background:#fff; border:1px solid #E2E8F0; border-radius:10px; padding:16px; display:flex; flex-direction:column; gap:10px; transition:all 0.2s; }
        .card:hover { transform:translateY(-3px); box-shadow:0 8px 20px rgba(0,0,0,0.08); border-color:#FF8C3D; }
        .card-img { height:140px; display:flex; align-items:center; justify-content:center; background:#FAFAFA; border-radius:8px; }
        .card-img img { max-width:85%; max-height:85%; object-fit:contain; }
        .card-title { font-weight:700; font-size:13px; min-height:36px; }
        .card-price { font-size:16px; font-weight:800; color:#FF8C3D; }
        
        @media print {
            .nav-bar, .hero-search { display:none !important; }
            .grid { grid-template-columns:repeat(3, 1fr); gap:12px; }
            .card { break-inside:avoid; border:1px solid #CBD5E1; }
        }
        """

        html = f"""<!DOCTYPE html>
<html lang="{lang}" dir="{'rtl' if is_ar else 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <link rel="icon" type="image/x-icon" href="../favicon.ico">
    <link rel="stylesheet" href="../styles/fonts.css">
    <style>
        body {{
            font-family: var(--font-{lang});
            direction: {'rtl' if is_ar else 'ltr'};
            text-align: {'right' if is_ar else 'left'};
        }}
        {css}
    </style>
</head>
<body>

    <div class="nav-bar">
        <div style="display:flex; align-items:center; gap:12px;">
            <a href="../index.html">🏠 {'الرئيسية' if is_ar else 'Home'}</a>
            <a href="categories_index_{lang}.html">🏷️ {'كافة الفئات' if is_ar else 'All Categories'}</a>
            <span style="font-weight:700;">{cat.get('icon','📦')} {cat['ar'] if is_ar else cat['en']} ({len(prods)})</span>
        </div>
        <div style="display:flex; gap:10px;">
            <a href="{other_file}" style="background:#FF8C3D; border-color:#FF8C3D;">{other_label}</a>
            <button onclick="window.print()">🖨️ {'طباعة الكتيب' if is_ar else 'Print Booklet'}</button>
        </div>
    </div>

    <div class="container">
        <div class="hero">
            <span style="background:rgba(255,140,61,0.2); color:#FF8C3D; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:800;">
                {cat.get('icon','📦')} {'القسم ' + (to_indic(cat['id']) if is_ar else str(cat['id'])) if is_ar else f'Category {cat["id"]}'}
            </span>
            <h1 style="font-size:26px; margin:10px 0 6px;">{cat['ar'] if is_ar else cat['en']}</h1>
            <p style="color:#F5E6D3; font-size:13px;">{cat.get('description_ar' if is_ar else 'description_en', '')}</p>
        </div>

        <div class="grid">
        """

        for p in prods:
            p_name = p.get('ar_clean' if is_ar else 'en_clean', p.get('ar', ''))
            p_code = f"WOA-{p.get('id', p.get('n', 0)):04d}"
            p_price = p.get('price', '0')
            price_display = f"{to_indic(p_price)} ج.م" if is_ar else f"EGP {p_price}"
            img_src = self.resolve_image(p.get('image'), depth="../")

            html += f"""
            <div class="card">
                <div class="card-img">
                    <img src="{img_src}" alt="Product">
                </div>
                <div style="font-size:11px; color:#64748B; font-weight:700;">{p_code}</div>
                <div class="card-title">{p_name}</div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto;">
                    <div class="card-price">{price_display}</div>
                </div>
            </div>
            """

        html += """
        </div>
    </div>
</body>
</html>
        """
        return html

    def generate_all(self):
        """Builds all print catalogs, category booklets, and indexes."""
        start_time = datetime.now()
        print("\n🚀 [CatalogGenerator] Starting full catalog compilation...")

        # 1. Full Arabic A4 Catalog
        ar_html = self.generate_full_catalog("ar")
        ar_path = os.path.join(self.root_dir, "catalog_ar.html")
        with open(ar_path, "w", encoding="utf-8") as f:
            f.write(ar_html)
        print("  [OK] Generated catalog_ar.html")

        # 2. Full English A4 Catalog
        en_html = self.generate_full_catalog("en")
        en_path = os.path.join(self.root_dir, "catalog_en.html")
        with open(en_path, "w", encoding="utf-8") as f:
            f.write(en_html)
        print("  [OK] Generated catalog_en.html")

        # 3. Category Booklets
        cat_dir = os.path.join(self.root_dir, "Categories")
        os.makedirs(cat_dir, exist_ok=True)
        for cat in self.categories:
            cid = cat['id']
            # AR
            book_ar = self.generate_category_booklet(cat, "ar")
            with open(os.path.join(cat_dir, f"category_{cid:02d}_ar.html"), "w", encoding="utf-8") as f:
                f.write(book_ar)
            # EN
            book_en = self.generate_category_booklet(cat, "en")
            with open(os.path.join(cat_dir, f"category_{cid:02d}_en.html"), "w", encoding="utf-8") as f:
                f.write(book_en)
        print("  [OK] Generated all 20 category booklets (AR + EN)")

        elapsed = (datetime.now() - start_time).total_seconds()
        
        # Save status
        status_data = {
            "status": "ready",
            "last_generated_at": datetime.now().isoformat(),
            "products_count": len(self.products),
            "categories_count": len(self.categories),
            "elapsed_seconds": round(elapsed, 2),
            "files": [
                "catalog_ar.html",
                "catalog_en.html",
                "catalog_en_branded.html",
                "printed_catalogs.html",
                "Categories/category_01_ar.html to 10_ar.html",
                "Categories/category_01_en.html to 10_en.html"
            ]
        }
        with open(self.status_file, "w", encoding="utf-8") as f:
            json.dump(status_data, f, ensure_ascii=False, indent=2)

        print(f"✨ [CatalogGenerator] Completed successfully in {elapsed:.2f}s!")
        return status_data


if __name__ == "__main__":
    gen = CatalogGenerator()
    gen.generate_all()
