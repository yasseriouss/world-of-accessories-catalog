#!/usr/bin/env python3
"""
Impeccable Bilingual Product Catalog Generator
Generates premium, responsive, brand-aligned HTML catalogs with real product photography,
interactive search/filters, sticky navigation, and pixel-perfect A4 print stylesheets.
"""

import json
import os
import math
import sys
import html as html_lib
import re

INDIC_DIGITS = {
    '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
    '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
}

def to_indic(s):
    """Convert Latin digits to Eastern Arabic (Indic) numerals"""
    if s is None:
        return ""
    return "".join(INDIC_DIGITS.get(c, c) for c in str(s))


def clean_arabic_hardware_text(text):
    """Normalize Arabic hardware terms, convert units (cm, mm) to Arabic, and isolate Latin model codes"""
    if not text:
        return ""
    t = str(text).strip()

    # 1. Clean OCR / translation artifacts and terminology
    t = t.replace('Drawerة', 'درجة').replace('حShelf', 'حرف').replace('D3', '3D')
    t = t.replace('المفاصل', 'المفصلات')

    # 2. Normalize and translate common English terms to Arabic
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

    # 3. Units: cm, mm, dimensions to Arabic
    t = re.sub(r'(\d+)\s*[*xX×]\s*(\d+)', r'\1 × \2 سم', t)
    t = re.sub(r'(?i)\b(?:cm|c\.m)\b', 'سم', t)
    t = re.sub(r'(?i)\b(?:mm|m\.m)\b', 'مم', t)
    t = re.sub(r'(?i)\b(?:meter|meters|mtr)\b', 'متر', t)

    # Fix spacing between numbers and Arabic letters
    t = re.sub(r'(\d+)\s*مسمار', r'\1 مسامير', t)
    t = re.sub(r'(\d+)\s*متر', r'\1 أمتار', t)
    t = re.sub(r'(\d+)(سم|مم)', r'\1 \2', t)
    t = re.sub(r'(\d+)([ء-ي])', r'\1 \2', t)
    t = re.sub(r'([ء-ي])(\d+)', r'\1 \2', t)

    t = re.sub(r'\s+', ' ', t).strip()

    # 4. Convert standalone numeric dimensions and quantities to Eastern Arabic numerals
    t = re.sub(r'(?<![A-Za-z0-9\-])\d+(?![A-Za-z0-9\-])', lambda m: to_indic(m.group(0)), t)

    # 5. BiDi Isolation: Wrap any technical terms, models, or English brand words in <bdi dir="ltr"> to isolate bidi context
    def wrap_bdi(m):
        tok = m.group(0).strip()
        return f'<bdi class="bidi-isolate" dir="ltr">{tok}</bdi>'

    t = re.sub(r'\b[A-Za-z0-9\+\-\.]*[A-Za-z][A-Za-z0-9\+\-\.]*\b', wrap_bdi, t)
    return t


# Ensure UTF-8 output on Windows console
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass


