// A specimen page for choosing title faces for the ranges still to do.
//
// Each face is shown set in the real names it would carry, at the size a piece
// page uses, on the same black. Preview only — no-index, not in the sitemap,
// not linked from anywhere. Written to dist/fonts.html, served at /fonts.

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const KIT = "vbn4biu";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// The ranges with no face yet, and the names each one would have to carry.
const WORDS = {
  Plumes: ["PLUME DECO", "FEATHER", "FLOCK O FEATHERS"],
  Jungle: ["BAMBU", "UBUD"],
  Therus: ["SEAWEED", "ZON ZEE", "NEA"],
  Ikona: ["VASUKI", "MAHOLA", "GEO LEAF"],
  Pendants: ["LIBRATUM", "BENIN", "SANUR", "METROPOLIS"],
  Obliationes: ["OBLIATIONES", "OKO"],
  Birds: ["BIRDY NUM NUM", "SWALLOWS", "WREN"],
  Retro: ["JEAGER", "HALSTON", "ZED"],
  "B Editions": ["HALSTON B", "PAVIA B", "ZED B"],
  Sculpture: ["MARAKESH", "AUTUMN LEAF", "BON BON"],
};

// Sixteen faces, each with the ranges it was picked for and why in one line.
const FACES = [
  { css: "trajan-pro-3", name: "Trajan Pro 3", weight: 600, for: "Ikona · Obliationes", note: "Carved Roman capitals. Ancient, ceremonial — suits the totemic and the pattern work." },
  { css: "ivymode", name: "Ivy Mode", weight: 400, for: "Plumes · Therus", note: "High-contrast fashion serif. Fine and poised, like the feather line itself." },
  { css: "abril-titling", name: "Abril Titling", weight: 400, for: "Plumes · Birds", note: "Sharp editorial serif with real bite in the thins." },
  { css: "ars-nova", name: "Ars Nova", weight: 400, for: "Jungle · Obliationes", note: "Art Nouveau flourish — organic, hand-cut, sits beside botanical work." },
  { css: "hobeaux-rococeaux", name: "Hobeaux Rococeaux", weight: 400, for: "Jungle · Retro", note: "Ornamental and eccentric. Loud, in the way a carved panel is loud." },
  { css: "smoothy", name: "Smoothy", weight: 400, for: "Therus · Jungle", note: "Soft rounded forms — water, weed, drift. Warm rather than sharp." },
  { css: "ff-angie-pro", name: "FF Angie Pro", weight: 900, for: "Birds · Retro", note: "Weighted slab with a curved, drawn feel. Strong without being cold." },
  { css: "flegrei", name: "Flegrei", weight: 400, for: "Ikona · B Editions", note: "Raw, blunt, modern. Reads as cut metal more than as type." },
  { css: "am-tripoli", name: "AM Tripoli", weight: 400, for: "B Editions · Ikona", note: "Stark geometric construction — for the abstract, non-botanical pieces." },
  { css: "scotch-display-compressed", name: "Scotch Display Compressed", weight: 500, italic: true, for: "Pendants", note: "Tall and narrow, like the pendants themselves. Italic gives it lift." },
  { css: "casablanca-urw", name: "Casablanca URW Light", weight: 300, for: "Pendants · Sculpture", note: "Quiet humanist face. Steps back and lets the piece speak." },
  { css: "nicholas", name: "Nicholas", weight: 400, for: "Sculpture · Therus", note: "Elegant book serif with an unusual hand — refined, not corporate." },
  { css: "organda-mn", name: "Organda MN Bold", weight: 700, for: "Retro", note: "Deco geometry. Straight out of the era the retro range draws on." },
  { css: "artdeco-mn", name: "Artdeco MN", weight: 400, for: "Retro · B Editions", note: "Pure 1920s line work — thin, symmetrical, decorative." },
  { css: "aquavit", name: "Aquavit Bold", weight: 700, for: "Retro · Birds", note: "Deco with weight behind it. Confident on a wide name." },
  { css: "fabulosa", name: "Fabulosa", weight: 400, for: "Jungle · Birds", note: "Sixties poster lettering — playful, curved, full of movement." },
];

