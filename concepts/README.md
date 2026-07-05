# Concepts — NOT published to the live site

Files in this `concepts/` folder are saved in the repo for reference only. Netlify
publishes `dist/` (built from `public/` + configured entries) — this folder is
neither, so **nothing here is ever served on rogetjames.com**. It exists so design
experiments survive between sessions and James can point to them to work on.

## Gallery hero concept — `gallery-hero-concept.html`

A "featured piece + card rail" gallery, based on the Globe Express reference James
supplied (`reference/globe-express-reference.jpeg`).

- Full-bleed background of the active piece; big title + kicker on the left.
- Overlapping rounded cards lower-right; the active card lifts and highlights.
- Prev/next arrows, progress bar, large italic slide counter.
- Interaction: click a card or use arrows / keyboard ←→ → the background crossfades
  and the chosen card scales up into the hero.
- Uses real ROGETjames hero images and the site palette/type (jet, cream, clay;
  Plus Jakarta Sans + Cormorant Garamond italic).

Preview stills: `reference/preview-frame-1.png`, `reference/preview-frame-2.png`.

### To view it offline
Serve the repo root (so `/images/...` resolves) and open the file, e.g.
`npx http-server . -p 4599` then visit `http://localhost:4599/concepts/gallery-hero-concept.html`
after temporarily pointing its image paths at `/images/...`, or ask Claude to render
fresh frames.

### Open directions to explore
Card size/placement, how far the card expands, full-bleed vs letterboxed (James wants
full pieces visible elsewhere), wiring to real series data, motion feel/timing.
