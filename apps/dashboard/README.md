# 📊 World of Accessories - Admin Dashboard

Private admin control panel for managing products, catalogs, and system administration.

## Features

- 🔐 PIN-protected access (Default: 2026)
- 📦 Product management (CRUD operations)
- 🖼️ Image upload and management
- 📝 Catalog generation and management
- 📊 Statistics and analytics dashboard
- ⚡ One-click catalog generation
- 🎯 Real-time product updates
- 📋 Category management
- 🔄 Sync with e-commerce site

## Access

- **URL**: `/admin`
- **Default PIN**: `2026`
- **Protected**: Yes (requires authentication)

## Security

- PIN-based authentication
- Session management
- Secure headers configured
- Same-origin policy enforced

## Deployment

This app is deployed independently to Vercel.

```bash
# Local development
cd apps/dashboard

# Deploy
vercel deploy
```

## Environment

- **Production URL**: `https://admin-accessories.vercel.app`
- **Preview**: Auto-deployed on pull requests

## Configuration

See `vercel.json` for deployment routing and headers.

## Quick Links

- 🏠 Landing Page: `/` (on main site)
- 🛒 E-Commerce: `https://accessories-world.vercel.app`
- 📖 Catalogs: `/print`
- ℹ️ About: `/about`
