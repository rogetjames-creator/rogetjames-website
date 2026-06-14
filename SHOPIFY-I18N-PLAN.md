# Plan: Shopify Integration + Regionalised i18n for ROGETjames

## How to Execute This Plan with Claude Code

Open Claude Code in this project directory and paste one of the prompts below to execute a phase. Run them in order — each phase builds on the previous one.

**Phase 0:**
> Implement Phase 0 from SHOPIFY-I18N-PLAN.md — add react-router-dom routing to the project. Keep all existing visual behaviour identical. Read the plan file for full details of files to create and modify.

**Phase 1:**
> Implement Phase 1 from SHOPIFY-I18N-PLAN.md — add i18n infrastructure with react-i18next. Extract all hardcoded strings, create translation files for en-AU/en-US/en-GB, add region switcher and geo-routing. Read the plan file for full details.

**Phase 2:**
> Implement Phase 2 from SHOPIFY-I18N-PLAN.md — add Shopify headless storefront integration. Create the shop page, product page, cart drawer, and Storefront API client. Read the plan file for full details. Note: the Shopify store must already be set up with products before this phase can be fully tested.

**Phase 3:**
> Implement Phase 3 from SHOPIFY-I18N-PLAN.md — add regional product prioritisation using the region config and useRegion hook. Read the plan file for full details.

**Phase 4:**
> Implement Phase 4 from SHOPIFY-I18N-PLAN.md — SEO hardening and polish. Expand prerendering, generate sitemaps, add Product structured data, lazy-load shop components. Read the plan file for full details.

After each phase, ask Claude to commit and deploy:
> Commit these changes and deploy to Netlify.

---

## Context

The ROGETjames website is a single-page React 19 + Vite 7 portfolio site with no routing, 45 hardcoded gallery items (name + CDN image, no pricing), GSAP scroll animations, and a Playwright prerender script for SEO. It's deployed to Netlify.

The goal is to add:
1. **Shopify headless storefront** — so visitors can browse and purchase laser-cut designs
2. **Regionalised versions** — AU/US/UK with different product priorities, currencies, and localised copy

This is a significant architectural expansion. The plan is phased so each phase ships independently.

---

## Phase 0: Routing Foundation (2-3 days)

**Why:** Both Shopify and i18n need page routing. Currently everything is hash-based anchors on one page.

**New dependency:** `react-router-dom`

**Changes:**
- `src/main.jsx` — wrap app in `<BrowserRouter>`
- `src/App.jsx` — becomes the homepage route; extract layout shell (NoiseOverlay, Navbar, Footer) into `src/layouts/MainLayout.jsx`
- `src/router.jsx` — new file defining routes: `/` (home), `/shop`, `/shop/:handle`
- `src/components/Navbar.jsx` — add "Shop" link; keep `#section` hash links for within-homepage nav
- `src/components/Footer.jsx` — add "Shop" link
- `netlify.toml` (new, at project root) — add SPA fallback: `/* -> /index.html` with status 200
- `scripts/prerender.mjs` — expand from single route to array of routes, writing each to `dist/{path}/index.html`

**Invisible to users** — no visual changes, just plumbing.

---

## Phase 1: i18n Infrastructure (4-5 days)

**New dependencies:** `react-i18next`, `i18next`, `i18next-http-backend`, `i18next-browser-languagedetector`, `react-helmet-async`

**Translation structure:**
```
public/locales/
  en-AU/common.json, home.json, gallery.json, services.json, contact.json, shop.json
  en-US/...
  en-GB/...
```

**Key files to create:**
- `src/i18n.js` — i18next init with HTTP backend, URL path detection, `en-AU` default
- `src/components/RegionSwitcher.jsx` — globe dropdown in navbar (AU/US/UK)
- `src/components/SEOHead.jsx` — dynamic `<head>` via react-helmet-async (hreflang tags, og:locale, html lang)

**Key files to modify:**
- `src/router.jsx` — add `/:locale/*` prefix routes alongside root routes
- All 9 components — replace ~100-120 hardcoded strings with `t('key')` calls. Product/artwork names (BANKSIA, GREN Edge, etc.) stay untranslated — they're brand names.
- `public/sitemap.xml` — expand for locale variants
- `netlify.toml` — add geo-routing redirects (302, not 301):
  ```toml
  [[redirects]]
    from = "/"
    to = "/us/"
    status = 302
    conditions = {Country = ["US"]}
  ```

**URL structure:**
- `/` — en-AU (default, no prefix, preserves SEO equity)
- `/us/` — en-US
- `/uk/` — en-GB

**Regional differences are mostly:** spelling (aluminium/aluminum), currency display, contact info emphasis, shipping notes. Not full translations.

---

## Phase 2: Shopify Storefront Integration (7-10 days)

**Prerequisites (non-code):**
- Shopify store created (Starter or Basic plan, $29+/mo)
- Storefront API access token generated
- ~30-40 products entered with variants, pricing, images, collections matching the 5 gallery categories
- Shopify Markets configured for AU, US, UK regions

**New dependencies:** `@shopify/storefront-api-client`, `@shopify/hydrogen-react`

