// Writes a real page for every catalogued design.
//
// Before this, a piece existed only inside a gallery — nobody could link to
// one and Google had nothing to rank. This writes, for each design:
//
//   dist/wall-art/<range>/<piece>.html
//   dist/sculpture/<range>/<piece>.html
//
// carrying its photographs, its finishes, its sizes, the words from
// src/data/pieceSeo.js, and links to the rest of its range. No prices — the
// page sends you to the gallery's postcode gate exactly like everything else.
//
// PREVIEW MODE (the default): every page is marked no-index and none are added
// to sitemap.xml, so James can walk the whole set before Google ever sees it.
// A contents page is written at dist/pieces.html listing every one.
//
// TO PUT THEM LIVE: set PREVIEW to false below. That switches the pages to
// index/follow and adds every address to sitemap.xml. Nothing else changes.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { RANGE_DATA } from "../src/data/rangeData.js";
import { SCULPTURE_DATA } from "../src/data/sculptureData.js";
import { PIECE_SIZES, MATERIAL_OPTIONS } from "../src/data/pricing.js";
import { PIECE_SEO, RANGE_SUBJECT, HIDDEN_PIECES } from "../src/data/pieceSeo.js";
import { rangeSlug } from "../src/utils/rangeSlug.js";

const PREVIEW = true;

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const SITE = "https://rogetjames.com";

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// A piece's address: /wall-art/<range>/<piece>
const pieceSlug = (name) =>
  String(name)
    .toLowerCase()
    .replace(/—/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Serve photos through the Netlify image service, same as the galleries.
const img = (src, w) =>
  /^https?:|^data:/.test(src) ? src : `/.netlify/images?url=${encodeURIComponent(src)}&w=${w}&fm=webp&q=82`;

const GALLERIES = [
  { base: "/wall-art", parent: "Wall Art", data: RANGE_DATA, kind: "wall" },
  { base: "/sculpture", parent: "Sculpture", data: SCULPTURE_DATA, kind: "sculpture" },
];

const FINISHES = {
  aluminium: {
    label: "Powder-coated aluminium",
    note: "Any Dulux or Interpon colour. Indoors or out, no maintenance, no staining.",
  },
  corten: {
    label: "Natural Corten steel",
    note: "Weathers to a deep rust patina outdoors over a few months, then holds. For gardens, courtyards and exteriors.",
  },
};

function sizesFor(name) {
  const tiers = PIECE_SIZES[name];
  if (!tiers || !tiers.length) return [];
  return tiers.map((t) => ({ label: t.label, dims: t.dims, fixings: t.fixings }));
}

function wordsFor(rangeLabel, name) {
  const seo = PIECE_SEO[name] || {};
  const subject = seo.s || RANGE_SUBJECT[rangeLabel] || "Laser cut metal wall art";
  const text =
    seo.t ||
    `${subject} by James Roget, cut to order in powder-coated aluminium or natural Corten steel.`;
  return { subject, text };
}

function page({ base, parent, kind }, range, design, imgs, siblings) {
  const name = design.n;
  const slug = pieceSlug(name);
  const url = `${SITE}${base}/${rangeSlug(range.label)}/${slug}`;
  const { subject, text } = wordsFor(range.label, name);
  const photos = design.imgs.map((i) => imgs[i]).filter(Boolean);
  const hero = photos[0];
  const sizes = sizesFor(name);
  const biggest = sizes.length ? sizes[sizes.length - 1].dims : "";

  const title = `${subject} — ${name} | ROGETjames`;
  const summary =
    `${subject.replace(/^./, (c) => c.toUpperCase())} — ${name} by James Roget. ` +
    `Powder-coated aluminium in any colour, or natural Corten steel that weathers to rust. ` +
    (biggest ? `To ${biggest}. ` : "") +
    `Made to order in Australia.`;

  const mats = MATERIAL_OPTIONS.map((m) => FINISHES[m.id]).filter(Boolean);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: parent, item: `${SITE}${base}` },
          { "@type": "ListItem", position: 3, name: range.label, item: `${SITE}${base}/${rangeSlug(range.label)}` },
          { "@type": "ListItem", position: 4, name, item: url },
        ],
      },
      {
        "@type": "Product",
        name: `${name} — ${subject}`,
        description: text,
        url,
        image: photos.map((p) => `${SITE}${p}`),
        brand: { "@type": "Brand", name: "ROGETjames" },
        material: MATERIAL_OPTIONS.map((m) => m.label).join(", "),
        countryOfOrigin: "AU",
        ...(sizes.length ? { size: sizes.map((s) => `${s.label} — ${s.dims}`).join("; ") } : {}),
      },
    ],
  };

  return `<!doctype html>
<html lang="en" style="background:#020202">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(summary)}" />
<meta name="robots" content="${PREVIEW ? "noindex, nofollow" : "index, follow"}" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="product" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(summary)}" />
<meta property="og:url" content="${url}" />
${hero ? `<meta property="og:image" content="${SITE}${hero}" />` : ""}
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Jost:wght@300;400&family=DM+Sans:ital,wght@0,300;0,400;1,300&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@1,400&display=swap" rel="stylesheet" />
<link rel="icon" href="/favicon.ico" sizes="any" />
<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>
<style>
:root{--matt:#020202;--jet:#0B0B0B;--pewter:#181818;--cream:#EDE8DF;--dim:rgba(237,232,223,.68);
--faint:rgba(237,232,223,.42);--clay:#9E7134;--clay-lit:#D4A75C;--rule:rgba(237,232,223,.10);
--syne:"Syne",sans-serif;--jost:"Jost",sans-serif;--body:"DM Sans",sans-serif;
--heading:"Plus Jakarta Sans",sans-serif;--drama:"Playfair Display",Georgia,serif}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--matt);color:var(--cream);font-family:var(--body);font-weight:300;line-height:1.65}
img{display:block;max-width:100%}a{color:inherit;text-decoration:none}
.wrap{max-width:1200px;margin:0 auto;padding:0 24px}
@media(min-width:820px){.wrap{padding:0 48px}}
.kicker{font-family:var(--jost);font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--faint)}
header{border-bottom:1px solid var(--rule)}
.hdr{display:flex;align-items:center;justify-content:space-between;height:74px}
.mark{font-family:var(--heading);font-weight:700;font-size:19px}
.mark i{font-family:var(--drama);font-style:italic;font-weight:400}
nav{display:flex;gap:26px;font-family:var(--jost);font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--dim);flex-wrap:wrap}
nav a:hover{color:var(--cream)}
.crumbs{display:flex;gap:9px;align-items:center;flex-wrap:wrap;padding:18px 0;font-family:var(--jost);font-size:12px;color:var(--faint)}
.crumbs a:hover{color:var(--dim)}.crumbs span{color:var(--dim)}
.piece{display:grid;gap:34px;grid-template-columns:1fr;padding:8px 0 60px}
@media(min-width:900px){.piece{grid-template-columns:1.35fr 1fr;gap:56px}}
.shots{display:grid;gap:12px;align-content:start}
.main{aspect-ratio:4/3;overflow:hidden;border-radius:14px;background:var(--pewter)}
.main img{width:100%;height:100%;object-fit:cover}
.thumbs{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.thumbs div{aspect-ratio:1/1;overflow:hidden;border-radius:10px;background:var(--pewter)}
.thumbs img{width:100%;height:100%;object-fit:cover}
.subject{font-family:var(--jost);font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--clay-lit)}
h1{font-family:var(--syne);font-weight:800;font-size:clamp(28px,4vw,44px);letter-spacing:-.02em;line-height:1.04;margin-top:10px}
.lede{color:var(--dim);font-size:16px;margin-top:18px;max-width:52ch}
.block{margin-top:30px;padding-top:24px;border-top:1px solid var(--rule)}
.block h2{font-family:var(--jost);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--faint);font-weight:400}
.finishes{display:flex;flex-direction:column;gap:14px;margin-top:16px}
.fin{display:flex;gap:14px;align-items:flex-start}
.sw{width:34px;height:34px;border-radius:50%;flex:none;margin-top:2px}
.sw.aluminium{background:linear-gradient(140deg,#2b2b2b,#0d0d0d 55%,#3a3a3a);box-shadow:inset 0 0 0 1px rgba(237,232,223,.22)}
.sw.corten{background:linear-gradient(140deg,#8a4a24,#b4652f 55%,#6d3a1c);box-shadow:inset 0 0 0 1px rgba(237,232,223,.18)}
.fin h3{font-family:var(--heading);font-weight:500;font-size:15px}
.fin p{color:var(--dim);font-size:14px;margin-top:3px;max-width:44ch}
.fin em{font-style:normal;color:var(--clay-lit)}
table{width:100%;border-collapse:collapse;margin-top:14px}
td{padding:11px 0;border-bottom:1px solid var(--rule);font-size:15px}
td:first-child{font-family:var(--heading);font-weight:500;width:120px}
td:nth-child(2){color:var(--dim);font-variant-numeric:tabular-nums}
td:last-child{color:var(--faint);font-size:13px;text-align:right;font-family:var(--jost)}
.cta{display:flex;gap:14px;flex-wrap:wrap;margin-top:26px}
.btn{display:inline-block;border:1px solid rgba(158,113,52,.75);color:var(--clay-lit);padding:13px 26px;border-radius:999px;
font-family:var(--jost);font-size:11px;letter-spacing:.22em;text-transform:uppercase}
.btn.solid{background:rgba(158,113,52,.14)}
.btn:hover{background:rgba(158,113,52,.22)}
.gate{font-family:var(--jost);font-size:11px;letter-spacing:.1em;color:var(--faint);margin-top:12px;text-transform:uppercase}
.related{border-top:1px solid var(--rule);padding:48px 0 70px}
.rel-grid{display:grid;gap:16px;grid-template-columns:repeat(2,1fr);margin-top:20px}
@media(min-width:820px){.rel-grid{grid-template-columns:repeat(4,1fr)}}
.rel{border-radius:12px;overflow:hidden;background:var(--pewter);display:block}
.rel .im{aspect-ratio:1/1;overflow:hidden}
.rel img{width:100%;height:100%;object-fit:cover;transition:transform .7s ease}
.rel:hover img{transform:scale(1.05)}
.rel .cap{padding:12px 14px 16px}
.rel .cap b{display:block;font-family:var(--heading);font-weight:500;font-size:14px}
.rel .cap span{display:block;font-family:var(--jost);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint);margin-top:4px}
footer{border-top:1px solid var(--rule);padding:34px 0 60px;font-family:var(--jost);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint)}
</style>
</head>
<body>
<header><div class="wrap hdr">
  <a class="mark" href="/">ROGET<i>james</i></a>
  <nav><a href="/wall-art">Wall Art</a><a href="/sculpture">Sculpture</a><a href="/screens">Screens</a><a href="/#contact">Contact</a></nav>
</div></header>

<div class="wrap">
  <div class="crumbs"><a href="/">Home</a> › <a href="${base}">${esc(parent)}</a> › <a href="${base}/${rangeSlug(range.label)}">${esc(range.label)}</a> › <span>${esc(name)}</span></div>

  <div class="piece">
    <div class="shots">
      ${hero ? `<div class="main"><img src="${img(hero, 1400)}" alt="${esc(`${subject} — ${name} by ROGETjames`)}" fetchpriority="high" /></div>` : ""}
      ${photos.length > 1 ? `<div class="thumbs">${photos.slice(0, 6).map((p, i) =>
        `<div><img src="${img(p, 500)}" alt="${esc(`${name} — ${subject}, view ${i + 1}`)}" loading="lazy" /></div>`).join("")}</div>` : ""}
    </div>

    <div>
      <span class="subject">${esc(subject)}</span>
      <h1>${esc(name)}</h1>
      <p class="lede">${esc(text)}</p>

      <div class="block">
        <h2>Finish</h2>
        <div class="finishes">
          ${MATERIAL_OPTIONS.map((m) => {
            const f = FINISHES[m.id];
            if (!f) return "";
            return `<div class="fin"><span class="sw ${m.id}"></span><div>
              <h3>${esc(f.label)}</h3>
              <p>${esc(f.note)}</p></div></div>`;
          }).join("")}
        </div>
      </div>

      ${sizes.length ? `<div class="block">
        <h2>Sizes</h2>
        <table>${sizes.map((s) =>
          `<tr><td>${esc(s.label)}</td><td>${esc(s.dims)}</td><td>${s.fixings ? esc(s.fixings) + " fixings" : ""}</td></tr>`).join("")}
          <tr><td>Customised</td><td>On request</td><td></td></tr>
        </table>
      </div>` : `<div class="block"><h2>Sizes</h2><table><tr><td>Customised</td><td>On request</td><td></td></tr></table></div>`}

      <div class="cta">
        <a class="btn solid" href="${base}?piece=${encodeURIComponent(name)}">See pricing</a>
        <a class="btn" href="/#contact">Enquire</a>
      </div>
      <p class="gate">Pricing opens once you enter your postcode</p>
    </div>
  </div>
</div>

${siblings.length ? `<div class="related"><div class="wrap">
  <span class="kicker">More from ${esc(range.label)}</span>
  <div class="rel-grid">
    ${siblings.map((s) => `<a class="rel" href="${base}/${rangeSlug(range.label)}/${pieceSlug(s.n)}">
      <div class="im"><img src="${img(imgs[s.imgs[0]], 600)}" alt="${esc(s.n)} — ${esc(wordsFor(range.label, s.n).subject)}" loading="lazy" /></div>
      <div class="cap"><b>${esc(s.n)}</b><span>${esc(wordsFor(range.label, s.n).subject)}</span></div></a>`).join("")}
  </div>
