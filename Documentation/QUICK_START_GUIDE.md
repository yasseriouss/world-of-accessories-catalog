# Quick Start Guide

**Professional Bilingual Product Catalog System**  
**Getting Started in 5 Minutes**  

---

## Overview

This is a professional HTML/CSS product catalog website supporting:
- **English** (LTR layout)
- **Arabic** (RTL layout)
- **591 Products** organized into 10 categories
- **Mobile-Responsive** design
- **Print-Ready** PDF export

---

## Installation

### Option 1: Local Testing (Recommended)

1. **Download the project**
   ```
   Folder: C:\Users\yasse\Documents\Catalogue\
   ```

2. **Open in browser**
   - Double-click `index.html`
   - Or drag to any web browser
   - Or open from browser: File → Open

3. **Select language**
   - Click "English" or "العربية"
   - Browse products

### Option 2: Web Server

1. **Upload files to web server**
   ```
   /index.html
   /catalog_en.html
   /catalog_ar.html
   /Categories/
   /Branding/
   /favicon.*
   ```

2. **Access via browser**
   ```
   https://your-domain.com/
   ```

---

## File Structure

```
Catalogue/
├── index.html ..................... Landing page [START HERE]
├── catalog_en.html ................ Full English catalog
├── catalog_ar.html ................ Full Arabic catalog
│
├── Categories/
│   ├── categories_index_en.html .... English category listing
│   ├── categories_index_ar.html .... Arabic category listing
│   ├── category_01_en.html ......... Category pages (10 categories)
│   ├── category_01_ar.html
│   └── ... (20 category pages total)
│
├── Branding/
│   ├── logo.png, logo-150.png, ...
│   ├── pattern images
│   └── design files
│
└── Documentation/
    ├── README files
    ├── categories_data.json
    └── implementation guides
```

---

## Usage Guide

### 1. Landing Page (index.html)

**What to do**:
- Open `index.html` in your browser
- Choose your language: "English" or "العربية"

**What you'll see**:
- Company logo
- Professional branding
- Call-to-action buttons

### 2. Full Catalogs

#### English Catalog (`catalog_en.html`)
- **All 591 products** in one document
- A4-optimized pages (printable)
- Professional layout with:
  - Cover page
  - Table of contents
  - Product listings (2 columns per page)
  - Footer branding

#### Arabic Catalog (`catalog_ar.html`)
- **Same as English, but RTL**
- Arabic product names
- Right-to-left layout

**How to print**:
- Open in Chrome/Firefox
- Press Ctrl+P (or Cmd+P on Mac)
- Select "Save as PDF"
- Or print directly to printer

### 3. Category Navigation

**Two ways to browse by category**:

**Option A: Category Index Pages**
- `Categories/categories_index_en.html` (English)
- `Categories/categories_index_ar.html` (Arabic)
- Shows all 10 categories with product counts
- Click category to see products

**Option B: Direct Links**
- `Categories/category_01_en.html` = Hinges (English)
- `Categories/category_02_en.html` = Handles (English)
- `Categories/category_03_en.html` = Drawer Systems
- ... (and Arabic versions)

**Categories Available**:
1. Hinges (375 products)
2. Handles & Knobs (74 products)
3. Drawer Systems (63 products)
4. Support Arms (12 products)
5. Fasteners (10 products)
6. Edge Finishing (14 products)
7. Storage & Organization (19 products)
8. Cabinet Locks (0 products)
9. Tools & Brackets (24 products)
10. Premium & Specialty (0 products)

---

## Product Information

### Product Details
Each product shows:
- **Name** (English or Arabic)
- **Price** (in EGP)
- **Icon/Image** (placeholder)

### Example
```
Hinge Summit Soft Close 3D
62 EGP
[Product Icon]
```

### Searching Products
**No built-in search** (static HTML)
Use browser search:
- Press Ctrl+F (or Cmd+F on Mac)
- Type product name or keyword
- Highlight appears in yellow

---

## Browser Features

### Printing

1. **From any page**, press Ctrl+P
2. **Settings**:
   - Destination: Save as PDF (or printer)
   - Layout: Portrait
   - Margins: Default
   - Background graphics: ON
3. **Save** or **Print**

### Responsive Design

**Mobile (320px-767px)**
- Single column layout
- Larger touch targets
- Full-width buttons

**Tablet (768px-1023px)**
- Two-column grid
- Optimized spacing
- Touch-friendly

**Desktop (1024px+)**
- Professional layout
- Full navigation
- Image optimization

---

## Language Support

### English (LTR)
- Left-to-right text direction
- Logo positioned top-left
- Text aligns to left

### Arabic (RTL)
- Right-to-left text direction
- Logo positioned top-right
- Text aligns to right

**Browser support**:
- Automatic detection via `dir="rtl"` attribute
- Works in all modern browsers

---

## Common Tasks

### Task: Print a Category

1. Open category page (e.g., `category_01_en.html`)
2. Press Ctrl+P
3. Choose "Save as PDF"
4. Click "Save"

**Result**: Multi-page PDF with all products in category

### Task: Export All Products

1. Open `catalog_en.html` or `catalog_ar.html`
2. Press Ctrl+P
3. Choose printer or PDF
4. Click "Print" or "Save"

**Result**: 60-page PDF with all 591 products

### Task: Switch Languages

