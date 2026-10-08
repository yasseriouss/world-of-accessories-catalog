# Logo Extraction Guide

**How to Extract Logo from PDF and Create Brand Assets**

---

## Quick Summary

The catalog system has been upgraded with:
- [x] Local fonts (Comfortaa for English, Tajawal for Arabic)
- [x] Pattern backgrounds integrated
- [x] Enhanced UI design
- [x] Professional styling
- [ ] Logo extracted from PDF (manual step needed)

**Current Status**: Placeholder logo files are in use. Follow this guide to extract the actual logo from the PDF and replace them.

---

## Why Manual Extraction?

Automatic PDF extraction requires:
- Ghostscript (not available on this system)
- ImageMagick (not available on this system)
- Poppler (not available on this system)

These tools are platform-specific. The easiest solution is to use online tools or professional software.

---

## Method 1: Online PDF to Image Tool (EASIEST)

**No software installation needed!**

### Steps:

1. **Visit**: https://www.pdftoimage.com/

2. **Upload File**:
   - Click "Upload Files"
   - Select: `Branding/logo full color.pdf`

3. **Configure**:
   - Format: PNG
   - Quality: High (95%)
   - DPI: 150-300

4. **Convert & Download**:
   - Click "Convert to PNG"
   - Download the extracted image

5. **Save Logo**:
   - Rename file to: `logo.png`
   - Place in: `Branding/` folder

---

## Method 2: Resize Logo Variants (AFTER Extraction)

After you have `logo.png`, create these sizes:

### Online Tool Approach:

1. **Visit**: https://www.iloveimg.com/resize-image

2. **For Each Size**:
   - Upload `logo.png`
   - Resize to required dimensions
   - Download
   - Save with corresponding name

3. **Required Sizes**:
   ```
   logo-150.png      150 x 150 px  (Category headers)
   logo-100.png      100 x 100 px  (Index cards)
   logo-80.png       80 x 80 px    (Footers)
   favicon-32.png    32 x 32 px    (Browser tab - modern)
   favicon-16.png    16 x 16 px    (Browser tab - legacy)
   apple-touch-icon.png  180x180px (iOS home screen)
   favicon.ico       64 x 64 px    (Favicon multi-size)
   ```

---

## Method 3: Using Photoshop (If Available)

### Steps:

1. **Open PDF**:
   - File → Open
   - Select: `Branding/logo full color.pdf`
   - Choose: First page (if prompted)

2. **Export Logo**:
   - Select the logo image
   - Right-click → Copy
   - File → New → Paste as new document

3. **Resize and Save**:
   - Image → Image Size
   - Width: 300px
   - Height: 300px
   - Ensure: Background transparent
   - File → Export As...
   - Format: PNG
   - Name: `logo.png`
   - Location: `Branding/`

4. **Create Variants**:
   - Image → Scale Image
   - For each required size (150, 100, 80, etc.)
   - Export with corresponding filename

---

## Method 4: Using GIMP (Free Software)

### Installation:

**Windows**:
- Download from: https://www.gimp.org/download/
- Run installer
- Follows onscreen instructions

**Alternative (Portable)**:
- No installation needed
- Download portable version
- Extract and run directly

### Steps:

1. **Open PDF**:
   - File → Open as Layers
   - Select: `Branding/logo full color.pdf`
   - Resolution: 300 DPI

2. **Crop to Logo**:
   - Select crop tool
   - Select just the logo
   - Image → Crop to Selection

3. **Resize**:
   - Image → Scale Image
   - Width: 300px
   - Lock aspect ratio
   - Interpolation: Cubic

4. **Export**:
   - File → Export As
   - Format: PNG
   - Name: `logo.png`
   - Location: `Branding/`
   - Check: Interlacing (Adam7)

5. **Create Variants**:
   - Edit → Scale Image (for each size)
   - Export with new filename

---

## Method 5: Command Line (Linux/Mac)

**Windows Users**: Not applicable (requires Unix tools)

### Prerequisites:

```bash
# Install ImageMagick (Mac)
brew install imagemagick

# Install ImageMagick (Linux)
sudo apt-get install imagemagick
```

### Extract:

```bash
convert -density 300 "Branding/logo full color.pdf" \
  -quality 95 -background none \
  "Branding/logo.png"
```

### Resize:

```bash
# 150px version
convert Branding/logo.png -resize 150x150 Branding/logo-150.png

# 100px version
convert Branding/logo.png -resize 100x100 Branding/logo-100.png

# 80px version
convert Branding/logo.png -resize 80x80 Branding/logo-80.png
```

---

## Important Requirements

### Logo Quality

