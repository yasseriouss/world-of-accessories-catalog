#!/usr/bin/env python3
"""
Process Extracted Logo - Create logo variants and favicons from extracted JPG images
"""

import os
from PIL import Image
import json

def find_logo_image():
    """Find the best logo image from extracted PDFs"""
    logo_candidates = [
        'Branding/logo full color/logo full color-1.jpg',
        'Branding/logo full color/logo full color-2.jpg',
        'Branding/1 color logo/1 color logo-01.jpg',
    ]

    for candidate in logo_candidates:
        if os.path.exists(candidate):
            print("[INFO] Found logo candidate: {}".format(candidate))
            return candidate

    return None

def load_image(filepath):
    """Load and verify image"""
    try:
        img = Image.open(filepath)
        print("[OK] Loaded image: {} ({} x {})".format(
            filepath, img.width, img.height))
        return img
    except Exception as e:
        print("[ERROR] Failed to load {}: {}".format(filepath, e))
        return None

def create_logo_variants(logo_img):
    """Create logo variants in different sizes"""

    sizes = [
        (300, 'logo.png', 'Full size (hero)'),
        (150, 'logo-150.png', 'Category headers'),
        (100, 'logo-100.png', 'Index cards'),
        (80, 'logo-80.png', 'Footers'),
    ]

    created_files = []

    for size, filename, description in sizes:
        try:
            # Create square logo
            if logo_img.width != logo_img.height:
                # Crop to square (centered)
                min_dim = min(logo_img.width, logo_img.height)
                left = (logo_img.width - min_dim) // 2
                top = (logo_img.height - min_dim) // 2
                logo_square = logo_img.crop((left, top, left + min_dim, top + min_dim))
            else:
                logo_square = logo_img

            # Resize
            logo_resized = logo_square.resize(
                (size, size),
                Image.Resampling.LANCZOS
            )

            # Convert to RGBA if needed (for transparency)
            if logo_resized.mode != 'RGBA':
                logo_resized = logo_resized.convert('RGBA')

            # Save
            filepath = os.path.join('Branding', filename)
            logo_resized.save(filepath, 'PNG', quality=95)
            print("[OK] Created {} - {} ({} x {})".format(
                filename, description, size, size))
            created_files.append(filepath)

        except Exception as e:
            print("[ERROR] Failed to create {}: {}".format(filename, e))

    return created_files

def create_favicon_variants(logo_img):
    """Create favicon variants"""

    favicon_sizes = [
        (64, 'favicon.ico', 'ICO format'),
        (32, 'favicon-32.png', '32px PNG'),
        (16, 'favicon-16.png', '16px PNG'),
        (180, 'apple-touch-icon.png', '180px iOS icon'),
    ]

    created_files = []

    # Prepare base icon
    if logo_img.width != logo_img.height:
        min_dim = min(logo_img.width, logo_img.height)
        left = (logo_img.width - min_dim) // 2
        top = (logo_img.height - min_dim) // 2
        icon_base = logo_img.crop((left, top, left + min_dim, top + min_dim))
    else:
        icon_base = logo_img

    for size, filename, description in favicon_sizes:
        try:
            # Resize
            icon = icon_base.resize(
                (size, size),
                Image.Resampling.LANCZOS
            )

            # Convert to RGBA
            if icon.mode != 'RGBA':
                icon = icon.convert('RGBA')

            # Save
            if filename.endswith('.ico'):
                # ICO format
                icon.save(filename, 'ICO')
            else:
                # PNG format
                icon.save(filename, 'PNG', quality=95)

            print("[OK] Created {} - {} ({} x {})".format(
                filename, description, size, size))
            created_files.append(filename)

        except Exception as e:
            print("[ERROR] Failed to create {}: {}".format(filename, e))

    return created_files

def verify_files():
    """Verify all logo files are in place"""
    required_files = [
        'Branding/logo.png',
        'Branding/logo-150.png',
        'Branding/logo-100.png',
        'Branding/logo-80.png',
        'favicon.ico',
        'favicon-32.png',
        'favicon-16.png',
        'apple-touch-icon.png',
    ]

    print("\n[VERIFICATION] Logo files status:")
    all_exist = True
    for filepath in required_files:
        exists = os.path.exists(filepath)
        status = "[OK]" if exists else "[MISSING]"
        size = os.path.getsize(filepath) if exists else 0
        print("  {} {} - {} bytes".format(status, filepath, size))
        if not exists:
            all_exist = False

    return all_exist

