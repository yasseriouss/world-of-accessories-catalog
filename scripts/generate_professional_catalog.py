#!/usr/bin/env python3
"""
Professional HTML Catalog Generator
Generates bilingual (Arabic/English) product catalogs with professional design
Based on reference design: Modern black/white/gray geometric aesthetic
Products: 591 items across ~60 pages per language in A4 print format
"""

import json
import math
import os


class CatalogGenerator:
    def __init__(self, json_file="data/parsed_products.json"):
        """Initialize catalog generator with product data"""
        if not os.path.exists(json_file):
            if os.path.exists("parsed_products.json"):
                json_file = "parsed_products.json"
            elif os.path.exists("../data/parsed_products.json"):
                json_file = "../data/parsed_products.json"
        self.json_file = json_file
        self.products = self.load_products()
        self.items_per_page = 10
        self.total_pages = math.ceil(len(self.products) / self.items_per_page)

    def load_products(self):
        """Load products from JSON file"""
        try:
            with open(self.json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                products = data.get('value', data) if isinstance(data, dict) else data
                print(f"✓ Loaded {len(products)} products successfully")
                return products
        except Exception as e:
            print(f"✗ Error loading products: {e}")
            return []

    def get_base_css(self):
        """Return comprehensive professional CSS"""
        return """
    :root {
        --black: #000000;
        --white: #FFFFFF;
        --gray: #F5F5F5;
        --text: #333333;
        --light-text: #666666;
        --border: #DDDDDD;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        background: #555555;
        font-family: 'Comfortaa', sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 0;
    }

    .page {
        background: var(--white);
        width: 210mm;
        height: 297mm;
        margin-bottom: 20px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        padding: 15mm;
        box-sizing: border-box;
        page-break-after: always;
        position: relative;
        display: flex;
        flex-direction: column;
    }

    /* ============ COVER PAGE ============ */
    .page.cover {
        background: linear-gradient(135deg, var(--white) 50%, var(--black) 50%);
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        position: relative;
        overflow: hidden;
    }

    .cover-content {
        z-index: 10;
        position: relative;
    }

    .cover h1 {
        font-size: 48px;
        font-weight: 700;
        margin-bottom: 15px;
        color: var(--black);
        text-transform: uppercase;
        letter-spacing: 2px;
    }

    .cover-subtitle {
        font-size: 14px;
        color: var(--light-text);
        margin-bottom: 40px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .cover-avatar {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        background: var(--gray);
        border: 5px solid var(--white);
        margin: 20px auto;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .cover-footer {
        position: absolute;
        bottom: 20mm;
        left: 15mm;
        right: 15mm;
        font-size: 11px;
        color: var(--light-text);
        text-align: left;
    }

    /* ============ CATALOG HEADER ============ */
    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 2px solid var(--black);
    }

    .page-title {
        font-size: 18px;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--black);
        letter-spacing: 1px;
    }

    .page-number {
        font-size: 12px;
        color: var(--light-text);
        font-weight: 600;
    }

    /* ============ TABLE OF CONTENTS ============ */
    .page.toc {
        background: linear-gradient(135deg, var(--black) 0%, #1a1a1a 100%);
        color: var(--white);
    }

    .toc-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    .toc h1 {
        font-size: 42px;
        font-weight: 700;
        text-transform: uppercase;
        margin-bottom: 30px;
        letter-spacing: 2px;
    }

    .toc-items {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 80%;
        max-width: 400px;
    }

    .toc-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        font-size: 12px;
    }

    .toc-label {
        flex: 1;
    }

    .toc-page {
        font-weight: 700;
        margin-left: 10px;
        min-width: 30px;
        text-align: right;
    }

    /* ============ WELCOME PAGE ============ */
    .page.welcome {
        background: var(--white);
        padding: 15mm;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .welcome-title {
        font-size: 36px;
        font-weight: 700;
        margin-bottom: 20px;
        color: var(--black);
        text-transform: uppercase;
    }

    .welcome-content {
        display: flex;
        gap: 30px;
        align-items: center;
    }

    .welcome-image {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background: var(--gray);
        border: 4px solid var(--white);
        flex-shrink: 0;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .welcome-text {
        flex: 1;
        font-size: 12px;
        line-height: 1.6;
        color: var(--light-text);
    }

    /* ============ PRODUCT GRID ============ */
    .product-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px 30px;
        flex: 1;
    }

    .product-card {
        display: flex;
        flex-direction: column;
        gap: 10px;
        page-break-inside: avoid;
    }

    .product-image {
        width: 100%;
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        background: var(--gray);
        border: 3px solid var(--white);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        color: var(--light-text);
        overflow: hidden;
    }

    .product-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .product-name {
        font-size: 12px;
        font-weight: 700;
        color: var(--black);
        line-height: 1.3;
        min-height: 24px;
    }

    .product-price {
        font-size: 11px;
        font-weight: 600;
        color: #E74C3C;
    }

    .product-code {
        font-size: 9px;
        color: var(--light-text);
    }

    /* ============ SECTION SEPARATOR ============ */
    .section-break {
        page-break-before: always;
    }

    /* ============ BILINGUAL SUPPORT ============ */
    [dir="rtl"] {
        direction: rtl;
        text-align: right;
    }

    [dir="rtl"] .product-grid {
        grid-auto-flow: dense;
    }

    [dir="rtl"] .page-header {
        flex-direction: row-reverse;
    }

    [dir="rtl"] .welcome-content {
        flex-direction: row-reverse;
    }

    [dir="ltr"] {
        direction: ltr;
        text-align: left;
    }

    /* ============ PRINT OPTIMIZATION ============ */
    @media print {
        body {
            background: none;
            padding: 0;
        }

        .page {
            margin-bottom: 0;
            box-shadow: none;
            page-break-after: always;
            page-break-inside: avoid;
            width: 210mm;
            height: 297mm;
            display: block;
        }

        .page.cover {
            background: linear-gradient(135deg, var(--white) 50%, var(--black) 50%) !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        .page.toc {
            background: linear-gradient(135deg, var(--black) 0%, #1a1a1a 100%) !important;
            color: var(--white) !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        .cover-avatar,
        .welcome-image,
        .product-image {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        /* Prevent page numbers from breaking layout */
        .page-number {
            page-break-after: avoid;
        }
    }

    /* ============ ACCESSIBILITY & RESPONSIVENESS ============ */
    @media screen and (max-width: 768px) {
        .page {
            width: 100%;
            height: auto;
            min-height: 297mm;
        }

        .product-grid {
            grid-template-columns: 1fr;
        }
    }
"""

    def get_html_header(self, lang="en"):
        """Generate HTML header with proper meta tags"""
        direction = "rtl" if lang == "ar" else "ltr"
        lang_full = "ar-EG" if lang == "ar" else "en-US"
        title = "كتالوج المنتجات" if lang == "ar" else "Products Catalog"

        return f"""<!DOCTYPE html>
<html lang="{lang_full}" dir="{direction}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        {self.get_base_css()}
    </style>
</head>
<body dir="{direction}">
"""

    def get_html_footer(self):
        """Generate HTML footer"""
        return """
</body>
</html>
"""

    def generate_cover_page(self, lang="en"):
        """Generate professional cover page"""
        if lang == "ar":
            title = "كتالوج المنتجات"
            subtitle = "منتجات بجودة عالية"
            footer = "للتواصل: info@example.com | الهاتف: +20 123 456 7890"
        else:
            title = "PRODUCTS CATALOG"
            subtitle = "Premium Quality Items"
            footer = "Contact: info@example.com | Phone: +20 123 456 7890"

        return f"""
    <div class="page cover">
        <div class="cover-content">
            <h1>{title}</h1>
            <p class="cover-subtitle">{subtitle}</p>
            <div class="cover-avatar"></div>
        </div>
        <div class="cover-footer">{footer}</div>
    </div>
"""

    def generate_toc_page(self, lang="en"):
        """Generate table of contents page"""
        if lang == "ar":
            toc_title = "جدول المحتويات"
            products_label = "المنتجات"
        else:
            toc_title = "TABLE OF CONTENTS"
            products_label = "All Products"

        toc_item = f'<div class="toc-item"><span class="toc-label">{products_label}</span><span class="toc-page">1</span></div>'

        return f"""
    <div class="page toc">
        <div class="toc-content">
            <h1>{toc_title}</h1>
            <div class="toc-items">
                {toc_item}
            </div>
        </div>
    </div>
"""

    def generate_product_pages(self, lang="en"):
        """Generate all product catalog pages"""
        html = ""

        # Determine language-specific text
        products_header = "المنتجات" if lang == "ar" else "PRODUCTS"

        for page_idx in range(self.total_pages):
            start_idx = page_idx * self.items_per_page
            end_idx = min(start_idx + self.items_per_page, len(self.products))
            page_products = self.products[start_idx:end_idx]

            page_num = page_idx + 2  # Start after cover and TOC

            # Add page break before new page (except first)
            if page_idx > 0:
                html += '    <div class="section-break"></div>\n'

            html += f"""    <div class="page" dir="{'rtl' if lang == 'ar' else 'ltr'}">
        <div class="page-header">
            <h2 class="page-title">{products_header}</h2>
            <span class="page-number">Page {page_num}</span>
        </div>
        <div class="product-grid">
"""

            for product in page_products:
                # Get product data based on language
                if lang == "ar":
                    name = product.get("ar", "").strip() or "منتج"
                else:
                    name = product.get("en", "").strip() or "Product"

                price = product.get("price", "N/A")
                product_num = product.get("n", "")

                # Escape HTML characters
                name = self.escape_html(name)

                html += f"""            <div class="product-card">
                <div class="product-image"></div>
                <div class="product-info">
                    <p class="product-name">{name}</p>
                    <p class="product-price">{price} EGP</p>
                    <p class="product-code">Code: {product_num}</p>
                </div>
            </div>
"""

            html += """        </div>
    </div>
"""

        return html

    @staticmethod
    def escape_html(text):
        """Escape HTML special characters"""
        if not isinstance(text, str):
            return str(text)
        return (text.replace("&", "&amp;")
                    .replace("<", "&lt;")
                    .replace(">", "&gt;")
                    .replace('"', "&quot;")
                    .replace("'", "&#39;"))

    def generate_catalog(self, lang="en"):
        """Generate complete catalog HTML"""
        html = self.get_html_header(lang)
        html += self.generate_cover_page(lang)
        html += self.generate_toc_page(lang)
        html += self.generate_product_pages(lang)
        html += self.get_html_footer()
        return html

    def save_catalogs(self):
        """Generate and save both language versions"""
        if not self.products:
            print("✗ No products loaded. Aborting.")
            return False

        # Generate English catalog
        print("\n📋 Generating English catalog...")
        en_html = self.generate_catalog("en")
        en_file = "catalog_en.html"
        with open(en_file, 'w', encoding='utf-8') as f:
            f.write(en_html)
        print(f"✓ Saved: {en_file}")

        # Generate Arabic catalog
        print("\n📋 Generating Arabic catalog...")
        ar_html = self.generate_catalog("ar")
        ar_file = "catalog_ar.html"
        with open(ar_file, 'w', encoding='utf-8') as f:
            f.write(ar_html)
        print(f"✓ Saved: {ar_file}")

        # Print summary
        print("\n" + "="*60)
        print("✓ CATALOG GENERATION COMPLETE")
        print("="*60)
        print(f"📊 Total Products: {len(self.products)}")
        print(f"📄 Pages per language: ~{self.total_pages + 2} (cover + TOC + products)")
        print(f"📁 Output files:")
        print(f"   • {en_file}")
        print(f"   • {ar_file}")
        print("\n📖 How to use:")
        print("   1. Open either HTML file in Chrome or Edge")
        print("   2. Press Ctrl+P to open Print dialog")
        print("   3. Set destination to 'Save as PDF'")
        print("   4. Paper size: A4")
        print("   5. Enable 'Background graphics'")
        print("   6. Disable 'Headers and footers'")
        print("\n✓ Ready for print!")
        print("="*60)

        return True


def main():
    """Main entry point"""
    print("="*60)
    print("🎨 Professional HTML Catalog Generator")
    print("="*60)

    generator = CatalogGenerator("parsed_products.json")
    generator.save_catalogs()


if __name__ == "__main__":
    main()
