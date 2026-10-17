# WOA Catalogue — project rules

Monorepo of three Next.js 14 apps that share one design-token file:

| App | Path | i18n |
|---|---|---|
| Store (woa-market) | `apps/store` | next-intl, `messages/{ar,en}.json`, `[locale]` routes |
| Brand site (ha-woa) | `apps/web` | next-intl, `messages/{ar,en}.json`, `[locale]` routes |
| Admin panel | `apps/admin` | in-house `lib/i18n.ts`, `messages/ar.json` (Arabic-only UI) |

Design tokens: `packages/ui/tokens.css` is the source of truth; it is copied verbatim to
`apps/{store,web,admin}/app/tokens.css`. Edit the package file, then copy it to all three.

## Rule 1 — No hardcoded text or colors (blocking)

This rule is not negotiable. Code that breaks it is not accepted, in review or from an agent.

**Text.** Every user-facing string lives in the app's `messages/*.json` and is read with
`t('namespace.key')` — JSX text, `aria-label`, `title`, `alt`, `placeholder`, metadata
(title/description), toast and error messages, WhatsApp/share message templates, and API
error responses.
- Store and web: `useTranslations` (client) / `getTranslations` (server, metadata, routes).
- Admin: `t()` from `@/lib/i18n`.
- API routes return a stable error **code** (`{ error: 'coupon_expired' }`); the client turns it
  into text with `t('errors.<code>')`.
- No `isAr ? 'x' : 'y'` / `locale === 'ar' ? …` string ternaries. Add a key to both
  `ar.json` and `en.json` instead. Data fields that already come per locale from the DB
  (`name_ar` / `name_en`) are data, not hardcoded text, and may be picked by locale.
- Brand names, product codes, phone numbers, and URLs are not translatable copy, but they
  still go in config/messages, not inline in components.

**Colors.** Every color is a `var(--token)` from `tokens.css` — no hex, `rgb()`, `rgba()`,
`hsl()` anywhere else (TSX inline styles, `globals.css`, SVG `fill`/`stroke` other than
`currentColor`). If a color is missing, add a semantic token to `packages/ui/tokens.css`
(light value in `:root`, dark value in `:root[data-theme="dark"]`) and copy it to the apps.

**Escape hatch.** Only for literals a browser API requires (e.g. `viewport.themeColor`,
web-manifest colors): add a trailing `// allow-hardcoded: <reason>` comment on that line.

**Enforcement.** `node scripts/check-hardcoded.mjs` (or `npm run lint:hardcoded` inside an
app) must print `✓`. It flags hardcoded colors, Arabic literals, per-locale string ternaries,
literal JSX text/attributes, and any `t('key')` whose key is missing from a locale file. CI
runs it on every push/PR (`.github/workflows/quality.yml`), together with a check that the
three `tokens.css` copies match `packages/ui/tokens.css`. Run it before finishing any UI change.

## Rule 2 — Theme

Light is the default theme. Dark applies only when the user picks it with the toggle
(`localStorage['woa-theme'] === 'dark'` → `html[data-theme="dark"]`). Never add
`@media (prefers-color-scheme: dark)` token overrides.

## Engineering standards

The full engineering rulebook (principles, architecture, security, testing, delivery
checklist) is in [docs/ENGINEERING_RULES.md](docs/ENGINEERING_RULES.md). Follow it for all work
in this repo.
