# Add favourites — paused (25 Nov 2026)

Status: idea agreed in outline, NOT built. James paused it to come back to as
"add favourites". Next step when resumed: settle the open questions below, then
build a local prototype and send James screenshots. Nothing goes live without
his say-so.

## Origin
James liked get-spark.io (a creative-reference library: save, auto-tag, search,
moodboards). Asked how something like it could work for clients on the site.
His direction: visitors save favourite images while browsing, open a page
showing them all at once, click one to expand, and add an email to come back
to them any time.

## Proposed version
- **Save while browsing** — a small heart + "Save" at the left of the caption
  line under the big photo (Wall Art, Sculpture, Screens), and beside the name
  in the detail popup. Saves the exact photo on screen. Tap again to remove.
- **Count** — "Favourites N" pill in the top bar beside the Quote pill; shows
  only once something is saved; carries across all three galleries.
- **Favourites page** — full-screen dark grid, piece name + range under each;
  tap to open large, arrows/swipe through all, Esc/× back; remove from grid or
  large view.
- **Coming back** — at the foot: "Keep these — enter your email and we'll send
  you a link to come back to them." Branded email with a few photos and a
  "View your favourites" button; the link opens the board on any device; later
  saves add to the same board. Without email, favourites still persist on that
  device.
- **Never** any prices — not on the board, email or link.

## Technical notes (for building)
- All three galleries run through `mountRangeGallery` in `src/rangeGalleryApp.js`
  — one change covers them. Pattern to copy: `src/utils/quoteBasket.js`
  (localStorage) and the quote pill/overlay.
- Tapping the big photo steps to the next image — the save button must not
  trigger that.
- Return link as a query on an existing page (e.g. `/wall-art?favourites=KEY`),
  so no new page is needed (avoids the SEO new-page rules for a private view).
- Server side: a new Netlify Function + Blobs store, email via Resend, with the
  same origin / rate-limit guards as `contact.js`.

## Open questions for James
1. Email James when someone leaves an email with a board (a warm lead)?
2. "Enquire about these" button sending the board into the contact form?
3. "Send to someone" share link for a partner/architect?
4. Which galleries — also the Bespoke popups (sculpture, concepts, projects)?
5. Wording — Favourites / Saved / Shortlist / Your selection?
6. Icon — heart, bookmark, or plus?

## Related
Collection app concept (James's own private board app): `concepts/collection-app/NOTES.md`.
