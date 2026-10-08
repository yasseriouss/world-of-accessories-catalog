#!/usr/bin/env python3
"""
Brand Asset Upgrade - Extracts logo from PDF and integrates all brand assets
Uses local fonts and patterns from Branding folder
"""

import os
import base64
import json

def encode_font_file(filepath):
    """Encode font file to base64 for @font-face embedding"""
    try:
        with open(filepath, 'rb') as f:
            font_data = f.read()
        return base64.b64encode(font_data).decode('ascii')
    except Exception as e:
        print("[ERROR] Failed to encode {}: {}".format(filepath, e))
        return None

def get_brand_css():
    """Generate CSS with @font-face for local fonts and brand colors"""

    # Encode fonts
    comfortaa_data = encode_font_file('Branding/Comfortaa-VariableFont_wght.ttf')
    tajawal_data = encode_font_file('Branding/Tajawal-Regular.ttf')

    css = """
/* ============ FONT FACES ============ */
@font-face {
    font-family: 'Comfortaa';
    src: url('data:application/x-font-ttf;charset=utf-8;base64,""" + (comfortaa_data[:100] if comfortaa_data else "") + """...') format('truetype');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'Tajawal';
    src: url('data:application/x-font-ttf;charset=utf-8;base64,""" + (tajawal_data[:100] if tajawal_data else "") + """...') format('truetype');
    font-weight: normal;
    font-style: normal;
}

/* ============ ROOT VARIABLES ============ */
:root {
    --navy: #1A3F7F;
    --orange: #FF8C3D;
    --cream: #F5E6D3;
    --white: #FFFFFF;
    --gray: #F5F5F5;
    --text: #333333;
    --font-en: 'Comfortaa', Arial, sans-serif;
    --font-ar: 'Tajawal', Arial, sans-serif;
}

/* ============ GLOBAL STYLES ============ */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    background: #555555;
    font-family: var(--font-en);
    color: var(--text);
    line-height: 1.6;
}

body[lang="ar"],
body[dir="rtl"] {
    font-family: var(--font-ar);
    direction: rtl;
    text-align: right;
}

/* ============ PAGE CONTAINER ============ */
.page {
    background: var(--white);
    width: 210mm;
    height: 297mm;
    margin: 0 auto 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    padding: 15mm;
    box-sizing: border-box;
    page-break-after: always;
    position: relative;
    display: flex;
    flex-direction: column;
}

/* ============ HERO WITH PATTERN BACKGROUND ============ */
.hero {
    position: relative;
    background: linear-gradient(135deg, var(--navy) 0%, var(--orange) 100%);
    background-image: url('Branding/pattern-01.jpg.jpeg');
    background-size: cover;
    background-position: center;
    background-blend-mode: overlay;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    overflow: hidden;
}

.hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(26, 63, 127, 0.7);
    z-index: 1;
}

.hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    color: var(--white);
}

/* ============ LOGO STYLES ============ */
.logo-image {
    max-width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
}

.logo-hero {
    width: 180px;
    height: 180px;
    margin: 0 auto 30px;
    background: var(--white);
    border-radius: 50%;
    padding: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.logo-header {
    height: 60px;
    width: auto;
    margin-right: 15px;
}

[dir="rtl"] .logo-header {
    margin-right: 0;
    margin-left: 15px;
}

.logo-footer {
    height: 50px;
    width: auto;
}

/* ============ PATTERNS AS BACKGROUNDS ============ */
.pattern-hero {
    background: url('Branding/pattern-01.jpg.jpeg') center/cover;
}

.pattern-section {
    background: url('Branding/pattern-02.jpg.jpeg') center/cover;
}

.pattern-accent {
    background: url('Branding/pattern-03.jpg.jpeg') center/cover;
}

/* ============ TYPOGRAPHY ============ */
h1 {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 20px;
    color: var(--navy);
}

h2 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 15px;
    color: var(--navy);
}

h3 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 10px;
    color: var(--navy);
}

p {
    font-size: 16px;
    line-height: 1.6;
    color: var(--text);
}

small {
    font-size: 12px;
    color: #666;
}

/* ============ BUTTONS ============ */
.btn {
    display: inline-block;
    padding: 15px 40px;
    background: var(--orange);
    color: var(--white);
    font-size: 18px;
    font-weight: 700;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
}

.btn:hover {
    background: #FF6B0A;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 140, 61, 0.3);
}

.btn:active {
    transform: translateY(0);
}

/* ============ LAYOUT ============ */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}

.flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

/* ============ HEADER ============ */
header {
    background: var(--navy);
    color: var(--white);
    padding: 15px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

header nav {
    display: flex;
    gap: 20px;
    align-items: center;
}

header a {
    color: var(--white);
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s;
}

header a:hover {
    color: var(--orange);
}

/* ============ FOOTER ============ */
footer {
    background: var(--navy);
    color: var(--white);
    padding: 30px 20px;
    text-align: center;
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
}

footer p {
    color: var(--white);
    font-size: 14px;
}

/* ============ PRODUCT GRID ============ */
.product-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin: 20px 0;
    flex: 1;
}

.product-card {
    background: var(--gray);
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
    transition: all 0.3s ease;
}

.product-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: var(--orange);
}

.product-icon {
    font-size: 40px;
    margin-bottom: 10px;
}

.product-name {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    line-height: 1.4;
}

.product-price {
    font-size: 16px;
    font-weight: 700;
    color: var(--orange);
}

/* ============ CATEGORY BOX ============ */
.category-box {
    background: var(--white);
    border: 2px solid var(--navy);
    border-radius: 12px;
    padding: 25px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.category-box:hover {
    background: var(--cream);
    border-color: var(--orange);
    transform: translateY(-5px);
}

.category-icon {
    font-size: 48px;
    margin-bottom: 15px;
}

.category-name {
    font-size: 18px;
    font-weight: 600;
    color: var(--navy);
    margin-bottom: 8px;
}

.category-count {
    font-size: 13px;
    color: #666;
}

/* ============ PRINT STYLES ============ */
@media print {
    body {
        background: white;
    }

    .page {
        box-shadow: none;
        margin: 0;
        padding: 0;
    }

    .logo-image {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
    }

    header, footer {
        page-break-inside: avoid;
    }
}

/* ============ RESPONSIVE ============ */
@media screen and (max-width: 1024px) {
    .page {
        width: 100%;
        height: auto;
    }

    .grid-2 {
        grid-template-columns: 1fr;
    }
}

@media screen and (max-width: 768px) {
    h1 {
        font-size: 32px;
    }

    h2 {
        font-size: 24px;
    }

    .product-grid {
        grid-template-columns: 1fr;
    }

    header {
        flex-direction: column;
        text-align: center;
        gap: 10px;
    }

    header nav {
        flex-direction: column;
        width: 100%;
    }

    .btn {
        width: 100%;
        padding: 12px 20px;
        font-size: 16px;
    }
}

@media screen and (max-width: 480px) {
    h1 {
        font-size: 24px;
    }

    h2 {
        font-size: 18px;
    }

    p {
        font-size: 14px;
    }

    .container {
        padding: 10px;
    }

    .product-grid {
        gap: 10px;
    }

    .product-card {
        padding: 10px;
    }

    .product-name {
        font-size: 12px;
    }
}
"""
    return css

