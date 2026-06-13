# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Working with the owner

The site owner (James) is not a developer. Do not use technical jargon. Avoid terms like "component", "props", "state", "API", "render", "deploy pipeline", "bundle", "dependency" — unless immediately explained in plain language.

James is design-literate. Engage directly on layout, typography, colour, spacing, and motion.

**Communication style — mandatory:**
- No pleasantries, no filler, no personality. Facts only.
- Do not say "Great!", "Sure!", "Of course!", "Happy to help" or anything like it.
- Do not narrate what you are about to do — just do it.
- Responses are short and direct. One sentence where one sentence is enough.
- This applies to the AI chat widget on the site as well — responses should be factual and concise, not warm or conversational.

**Autonomy — mandatory:**
- James is not a developer. His role is aesthetic direction, not technical operation.
- Never ask James to open dashboards, check settings, run commands, copy values, or perform any technical step.
- If something can be done via code, API, or CLI — do it. If it genuinely cannot be done without credentials or access that don't exist in this environment, state that fact in one sentence and move on. Do not turn it into a task for James.

## Project

Portfolio website for ROGETjames — bespoke laser cut wall art, sculpture & architectural features by James Roget. Live at https://rogetjames-new.netlify.app/ (preview — will become rogetjames.com on launch). Deployed automatically to Netlify on every push to `main`.

## Commands

```bash
npm run dev          # Start dev server (Vite) on port 5173
npm run build        # Production build: Vite + Playwright prerender
npm run build:quick  # Vite build only (skips prerender — use for most deploys)
npm run lint         # ESLint
npm run preview      # Serve dist/ locally
```

`npm run build` uses Playwright to prerender `dist/index.html` for crawlers — requires Playwright's Chromium and adds ~5s. `netlify.toml` uses `build:quick` for Netlify deploys (prerender runs separately if needed).

Local dev via Netlify CLI runs on port 8888 and proxies the Vite dev server on 5173, which is required to use the `/api/chat` Netlify Function locally.

## Architecture

**Stack:** React 19, Vite 7, Tailwind CSS v4, GSAP 3 + ScrollTrigger, Lenis smooth scroll, Lottie React, Lucide React icons.

**Page order** — `App.jsx` composes all sections: Navbar → Hero → Gallery → About → BespokeCommissions → StudioBio → Process → Services → Contact → DiscoverPortals → Footer → ScrollArrows → ChatWidget.

**Scroll architecture** — Lenis (`autoRaf: false`) is driven by GSAP's ticker (`gsap.ticker.add(update)`) in `App.jsx`. This keeps ScrollTrigger frame-perfect. All components register `ScrollTrigger` themselves. Never add a second Lenis instance.

**GSAP pattern** — All animations must use `gsap.context(() => { ... }, ref)` inside `useEffect` and return `ctx.revert()`. Use `onEnter` (not `onStart`) for ScrollTrigger callbacks. Drift-in entrance pattern: `gsap.fromTo(el, { x, y, opacity:0 }, { x:0, y:0, opacity:1, duration:1.6, ease:"power2.out" })`.

**Tailwind CSS v4** — All theme tokens in `src/index.css` under `@theme { }`. No `tailwind.config.js`. Key tokens: `bg-jet`, `text-cream`, `text-clay`, `bg-moss`, `text-charcoal`. Font stack: `font-heading` (Plus Jakarta Sans), `font-drama` (Cormorant Garamond italic), `font-detail`, `font-mono`.

**CDN** — All commission/gallery images are served from `https://cdn.myportfolio.com/b2648aa0-9d7e-45a7-9f99-54d55b4ec92e`. Local hero and about images are in `public/images/`.

**Lottie animations** — JSON files live in `public/lottie/`. Use `lottie-react` with `autoplay={false}` and a `lottieRef` for manual `.play()/.stop()/.setSpeed()`. The "secret garden" stroke-draw technique: fetch via `path=` prop (no bundle cost), trigger after text settles, loop at ~60% opacity.

## Key systems

**Gallery (Gallery.jsx)** — `CATEGORIES` constant at the top defines all catalogue image data: tabs (Residential/Commercial/Public), series, names, sizes, and per-piece pricing in `PIECE_SIZES`. `MATERIAL_OPTIONS` and `SIZE_TIERS` define the quote builder. Adding/removing gallery items means editing `CATEGORIES`. The detail panel, search modal, flipbook modal, colour catalogue modal, and client preview modal are all self-contained inside this one file.

**Quote system** — Gallery dispatches `window.dispatchEvent(new CustomEvent("quote-add", { detail }))` when a user adds to quote. `App.jsx` listens and accumulates items in `quoteItems` state, which is passed down to `Contact` for the quote request form.

**Bespoke Commissions (BespokeCommissions.jsx)** — `COMMISSIONS` object organises images by tab (commercial/public/residential) and series. `CATEGORY_FILTERS` maps category IDs to series IDs for the filter UI. `_manualCodes` is a per-image map of `{ tabs, cats, aspects }` that overrides the auto-derived `_debugMap` for the audit label overlay. `DEBUG_LABELS = true` at line 313 — **set to `false` before going live**. `STRIP_IMAGES` drives the sliding strip between sections.

