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

---

## Log

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