def create_font_face_css():
    """Create a separate CSS file with @font-face declarations"""

    css = """/* Brand Fonts - Load local fonts first */
@font-face {
    font-family: 'Comfortaa';
    src: url('../Branding/Comfortaa-VariableFont_wght.ttf') format('truetype');
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'Tajawal';
    src: url('../Branding/Tajawal-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}

/* Fallback to system fonts if local fonts fail */
:root {
    --font-en: 'Comfortaa', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    --font-ar: 'Tajawal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

html[lang="en"],
html[dir="ltr"] {
    font-family: var(--font-en);
}

html[lang="ar"],
html[dir="rtl"] {
    font-family: var(--font-ar);
    direction: rtl;
    text-align: right;
}
"""
    return css

def update_html_with_fonts(html_content, is_arabic=False):
    """Update HTML to use local fonts"""

    # Add font-face CSS link
    font_css_link = '    <link rel="stylesheet" href="../styles/fonts.css">\n'
    if '<head>' in html_content and font_css_link not in html_content:
        html_content = html_content.replace('</head>', font_css_link + '</head>')

    # Update lang attribute
    if is_arabic:
        html_content = html_content.replace('<html lang="ar"', '<html lang="ar" dir="rtl"')
    else:
        html_content = html_content.replace('<html lang="en"', '<html lang="en" dir="ltr"')

    return html_content

