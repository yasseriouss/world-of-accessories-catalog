---
version: alpha
name: IKEA
description: IKEA Global presents a warm, plain-spoken retail system. Near-black ink (#111111) sits on an off-white canvas (#FFFEFB) that feels soft rather than clinical. IKEA yellow (#FFDB00) is the signature accent, used on promotional surfaces and highlight blocks. Pale yellow and orange tints support it as secondary fills. A deep green marks positive or availability actions, and the long footer drops into solid black with white links. Type is a single humanist sans family across the whole system. Headlines are heavy and tightly tracked, from an 82px hero down to 36px section titles, with relaxed 1.5–1.8 line-heights for body and small print. Corners are consistently softened at 8px.
omitted:
  - section: spacing
    reason: No component measurement was verified and no section rhythm was measured to derive spacing from
colors:
  primary: "#FFDB00"
  primary-tint: "#FFF094"
  ink: "#111111"
  ink-black: "#000000"
  ink-soft: "#333333"
  muted: "#818181"
  hairline: "#DADADA"
  surface: "#FFFEFB"
  surface-dark: "#000000"
  on-primary: "#111111"
  on-dark: "#FFFFFF"
  success: "#1A7E3B"
  accent-orange: "#FFAE66"
  link: "#0000EE"
typography:
  hero-display:
    fontFamily: Omani Rial
    fontSize: 82.2857px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -3.55102px
  display-lg:
    fontFamily: Omani Rial
    fontSize: 45.7143px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -1.59184px
  display-md:
    fontFamily: Omani Rial
    fontSize: 36.5714px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -1.10204px
  display-md-relaxed:
    fontFamily: Omani Rial
    fontSize: 36.5714px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -1.10204px
  body-lg:
    fontFamily: Omani Rial
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: normal
  body:
    fontFamily: Omani Rial
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: normal
  body-strong:
    fontFamily: Omani Rial
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: normal
  label-strong:
    fontFamily: Omani Rial
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: normal
  button:
    fontFamily: Omani Rial
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: normal
  body-sm:
    fontFamily: Omani Rial
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: normal
  button-sm:
    fontFamily: Omani Rial
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: normal
  caption:
    fontFamily: Omani Rial
    fontSize: 13.7143px
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: 0.0612245px
  micro:
    fontFamily: Omani Rial
    fontSize: 13.3333px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: normal
rounded:
  md: 8px
components:
  button-secondary:
    backgroundColor: "#FFDB00"
    textColor: "#111111"
    typography:
      fontFamily: "\"Omani Rial\", \"Emirati Dirham\", \"Saudi Riyal\", \"Noto IKEA\", \"Noto Sans JP\", \"Noto Sans KR\", \"Noto Sans SC\", \"Noto Sans TC\", \"Noto Sans\", Roboto, \"Open Sans\", system-ui, sans-serif"
      fontSize: 16px
      fontWeight: 400
      lineHeight: 16px
    height: 100px
  button-secondary-group-2:
    textColor: "#111111"
    typography:
      fontFamily: "\"Omani Rial\", \"Emirati Dirham\", \"Saudi Riyal\", \"Noto IKEA\", \"Noto Sans JP\", \"Noto Sans KR\", \"Noto Sans SC\", \"Noto Sans TC\", \"Noto Sans\", Roboto, \"Open Sans\", system-ui, sans-serif"
      fontSize: 16px
      fontWeight: 400
      lineHeight: 16px
  button-secondary-label-2:
    textColor: "#111111"
    typography:
      fontFamily: "\"Omani Rial\", \"Emirati Dirham\", \"Saudi Riyal\", \"Noto IKEA\", \"Noto Sans JP\", \"Noto Sans KR\", \"Noto Sans SC\", \"Noto Sans TC\", \"Noto Sans\", Roboto, \"Open Sans\", system-ui, sans-serif"
      fontSize: 16px
      fontWeight: 700
      lineHeight: 16px
  button-secondary-icon:
    height: 9px
    width: 16px
  button-secondary-hover:
    backgroundColor: "#FFF094"
  button-ghost:
    backgroundColor: "#111111"
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"Omani Rial\", \"Emirati Dirham\", \"Saudi Riyal\", \"Noto IKEA\", \"Noto Sans JP\", \"Noto Sans KR\", \"Noto Sans SC\", \"Noto Sans TC\", \"Noto Sans\", Roboto, \"Open Sans\", system-ui, sans-serif"
      fontSize: 13.3333px
      fontWeight: 400
    height: 56px
  button-ghost-icon:
    height: 14px
    width: 12px
  button-ghost-label:
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"Omani Rial\", \"Emirati Dirham\", \"Saudi Riyal\", \"Noto IKEA\", \"Noto Sans JP\", \"Noto Sans KR\", \"Noto Sans SC\", \"Noto Sans TC\", \"Noto Sans\", Roboto, \"Open Sans\", system-ui, sans-serif"
      fontSize: 13.3333px
      fontWeight: 400
  button-ghost-hover:
    backgroundColor: "#333333"
  button-ghost-2:
    backgroundColor: "#FFFFFF"
    textColor: "#111111"
    typography:
      fontFamily: "\"Omani Rial\", \"Emirati Dirham\", \"Saudi Riyal\", \"Noto IKEA\", \"Noto Sans JP\", \"Noto Sans KR\", \"Noto Sans SC\", \"Noto Sans TC\", \"Noto Sans\", Roboto, \"Open Sans\", system-ui, sans-serif"
      fontSize: 13.3333px
      fontWeight: 400
    height: 56px
  button-ghost-2-icon:
    height: 14px
    width: 12px
  button-ghost-2-label:
    textColor: "#111111"
    typography:
      fontFamily: "\"Omani Rial\", \"Emirati Dirham\", \"Saudi Riyal\", \"Noto IKEA\", \"Noto Sans JP\", \"Noto Sans KR\", \"Noto Sans SC\", \"Noto Sans TC\", \"Noto Sans\", Roboto, \"Open Sans\", system-ui, sans-serif"
      fontSize: 13.3333px
      fontWeight: 400
  button-ghost-2-hover:
    backgroundColor: "#F5F5F5"
  card:
    textColor: "#111111"
    height: 684px
  card-group:
    rounded: 8px
  card-group-2:
    rounded: 8px
  card-link:
    padding: 24px
    height: 684px
    width: 686px
  card-link-2:
    textColor: "#FFFFFF"
    padding: 24px
    height: 684px
    width: 686px
  navigation:
    textColor: "#111111"
    height: 54px
  navigation-2:
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"Omani Rial\", \"Emirati Dirham\", \"Saudi Riyal\", \"Noto IKEA\", \"Noto Sans JP\", \"Noto Sans KR\", \"Noto Sans SC\", \"Noto Sans TC\", \"Noto Sans\", Roboto, \"Open Sans\", system-ui, sans-serif"
      fontSize: 20px
      fontWeight: 400
      lineHeight: 32.4px
    height: 32px
  navigation-2-link:
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"Omani Rial\", \"Emirati Dirham\", \"Saudi Riyal\", \"Noto IKEA\", \"Noto Sans JP\", \"Noto Sans KR\", \"Noto Sans SC\", \"Noto Sans TC\", \"Noto Sans\", Roboto, \"Open Sans\", system-ui, sans-serif"
      fontSize: 20px
      fontWeight: 400
      lineHeight: 32.4px
  navigation-2-item-2:
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"Omani Rial\", \"Emirati Dirham\", \"Saudi Riyal\", \"Noto IKEA\", \"Noto Sans JP\", \"Noto Sans KR\", \"Noto Sans SC\", \"Noto Sans TC\", \"Noto Sans\", Roboto, \"Open Sans\", system-ui, sans-serif"
      fontSize: 20px
      fontWeight: 400
      lineHeight: 32.4px
  navigation-3:
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"Omani Rial\", \"Emirati Dirham\", \"Saudi Riyal\", \"Noto IKEA\", \"Noto Sans JP\", \"Noto Sans KR\", \"Noto Sans SC\", \"Noto Sans TC\", \"Noto Sans\", Roboto, \"Open Sans\", system-ui, sans-serif"
      fontSize: 14px
      fontWeight: 400
      lineHeight: 21.98px
    height: 22px
  navigation-3-item-2:
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"Omani Rial\", \"Emirati Dirham\", \"Saudi Riyal\", \"Noto IKEA\", \"Noto Sans JP\", \"Noto Sans KR\", \"Noto Sans SC\", \"Noto Sans TC\", \"Noto Sans\", Roboto, \"Open Sans\", system-ui, sans-serif"
      fontSize: 14px
      fontWeight: 400
      lineHeight: 21.98px
  navigation-3-link:
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"Omani Rial\", \"Emirati Dirham\", \"Saudi Riyal\", \"Noto IKEA\", \"Noto Sans JP\", \"Noto Sans KR\", \"Noto Sans SC\", \"Noto Sans TC\", \"Noto Sans\", Roboto, \"Open Sans\", system-ui, sans-serif"
      fontSize: 14px
      fontWeight: 400
      lineHeight: 21.98px
  header:
    backgroundColor: "#FFFEFB"
    textColor: "#111111"
    typography:
      fontFamily: "\"Omani Rial\", \"Emirati Dirham\", \"Saudi Riyal\", \"Noto IKEA\", \"Noto Sans JP\", \"Noto Sans KR\", \"Noto Sans SC\", \"Noto Sans TC\", \"Noto Sans\", Roboto, \"Open Sans\", system-ui, sans-serif"
      fontSize: 16px
      fontWeight: 400
    height: 96px
  header-cta:
    backgroundColor: "#FFFEFB"
    textColor: "#000000"
    typography:
      fontFamily: "\"Omani Rial\", \"Emirati Dirham\", \"Saudi Riyal\", \"Noto IKEA\", \"Noto Sans JP\", \"Noto Sans KR\", \"Noto Sans SC\", \"Noto Sans TC\", \"Noto Sans\", Roboto, \"Open Sans\", system-ui, sans-serif"
      fontSize: 16px
      fontWeight: 400
    padding: 20px
  header-logo:
    textColor: "#0000EE"
    height: 36px
    width: 89px
  header-logo-image:
    height: 36px
    width: 89px
  footer:
    backgroundColor: "#000000"
    textColor: "#111111"
    typography:
      fontFamily: "\"Omani Rial\", \"Emirati Dirham\", \"Saudi Riyal\", \"Noto IKEA\", \"Noto Sans JP\", \"Noto Sans KR\", \"Noto Sans SC\", \"Noto Sans TC\", \"Noto Sans\", Roboto, \"Open Sans\", system-ui, sans-serif"
      fontSize: 16px
      fontWeight: 400
    height: 872px
  footer-group-2:
    textColor: "#FFFFFF"
  footer-text:
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"Omani Rial\", \"Emirati Dirham\", \"Saudi Riyal\", \"Noto IKEA\", \"Noto Sans JP\", \"Noto Sans KR\", \"Noto Sans SC\", \"Noto Sans TC\", \"Noto Sans\", Roboto, \"Open Sans\", system-ui, sans-serif"
      fontSize: 14px
      fontWeight: 400
      lineHeight: 21.98px
  header-mobile:
    backgroundColor: "#FFFEFB"
    textColor: "#111111"
    typography:
      fontFamily: "\"Omani Rial\", \"Emirati Dirham\", \"Saudi Riyal\", \"Noto IKEA\", \"Noto Sans JP\", \"Noto Sans KR\", \"Noto Sans SC\", \"Noto Sans TC\", \"Noto Sans\", Roboto, \"Open Sans\", system-ui, sans-serif"
      fontSize: 16px
      fontWeight: 400
    height: 68px
  header-mobile-cta:
    backgroundColor: "#FFFEFB"
    textColor: "#000000"
    typography:
      fontFamily: "\"Omani Rial\", \"Emirati Dirham\", \"Saudi Riyal\", \"Noto IKEA\", \"Noto Sans JP\", \"Noto Sans KR\", \"Noto Sans SC\", \"Noto Sans TC\", \"Noto Sans\", Roboto, \"Open Sans\", system-ui, sans-serif"
      fontSize: 16px
      fontWeight: 400
    padding: 20px
  header-mobile-logo:
    textColor: "#0000EE"
    height: 36px
    width: 89px
  header-mobile-logo-image:
    height: 36px
    width: 89px
  footer-mobile:
    backgroundColor: "#000000"
    textColor: "#111111"
    typography:
      fontFamily: "\"Omani Rial\", \"Emirati Dirham\", \"Saudi Riyal\", \"Noto IKEA\", \"Noto Sans JP\", \"Noto Sans KR\", \"Noto Sans SC\", \"Noto Sans TC\", \"Noto Sans\", Roboto, \"Open Sans\", system-ui, sans-serif"
      fontSize: 16px
      fontWeight: 400
    height: 737px
  footer-mobile-group-2:
    textColor: "#FFFFFF"
  footer-mobile-text:
    textColor: "#FFFFFF"
    typography:
      fontFamily: "\"Omani Rial\", \"Emirati Dirham\", \"Saudi Riyal\", \"Noto IKEA\", \"Noto Sans JP\", \"Noto Sans KR\", \"Noto Sans SC\", \"Noto Sans TC\", \"Noto Sans\", Roboto, \"Open Sans\", system-ui, sans-serif"
      fontSize: 14px
      fontWeight: 400
      lineHeight: 21.98px
---

# IKEA

## Overview

IKEA Global reads like a warm, plain-spoken magazine rather than a storefront. The page is an off-white canvas, **Warm Canvas** (`surface`, #FFFEFB), carrying full-bleed lifestyle photography of real rooms and people. A single saturated block of **IKEA Yellow** (`primary`, #FFDB00) holds the shopping call-to-action. Everything else stays near-black on cream, so the yellow is unmistakable. Headlines are short and conversational ('Welcome to the wild side!'), set heavy and tightly tracked, and they sit over photography rather than in separate text bands.

Density is low and editorial. Large image tiles in a modular two-column feed do most of the talking. Text is confined to an eyebrow line plus a bold headline anchored to the bottom-left of each tile. Chrome is minimal: a cream header with a short text nav, and a long solid-black footer with white links.

Hierarchy comes from three levers: scale (an 82px hero headline down to 13px micro text), weight (only 400 and 700 exist), and color blocking (cream page, yellow CTA panel, black footer). Shadows play no part. Depth comes from photography and from flat color fields.

**Key Characteristics:**
- Off-white `surface` (#FFFEFB) canvas instead of pure white; text is `ink` (#111111), not pure black.
- One signature accent, `primary` IKEA Yellow (#FFDB00), reserved for the shopping CTA block and yellow buttons.
- A single humanist sans stack, `Omani Rial` falling through to Noto IKEA and Noto Sans, at two weights only: 400 and 700.
- Display type uses negative tracking that grows with size (-3.55px at 82px, -1.10px at 36px).
- Body and small text get generous line-heights of 1.5–1.8.
- One corner radius, `rounded.md` (8px), on image tiles and panels.
- Flat elevation: no box-shadows or backdrop blur anywhere. Separation comes from photography, color blocks and 1px hairlines.
- A heavy solid-black (`surface-dark`, #000000) footer with `on-dark` (#FFFFFF) links closes every page.

## Colors

The palette is deliberately small: warm neutrals, one loud brand yellow, and a few functional accents. Most of the page is `ink` on `surface`.

### Brand & Accent
- **IKEA Yellow** (`primary`, #FFDB00): the signature. Use it for the shopping CTA panel and yellow buttons (`button-secondary` fill). Never use it for body text or large decorative washes beyond the CTA block.
- **Pale Yellow** (`primary-tint`, #FFF094): the hover fill of yellow buttons (`button-secondary` hover) and a soft secondary surface.
- **Warm Orange** (`accent-orange`, #FFAE66): an occasional promotional or illustrative fill. Keep it rare.
- **Availability Green** (`success`, #1A7E3B): positive or availability actions only. It appears on an interactive element, never as a decorative fill.

### Surface
- **Warm Canvas** (`surface`, #FFFEFB): the page background and header fill (`header`, `header-mobile`). It is softer than pure white; do not replace it with #FFFFFF for the page.
- **Footer Black** (`surface-dark`, #000000): the full-width footer background (`footer`, `footer-mobile`).

### Text
- **Ink** (`ink`, #111111): default text, headlines and dark button fills (`button-ghost`).
- **Pure Black** (`ink-black`, #000000): small utility text such as the header skip/CTA link (`header-cta`).
- **Soft Ink** (`ink-soft`, #333333): measured only as the hover fill of the dark button (`button-ghost` hover). It is a state color, not page text.
- **Muted Grey** (`muted`, #818181): secondary metadata and de-emphasized labels, used sparingly.
- **On Primary** (`on-primary`, #111111): text on yellow.
- **On Dark** (`on-dark`, #FFFFFF): text and links on the black footer and on photo captions.
- **Link Blue** (`link`, #0000EE): the browser-default link color, measured on the logo link (`header-logo`). It is not a designed text color; do not style visible links with it.

### Hairlines & Borders
- **Hairline Grey** (`hairline`, #DADADA): thin dividers and quiet control outlines, such as the divider above the store selector in the yellow panel.

### Component & State Colors
These were measured on recipes rather than in page sampling:
- `ink-soft` (#333333) is the hover fill of `button-ghost`.
- #F5F5F5 is the hover fill of the white button `button-ghost-2`.
- #FFFFFF is the resting fill of `button-ghost-2`.

### Gradients
There are no brand gradients. The only gradient-like treatment is a dark scrim at the bottom of photo tiles, observed in the screenshots, that keeps white captions legible. It is an image overlay, not a palette color.

## Typography

### Font Family
One family does everything. The computed stack is `"Omani Rial", "Emirati Dirham", "Saudi Riyal", "Noto IKEA", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans TC", "Noto Sans", Roboto, "Open Sans", system-ui, sans-serif`. The tokens name it `Omani Rial`. The leading currency-named faces appear to be glyph-subset fonts, so Latin text effectively renders in **Noto IKEA**, IKEA's proprietary humanist sans. Headlines, body, navigation, buttons and footer all share it.

### Hierarchy
| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `hero-display` | 82.2857px | 700 | 1.1 | -3.55102px | Single hero headline |
| `display-lg` | 45.7143px | 700 | 1.1 | -1.59184px | Major section headings (h2) |
| `display-md` | 36.5714px | 700 | 1.15 | -1.10204px | Story tile headlines; the most common display size |
| `display-md-relaxed` | 36.5714px | 700 | 1.25 | -1.10204px | Multi-line or linked tile headlines needing more air |
| `body-lg` | 20px | 400 | 1.6 | normal | Lead text and footer navigation links (`navigation-2`) |
| `body` | 16px | 400 | 1.5 | normal | Default paragraphs, links, list items |
| `body-strong` | 16px | 700 | 1.15 | normal | Inline emphasis, short bold labels |
| `label-strong` | 16px | 700 | 1 | normal | Single-line bold labels inside buttons (`button-secondary-label-2`) |
| `button` | 16px | 400 | 1 | normal | Primary button labels (`button-secondary`) |
| `body-sm` | 14px | 400 | 1.55 | normal | Small links, footer legal and meta lists (`navigation-3`, `footer-text`) |
| `button-sm` | 14px | 400 | 1.5 | normal | Compact button labels |
| `caption` | 13.7143px | 400 | 1.8 | 0.0612245px | Eyebrows and captions above tile headlines |
| `micro` | 13.3333px | 400 | 1.5 | normal | Small pill/overlay buttons (`button-ghost`, `button-ghost-2`) |

### Principles
- **Two weights only.** 400 for reading and 700 for display and emphasis. Weight 500/600 is deliberately absent; never add it.
- **Tracking tightens with size.** Display sizes carry negative letter-spacing that scales with size (-3.55px at 82px, -1.59px at 45px, -1.10px at 36px). Text at 20px and below stays at `normal`. `caption` is the one exception, with a hair of positive tracking.
- **Leading opens as size shrinks.** Display lines sit at 1.1–1.25, body at 1.5–1.6, and captions at 1.8. Single-line UI labels (`button`, `label-strong`) use 1.
- **Fractional sizes are real.** The 82.2857 / 45.7143 / 36.5714 / 13.7143 values come from a rem-based scale; keep them rather than rounding, so proportions stay intact.

### Note on Font Substitutes
Noto IKEA is proprietary. Use **Noto Sans** as the open-source stand-in; it is already the fallback in IKEA's own stack, so metrics and character are close. Load weights 400 and 700 only. Keep the negative display tracking from the tokens, and check that bold headlines at `hero-display` do not feel wider than the original; if they do, tighten tracking slightly rather than dropping the size.

## Layout

### Spacing System
No layout measurement was verified. No spacing tokens survived grounding, so there is no `base` step, no named spacing scale and no `section-padding-y`. Build spacing on a consistent small increment and keep paddings inside tiles generous and uniform. Treat every value you choose as an assumption to check against the live site.

### Grid & Container
No container max width or grid gap was verified as a token.
- **Desktop:** the screenshots show a modular, masonry-like story feed with wide outer margins and small, even gutters. The hero splits into a large lifestyle image beside the yellow shopping CTA card. Below it, tall tiles alternate in staggered heights, interrupted by one full-width banner.
- **Tile captions:** captions sit bottom-left inside each tile, with a `caption` eyebrow above a `display-md` headline.
- **Header:** the top nav is a short row of plain text links beside the logo.

### Whitespace Philosophy
Whitespace is used in big, deliberate gaps: a large empty band separates the hero from the story feed. Inside the feed, gutters stay tight so the photos read as one continuous wall. Keep text off the canvas wherever possible; let images fill tiles edge to edge and place copy on the image over the dark scrim. The cream canvas should feel calm around the photography, never crowded with extra UI.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No box-shadow and no backdrop-filter; content sits directly on `surface` (#FFFEFB) | Page canvas, image tiles (`card`), header (`header`), footer (`footer`) |
| Color block | A solid fill change: `primary` (#FFDB00) or `surface-dark` (#000000) | The yellow CTA panel and the black footer, which separate by color rather than lift |
| Hairline | 1px solid borders | `button-secondary` carries a `border-top` of 1px solid #FFFEFB; `header-cta` carries 1px solid #000000 on its right and bottom edges; `hairline` (#DADADA) dividers inside the yellow panel |
| Image scrim | Dark bottom gradient over photography (observed in screenshots, no measured value) | Legibility for white captions on photo tiles |

**Shadow philosophy.** The design uses no shadows. No box-shadow or backdrop blur was measured on any recipe or on the page, and the header is fixed without blur. Depth is photographic: the image does the work, and color fields (yellow panel, black footer) create zones without lifting anything. The small solid-black circular arrow and play buttons only look like they float because of contrast, not shadow. When you need separation, reach for a `hairline` rule or a surface color change, never a drop shadow.

## Shapes

### Border Radius Scale
| Token | Value | Use |
|---|---|---|
| `rounded.md` | 8px | Image tiles and their inner image blocks (`card-group`, `card-group-2`), the yellow CTA panel, and general containers |

The geometry is soft-rectangular and almost monotone: one radius, applied everywhere a surface has corners. That consistency is the shape language; don't introduce a second rounding step for tiles or panels.

Circles are the one deliberate contrast. Small solid-black circular icon buttons (arrow, play) sit on photography, and a dot-grid motif on one story tile repeats the circle. No circle or pill radius token was measured, so build these as true circles (radius at half the size) and only for icon buttons. Pill shapes are not part of the measured system. The logo's rounded oval is artwork; do not derive a radius from it.

## Components

Each component below was distilled from the live page: the recipe is a standalone, placeholder-filled reproduction with literal values, and every frontmatter key named in the anatomy carries the same measurements. A verified component reproduced the original in every check; a flagged one is shipped with the reason it did not; one marked not verifiable could not be compared with the original, which says nothing about the recipe.



### Button, secondary

**Verification**: flagged, the render matched 94% of the original pixels, below the 97% required after 2 correction attempts.

**Anatomy**

- `button-secondary`: the component root, a `<button>` (`.c-button-secondary`)
- `button-secondary-group`: inner flex row (`.c-button-secondary__group`)
- `button-secondary-group-2`: inner group (`.c-button-secondary__group-2`)
- `button-secondary-label`: label text, 6 characters (`.c-button-secondary__label`)
- `button-secondary-label-2`: label text, 7 characters (`.c-button-secondary__label-2`)
- `button-secondary-label-3`: label text, 4 characters (`.c-button-secondary__label-3`)
- `button-secondary-group-3`: inner group (`.c-button-secondary__group-3`)
- `button-secondary-icon`: icon placeholder, 16x9px (`.c-button-secondary__icon`)

**Recipe**

```html
<div class="c-button-secondary-scope">
  <button class="c-button-secondary" type="button">
    <span class="c-button-secondary__group">
      <span class="c-button-secondary__group-2">
        <span class="c-button-secondary__label">lorem</span>
        <span class="c-button-secondary__label-2">lorem i</span>
        <span class="c-button-secondary__label-3">lore</span>
      </span>
      <span class="c-button-secondary__group-3">
        <span class="c-button-secondary__icon" aria-hidden="true"></span>
      </span>
    </span>
  </button>
</div>
```

```css
.c-button-secondary-scope {
  background-color: #FFDB00;
  color: #111111;
  font-family: "Omani Rial", "Emirati Dirham", "Saudi Riyal", "Noto IKEA", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans TC", "Noto Sans", Roboto, "Open Sans", system-ui, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
}

.c-button-secondary {
  display: inline-block;
  border-spacing: 0px;
  box-sizing: border-box;
  min-height: 100px;
  padding: 16px 50px;
  position: relative;
  z-index: 2;
  background-color: #FFDB00;
  color: #111111;
  cursor: pointer;
  font-family: "Omani Rial", "Emirati Dirham", "Saudi Riyal", "Noto IKEA", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans TC", "Noto Sans", Roboto, "Open Sans", system-ui, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
  transition: background 0.3s ease;
  border-top: 1px solid #FFFEFB;
  border-right: 0;
  border-bottom: 0;
  border-left: 0;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
}

.c-button-secondary__group {
  display: flex;
  align-items: center;
}

.c-button-secondary__group-2 {
  display: block;
  max-width: 70%;
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.c-button-secondary__label-2 {
  display: inline;
  font-weight: 700;
}

.c-button-secondary__group-3 {
  display: block;
  max-width: 70%;
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 8px;
  margin-left: auto;
}

.c-button-secondary__icon {
  display: block;
  flex-shrink: 0;
  width: 16px;
  height: 9px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
  transform: matrix(-1, 0, 0, -1, 0, 0);
  transition: transform 0.3s ease;
}

.c-button-secondary:hover {
  background-color: #FFF094;
}

.c-button-secondary:focus {
  outline: none;
}

.c-button-secondary:focus::before {
  content: "";
  display: block;
  width: 451px;
  height: 99px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 100;
  box-shadow: #111111 0px 0px 0px 1px inset, #FFFFFF 0px 0px 0px 3px inset, #111111 0px 0px 0px 4px inset;
}
```

**States**

- hover (`button-secondary-hover`): background-color #FFF094
- focus: outline none, ::before content "", ::before display block, ::before width 451px, ::before height 99px, ::before position absolute, ::before top 0px, ::before right 0px, ::before bottom 0px, ::before left 0px, ::before z-index 100, ::before box-shadow #111111 0px 0px 0px 1px inset, #FFFFFF 0px 0px 0px 3px inset, #111111 0px 0px 0px 4px inset

### Button, ghost

**Verification**: flagged, the render matched 52% of the original pixels, below the 97% required after 2 correction attempts.

**Anatomy**

- `button-ghost`: the component root, a `<button>` (`.c-button-ghost`)
- `button-ghost-group`: inner flex row (`.c-button-ghost__group`)
- `button-ghost-icon`: icon placeholder, 12x14px (`.c-button-ghost__icon`)
- `button-ghost-label`: label text, 81 characters (`.c-button-ghost__label`)

**Recipe**

```html
<div class="c-button-ghost-scope">
  <button class="c-button-ghost" type="button">
    <div class="c-button-ghost__group">
      <span class="c-button-ghost__icon" aria-hidden="true"></span>
      <span class="c-button-ghost__label">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor lore</span>
    </div>
  </button>
</div>
```

```css
.c-button-ghost-scope {
  background-color: #FFFEFB;
  color: #111111;
  font-family: "Omani Rial", "Emirati Dirham", "Saudi Riyal", "Noto IKEA", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans TC", "Noto Sans", Roboto, "Open Sans", system-ui, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 0px;
}

.c-button-ghost {
  display: block;
  justify-content: center;
  align-items: center;
  border-spacing: 0px;
  box-sizing: border-box;
  width: 56px;
  height: 56px;
  padding: 0px;
  position: absolute;
  right: 24px;
  bottom: 24px;
  z-index: 10;
  background-color: #111111;
  color: #FFFFFF;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  font-family: "Omani Rial", "Emirati Dirham", "Saudi Riyal", "Noto IKEA", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans TC", "Noto Sans", Roboto, "Open Sans", system-ui, sans-serif;
  font-size: 13.3333px;
  font-weight: 400;
  line-height: normal;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
}

.c-button-ghost__group {
  display: flex;
  justify-content: center;
  align-items: center;
}

.c-button-ghost__icon {
  display: block;
  flex-shrink: 0;
  width: 12px;
  height: 14px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
  margin-left: 2px;
}

.c-button-ghost__label {
  display: block;
  width: 1px;
  height: 1px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: nowrap;
}

.c-button-ghost:hover {
  background-color: #333333;
}

.c-button-ghost:focus {
  outline: none;
}

.c-button-ghost:focus::before {
  content: "";
  display: block;
  width: 56px;
  height: 56px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 100;
  border-radius: 50%;
  box-shadow: #111111 0px 0px 0px 1px inset, #FFFFFF 0px 0px 0px 3px inset, #111111 0px 0px 0px 4px inset;
}
```

**States**

- hover (`button-ghost-hover`): background-color #333333
- focus: outline none, ::before content "", ::before display block, ::before width 56px, ::before height 56px, ::before position absolute, ::before top 0px, ::before right 0px, ::before bottom 0px, ::before left 0px, ::before z-index 100, ::before border-radius 50%, ::before box-shadow #111111 0px 0px 0px 1px inset, #FFFFFF 0px 0px 0px 3px inset, #111111 0px 0px 0px 4px inset

### Button, ghost (2)

**Verification**: flagged, the render matched 55% of the original pixels, below the 97% required after 2 correction attempts.

**Anatomy**

- `button-ghost-2`: the component root, a `<button>` (`.c-button-ghost-2`)
- `button-ghost-2-group`: inner flex row (`.c-button-ghost-2__group`)
- `button-ghost-2-icon`: icon placeholder, 12x14px (`.c-button-ghost-2__icon`)
- `button-ghost-2-label`: label text, 67 characters (`.c-button-ghost-2__label`)

**Recipe**

```html
<div class="c-button-ghost-2-scope">
  <button class="c-button-ghost-2" type="button">
    <div class="c-button-ghost-2__group">
      <span class="c-button-ghost-2__icon" aria-hidden="true"></span>
      <span class="c-button-ghost-2__label">lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusm</span>
    </div>
  </button>
</div>
```

```css
.c-button-ghost-2-scope {
  background-color: #FFFEFB;
  color: #111111;
  font-family: "Omani Rial", "Emirati Dirham", "Saudi Riyal", "Noto IKEA", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans TC", "Noto Sans", Roboto, "Open Sans", system-ui, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 0px;
}

.c-button-ghost-2 {
  display: block;
  justify-content: center;
  align-items: center;
  border-spacing: 0px;
  box-sizing: border-box;
  width: 56px;
  height: 56px;
  padding: 0px;
  position: absolute;
  right: 24px;
  bottom: 24px;
  z-index: 10;
  background-color: #FFFFFF;
  color: #111111;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  font-family: "Omani Rial", "Emirati Dirham", "Saudi Riyal", "Noto IKEA", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans TC", "Noto Sans", Roboto, "Open Sans", system-ui, sans-serif;
  font-size: 13.3333px;
  font-weight: 400;
  line-height: normal;
  letter-spacing: normal;
  text-transform: none;
  text-align: center;
}

.c-button-ghost-2__group {
  display: flex;
  justify-content: center;
  align-items: center;
}

.c-button-ghost-2__icon {
  display: block;
  flex-shrink: 0;
  width: 12px;
  height: 14px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: currentcolor;
  margin-left: 2px;
}

.c-button-ghost-2__label {
  display: block;
  width: 1px;
  height: 1px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: nowrap;
}

.c-button-ghost-2:hover {
  background-color: #F5F5F5;
}

.c-button-ghost-2:focus {
  outline: none;
}

.c-button-ghost-2:focus::before {
  content: "";
  display: block;
  width: 56px;
  height: 56px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 100;
  border-radius: 50%;
  box-shadow: #111111 0px 0px 0px 1px inset, #FFFFFF 0px 0px 0px 3px inset, #111111 0px 0px 0px 4px inset;
}
```

**States**

- hover (`button-ghost-2-hover`): background-color #F5F5F5
- focus: outline none, ::before content "", ::before display block, ::before width 56px, ::before height 56px, ::before position absolute, ::before top 0px, ::before right 0px, ::before bottom 0px, ::before left 0px, ::before z-index 100, ::before border-radius 50%, ::before box-shadow #111111 0px 0px 0px 1px inset, #FFFFFF 0px 0px 0px 3px inset, #111111 0px 0px 0px 4px inset

### Card

**Verification**: flagged, the render matched 9% of the original pixels, below the 96% required (instance 1) after 2 correction attempts.

**Anatomy**

- Group: 4 instances in a 1-column grid, 20px gap; the recipe carries the values they all share
- `card`: the component root, a `<div>` (`.c-card`)
- `card-group`: inner block (`.c-card__group`, 2 instances)
- `card-group-2`: inner block (`.c-card__group-2`, 2 instances)
- `card-link`: link (`.c-card__link`)
- `card-group-3`: inner block (`.c-card__group-3`, 2 instances), content not captured
- `card-group-4`: inner block (`.c-card__group-4`, 2 instances), content not captured
- `card-link-2`: link (`.c-card__link-2`)
- `card-group-5`: inner block (`.c-card__group-5`)

**Recipe**

```html
<div class="c-card-scope">
  <div class="c-card">
    <div class="c-card__group">
      <div class="c-card__group-2">
        <a class="c-card__link" href="#">
          <div class="c-card__group-3"></div>
        </a>
        <div class="c-card__group-4"></div>
      </div>
    </div>
    <div class="c-card__group">
      <div class="c-card__group-2">
        <a class="c-card__link-2" href="#">
          <div class="c-card__group-3"></div>
        </a>
        <div class="c-card__group-4"></div>
        <div class="c-card__group-5"></div>
      </div>
    </div>
  </div>
</div>
```

```css
.c-card-scope {
  background-color: #FFFEFB;
  color: #111111;
  font-family: "Omani Rial", "Emirati Dirham", "Saudi Riyal", "Noto IKEA", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans TC", "Noto Sans", Roboto, "Open Sans", system-ui, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
}

.c-card {
  display: inline-grid;
  gap: 20px;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  border-spacing: 0px;
  color: #111111;
  font-family: "Omani Rial", "Emirati Dirham", "Saudi Riyal", "Noto IKEA", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans TC", "Noto Sans", Roboto, "Open Sans", system-ui, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
}

.c-card__group {
  display: block;
  overflow-x: hidden;
  overflow-y: hidden;
  border-radius: 8px;
}

.c-card__group-2 {
  display: block;
  width: 100%;
  height: 684px;
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
  border-radius: 8px;
  cursor: pointer;
}

.c-card__link {
  display: flex;
  flex-direction: column;
  justify-content: end;
  box-sizing: border-box;
  width: 100%;
  padding: 24px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 1;
  cursor: pointer;
  text-decoration-line: none;
}

.c-card__group-3 {
  display: block;
  position: relative;
}

.c-card__group-4 {
  display: block;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}

.c-card__link-2 {
  display: flex;
  flex-direction: column;
  justify-content: end;
  box-sizing: border-box;
  width: 100%;
  padding: 24px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 1;
  color: #FFFFFF;
  cursor: pointer;
  text-decoration-line: none;
}

.c-card__group-5 {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0px;
  left: 0px;
  z-index: 0;
  background-image: linear-gradient(to top, #0000008C 80px, transparent 200px);
}
```

**States**

- No hover or focus change was observed.

### Navigation

**Verification**: flagged, the `navigation-list` height did not reproduce the measured 54px after 2 correction attempts.

**Anatomy**

- `navigation`: the component root, a `<nav>` (`.c-navigation`)
- `navigation-list`: inner flex row (`.c-navigation__list`)
- `navigation-item`: inner group (`.c-navigation__item`, 4 instances)

**Recipe**

```html
<div class="c-navigation-scope">
  <nav class="c-navigation">
    <ul class="c-navigation__list">
      <li class="c-navigation__item"></li>
      <li class="c-navigation__item"></li>
      <li class="c-navigation__item"></li>
      <li class="c-navigation__item"></li>
    </ul>
  </nav>
</div>
```

```css
.c-navigation-scope {
  background-color: #FFFEFB;
  color: #111111;
  font-family: "Omani Rial", "Emirati Dirham", "Saudi Riyal", "Noto IKEA", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans TC", "Noto Sans", Roboto, "Open Sans", system-ui, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
}

.c-navigation {
  display: block;
  border-spacing: 0px;
  color: #111111;
  font-family: "Omani Rial", "Emirati Dirham", "Saudi Riyal", "Noto IKEA", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans TC", "Noto Sans", Roboto, "Open Sans", system-ui, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
}

.c-navigation__list {
  display: flex;
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}

.c-navigation__item {
  display: list-item;
}
```

**States**

- No hover or focus change was observed.

### Navigation (2)

**Verification**: verified against the live page at desktop.

**Anatomy**

- `navigation-2`: the component root, a `<nav>` (`.c-navigation-2`)
- `navigation-2-list`: inner flex row (`.c-navigation-2__list`)
- `navigation-2-item`: inner group (`.c-navigation-2__item`, 6 instances)
- `navigation-2-link`: link, 19-character label (`.c-navigation-2__link`, 6 instances)
- `navigation-2-item-2`: label text, 1 characters (`.c-navigation-2__item-2`, 5 instances)

**Recipe**

```html
<div class="c-navigation-2-scope">
  <nav class="c-navigation-2">
    <ul class="c-navigation-2__list">
      <li class="c-navigation-2__item">
        <a class="c-navigation-2__link" href="#">lorem ipsum dolor s</a>
      </li>
      <li class="c-navigation-2__item-2">l</li>
      <li class="c-navigation-2__item">
        <a class="c-navigation-2__link" href="#">lorem ipsum dolo</a>
      </li>
      <li class="c-navigation-2__item-2">l</li>
      <li class="c-navigation-2__item">
        <a class="c-navigation-2__link" href="#">lorem ipsum dol</a>
      </li>
      <li class="c-navigation-2__item-2">l</li>
      <li class="c-navigation-2__item">
        <a class="c-navigation-2__link" href="#">lorem ipsum</a>
      </li>
      <li class="c-navigation-2__item-2">l</li>
      <li class="c-navigation-2__item">
        <a class="c-navigation-2__link" href="#">lorem ipsum dolor sit amet c</a>
      </li>
      <li class="c-navigation-2__item-2">l</li>
      <li class="c-navigation-2__item">
        <a class="c-navigation-2__link" href="#">lore</a>
      </li>
    </ul>
  </nav>
</div>
```

```css
.c-navigation-2-scope {
  background-color: #000000;
  color: #FFFFFF;
  font-family: "Omani Rial", "Emirati Dirham", "Saudi Riyal", "Noto IKEA", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans TC", "Noto Sans", Roboto, "Open Sans", system-ui, sans-serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 32.4px;
}

.c-navigation-2 {
  display: block;
  border-spacing: 0px;
  color: #FFFFFF;
  font-family: "Omani Rial", "Emirati Dirham", "Saudi Riyal", "Noto IKEA", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans TC", "Noto Sans", Roboto, "Open Sans", system-ui, sans-serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 32.4px;
}

.c-navigation-2__list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0px;
  margin: 16px 0px 36px;
  list-style-type: none;
}

.c-navigation-2__item {
  display: list-item;
}

.c-navigation-2__link {
  display: inline;
  position: relative;
  color: #FFFFFF;
  cursor: pointer;
  text-decoration-line: none;
}

.c-navigation-2__item-2 {
  display: block;
  margin-right: 24px;
  margin-left: 24px;
}
```

**States**

- No hover or focus change was observed.

### Navigation (3)

**Verification**: flagged, the `navigation-3-item` width did not reproduce the measured 113px after 2 correction attempts.

**Anatomy**

- `navigation-3`: the component root, a `<nav>` (`.c-navigation-3`)
- `navigation-3-list`: inner flex row (`.c-navigation-3__list`)
- `navigation-3-item`: inner group (`.c-navigation-3__item`, 5 instances)
- `navigation-3-item-2`: label text, 1 characters (`.c-navigation-3__item-2`, 4 instances)
- `navigation-3-link`: link, 26-character label (`.c-navigation-3__link`, 4 instances)

**Recipe**

```html
<div class="c-navigation-3-scope">
  <nav class="c-navigation-3">
    <ul class="c-navigation-3__list">
      <li class="c-navigation-3__item"></li>
      <li class="c-navigation-3__item-2">l</li>
      <li class="c-navigation-3__item">
        <a class="c-navigation-3__link" href="#">lorem ipsum dolor sit amet</a>
      </li>
      <li class="c-navigation-3__item-2">l</li>
      <li class="c-navigation-3__item">
        <a class="c-navigation-3__link" href="#">lorem ipsum dolor sit amet cons</a>
      </li>
      <li class="c-navigation-3__item-2">l</li>
      <li class="c-navigation-3__item">
        <a class="c-navigation-3__link" href="#">lorem i</a>
      </li>
      <li class="c-navigation-3__item-2">l</li>
      <li class="c-navigation-3__item">
        <a class="c-navigation-3__link" href="#">lorem</a>
      </li>
    </ul>
  </nav>
</div>
```

```css
.c-navigation-3-scope {
  background-color: #000000;
  color: #FFFFFF;
  font-family: "Omani Rial", "Emirati Dirham", "Saudi Riyal", "Noto IKEA", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans TC", "Noto Sans", Roboto, "Open Sans", system-ui, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 21.98px;
}

.c-navigation-3 {
  display: block;
  border-spacing: 0px;
  color: #FFFFFF;
  font-family: "Omani Rial", "Emirati Dirham", "Saudi Riyal", "Noto IKEA", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans TC", "Noto Sans", Roboto, "Open Sans", system-ui, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 21.98px;
}

.c-navigation-3__list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0px;
  margin: 16px 0px 0px;
  list-style-type: none;
}

.c-navigation-3__item {
  display: list-item;
}

.c-navigation-3__item-2 {
  display: block;
  margin-right: 20px;
  margin-left: 20px;
}

.c-navigation-3__link {
  display: inline;
  position: relative;
  color: #FFFFFF;
  cursor: pointer;
  text-decoration-line: none;
}
```

**States**

- No hover or focus change was observed.

### Header

**Verification**: desktop flagged, the `header-inner` y did not reproduce the measured 21px after 2 correction attempts; mobile flagged, the `header-mobile-inner` y did not reproduce the measured 12px after 2 correction attempts.

**Anatomy**

- `header`: the component root, a `<header>` (`.c-header`)
- `header-group`: inner flex row (`.c-header__group`)
- `header-cta`: link, 20-character label (`.c-header__cta`)
- `header-inner`: inner flex row (`.c-header__inner`)
- `header-group-2`: inner flex row (`.c-header__group-2`)
- `header-logo`: link (`.c-header__logo`)
- `header-logo-image`: image placeholder, 89x36px (`.c-header__logo-image`)
- `header-group-3`: inner block (`.c-header__group-3`)

**Desktop recipe**

```html
<div class="c-header-scope">
  <header class="c-header">
    <div class="c-header__group">
      <a class="c-header__cta" href="#">lorem ipsum dolor si</a>
    </div>
    <div class="c-header__inner">
      <div class="c-header__group-2">
        <a class="c-header__logo" href="#">
          <span class="c-header__logo-image" aria-hidden="true"></span>
        </a>
        <div class="c-header__group-3"></div>
      </div>
    </div>
  </header>
</div>
```

```css
.c-header-scope {
  background-color: #FFFEFB;
  color: #111111;
  font-family: "Omani Rial", "Emirati Dirham", "Saudi Riyal", "Noto IKEA", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans TC", "Noto Sans", Roboto, "Open Sans", system-ui, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
}

.c-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-spacing: 0px;
  box-sizing: border-box;
  height: 96px;
  position: fixed;
  top: 0px;
  z-index: 11;
  background-color: #FFFEFB;
  color: #111111;
  transform: matrix(1, 0, 0, 1, 0, -96);
  font-family: "Omani Rial", "Emirati Dirham", "Saudi Riyal", "Noto IKEA", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans TC", "Noto Sans", Roboto, "Open Sans", system-ui, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  transition: transform 0.15s cubic-bezier(1, 0.26, 0.51, 0.72);
}

.c-header__group {
  display: flex;
  justify-content: left;
  width: 100%;
  position: fixed;
  top: -200px;
  transition: transform 0.2s ease;
}

.c-header__cta {
  display: block;
  padding: 20px;
  position: relative;
  background-color: #FFFEFB;
  color: #000000;
  cursor: pointer;
  text-decoration-line: underline;
  text-decoration-color: #000000;
  border-right-width: 1px;
  border-bottom-width: 1px;
  border-right-style: solid;
  border-bottom-style: solid;
  border-right-color: #000000;
  border-bottom-color: #000000;
}

.c-header__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  max-width: 1440px;
  margin: auto;
  position: relative;
  padding-right: 24px;
  padding-left: 24px;
}

.c-header__group-2 {
  display: flex;
  align-items: center;
}

.c-header__logo {
  display: block;
  position: relative;
  color: #0000EE;
  cursor: pointer;
  text-decoration-line: underline;
  text-decoration-color: #0000EE;
}

.c-header__logo-image {
  display: block;
  flex-shrink: 0;
  width: 89px;
  height: 36px;
  aspect-ratio: auto 88.641 / 36;
  overflow-x: clip;
  overflow-y: clip;
  background-color: currentcolor;
}

.c-header__group-3 {
  display: block;
  flex-grow: 1;
  flex-basis: 0%;
  margin-left: 16px;
}

.c-header__cta:focus {
  outline: none;
}

.c-header__cta:focus::before {
  content: "";
  display: block;
  width: 195px;
  height: 62px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 100;
  box-shadow: #111111 0px 0px 0px 1px inset, #FFFFFF 0px 0px 0px 3px inset, #111111 0px 0px 0px 4px inset;
}

.c-header__logo:focus {
  outline: none;
}

.c-header__logo:focus::before {
  content: "";
  display: block;
  width: 89px;
  height: 36px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 100;
  box-shadow: #111111 0px 0px 0px 1px inset, #FFFFFF 0px 0px 0px 3px inset, #111111 0px 0px 0px 4px inset;
}
```

**Mobile anatomy**

- `header-mobile`: the component root, a `<header>` (`.c-header-mobile`)
- `header-mobile-group`: inner flex row (`.c-header-mobile__group`)
- `header-mobile-cta`: link, 20-character label (`.c-header-mobile__cta`)
- `header-mobile-inner`: inner flex row (`.c-header-mobile__inner`)
- `header-mobile-group-2`: inner flex row (`.c-header-mobile__group-2`)
- `header-mobile-logo`: link (`.c-header-mobile__logo`)
- `header-mobile-logo-image`: image placeholder, 89x36px (`.c-header-mobile__logo-image`)

**Mobile recipe**

```html
<div class="c-header-mobile-scope">
  <header class="c-header-mobile">
    <div class="c-header-mobile__group">
      <a class="c-header-mobile__cta" href="#">lorem ipsum dolor si</a>
    </div>
    <div class="c-header-mobile__inner">
      <div class="c-header-mobile__group-2">
        <a class="c-header-mobile__logo" href="#">
          <span class="c-header-mobile__logo-image" aria-hidden="true"></span>
        </a>
      </div>
    </div>
  </header>
</div>
```

```css
.c-header-mobile-scope {
  background-color: #FFFEFB;
  color: #111111;
  font-family: "Omani Rial", "Emirati Dirham", "Saudi Riyal", "Noto IKEA", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans TC", "Noto Sans", Roboto, "Open Sans", system-ui, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
}

.c-header-mobile {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-spacing: 0px;
  box-sizing: border-box;
  height: 68px;
  position: fixed;
  top: 0px;
  z-index: 11;
  background-color: #FFFEFB;
  color: #111111;
  font-family: "Omani Rial", "Emirati Dirham", "Saudi Riyal", "Noto IKEA", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans TC", "Noto Sans", Roboto, "Open Sans", system-ui, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  transition: transform 0.15s cubic-bezier(1, 0.26, 0.51, 0.72);
}

.c-header-mobile__group {
  display: flex;
  justify-content: left;
  width: 100%;
  position: fixed;
  top: -200px;
  transition: transform 0.2s ease;
}

.c-header-mobile__cta {
  display: block;
  padding: 20px;
  position: relative;
  background-color: #FFFEFB;
  color: #000000;
  cursor: pointer;
  text-decoration-line: underline;
  text-decoration-color: #000000;
  border-right-width: 1px;
  border-bottom-width: 1px;
  border-right-style: solid;
  border-bottom-style: solid;
  border-right-color: #000000;
  border-bottom-color: #000000;
}

.c-header-mobile__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  max-width: 1440px;
  margin: auto;
  position: relative;
  padding-right: 16px;
  padding-left: 16px;
}

.c-header-mobile__group-2 {
  display: flex;
  align-items: center;
}

.c-header-mobile__logo {
  display: block;
  position: relative;
  color: #0000EE;
  cursor: pointer;
  text-decoration-line: underline;
  text-decoration-color: #0000EE;
}

.c-header-mobile__logo-image {
  display: block;
  flex-shrink: 0;
  width: 89px;
  height: 36px;
  aspect-ratio: auto 88.641 / 36;
  overflow-x: clip;
  overflow-y: clip;
  background-color: currentcolor;
}

.c-header-mobile__cta:focus {
  outline: none;
}

.c-header-mobile__cta:focus::before {
  content: "";
  display: block;
  width: 195px;
  height: 62px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 100;
  box-shadow: #111111 0px 0px 0px 1px inset, #FFFFFF 0px 0px 0px 3px inset, #111111 0px 0px 0px 4px inset;
}

.c-header-mobile__logo:focus {
  outline: none;
}

.c-header-mobile__logo:focus::before {
  content: "";
  display: block;
  width: 89px;
  height: 36px;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 100;
  box-shadow: #111111 0px 0px 0px 1px inset, #FFFFFF 0px 0px 0px 3px inset, #111111 0px 0px 0px 4px inset;
}
```

**States**

- `header-cta` focus: outline none, ::before content "", ::before display block, ::before width 195px, ::before height 62px, ::before position absolute, ::before top 0px, ::before right 0px, ::before bottom 0px, ::before left 0px, ::before z-index 100, ::before box-shadow #111111 0px 0px 0px 1px inset, #FFFFFF 0px 0px 0px 3px inset, #111111 0px 0px 0px 4px inset
- `header-logo` focus: outline none, ::before content "", ::before display block, ::before width 89px, ::before height 36px, ::before position absolute, ::before top 0px, ::before right 0px, ::before bottom 0px, ::before left 0px, ::before z-index 100, ::before box-shadow #111111 0px 0px 0px 1px inset, #FFFFFF 0px 0px 0px 3px inset, #111111 0px 0px 0px 4px inset
- mobile, `header-mobile-cta` focus: outline none, ::before content "", ::before display block, ::before width 195px, ::before height 62px, ::before position absolute, ::before top 0px, ::before right 0px, ::before bottom 0px, ::before left 0px, ::before z-index 100, ::before box-shadow #111111 0px 0px 0px 1px inset, #FFFFFF 0px 0px 0px 3px inset, #111111 0px 0px 0px 4px inset
- mobile, `header-mobile-logo` focus: outline none, ::before content "", ::before display block, ::before width 89px, ::before height 36px, ::before position absolute, ::before top 0px, ::before right 0px, ::before bottom 0px, ::before left 0px, ::before z-index 100, ::before box-shadow #111111 0px 0px 0px 1px inset, #FFFFFF 0px 0px 0px 3px inset, #111111 0px 0px 0px 4px inset

### Footer

**Verification**: desktop flagged, the `footer-group` height did not reproduce the measured 732px after 2 correction attempts; mobile flagged, the `footer-mobile-group` height did not reproduce the measured 657px after 2 correction attempts.

**Anatomy**

- `footer`: the component root, a `<footer>` (`.c-footer`)
- `footer-group`: inner block (`.c-footer__group`)
- `footer-inner`: inner block (`.c-footer__inner`)
- `footer-group-2`: inner block (`.c-footer__group-2`)
- `footer-group-3`: inner block (`.c-footer__group-3`)
- `footer-group-4`: inner block (`.c-footer__group-4`)
- `footer-group-5`: inner flex row (`.c-footer__group-5`)
- `footer-text`: label text, 37 characters (`.c-footer__text`)

**Desktop recipe**

```html
<div class="c-footer-scope">
  <footer class="c-footer">
    <div class="c-footer__group">
      <div class="c-footer__inner"></div>
      <div class="c-footer__group-2">
        <div class="c-footer__group-3"></div>
        <div class="c-footer__group-4"></div>
        <div class="c-footer__group-5">
          <span class="c-footer__text">lorem ipsum dolor sit amet consectetu</span>
        </div>
      </div>
    </div>
  </footer>
</div>
```

```css
.c-footer-scope {
  background-color: #FFFEFB;
  color: #111111;
  font-family: "Omani Rial", "Emirati Dirham", "Saudi Riyal", "Noto IKEA", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans TC", "Noto Sans", Roboto, "Open Sans", system-ui, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
}

.c-footer {
  display: block;
  border-spacing: 0px;
  box-sizing: border-box;
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: #000000;
  color: #111111;
  font-family: "Omani Rial", "Emirati Dirham", "Saudi Riyal", "Noto IKEA", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans TC", "Noto Sans", Roboto, "Open Sans", system-ui, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  padding-top: 140px;
  padding-right: 24px;
  padding-left: 24px;
}

.c-footer__group {
  display: block;
  transform: matrix(1, 0, 0, 1, 0, 0);
  transform-origin: 696px 366.164px;
}

.c-footer__inner {
  display: block;
  max-width: 1211px;
  margin: auto;
}

.c-footer__group-2 {
  display: block;
  color: #FFFFFF;
  padding-top: 80px;
  padding-bottom: 16px;
}

.c-footer__group-3 {
  display: block;
  font-size: 20px;
  line-height: 32.4px;
  margin-top: 16px;
  margin-bottom: 16px;
}

.c-footer__group-4 {
  display: block;
  opacity: 0.6;
  font-size: 14px;
  line-height: 21.98px;
}

.c-footer__group-5 {
  display: flex;
  justify-content: center;
  opacity: 0.6;
  font-size: 14px;
  line-height: 21.98px;
  margin-top: 16px;
}

.c-footer__text {
  display: block;
}
```

**Mobile anatomy**

- `footer-mobile`: the component root, a `<footer>` (`.c-footer-mobile`)
- `footer-mobile-group`: inner block (`.c-footer-mobile__group`)
- `footer-mobile-inner`: inner block (`.c-footer-mobile__inner`)
- `footer-mobile-group-2`: inner block (`.c-footer-mobile__group-2`)
- `footer-mobile-group-3`: inner block (`.c-footer-mobile__group-3`)
- `footer-mobile-group-4`: inner block (`.c-footer-mobile__group-4`)
- `footer-mobile-group-5`: inner flex row (`.c-footer-mobile__group-5`)
- `footer-mobile-text`: label text, 37 characters (`.c-footer-mobile__text`)

**Mobile recipe**

```html
<div class="c-footer-mobile-scope">
  <footer class="c-footer-mobile">
    <div class="c-footer-mobile__group">
      <div class="c-footer-mobile__inner"></div>
      <div class="c-footer-mobile__group-2">
        <div class="c-footer-mobile__group-3"></div>
        <div class="c-footer-mobile__group-4"></div>
        <div class="c-footer-mobile__group-5">
          <span class="c-footer-mobile__text">lorem ipsum dolor sit amet consectetu</span>
        </div>
      </div>
    </div>
  </footer>
</div>
```

```css
.c-footer-mobile-scope {
  background-color: #FFFEFB;
  color: #111111;
  font-family: "Omani Rial", "Emirati Dirham", "Saudi Riyal", "Noto IKEA", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans TC", "Noto Sans", Roboto, "Open Sans", system-ui, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
}

.c-footer-mobile {
  display: block;
  border-spacing: 0px;
  box-sizing: border-box;
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: #000000;
  color: #111111;
  font-family: "Omani Rial", "Emirati Dirham", "Saudi Riyal", "Noto IKEA", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans TC", "Noto Sans", Roboto, "Open Sans", system-ui, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  padding-top: 80px;
  padding-right: 16px;
  padding-left: 16px;
}

.c-footer-mobile__group {
  display: block;
}

.c-footer-mobile__inner {
  display: block;
  max-width: 794px;
  margin: auto;
}

.c-footer-mobile__group-2 {
  display: block;
  color: #FFFFFF;
  padding-top: 48px;
  padding-bottom: 16px;
}

.c-footer-mobile__group-3 {
  display: block;
  line-height: 25.92px;
  margin-top: 16px;
  margin-bottom: 16px;
}

.c-footer-mobile__group-4 {
  display: block;
  opacity: 0.6;
  font-size: 14px;
  line-height: 21.98px;
}

.c-footer-mobile__group-5 {
  display: flex;
  justify-content: center;
  opacity: 0.6;
  font-size: 14px;
  line-height: 21.98px;
  margin-top: 16px;
}

.c-footer-mobile__text {
  display: block;
}
```

**States**

- No hover or focus change was observed.

## Do's and Don'ts

### Do
- Do keep the page on `surface` (#FFFEFB) with `ink` (#111111) text; the warm off-white is part of the brand voice.
- Do reserve `primary` (#FFDB00) for the shopping CTA block and yellow buttons. The site fills `button-secondary` with it, puts `on-primary` (#111111) text on top, and hovers to `primary-tint` (#FFF094).
- Do use the dark button pattern for overlay controls: `button-ghost` is `ink` (#111111) with `on-dark` text and hovers to `ink-soft` (#333333). Its white twin `button-ghost-2` hovers to #F5F5F5. Both are 56px tall.
- Do stick to the observed corner radius, `rounded.md` (8px), on every tile and panel, as `card-group` does.
- Do set all text in the `Omani Rial` / Noto IKEA stack at weights 400 and 700 only.
- Do apply the negative tracking from `hero-display`, `display-lg` and `display-md` to every headline at 36px and above.
- Do close pages with the `surface-dark` (#000000) footer and `on-dark` links, set at `body-lg` for primary links and `body-sm` for legal links (`navigation-2`, `navigation-3`).
- Do place tile captions over photography with a dark scrim, using a `caption` eyebrow above a `display-md` headline.

### Don't
- Don't add drop shadows or backdrop blur; the site conveys hierarchy without them (`card`, `header` and `footer` carry none).
- Don't introduce new radius values beyond `rounded.md`, apart from true circles on small icon buttons.
- Don't add a second typeface or a medium/semibold weight.
- Don't use `link` (#0000EE) for visible links; it is a browser default measured on the logo link only.
- Don't spread `primary` across backgrounds, borders or text. Its rarity is what makes the CTA land.
- Don't use `success` (#1A7E3B) or `accent-orange` (#FFAE66) as general decoration; green signals availability or positive actions, orange is an occasional promo fill.
- Don't swap `surface` for pure #FFFFFF on the page canvas, or `ink` for pure black in body text.

## Responsive Behavior

This analysis is two-viewport (one desktop, one mobile capture). No breakpoint values could be observed.

### What changes between the two captures
- **Header shrinks.** The desktop `header` is 96px tall; the mobile `header-mobile` is 68px. Both keep the 89×36px logo (`header-logo-image`, `header-mobile-logo-image`) and the `surface` fill. On mobile, the text nav collapses behind a hamburger.
- **Grid collapses to one column.** The desktop modular two-column story feed becomes a single full-width stack of tiles with consistent vertical gaps. The `card` recipe was captured as 4 instances in a 1-column grid with a 20px gap.
- **Hero CTA moves below.** The yellow shopping card, which sits beside the hero image on desktop, drops beneath it as a full-width card on mobile.
- **Footer compresses.** The `footer` is 872px tall on desktop and `footer-mobile` is 737px. Both keep the black fill and white `body-sm` text (`footer-text`, `footer-mobile-text`).

### Touch targets
The overlay buttons `button-ghost` and `button-ghost-2` measure 56px tall, which is comfortably touch-sized. The `header-cta` link carries 20px padding on all sides. Keep any new tappable control at or above the 56px button height on mobile.

### Unknowns
Intermediate tablet layouts, the exact collapse point and type scaling between viewports were not captured. Display sizes are recorded from desktop only.

## Iteration Guide

1. **Reference tokens, never hex.** Use `primary`, `surface`, `ink`, `surface-dark`, `on-dark` and the rest by name. If a color you need is not a token (such as the #F5F5F5 hover on `button-ghost-2`), keep it scoped to that component's state.
2. **Protect the yellow.** `primary` belongs to the shopping CTA panel and yellow buttons (`button-secondary`). Adding it elsewhere breaks the system's single focal point. Its hover is always `primary-tint`.
3. **One family, two weights, one radius.** The stack is `Omani Rial` / Noto IKEA, weights are 400 and 700 only, and the radius is `rounded.md` (8px). Treat all three as fixed boundaries; propose new values only with live-site evidence.
4. **Choose type from the ladder.** Pick sizes from the typography tokens (`hero-display` through `micro`) and keep each token's own line-height and tracking. Do not round the fractional display sizes, and do not apply negative tracking below `display-md`.
5. **Stay flat.** Express new layers through a surface change (`surface` → `primary` → `surface-dark`) or a 1px hairline (`hairline`), never box-shadow or blur.
6. **Variants live in recipes.** Variants come from the existing recipes: `button-secondary` (yellow), `button-ghost` (dark) and `button-ghost-2` (white). Note that most recipes are flagged, so re-check their geometry before you derive new components from them.
7. **Treat spacing as unverified.** No spacing tokens exist. Do not invent a named scale; if you add one, document it as new and verify it against the live page.

## Known Gaps

- **Single page.** Only https://ikea.com/ (the IKEA Global corporate homepage) was captured. Product listings, product pages, cart, search and account surfaces were not reached, so their components are unknown.
- **No spacing tokens.** Nothing survived grounding: no base unit, container width, grid gap or section rhythm was verified. The layout section is qualitative only.
- **Most recipes did not reproduce:**
  - `button-secondary` (flagged: the render matched 94% of the original pixels, below the 97% required after 2 correction attempts)
  - `button-ghost` (flagged: the render matched 52% of the original pixels, below the 97% required after 2 correction attempts)
  - `button-ghost-2` (flagged: the render matched 55% of the original pixels, below the 97% required after 2 correction attempts)
  - `card` (flagged: the render matched 9% of the original pixels, below the 96% required (instance 1) after 2 correction attempts)
  - `navigation` (flagged: the `navigation-list` height did not reproduce the measured 54px after 2 correction attempts)
  - `navigation-3` (flagged: the `navigation-3-item` width did not reproduce the measured 113px after 2 correction attempts)
  - `header` (flagged: the `header-inner` y did not reproduce the measured 21px after 2 correction attempts)
  - `footer` (flagged: the `footer-group` height did not reproduce the measured 732px after 2 correction attempts)
  - `header-mobile` (flagged: the `header-mobile-inner` y did not reproduce the measured 12px after 2 correction attempts)
  - `footer-mobile` (flagged: the `footer-mobile-group` height did not reproduce the measured 657px after 2 correction attempts)
  - Only `navigation-2` verified.
- **Card content.** Two inner blocks of `card` (`card-group-3`, `card-group-4`) were not captured, so tile caption internals are inferred from screenshots.
- **Interaction states.** Hover fills were measured for the three buttons only. Focus states are listed but carry no values, and no focus-ring color was captured. Active and disabled states, and the green `success` control's full styling, are unknown.
- **Circular icon buttons and image scrim.** These are visible in the screenshots but have no measured size, radius or gradient values.
- **Typeface identity.** The tokens record `Omani Rial` as the family, but that is likely a currency-glyph subset font; the Noto IKEA attribution is inferred from the stack.
- **Motion and responsive.** Carousel and video behavior, transitions and intermediate breakpoints were not captured; only two viewports were sampled.
