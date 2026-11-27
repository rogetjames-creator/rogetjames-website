# Project log — read this first, every conversation

James works from several conversations at once (phone, desktop, cloud). None
of them can see the others. This file is the one shared memory: every
decision, idea and open thread goes here so James never has to repeat himself.

**Rules (see CLAUDE.md):** read this at the start of every session. When James
makes a decision, gives an instruction, starts or pauses an idea — add a dated
line here and commit + push it to `main` straight away (it is a notes file; it
does not change the live site). Newest at the top. Keep each entry short and
point to the detailed notes file if there is one.

---

## Open threads

| Thread | Status | Detail |
|---|---|---|
| Roj — formerly "Collection app" (James's own private app, phone + desktop) | LIVE at roj-board.netlify.app (private, password + Touch/Face ID, data in Sydney) | `~/Projects/collection-app` (own folder, NOT this repo); Netlify project `roj-board` |
| Add favourites (website visitors save photos) | Concept — paused, nothing built | `src/_drafts/add-favourites.md` |
| SEO plan, 4 phases (James's brief, 27 Nov 2026) | Phases 1, 3, 4 + screens popup wording LIVE 27 Nov. Left: spiels for 35 designs (James's words), Phase 2 screen headings parked | report: `~/Desktop/CHAT GPT/seo-check-report.txt` |

---

## Log

### 27 Nov 2026 (evening)
- **SEO work LIVE (James's OK):** structured data (one linked graph per page;
  wall art, sculpture, screens = ROGETjames products), seo-check build guard,
  readable headings on wall art pages, preview copies noindex, old Netlify
  address 301s home. Homepage main heading (hidden, looks the same):
  "Laser Cut Metal Wall Art, Sculpture & Screens by ROGETjames" (James).
  Page title unchanged. Checked live: 200 / 404 / 301 correct.

### 27 Nov 2026 (later)
- **Screens popup wording LIVE:** James's WATTLE line + an SEO paragraph per
  design on the right of the popup (no "made to order"; stainless steel listed
  last; ends "Featured in iconic venues, commercial projects and residential
  homes throughout Australia"). WATTLE/URO Sydney photos renamed so no extra pills.
- **James:** screens don't bring orders — stop making them the focus.
- **Phase 3 + 4 built (not live):** `scripts/seo-check.mjs` stops any deploy
  with a basic SEO fault. It found the homepage had no real main heading; fixed
  with a hidden heading (looks the same). Preview copies noindex.

### 27 Nov 2026
- **SEO brief from James** (4 phases, pasted): Phase 0 check, Phase 1
  structured data, Phase 2 headings/intros (⛔ CSV for approval first),
  Phase 3 `seo-check.mjs` build guard, Phase 4 fixes. Nothing live without
  his OK at each ⛔.
- **Phase 0 found:** pages ship real wording (no empty shells); junk URLs
  already 404; www/http/old Netlify host already 301; wall art design pages'
  H1 is lettering only (no readable words); Perth H1 reads "…AustraliaPerth";
  homepage's no-JavaScript summary repeats 4 of 10 opening sentences;
  Netlify branch/preview copies have no noindex header.
- **James on screen design headings:** light features (EQUISETTI, REEDS of
  UNGARO) and mirror art (SABAH) never get "laser cut" — don't change them, or
  put the kind at the end. Confirm exact wording at the Phase 2 CSV.
- **Phase 1 built (not live):** `src/data/seoData.js` + `scripts/build-jsonld.mjs`
  — one linked @graph per page; Organization (no LocalBusiness), Person, WebSite
  on / only; screen designs = Product with no offers (James's call; no rich
  results by design). Melbourne has no FAQs on the page, so no FAQPage there.
- **James — rule:** ROGETjames is a branded design label by James Roget, a
  brand with product. Wall art, sculpture AND screens are all products; screen
  designs can be bought as standard or applied to many bespoke projects. Never
  mark screens as a service only. Areas served: keep every city, Australia first.
- **Phase 2 (not live):** city-page Screens / Bespoke Sculpture panels now link
  to /screens and /bespoke-sculpture. Headings + intros for 36 screen designs
  exported to `~/Desktop/CHAT GPT/seo-intros.csv` for approval — 34 come out
  under 40 words because the captions hold too few facts.

### 26 Nov 2026 (late)
- **Roj speed:** server moved to Sydney (next to storage); Netlify keeps ready
  copies per signed-in session; boards show small preview copies (~7x smaller),
  full photo on tap. Roj now self-updates (version check) — James's iPhone
  needed one restart to leave the old copy. His Mac's connection measured slow
  for every site, which is part of the delay.
- **Roj:** tapping any photo now opens the build-on page directly (photo +
  Add photos + Paste + Info & ideas box); it becomes a File on the first change.
- **Boards = build on each thing (James):** any photo now has "+ Add more
  photos & notes to this" → it becomes a File (keeps its boards). Picking
  several photos at once asks "Keep together as one File" or "separate".
  The + in the gold circle is now exactly centred.
- **Roj is live:** https://roj-board.netlify.app — separate Netlify project
  `roj-board` (roj.netlify.app was taken by a stranger). Data stored in Netlify's
  Sydney region. James chose his own password on a one-time setup page (code
  now used up); Touch ID / Face ID (passkeys) offered after sign-in. Hidden
  from Google. No GitHub copy yet (gh tool not installed) — history in the
  local git repo.
- **Fixes/additions (James):** photo previews were "?" (lazy-loading bug) —
  fixed; new **File** item = many photos + "Info & ideas" in one card (e.g.
  screen concepts); **Paste** (+ menu and inside a File) and **Copy text**.
- Upload cap ~4 MB per photo/clip (Netlify limit); photos are shrunk on the
  phone first so normal photos are fine.

### 26 Nov 2026 (night)
- **App named "Roj"** (James). Icon = James's own round stone "rj" mark;
  he asked for no black, so the black corners are filled with the stone rim's
  colour — artwork itself untouched. Original kept in the app folder
  (`scripts/roj-icon-original.webp`).
- **Roj icon replaced** with James's new artwork (stone tile, inner ring,
  no black) — only trimmed to square, nothing added.
- **Roj look:** James — no brown filter under photos; backgrounds now neutral
  **charcoal** (page #151618, cards #232427). Gold accents and cream text kept.
- Still to decide before going online: the address name ("____.netlify.app").

### 26 Nov 2026 (evening)
- **Collection app — James:** it is not just for book/script — it is for work
  too: ideas, contacts, info. Must stay adaptable. Done on the Mac copy:
  "Writing" renamed **Projects** (a project can be anything — Book, Script,
  a client job); new **Contact** items (name, company, phone, email, website,
  notes; tap Call / Email); **Ideas, Contacts, Info** boards added.

### 26 Nov 2026 (later)
- **Collection app — decided:** James wants it "safe and private": neutral
  address (no ROGETjames link), private only (no sharing), auto-tagging later
  (photos not sent to any AI), icon name "Collection" for now.
- **Collection app — built:** working prototype in `~/Projects/collection-app`
  (outside iCloud). Boards, Book/Script projects with their own boards, photos,
  clips, websites (preview saved privately), places (open in Maps), notes,
  speak-to-text, writing page with autosave, drag-into-order, search, backup
  download, password sign-in with lockout, hidden from Google. Runs at
  localhost:4321 only. Nothing online until James says OK.
- Remote Control is on for desktop sessions (open them from the phone app's
  Code section).

### 26 Nov 2026
- James: standing permission for log-only updates to go straight to `main`.
- James: conversations must not lose track of each other. This log created;
  CLAUDE.md now requires every session to read it first and write to it.

### 25 Nov 2026
- **Collection app — scope:** full-scope personal app for everything: studio
  references, websites, addresses, notes AND writing a book and a script
  (projects, characters, scenes, speak-to-text capture, writing page, movie
  clips/stills, scene order board). Boards and writing get equal footing.
- **Collection app — look:** dark, keep gold accents, rounded tiles with
  captions. Screenshots in `concepts/collection-app/`.
- **Collection app — form:** NOT on rogetjames.com. Installable app (Home
  Screen / Dock), own private address + password, no App Store for now.
- **Collection app — still open:** Mac or Windows; icon name; address
  (`board.rogetjames.com` or neutral); auto-tagging now or later; private only
  or shareable boards.
- **Add favourites:** idea agreed in outline (save while browsing, favourites
  page, email to come back). Paused by James; six open questions in its notes.
- Origin of both: James liked get-spark.io (creative-reference library).
