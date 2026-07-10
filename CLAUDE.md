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
- This applies to the AI chat widget on the site as well — responses should be factual and concise, not warm or conversational. Never use affirming/complimentary phrases like "Good choice" or "Great question" in chat widget replies — just answer. Keep chat widget replies short; avoid long-winded answers.

**Pricing — mandatory, non-negotiable:**
- NEVER display prices openly anywhere on the site. No price figures in captions, thumbnails, close-ups, tooltips, gallery labels, or shared links.
- Pricing is ALWAYS gated behind the postcode step — prices appear only inside the postcode-gated pricing panel, after the visitor enters their postcode.
- Do not add "from $X" summaries, price ranges, or any visible price outside that gate, even if asked to "coordinate" pricing across views.
- No price value may ever travel in a URL or shared link.

**Autonomy — mandatory:**
- James is not a developer. His role is aesthetic direction, not technical operation.
- Always supply URLs as clickable links, never plain text addresses.
- Never ask James to open dashboards, check settings, run commands, copy values, or perform any technical step.
- If something can be done via code, API, or CLI — do it. If it genuinely cannot be done without credentials or access that don't exist in this environment, state that fact in one sentence and move on. Do not turn it into a task for James.

**Session startup — mandatory:**
- At the start of every session, run `git pull origin main` before touching any file. Local and remote must be in sync before any work begins.
- Search `~/.claude/projects/` for the rogetjames-website project folder and scan recent `.jsonl` session files for any design decisions, instructions, or changes James described that may not be reflected in the current code.
- Never make design changes without first checking if James previously gave instructions on that element. If prior instructions exist, follow them exactly — do not invent alternatives.

**Git sync — mandatory:**
- After every meaningful change — commit and push immediately. Never batch changes to end of session.
- One feature or fix = one commit + one push. Do not accumulate.
- This is non-negotiable. Lost work from uncommitted sessions cannot be recovered.

## Project

Portfolio website for ROGETjames — bespoke laser cut wall art, sculpture & architectural features by James Roget. Live at https://rogetjames.com/.

**Hosting and deployment — mandatory, check this first:**
- The one and only source of truth is the GitHub repository `rogetjames-creator/rogetjames-website`.
- Netlify is connected to that repository and watches its `main` branch. Every push to `main` triggers an automatic Netlify build and deploy — nothing else needs to happen for a change to go live.
- At the start of every session, confirm the connected repository is `rogetjames-creator/rogetjames-website` before doing anything else. If it is not, tell James in one sentence and stop — do not proceed as if a different repository were the real project.

## Commands

```bash
npm run dev          # Start dev server (Vite) on port 5173
npm run build        # Production build: Vite + Playwright prerender (used by Netlify)
npm run build:quick  # Vite build only (skips prerender — for a fast local check)
npm run lint         # ESLint
npm run preview      # Serve dist/ locally
```

