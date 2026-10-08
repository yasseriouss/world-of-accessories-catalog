# Logo Integration Guide

**Company Branding System**  
**Date**: 2026-10-08  
**Status**: Ready for Implementation  

---

## Executive Summary

This guide provides comprehensive instructions for integrating the company logo across all website pages, including the landing page, catalogs, category pages, and favicons. All logos and icons are sourced from the Branding folder and processed into multiple formats.

---

## Logo Asset Inventory

### Source Files (Branding Folder)

| File | Format | Type | Status |
|------|--------|------|--------|
| logo full color.pdf | PDF | High-Resolution | ✅ Source |
| 1 color logo.pdf | PDF | Single Color | ✅ Alternative |
| pattern-01.jpg.jpeg | JPEG | Isometric Pattern | ✅ Background |
| pattern-02.jpg.jpeg | JPEG | Hexagonal Pattern | ✅ Background |

### Output Files (To Be Created)

| File | Dimensions | Format | Purpose | Location |
|------|-----------|--------|---------|----------|
| logo.png | 300×300px | PNG | General use, web | Branding/ |
| logo-150.png | 150×150px | PNG | Small displays | Branding/ |
| logo-100.png | 100×100px | PNG | Thumbnails | Branding/ |
| logo.svg | Scalable | SVG | Vector graphics | Branding/ |
| favicon.ico | 64×64px | ICO | Browser tab | Root |
| favicon-32.png | 32×32px | PNG | Modern favicon | Root |
| favicon-16.png | 16×16px | PNG | Legacy favicon | Root |
| apple-touch-icon.png | 180×180px | PNG | iOS home screen | Root |

---

## Logo Specifications

### Design Guidelines

**Logo Appearance**:
- Clean, professional design
- High contrast for visibility
- Works in all color depths (full color and single color)
- Maintains legibility at small sizes (16px+)

