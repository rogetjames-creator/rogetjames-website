# Collection app — concept (paused 25 Nov 2026)

Related to "add favourites" (`src/_drafts/add-favourites.md`) — both came out of
James looking at get-spark.io. This one is James's own private app; favourites
is for website visitors.

Status: concept only, NOT built. James will come back to it.

## What it is
A private collection-board app for James on iPhone and desktop: collect images,
websites, addresses and notes into boards and view them at will.

- NOT on rogetjames.com — its own private address, own password, own GitHub
  project, hidden from Google.
- Option A chosen to explore: installable app (iPhone "Add to Home Screen",
  Mac "Add to Dock"), no App Store. Could become an App Store app later.
- Tile types: image · website (preview picture + title) · address (map, opens
  Apple Maps) · note. Items can sit on several boards.
- Adding: + button in app; iPhone Share menu → "Add to Collection" via a
  one-tap Shortcut; desktop paste / drag-and-drop.
- Search across everything; optional auto-tagging (billed to the site chat's
  Anthropic account, not James's Claude plan — a few cents per hundred photos).
- Map view of all addresses. Phone and desktop stay in sync. Weekly backup,
  export any time.

## Design decisions (James, 25 Nov 2026)
- **Dark** theme.
- **Keep gold** accents (+ button, highlights).
- **Rounded tiles with captions.**

Screenshots of the agreed direction: `phone-home-dark.png`,
`phone-board-dark.png`, `desktop-dark.png`. `mock.html` is the throwaway
mock-up they were drawn from (photo paths need pointing at real files to
re-render).

## Still open
- Mac or Windows desktop?
- Name for the icon.
- Address: `board.rogetjames.com` or something neutral?
- Auto-tagging from the start or later?
- Private only, or share a board with a client as a view-only link?

## Next step
Settle the open questions → build a working prototype → screenshots to James.