`npm run build` uses Playwright to prerender `dist/index.html` so crawlers (Google, Facebook, etc.) see real page content instead of an empty shell — adds ~5-10s to the build, plus a first-time browser download via the `postinstall` script (`playwright install chromium`). `netlify.toml` runs `npm run build` on every deploy. If this ever needs to be reverted to the faster `build:quick` (e.g. Playwright/Chromium fails to install on Netlify's build image), a failed build does not take the live site down — Netlify keeps serving the last successful deploy.

Local dev via Netlify CLI runs on port 8888 (`netlify dev`) and proxies the Vite dev server on 5173. Port 8888 is required to exercise the `/api/*` Netlify Functions locally (chat, contact, vault, stats, media). The Vite config also proxies `/api/chat`, `/api/vault-*`, and `/api/stats-data` to 8888 when running `vite` directly.

## Architecture

**Stack:** React 19, Vite 7 (multi-page), Tailwind CSS v4, GSAP 3 + ScrollTrigger, Lenis smooth scroll, Lottie React, Lucide React icons. `react-pageflip` (catalogue flipbook), `react-pdf` (PDF viewing), `@netlify/blobs` (server-side storage in functions).

**Multi-page build** — `vite.config.js` defines five HTML entry points, each its own React root:

| URL (via `netlify.toml` rewrite) | HTML | Entry | Root component | Purpose |
|---|---|---|---|---|
| `/` | `index.html` | `src/main.jsx` | `App.jsx` | Main public site |
| `/vault` | `vault.html` | `src/vault.jsx` | `VaultPage.jsx` | Client vault (see below) |
| `/stats` | `stats.html` | `src/stats.jsx` | `StatsPage.jsx` | Analytics dashboard (admin) |
| `/media` | `media.html` | `src/media.jsx` | `MediaPage.jsx` | Photo upload tool (admin) |
| `/admin` | `admin.html` | `src/admin.jsx` | `AdminPage.jsx` | Hub linking to the admin pages |

`vite.config.js` also runs a `critical-css` plugin (Critters) at build end that inlines above-the-fold CSS into each of the five HTML files.

**Page order (main site)** — `App.jsx` composes: Navbar → Hero → StudioBio → Gallery → About → CommissionsSection → Process → Services → Contact → DiscoverPortals → Footer → ScrollArrows → ChatWidget. Gallery, CommissionsSection, and DiscoverPortals are lazy-loaded (`lazy` + `Suspense`). `CommissionsSection` (the **Bespoke section**) is exported from `BespokePortals.jsx`, which composes portal tiles over `BespokeCommissions.jsx` and `DiscoverPortals.jsx` modals.

**Scroll architecture** — Lenis (`autoRaf: false`) is driven by GSAP's ticker (`gsap.ticker.add(update)`) in `App.jsx`. This keeps ScrollTrigger frame-perfect. All components register `ScrollTrigger` themselves. Never add a second Lenis instance.

**GSAP pattern** — All animations must use `gsap.context(() => { ... }, ref)` inside `useEffect` and return `ctx.revert()`. Use `onEnter` (not `onStart`) for ScrollTrigger callbacks. Drift-in entrance pattern: `gsap.fromTo(el, { x, y, opacity:0 }, { x:0, y:0, opacity:1, duration:1.6, ease:"power2.out" })`.

**Tailwind CSS v4** — All theme tokens in `src/index.css` under `@theme { }`. No `tailwind.config.js`. Key colour tokens: `bg-jet`/`bg-onyx`/`bg-ink`/`bg-graphite` (matt-black shades), `text-cream`, `text-clay`, `bg-moss`, `text-charcoal`. Font tokens: `font-heading` (Plus Jakarta Sans), `font-drama` (Playfair Display), `font-detail` (Jost), `font-body` (DM Sans), `font-mono` (IBM Plex Mono), plus `font-syne`, `font-benguiat`, `font-bebas`.

**Images** — Local images live in `public/images/` (organised by series/category subfolders). They are served through the **Netlify Image CDN** for automatic WebP + resizing: use `netlifyImg(src, { w, q })` from `src/utils/img.js`, which rewrites a local path to `/.netlify/images?url=…&fm=webp`. External `http(s)`/`data:` URLs pass through unchanged. Videos are in `public/videos/`, PDFs in `public/pdfs/`.

**Lottie animations** — JSON files live in `public/lottie/`. Use `lottie-react` with `autoplay={false}` and a `lottieRef` for manual `.play()/.stop()/.setSpeed()`. The "secret garden" stroke-draw technique: fetch via `path=` prop (no bundle cost), trigger after text settles, loop at ~60% opacity.

## Key systems

**Gallery (`Gallery.jsx`)** — the largest file. `CATEGORIES` defines all catalogue image data: tabs (Residential/Commercial/Public), series, names, sizes, and per-piece pricing in `PIECE_SIZES`. `MATERIAL_OPTIONS` and `SIZE_TIERS` define the quote builder. `MEDIA_DESTINATIONS` (exported) is derived from the categories and drives the `/media` upload picker. On mount, Gallery also fetches `/api/media-list` and `/api/up-close-list` to merge in James's uploaded photos by exact destination key. The detail panel, `SearchModal`, flipbook, colour catalogue, `CatPageViewer`, and `ClientPreview` are wired in around this file.

**Postcode / pricing gate** — prices are computed and shown only after a visitor enters a postcode (WA vs interstate logic in `Gallery.jsx`). Entering a postcode fires an analytics event (see below) and never puts a price in the URL.

**Quote system** — Gallery dispatches `window.dispatchEvent(new CustomEvent("quote-add", { detail }))` when a user adds to quote. `App.jsx` listens and accumulates items in `quoteItems` state, passed down to `Contact` for the quote request form. `Contact` submits to `/api/contact`.

**Bespoke Commissions (`BespokeCommissions.jsx`)** — `COMMISSIONS` object organises images by tab (commercial/public/residential) and series. `CATEGORY_FILTERS` maps category IDs to series IDs for the filter UI. `_manualCodes` is a per-image map of `{ tabs, cats, aspects }` that overrides the auto-derived `_debugMap` audit overlay. `DEBUG_LABELS` (near line 328) is a dev-only audit overlay — **keep `false` in production**. `STRIP_IMAGES` drives the sliding strip between sections. This file also exports the gallery modals (`ScreensGalleryModal`, `SculptureGalleryModal`, `ProjectsGalleryModal`, `ConceptsGalleryModal`) consumed by `BespokePortals.jsx`.

**Chat widget** — `ChatWidget.jsx` calls `/api/chat` (`netlify/functions/chat.js`), requires `ANTHROPIC_API_KEY`. When the widget closes it posts the conversation to `/api/chat-transcript`, which stores it in a Netlify Blobs `chat-transcripts` store and emails James (Resend).

**Prerender** — `scripts/prerender.mjs` spins up a static server on 4173, launches headless Chromium, waits ~2s for animations, then overwrites `dist/index.html`. Gives crawlers real content without SSR.

## Netlify Functions (`netlify/functions/`)

All `/api/*` routes are rewritten to functions in `netlify.toml`. Server-side storage is **Netlify Blobs** (no external DB); several functions email James via **Resend**.

| Function | Route | Purpose |
|---|---|---|
| `chat.js` | `/api/chat` | Claude-backed chat widget (`ANTHROPIC_API_KEY`) |
| `chat-transcript.js` | `/api/chat-transcript` | Store + email a closed chat conversation |
| `contact.js` | `/api/contact` | Contact / quote form → email (Resend), with origin + rate-limit guards |
| `track-event.js` | `/api/track-event` | Log pricing/postcode interest to Blobs (`pricing-interest`); emails James on postcode entry |
| `stats-data.js` | `/api/stats-data` | Admin dashboard data; also the password check (gated by `VAULT_ADMIN_SECRET`) |
| `weekly-stats.js` | — (scheduled) | Weekly digest email of pricing interest; `config.schedule = "0 22 * * 0"` |
| `stats-digest.mjs` | — (scheduled) | **Temporary** one-shot digest; safe to delete after it has run |
| `media-upload.js` | `/api/media-upload` | Admin upload — commits photos as real files into the repo via `GITHUB_TOKEN` (one commit per batch → one rebuild); also writes to `media-library`/`up-close-images` Blobs |
| `media-list.js` | `/api/media-list` | Public list of uploaded gallery photos (id, destinations, src) |
| `media-img.js` | `/api/media-img` | Serve a stored media-library image |
| `up-close-upload.js` / `up-close-list.js` / `up-close-img.js` | `/api/up-close-*` | Manage the "Up Close" detail-shot images |
| `vault-invite.js` | `/api/vault-invite` | Admin sends a client vault invite email (Resend) |
| `vault-verify.js` | `/api/vault-verify` | Verify client email + token against Airtable, return content |

Admin-only functions authenticate by comparing a posted `adminSecret` against `VAULT_ADMIN_SECRET` (constant-time compare). The `/admin`, `/stats`, and `/media` pages cache this password in `localStorage` (`stats_key`) so they unlock automatically on James's device.

**Netlify environment variables:**
```
ANTHROPIC_API_KEY      — Claude chat widget
RESEND_API_KEY         — all outbound email (contact, alerts, vault, digests)
CONTACT_FROM_EMAIL     — from-address for contact/digest email (falls back to VAULT_FROM_EMAIL)
VAULT_FROM_EMAIL       — e.g. "ROGETjames <james@rogetjames.com>"
NOTIFY_EMAIL           — where alerts/digests are sent (defaults to james@rogetjames.com)
VAULT_ADMIN_SECRET     — admin password for /admin, /stats, /media, /vault?admin=1
GITHUB_TOKEN           — media-upload commits photos into the repo
AIRTABLE_API_KEY       — vault client data
AIRTABLE_BASE_ID       — Airtable base (starts with "app…")
AIRTABLE_TABLE_NAME    — optional, defaults to "Clients"
```

## Analytics (`/stats`)

`track-event.js` writes visitor pricing/postcode interest to the `pricing-interest` Netlify Blobs store. `StatsPage.jsx` (behind the admin password) reads a rollup via `stats-data.js` and also hosts the "Up Close" uploader. `weekly-stats.js` emails James a weekly summary. Chat transcripts are stored alongside for review.

## Media upload workflow (`/media`)

James adds photos from his phone at `/media` (password-gated). `MediaPage.jsx` downscales/compresses each image in-browser, then posts to `media-upload.js`, which **commits the files into `public/images/` in the repo** (single batch commit → single Netlify rebuild) and records their exact destination keys. The gallery reads `/api/media-list` and places each image by key — no text guessing. New category uploads land as gallery pieces at the END of that category (see Key conventions).

## Client Vault System (merged to `main`)

A personalised, locked page sent to each client by email. Entry point `/vault`.

**How it works:**
1. James adds a client row to Airtable (`Clients` table).
2. James visits `/vault?admin=1`, enters the admin password, types the client email → Send.
3. Client receives a branded email (via Resend) with a unique link: `rogetjames.com/vault?token=TOKEN`.
4. Client enters their email on the vault page to verify identity → page unlocks.
5. Client sees their exclusive page; a footer CTA draws them to the main site.
6. LocalStorage caches the session so they can revisit without re-entering email.

**Key files:** `vault.html`, `src/vault.jsx`, `src/components/VaultPage.jsx`, `netlify/functions/vault-verify.js`, `netlify/functions/vault-invite.js`.

**Vault page sections** (each renders only if Airtable content exists): full-screen hero slideshow (GSAP crossfade) · sticky header on scroll · project overview (greeting pull-quote, description, status badge) · gallery slideshow with fullscreen lightbox · Key Points numbered grid · Links/resources cards · PDF downloads · footer CTA to the main site.

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
| Images | Attachments | All project images — hero slideshow + gallery |
| Key Points | Long text | One point per line |
| Links | Long text | One per line: `Label\|URL` or `Label\|URL\|Description` |
| PDFs | Attachments | Downloadable documents |
| Invite Sent | Checkbox | Auto-set when invite is sent |

## SEO / redirects

`netlify.toml` 301s the auto-generated `rogetjames-new.netlify.app` host and every stale old-site path (`/about`, `/sculpture`, `/landscape-design`, etc.) to the matching section on the single-page site, so Google drops dead links. It also sets strict security headers, a tight Content-Security-Policy (self + Google Fonts + `cdn.myportfolio.com` images), and long-lived caching for hashed assets/images/videos/fonts. `robots.txt` and `sitemap.xml` are in `public/`.

## Key conventions

- **Never deploy experiments — mandatory rule:** Concepts, mock-ups, preview pages, experiments, or anything James did not explicitly ask to change must NEVER be committed to `main`/the deploy. Build them locally only and show James screenshots or a local render. Only push the specific fixes/changes he requested. Pushing any experiment live without his explicit say-so is a serious breach.
- **Image upload placement — mandatory rule:** New image uploads for a category go in that category's **gallery, as pieces at the END** (newest last), until James says otherwise for a specific spot. Do NOT put uploads into the close-up ("Up Close") tiles unless James explicitly asks. Do NOT touch, remove, or reorder anything in the close-ups unless he explicitly asks.
- **Hero slideshow images** — always `object-contain` on ALL screen sizes. Never change to `object-cover`. James wants the full image visible with letterboxing, not cropped to fill the screen.
- No TypeScript — plain `.jsx` and `.js` throughout.
- ESLint: `no-unused-vars` is `error`. Uppercase constants (`/^[A-Z_]/`) are exempt. Prefix intentionally unused destructured vars with `_`.
- Section anchor IDs: `#collection`, `#about`, `#bespoke`, `#process`, `#services`, `#contact`.
- `window.__galleryModalBody` is a ref attached by Gallery's lightbox so `ScrollArrows` in `App.jsx` can redirect scroll into the modal instead of the page. Gallery also fires `gallery-modal-open` / `gallery-modal-close` window events that `ScrollArrows` listens for.
- Gate animation pattern (Gallery + BespokeCommissions strips): two black `position:absolute` panels at `z-20` slide apart on `start:"top bottom"` over 8s linear; the portal sits at `z-30 relative` above them.
- `NoiseOverlay` is a fixed SVG grain texture at `z-index: 9999` — never put UI above it without a higher z-index.
- `App.jsx` contains an unused `Reveal` blind-reveal helper; the Bespoke and Discover sections currently render inline (not hidden behind a reveal button). Do not assume they are collapsed.

## Design concepts (reference only — never deployed)

- `concepts/` holds saved design experiments for James to reference. It is NOT in `public/` and NOT a build entry, so Netlify never serves it. To show James, render offline and send stills; never move a concept into `public/` or link it from the site without his explicit ask.
- `src/_drafts/` holds non-shipping notes and checklists (e.g. `pre-launch-checklist.md`). Not imported by the build.

## Reference docs in the repo

- `README.md` — short public overview.
- `GEMINI.md` — parallel guidance file for a different assistant; keep major facts in sync when the architecture changes.
- `SHOPIFY-I18N-PLAN.md` — planning notes for a possible Shopify/i18n direction (not built).
