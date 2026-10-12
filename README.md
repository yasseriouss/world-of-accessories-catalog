# World of Accessories

Three independent static apps in one repository, all backed by one Supabase project.

| App | Folder | Vercel project | Purpose |
|---|---|---|---|
| Landing | `apps/landing` | `woa-store` (ha-woa.vercel.app) | Public entry page that leads to the market (design to be replaced) |
| Market | `apps/market` | `woa-market` (woa-market.vercel.app) | Product catalog, cart, WhatsApp ordering |
| Dashboard | `apps/dashboard` | `admin-accessories` (woa-admin.vercel.app) | Full control: products, categories, banners, landing content, media |

## Data (Supabase)

| Table / bucket | Used by | Managed from |
|---|---|---|
| `woa_products`, `woa_categories` | market | dashboard: Products / Categories |
| `woa_banners` | market announcement bar | dashboard: Banners |
| `woa_settings` (`landing`, `site`) | landing, market | dashboard: Site content |
| bucket `product-images` | all | dashboard: any image field / Media library |

Reads are public. Writes require the admin Auth user and are enforced by RLS
(`public.is_woa_admin()`; change the admin email there).

## Images

Uploads are resized to max 1600px and re-encoded to WebP in the browser, then stored in the
`product-images` bucket (max 5 MB, JPG/PNG/WEBP/GIF).

## Landing content binding

Any element on the landing page can be bound to dashboard content:

```html
<h1 data-cms="hero_title">fallback text</h1>            <!-- hero_title_ar / hero_title_en by language -->
<a data-cms-href="tel:{phone}">call</a>
<img data-cms-src="hero_image" alt="">
<section data-cms-bg="hero_image"></section>
```

Add new keys from the dashboard under *Site content -> additional fields*.

## Deploy

Push to `main`. Each Vercel project builds its own root directory with no build step.
Heartbeat for the free Supabase tier: `scripts/supabase-heartbeat.mjs` (GitHub Actions workflow, needs the
`SUPABASE_URL` and `SUPABASE_ANON_KEY` repository secrets).

Cross-app URLs live in `apps/market/market.html`, `apps/landing/*.html` and `apps/dashboard/static/js/admin.js`
(`LANDING_ORIGIN`, `MARKET_ORIGIN`).