**From any page**:
1. Go back to `index.html`
2. Click opposite language button
3. Select same page type (catalog or category)

**Example**: `catalog_en.html` → index.html → العربية → `catalog_ar.html`

### Task: Find Specific Product

1. Open any catalog or category page
2. Press Ctrl+F (Find)
3. Type product name or keyword
4. Press Enter

**Result**: Product highlighted on page

---

## Troubleshooting

### Logo Not Showing

**Problem**: "X" icon instead of logo image

**Solution**:
1. Check file exists: `Branding/logo-*.png`
2. Refresh page (Ctrl+R or Cmd+R)
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try different browser

### Text Overlapping

**Problem**: Arabic text overlaps on some devices

**Solution**:
1. Zoom page in browser (Ctrl++ or Cmd++)
2. Try different browser
3. Check browser RTL support
4. Disable browser zoom (zoom = 100%)

### Page Not Loading

**Problem**: Blank page or 404 error

**Solution**:
1. Verify file path is correct
2. Check internet connection
3. Clear browser cache
4. Try incognito/private window
5. Try different browser

### Favicon Not Showing

**Problem**: No icon in browser tab

**Solution**:
1. Refresh page (Ctrl+R)
2. Clear cache (Ctrl+Shift+Delete)
3. Restart browser
4. Wait 24 hours (favicon cache)
5. Check file: `favicon.ico`

---

## Advanced Usage

### Regenerate HTML Files

If you modify `parsed_products.json`:

```bash
# Run the generator
python generate_professional_catalog_v2.py

# Uploads new Categories/ folder
```

### Update Product Categories

1. Edit `Documentation/categories_data.json`
2. Run: `python generate_professional_catalog_v2.py`
3. Re-upload `Categories/` folder

### Add New Logo

1. Replace files in `Branding/`:
   - `logo.png` (300×300)
   - `logo-150.png` (150×150)
   - `logo-100.png` (100×100)
   - `logo-80.png` (80×80)
2. Replace favicon files:
   - `favicon.ico`
   - `favicon-32.png`
   - `favicon-16.png`
   - `apple-touch-icon.png`

---

## Keyboard Shortcuts

| Action | Windows | Mac |
|--------|---------|-----|
| Find on page | Ctrl+F | Cmd+F |
| Print page | Ctrl+P | Cmd+P |
| Zoom in | Ctrl++ | Cmd++ |
| Zoom out | Ctrl+- | Cmd+- |
| Reset zoom | Ctrl+0 | Cmd+0 |
| Refresh page | Ctrl+R | Cmd+R |
| Hard refresh | Ctrl+Shift+R | Cmd+Shift+R |
| Clear cache | Ctrl+Shift+Delete | Cmd+Shift+Delete |
| Developer tools | F12 | Cmd+Option+I |

---

## Browser Requirements

### Minimum Requirements
- **HTML5** support
- **CSS3** support (grid, flexbox)
- **UTF-8** encoding
- **JavaScript** enabled (optional)

### Recommended Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile Browsers
- Chrome Mobile
- Safari Mobile (iOS)
- Firefox Mobile
- Samsung Internet

---

## Performance Tips

### Faster Loading
1. **Local file**: Double-click HTML (fastest)
2. **Use mobile network**: 4G/5G recommended
3. **Close other tabs**: Saves memory
4. **Disable extensions**: May slow down browser

### Faster Printing
1. **Disable images** in print settings (if only text needed)
2. **Use "Minimal" margins** in print settings
3. **Print to PDF** instead of printer
4. **Close other tabs** before printing

---

## Support & Documentation

### Files to Read
- **IMPLEMENTATION_PLAN.md** - Full project overview
- **PROJECT_ARCHITECTURE.md** - Technical design
- **LOGO_INTEGRATION_GUIDE.md** - Logo specifications
- **PRODUCT_CATEGORIES_ANALYSIS.md** - Category details

### Contact
For issues or questions:
- Check troubleshooting section above
- Review documentation files
- Check browser console (F12)

---

## Quick Reference

### Main Entry Points
| Purpose | File | Language |
|---------|------|----------|
| Start here | index.html | Select |
| Full catalog | catalog_en.html | English |
| Full catalog | catalog_ar.html | Arabic |
| By category (EN) | categories_index_en.html | English |
| By category (AR) | categories_index_ar.html | Arabic |

### Product Count by Category
| Category | English | Arabic | Total |
|----------|---------|--------|-------|
| Hinges | 375 | 375 | 375 |
| Handles | 74 | 74 | 74 |
| Drawers | 63 | 63 | 63 |
| Support | 12 | 12 | 12 |
| Fasteners | 10 | 10 | 10 |
| Edge Finishing | 14 | 14 | 14 |
| Storage | 19 | 19 | 19 |
| Locks | 0 | 0 | 0 |
| Tools | 24 | 24 | 24 |
| Premium | 0 | 0 | 0 |
| **TOTAL** | **591** | **591** | **591** |

---

## Conclusion

You now have everything needed to:
- ✅ Browse 591 products
- ✅ View in English or Arabic
- ✅ Search by category
- ✅ Print to PDF
- ✅ Export for sharing

**Start with `index.html` and choose your language!**

---

*Guide Created: 2026-10-08*  
*Version: 1.0*  
*Status: Ready to Use*
