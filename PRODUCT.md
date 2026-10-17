# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Three audiences, served equally (confirmed 2026-10-18):
- **Homeowners** fitting out a kitchen or dressing room, buying a few items, often on mobile, in Arabic.
- **Carpenters and workshops** who know specs, reorder by product code, and care about price and stock.
- **Interior designers, kitchen factories and contractors** who need B2B quotes and volume supply.

The brand site (apps/web) leads with designers and trade; the store (apps/store) serves homeowners and carpenters; the admin panel (apps/admin) serves WOA staff.

## Product Purpose
WOA (عالم الاكسسوار) supplies furniture and kitchen hardware in Egypt: hinges, slides, handles, gas struts and closet mechanisms used in wooden kitchens, dressing rooms and interior fit-outs. Success is customers finding the right fitting quickly and ordering online, by WhatsApp, or through a B2B quote.

## Positioning
A physical showroom in Silla Mall, 6th of October, with stock ready to ship nationwide and inspection before payment. (Inferred from site copy; confirm before using as a headline claim.)

## Operating Context
Arabic-first (RTL) with English. Orders by cart checkout, WhatsApp, or B2B quote form. Cash on delivery, InstaPay, Vodafone Cash, bank transfer. Staff manage orders, B2B quotes, products, coupons, reviews, blog and banners in the admin panel.

## Capabilities and Constraints
- Next.js 14 monorepo: apps/store, apps/web, apps/admin; Supabase backend.
- **Scope: hardware only for now.** WOA also deals in wood boards and design/execution services, but the sites focus on hardware; wood, kitchens, dressing rooms and interior design are the context and setting, not products for sale.
- Light theme is the default; dark only by user toggle.
- No hardcoded text or colors (CLAUDE.md Rule 1, enforced by scripts/check-hardcoded.mjs).

## Brand Commitments
Name: عالم الاكسسوار / WOA. Matte-gold accent (#B08D2E) on warm off-white. Fonts: IBM Plex Sans Arabic + Inter. Logo and fonts in Branding/.

## Evidence on Hand
- Product photos in Supabase storage (catalogue-images bucket).
- **Licensed stock interior photography is approved** (free-license sources such as Unsplash) for wooden kitchens, closets and interiors.
- Figures used on the site today: 590+ products, 80,000 tested hinge cycles, 27 governorates, 10 hours daily. No testimonials, client logos or press exist; do not invent them.

## Product Principles
1. Find the right fitting fast: by room, by product type, or by code.
2. Show hardware in the wooden rooms it belongs to.
3. Trust before purchase: real stock, a real showroom, inspection before payment.
4. One system across the three apps.