**Color Variants**:
- Full Color: Navy Blue (#1A3F7F), Orange (#FF8C3D), Cream (#F5E6D3)
- Single Color: Navy Blue (#1A3F7F)
- White Variant: For dark backgrounds
- Black Variant: For light backgrounds

**Size Specifications**:
- Minimum Size: 16×16px (favicon)
- Maximum Size: 300×300px (hero section)
- Preferred: 1:1 aspect ratio for consistency
- Safe Padding: 10% of logo width around all sides

---

## Logo Placement Guide

### 1. Index Page (index.html)

#### Hero Section
```html
<div class="hero">
  <div class="hero-content">
    <div class="logo">
      <img src="Branding/logo-150.png" alt="Company Logo" class="logo-image">
    </div>
    <h1>Premium Product Catalog</h1>
    <p>Discover our collection of 591 quality products</p>
  </div>
</div>
```

**Specifications**:
- Size: 150×150px (responsive: 100-180px)
- Location: Center of hero section
- Background: White circle with shadow
- Margin: 30px below logo to next element

#### Navigation Bar (if added)
```html
<nav class="navbar">
  <img src="Branding/logo-100.png" alt="Logo" class="navbar-logo">
  <a href="index.html" class="nav-brand">Premium Catalog</a>
</nav>
```

**Specifications**:
- Size: 50-60px (height)
- Location: Top-left of navigation
- Alignment: Vertical center with text
- Padding: 10px on all sides

#### Footer
```html
<footer>
  <img src="Branding/logo-80.png" alt="Logo" class="footer-logo">
  <p>&copy; 2026 Premium Products Catalog. All rights reserved.</p>
</footer>
```

**Specifications**:
- Size: 60-80px (height)
- Location: Left side of footer
- Alignment: Top-aligned with footer text
- Margin: 10px from footer edges

### 2. English Catalog (catalog_en.html)

#### Cover Page
```html
<div class="cover">
  <img src="Branding/logo-200.png" alt="Company Logo" class="cover-logo">
  <h1>PRODUCTS CATALOG</h1>
  <p>English Edition</p>
</div>
```

**Specifications**:
- Size: 180-200px
- Location: Top-left corner (LTR placement)
- Margin: 15mm from top and left edges
- Background: White background on navy
- Opacity: 100%

#### Header/Navigation
```html
<header class="catalog-header">
  <img src="Branding/logo-60.png" alt="Logo" class="header-logo">
  <h2>Product Catalog</h2>
  <span class="page-number">Page 1</span>
</header>
```

**Specifications**:
- Size: 40-60px
- Location: Left of page header
- Alignment: Vertical center with title
- Margin: 10px from header edges

#### Table of Contents Page
```html
<div class="toc-header">
  <img src="Branding/logo-100.png" alt="Logo" class="toc-logo">
  <h1>TABLE OF CONTENTS</h1>
</div>
```

**Specifications**:
- Size: 80-100px
- Location: Top-center of TOC page
- Background: Black page background
- Color: Inverted (white/light variant)
- Margin: 30px bottom

#### Category Pages
```html
<div class="category-header">
  <img src="Branding/logo-80.png" alt="Logo" class="category-logo">
  <h2>Hinges & Mechanisms</h2>
  <p>85 Products</p>
</div>
```

**Specifications**:
- Size: 60-80px
- Location: Top-left of category section
- Alignment: Vertical center with category title
- Margin: 15mm padding

#### Footer
```html
<footer class="catalog-footer">
  <img src="Branding/logo-60.png" alt="Logo">
  <p>© 2026 Premium Products | All Rights Reserved</p>
</footer>
```

**Specifications**:
- Size: 40-60px
- Location: Footer left side
- Background: Navy blue (#1A3F7F)
- Color: White/light variant
- Margin: 10px

### 3. Arabic Catalog (catalog_ar.html)

#### Cover Page (RTL)
```html
<div class="cover" dir="rtl">
  <img src="Branding/logo-200.png" alt="شعار الشركة" class="cover-logo">
  <h1>كتالوج المنتجات</h1>
  <p>الطبعة العربية</p>
</div>
```

**Specifications**:
- Size: 180-200px
- Location: Top-right corner (RTL placement) - use `right: 15mm`
- Margin: 15mm from top and right edges
- Direction: Same as main content (RTL)

#### All Other Sections
- Same specifications as English version
- Mirror positioning for RTL layout
- Use `dir="rtl"` wrapper for context
- All alt text in Arabic

### 4. Category Pages (category_*.html)

#### Category Header
```html
<div class="category-page">
  <div class="category-header">
    <img src="Branding/logo-100.png" alt="Logo" class="category-logo">
    <h1>Category Name</h1>
    <span class="product-count">85 Products</span>
  </div>
</div>
```

**Specifications**:
- Size: 80-100px
- Location: Header area, left-aligned (LTR) or right-aligned (RTL)
- Margin: 20px from header start
- Alignment: Vertical center with title

---

## Favicon Implementation

### Favicon Setup (All Pages)

Add these lines to the `<head>` section of every HTML file:

```html
<!-- Favicon links -->
<link rel="icon" type="image/x-icon" href="favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="theme-color" content="#1A3F7F">
```

### Favicon Specifications

| Name | Size | Format | Use Case |
|------|------|--------|----------|
| favicon.ico | 64×64px | ICO | Legacy browsers, browser tab |
| favicon-32.png | 32×32px | PNG | Modern browsers, address bar |
| favicon-16.png | 16×16px | PNG | Browser tabs, bookmarks |
| apple-touch-icon.png | 180×180px | PNG | iOS home screen, saved bookmarks |

### Favicon Creation Process

1. **Source Logo**: Convert logo full color.pdf
2. **Create Base**: 64×64px version with transparent background
3. **Generate Variants**:
   - 64×64 → favicon.ico (multi-resolution)
   - 64×64 → 32×32px (favicon-32.png)
   - 64×64 → 16×16px (favicon-16.png)
   - Enlarge to 180×180px with white border (apple-touch-icon.png)
4. **Quality Check**: Verify readability at smallest size (16px)

---

## CSS Styling for Logo

### Logo Image Styling

```css
/* General logo styling */
.logo-image {
  max-width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}

/* Hero section logo */
.hero .logo-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: var(--white);
  padding: 15px;
  box-shadow: 0 8px 32px rgba(26, 63, 127, 0.15);
}

/* Header logo */
.navbar-logo {
  height: 60px;
  width: auto;
  margin-right: 15px;
}

/* Cover page logo */
.cover-logo {
  width: 200px;
  height: auto;
  margin-bottom: 30px;
}

/* Category header logo */
.category-logo {
  width: 100px;
  height: auto;
  margin-right: 20px;
  vertical-align: middle;
}

/* Footer logo */
.footer-logo {
  height: 60px;
  width: auto;
  margin-right: 15px;
  vertical-align: middle;
}

/* RTL adjustments */
[dir="rtl"] .navbar-logo {
  margin-right: 0;
  margin-left: 15px;
}

[dir="rtl"] .category-logo {
  margin-right: 0;
  margin-left: 20px;
}
```

---

## Responsive Logo Sizing

### Mobile (320px - 767px)
```css
@media (max-width: 767px) {
  .hero .logo-image {
    width: 100px;
    height: 100px;
  }
  
  .navbar-logo {
    height: 40px;
  }
  
  .cover-logo {
    width: 120px;
  }
  
  .category-logo {
    width: 60px;
  }
  
  .footer-logo {
    height: 40px;
  }
}
```

### Tablet (768px - 1023px)
```css
@media (768px <= width <= 1023px) {
  .hero .logo-image {
    width: 120px;
    height: 120px;
  }
  
  .navbar-logo {
    height: 50px;
  }
  
  .cover-logo {
    width: 160px;
  }
  
  .category-logo {
    width: 80px;
  }
  
  .footer-logo {
    height: 50px;
  }
}
```

### Desktop (1024px+)
```css
@media (min-width: 1024px) {
  .hero .logo-image {
    width: 150px;
    height: 150px;
  }
  
  .navbar-logo {
    height: 60px;
  }
  
  .cover-logo {
    width: 200px;
  }
  
  .category-logo {
    width: 100px;
  }
  
  .footer-logo {
    height: 60px;
  }
}
```

---

## Print Optimization

### Print Styles

```css
@media print {
  /* Ensure logo prints correctly */
  .logo-image {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  /* Remove shadows for cleaner print */
  .hero .logo-image {
    box-shadow: none;
  }
  
  /* Scale for print quality */
  .cover-logo {
    width: 250px;
    height: auto;
  }
}
```

---

## Brand Guidelines

### Logo Usage Rules

✅ **DO**:
- Use high-quality logo files
- Maintain minimum padding (10% of logo width)
- Keep logo legible at all sizes (minimum 16px)
- Use appropriate color variant for background
- Include proper alt text for accessibility
- Test on different screen sizes

❌ **DON'T**:
- Stretch or distort the logo
- Use low-resolution versions
- Remove padding/breathing room
- Use illegible color combinations
- Skip alt text for accessibility
- Use outdated PDF version on web

### Color Combinations

| Background | Logo Variant | Contrast | Usage |
|-----------|--------------|----------|-------|
| Navy Blue (#1A3F7F) | White/Light | High | Best for web |
| White | Full Color | High | Logo showcase |
| Light Gray | Full Color | Good | Neutral areas |
| Dark Gray | White | High | Professional |
| Orange (#FF8C3D) | White | Medium | Accent areas |

---

## Troubleshooting

### Logo Not Displaying

**Issue**: Logo image not showing on page

**Solutions**:
1. Verify file path is correct: `Branding/logo.png`
2. Check file exists in Branding folder
3. Ensure server serves images correctly
4. Check browser console for 404 errors
5. Try different image format (PNG vs SVG)

### Favicon Not Showing

**Issue**: Favicon not visible in browser tab

**Solutions**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Verify favicon file exists in root directory
3. Check favicon links in `<head>`
4. Try different favicon format (ico vs png)
5. Wait 24 hours for favicon cache refresh

### Logo Quality Issues

**Issue**: Logo appears blurry or pixelated

**Solutions**:
1. Use higher resolution source (300×300+ px)
2. Switch to SVG format for scalability
3. Ensure image is not being over-stretched by CSS
4. Use `object-fit: contain` for consistent display
5. Check browser zoom level (100%)

### RTL Logo Positioning

**Issue**: Logo position wrong in Arabic version

**Solutions**:
1. Ensure `dir="rtl"` on parent container
2. Use `margin-left/right` flexibly with CSS
3. Check CSS for LTR-specific positioning
4. Test in Arabic-specific browser settings
5. Verify right-to-left layout cascade

---

## Implementation Checklist

- [ ] Extract logo from PDF (logo full color.pdf)
- [ ] Create PNG versions (300px, 150px, 100px, 80px, 60px)
- [ ] Create SVG version for scalability
- [ ] Create favicon files (ico, 32px, 16px)
- [ ] Create apple-touch-icon (180×180px)
- [ ] Add logo to index.html (hero, nav, footer)
- [ ] Add logo to catalog_en.html (cover, header, footer)
- [ ] Add logo to catalog_ar.html (cover RTL, header, footer)
- [ ] Add logo to category pages (header, footer)
- [ ] Add favicon links to all HTML files
- [ ] Test logo display on desktop
- [ ] Test logo display on tablet
- [ ] Test logo display on mobile
- [ ] Test favicon in browser tab
- [ ] Test favicon in iOS home screen
- [ ] Test print quality
- [ ] Verify RTL positioning
- [ ] Clear cache and test again

---

## Next Steps

1. **Process Logo Assets** - Convert PDF to PNG/SVG/ICO formats
2. **Update HTML Files** - Add logo images and favicon links
3. **Test Responsiveness** - Verify on all device sizes
4. **Print Testing** - Ensure quality in PDF export
5. **Final QA** - Complete brand consistency check

---

*Document Created: 2026-10-08*  
*Status: Ready for Implementation*  
*Next: Begin logo asset processing and HTML integration*