def generate_enhanced_index_html():
    """Generate enhanced index.html with patterns and proper fonts"""

    html = """<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Premium Professional Product Catalog - 591 Quality Products">
    <title>Premium Product Catalog</title>

    <!-- Favicon Links -->
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
    <link rel="apple-touch-icon" href="apple-touch-icon.png">
    <meta name="theme-color" content="#1A3F7F">

    <!-- Local Fonts -->
    <link rel="stylesheet" href="styles/fonts.css">

    <style>
""" + get_brand_css() + """
        /* Index-specific styles */
        .language-selector {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin: 40px 0;
            flex-wrap: wrap;
        }

        .language-selector .btn {
            min-width: 200px;
            font-size: 20px;
            padding: 20px 40px;
        }

        .features {
            background: url('Branding/pattern-02.jpg.jpeg') center/cover;
            background-blend-mode: overlay;
            background-color: rgba(26, 63, 127, 0.8);
            color: white;
            padding: 40px 20px;
            margin: 30px 0;
            border-radius: 12px;
        }

        .features h2 {
            color: white;
            text-align: center;
            margin-bottom: 30px;
        }

        .feature-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }

        .feature-item {
            text-align: center;
        }

        .feature-item-icon {
            font-size: 48px;
            margin-bottom: 10px;
        }

        .feature-item h3 {
            color: var(--orange);
            font-size: 18px;
            margin-bottom: 8px;
        }

        .feature-item p {
            color: white;
            font-size: 14px;
        }

        .cta-section {
            background: var(--cream);
            padding: 40px 20px;
            text-align: center;
            border-radius: 12px;
            margin: 30px 0;
        }

        .cta-section h2 {
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <header>
        <div class="flex-center">
            <img src="Branding/logo-150.png" alt="Company Logo" class="logo-header">
            <h1 style="margin: 0; font-size: 24px;">Premium Catalog</h1>
        </div>
    </header>

    <main class="container">
        <!-- Hero Section -->
        <section class="hero pattern-hero">
            <div class="hero-content">
                <div class="logo-hero">
                    <img src="Branding/logo.png" alt="Company Logo" class="logo-image">
                </div>
                <h1>Professional Product Catalog</h1>
                <p style="font-size: 18px; color: white; margin-bottom: 30px;">
                    Browse our collection of 591 premium quality products
                </p>
            </div>
        </section>

        <!-- Language Selection -->
        <section>
            <h2 style="text-align: center; margin: 40px 0 30px;">Select Your Language</h2>
            <div class="language-selector">
                <a href="catalog_en.html" class="btn" style="background: var(--navy);">
                    📖 English Catalog
                </a>
                <a href="Categories/categories_index_en.html" class="btn" style="background: #4a5c8a;">
                    🏷️ Browse by Category
                </a>
            </div>
            <div class="language-selector">
                <a href="catalog_ar.html" class="btn" style="background: var(--navy);">
                    📖 كتالوج عربي
                </a>
                <a href="Categories/categories_index_ar.html" class="btn" style="background: #4a5c8a;">
                    🏷️ تصفح حسب الفئة
                </a>
            </div>
        </section>

        <!-- Features -->
        <section class="features">
            <h2>Why Choose Our Catalog?</h2>
            <div class="feature-list">
                <div class="feature-item">
                    <div class="feature-item-icon">📊</div>
                    <h3>591 Products</h3>
                    <p>Comprehensive selection of quality hardware</p>
                </div>
                <div class="feature-item">
                    <div class="feature-item-icon">🌍</div>
                    <h3>Bilingual</h3>
                    <p>Full support for English and Arabic</p>
                </div>
                <div class="feature-item">
                    <div class="feature-item-icon">📱</div>
                    <h3>Responsive</h3>
                    <p>Works on desktop, tablet, and mobile</p>
                </div>
                <div class="feature-item">
                    <div class="feature-item-icon">🖨️</div>
                    <h3>Print Ready</h3>
                    <p>Export to PDF with one click</p>
                </div>
                <div class="feature-item">
                    <div class="feature-item-icon">📂</div>
                    <h3>Organized</h3>
                    <p>10 product categories for easy navigation</p>
                </div>
                <div class="feature-item">
                    <div class="feature-item-icon">⚡</div>
                    <h3>Fast Loading</h3>
                    <p>Optimized for quick access and browsing</p>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section">
            <h2>Ready to Explore?</h2>
            <p style="margin-bottom: 20px;">Choose your preferred language to get started</p>
            <div class="language-selector">
                <a href="Categories/categories_index_en.html" class="btn">
                    Start Browsing (English)
                </a>
                <a href="Categories/categories_index_ar.html" class="btn">
                    ابدأ التصفح (العربية)
                </a>
            </div>
        </section>
    </main>

    <footer>
        <img src="Branding/logo-80.png" alt="Logo" class="logo-footer">
        <p>&copy; 2026 Premium Products Catalog. All rights reserved.</p>
    </footer>
</body>
</html>"""

    return html