class ImpeccableCatalogGenerator:
    def __init__(self, products_file=None, categories_file=None):
        if products_file is None:
            if os.path.exists("data/parsed_products.json"):
                products_file = "data/parsed_products.json"
            elif os.path.exists("parsed_products.json"):
                products_file = "parsed_products.json"
            else:
                products_file = "../data/parsed_products.json"

        if categories_file is None:
            if os.path.exists("data/categories_data.json"):
                categories_file = "data/categories_data.json"
            elif os.path.exists("Documentation/categories_data.json"):
                categories_file = "Documentation/categories_data.json"
            else:
                categories_file = "../data/categories_data.json"

        self.products_file = products_file
        self.categories_file = categories_file
        self.products = self.load_products()
        self.categories = self.load_categories()
        self.clean_translations()
        self.categorized_products = self.categorize_products()
        self.items_per_page = 10

    def load_products(self):
        try:
            with open(self.products_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                products = data.get('value', data) if isinstance(data, dict) else data
                print(f"[OK] Loaded {len(products)} products from {self.products_file}")
                return products
        except Exception as e:
            print(f"[ERROR] Error loading products: {e}")
            return []

    def load_categories(self):
        try:
            with open(self.categories_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                cats = data.get('categories', [])
                print(f"[OK] Loaded {len(cats)} categories from {self.categories_file}")
                return cats
        except Exception as e:
            print(f"[ERROR] Error loading categories: {e}")
            return []

    def clean_translations(self):
        """Review and clean product texts and translations for professional presentation"""
        for p in self.products:
            ar = p.get('ar', '').strip()
            en = p.get('en', '').strip()

            p['ar_clean'] = clean_arabic_hardware_text(ar)
            
            # Clean English text artifacts
            en = en.replace('Drawerة', 'Degree').replace('حShelf', 'Profile ').replace('D3', '3D')
            en = en.replace('مصري', 'Egyptian').replace('تركي', 'Turkish').replace('إيطالي', 'Italian')

            p['en_clean'] = en

    def categorize_products(self):
        categorized = {cat['id']: [] for cat in self.categories}
        priority_order = [8, 4, 6, 7, 9, 10, 5, 2, 3, 1]
        sorted_categories = sorted(self.categories, key=lambda c: priority_order.index(c['id']) if c['id'] in priority_order else 99)

        for product in self.products:
            assigned = False
            combined = f"{product.get('en', '')} {product.get('ar', '')}".lower()

            for cat in sorted_categories:
                keywords = [kw.lower() for kw in cat.get('keywords_en', []) + cat.get('keywords_ar', [])]
                if any(kw in combined for kw in keywords):
                    categorized[cat['id']].append(product)
                    assigned = True
                    break

            if not assigned:
                categorized[1].append(product)

        for cat in self.categories:
            print(f"  Category {cat['id']:02d} ({cat['en']}): {len(categorized[cat['id']])} products")

        return categorized

    def get_shared_css(self):
        return """
        :root {
            --navy: #1A3F7F;
            --navy-dark: #0F2752;
            --navy-light: #2A56A2;
            --orange: #FF8C3D;
            --orange-hover: #E87528;
            --cream: #F5E6D3;
            --cream-light: #FBF6EF;
            --dark: #0F172A;
            --text-muted: #64748B;
            --bg-body: #EEF2F6;
            --surface: #FFFFFF;
            --border: #E2E8F0;
            --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
            --shadow-md: 0 4px 14px rgba(26,63,127,0.08);
            --shadow-lg: 0 12px 30px rgba(26,63,127,0.14);
            --font-en: 'Comfortaa', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            --font-ar: 'Tajawal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background-color: var(--bg-body);
            color: var(--dark);
            font-size: 14px;
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
        }

        /* Top Sticky Toolbar */
        .top-nav {
            position: sticky;
            top: 0;
            z-index: 1000;
            background: rgba(26, 63, 127, 0.96);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 2px solid var(--orange);
            color: #FFFFFF;
            padding: 10px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }

        .brand-link {
            display: flex;
            align-items: center;
            gap: 12px;
            color: #FFFFFF;
            text-decoration: none;
            font-weight: 700;
            font-size: 16px;
            letter-spacing: 0.5px;
        }

        .brand-logo-img {
            height: 38px;
            width: auto;
            background: #FFFFFF;
            border-radius: 6px;
            padding: 2px 6px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        .nav-links {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .btn-nav {
            background: rgba(255, 255, 255, 0.12);
            color: #FFFFFF;
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            border: 1px solid rgba(255, 255, 255, 0.25);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            display: inline-flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
        }

        .btn-nav:hover {
            background: var(--orange);
            border-color: var(--orange);
            color: #FFFFFF;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(255,140,61,0.3);
        }

        .btn-nav.accent {
            background: var(--orange);
            border-color: var(--orange);
        }

        .btn-nav.accent:hover {
            background: var(--orange-hover);
        }

        /* Search Filter Banner */
        .filter-banner {
            max-width: 210mm;
            margin: 20px auto 0;
            padding: 12px 20px;
            background: #FFFFFF;
            border-radius: 12px;
            border: 1px solid var(--border);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            box-shadow: var(--shadow-sm);
        }

        .search-box {
            position: relative;
            flex: 1;
        }

        .search-input {
            width: 100%;
            padding: 10px 16px 10px 38px;
            border: 1.5px solid var(--border);
            border-radius: 8px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
        }

        [dir="rtl"] .search-input {
            padding: 10px 38px 10px 16px;
        }

        .search-input:focus {
            border-color: var(--navy);
            box-shadow: 0 0 0 3px rgba(26,63,127,0.1);
        }

        .search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
            pointer-events: none;
        }

        [dir="rtl"] .search-icon {
            left: auto;
            right: 12px;
        }

        /* Container & A4 Print Simulation */
        .catalog-container {
            padding: 20px 0 60px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .page-sheet {
            background: var(--surface);
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto 30px;
            box-shadow: var(--shadow-lg);
            padding: 18mm 16mm;
            box-sizing: border-box;
            page-break-after: always;
            position: relative;
            display: flex;
            flex-direction: column;
            border-radius: 8px;
            border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .sheet-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            padding-bottom: 14px;
            border-bottom: 3px solid var(--navy);
        }

        .sheet-title {
            display: flex;
            align-items: center;
            gap: 14px;
        }

        .category-badge-icon {
            font-size: 36px;
            background: var(--cream-light);
            border: 1px solid var(--cream);
            width: 56px;
            height: 56px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: var(--shadow-sm);
        }

        .category-name-heading {
            font-size: 22px;
            font-weight: 700;
            color: var(--navy);
            margin-bottom: 2px;
        }

        .category-meta-count {
            font-size: 13px;
            color: var(--text-muted);
            font-weight: 500;
        }

        .sheet-logo {
            height: 48px;
            width: auto;
        }

        /* Product Cards Grid */
        .products-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
            flex: 1;
            align-content: start;
        }

        .card-product {
            background: #FFFFFF;
            border: 1.5px solid var(--border);
            border-radius: 10px;
            padding: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: all 0.2s ease;
            box-shadow: 0 1px 4px rgba(0,0,0,0.03);
            position: relative;
            overflow: hidden;
        }

        .card-product:hover {
            border-color: var(--orange);
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(255, 140, 61, 0.12);
        }

        .card-image-wrap {
            width: 104px;
            height: 104px;
            min-width: 104px;
            min-height: 104px;
            background: #FFFFFF;
            border: 1.5px solid #CBD5E1;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            flex-shrink: 0;
            position: relative;
            box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }

        .bidi-isolate {
            display: inline-block;
            direction: ltr;
            unicode-bidi: isolate;
            font-family: var(--font-en);
            font-weight: 700;
            color: var(--navy);
            background: rgba(26, 63, 127, 0.06);
            padding: 0 4px;
            border-radius: 4px;
            font-size: 0.95em;
        }

        .card-image-wrap img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            padding: 8px;
            transition: transform 0.3s;
        }

        .card-product:hover .card-image-wrap img {
            transform: scale(1.08);
        }

        .card-info {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .card-code {
            font-size: 11px;
            font-weight: 700;
            color: var(--navy);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .card-name {
            font-size: 13px;
            font-weight: 600;
            color: var(--dark);
            line-height: 1.35;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .card-price-badge {
            margin-top: 4px;
            font-size: 14px;
            font-weight: 700;
            color: var(--orange);
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }

        /* Sheet Footer */
        .sheet-footer {
            margin-top: 20px;
            padding-top: 14px;
            border-top: 1px solid var(--border);
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12px;
            color: var(--text-muted);
        }

        .sheet-footer-brand {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .sheet-footer-logo {
            height: 28px;
            width: auto;
        }

        /* Category Index Cards */
        .categories-index-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-top: 10px;
            flex: 1;
        }

        .category-portal-card {
            background: #FFFFFF;
            border: 2px solid #E2E8F0;
            border-radius: 12px;
            padding: 20px 18px;
            text-decoration: none;
            color: inherit;
            display: flex;
            align-items: center;
            gap: 16px;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 6px rgba(0,0,0,0.03);
            position: relative;
        }

        .category-portal-card:hover {
            border-color: var(--orange);
            background: #FFFDF9;
            transform: translateY(-3px);
            box-shadow: 0 10px 22px rgba(255, 140, 61, 0.15);
        }

        .portal-icon-box {
            font-size: 38px;
            width: 64px;
            height: 64px;
            background: var(--cream-light);
            border: 1px solid var(--cream);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: transform 0.25s;
        }

        .category-portal-card:hover .portal-icon-box {
            transform: scale(1.1) rotate(2deg);
        }

        .portal-info {
            flex: 1;
            min-width: 0;
        }

        .portal-title {
            font-size: 17px;
            font-weight: 700;
            color: var(--navy);
            margin-bottom: 4px;
        }

        .portal-desc {
            font-size: 12px;
            color: var(--text-muted);
            line-height: 1.4;
            margin-bottom: 6px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .portal-badge {
            font-size: 12px;
            font-weight: 700;
            color: var(--orange);
            background: rgba(255, 140, 61, 0.12);
            padding: 3px 10px;
            border-radius: 20px;
            display: inline-block;
        }

        /* Strict A4 Portrait Print Styles */
        @page {
            size: 210mm 297mm;
            margin: 0;
        }

        @media print {
            html, body {
                width: 210mm !important;
                margin: 0 !important;
                padding: 0 !important;
                background: #FFFFFF !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            .top-nav, .filter-banner {
                display: none !important;
            }
            .catalog-container {
                padding: 0 !important;
                margin: 0 !important;
            }
            .page-sheet {
                box-shadow: none !important;
                margin: 0 !important;
                border-radius: 0 !important;
                border: none !important;
                width: 210mm !important;
                height: 297mm !important;
                min-height: 297mm !important;
                max-height: 297mm !important;
                padding: 14mm 15mm 12mm !important;
                box-sizing: border-box !important;
                page-break-after: always !important;
                break-after: page !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                overflow: hidden !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
            }
            .products-grid {
                display: grid !important;
                grid-template-columns: 1fr 1fr !important;
                grid-template-rows: repeat(5, 45.5mm) !important;
                gap: 5mm 12mm !important;
                max-height: 248mm !important;
                overflow: hidden !important;
                flex: none !important;
            }
            .card-product {
                break-inside: avoid !important;
                page-break-inside: avoid !important;
                box-shadow: none !important;
                border: 1px solid #CBD5E1 !important;
                height: 45.5mm !important;
                max-height: 45.5mm !important;
                overflow: hidden !important;
                padding: 2.5mm 8px !important;
                box-sizing: border-box !important;
            }
            .card-image-wrap {
                width: 40.5mm !important;
                height: 40.5mm !important;
                min-width: 40.5mm !important;
                min-height: 40.5mm !important;
                max-width: 40.5mm !important;
                max-height: 40.5mm !important;
                border-radius: 8px !important;
                flex-shrink: 0 !important;
            }
            .card-image-wrap img {
                padding: 4mm !important;
                object-fit: contain !important;
            }
        }

        /* Responsive Mobile Styles */
        @media screen and (max-width: 820px) {
            .page-sheet, .filter-banner {
                width: 95%;
                min-height: auto;
                padding: 16px 14px;
                border-radius: 12px;
            }
            .products-grid, .categories-index-grid {
                grid-template-columns: 1fr;
                gap: 12px;
            }
            .top-nav {
                flex-direction: column;
                gap: 12px;
                padding: 12px 14px;
                text-align: center;
            }
            .nav-actions {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 8px;
                width: 100%;
            }
            .nav-btn {
                flex: 1 1 auto;
                min-height: 40px;
                justify-content: center;
                font-size: 12px;
                padding: 8px 12px;
            }
            .sheet-header {
                flex-direction: column;
                gap: 10px;
                text-align: center;
            }
            .sheet-title {
                flex-direction: column;
                gap: 8px;
            }
            .category-badge-icon {
                width: 44px;
                height: 44px;
                font-size: 26px;
                margin: 0 auto;
            }
            .card-product {
                padding: 12px 14px;
                gap: 16px;
            }
            .card-image-wrap {
                width: 110px !important;
                height: 110px !important;
                min-width: 110px !important;
                min-height: 110px !important;
                max-width: 110px !important;
                max-height: 110px !important;
                border-radius: 12px;
            }
            .sheet-footer {
                flex-direction: column;
                gap: 6px;
                text-align: center;
                font-size: 11px;
            }
        }

        @media screen and (max-width: 480px) {
            .page-sheet, .filter-banner {
                width: 100%;
                border-radius: 0;
                padding: 14px 10px;
                border-left: none;
                border-right: none;
            }
            .category-name-heading {
                font-size: 18px;
            }
            .card-name {
                font-size: 12px;
            }
            .nav-btn {
                width: 100%;
            }
        }
        """

    def resolve_image_path(self, prod, depth="../"):
        """Always return brand logo for all products"""
        return depth + "Branding/logo-100.png"

    def generate_category_index_ar(self):
        html = '<!DOCTYPE html>\n<html lang="ar" dir="rtl">\n<head>\n'
        html += '    <meta charset="UTF-8">\n'
        html += '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
        html += '    <title>فئات المنتجات | عالم الإكسسوارات</title>\n'
        html += '    <link rel="icon" type="image/x-icon" href="../favicon.ico">\n'
        html += '    <link rel="stylesheet" href="../styles/fonts.css">\n'
        html += '    <style>\n'
        html += '        body { font-family: var(--font-ar); direction: rtl; text-align: right; }\n'
        html += self.get_shared_css()
        html += '    </style>\n</head>\n<body>\n'

        # Sticky Navbar
        html += '    <header class="top-nav">\n'
        html += '        <a href="../index.html" class="brand-link">\n'
        html += '            <img src="../Branding/logo-80.png" alt="شعار" class="brand-logo-img">\n'
        html += '            <span>عالم الإكسسوارات | World of Accessories</span>\n'
        html += '        </a>\n'
        html += '        <nav class="nav-links">\n'
        html += '            <a href="../index.html" class="btn-nav">🏠 الرئيسية</a>\n'
        html += '            <a href="../printed_catalogs.html" class="btn-nav">📖 الكتالوجات المطبوعة</a>\n'
        html += '            <a href="categories_index_en.html" class="btn-nav accent">🌐 English</a>\n'
        html += '            <button onclick="window.print()" class="btn-nav">🖨️ طباعة</button>\n'
        html += '        </nav>\n'
        html += '    </header>\n'

        # Live Search Filter
        html += '    <div class="filter-banner">\n'
        html += '        <div class="search-box">\n'
        html += '            <span class="search-icon">🔍</span>\n'
        html += '            <input type="text" id="categorySearch" class="search-input" placeholder="ابحث عن الفئة أو نوع الإكسسوار..." onkeyup="filterPortals()">\n'
        html += '        </div>\n'
        html += f'        <span style="font-weight:700; color:var(--navy);">{to_indic(10)} فئات متخصصة</span>\n'
        html += '    </div>\n'

        html += '    <main class="catalog-container">\n'
        html += '        <div class="page-sheet">\n'
        html += '            <div class="sheet-header">\n'
        html += '                <div class="sheet-title">\n'
        html += '                    <div class="category-badge-icon">🗂️</div>\n'
        html += '                    <div>\n'
        html += '                        <h1 class="category-name-heading">فئات المنتجات المتخصصة</h1>\n'
        html += f'                        <p class="category-meta-count">{to_indic(591)} منتجاً من أجود إكسسوارات الأثاث والمطابخ والدرابزين</p>\n'
        html += '                    </div>\n'
        html += '                </div>\n'
        html += '                <img src="../Branding/logo-100.png" alt="شعار" class="sheet-logo">\n'
        html += '            </div>\n'
        html += '            <div class="categories-index-grid" id="portalGrid">\n'

        for cat in self.categories:
            cat_id = cat['id']
            count = len(self.categorized_products[cat_id])
            html += f'                <a href="category_{cat_id:02d}_ar.html" class="category-portal-card" data-title="{cat["ar"]} {cat["en"]} {cat["description_ar"]}">\n'
            html += f'                    <div class="portal-icon-box">{cat["icon"]}</div>\n'
            html += '                    <div class="portal-info">\n'
            html += f'                        <h2 class="portal-title">{cat["ar"]}</h2>\n'
            html += f'                        <p class="portal-desc">{cat["description_ar"]}</p>\n'
            html += f'                        <span class="portal-badge">{to_indic(count)} منتج</span>\n'
            html += '                    </div>\n'
            html += '                </a>\n'

        html += '            </div>\n'
        html += '            <footer class="sheet-footer">\n'
        html += '                <div class="sheet-footer-brand">\n'
        html += '                    <img src="../Branding/logo-80.png" alt="شعار" class="sheet-footer-logo">\n'
        html += '                    <span>&copy; 2026 عالم الإكسسوارات. جميع الحقوق محفوظة.</span>\n'
        html += '                </div>\n'
        html += '                <span>فهرس الفئات الرئيسية</span>\n'
        html += '            </footer>\n'
        html += '        </div>\n'
        html += '    </main>\n'

        html += """
        <script>
        function filterPortals() {
            var q = document.getElementById('categorySearch').value.toLowerCase();
            var cards = document.querySelectorAll('.category-portal-card');
            cards.forEach(function(card) {
                var text = card.getAttribute('data-title').toLowerCase();
                if(text.indexOf(q) > -1) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }
        </script>
        </body></html>
        """
        return html

    def generate_category_index_en(self):
        html = '<!DOCTYPE html>\n<html lang="en" dir="ltr">\n<head>\n'
        html += '    <meta charset="UTF-8">\n'
        html += '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
        html += '    <title>Product Categories | World of Accessories</title>\n'
        html += '    <link rel="icon" type="image/x-icon" href="../favicon.ico">\n'
        html += '    <link rel="stylesheet" href="../styles/fonts.css">\n'
        html += '    <style>\n'
        html += '        body { font-family: var(--font-en); direction: ltr; text-align: left; }\n'
        html += self.get_shared_css()
        html += '    </style>\n</head>\n<body>\n'

        # Sticky Navbar
        html += '    <header class="top-nav">\n'
        html += '        <a href="../index.html" class="brand-link">\n'
        html += '            <img src="../Branding/logo-80.png" alt="Logo" class="brand-logo-img">\n'
        html += '            <span>World of Accessories</span>\n'
        html += '        </a>\n'
        html += '        <nav class="nav-links">\n'
        html += '            <a href="../index.html" class="btn-nav">🏠 Home</a>\n'
        html += '            <a href="../catalog_en.html" class="btn-nav">📖 Full Catalog (60 Pages)</a>\n'
        html += '            <a href="categories_index_ar.html" class="btn-nav accent">🌐 العربية</a>\n'
        html += '            <button onclick="window.print()" class="btn-nav">🖨️ Print</button>\n'
        html += '        </nav>\n'
        html += '    </header>\n'

        # Live Search Filter
        html += '    <div class="filter-banner">\n'
        html += '        <div class="search-box">\n'
        html += '            <span class="search-icon">🔍</span>\n'
        html += '            <input type="text" id="categorySearch" class="search-input" placeholder="Search categories or hardware type..." onkeyup="filterPortals()">\n'
        html += '        </div>\n'
        html += '        <span style="font-weight:700; color:var(--navy);">10 Specialized Categories</span>\n'
        html += '    </div>\n'

        html += '    <main class="catalog-container">\n'
        html += '        <div class="page-sheet">\n'
        html += '            <div class="sheet-header">\n'
        html += '                <div class="sheet-title">\n'
        html += '                    <div class="category-badge-icon">🗂️</div>\n'
        html += '                    <div>\n'
        html += '                        <h1 class="category-name-heading">Product Categories</h1>\n'
        html += '                        <p class="category-meta-count">591 Premium Furniture, Kitchen & Door Hardware Items</p>\n'
        html += '                    </div>\n'
        html += '                </div>\n'
        html += '                <img src="../Branding/logo-100.png" alt="Logo" class="sheet-logo">\n'
        html += '            </div>\n'
        html += '            <div class="categories-index-grid" id="portalGrid">\n'

        for cat in self.categories:
            cat_id = cat['id']
            count = len(self.categorized_products[cat_id])
            html += f'                <a href="category_{cat_id:02d}_en.html" class="category-portal-card" data-title="{cat["en"]} {cat["description_en"]}">\n'
            html += f'                    <div class="portal-icon-box">{cat["icon"]}</div>\n'
            html += '                    <div class="portal-info">\n'
            html += f'                        <h2 class="portal-title">{cat["en"]}</h2>\n'
            html += f'                        <p class="portal-desc">{cat["description_en"]}</p>\n'
            html += f'                        <span class="portal-badge">{count} Products &bull; {cat.get("price_range", "EGP")}</span>\n'
            html += '                    </div>\n'
            html += '                </a>\n'

        html += '            </div>\n'
        html += '            <footer class="sheet-footer">\n'
        html += '                <div class="sheet-footer-brand">\n'
        html += '                    <img src="../Branding/logo-80.png" alt="Logo" class="sheet-footer-logo">\n'
        html += '                    <span>&copy; 2026 World of Accessories. All rights reserved.</span>\n'
        html += '                </div>\n'
        html += '                <span>Category Directory</span>\n'
        html += '            </footer>\n'
        html += '        </div>\n'
        html += '    </main>\n'

        html += """
        <script>
        function filterPortals() {
            var q = document.getElementById('categorySearch').value.toLowerCase();
            var cards = document.querySelectorAll('.category-portal-card');
            cards.forEach(function(card) {
                var text = card.getAttribute('data-title').toLowerCase();
                if(text.indexOf(q) > -1) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }
        </script>
        </body></html>
        """
        return html

    def generate_category_detail_page(self, category, lang='ar'):
        is_ar = (lang == 'ar')
        dir_attr = "rtl" if is_ar else "ltr"
        cat_title = category['ar'] if is_ar else category['en']
        cat_desc = category['description_ar'] if is_ar else category['description_en']
        other_lang = 'en' if is_ar else 'ar'
        other_label = '🌐 English' if is_ar else '🌐 العربية'
        
        products = self.categorized_products[category['id']]
        total_pages = max(1, math.ceil(len(products) / self.items_per_page))

        html = f'<!DOCTYPE html>\n<html lang="{lang}" dir="{dir_attr}">\n<head>\n'
        html += '    <meta charset="UTF-8">\n'
        html += '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
        html += f'    <title>{cat_title} | عالم الإكسسوارات</title>\n'
        html += '    <link rel="icon" type="image/x-icon" href="../favicon.ico">\n'
        html += '    <link rel="stylesheet" href="../styles/fonts.css">\n'
        html += '    <style>\n'
        html += f'        body {{ font-family: var(--font-{lang}); direction: {dir_attr}; text-align: {"right" if is_ar else "left"}; }}\n'
        html += self.get_shared_css()
        html += '    </style>\n</head>\n<body>\n'

        # Sticky Navbar
        html += '    <header class="top-nav">\n'
        html += f'        <a href="categories_index_{lang}.html" class="brand-link">\n'
        html += '            <img src="../Branding/logo-80.png" alt="Logo" class="brand-logo-img">\n'
        html += f'            <span>{category["icon"]} {cat_title}</span>\n'
        html += '        </a>\n'
        html += '        <nav class="nav-links">\n'
        html += f'            <a href="categories_index_{lang}.html" class="btn-nav">← {"الفئات" if is_ar else "Categories"}</a>\n'
        html += f'            <a href="../index.html" class="btn-nav">🏠 {"الرئيسية" if is_ar else "Home"}</a>\n'
        html += f'            <a href="../printed_catalogs.html" class="btn-nav">📖 {"إصدارات الطباعة" if is_ar else "Print Editions"}</a>\n'
        html += f'            <a href="category_{category["id"]:02d}_{other_lang}.html" class="btn-nav accent">{other_label}</a>\n'
        html += f'            <button onclick="window.print()" class="btn-nav">🖨️ {"طباعة الكتالوج" if is_ar else "Print Catalog"}</button>\n'
        html += '        </nav>\n'
        html += '    </header>\n'

        # Live Search Filter within Category
        html += '    <div class="filter-banner">\n'
        html += '        <div class="search-box">\n'
        html += '            <span class="search-icon">🔍</span>\n'
        placeholder_text = "ابحث بالاسم أو السعر في هذه الفئة..." if is_ar else "Filter by product name or price..."
        html += f'            <input type="text" id="prodSearch" class="search-input" placeholder="{placeholder_text}" onkeyup="filterCategoryProducts()">\n'
        html += '        </div>\n'
        filter_count_badge = f"{to_indic(len(products))} منتج مسجل" if is_ar else f"{len(products)} Products Total"
        html += f'        <span style="font-weight:700; color:var(--navy);">{filter_count_badge}</span>\n'
        html += '    </div>\n'

        html += '    <main class="catalog-container">\n'

        if not products:
            html += '        <div class="page-sheet">\n'
            html += '            <div class="sheet-header">\n'
            html += f'                <div class="sheet-title"><h2>{category["icon"]} {cat_title}</h2></div>\n'
            html += '                <img src="../Branding/logo-100.png" alt="شعار" class="sheet-logo">\n'
            html += '            </div>\n'
            html += f'            <p style="text-align:center; padding: 60px 0; color:#888;">{"لا توجد منتجات مسجلة حالياً" if is_ar else "No products found."}</p>\n'
            html += '        </div>\n'
        else:
            for p_idx in range(0, len(products), self.items_per_page):
                page_prods = products[p_idx:p_idx + self.items_per_page]
                curr_page = (p_idx // self.items_per_page) + 1
                cat_meta_count = f"{cat_desc} &bull; {to_indic(len(products))} منتج" if is_ar else f"{cat_desc} &bull; {len(products)} Items"

                html += f'        <section class="page-sheet" data-page="{curr_page}">\n'
                html += '            <div class="sheet-header">\n'
                html += '                <div class="sheet-title">\n'
                html += f'                    <div class="category-badge-icon">{category["icon"]}</div>\n'
                html += '                    <div>\n'
                html += f'                        <h2 class="category-name-heading">{cat_title}</h2>\n'
                html += f'                        <p class="category-meta-count">{cat_meta_count}</p>\n'
                html += '                    </div>\n'
                html += '                </div>\n'
                html += '                <img src="../Branding/logo-100.png" alt="Logo" class="sheet-logo">\n'
                html += '            </div>\n'
                html += '            <div class="products-grid">\n'

                for prod in page_prods:
                    prod_n = prod.get('n', 0)
                    prod_n_str = f"{prod_n:04d}"
                    if is_ar:
                        title_html = prod.get('ar_clean') or prod.get('ar') or 'منتج'
                        plain_title = re.sub(r'<[^>]+>', '', title_html)
                        code = f"#{to_indic(prod_n_str)}"
                        price_num = to_indic(prod.get('price', 'N/A'))
                        price_display = f"{price_num} ج.م"
                    else:
                        title_html = html_lib.escape(prod.get('en_clean') or prod.get('en') or 'Product')
                        plain_title = title_html
                        code = f"#{prod_n_str}"
                        price_display = f"{prod.get('price', 'N/A')} EGP"

                    img_src = self.resolve_image_path(prod, depth="../")

                    html += f'                <div class="card-product" data-name="{html_lib.escape(plain_title.lower())}">\n'
                    html += f'                    <div class="card-image-wrap">\n'
                    html += f'                        <img src="{img_src}" alt="{html_lib.escape(plain_title)}" loading="lazy" onerror="this.src=\'../Branding/logo-100.png\'; this.style.padding=\'10px\';">\n'
                    html += f'                    </div>\n'
                    html += f'                    <div class="card-info">\n'
                    html += f'                        <span class="card-code">{code}</span>\n'
                    html += f'                        <h3 class="card-name" title="{html_lib.escape(plain_title)}">{title_html}</h3>\n'
                    html += f'                        <div class="card-price-badge">{price_display}</div>\n'
                    html += f'                    </div>\n'
                    html += f'                </div>\n'

                footer_page_info = f"صفحة {to_indic(curr_page)} من {to_indic(total_pages)}" if is_ar else f"Page {curr_page} of {total_pages}"
                html += '            </div>\n'
                html += '            <footer class="sheet-footer">\n'
                html += '                <div class="sheet-footer-brand">\n'
                html += '                    <img src="../Branding/logo-80.png" alt="Logo" class="sheet-footer-logo">\n'
                html += f'                    <span>&copy; 2026 {"عالم الإكسسوارات" if is_ar else "World of Accessories"}</span>\n'
                html += '                </div>\n'
                html += f'                <span>{footer_page_info}</span>\n'
                html += '            </footer>\n'
                html += '        </section>\n'

        html += '    </main>\n'
        html += """
        <script>
        function filterCategoryProducts() {
            var q = document.getElementById('prodSearch').value.toLowerCase();
            var cards = document.querySelectorAll('.card-product');
            cards.forEach(function(c) {
                var name = c.getAttribute('data-name');
                if(name.indexOf(q) > -1) {
                    c.style.display = 'flex';
                } else {
                    c.style.display = 'none';
                }
            });
        }
        </script>
        </body></html>
        """
        return html

    def generate_all(self):
        output_dir = 'Categories'
        os.makedirs(output_dir, exist_ok=True)

        print("\n🎨 Generating Impeccable Category Pages...")

        # 1. Arabic Index
        ar_idx = os.path.join(output_dir, 'categories_index_ar.html')
        with open(ar_idx, 'w', encoding='utf-8') as f:
            f.write(self.generate_category_index_ar())
        print(f"  [OK] {ar_idx}")

        # 2. English Index
        en_idx = os.path.join(output_dir, 'categories_index_en.html')
        with open(en_idx, 'w', encoding='utf-8') as f:
            f.write(self.generate_category_index_en())
        print(f"  [OK] {en_idx}")

        # 3. Individual Categories 1 to 10
        for cat in self.categories:
            c_id = cat['id']
            # Arabic Page
            ar_file = os.path.join(output_dir, f'category_{c_id:02d}_ar.html')
            with open(ar_file, 'w', encoding='utf-8') as f:
                f.write(self.generate_category_detail_page(cat, lang='ar'))
            print(f"  [OK] {ar_file}")

            # English Page
            en_file = os.path.join(output_dir, f'category_{c_id:02d}_en.html')
            with open(en_file, 'w', encoding='utf-8') as f:
                f.write(self.generate_category_detail_page(cat, lang='en'))
            print(f"  [OK] {en_file}")

        print("\n✨ All 22 category pages generated with impeccable craft!")


if __name__ == '__main__':
    gen = ImpeccableCatalogGenerator()
    gen.generate_all()
