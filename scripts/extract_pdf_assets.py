#!/usr/bin/env python3
"""
PDF Asset Extractor - Extract logo and branding assets from PDF files
Supports multiple extraction methods
"""

import os
import subprocess
import sys

def try_import_library(library_name, package_name=None):
    """Attempt to import a library, return None if not available"""
    if package_name is None:
        package_name = library_name
    try:
        __import__(library_name)
        return True
    except ImportError:
        return False

def extract_with_ghostscript(pdf_file, output_prefix):
    """Extract images using Ghostscript (gs command)"""
    print("  Attempting Ghostscript method...")

    try:
        cmd = [
            'gs',
            '-sDEVICE=png16m',
            '-r150',
            '-o', output_prefix + '_%d.png',
            pdf_file
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)

        if result.returncode == 0:
            print("    [OK] Ghostscript extraction successful")
            return True
        else:
            print("    [ERROR] Ghostscript failed: {}".format(result.stderr))
            return False
    except FileNotFoundError:
        print("    [ERROR] Ghostscript not installed")
        return False
    except Exception as e:
        print("    [ERROR] {}".format(e))
        return False

def extract_with_imagemagick(pdf_file, output_prefix):
    """Extract images using ImageMagick (convert command)"""
    print("  Attempting ImageMagick method...")

    try:
        cmd = [
            'convert',
            '-density', '150',
            '-quality', '95',
            pdf_file,
            output_prefix + '.png'
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)

        if result.returncode == 0:
            print("    [OK] ImageMagick extraction successful")
            return True
        else:
            print("    [ERROR] ImageMagick failed: {}".format(result.stderr))
            return False
    except FileNotFoundError:
        print("    [ERROR] ImageMagick not installed")
        return False
    except Exception as e:
        print("    [ERROR] {}".format(e))
        return False

def extract_with_pypdf(pdf_file, output_prefix):
    """Extract images using PyPDF2 library"""
    print("  Attempting PyPDF2 method...")

    try:
        from PyPDF2 import PdfReader

        reader = PdfReader(pdf_file)
        extracted_count = 0

        for page_idx, page in enumerate(reader.pages):
            if "/XObject" in page["/Resources"]:
                xobject = page["/Resources"]["/XObject"].get_object()
                for obj_name in xobject:
                    obj = xobject[obj_name].get_object()
                    if obj["/Subtype"] == "/Image":
                        data = obj.get_data()
                        filename = "{}_page_{}.png".format(output_prefix, page_idx)
                        with open(filename, 'wb') as f:
                            f.write(data)
                        extracted_count += 1

        if extracted_count > 0:
            print("    [OK] PyPDF2 extracted {} images".format(extracted_count))
            return True
        else:
            print("    [ERROR] No images found in PDF")
            return False
    except ImportError:
        print("    [ERROR] PyPDF2 not installed")
        return False
    except Exception as e:
        print("    [ERROR] {}".format(e))
        return False

def extract_with_pdf2image(pdf_file, output_prefix):
    """Extract images using pdf2image library"""
    print("  Attempting pdf2image method...")

    try:
        from pdf2image import convert_from_path
        from PIL import Image

        images = convert_from_path(pdf_file, dpi=150)

        for page_idx, image in enumerate(images):
            filename = "{}_{}.png".format(output_prefix, page_idx)
            image.save(filename, 'PNG')

        print("    [OK] pdf2image extracted {} pages".format(len(images)))
        return True
    except ImportError:
        print("    [ERROR] pdf2image or Pillow not installed")
        return False
    except Exception as e:
        print("    [ERROR] {}".format(e))
        return False

def extract_pdf_logo(pdf_file):
    """Attempt to extract logo from PDF using multiple methods"""

    if not os.path.exists(pdf_file):
        print("[ERROR] File not found: {}".format(pdf_file))
        return False

    print("\\n[EXTRACTING] Logo from: {}".format(pdf_file))

    output_prefix = pdf_file.replace('.pdf', '')

    # Try extraction methods in order
    methods = [
        ('ImageMagick', extract_with_imagemagick),
        ('Ghostscript', extract_with_ghostscript),
        ('pdf2image', extract_with_pdf2image),
        ('PyPDF2', extract_with_pypdf),
    ]

    for method_name, method_func in methods:
        if method_func(pdf_file, output_prefix):
            print("  [SUCCESS] Used {} method".format(method_name))
            return True

    print("\\n[FAILED] Could not extract using available methods")
    return False

