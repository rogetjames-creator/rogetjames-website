# GEMINI.md

Parallel guidance file for ROGETjames — a condensed mirror of `CLAUDE.md`. When the architecture changes, keep the major facts here in sync with `CLAUDE.md` (which is the fuller reference).

## Project

Portfolio website for ROGETjames — bespoke laser cut wall art, sculpture & architectural features by James Roget. Live at https://rogetjames.com/.

The site owner (James) is not a developer. His role is aesthetic direction, not technical operation. Do not use technical jargon (avoid "component", "props", "state", "API", "render", "bundle", "dependency") unless immediately explained in plain language. James is design-literate — engage directly on layout, typography, colour, spacing, and motion.

## Mandatory rules (non-negotiable)

**Communication style:**
- No pleasantries, no filler, no personality. Facts only. Do not say "Great!", "Sure!", "Of course!", "Happy to help" or anything like it.
- Do not narrate what you are about to do — just do it. Responses are short and direct; one sentence where one sentence is enough.
- The same applies to the AI chat widget on the site: factual and concise, never warm or complimentary ("Good choice", "Great question"). Keep chat widget replies short.

**Pricing — never display prices:**
- NEVER display prices openly anywhere on the site. No price figures in captions, thumbnails, close-ups, tooltips, gallery labels, or shared links.
- Pricing is ALWAYS gated behind the postcode step — prices appear only inside the postcode-gated pricing panel, after the visitor enters their postcode.
- Do not add "from $X" summaries, price ranges, or any visible price outside that gate, even if asked to "coordinate" pricing across views. No price value may ever travel in a URL or shared link.

**Autonomy:**
- Always supply URLs as clickable links, never plain text addresses.
- Never ask James to open dashboards, check settings, run commands, copy values, or perform any technical step. If it can be done via code, API, or CLI — do it. If it genuinely cannot be done without credentials that don't exist here, say so in one sentence and move on.

**Session startup:**
- At the start of every session, run `git pull origin main` before touching any file — local and remote must be in sync first.
- Never make design changes without first checking whether James previously gave instructions on that element; if prior instructions exist, follow them exactly.

**Git sync:**
- After every meaningful change — commit and push immediately. Never batch changes to end of session. One feature or fix = one commit + one push.
- Never sit on uncommitted or unpushed work silently: if you are NOT committing straight away (waiting on a decision, blocked, mid-way), say so to James in one plain sentence. Committing to the branch and publishing/going live are separate — keep committing regardless; only "publish/go live" waits for James.

**Never deploy experiments:** Concepts, mock-ups, preview pages, or anything James did not explicitly ask to change must NEVER be committed to `main`. Build them locally and show James a render; push only the specific fixes he requested.

## Hosting and deployment (check this first)

- The one and only source of truth is the GitHub repository `rogetjames-creator/rogetjames-website`.
- Netlify is connected to that repository and watches its `main` branch. Every push to `main` triggers an automatic Netlify build and deploy — nothing else is needed for a change to go live.
- At the start of every session, confirm the connected repository is `rogetjames-creator/rogetjames-website`. If it is not, tell James in one sentence and stop.

## Commands

```bash
npm run dev          # Start dev server (Vite) on port 5173
npm run build        # Production build: Vite + Playwright prerender (used by Netlify)
npm run build:quick  # Vite build only (skips prerender — fast local check)
npm run lint         # ESLint
npm run preview      # Serve dist/ locally
```

`npm run build` prerenders `dist/index.html` with headless Chromium so crawlers see real content. `netlify.toml` runs it on every deploy; a failed build does not take the live site down (Netlify keeps serving the last good deploy). Local dev via Netlify CLI runs on port 8888 (`netlify dev`), required to exercise the `/api/*` Netlify Functions locally.

## Stack

React 19, Vite 7 (multi-page), Tailwind CSS v4 (theme tokens in `src/index.css` under `@theme {}`, no `tailwind.config.js`), GSAP 3 + ScrollTrigger, Lenis smooth scroll, Lucide React icons, `@netlify/blobs` for server-side storage in functions. No TypeScript — plain `.jsx`/`.js` throughout. The catalogue viewer is a custom React component (`CatPageViewer.jsx`), not a library; vault PDFs are plain download links.

