# 🏗️ Two-Site Architecture - Technical Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      GitHub Repository                          │
│        world-of-accessories-catalog (main branch)               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    Git Push (automatic)
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
        ▼                                         ▼
┌──────────────────────┐            ┌──────────────────────┐
│   Vercel Project 1   │            │   Vercel Project 2   │
│   accessories-world  │            │   admin-accessories  │
└──────────┬───────────┘            └──────────┬───────────┘
           │                                   │
           ├─ Root: apps/ecommerce            ├─ Root: apps/dashboard
           ├─ Config: vercel.json             ├─ Config: vercel.json
           └─ Auto-deploys on push            └─ Auto-deploys on push
           │                                   │
        Build                               Build
           │                                   │
           ▼                                   ▼
    ┌──────────────────┐            ┌──────────────────┐
    │   E-Commerce     │            │  Admin Dashboard │
    │     Website      │            │     Interface    │
    └──────────────────┘            └──────────────────┘
           │                                   │
           │                                   │
    https://accessories-world               https://admin-
    .vercel.app                          accessories.vercel.app
           │                                   │
           ├─ Landing Page (/landing)        ├─ Admin Panel (/admin)
           ├─ Marketplace (/market)          ├─ Dashboard Home (/)
           ├─ Catalog (/catalog)             ├─ Product Manager
           ├─ About (/about)                 ├─ Catalog Generator
           ├─ Printed Catalogs (/print)      └─ Statistics Panel
           └─ Categories (10 pages)
```

## Deployment Flow

```
┌─────────────────┐
│  Local Changes  │
│  git add .      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  git commit     │
│  with message   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  git push origin main   │
│  (to GitHub)            │
└────────┬────────────────┘
         │
         ├─ webhook ──┐
         │            │
         ▼            ▼
    ┌─────────┐  ┌──────────┐
    │ E-Com   │  │ Dashboard│
    │ Build   │  │  Build   │
    └────┬────┘  └────┬─────┘
         │            │
         ▼            ▼
    ┌─────────┐  ┌──────────┐
    │ Deploy  │  │ Deploy   │
    │ Live    │  │ Live     │
    └─────────┘  └──────────┘
```

## File Organization

```
Catalogue/
│
├── 📁 apps/
│   │
│   ├── 🛒 ecommerce/
│   │   ├── 📄 index.html          (Landing)
│   │   ├── 📄 landing.html        (Alt Landing)
│   │   ├── 📄 market.html         (Marketplace)
│   │   ├── 📄 about.html          (About)
│   │   ├── 📄 printed_catalogs.html
│   │   ├── 📁 Categories/         (20 pages)
│   │   │   ├── category_01_ar.html
│   │   │   ├── category_01_en.html
│   │   │   ├── ... (10 categories × 2 languages)
│   │   │   └── categories_index_*.html
│   │   ├── 📁 Branding/           (Shared assets)
│   │   │   ├── *.png              (Logos)
│   │   │   ├── *.ttf              (Fonts)
│   │   │   ├── *.pdf              (Brand PDFs)
│   │   │   └── pattern-*.jpeg     (Design patterns)
│   │   ├── 📁 styles/
│   │   │   └── fonts.css
│   │   ├── 📁 static/
│   │   │   ├── css/               (CSS files)
│   │   │   └── js/                (JavaScript)
│   │   ├── 📄 catalog_ar.html     (Full catalog)
│   │   ├── 📄 catalog_en.html     (Full catalog)
│   │   ├── 📄 vercel.json         (Config)
│   │   ├── 📄 manifest.json       (PWA)
│   │   ├── 📄 manifest_en.json    (PWA)
│   │   └── 📄 README.md
│   │
│   └── 📊 dashboard/
│       ├── 📄 index.html          (Dashboard home)
│       ├── 📄 admin.html          (Admin panel)
│       ├── 📁 Branding/           (Shared assets)
│       ├── 📁 styles/
│       ├── 📁 static/
│       ├── 📄 manifest.json       (PWA)
│       ├── 📄 manifest_en.json    (PWA)
│       ├── 📄 vercel.json         (Config)
│       └── 📄 README.md
│
├── 📄 vercel.json                (Monorepo root)
├── 📄 .vercelignore              (Ignore rules)
├── 📄 README.md                  (Main docs)
├── 📄 DEPLOYMENT.md              (Deploy guide)
├── 📄 MIGRATION_SUMMARY.md       (Migration notes)
├── 📄 ARCHITECTURE.md            (This file)
│
└── [Original files]              (Kept for reference)
    ├── catalog_generator/
    ├── data/
    ├── Documentation/
    └── deploy/
```

## Routing Configuration

### E-Commerce Routes
```json
{
  "rewrites": [
    { "/market" → "/market.html" },
    { "/catalog" → "/market.html" },
    { "/landing" → "/landing.html" },
    { "/about" → "/about.html" },
    { "/print" → "/printed_catalogs.html" },
    { "/" → "/index.html" }
  ]
}
```

### Admin Dashboard Routes
```json
{
  "rewrites": [
    { "/admin" → "/admin.html" },
    { "/" → "/index.html" }
  ]
}
```

## Security Headers (Both Sites)

```
Cache-Control: public, max-age=0, must-revalidate
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Cross-Site Communication

### From E-Commerce to Admin
```html
<a href="https://admin-accessories.vercel.app" target="_blank">
  Admin Panel
</a>
```

### From Admin to E-Commerce
```html
<a href="https://accessories-world.vercel.app" target="_blank">
  View Store
</a>
```

## Shared Assets Strategy

Assets are **duplicated** in each deployment:
- Each site has its own `/Branding` folder
- Each site has its own `/styles` folder
- Each site has its own `/static` folder

**Benefit**: Complete independence, no inter-site dependencies

**Trade-off**: Slightly larger repo, but better performance isolation

## Performance Considerations

### E-Commerce Optimizations
- Large static files (catalogs)
- Extensive product images
- Optimized for search engines
- Fast initial load

### Admin Dashboard Optimizations
- Minimal assets
- Fast admin operations
- Real-time updates
- Secure access

## Environment Variables (Future)

```bash
# E-Commerce
VITE_APP_NAME=accessories-world
VITE_ADMIN_URL=https://admin-accessories.vercel.app
VITE_STORE_NAME=عالم الاكسسوار

# Admin Dashboard
VITE_APP_NAME=admin-accessories
VITE_STORE_URL=https://accessories-world.vercel.app
VITE_ADMIN_PIN=2026
```

## Database Integration (Optional)

Both sites can integrate with:
- **Supabase** - Product data, orders, analytics
- **Firebase** - Real-time inventory, notifications
- **MongoDB** - Product catalog, categories

Connected via:
- REST API endpoints
- Environment variables
- Secure keys in Vercel

## Scaling Path

### Phase 1 (Current)
✅ Static HTML + Vercel (no backend)

### Phase 2 (Recommended)
- Add headless CMS for content
- Integrate e-commerce backend
- Real-time admin updates

### Phase 3 (Enterprise)
- Separate API server
- Database backend
- Real-time notifications
- Advanced analytics

---

**Last Updated**: 2026-10-12  
**Architecture Version**: 2.0 (Monorepo with Separate Vercel Deployments)