def generate_logo_manifest():
    """Generate a manifest of created logo files"""
    manifest = {
        "logo_files": {
            "Branding/logo.png": {
                "size": "300x300",
                "purpose": "Hero section logo",
                "usage": "index.html hero section"
            },
            "Branding/logo-150.png": {
                "size": "150x150",
                "purpose": "Category headers",
                "usage": "Category pages, index cards"
            },
            "Branding/logo-100.png": {
                "size": "100x100",
                "purpose": "Index cards, thumbnails",
                "usage": "Category selection pages"
            },
            "Branding/logo-80.png": {
                "size": "80x80",
                "purpose": "Footer logo",
                "usage": "Page footers, headers"
            }
        },
        "favicon_files": {
            "favicon.ico": {
                "size": "64x64",
                "format": "ICO",
                "purpose": "Multi-size browser favicon",
                "usage": "All HTML pages <head>"
            },
            "favicon-32.png": {
                "size": "32x32",
                "format": "PNG",
                "purpose": "Modern browser favicon",
                "usage": "All HTML pages <head>"
            },
            "favicon-16.png": {
                "size": "16x16",
                "format": "PNG",
                "purpose": "Legacy browser favicon",
                "usage": "All HTML pages <head>"
            },
            "apple-touch-icon.png": {
                "size": "180x180",
                "format": "PNG",
                "purpose": "iOS home screen icon",
                "usage": "All HTML pages <head>"
            }
        },
        "source": {
            "image": "Branding/logo full color/logo full color-1.jpg",
            "pdf": "Branding/logo full color.pdf",
            "extracted": "2026-10-08"
        }
    }

    # Save manifest
    with open('Documentation/logo_manifest.json', 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    print("\n[INFO] Logo manifest saved to: Documentation/logo_manifest.json")

    return manifest

def main():
    """Main logo processing routine"""

    print("=== PROCESS EXTRACTED LOGO ===\n")

    # Find logo image
    print("[STEP 1] Finding logo image...")
    logo_path = find_logo_image()

    if not logo_path:
        print("[ERROR] Could not find logo image")
        return False

    # Load image
    print("\n[STEP 2] Loading logo image...")
    logo_img = load_image(logo_path)

    if not logo_img:
        return False

    # Create logo variants
    print("\n[STEP 3] Creating logo variants...")
    logo_files = create_logo_variants(logo_img)
    print("  Created {} logo files".format(len(logo_files)))

    # Create favicon variants
    print("\n[STEP 4] Creating favicon variants...")
    favicon_files = create_favicon_variants(logo_img)
    print("  Created {} favicon files".format(len(favicon_files)))

    # Verify files
    print("\n[STEP 5] Verifying files...")
    all_verified = verify_files()

    if not all_verified:
        print("\n[WARNING] Some files may be missing")

    # Generate manifest
    print("\n[STEP 6] Generating manifest...")
    manifest = generate_logo_manifest()

    # Summary
    print("\n" + "="*50)
    print("LOGO PROCESSING COMPLETE!")
    print("="*50)
    print("\nSummary:")
    print("  Source: {}".format(logo_path))
    print("  Logo variants created: {}".format(len(logo_files)))
    print("  Favicon variants created: {}".format(len(favicon_files)))
    print("  Total new files: {}".format(len(logo_files) + len(favicon_files)))

    if all_verified:
        print("\nStatus: ALL FILES CREATED SUCCESSFULLY")
        print("\nNext steps:")
        print("  1. Test in browser (open index.html)")
        print("  2. Verify logo displays on all pages")
        print("  3. Check favicon in browser tab")
        print("  4. Test on mobile devices")
        print("  5. Deploy to production")
    else:
        print("\nStatus: SOME FILES MAY BE MISSING")
        print("Please check the verification output above")

    print("\nDocumentation:")
    print("  Manifest: Documentation/logo_manifest.json")
    print("  Guide: LOGO_EXTRACTION_GUIDE.md")

    return all_verified

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