## Architecture (brief)

**Multi-page build** — `vite.config.js` defines nine HTML entry points, each its own React root, rewritten to clean URLs in `netlify.toml`:

| URL | HTML / Entry / Root | Purpose |
|---|---|---|
| `/` | `index.html` / `src/main.jsx` / `App.jsx` | Main public site |
| `/vault` | `vault.html` / `src/vault.jsx` / `VaultPage.jsx` | Client vault (personalised locked page emailed to each client) |
| `/stats` | `stats.html` / `src/stats.jsx` / `StatsPage.jsx` | Analytics dashboard (admin) |
| `/media` | `media.html` / `src/media.jsx` / `MediaPage.jsx` | Photo upload tool (admin) |
| `/admin` | `admin.html` / `src/admin.jsx` / `AdminPage.jsx` | Hub linking the admin pages |
| `/melbourne` | `melbourne.html` / `src/melbourne.jsx` / `MelbournePreview.jsx` | Private preview, Melbourne city SEO page |
| `/wall-art` | `wall-art.html` / `src/wall-art.jsx` / `FeatureWall.jsx` | Live public Wall Art gallery |
| `/sculpture` | `sculpture.html` / `src/sculpture.jsx` / `SculptureWall.jsx` | Live public Sculpture gallery |
| `/feature-screens` | `feature-screens.html` / `src/feature-screens.jsx` / `FeatureScreens.jsx` | Private preview — Screens gallery (no Info/Prices panel) |

`/wall-art` and `/sculpture` were promoted from private previews to the live public galleries — they are indexable (canonical + `robots: index,follow`, in `sitemap.xml`), and `netlify.toml` 301s the old `/feature-wall` / `/feature-sculpture` slugs to them. Only `/feature-screens` remains a password-gated private preview linked from `/admin`. All three read the same live Up Close/media data as `Gallery.jsx`, scoped per page to its own destination tag so uploads never leak across pages.

**Main site page order** — `App.jsx` composes: Navbar → Hero → StudioBio → Gallery → About → CommissionsSection (Bespoke) → Process → Services → Contact → DiscoverPortals → Footer → ScrollArrows → ChatWidget. Gallery, CommissionsSection and DiscoverPortals are lazy-loaded. Section anchor IDs: `#collection`, `#about`, `#bespoke`, `#process`, `#services`, `#contact`.

**Scroll / animation** — Lenis (`autoRaf: false`) is driven by GSAP's ticker in `App.jsx`; never add a second Lenis instance. All animations use `gsap.context(() => { ... }, ref)` inside `useEffect` and return `ctx.revert()`; use `onEnter` (not `onStart`) for ScrollTrigger callbacks.

**Gallery (`Gallery.jsx`)** — the largest file. `CATEGORIES` defines all catalogue image data across three tabs (Residential / Commercial / Public). Prices are computed and shown only after a visitor enters a postcode (WA vs interstate logic), and never travel in a URL. Adding to quote dispatches a `quote-add` window event that `App.jsx` accumulates and passes to `Contact`, which submits to `/api/contact`.

**Images** — Local images live in `public/images/`, served through the Netlify Image CDN via `netlifyImg(src, { w, q })` from `src/utils/img.js`. New image uploads for a category go into that category's gallery as pieces at the END (newest last); do not touch the "Up Close" close-ups unless James explicitly asks.

**Netlify Functions (`netlify/functions/`)** — all `/api/*` routes. Server-side storage is Netlify Blobs (no external DB); several functions email James via Resend. Key ones: `chat.js` (Claude-backed chat widget, needs `ANTHROPIC_API_KEY`), `contact.js` (contact/quote form → email), `track-event.js` (logs pricing/postcode interest), `stats-data.js` (admin dashboard + password check), `media-upload.js` (commits uploaded photos into the repo), and the `vault-*` functions (client vault invite/verify against Airtable).

## Reference

- `CLAUDE.md` — the fuller guidance file; consult it for detail (functions table, env vars, vault fields, conventions).
- `README.md` — short public overview.