**Chat widget** — `ChatWidget.jsx` calls `/api/chat` which maps (via `netlify.toml`) to `netlify/functions/chat.js`. Requires `ANTHROPIC_API_KEY` environment variable set in Netlify dashboard. Without it the chat returns errors in production.

**Prerender** — `scripts/prerender.mjs` spins up a static server on 4173, launches headless Chromium, waits 2s for animations, then overwrites `dist/index.html`. Gives crawlers real content without SSR.

## Key conventions

- **Hero slideshow images** — always `object-contain` on ALL screen sizes. Never change to `object-cover`. James wants the full image visible with letterboxing, not cropped to fill the screen.
- No TypeScript — plain `.jsx` and `.js` throughout.
- ESLint: `no-unused-vars` is `error`. Uppercase constants (`/^[A-Z_]/`) are exempt. Prefix intentionally unused destructured vars with `_`.
- Section anchor IDs: `#collection`, `#about`, `#bespoke`, `#process`, `#services`, `#contact`.
- `window.__galleryModalBody` is a ref attached by Gallery's lightbox so `ScrollArrows` in `App.jsx` can redirect scroll into the modal instead of the page.
- Gate animation pattern (Gallery + BespokeCommissions strips): two black `position:absolute` panels at `z-20` slide apart on `start:"top bottom"` over 8s linear; the portal sits at `z-30 relative` above them.
- `NoiseOverlay` is a fixed SVG grain texture at `z-index: 9999` — never put UI above it without a higher z-index.
- The `CommissionsSection` is referred to as **the Bespoke section**. It is hidden by default behind a `Reveal` button labelled "Bespoke".
- `DiscoverPortals` is hidden by default behind a `Reveal` button labelled "Discover Portals". Both use GSAP height animation (blind-reveal) in `App.jsx`.

## Client Vault System (built on branch `claude/remote-status-check-re48a5`)

A personalised, locked page sent to each client by email. Not yet merged to main.

**How it works:**
1. James adds a client row to Airtable (`Clients` table)
2. James visits `/vault?admin=1`, enters his admin password, types client email → hits Send
3. Client receives a branded email (via Resend) with a unique link: `rogetjames.com/vault?token=TOKEN`
4. Client enters their email on the vault page to verify identity → page unlocks
5. Client sees their exclusive page; a footer CTA draws them to the main site
6. LocalStorage caches the session so they can revisit without re-entering email

**Key files (on the feature branch):**
- `vault.html` — separate HTML entry point (Vite multi-page app)
- `src/vault.jsx` — React entry for the vault page
- `src/components/VaultPage.jsx` — full vault UI in one file
- `netlify/functions/vault-verify.js` — verifies email + token against Airtable, returns client content
- `netlify/functions/vault-invite.js` — admin sends invite email via Resend

**Vault page sections** (each only renders if Airtable content exists):
- Full-screen hero slideshow — GSAP crossfade, progress bar, slide dots
- Sticky header — appears on scroll via ScrollTrigger
- Project overview — greeting pull-quote, description, status badge
- Gallery slideshow — GSAP horizontal slide transitions, click for fullscreen lightbox
- Key Points grid — numbered cards, scroll-triggered stagger animation
- Links / resources — hover cards, link anywhere (external or internal)
- PDF downloads
- Footer CTA → main site

**Admin panel at `/vault?admin=1`:**
- Password protected via `VAULT_ADMIN_SECRET` Netlify env var
- Enter client email → sends invite → shows vault URL to copy

**Airtable `Clients` table fields:**

| Field | Type | Notes |
|---|---|---|
| Name | Single line | Client/project name |
| Email | Email | Client email address |
| Token | Single line | UUID — auto-generated by invite function, do not edit |
| Project Title | Single line | e.g. "Garden Sculpture Commission" |
| Project Description | Long text | Shown in overview section |
| Location | Single line | e.g. "Perth, WA" |
| Status | Single select | Design / In Progress / Review / Complete / Delivered |
| Greeting | Single line | Opening pull-quote message shown to client |
| Images | Attachments | All project images — used for hero slideshow + gallery |
| Key Points | Long text | One point per line |
| Links | Long text | One per line: `Label\|URL` or `Label\|URL\|Description` |
| PDFs | Attachments | Downloadable documents |
| Invite Sent | Checkbox | Auto-set when invite is sent |

**Netlify environment variables required:**
```
AIRTABLE_API_KEY       — Airtable personal access token
AIRTABLE_BASE_ID       — Base ID (starts with "app…")
AIRTABLE_TABLE_NAME    — Optional, defaults to "Clients"
RESEND_API_KEY         — Resend API key (James has an account)
VAULT_ADMIN_SECRET     — Password James uses at /vault?admin=1
VAULT_FROM_EMAIL       — e.g. "ROGETjames <james@rogetjames.com>"
```

**Open decisions:**
- CMS is Airtable. James was also considering Notion and Supabase for richer content management — not yet decided.