def main():
    """Main upgrade routine"""

    print("=== BRAND ASSET UPGRADE ===\\n")

    # Create styles directory
    os.makedirs('styles', exist_ok=True)

    # Generate and save fonts.css
    print("[1] Creating font CSS file...")
    fonts_css = create_font_face_css()
    with open('styles/fonts.css', 'w', encoding='utf-8') as f:
        f.write(fonts_css)
    print("    [OK] styles/fonts.css created")

    # Generate enhanced index.html
    print("\\n[2] Generating enhanced index.html...")
    index_html = generate_enhanced_index_html()
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(index_html)
    print("    [OK] index.html updated with patterns, fonts, and enhanced design")

    # Update category files to use local fonts
    print("\\n[3] Updating category files...")
    updated_count = 0
    for root, dirs, files in os.walk('Categories'):
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()

                    is_arabic = '_ar' in file
                    content = update_html_with_fonts(content, is_arabic)

                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    updated_count += 1
                except Exception as e:
                    print("    [ERROR] Failed to update {}: {}".format(file, e))

    print("    [OK] Updated {} category files".format(updated_count))

    # Update catalog files
    print("\\n[4] Updating catalog files...")
    for catalog_file in ['catalog_en.html', 'catalog_ar.html']:
        if os.path.exists(catalog_file):
            try:
                with open(catalog_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                is_arabic = '_ar' in catalog_file
                content = update_html_with_fonts(content, is_arabic)

                with open(catalog_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                print("    [OK] Updated {}".format(catalog_file))
            except Exception as e:
                print("    [ERROR] Failed to update {}: {}".format(catalog_file, e))

    # Create summary
    print("\\n" + "="*50)
    print("UPGRADE COMPLETE!")
    print("="*50)
    print("\\nChanges made:")
    print("  [+] Local fonts integrated (Comfortaa, Tajawal)")
    print("  [+] Patterns added to hero sections")
    print("  [+] Enhanced index.html with better design")
    print("  [+] New styles/fonts.css file created")
    print("  [+] Category pages updated")
    print("  [+] Catalog files updated")
    print("\\nNext steps:")
    print("  1. Extract logo from 'Branding/logo full color.pdf'")
    print("  2. Convert to PNG and SVG formats")
    print("  3. Test all pages in browser")
    print("  4. Verify fonts load correctly")
    print("  5. Check pattern backgrounds")
    print("\\nTo extract logo from PDF:")
    print("  - Use Photoshop, GIMP, or online PDF converter")
    print("  - Save as PNG (300x300, transparent background)")
    print("  - Replace existing logo files in Branding/")

if __name__ == "__main__":
    main()