def create_logo_converter_guide():
    """Create a detailed guide for manual logo extraction"""

    guide = """
===============================================
HOW TO EXTRACT LOGO FROM PDF
===============================================

Since automatic extraction may not work, follow these manual steps:

OPTION 1: Using Adobe Acrobat Reader
---------------------------------------
1. Open 'Branding/logo full color.pdf' in Adobe Acrobat Reader
2. Right-click on the logo image
3. Select "Export Image"
4. Choose PNG format
5. Save as 'Branding/logo.png'

OPTION 2: Using Photoshop
--------------------------
1. File > Open > Select 'Branding/logo full color.pdf'
2. Right-click on the logo
3. Export As...
4. Format: PNG
5. Settings:
   - Size: 300 x 300 pixels
   - Background: Transparent
6. Save as 'Branding/logo.png'

OPTION 3: Using Online Tool
----------------------------
1. Visit: https://www.pdftoimage.com/
2. Upload: 'Branding/logo full color.pdf'
3. Select PNG format
4. Download the extracted image
5. Rename to 'Branding/logo.png'

OPTION 4: Using Command Line (Linux/Mac)
-----------------------------------------
Install ImageMagick:
  brew install imagemagick  (Mac)
  apt-get install imagemagick  (Linux)

Extract logo:
  convert -density 300 Branding/logo\ full\ color.pdf -quality 95 Branding/logo.png

REQUIRED LOGO SIZES
===================
After extracting, create these sizes:

1. logo.png          300 x 300 px  (Hero section)
2. logo-150.png      150 x 150 px  (Category headers)
3. logo-100.png      100 x 100 px  (Index cards)
4. logo-80.png       80 x 80 px    (Footers)
5. favicon.ico       64 x 64 px    (Browser tab)
6. favicon-32.png    32 x 32 px    (Modern browsers)
7. favicon-16.png    16 x 16 px    (Legacy browsers)

EASY RESIZE USING ONLINE TOOLS
==============================
1. Visit: https://www.iloveimg.com/resize-image
2. Upload logo.png
3. Resize to each size listed above
4. Save with appropriate name

OR use Python PIL:
------------------
from PIL import Image

img = Image.open('Branding/logo.png')
img.thumbnail((150, 150), Image.Resampling.LANCZOS)
img.save('Branding/logo-150.png')

IMPORTANT REQUIREMENTS
======================
✓ Background: Transparent (PNG format)
✓ Quality: High resolution (300+ DPI)
✓ Aspect Ratio: Square (1:1) preferred
✓ Format: PNG with alpha channel

AFTER EXTRACTION
================
1. Place files in Branding/ folder:
   Branding/logo.png
   Branding/logo-150.png
   Branding/logo-100.png
   Branding/logo-80.png

2. Place favicon files in root:
   favicon.ico
   favicon-32.png
   favicon-16.png
   apple-touch-icon.png

3. Test in browser:
   Open index.html
   Verify logo displays on all sections

===============================================
"""

    # Save guide
    with open('LOGO_EXTRACTION_GUIDE.txt', 'w', encoding='utf-8') as f:
        f.write(guide)

    print(guide)

def main():
    """Main extraction routine"""

    print("\\n=== PDF ASSET EXTRACTION ===\\n")

    # Check if Ghostscript or ImageMagick is installed
    has_gs = False
    has_convert = False

    try:
        subprocess.run(['gs', '--version'], capture_output=True, check=True)
        has_gs = True
    except:
        pass

    try:
        subprocess.run(['convert', '--version'], capture_output=True, check=True)
        has_convert = True
    except:
        pass

    print("[INFO] System capabilities:")
    print("  Ghostscript installed: {}".format("Yes" if has_gs else "No"))
    print("  ImageMagick installed: {}".format("Yes" if has_convert else "No"))
    print("  PyPDF2 available: {}".format("Yes" if try_import_library('PyPDF2') else "No"))
    print("  pdf2image available: {}".format("Yes" if try_import_library('pdf2image') else "No"))

    # Attempt extraction
    print("\\n[PROCESS] Attempting logo extraction...")

    pdf_file = 'Branding/logo full color.pdf'

    success = extract_pdf_logo(pdf_file)

    if not success:
        print("\\n[INFO] Automatic extraction not available")
        print("[ACTION] Please follow manual extraction instructions below")
        create_logo_converter_guide()
    else:
        print("\\n[SUCCESS] Logo extraction completed!")
        print("\\n[NEXT] Create logo variants:")
        print("  1. Resize extracted logo to: 300x300, 150x150, 100x100, 80x80")
        print("  2. Create favicon versions: 64x64, 32x32, 16x16")
        print("  3. Save all in Branding/ and root folders")

    print("\\n[INFO] Guide saved to: LOGO_EXTRACTION_GUIDE.txt")

if __name__ == "__main__":
    main()
