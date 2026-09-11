// Writes a real page for every way a screen design gets used.
//
//   dist/screens/gates.html, /fencing.html, /wall-decor.html …
//
// Before this, every screen — gates, fencing, privacy, dividers — lived at one
// address. Google could only rank that one page, for everything at once. Each
// application now has a page of its own carrying its own words and the
// photographs of every design used that way, so a search for "laser cut gates"
// has something to find.
//
// A design's applications are read from the tags already written against it in
// src/data/screenDesigns.js, plus anything uploaded to that application through
// /media. Nothing to maintain by hand.
//
// PREVIEW MODE (the default): pages are marked no-index and stay out of
// sitemap.xml, so they can be walked through before Google sees them.
// TO PUT THEM LIVE: set PREVIEW to false.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { SCREEN_DESIGNS } from "../src/data/screenDesigns.js";
import { SCREEN_APPLICATIONS, applicationKey } from "../src/mediaDestinations.js";

const PREVIEW = true;

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const SITE = "https://rogetjames.com";

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// A screen photo arrives already wrapped for Netlify's image service. Unwrap it
// to the real file first — the local preview has no such service, and the live
// build needs to ask for its own width anyway.
const realPath = (src) => {
  if (!src || /^https?:|^data:/.test(src)) return src;
  if (!src.startsWith("/.netlify/images")) return src;
  try {
    const inner = new URLSearchParams(src.split("?")[1] || "").get("url");
    return inner ? decodeURIComponent(inner) : src;
  } catch { return src; }
};
const img = (src, w) => {
  const p = realPath(src);
  if (!p || /^https?:|^data:/.test(p)) return p;
  return PREVIEW ? p : `/.netlify/images?url=${encodeURIComponent(p)}&w=${w}&fm=webp&q=82`;
};
const norm = (t) => String(t || "").toLowerCase().trim();

// What each application is, in words — used for the page's own description.
const WORDS = {
  "wall-decor": ["Wall decor screens", "Laser cut metal panels for walls, indoors and out — pattern, shadow and light on a bare surface."],
  gates:        ["Laser cut gates", "Entrance gates, pedestrian gates and automated security gates, cut from your chosen pattern."],
  fencing:      ["Laser cut fencing & infills", "Fence infills and panels that turn a boundary into part of the design."],
  dividers:     ["Laser cut dividers", "Room dividers and garden dividers — separation without a wall."],
  privacy:      ["Privacy screens", "Screens that hold privacy while keeping light and air moving through."],
  pergolas:     ["Pergola screens", "Overhead and side panels for pergolas — shade that draws a pattern as the sun moves."],
};

// uploads placed against an application through /media
let uploads = [];
try {
  const m = JSON.parse(readFileSync(join(ROOT, "public", "media-manifest.json"), "utf-8"));
  uploads = Array.isArray(m) ? m : [];
} catch { uploads = []; }

function designsFor(app) {
  const want = new Set(app.tags.map(norm));
  const out = [];
  for (const d of SCREEN_DESIGNS) {
    // Every photograph of this design that is tagged for this use — a design
    // with three gate photos belongs on the gates page three times, not once.
    const hits = (d.items || []).filter((i) => (i.tags || []).map(norm).some((t) => want.has(t)));
    if (hits.length) {
      for (const i of hits) {
        for (const src of (i.slides && i.slides.length ? i.slides : [i.img])) {
          if (src) out.push({ name: d.name, img: src });
        }
      }
      continue;
    }
    // A tag on the design rather than on a photograph says the design is used
    // this way but not which picture shows it. Showing its opening photo was a
    // guess, and it put a wall-decor picture on the pergolas page. Nothing is
    // shown unless a photograph itself carries the tag.
  }
  const key = applicationKey(app.id);
  for (const u of uploads) {
    if (!(u.destinations || []).includes(key)) continue;
    const name = (u.name || "").replace(/\.(jpe?g|png|webp|gif)$/i, "").trim();
    out.push({ name: name || "", img: "/" + u.path });
  }
  const seen = new Set();
  return out.filter((x) => { if (seen.has(x.img)) return false; seen.add(x.img); return true; });
}

