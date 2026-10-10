#!/usr/bin/env python3
"""
Logo Asset Creator - generates placeholder logo files
Note: In production, replace these with actual PDF-to-PNG conversions
"""

import os

def create_placeholder_images():
    """Create placeholder logo images"""
    os.makedirs('Branding', exist_ok=True)

    # Create simple placeholder PNG files with minimal data
    # Format: tiny 1x1 Navy blue PNG
    png_header = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde'
    png_data = b'\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05E\x9e\xb8\x0e'
    png_end = b'\x00\x00\x00\x00IEND\xaeB`\x82'
    png_content = png_header + png_data + png_end

    files_to_create = [
        ('Branding/logo.png', 'Logo 300x300px'),
        ('Branding/logo-150.png', 'Logo 150x150px'),
        ('Branding/logo-100.png', 'Logo 100x100px'),
        ('Branding/logo-80.png', 'Logo 80x80px'),
        ('favicon-32.png', 'Favicon 32x32px'),
        ('favicon-16.png', 'Favicon 16x16px'),
        ('apple-touch-icon.png', 'Apple touch icon 180x180px'),
    ]

    for filepath, desc in files_to_create:
        with open(filepath, 'wb') as f:
            f.write(png_content)
        print("[OK] Created {}".format(desc))

    # ICO file (multi-size favicon)
    ico_content = (
        b'\x00\x00\x01\x00\x01\x00 \x20\x10\x00\x01\x00\x18\x00\x88\x02\x00'
        b'\x00\x16\x00\x00\x00(\x00\x00\x00 \x00\x00\x00@\x00\x00\x00\x01'
        b'\x00\x18\x00\x00\x00\x00\x00\x00\x02\x00\x00\x00\x00\x00\x00\x00'
        b'\x00\x00\x00\x00\x00\x00\x00\x1a?\x7f\x00\x1a?\x7f\x00' * 200
    )
    with open('favicon.ico', 'wb') as f:
        f.write(ico_content[:512])
    print("[OK] Created favicon.ico")

def update_index_html_with_logo():
    """Update index.html to use real logo"""
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            content = f.read()

        # Replace emoji logo with image
        content = content.replace('🎨', '<img src="Branding/logo-150.png" alt="Logo" class="logo-image">')

        # Add favicon links if not present
        if 'favicon' not in content:
            favicon_links = '''    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
    <link rel="apple-touch-icon" href="apple-touch-icon.png">
    <meta name="theme-color" content="#1A3F7F">
'''
            content = content.replace('</head>', favicon_links + '</head>')

        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(content)
        print("[OK] Updated index.html with logo references")
    except Exception as e:
        print("[ERROR] Failed to update index.html: {}".format(e))

def update_catalog_html_with_logo():
    """Update catalog files with logo references"""
    catalog_files = ['catalog_en.html', 'catalog_ar.html']

    for filename in catalog_files:
        if not os.path.exists(filename):
            continue

        try:
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()

            # Add favicon links
            if 'favicon' not in content:
                favicon_links = '''    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
    <link rel="apple-touch-icon" href="apple-touch-icon.png">
    <meta name="theme-color" content="#1A3F7F">
'''
                content = content.replace('</head>', favicon_links + '</head>')

            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
            print("[OK] Updated {} with favicon links".format(filename))
        except Exception as e:
            print("[ERROR] Failed to update {}: {}".format(filename, e))

if __name__ == "__main__":
    print("Creating logo assets...")
    create_placeholder_images()
    print("\nUpdating HTML files with logo references...")
    update_index_html_with_logo()
    update_catalog_html_with_logo()
    print("\nLogo asset creation complete!")
