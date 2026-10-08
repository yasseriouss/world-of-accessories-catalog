#!/usr/bin/env python3
"""
Create Branded Catalogs - Enhanced cover and TOC with brand colors and fonts
"""

import json
import os

def generate_enhanced_catalog_en():
    """Generate enhanced English catalog with branded cover and TOC"""

    html = """<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Professional Product Catalog</title>
    <link rel="stylesheet" href="styles/fonts.css">
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
    <link rel="apple-touch-icon" href="apple-touch-icon.png">
    <meta name="theme-color" content="#1A3F7F">

    <style>
        /* ============ CSS VARIABLES ============ */
        :root {
            --navy: #1A3F7F;
            --orange: #FF8C3D;
            --cream: #F5E6D3;
            --white: #FFFFFF;
            --gray: #F5F5F5;
            --dark-gray: #2a2a2a;
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
            font-family: 'Comfortaa', Arial, sans-serif;
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

        /* ============ ENHANCED COVER PAGE ============ */
        .page.cover {
            background: linear-gradient(135deg, var(--navy) 0%, var(--orange) 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .page.cover::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200"><defs><pattern id="dots" x="30" y="30" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="30" cy="30" r="8" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="1200" height="1200" fill="url(%23dots)"/></svg>');
            opacity: 0.3;
        }

        .cover-content {
            z-index: 10;
            position: relative;
            max-width: 500px;
        }

        .cover-logo {
            width: 200px;
            height: 200px;
            margin: 0 auto 40px;
            background: var(--white);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
        }

        .cover-logo img {
            width: 180px;
            height: 180px;
            object-fit: contain;
        }

        .cover h1 {
            font-size: 52px;
            font-weight: 700;
            margin-bottom: 20px;
            color: var(--white);
            text-transform: uppercase;
            letter-spacing: 3px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }

        .cover-subtitle {
            font-size: 16px;
            color: var(--cream);
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 600;
        }

        .cover-info {
            font-size: 14px;
            color: var(--white);
            line-height: 1.8;
            margin-top: 40px;
            padding-top: 30px;
            border-top: 2px solid var(--orange);
        }

        .cover-info p {
            margin: 8px 0;
        }

        .cover-footer {
            position: absolute;
            bottom: 20mm;
            left: 15mm;
            right: 15mm;
            font-size: 11px;
            color: var(--cream);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .cover-footer-logo {
            width: 40px;
            height: 40px;
            background: var(--white);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .cover-footer-logo img {
            width: 35px;
            height: 35px;
            object-fit: contain;
        }

        /* ============ ENHANCED TABLE OF CONTENTS ============ */
        .page.toc {
            background: linear-gradient(135deg, var(--navy) 0%, #0d2551 100%);
            color: var(--white);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .page.toc::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, var(--orange) 0%, transparent 70%);
            opacity: 0.15;
            border-radius: 50%;
        }

        .toc-header {
            position: relative;
            z-index: 10;
            text-align: center;
            padding-top: 20mm;
            margin-bottom: 20mm;
        }

        .toc-header::before {
            content: '';
            display: inline-block;
            width: 60px;
            height: 4px;
            background: var(--orange);
            margin-bottom: 15px;
        }

        .toc-header h1 {
            font-size: 48px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .toc-header p {
            font-size: 14px;
            color: var(--cream);
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .toc-content {
            position: relative;
            z-index: 10;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .toc-items {
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: 90%;
            max-width: 600px;
            margin: 0 auto;
        }

        .toc-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 20px;
            background: rgba(255, 255, 255, 0.05);
            border-left: 4px solid var(--orange);
            border-radius: 2px;
            font-size: 13px;
            transition: all 0.3s ease;
        }

        .toc-item:hover {
            background: rgba(255, 140, 61, 0.1);
            padding-left: 25px;
        }

        .toc-item-name {
            flex: 1;
            font-weight: 600;
            color: var(--white);
        }

        .toc-item-count {
            font-size: 12px;
            color: var(--cream);
            margin: 0 15px;
            font-weight: 500;
        }

        .toc-page {
            font-weight: 700;
            color: var(--orange);
            min-width: 35px;
            text-align: right;
        }

        .toc-footer {
            position: relative;
            z-index: 10;
            text-align: center;
            padding-top: 20mm;
            border-top: 2px solid var(--orange);
            margin-top: 20mm;
        }

        .toc-footer p {
            font-size: 11px;
            color: var(--cream);
            line-height: 1.6;
        }

        /* ============ CATALOG HEADER ============ */
        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 3px solid var(--navy);
        }

        .page-header img {
            width: 50px;
            height: 50px;
            object-fit: contain;
        }

        .page-title {
            font-size: 18px;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--navy);
            letter-spacing: 1px;
            flex: 1;
            text-align: center;
        }

        .page-number {
            font-size: 12px;
            color: var(--orange);
            font-weight: 700;
        }

        /* ============ PRODUCT GRID ============ */
        .product-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            flex: 1;
        }

        .product-card {
            padding: 12px;
            border: 1px solid var(--border);
            border-radius: 6px;
            text-align: center;
            background: var(--gray);
            transition: all 0.3s ease;
        }

        .product-card:hover {
            box-shadow: 0 4px 12px rgba(26, 63, 127, 0.1);
            border-color: var(--navy);
        }

        .product-avatar {
            width: 70px;
            height: 70px;
            margin: 0 auto 8px;
            background: var(--white);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            border: 2px solid var(--navy);
        }

        .product-name {
            font-size: 12px;
            font-weight: 600;
            color: var(--text);
            margin-bottom: 6px;
            line-height: 1.3;
        }

        .product-price {
            font-size: 13px;
            color: var(--orange);
            font-weight: 700;
        }

        /* ============ PAGE FOOTER ============ */
        .page-footer {
            margin-top: auto;
            padding-top: 15px;
            border-top: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: var(--text);
        }

        .page-footer img {
            width: 40px;
            height: 40px;
            object-fit: contain;
        }

        /* ============ PRINT STYLES ============ */
        @media print {
            body {
                background: white;
                padding: 0;
            }

            .page {
                box-shadow: none;
                margin-bottom: 0;
                page-break-inside: avoid;
            }

            .product-card {
                page-break-inside: avoid;
            }
        }

        /* ============ RESPONSIVE ============ */
        @media screen and (max-width: 768px) {
            .page {
                width: 100%;
                height: auto;
                padding: 10mm;
            }

            .product-grid {
                grid-template-columns: 1fr;
            }

            .cover h1 {
                font-size: 32px;
            }

            .toc-header h1 {
                font-size: 32px;
            }
        }
    </style>
</head>
<body>

<!-- ENHANCED COVER PAGE -->
<div class="page cover">
    <div class="cover-content">
        <div class="cover-logo">
            <img src="Branding/logo.png" alt="Company Logo">
        </div>
        <h1>PRODUCT CATALOG</h1>
        <p class="cover-subtitle">Professional Quality Hardware</p>
        <div class="cover-info">
            <p>591 Premium Products</p>
            <p>10 Organized Categories</p>
            <p>Professional Excellence</p>
        </div>
    </div>
    <div class="cover-footer">
        <div>
            <p>&copy; 2026 | Premium Products</p>
            <p>Professional Catalog System</p>
        </div>
        <div class="cover-footer-logo">
            <img src="Branding/logo-80.png" alt="Logo">
        </div>
    </div>
</div>

<!-- ENHANCED TABLE OF CONTENTS -->
<div class="page toc">
    <div class="toc-header">
        <h1>TABLE OF CONTENTS</h1>
        <p>10 Categories | 591 Products</p>
    </div>

    <div class="toc-content">
        <div class="toc-items">
            <div class="toc-item">
                <span class="toc-item-name">01. Hinges</span>
                <span class="toc-item-count">85 products</span>
                <span class="toc-page">2</span>
            </div>
            <div class="toc-item">
                <span class="toc-item-name">02. Handles & Knobs</span>
                <span class="toc-item-count">72 products</span>
                <span class="toc-page">12</span>
            </div>
            <div class="toc-item">
                <span class="toc-item-name">03. Drawer Systems</span>
                <span class="toc-item-count">95 products</span>
                <span class="toc-page">22</span>
            </div>
            <div class="toc-item">
                <span class="toc-item-name">04. Support Arms</span>
                <span class="toc-item-count">64 products</span>
                <span class="toc-page">32</span>
            </div>
            <div class="toc-item">
                <span class="toc-item-name">05. Fasteners & Installation</span>
                <span class="toc-item-count">78 products</span>
                <span class="toc-page">37</span>
            </div>
            <div class="toc-item">
                <span class="toc-item-name">06. Edge Finishing</span>
                <span class="toc-item-count">68 products</span>
                <span class="toc-page">44</span>
            </div>
            <div class="toc-item">
                <span class="toc-item-name">07. Storage & Organization</span>
                <span class="toc-item-count">54 products</span>
                <span class="toc-page">51</span>
            </div>
            <div class="toc-item">
                <span class="toc-item-name">08. Cabinet Locks</span>
                <span class="toc-item-count">41 products</span>
                <span class="toc-page">57</span>
            </div>
            <div class="toc-item">
                <span class="toc-item-name">09. Tools & Brackets</span>
                <span class="toc-item-count">48 products</span>
                <span class="toc-page">61</span>
            </div>
            <div class="toc-item">
                <span class="toc-item-name">10. Premium & Specialty</span>
                <span class="toc-item-count">36 products</span>
                <span class="toc-page">67</span>
            </div>
        </div>
    </div>

    <div class="toc-footer">
        <p>All products professionally curated and tested</p>
        <p>For detailed specifications and ordering, see individual category pages</p>
    </div>
</div>

<!-- SAMPLE PRODUCT PAGE (showing new header styling) -->
<div class="page">
    <div class="page-header">
        <img src="Branding/logo-80.png" alt="Logo">
        <h2 class="page-title">Hinges & Mechanisms</h2>
        <span class="page-number">Page 2</span>
    </div>

    <div class="product-grid">
        <div class="product-card">
            <div class="product-avatar">📌</div>
            <div class="product-name">Hinge Summit Soft Close</div>
            <div class="product-price">62 EGP</div>
        </div>

        <div class="product-card">
            <div class="product-avatar">📌</div>
            <div class="product-name">Hinge Palma 3D Overlay</div>
            <div class="product-price">45 EGP</div>
        </div>

        <div class="product-card">
            <div class="product-avatar">📌</div>
            <div class="product-name">Hinge Turkish Heavy Duty</div>
            <div class="product-price">55 EGP</div>
        </div>

        <div class="product-card">
            <div class="product-avatar">📌</div>
            <div class="product-name">Hinge Summit Standard</div>
            <div class="product-price">38 EGP</div>
        </div>

        <div class="product-card">
            <div class="product-avatar">📌</div>
            <div class="product-name">Hinge Blum Soft Close</div>
            <div class="product-price">85 EGP</div>
        </div>

        <div class="product-card">
            <div class="product-avatar">📌</div>
            <div class="product-name">Hinge Premium Designer</div>
            <div class="product-price">125 EGP</div>
        </div>

        <div class="product-card">
            <div class="product-avatar">📌</div>
            <div class="product-name">Hinge Danko Universal</div>
            <div class="product-price">52 EGP</div>
        </div>

        <div class="product-card">
            <div class="product-avatar">📌</div>
            <div class="product-name">Hinge Clip-On System</div>
            <div class="product-price">48 EGP</div>
        </div>

        <div class="product-card">
            <div class="product-avatar">📌</div>
            <div class="product-name">Hinge Spring Loaded</div>
            <div class="product-price">58 EGP</div>
        </div>

        <div class="product-card">
            <div class="product-avatar">📌</div>
            <div class="product-name">Hinge Ball Bearing</div>
            <div class="product-price">72 EGP</div>
        </div>
    </div>

    <div class="page-footer">
        <img src="Branding/logo-80.png" alt="Logo">
        <span>&copy; 2026 Professional Products</span>
    </div>
</div>

</body>
</html>"""

    return html

def main():
    """Create enhanced branded catalog"""

    print("Creating enhanced branded English catalog...\n")

    catalog_en = generate_enhanced_catalog_en()

    # Save English catalog
    with open('catalog_en_branded.html', 'w', encoding='utf-8') as f:
        f.write(catalog_en)
    print("[OK] Created: catalog_en_branded.html")

    print("\n[INFO] This is a preview with enhanced branding:")
    print("  ✓ Navy & Orange gradient cover")
    print("  ✓ Professional logo in hero circle")
    print("  ✓ Enhanced TOC with category details")
    print("  ✓ Orange accent lines and hover effects")
    print("  ✓ Brand colors throughout")
    print("  ✓ Local fonts (Comfortaa)")
    print("  ✓ Improved spacing and typography")
    print("\nOpen 'catalog_en_branded.html' in browser to preview")
    print("\nTo apply to full catalog:")
    print("  Replace catalog_en.html header and TOC sections")
    print("  Apply same styling to all 600+ products")
    print("  Create Arabic RTL version (catalog_ar_branded.html)")

if __name__ == "__main__":
    main()
