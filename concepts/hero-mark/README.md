# Hero mark — reference copy

`hero-mark.html` is the "ART meets design" animated mark, standalone, exactly as
it runs on the live home page. Double-click it — it needs no build step, no dev
server and no network (GSAP is inlined).

It is **generated, never hand-edited**. Every value in it is lifted straight from
the live source, so it can't drift out of step with the site:

| Comes from | What it supplies |
|---|---|
| `src/components/Hero.jsx` | the ART symbol path, the four word slots, the sequence, every timing |
| `src/components/heroWords.js` | the outlined IvyMode letters |
| `node_modules/gsap` | the animation engine, inlined |

## To change the mark on the website

Edit the two source files above. This folder changes nothing on the site — it is
not in `public/`, not a build entry, and Netlify never serves it.

Then regenerate the reference copy:

```bash
python3 concepts/hero-mark/build.py
```

## The pieces worth knowing

**Word slots** (`POSITIONS` in Hero.jsx) — four allocated places around the
symbol. `aboveR` upper-left and `belowT` lower-right are the defaults; `aboveT`
upper-right and `belowR` lower-left also exist, `belowR` currently unused.

**The sequence** (`SEQUENCE`) — the pairs the mark cycles, one per line. This is
the single source of truth: the letter-cell counts and the flip loop both derive
from it, so adding or changing a pair needs no other edit.

**Adding a word** — it must exist in `heroWords.js` as outlined letters. Words
are cut from James's `IVY MODE alphabet squashed.svg`, normalised to left edge
x=0 and baseline y=0, at scale **0.16648** (alphabet units → mark units), with
letter spacing taken from real IvyMode metrics. ORIGINAL and CREATIONS were made
this way.

**Timings** — entrance: symbol fades over 4.2s from 0.6s, left word flies in at
3.9s, right at 5.4s. Then from 9.5s the pairs flip every 6s, letters staggered
0.07s apart, 0.16s down and 0.2s back up.