**Key files to create:**
- `src/lib/shopify.js` — Storefront API client init (store domain + token from `VITE_SHOPIFY_*` env vars)
- `src/lib/shopify-queries.js` — GraphQL queries (products by collection, product by handle, cart CRUD). Uses `@inContext(country: $country)` for regional pricing.
- `src/hooks/useShopifyProducts.js` — product fetch hook with loading/error states
- `src/pages/ShopPage.jsx` — product listing mirroring Gallery aesthetic (same tab nav, grid, card design) but with prices + "Add to Cart"
- `src/pages/ProductPage.jsx` — individual product: hero image, variant selector, price, add-to-cart, related products
- `src/components/CartDrawer.jsx` — slide-out cart sidebar; "Checkout" redirects to Shopify hosted checkout
- `src/components/ProductCard.jsx` — reusable card (same style as gallery cards + price overlay)
- `src/lib/gallery-shopify-map.js` — maps gallery item names to Shopify product handles so Gallery can show optional "Shop this design" links
- `.env.example` — document required env vars

**Key files to modify:**
- `src/main.jsx` — wrap in `<ShopifyProvider>` + `<CartProvider>`
- `src/router.jsx` — add `/shop`, `/shop/:handle`, `/:locale/shop`, `/:locale/shop/:handle`
- `src/components/Navbar.jsx` — add cart icon with count badge
- `src/components/Gallery.jsx` — add subtle "Shop this design" links on items that have Shopify products (gallery stays a portfolio, not a store)
- `src/components/Services.jsx` — "View Catalogues" CTA links to `/shop`

**Cart flow:** Browse on site > Add to cart > Cart drawer > "Checkout" > Shopify hosted checkout page > order confirmation. No payment handling in our code.

**Important:** "Bespoke & Commissions" category items are completed projects (Fiona Stanley Hospital, etc.), NOT purchasable products. They link to the Contact form.

---

## Phase 3: Regional Product Prioritisation (3-4 days)

**Requires Phase 1 + 2.**

**Key files to create:**
- `src/lib/region-config.js` — per-region settings: default featured collection, hero image variant, contact phone visibility, shipping notes
- `src/hooks/useRegion.js` — reads current locale, returns region config

**Key files to modify:**
- `src/pages/ShopPage.jsx` — default collection/sort per region
- `src/components/Hero.jsx` — optionally swap tagline per region
- `src/components/Contact.jsx` — show/hide phone, adjust location text

Shopify Markets handles currency conversion automatically via the `@inContext` GraphQL directive — no manual conversion needed.

---

## Phase 4: SEO Hardening + Polish (3-5 days)

- Expand prerender script to crawl all locale + product route combinations (potentially ~96 pages)
- Create `scripts/generate-sitemap.mjs` — build-time sitemap generation fetching product handles from Shopify, with hreflang alternates
- Add `@type: Product` JSON-LD structured data on product pages
- Lazy-load shop components via `React.lazy` + `Suspense` so homepage bundle stays lean
- Add error boundaries around Shopify-dependent components
- Cart persistence via localStorage (hydrogen-react CartProvider handles this)

---

## Dependency Summary

| Package | Phase | Purpose |
|---------|-------|---------|
| `react-router-dom` | 0 | Client-side routing |
| `react-i18next` + `i18next` | 1 | Translation framework |
| `i18next-http-backend` | 1 | Lazy-load translation JSON |
| `i18next-browser-languagedetector` | 1 | Detect locale from URL path |
| `react-helmet-async` | 1 | Dynamic `<head>` for SEO |
| `@shopify/storefront-api-client` | 2 | Shopify GraphQL client |
| `@shopify/hydrogen-react` | 2 | Cart, Money, Image components |

8 new packages (currently 5 runtime deps).

---

## Risks & Honest Assessment

1. **Shopify product setup is a separate ~2-3 day content task** — someone needs to enter 30-40 products with variants, pricing, images, collections. This is admin work, not code.

2. **Prerender complexity jumps significantly** — from 1 page to ~96 pages. Build times will increase. Consider making prerender discovery dynamic rather than hardcoded.

3. **GSAP + routing** — route transitions unmount/remount components, re-triggering animations. The existing `useEffect` cleanup pattern (`ctx.revert()`) handles this, but page transitions may need polish.

4. **Translation maintenance overhead** — 120 strings x 3 locales = 360 entries. For en-AU/US/UK the differences are subtle (spelling variants). Consider starting with just 2 locales (AU + International) to test the waters.

5. **Do NOT use Shopify Buy SDK** — deprecated Jan 2025, sunset Jan 2026. Use `@shopify/storefront-api-client` + `@shopify/hydrogen-react` instead.

6. **Do NOT migrate to Hydrogen/Remix** — too disruptive. Keep current Vite + React architecture.

---

## Total Effort: ~19-27 working days

Each phase ships independently. Phase 0+1 can be done while Shopify store is being set up (separate task).

---

## Verification

After each phase:
- `npm run build` passes (including prerender)
- `npm run dev` — manual test of all routes + navigation
- Lighthouse audit: performance, SEO, accessibility scores
- After Phase 2: test full cart flow (add item > cart drawer > checkout redirect)
- After Phase 1: test geo-routing with Netlify deploy previews + VPN/location spoofing
- Check prerendered HTML in `dist/` contains full content for all routes
