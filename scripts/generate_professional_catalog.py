#!/usr/bin/env python3
"""
Professional A4 Portrait HTML Catalog Generator
Generates bilingual (Arabic/English) product catalogs strictly tailored for A4 portrait printing (210mm x 297mm),
with an enhanced branded cover page, detailed table of contents, and perfect page-budget fit.
"""

import json
import math
import os
import sys
import html as html_lib

# Ensure UTF-8 output on Windows console
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass


class ProfessionalA4CatalogGenerator:
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
        self.toc_data = self.calculate_toc_pages()

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
        """Clean translation artifacts for professional typography"""
        for p in self.products:
            ar = p.get('ar', '').strip()
            en = p.get('en', '').strip()

            ar = ar.replace('Drawerة', 'درجة').replace('حShelf', 'حرف').replace('D3', '3D')
            ar = ar.replace('Soft Close', 'سوفت كلوز').replace('Hydraulic', 'هيدروليك')
            ar = ar.replace('Hinge', 'مفصلة').replace('Handle', 'مقبض').replace('Slide', 'سكة مجرى')
            
            en = en.replace('Drawerة', 'Degree').replace('حShelf', 'Profile ').replace('D3', '3D')
            en = en.replace('مصري', 'Egyptian').replace('تركي', 'Turkish').replace('إيطالي', 'Italian')

            p['ar_clean'] = ar
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

        return categorized

    def calculate_toc_pages(self):
        """Calculate start page and page count for each category in the book layout"""
        toc = []
        current_page = 3  # Page 1: Cover, Page 2: Table of Contents

        for cat in self.categories:
            prods = self.categorized_products[cat['id']]
            pages_needed = max(1, math.ceil(len(prods) / self.items_per_page))
            toc.append({
                'category': cat,
                'start_page': current_page,
                'end_page': current_page + pages_needed - 1,
                'pages_count': pages_needed,
                'products_count': len(prods)
            })
            current_page += pages_needed

        self.total_pages = current_page - 1
        print(f"[OK] Total Book Pages: {self.total_pages} (Cover + TOC + Products)")
        return toc

    def resolve_image(self, prod):
        img = prod.get('image', '')
        if not img:
            return "https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=300&auto=format&fit=crop&q=80"
        return img

    def get_print_css(self):
        return """
    :root {
        --navy: #1A3F7F;
        --navy-dark: #0F2752;
        --orange: #FF8C3D;
        --cream: #F5E6D3;
        --cream-light: #FDF9F5;
        --dark: #0F172A;
        --text-muted: #64748B;
        --border: #CBD5E1;
        --font-ar: 'Tajawal', sans-serif;
        --font-en: 'Comfortaa', sans-serif;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    /* Strict A4 Portrait Page Setup */
    @page {
        size: 210mm 297mm;
        margin: 0;
    }

    body {
        background: #475569;
        margin: 0;
        padding: 20px 0 60px;
        display: flex;
        flex-direction: column;
        align-items: center;
        -webkit-font-smoothing: antialiased;
    }

    /* Screen Sticky Toolbar (Hidden on Print) */
    .top-toolbar {
        position: sticky;
        top: 0;
        z-index: 1000;
        background: rgba(26, 63, 127, 0.96);
        backdrop-filter: blur(10px);
        color: white;
        padding: 10px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        width: 100%;
        margin-bottom: 24px;
    }

    .top-toolbar a, .top-toolbar button {
        color: white;
        text-decoration: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        border: 1px solid rgba(255, 255, 255, 0.3);
        background: rgba(255, 255, 255, 0.15);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s;
    }

    .top-toolbar a:hover, .top-toolbar button:hover {
        background: var(--orange);
        border-color: var(--orange);
    }

    /* Exact A4 Sheet Simulation */
    .page {
        background: #FFFFFF;
        width: 210mm;
        height: 297mm;
        min-height: 297mm;
        max-height: 297mm;
        margin: 0 auto 24px;
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35);
        padding: 14mm 15mm 12mm;
        box-sizing: border-box;
        page-break-after: always;
        break-after: page;
        page-break-inside: avoid;
        break-inside: avoid;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
        border-radius: 4px;
    }

    /* ================= COVER PAGE ================= */
    .page.cover {
        background: linear-gradient(145deg, #0A1931 0%, #1A3F7F 55%, #153266 100%);
        color: #FFFFFF;
        padding: 0;
        border: none;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
    }

    .cover-pattern-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('Branding/pattern-02.jpg.jpeg') center/cover;
        opacity: 0.12;
        mix-blend-mode: overlay;
        pointer-events: none;
    }

    .cover-top-bar {
        padding: 18mm 18mm 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        z-index: 2;
    }

    .cover-edition-tag {
        background: rgba(255, 140, 61, 0.2);
        border: 1.5px solid var(--orange);
        color: var(--orange);
        padding: 6px 18px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.5px;
    }

    .cover-main-content {
        padding: 0 18mm;
        text-align: center;
        position: relative;
        z-index: 2;
    }

    .cover-logo-frame {
        width: 130px;
        height: 130px;
        background: #FFFFFF;
        border-radius: 26px;
        padding: 14px;
        margin: 0 auto 28px;
        box-shadow: 0 20px 45px rgba(0,0,0,0.4);
        border: 4px solid var(--orange);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .cover-logo-frame img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }

    .cover-title-ar {
        font-size: 40px;
        font-weight: 800;
        color: #FFFFFF;
        line-height: 1.25;
        margin-bottom: 8px;
        text-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }

    .cover-title-en {
        font-size: 22px;
        font-weight: 700;
        color: var(--orange);
        letter-spacing: 2px;
        text-transform: uppercase;
        margin-bottom: 24px;
        font-family: var(--font-en);
    }

    .cover-desc {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.88);
        line-height: 1.6;
        max-width: 520px;
        margin: 0 auto 30px;
    }

    .cover-badges {
        display: flex;
        justify-content: center;
        gap: 12px;
        flex-wrap: wrap;
    }

    .cover-badge-pill {
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.25);
        color: #FFFFFF;
        padding: 8px 18px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
    }

    .cover-bottom-bar {
        background: rgba(10, 25, 49, 0.85);
        border-top: 2px solid var(--orange);
        padding: 14mm 18mm;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.75);
        position: relative;
        z-index: 2;
    }

    /* ================= TABLE OF CONTENTS ================= */
    .page.toc {
        padding: 14mm 15mm 12mm;
    }

    .toc-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 12px;
        border-bottom: 3px solid var(--navy);
        margin-bottom: 16px;
    }

    .toc-title-wrap {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .toc-title-icon {
        font-size: 32px;
        background: var(--cream-light);
        border: 1px solid var(--cream);
        width: 50px;
        height: 50px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .toc-title-text h2 {
        font-size: 24px;
        font-weight: 800;
        color: var(--navy);
        margin-bottom: 2px;
    }

    .toc-title-text p {
        font-size: 12px;
        color: var(--text-muted);
    }

    .toc-list {
        display: flex;
        flex-direction: column;
        gap: 9px;
        flex: 1;
        justify-content: space-around;
        margin-bottom: 12px;
    }

    .toc-row {
        display: flex;
        align-items: center;
        padding: 9px 14px;
        background: #F8FAFC;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        font-size: 13px;
        text-decoration: none;
        color: inherit;
        transition: all 0.2s;
        cursor: pointer;
    }

    .toc-row:hover {
        background: #FFFDF9;
        border-color: var(--orange);
        transform: translateX(-2px);
    }

    [dir="ltr"] .toc-row:hover {
        transform: translateX(2px);
    }

    .toc-col-num {
        font-weight: 800;
        color: var(--orange);
        font-size: 13px;
        width: 32px;
    }

    .toc-col-icon {
        font-size: 20px;
        width: 36px;
        text-align: center;
    }

    .toc-col-name {
        font-weight: 700;
        color: var(--navy);
        flex: 0 0 auto;
        max-width: 60%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .toc-dots {
        flex: 1;
        min-width: 20px;
        margin: 0 10px;
        border-bottom: 1.5px dotted #CBD5E1;
        height: 12px;
    }

    .toc-col-count {
        font-size: 12px;
        color: var(--text-muted);
        background: rgba(255, 140, 61, 0.1);
        padding: 2px 10px;
        border-radius: 12px;
        font-weight: 600;
        margin: 0 10px;
    }

    .toc-col-page {
        font-weight: 800;
        color: var(--navy);
        font-size: 14px;
        width: 60px;
        text-align: end;
    }

    .toc-footer-summary {
        background: #EFF6FF;
        border: 1px solid #BFDBFE;
        border-radius: 8px;
        padding: 10px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: var(--navy);
        font-weight: 600;
    }

    /* ================= CATALOG PRODUCT PAGES ================= */
    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 16mm;
        padding-bottom: 8px;
        border-bottom: 2.5px solid var(--navy);
        margin-bottom: 10px;
    }

    .header-cat-info {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .header-cat-icon {
        font-size: 24px;
    }

    .header-cat-title {
        font-size: 16px;
        font-weight: 800;
        color: var(--navy);
    }

    .header-cat-badge {
        font-size: 11px;
        color: var(--orange);
        font-weight: 700;
    }

    .header-logo {
        height: 38px;
        width: auto;
    }

    /* Product Grid: 10 items (2 cols x 5 rows) - Exactly fitted */
    .products-grid-a4 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: repeat(5, 41mm);
        gap: 8px 14px;
        height: 220mm;
        max-height: 220mm;
        overflow: hidden;
    }

    .card-item-a4 {
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        padding: 8px 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        height: 41mm;
        max-height: 41mm;
        overflow: hidden;
        box-sizing: border-box;
    }

    .card-thumb {
        width: 33mm;
        height: 33mm;
        max-width: 33mm;
        max-height: 33mm;
        border-radius: 6px;
        border: 1px solid #E2E8F0;
        overflow: hidden;
        flex-shrink: 0;
        background: #F8FAFC;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .card-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .card-content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        padding: 2px 0;
    }

    .card-code-pill {
        font-size: 10px;
        font-weight: 800;
        color: var(--navy);
        letter-spacing: 0.5px;
    }

    .card-prod-title {
        font-size: 11.5px;
        font-weight: 700;
        color: var(--dark);
        line-height: 1.35;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin: 2px 0;
    }

    .card-prod-price {
        font-size: 13px;
        font-weight: 800;
        color: var(--orange);
    }

    /* Page Footer */
    .page-footer {
        height: 12mm;
        padding-top: 8px;
        border-top: 1px solid #E2E8F0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 11px;
        color: var(--text-muted);
    }

    .page-footer-logo {
        height: 24px;
        width: auto;
    }

    /* ================= STRICT PRINT RULES ================= */
    @media print {
        body {
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        .top-toolbar {
            display: none !important;
        }

        .page {
            width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            padding: 14mm 15mm 12mm !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
        }

        .page.cover {
            padding: 0 !important;
        }

        .card-item-a4 {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            border: 1px solid #CBD5E1 !important;
        }
    }

    /* ================= MOBILE & TABLET RESPONSIVE STYLES (SCREEN ONLY) ================= */
    @media screen and (max-width: 820px) {
        body {
            background: #F1F5F9;
            padding: 0 0 40px;
        }

        .top-toolbar {
            flex-direction: column;
            gap: 12px;
            padding: 12px 14px;
            text-align: center;
            border-radius: 0;
            margin-bottom: 14px;
        }

        .top-toolbar-actions {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 8px;
            width: 100%;
        }

        .top-toolbar a, .top-toolbar button {
            flex: 1 1 auto;
            min-height: 42px;
            justify-content: center;
            font-size: 12px;
            padding: 8px 12px;
        }

        .page {
            width: 95% !important;
            max-width: 600px !important;
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
            margin: 0 auto 16px !important;
            padding: 20px 16px !important;
            box-shadow: 0 4px 16px rgba(0,0,0,0.06) !important;
            border-radius: 12px !important;
            overflow: visible !important;
            border: 1px solid #E2E8F0;
        }

        /* Cover Page Responsive */
        .page.cover {
            padding: 32px 16px !important;
            border-radius: 12px !important;
            min-height: 520px !important;
            justify-content: center;
            gap: 20px;
        }

        .cover-top-bar {
            padding: 0 !important;
            flex-direction: column;
            gap: 10px;
            text-align: center;
            align-items: center;
        }

        .cover-main-content {
            padding: 14px 0 !important;
        }

        .cover-logo-frame {
            width: 96px;
            height: 96px;
            margin: 0 auto 16px;
            border-radius: 20px;
            padding: 10px;
        }

        .cover-title-ar {
            font-size: 28px;
            line-height: 1.3;
        }

        .cover-title-en {
            font-size: 15px;
            letter-spacing: 1px;
            margin-bottom: 16px;
        }

        .cover-desc {
            font-size: 13px;
            line-height: 1.55;
            margin-bottom: 20px;
            padding: 0 8px;
        }

        .cover-badges {
            gap: 8px;
        }

        .cover-badge-pill {
            font-size: 11px;
            padding: 5px 12px;
        }

        .cover-bottom-bar {
            padding: 16px 0 0 !important;
            flex-direction: column;
            gap: 6px;
            font-size: 11px;
            text-align: center;
        }

        /* Table of Contents Responsive */
        .page.toc {
            padding: 20px 14px !important;
        }

        .toc-header {
            flex-direction: column;
            gap: 12px;
            text-align: center;
            align-items: center;
            margin-bottom: 16px;
        }

        .toc-title-wrap {
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }

        .toc-title-icon {
            width: 44px;
            height: 44px;
            font-size: 26px;
        }

        .toc-title-text h2 {
            font-size: 20px;
        }

        .toc-list {
            gap: 8px;
            margin-bottom: 14px;
        }

        .toc-row {
            padding: 10px 12px;
            font-size: 12px;
            gap: 8px;
            flex-wrap: wrap;
        }

        .toc-col-name {
            max-width: 60%;
            font-size: 12px;
        }

        .toc-dots {
            display: none;
        }

        .toc-col-count {
            margin: 0;
            font-size: 11px;
            padding: 2px 8px;
        }

        .toc-col-page {
            font-size: 12px;
            width: auto;
            margin-inline-start: auto;
        }

        .toc-footer-summary {
            flex-direction: column;
            gap: 6px;
            text-align: center;
            font-size: 11px;
            padding: 10px;
        }

        /* Product Listing Responsive */
        .page-header {
            height: auto;
            padding-bottom: 10px;
            flex-direction: column;
            gap: 8px;
            text-align: center;
            align-items: center;
        }

        .header-cat-info {
            flex-direction: column;
            gap: 4px;
        }

        .header-cat-title {
            font-size: 16px;
        }

        .products-grid-a4 {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            gap: 10px;
        }

        .card-item-a4 {
            height: auto !important;
            max-height: none !important;
            padding: 10px 12px;
            gap: 12px;
            align-items: center;
        }

        .card-thumb {
            width: 68px !important;
            height: 68px !important;
            min-width: 68px !important;
            min-height: 68px !important;
            max-width: 68px !important;
            max-height: 68px !important;
            border-radius: 8px;
        }

        .card-prod-title {
            font-size: 13px;
            -webkit-line-clamp: 2;
        }

        .card-prod-price {
            font-size: 14px;
        }

        .page-footer {
            height: auto;
            padding-top: 10px;
            flex-direction: column;
            gap: 6px;
            text-align: center;
            font-size: 11px;
        }
    }

    @media screen and (max-width: 480px) {
        .page {
            width: 100% !important;
            margin: 0 0 12px !important;
            border-radius: 0 !important;
            padding: 16px 12px !important;
            border-left: none;
            border-right: none;
        }

        .cover-title-ar {
            font-size: 24px;
        }

        .cover-title-en {
            font-size: 14px;
        }

        .toc-col-name {
            max-width: 52%;
        }

        .top-toolbar a, .top-toolbar button {
            width: 100%;
        }
    }
    """

    def generate_cover_page(self, lang="ar"):
        is_ar = (lang == "ar")
        title_main = "عالم الإكسسوارات" if is_ar else "WORLD OF ACCESSORIES"
        title_sub = "WORLD OF ACCESSORIES" if is_ar else "عالم الإكسسوارات"
        edition_label = "إصدار الطباعة الفاخر A4 &bull; 2026" if is_ar else "A4 Print Edition &bull; Official 2026"
        desc_text = "الكتالوج الرسمي الشامل والمصور لإكسسوارات الأثاث، المطابخ، الأبواب وأنظمة الحركة والرفع، يضم 591 منتجاً متميزاً بالأسعار المعتمدة." if is_ar else "Official Illustrated Product Catalog for Furniture, Kitchen, Cabinet and Architectural Hardware. Featuring 591 certified quality items with official pricing."

        b1 = "📊 591 منتجاً مصوراً" if is_ar else "📊 591 Illustrated Items"
        b2 = "📂 10 فئات متخصصة" if is_ar else "📂 10 Categorized Sections"
        b3 = "💎 أسعار رسمية بالجنيه" if is_ar else "💎 Official EGP Prices"
        b4 = "🖨️ معتمد لمقاس A4" if is_ar else "🖨️ A4 Portrait Optimized"

        contact_left = "القاهرة، جمهورية مصر العربية | info@worldofaccessories.com" if is_ar else "Cairo, Egypt | info@worldofaccessories.com"
        contact_right = "هاتف: 01000000000 | الموقع: world-of-accessories-catalog.vercel.app" if is_ar else "Phone: +20 1000000000 | Web: world-of-accessories-catalog.vercel.app"

        return f"""
    <!-- COVER PAGE (PAGE 1) -->
    <div class="page cover" dir="{'rtl' if is_ar else 'ltr'}">
        <div class="cover-pattern-overlay"></div>
        <div class="cover-top-bar">
            <span class="cover-edition-tag">{edition_label}</span>
            <span style="font-size:12px; font-weight:700; color:rgba(255,255,255,0.85);">{b4}</span>
        </div>

        <div class="cover-main-content">
            <div class="cover-logo-frame">
                <img src="Branding/logo.png" alt="Company Logo">
            </div>
            <h1 class="cover-title-ar">{title_main}</h1>
            <div class="cover-title-en">{title_sub}</div>
            <p class="cover-desc">{desc_text}</p>
            <div class="cover-badges">
                <span class="cover-badge-pill">{b1}</span>
                <span class="cover-badge-pill">{b2}</span>
                <span class="cover-badge-pill">{b3}</span>
            </div>
        </div>

        <div class="cover-bottom-bar">
            <span>{contact_left}</span>
            <span>{contact_right}</span>
        </div>
    </div>
"""

    def generate_toc_page(self, lang="ar"):
        is_ar = (lang == "ar")
        toc_title = "فهرس المحتويات الشامل" if is_ar else "Table of Contents"
        toc_sub = "دليل تصفح فئات المنتجات وأرقام الصفحات" if is_ar else "Directory of Product Categories and Page Numbers"
        summary_left = f"إجمالي المنتجات: 591 منتجاً موزعة على 10 فئات" if is_ar else "Total Products: 591 items across 10 specialized categories"
        summary_right = f"إجمالي الصفحات: {self.total_pages} صفحة A4" if is_ar else f"Total Pages: {self.total_pages} A4 Sheets"

        html = f"""
    <!-- TABLE OF CONTENTS (PAGE 2) -->
    <div class="page toc" dir="{'rtl' if is_ar else 'ltr'}">
        <div class="toc-header">
            <div class="toc-title-wrap">
                <div class="toc-title-icon">📖</div>
                <div class="toc-title-text">
                    <h2>{toc_title}</h2>
                    <p>{toc_sub}</p>
                </div>
            </div>
            <img src="Branding/logo-100.png" alt="Logo" style="height:44px;">
        </div>

        <div class="toc-list">
"""
        for item in self.toc_data:
            cat = item['category']
            cat_name = f"{cat['ar']} — {cat['en']}" if is_ar else f"{cat['en']} — {cat['ar']}"
            count_str = f"{item['products_count']} منتج" if is_ar else f"{item['products_count']} Items"
            page_str = f"صفحة {item['start_page']}" if is_ar else f"Page {item['start_page']}"

            html += f"""            <a href="#page-{item['start_page']}" class="toc-row">
                <span class="toc-col-num">{cat['id']:02d}</span>
                <span class="toc-col-icon">{cat['icon']}</span>
                <span class="toc-col-name">{cat_name}</span>
                <span class="toc-dots"></span>
                <span class="toc-col-count">{count_str}</span>
                <span class="toc-col-page">{page_str}</span>
            </a>
"""

        html += f"""        </div>

        <div class="toc-footer-summary">
            <span>{summary_left}</span>
            <span>{summary_right}</span>
        </div>

        <footer class="page-footer">
            <img src="Branding/logo-80.png" alt="Logo" class="page-footer-logo">
            <span>&copy; 2026 {'عالم الإكسسوارات' if is_ar else 'World of Accessories'} &bull; {'فهرس المحتويات' if is_ar else 'Table of Contents'}</span>
            <span>{'صفحة 2 من' if is_ar else 'Page 2 of'} {self.total_pages}</span>
        </footer>
    </div>
"""
        return html

    def generate_product_pages(self, lang="ar"):
        is_ar = (lang == "ar")
        html = ""

        for item in self.toc_data:
            cat = item['category']
            prods = self.categorized_products[cat['id']]
            start_p = item['start_page']

            for page_idx in range(0, len(prods), self.items_per_page):
                current_page_num = start_p + (page_idx // self.items_per_page)
                page_prods = prods[page_idx:page_idx + self.items_per_page]

                cat_title_display = cat['ar'] if is_ar else cat['en']
                sub_badge = f"{len(prods)} منتج &bull; فئة {cat['id']:02d}" if is_ar else f"{len(prods)} Items &bull; Cat {cat['id']:02d}"

                html += f"""
    <!-- PAGE {current_page_num}: {cat_title_display} -->
    <div class="page" id="page-{current_page_num}" dir="{'rtl' if is_ar else 'ltr'}">
        <header class="page-header">
            <div class="header-cat-info">
                <span class="header-cat-icon">{cat['icon']}</span>
                <span class="header-cat-title">{cat_title_display}</span>
                <span class="header-cat-badge">({sub_badge})</span>
            </div>
            <img src="Branding/logo-100.png" alt="Logo" class="header-logo">
        </header>

        <div class="products-grid-a4">
"""
                for p in page_prods:
                    title = p.get('ar_clean') if is_ar else p.get('en_clean')
                    if not title:
                        title = p.get('ar') or p.get('en') or 'منتج'
                    
                    price = p.get('price', 'N/A')
                    curr = 'ج.م' if is_ar else 'EGP'
                    code = f"#{p.get('n', 0):04d}"
                    img_url = self.resolve_image(p)

                    html += f"""            <div class="card-item-a4">
                <div class="card-thumb">
                    <img src="{img_url}" alt="{html_lib.escape(title)}" loading="lazy" onerror="this.src='Branding/logo-100.png'; this.style.padding='6px';">
                </div>
                <div class="card-content">
                    <span class="card-code-pill">{code}</span>
                    <h3 class="card-prod-title" title="{html_lib.escape(title)}">{html_lib.escape(title)}</h3>
                    <div class="card-prod-price">{price} {curr}</div>
                </div>
            </div>
"""

                html += f"""        </div>

        <footer class="page-footer">
            <img src="Branding/logo-80.png" alt="Logo" class="page-footer-logo">
            <span>&copy; 2026 {'عالم الإكسسوارات' if is_ar else 'World of Accessories'} &bull; {cat_title_display}</span>
            <span>{'صفحة' if is_ar else 'Page'} {current_page_num} {'من' if is_ar else 'of'} {self.total_pages}</span>
        </footer>
    </div>
"""
        return html

    def generate_full_catalog(self, lang="ar"):
        is_ar = (lang == "ar")
        title_head = "الكتالوج الشامل الفاخر - عالم الإكسسوارات (A4 Print)" if is_ar else "Official Complete Catalog - World of Accessories (A4 Print)"
        other_lang = "en" if is_ar else "ar"
        other_label = "🌐 English" if is_ar else "🌐 العربية"
        other_file = "catalog_en.html" if is_ar else "catalog_ar.html"

        html = f"""<!DOCTYPE html>
<html lang="{lang}" dir="{'rtl' if is_ar else 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title_head}</title>
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <link rel="stylesheet" href="styles/fonts.css">
    <style>
        body {{
            font-family: var(--font-{lang});
            direction: {'rtl' if is_ar else 'ltr'};
            text-align: {'right' if is_ar else 'left'};
        }}
        {self.get_print_css()}
    </style>
</head>
<body>

    <!-- Screen Navigation Bar -->
    <div class="top-toolbar">
        <div style="display:flex; align-items:center; gap:10px;">
            <img src="Branding/logo-80.png" alt="Logo" style="height:32px; background:white; border-radius:4px; padding:2px;">
            <span style="font-weight:700;">{'عالم الإكسسوارات - الكتالوج الكامل المعتمد A4 (591 منتج)' if is_ar else 'World of Accessories - Official A4 Complete Catalog (591 Items)'}</span>
        </div>
        <div class="top-toolbar-actions" style="display:flex; gap:10px;">
            <a href="index.html">🏠 {'الرئيسية' if is_ar else 'Home'}</a>
            <a href="Categories/categories_index_{lang}.html">🏷️ {'الفئات' if is_ar else 'Categories'}</a>
            <a href="{other_file}" style="background:var(--orange); border-color:var(--orange);">{other_label}</a>
            <button onclick="window.print()">🖨️ {'طباعة وتصدير PDF' if is_ar else 'Print / Save as PDF'}</button>
        </div>
    </div>

"""
        html += self.generate_cover_page(lang)
        html += self.generate_toc_page(lang)
        html += self.generate_product_pages(lang)
        html += """
</body>
</html>
"""
        return html

    def generate_both(self):
        print("\n🖨️ Generating Professional A4 Portrait Catalogs...")

        # 1. Arabic Full Catalog
        ar_html = self.generate_full_catalog("ar")
        with open("catalog_ar.html", "w", encoding="utf-8") as f:
            f.write(ar_html)
        print("  [OK] Saved catalog_ar.html (A4 Portrait, Cover, Enhanced TOC, 591 Items)")

        # 2. English Full Catalog
        en_html = self.generate_full_catalog("en")
        with open("catalog_en.html", "w", encoding="utf-8") as f:
            f.write(en_html)
        print("  [OK] Saved catalog_en.html (A4 Portrait, Cover, Enhanced TOC, 591 Items)")

        print("\n✨ Catalog generation for A4 portrait completed successfully!")


if __name__ == "__main__":
    gen = ProfessionalA4CatalogGenerator()
    gen.generate_both()