- **Format**: PNG (with transparent background)
- **Background**: Transparent (not white)
- **Color Mode**: RGB or RGBA
- **Size**: 300x300px minimum
- **DPI**: 150+ recommended

### Transparency

The logo MUST have a transparent background:
- [ ] Background is NOT white (#FFFFFF)
- [ ] Background is transparent (checkered in editors)
- [ ] All edges are clean (no artifacts)

### File Naming

Exact filenames required (case-sensitive):
```
Branding/logo.png          (300x300)
Branding/logo-150.png      (150x150)
Branding/logo-100.png      (100x100)
Branding/logo-80.png       (80x80)
favicon.ico                (root directory)
favicon-32.png             (root directory)
favicon-16.png             (root directory)
apple-touch-icon.png       (root directory)
```

---

## File Placement

After extraction and resizing:

```
Branding/
├── logo.png           (NEW - replace placeholder)
├── logo-150.png       (NEW - replace placeholder)
├── logo-100.png       (NEW - replace placeholder)
├── logo-80.png        (NEW - replace placeholder)
├── logo full color.pdf (existing source)
└── ...

Root/
├── favicon.ico        (NEW - replace placeholder)
├── favicon-32.png     (NEW - replace placeholder)
├── favicon-16.png     (NEW - replace placeholder)
├── apple-touch-icon.png (NEW - replace placeholder)
└── index.html
```

---

## Testing

After placing new logo files:

### 1. Check Images Load

- Open `index.html` in browser
- Verify logo displays in hero section
- Check logo in header and footer

### 2. Check All Pages

- Browse to `Categories/categories_index_en.html`
- Check logo in header
- Check logo in footer
- Verify on category pages

### 3. Check Favicon

- Open any page
- Check browser tab icon
- On iOS: Add to home screen, verify icon

### 4. Check Patterns

- Verify pattern backgrounds load
- Check hero section background
- Verify no visual artifacts

---

## Troubleshooting

### Logo Looks Pixelated

**Problem**: Logo appears blurry or low-quality

**Solution**:
- Ensure DPI is 150+ when extracting
- Use 300x300px minimum
- Try re-extracting with higher quality

### Logo Has White Background

**Problem**: Logo has white background instead of transparent

**Solution**:
- Open in GIMP or Photoshop
- Select → By Color → Click white area
- Edit → Clear
- File → Export as PNG (with transparency)

### Browser Tab Icon Not Showing

**Problem**: Favicon doesn't appear

**Solution**:
- Hard refresh browser (Ctrl+Shift+R)
- Clear cache (Ctrl+Shift+Delete)
- Try different browser
- Wait 24 hours (browser favicon cache)

### Logo Not Resizing Properly

**Problem**: Resized logos look stretched or distorted

**Solution**:
- Ensure aspect ratio is locked during resize
- Use 1:1 ratio (square dimensions)
- Try interpolation: Lanczos (high quality)

---

## Quick Reference Table

| File | Size | Where | Purpose |
|------|------|-------|---------|
| logo.png | 300×300 | Branding/ | Hero section |
| logo-150.png | 150×150 | Branding/ | Category headers |
| logo-100.png | 100×100 | Branding/ | Index cards |
| logo-80.png | 80×80 | Branding/ | Footers |
| favicon.ico | 64×64 | Root | Browser tab |
| favicon-32.png | 32×32 | Root | Modern browsers |
| favicon-16.png | 16×16 | Root | Legacy browsers |
| apple-touch-icon.png | 180×180 | Root | iOS home screen |

---

## Next Steps After Extraction

1. [x] Extract logo from PDF
2. [x] Create logo variants (150, 100, 80 px)
3. [x] Create favicon versions
4. [ ] Place files in correct folders
5. [ ] Test in all browsers
6. [ ] Verify on mobile devices
7. [ ] Check print preview
8. [ ] Deploy to production

---

## Support Resources

### Free Online Tools
- **PDF to Image**: https://www.pdftoimage.com/
- **Image Resizer**: https://www.iloveimg.com/resize-image
- **Favicon Generator**: https://www.favicon-generator.org/
- **Transparency Remover**: https://www.remove.bg/

### Free Software
- **GIMP**: https://www.gimp.org/
- **ImageMagick**: https://imagemagick.org/

### Professional Tools
- **Adobe Photoshop**: https://www.adobe.com/products/photoshop
- **Affinity Photo**: https://affinity.serif.com/photo/

---

## Questions?

If you encounter issues:
1. Check this guide again
2. Review "Troubleshooting" section
3. Try a different extraction method
4. Use professional software (Photoshop/GIMP)

---

*Guide Created: 2026-10-08*  
*Status: Ready to Follow*  
*Difficulty: Easy (uses online tools)*
