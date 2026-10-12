# Deployment Guide - World of Accessories

## 📋 Overview

This project is now structured as a **monorepo** with two independent Vercel deployments:

### 1. E-Commerce Website (`apps/ecommerce`)
- **Purpose**: Public-facing product catalog and marketplace
- **Vercel Project**: `accessories-world` (or similar)
- **URL**: `https://accessories-world.vercel.app`
- **Features**: Landing page, marketplace, product catalog, about page
- **Root Directory**: `apps/ecommerce`

### 2. Admin Dashboard (`apps/dashboard`)
- **Purpose**: Private admin control panel
- **Vercel Project**: `admin-accessories` (or similar)
- **URL**: `https://admin-accessories.vercel.app`
- **Features**: Product management, catalog generation, analytics
- **Root Directory**: `apps/dashboard`

## 🚀 Deployment Steps

### Initial Setup (One-Time)

1. **Connect GitHub Repository**
   ```bash
   # Ensure your GitHub remote is set
   git remote -v
   ```

2. **Create Vercel Projects**
   - Go to https://vercel.com
   - Import from GitHub
   - Create two separate projects:
     - **Project 1**: E-Commerce (Root: `apps/ecommerce`)
     - **Project 2**: Dashboard (Root: `apps/dashboard`)

3. **Configure Project Settings**
   - Set "Root Directory" to the respective app path
   - Use the `vercel.json` from each app directory
   - No build command needed (static files)
   - Output directory: `.`

### Continuous Deployment

The projects are configured for **automatic deployment** on:
- ✅ Push to `main` branch
- ✅ Pull request creation (preview deployments)
- ✅ Manual redeploy from Vercel dashboard

### Manual Deployment

If needed, deploy using the Vercel CLI:

```bash
# Deploy e-commerce
cd apps/ecommerce
vercel deploy --prod

# Deploy dashboard
cd apps/dashboard
vercel deploy --prod
```

## 📁 Project Structure

```
Catalogue/
├── apps/
│   ├── ecommerce/
│   │   ├── index.html           # Landing page
│   │   ├── landing.html         # Alternative landing
│   │   ├── market.html          # Marketplace
│   │   ├── about.html           # About page
│   │   ├── printed_catalogs.html # Catalog center
│   │   ├── Branding/            # Shared brand assets
│   │   ├── styles/              # Global CSS
│   │   ├── static/              # JS files
│   │   ├── vercel.json          # Routing & headers
│   │   └── README.md
│   │
│   └── dashboard/
│       ├── index.html           # Dashboard home
│       ├── admin.html           # Admin panel
│       ├── Branding/            # Shared brand assets
│       ├── styles/              # Global CSS
│       ├── static/              # JS files
│       ├── vercel.json          # Routing & headers
│       └── README.md
│
├── vercel.json                  # Root monorepo config
├── .vercelignore               # Deployment exclusions
├── DEPLOYMENT.md               # This file
├── README.md                   # Project overview
└── [Other project files]
```

## 🔗 Linking & Communication

### Cross-Site Links

**From Dashboard to E-Commerce:**
```html
<a href="https://accessories-world.vercel.app" target="_blank">
  Open Store
</a>
```

**From E-Commerce to Dashboard:**
```html
<a href="https://admin-accessories.vercel.app" target="_blank">
  Admin Panel
</a>
```

### Shared Assets

Both sites reference the same asset files:
- `Branding/` - Logos, fonts, brand images
- `styles/` - Common CSS files
- `static/` - JavaScript utilities

**Note**: Assets are copied to each deployment directory to ensure independence.

## 🔒 Security Considerations

1. **Dashboard Authentication**
   - Protected by PIN (default: 2026)
   - Client-side validation only (consider backend auth for production)

2. **Headers Configuration**
   - `X-Frame-Options: SAMEORIGIN`
   - `X-Content-Type-Options: nosniff`
   - `X-XSS-Protection: 1; mode=block`
   - `Referrer-Policy: strict-origin-when-cross-origin`

3. **CORS Settings**
   - Static files allow `*` origin (CDN-friendly)
   - Pages enforce strict `must-revalidate`

## 🐛 Troubleshooting

### Deployment Fails
1. Check `.vercelignore` for conflicts
2. Ensure both apps have their own `vercel.json`
3. Verify "Root Directory" is set correctly in Vercel dashboard

### Styles Not Loading
1. Check asset paths in HTML (should be root-relative: `/styles/...`)
2. Clear browser cache
3. Check `vercel.json` cache headers

### Images Not Showing
1. Verify `/Branding/` folder exists in both apps
2. Check image file names are correct
3. Ensure proper URL encoding for special characters

### Cross-Site Links Not Working
1. Use full URLs (`https://domain.vercel.app`)
2. Add `target="_blank"` to open in new tab
3. Check CORS headers if making API calls

## 📊 Analytics & Monitoring

- Monitor deployments at https://vercel.com/dashboard
- Check deployment logs for errors
- Use Vercel's analytics to track usage
- View error logs in Vercel dashboard

## 🔄 Updates & Maintenance

### Updating Content
1. Make changes locally
2. Test in browser
3. Commit and push to GitHub
4. Vercel auto-deploys within seconds

### Updating Assets
1. Replace files in `Branding/`, `styles/`, or `static/`
2. Changes sync to both deployments
3. Consider cache invalidation if needed

### Versioning
- Use Git tags for releases
- Tag format: `v1.0.0`
- Document major changes in CHANGELOG

## 📝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# ... edit files ...

# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: add new feature"

# Push to GitHub
git push origin feature/new-feature

# Create Pull Request and wait for preview deployment
# Merge when ready - auto-deploys to production
```

## ✅ Pre-Deployment Checklist

- [ ] Changes tested locally
- [ ] No console errors in browser
- [ ] Images and assets loading correctly
- [ ] Links working properly
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] HTML validated (W3C standards)
- [ ] CSS working without errors
- [ ] Security headers configured
- [ ] Performance optimized (file sizes)
- [ ] Git commit message descriptive

---

**Last Updated**: 2026-10-12
**Maintainer**: Yasser Sallam (Yasserious)