const built = [];
for (const app of SCREEN_APPLICATIONS) {
  const designs = designsFor(app);
  if (!designs.length) continue;
  const [heading, blurb] = WORDS[app.id] || [app.label, ""];
  const url = `${SITE}/screens/${app.id}`;
  const others = SCREEN_APPLICATIONS.filter((a) => a.id !== app.id && designsFor(a).length);
  const title = `${heading} | ROGETjames`;
  const desc = `${blurb} ${new Set(designs.map((d) => d.name).filter(Boolean)).size} designs, made to order in Australia by James Roget.`.trim();

  const html = `<!doctype html>
<html lang="en" style="background:#020202"><head>
<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<meta name="robots" content="${PREVIEW ? "noindex, nofollow" : "index, follow"}" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="website" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${SITE}${realPath(designs[0].img)}" />
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Playfair+Display:ital@1&family=Jost:wght@300;400&family=DM+Sans:wght@300;400&display=swap" rel="stylesheet" />
<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Screens", item: `${SITE}/screens` },
      { "@type": "ListItem", position: 3, name: heading, item: url },
    ]},
    { "@type": "CollectionPage", "@id": url, name: title, description: desc, url,
      mainEntity: { "@type": "ItemList", name: heading, numberOfItems: designs.length,
        itemListElement: designs.map((d, i) => ({ "@type": "ListItem", position: i + 1, name: d.name || heading })) } },
  ],
}, null, 2)}
</script>
<style>
:root{--matt:#020202;--jet:#0B0B0B;--pewter:#181818;--cream:#EDE8DF;--dim:rgba(237,232,223,.68);
--faint:rgba(237,232,223,.42);--clay:#9E7134;--clay-lit:#D4A75C;--rule:rgba(237,232,223,.10);
--jost:"Jost",sans-serif;--body:"DM Sans",sans-serif;--heading:"Plus Jakarta Sans",sans-serif;
--drama:"Playfair Display",Georgia,serif}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--matt);color:var(--cream);font-family:var(--body);font-weight:300;line-height:1.65}
img{display:block;max-width:100%}a{color:inherit;text-decoration:none}
.wrap{max-width:1200px;margin:0 auto;padding:0 24px}
@media(min-width:820px){.wrap{padding:0 48px}}
header{border-bottom:1px solid var(--rule)}
.hdr{display:flex;align-items:center;justify-content:space-between;height:74px}
.mark{font-family:var(--heading);font-weight:700;font-size:19px}
.mark i{font-family:var(--drama);font-style:italic;font-weight:400}
nav{display:flex;gap:26px;font-family:var(--jost);font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--dim);flex-wrap:wrap}
nav a:hover{color:var(--cream)}
.crumbs{display:flex;gap:9px;align-items:center;flex-wrap:wrap;padding:18px 0;font-family:var(--jost);font-size:12px;color:var(--dim)}
.crumbs a:hover{color:var(--cream)}
.intro{padding:26px 0 34px;border-bottom:1px solid var(--rule)}
.kicker{font-family:var(--jost);font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--clay-lit)}
h1{font-family:var(--heading);font-weight:800;font-size:clamp(28px,4vw,44px);letter-spacing:-.02em;line-height:1.05;margin-top:10px}
.lede{color:var(--dim);font-size:16px;margin-top:16px;max-width:56ch}
.count{font-family:var(--jost);font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--faint);margin-top:14px}
.grid{display:grid;gap:16px;grid-template-columns:repeat(2,1fr);padding:34px 0 10px}
@media(min-width:700px){.grid{grid-template-columns:repeat(3,1fr)}}
@media(min-width:1020px){.grid{grid-template-columns:repeat(4,1fr)}}
.card{display:block}
.card .im{background:var(--pewter);border-radius:12px;overflow:hidden;aspect-ratio:4/3}
.card img{width:100%;height:100%;object-fit:cover;transition:transform .7s ease}
.card:hover img{transform:scale(1.04)}
.card b{display:block;font-family:var(--heading);font-weight:700;font-size:13px;margin-top:10px;letter-spacing:.01em}
.card span{display:block;font-family:var(--jost);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint);margin-top:3px}
.also{border-top:1px solid var(--rule);margin-top:36px;padding:30px 0 10px}
.lab{font-family:var(--jost);font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:var(--dim)}
.chips{display:flex;flex-wrap:wrap;gap:9px;margin-top:14px}
.chip{font-size:12px;color:var(--dim);border:1px solid var(--rule);border-radius:30px;padding:9px 16px;transition:.2s}
.chip:hover{border-color:var(--clay-lit);color:var(--cream);background:rgba(158,113,52,.14)}
.cta{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;margin:34px 0 0}
.btn{display:inline-block;border:1px solid rgba(158,113,52,.75);color:var(--clay-lit);padding:8px 18px;border-radius:999px;
font-family:var(--jost);font-size:10px;letter-spacing:.18em;text-transform:uppercase}
.btn:hover{background:rgba(158,113,52,.22)}
footer{padding:56px 0 70px;color:var(--faint);font-family:var(--jost);font-size:11px;letter-spacing:.16em;text-transform:uppercase}
</style></head><body>
<header><div class="wrap hdr">
  <a class="mark" href="/">ROGET<i>james</i></a>
  <nav><a href="/wall-art">Wall Art</a><a href="/sculpture">Sculpture</a><a href="/screens">Screens</a><a href="/#contact">Contact</a></nav>
</div></header>
<div class="wrap">
  <div class="crumbs"><a href="/">Home</a><span>&rsaquo;</span><a href="/screens">Screens</a><span>&rsaquo;</span><span>${esc(app.label)}</span></div>
  <div class="intro">
    <span class="kicker">Screens &middot; ${esc(app.label)}</span>
    <h1>${esc(heading)}</h1>
    <p class="lede">${esc(blurb)}</p>
    <p class="count">${designs.length} photograph${designs.length === 1 ? "" : "s"} &middot; ${new Set(designs.map((d) => d.name).filter(Boolean)).size} designs</p>
  </div>
  <div class="grid">
    ${designs.map((d) => `<a class="card" href="/screens">
      <div class="im"><img src="${img(d.img, 700)}" alt="${esc(d.name || app.label)} — ${esc(heading.toLowerCase())} by ROGETjames" loading="lazy" /></div>
      ${d.name ? `<b>${esc(d.name)}</b>` : ""}<span>${esc(app.label)}</span></a>`).join("")}
  </div>
  ${others.length ? `<div class="also">
    <div class="lab">Also used for</div>
    <div class="chips">${others.map((a) => `<a class="chip" href="/screens/${a.id}">${esc(a.label)}</a>`).join("")}</div>
  </div>` : ""}
  <div class="cta"><a class="btn" href="/screens">All screens</a><a class="btn" href="/#contact">Enquire</a></div>
</div>
<footer><div class="wrap"><a href="/screens">&larr; Return to Screens</a></div></footer>
</body></html>`;

  mkdirSync(join(DIST, "screens"), { recursive: true });
  writeFileSync(join(DIST, "screens", `${app.id}.html`), html, "utf-8");
  built.push({ url: `/screens/${app.id}`, label: app.label, n: designs.length });
}

if (!PREVIEW && built.length) {
  const sitemapPath = join(DIST, "sitemap.xml");
  if (existsSync(sitemapPath)) {
    const today = new Date().toISOString().slice(0, 10);
    const xml = readFileSync(sitemapPath, "utf-8");
    const add = built.map((b) => `  <url>\n    <loc>${SITE}${b.url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`).join("\n");
    writeFileSync(sitemapPath, xml.replace("</urlset>", `${add}\n</urlset>`), "utf-8");
  }
}

console.log(`  ✓ ${built.length} application pages${PREVIEW ? " (preview — no-index, not in sitemap)" : " (live)"}`);
built.forEach((b) => console.log(`      ${b.url.padEnd(24)} ${b.n} designs`));