</div></div>` : ""}

<footer><div class="wrap"><a href="${base}/${rangeSlug(range.label)}">← All of ${esc(range.label)}</a></div></footer>
</body>
</html>`;
}

// ── write them ────────────────────────────────────────────────────────────
let written = 0;
const index = [];

for (const gallery of GALLERIES) {
  const { data, base } = gallery;
  for (const range of data.ranges) {
    const designs = (range.designs || []).filter((d) => d.n && d.imgs?.length && !HIDDEN_PIECES.includes(d.n));
    for (const design of designs) {
      const siblings = designs.filter((d) => d.n !== design.n).slice(0, 4);
      const dir = join(DIST, base.replace(/^\//, ""), rangeSlug(range.label));
      mkdirSync(dir, { recursive: true });
      const slug = pieceSlug(design.n);
      writeFileSync(join(dir, `${slug}.html`), page(gallery, range, design, data.imgs, siblings), "utf-8");
      index.push({
        url: `${base}/${rangeSlug(range.label)}/${slug}`,
        name: design.n,
        range: range.label,
        parent: gallery.parent,
        subject: wordsFor(range.label, design.n).subject,
        img: data.imgs[design.imgs[0]],
        written: Boolean(PIECE_SEO[design.n]),
      });
      written++;
    }
  }
}

// ── contents page, for walking the set before it goes live ────────────────
const groups = [...new Set(index.map((i) => `${i.parent} — ${i.range}`))];
const contents = `<!doctype html>
<html lang="en" style="background:#020202"><head>
<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Every piece page — preview | ROGETjames</title>
<meta name="robots" content="noindex, nofollow" />
<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Jost:wght@300;400&family=DM+Sans:wght@300;400&display=swap" rel="stylesheet" />
<style>
:root{--matt:#020202;--pewter:#181818;--cream:#EDE8DF;--dim:rgba(237,232,223,.68);--faint:rgba(237,232,223,.42);
--clay-lit:#D4A75C;--rule:rgba(237,232,223,.10)}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--matt);color:var(--cream);font-family:"DM Sans",sans-serif;font-weight:300;line-height:1.6}
.wrap{max-width:1200px;margin:0 auto;padding:0 24px}@media(min-width:820px){.wrap{padding:0 48px}}
h1{font-family:"Syne",sans-serif;font-weight:800;font-size:clamp(30px,4vw,52px);letter-spacing:-.02em;padding-top:56px}
p.lede{color:var(--dim);max-width:62ch;margin-top:16px;padding-bottom:34px;border-bottom:1px solid var(--rule)}
h2{font-family:"Syne",sans-serif;font-weight:700;font-size:20px;margin:44px 0 4px}
.count{font-family:"Jost",sans-serif;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--faint)}
.grid{display:grid;gap:14px;grid-template-columns:repeat(2,1fr);margin-top:16px}
@media(min-width:700px){.grid{grid-template-columns:repeat(4,1fr)}}
@media(min-width:1000px){.grid{grid-template-columns:repeat(6,1fr)}}
a.card{display:block;background:var(--pewter);border-radius:10px;overflow:hidden}
a.card .im{aspect-ratio:1/1;overflow:hidden}
a.card img{width:100%;height:100%;object-fit:cover}
a.card b{display:block;font-weight:500;font-size:13px;padding:10px 12px 2px}
a.card span{display:block;font-family:"Jost",sans-serif;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);padding:0 12px 12px}
footer{padding:60px 0;color:var(--faint);font-family:"Jost",sans-serif;font-size:11px;letter-spacing:.16em;text-transform:uppercase}
</style></head><body><div class="wrap">
<h1>Every piece, its own page</h1>
<p class="lede">${written} pages, one per catalogued design. Hidden from Google and not in the sitemap
until you say they go live. Click any piece to see its page as Google and a visitor would.</p>
${groups.map((g) => {
  const rows = index.filter((i) => `${i.parent} — ${i.range}` === g);
  return `<h2>${esc(g)}</h2><span class="count">${rows.length} pieces</span>
  <div class="grid">${rows.map((r) => `<a class="card" href="${r.url}">
    <div class="im"><img src="${img(r.img, 400)}" alt="${esc(r.name)}" loading="lazy" /></div>
    <b>${esc(r.name)}</b><span>${esc(r.subject)}</span></a>`).join("")}</div>`;
}).join("")}
<footer>Preview only · nothing here is visible to Google</footer>
</div></body></html>`;
writeFileSync(join(DIST, "pieces.html"), contents, "utf-8");

// ── sitemap, only once they are live ──────────────────────────────────────
if (!PREVIEW) {
  const sitemapPath = join(DIST, "sitemap.xml");
  if (existsSync(sitemapPath) && index.length) {
    const today = new Date().toISOString().slice(0, 10);
    const xml = readFileSync(sitemapPath, "utf-8");
    const additions = index
      .map((i) => `  <url>\n    <loc>${SITE}${i.url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`)
      .join("\n");
    writeFileSync(sitemapPath, xml.replace("</urlset>", `${additions}\n</urlset>`), "utf-8");
  }
}

const unwritten = index.filter((i) => !i.written).map((i) => i.name);
console.log(`  ✓ ${written} piece pages${PREVIEW ? " (preview — no-index, not in sitemap)" : " (live)"}`);
console.log(`  ✓ contents page at /pieces`);
if (unwritten.length) console.log(`  ! using fallback words: ${unwritten.join(", ")}`);