const html = `<!doctype html>
<html lang="en" style="background:#020202"><head>
<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Title faces — preview | ROGETjames</title>
<meta name="robots" content="noindex, nofollow" />
<link rel="preconnect" href="https://use.typekit.net" crossorigin />
<link rel="stylesheet" href="https://use.typekit.net/${KIT}.css" />
<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Jost:wght@300;400&family=DM+Sans:wght@300;400&display=swap" rel="stylesheet" />
<link rel="icon" href="/favicon.ico" sizes="any" />
<style>
:root{--matt:#020202;--jet:#0B0B0B;--cream:#EDE8DF;--dim:rgba(237,232,223,.68);--faint:rgba(237,232,223,.42);
--clay:#9E7134;--clay-lit:#D4A75C;--rule:rgba(237,232,223,.10)}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--matt);color:var(--cream);font-family:"DM Sans",sans-serif;font-weight:300;line-height:1.6}
a{color:inherit;text-decoration:none}
.wrap{max-width:1100px;margin:0 auto;padding:0 24px}@media(min-width:820px){.wrap{padding:0 48px}}
h1{font-family:"Syne",sans-serif;font-weight:800;font-size:clamp(30px,4.6vw,54px);letter-spacing:-.02em;padding-top:56px}
p.lede{color:var(--dim);max-width:64ch;margin-top:16px;padding-bottom:32px;border-bottom:1px solid var(--rule)}
.face{padding:38px 0;border-bottom:1px solid var(--rule)}
.meta{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;margin-bottom:18px}
.meta b{font-family:"Syne",sans-serif;font-weight:700;font-size:15px}
.meta .for{font-family:"Jost",sans-serif;font-size:10px;letter-spacing:.2em;text-transform:uppercase;
color:var(--clay-lit);border:1px solid rgba(212,167,92,.4);border-radius:20px;padding:3px 9px}
.meta .note{color:var(--faint);font-size:14px;flex:1 1 320px;min-width:0}
.words{display:flex;flex-direction:column;gap:6px}
.words span{display:block;color:rgba(237,232,223,.95);line-height:1.06;
font-size:clamp(28px,4.4vw,46px);word-break:break-word}
.sub{font-family:"Jost",sans-serif;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--faint);margin-top:14px}
footer{padding:50px 0 80px;color:var(--faint);font-family:"Jost",sans-serif;font-size:11px;letter-spacing:.16em;text-transform:uppercase}
</style></head><body><div class="wrap">
<h1>Title faces to choose from</h1>
<p class="lede">Sixteen faces for the ranges with no lettering yet, each set in the names it would carry,
at the size a piece page uses. All are on Adobe Fonts, so any of them can go live the same day you pick.
Tell me the face and the range — or send an SVG as you have been, and I'll use that instead.</p>
${FACES.map((f) => {
  const ranges = f.for.split(" · ");
  const words = ranges.flatMap((r) => WORDS[r] || []).slice(0, 4);
  const style = `font-family:'${f.css}',Syne,sans-serif;font-weight:${f.weight}${f.italic ? ";font-style:italic" : ""}`;
  return `<section class="face">
    <div class="meta"><b>${esc(f.name)}</b><span class="for">${esc(f.for)}</span><span class="note">${esc(f.note)}</span></div>
    <div class="words">${words.map((w) => `<span style="${style}">${esc(w)}</span>`).join("")}</div>
    <p class="sub" style="${style};font-size:15px;letter-spacing:.02em;text-transform:none;color:var(--dim)">
      Creeping Fig · Banksia Oldmanis · abcdefghijklmnopqrstuvwxyz 1234567890</p>
  </section>`;
}).join("")}
<footer><a href="/pieces">← Back to every piece</a></footer>
</div></body></html>`;

writeFileSync(join(DIST, "fonts.html"), html, "utf-8");
console.log(`  ✓ font specimen page at /fonts (${FACES.length} faces)`);
