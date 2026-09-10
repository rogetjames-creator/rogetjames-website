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
import { PIECE_SIZES, MATERIAL_OPTIONS, priceFor, checkWA, getState, STATE_NAMES, BOTH_FINISH_RANGES } from "../src/data/pricing.js";
import { PIECE_SEO, RANGE_SUBJECT, HIDDEN_PIECES, BRAND_SPIEL, WALL_ART_SPIEL, SUBJECT_SPIEL, MATERIAL_COPY, INSTALL_TIPS, BOTANY, TITLE_FONT, FULL_TITLE_IN_FACE, FONT_KIT, RANGE_SPIEL, RANGE_BOTANY, RANGE_TITLE, TITLE_OVERRIDE, RANGE_FACE, PIECE_FACE, DEFAULT_FACE } from "../src/data/pieceSeo.js";
import { rangeSlug } from "../src/utils/rangeSlug.js";
import { pieceSlug } from "../src/utils/pieceSlug.js";
import { CATALOGUES } from "../src/catalogues.js";
import { WORDMARKS } from "../src/data/wordmarks.js";

const PREVIEW = false;

// The ranges the galleries show no price for — kept in step with
// src/wall-art.jsx (NO_PRICE_RANGES) and src/sculptureRange.js (NO_PRICE_LABELS).
const NO_PRICE_RANGES = ["CUSTOM", "Fire Sculptures", "DISPLAYS"];

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const SITE = "https://rogetjames.com";

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");


// Serve photos through the Netlify image service, same as the galleries.
const img = (src, w) =>
  /^https?:|^data:/.test(src) ? src : `/.netlify/images?url=${encodeURIComponent(src)}&w=${w}&fm=webp&q=82`;


// The real pixel size of a local photo, read straight out of the file, so a
// frame can be given the picture's own shape instead of a guessed one.
function imageRatio(src) {
  try {
    if (!src || /^https?:|^data:/.test(src)) return null;
    const file = join(ROOT, "public", src.replace(/^\//, ""));
    if (!existsSync(file)) return null;
    const buf = readFileSync(file);
    if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {           // PNG
      return buf.readUInt32BE(16) / buf.readUInt32BE(20);
    }
    if (buf[0] === 0xff && buf[1] === 0xd8) {                              // JPEG
      let i = 2;
      while (i < buf.length) {
        if (buf[i] !== 0xff) { i++; continue; }
        const marker = buf[i + 1];
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return buf.readUInt16BE(i + 7) / buf.readUInt16BE(i + 5);        // width / height
        }
        i += 2 + buf.readUInt16BE(i + 2);
      }
    }
  } catch { /* fall back to the default frame */ }
  return null;
}

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
  // Both prices travel with the size but are never printed into the page —
  // they are read by the gate's script only once a postcode has been entered.
  return tiers.map((t) => ({
    id: t.id, label: t.label, dims: t.dims, fixings: t.fixings,
    wa: priceFor(t, "aluminium", true),
    other: priceFor(t, "aluminium", false),
  }));
}

function wordsFor(rangeLabel, name) {
  const seo = PIECE_SEO[name] || {};
  const subject = seo.s || RANGE_SUBJECT[rangeLabel] || "Laser cut metal wall art";
  // James's own spiel for a subject wins over anything written here.
  const spiel = seo.spiel || RANGE_SPIEL[rangeLabel] || (/^BANKSIA/i.test(name) ? SUBJECT_SPIEL.banksia : null);
  return { subject, spiel, links: seo.links || [] };
}

function page({ base, parent, kind }, range, design, imgs, siblings) {
  const name = design.n;
  const slug = pieceSlug(name);
  const url = `${SITE}${base}/${rangeSlug(range.label)}/${slug}`;
  const { subject, spiel, links } = wordsFor(range.label, name);
  const botany = BOTANY[name] || RANGE_BOTANY[range.label];
  const override = TITLE_OVERRIDE[name] || null;
  const rangeTitle = RANGE_TITLE[range.label] || null;
  const rangeFace = RANGE_FACE[range.label] || null;
  const pieceFace = PIECE_FACE[name] || null;
  const firstWord = name.split(" ")[0].toUpperCase();
  const wordmark = WORDMARKS[name.toUpperCase()] || WORDMARKS[firstWord] || null;
  // Nothing set for this piece, its range or its name, and no drawn wordmark —
  // it falls to the standard face rather than the plain site heading.
  const usingDefault = !override && !pieceFace && !rangeTitle && !rangeFace && !wordmark && !TITLE_FONT[firstWord];
  // The most specific setting wins: a hand-set title, then drawn artwork, then
  // this piece's own face, then its range's, then its name's.
  const faceSpec = pieceFace || rangeFace;
  const titleFont = override ? override.face
    : pieceFace ? pieceFace.face
    : rangeTitle ? rangeTitle.face
    : rangeFace ? rangeFace.face
    : (TITLE_FONT[firstWord] || (usingDefault ? DEFAULT_FACE.face : null));
  const photos = design.imgs.map((i) => imgs[i]).filter(Boolean);
  const hero = photos[0];
  const sizes = sizesFor(name);
  // Ranges the galleries price, and the finishes each gallery offers.
  const noPrice = NO_PRICE_RANGES.includes(range.label) || !!design.noPrice || !sizes.length;
  const cortenOnly = base === "/sculpture" && !BOTH_FINISH_RANGES.includes(range.label);
  const ratio = imageRatio(photos[0]) || 1;
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
        description: spiel || summary,
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
${titleFont ? `<link rel="stylesheet" href="https://use.typekit.net/${FONT_KIT}.css" />` : ""}
<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>
<style>
${photos.length > 1 ? photos.map((_, i) =>
  `.gal:has(.t${i + 1}:hover) .m${i + 1},.gal:has(.t${i + 1}:focus) .m${i + 1}{opacity:1;z-index:2}
.gal:has(.t${i + 1}:hover) .t${i + 1},.gal:has(.t${i + 1}:focus) .t${i + 1}{outline-color:var(--clay-lit)}`).join("\n") : ""}
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
.crumbline{display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap}
.crumbs{display:flex;gap:9px;align-items:center;flex-wrap:wrap;padding:18px 0;font-family:var(--jost);font-size:12px;color:var(--dim)}
.exit{display:inline-flex;align-items:center;gap:10px;border:1px solid rgba(237,232,223,.22);border-radius:999px;
padding:8px 16px;font-family:var(--jost);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--cream);
transition:border-color .3s ease,color .3s ease;flex:none}
.exit i{font-style:normal;font-size:13px;line-height:1;color:var(--clay-lit)}
.exit:hover{border-color:var(--clay-lit);color:var(--clay-lit)}
.crumbs a:hover{color:var(--dim)}.crumbs span{color:var(--dim)}
.piece{display:grid;gap:34px;grid-template-columns:1fr;padding:8px 0 60px}
@media(min-width:900px){.piece{grid-template-columns:1.35fr 1fr;gap:56px}}
.shots{display:grid;gap:12px;align-content:start}
.gal{display:grid;gap:12px;align-content:start}
.main{position:relative;aspect-ratio:var(--shape);border-radius:14px;overflow:hidden;background:var(--pewter)}
.main .m{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .45s ease}
.main .m1{opacity:1}
.thumbs{display:grid;grid-template-columns:repeat(auto-fit,minmax(0,1fr));gap:12px}
.thumbs .t{padding:0;border:0;background:var(--pewter);border-radius:10px;overflow:hidden;cursor:pointer;
aspect-ratio:var(--shape);outline:1px solid transparent;outline-offset:-1px;transition:outline-color .3s ease}
.thumbs .t img{width:100%;height:100%;object-fit:cover;display:block}
.subject{font-family:var(--jost);font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--clay-lit)}
h1{font-family:var(--syne);font-weight:800;font-size:clamp(28px,4vw,44px);letter-spacing:-.02em;line-height:1.04;margin-top:10px}
h1 .face{font-family:"${titleFont || "Syne"}",var(--syne);font-weight:${faceSpec ? faceSpec.weight : usingDefault ? DEFAULT_FACE.weight : (titleFont === "grange" ? 500 : 400)};${faceSpec && faceSpec.italic ? "font-style:italic;" : ""}letter-spacing:.01em;display:block${titleFont === "grange" ? ";transform:scaleX(1.21);transform-origin:left center" : ""}}
h1 .mark{display:block;width:min(100%,${wordmark && wordmark.viewBox.split(" ")[2] > 9000 ? 560 : 420}px)}
h1 .mark svg{width:100%;height:auto;display:block}
h1 .qual{display:block;font-family:var(--syne);font-weight:700;font-size:.5em;letter-spacing:-.01em;color:var(--dim);margin-top:6px}
h1 .qual.inface{font-family:"${titleFont || "Syne"}",var(--syne);font-weight:400;font-size:.62em;letter-spacing:.01em;text-transform:none}
.lede{color:var(--dim);font-size:16px;margin-top:18px;max-width:52ch}
.lede a{color:var(--clay-lit);border-bottom:1px solid rgba(212,167,92,.45);padding-bottom:1px}
.lede a:hover{border-color:var(--clay-lit)}
.block{margin-top:30px;padding-top:24px;border-top:1px solid var(--rule)}
.sizes-block{margin-top:28px;padding:22px 22px 8px;border:1px solid rgba(158,113,52,.42);border-radius:14px;
background:rgba(158,113,52,.06)}
.sizes-block h2{color:var(--clay-lit)}
.sizes-block table{margin-top:10px}
.sizes-block td{border-bottom-color:rgba(158,113,52,.20)}
.sizes-block tr:last-child td{border-bottom:none}
.block h2{font-family:var(--jost);font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--dim);font-weight:400}
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
td:first-child{font-family:var(--body);font-weight:500;width:120px}
td:nth-child(2){color:var(--dim);font-variant-numeric:tabular-nums}
td:last-child{color:var(--dim);font-size:13px;text-align:right;font-family:var(--jost)}
.botany{margin-top:18px;padding:14px 0;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);
display:flex;flex-direction:column;gap:6px;max-width:52ch}
.botany div{display:flex;gap:14px;align-items:baseline}
.botany dt{font-family:var(--jost);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint);min-width:150px;flex:none}
.botany dd{font-size:15px;color:var(--cream)}
.brand{color:var(--dim);font-size:15px;margin-top:14px;max-width:52ch}
.opener{border-top:1px solid var(--rule);margin-top:0}
.opener:first-of-type{margin-top:30px}
.opener summary{list-style:none;cursor:pointer;padding:18px 0;display:flex;align-items:center;justify-content:space-between;
font-family:var(--jost);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--cream)}
.opener summary::-webkit-details-marker{display:none}
.opener summary::after{content:"+";font-family:var(--body);font-size:18px;color:var(--clay-lit);line-height:1}
.opener[open] summary::after{content:"–"}
.opener .inner{padding:0 0 22px}
.opener .fin{margin-bottom:16px}
.opener .fin p{max-width:52ch}
.fixpic{width:100%;border-radius:10px;margin:0 0 18px;background:var(--pewter)}
.tips{list-style:none;display:flex;flex-direction:column;gap:10px}
.tips li{color:var(--dim);font-size:14px;padding-left:16px;position:relative;max-width:54ch}
.tips li::before{content:"";position:absolute;left:0;top:9px;width:5px;height:5px;background:var(--clay)}
.tips a{color:var(--clay-lit);text-decoration:underline;text-underline-offset:3px}
.cta{display:flex;gap:14px;flex-wrap:wrap;margin-top:26px}
.cta-enquire,.cta-price{justify-content:center;margin-top:24px}
.cta-price{margin-bottom:2px}
.pricing{text-align:center}
.pricing .finishes{justify-content:center}
.pricing #pcForm{max-width:330px;margin:0 auto}
.psize{text-align:left}
.btn{display:inline-block;border:1px solid rgba(158,113,52,.75);color:var(--clay-lit);padding:8px 18px;border-radius:999px;
font-family:var(--jost);font-size:10px;letter-spacing:.18em;text-transform:uppercase;cursor:pointer}
.btn.solid{background:rgba(158,113,52,.14)}
.btn:hover{background:rgba(158,113,52,.22)}
.gate{font-family:var(--jost);font-size:11px;letter-spacing:.1em;color:var(--faint);margin-top:12px;text-transform:uppercase}
.pricing{margin-top:20px;border:1px solid var(--rule);border-radius:14px;padding:20px;background:rgba(0,0,0,.22);max-width:520px}
.pricing[hidden]{display:none}
.plab{font-family:var(--jost);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--clay-lit)}
.phint{font-size:13px;color:var(--dim);margin-top:6px;line-height:1.55}
.finishes{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}
.chip{font-family:var(--jost);font-size:11px;letter-spacing:.06em;color:var(--dim);border:1px solid rgba(237,232,223,.22);
border-radius:30px;padding:9px 15px;background:none;cursor:pointer;transition:.2s}
.chip:hover{border-color:rgba(237,232,223,.45);color:var(--cream)}
.chip.sel{border-color:var(--clay-lit);color:var(--cream);background:rgba(158,113,52,.18)}
#pcForm{display:flex;gap:8px}
#pcIn{flex:1;min-width:0;background:#0c0b0a;border:1px solid rgba(237,232,223,.18);border-radius:9px;color:var(--cream);
font-family:var(--body);font-size:14px;padding:11px 13px;letter-spacing:.12em}
#pcIn:focus{outline:none;border-color:var(--clay-lit)}
.go{background:rgba(158,113,52,.9);color:#fff;border:none;border-radius:9px;padding:0 18px;cursor:pointer;
font-family:var(--jost);font-size:11px;letter-spacing:.18em;text-transform:uppercase}
.go:hover{background:var(--clay-lit)}
.perr{color:#e8a184;font-size:13px;margin-top:8px;min-height:15px}
.pnote{font-size:13px;color:var(--dim);margin-top:12px;line-height:1.55}
td.price{text-align:right;color:var(--clay-lit);font-variant-numeric:tabular-nums;letter-spacing:.06em;white-space:nowrap}
tr.sz{cursor:pointer}
tr.sz td:first-child{position:relative;padding-left:22px}
tr.sz td:first-child::before{content:"";position:absolute;left:0;top:50%;width:11px;height:11px;margin-top:-6px;
border:1px solid rgba(237,232,223,.35);border-radius:50%;transition:.2s}
tr.sz:hover td{color:var(--cream)}
tr.sz:hover td:first-child::before{border-color:var(--clay-lit)}
tr.sz.sel td{color:var(--clay-lit)}
tr.sz.sel td:first-child::before{border-color:var(--clay-lit);background:var(--clay-lit);box-shadow:inset 0 0 0 2px var(--matt)}
.addq{width:100%;margin-top:16px;background:rgba(158,113,52,.9);color:#fff;border:none;border-radius:12px;padding:15px;cursor:pointer;
font-family:var(--jost);font-size:11px;letter-spacing:.18em;text-transform:uppercase;transition:.25s}
.addq:hover:not(:disabled){background:var(--clay-lit)}
.addq:disabled{opacity:.4;cursor:not-allowed}
.addq.added{background:#3f6f4a}
.aqhint{font-size:13px;color:var(--dim);text-align:center;margin-top:10px;line-height:1.5}
.toquote{display:block;text-align:center;margin-top:10px;font-family:var(--jost);font-size:11px;letter-spacing:.2em;
text-transform:uppercase;color:var(--clay-lit)}
.toquote[hidden]{display:none}
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
footer{border-top:1px solid var(--rule);padding:34px 0 60px}
footer .back{display:inline-block;font-family:var(--jost);font-size:13px;letter-spacing:.18em;text-transform:uppercase;
color:var(--cream);border-bottom:1px solid rgba(212,167,92,.5);padding-bottom:4px;transition:color .3s ease,border-color .3s ease}
footer .back:hover{color:var(--clay-lit);border-color:var(--clay-lit)}
</style>
</head>
<body>
<header><div class="wrap hdr">
  <a class="mark" href="/">ROGET<i>james</i></a>
  <nav><a href="/wall-art">Wall Art</a><a href="/sculpture">Sculpture</a><a href="/screens">Screens</a><a href="/#contact">Contact</a></nav>
</div></header>

<div class="wrap">
  <div class="crumbline">
    <div class="crumbs"><a href="/">Home</a> › <a href="${base}">${esc(parent)}</a> › <a href="${base}/${rangeSlug(range.label)}">${esc(range.label)}</a> › <span>${esc(name)}</span></div>
    <a class="exit" href="${base}/${rangeSlug(range.label)}" aria-label="${esc(`Close ${name} and return to ${range.label}`)}"><span>Close</span><i>✕</i></a>
  </div>

  <div class="piece">
    <div class="shots">
      ${photos.length ? `<div class="gal" style="--shape:${ratio.toFixed(4)}">
        <div class="main">
          ${photos.map((src, i) => `<img class="m m${i + 1}" src="${img(src, 1400)}" alt="${esc(i === 0 ? `${subject} — ${name} by ROGETjames` : `${name} — ${subject}, view ${i + 1}`)}"${i === 0 ? ' fetchpriority="high"' : ' loading="lazy"'} />`).join("")}
        </div>
        ${photos.length > 1 ? `<div class="thumbs">${photos.map((src, i) =>
          `<button class="t t${i + 1}" type="button" aria-label="${esc(`${name}, view ${i + 1}`)}"><img src="${img(src, 400)}" alt="" loading="lazy" /></button>`).join("")}</div>` : ""}
      </div>` : ""}
    </div>

    <div>
      <span class="subject">${esc(subject)}</span>
      <h1>${(() => {
        // A hand-set title wins over everything.
        if (override) {
          const q = override.qual
            ? `<span class="qual${override.qualInFace ? " inface" : ""}">${esc(override.qual)}</span>`
            : "";
          return `<span class="face">${esc(override.word)}</span>${q}`;
        }
        // Drawn artwork beats a typed name.
        if (wordmark) {
          const whole = !!WORDMARKS[name.toUpperCase()];
          const rest = whole ? "" : name.split(" ").slice(1).join(" ");
          return `<span class="mark"><svg viewBox="${wordmark.viewBox}" role="img" aria-label="${esc(whole ? name : firstWord)}" fill="currentColor" xmlns="http://www.w3.org/2000/svg">${wordmark.inner}</svg></span>${rest ? `<span class="qual">${esc(rest)}</span>` : ""}`;
        }
        // A piece, or a whole range, set in one face — the whole name as chosen.
        if (pieceFace || rangeFace) return `<span class="face">${esc(name)}</span>`;
        // A range with its own prefix: CREEPING FIG, then the piece under it.
        if (rangeTitle) {
          const rx = new RegExp(`^${rangeTitle.prefix}S?\\s*(—|-)?\\s*`, "i");
          // Written the way James writes it: CREEPING FIG, then Autumn.
          const rest = name.replace(rx, "").trim()
            .replace(/\S+/g, (w) => (w.length > 3 && w === w.toUpperCase() ? w[0] + w.slice(1).toLowerCase() : w));
          return `<span class="face">${esc(rangeTitle.prefix)}</span>${rest ? `<span class="qual">${esc(rest)}</span>` : ""}`;
        }
        // Nothing chosen for this one — the standard face, whole name.
        if (usingDefault) return `<span class="face">${esc(name)}</span>`;
        if (!titleFont) return esc(name);
        // The whole name in the face — as James set it in the artwork.
        if (FULL_TITLE_IN_FACE.includes(name))
          return `<span class="face">${esc(name.toUpperCase())}</span>`;
        // Otherwise: BANKSIA in the face, the qualifier after it, standard and smaller.
        const [first, ...rest] = name.split(" ");
        const tail = rest.join(" ").replace(/^[—-]\s*/, "");
        return `<span class="face">${esc(first)}</span>${tail ? `<span class="qual">${esc(tail)}</span>` : ""}`;
      })()}</h1>
      ${spiel ? `<p class="lede">${links.reduce((t, [words, href]) =>
        t.replace(esc(words), `<a href="${href}">${esc(words)}</a>`), esc(spiel))}</p>` : ""}
      ${botany ? `<dl class="botany">${botany.map(([label, value, opt]) =>
        `<div><dt>${esc(label)}</dt><dd>${opt && opt.i ? `<i>${esc(value)}</i>` : esc(value)}</dd></div>`).join("")}</dl>` : ""}
      ${(base === "/wall-art" ? [WALL_ART_SPIEL, ...BRAND_SPIEL] : BRAND_SPIEL).map((para) => `<p class="brand">${esc(para)}</p>`).join("")}

      <details class="opener">
        <summary>Material and colour options</summary>
        <div class="inner">
          ${MATERIAL_COPY.map((m) => `<div class="fin"><span class="sw ${m.id}"></span><div>
            <h3>${esc(m.heading)}</h3><p>${esc(m.text).replace(
              "view the colour chart in Catalogues on the menu",
              `view the <a href="/catalogues/interpon-colours">Interpon</a> and <a href="/catalogues/dulux-colours">Dulux</a> colour charts`
            )}</p></div></div>`).join("")}
        </div>
      </details>

      ${kind === "wall" ? `<details class="opener">
        <summary>Tips for installation</summary>
        <div class="inner"><img class="fixpic" src="${img("/images/fixings/standoffs.jpg", 700)}" alt="Powder coated stand-off fixings" loading="lazy" /><ul class="tips">${(() => {
        // The standoff count comes from the catalogue, per size. Where the
        // catalogue gives no count, the line is left off rather than guessed.
        const counts = [...new Set(sizes.map((z) => z.fixings).filter(Boolean).map(String))];
        const f = counts.length > 1 ? `${counts[0]}–${counts[counts.length - 1]}` : counts[0];
        return INSTALL_TIPS.map((t) => {
          if (t.includes("{fixings}")) {
            if (!f) return "";
            const line = counts.length > 1 ? `${f} standoffs required, depending on size.` : `${f} standoffs required.`;
            return `<li>${esc(line)}</li>`;
          }
          return `<li>${esc(t)}</li>`;
        }).join("");
      })()}</ul></div>
      </details>` : ""}

      <div class="cta cta-enquire">
        <a class="btn" href="/#contact">Enquire</a>
      </div>

      ${sizes.length ? `<div class="block sizes-block">
        <h2>Sizes</h2>
        <table>${sizes.map((s, i) =>
          `<tr class="${noPrice ? "" : "sz"}" data-i="${i}"><td>${esc(s.label)}</td><td>${esc(s.dims)}</td><td>${s.fixings ? esc(s.fixings) + " fixings" : ""}</td><td class="price" data-i="${i}"></td></tr>`).join("")}
          <tr><td>Customised</td><td>On request</td><td></td><td class="price"></td></tr>
        </table>
      </div>` : `<div class="block sizes-block"><h2>Sizes</h2><table><tr><td>Customised</td><td>On request</td><td></td></tr></table></div>`}

      <div class="cta cta-price">
        ${noPrice ? "" : `<button class="btn solid" id="seePricing" type="button">See pricing</button>`}
      </div>
      ${noPrice ? "" : `
      <div class="pricing" id="pricing" hidden>
        <p class="plab">Pricing</p>
        <p class="phint" id="phint">Choose a finish, then enter your postcode to see pricing for your area.</p>
        <div class="finishes" id="finishes">
          ${cortenOnly ? "" : `<button class="chip" type="button" data-fin="Aluminium — Powder Coated">Aluminium — Powder Coated</button>`}
          <button class="chip" type="button" data-fin="Natural Corten Steel">Natural Corten Steel</button>
        </div>
        <form id="pcForm" autocomplete="off">
          <input id="pcIn" inputmode="numeric" maxlength="4" placeholder="Postcode" aria-label="Postcode" />
          <button class="go" type="submit">Show pricing</button>
        </form>
        <p class="perr" id="perr"></p>
        <p class="pnote" id="pnote" hidden>Prices are shown against each size above. Fixings &amp; freight to be confirmed.</p>
        <button class="addq" id="addQ" type="button" disabled>Add to quote</button>
        <p class="aqhint" id="aqhint">Choose a finish and a size to add to your quote.</p>
        <a class="toquote" id="toQuote" href="/#contact" hidden>Go to your quote &rarr;</a>
      </div>`}
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

<footer><div class="wrap"><a class="back" href="${base}/${rangeSlug(range.label)}">← Return to ${esc(range.label)}</a></div></footer>
${noPrice ? "" : `<script>
(function(){
  // The postcode gate. A price is never in the page until a postcode has been
  // entered, and never in the address. The two postcode functions below are
  // the gallery's own, written out at build time, so they cannot drift from it.
  var SIZES = ${JSON.stringify(sizes)};
  var PIECE = ${JSON.stringify({ name, series: range.label, img: hero || "" })};
  var MATS  = ${JSON.stringify(MATERIAL_OPTIONS)};
  var BKEY  = "roj-quote-basket";
  var NAMES = ${JSON.stringify(STATE_NAMES)};
  var checkWA = ${checkWA.toString()};
  var getState = ${getState.toString()};
  var KEY = "roj_postcode";
  var open = document.getElementById("seePricing");
  var box  = document.getElementById("pricing");
  var hint = document.getElementById("phint");
  var errE = document.getElementById("perr");
  var note = document.getElementById("pnote");
  var form = document.getElementById("pcForm");
  var input= document.getElementById("pcIn");
  var chips= [].slice.call(document.querySelectorAll("#finishes .chip"));
  var cells= [].slice.call(document.querySelectorAll("td.price[data-i]"));
  var finish = null, info = null, size = null;
  var rows = [].slice.call(document.querySelectorAll("tr.sz"));
  var addQ = document.getElementById("addQ");
  var aqh  = document.getElementById("aqhint");
  var toQ  = document.getElementById("toQuote");
  try { var raw = localStorage.getItem(KEY); if (raw) info = JSON.parse(raw); } catch (e) { info = null; }
  var region = function(){ return (info && (NAMES[info.state] || info.state)) || "Australia"; };
  var locked = function(){ return !!(info && info.postcode); };

  function paint(){
    if (!locked() || !finish) { cells.forEach(function(c){ c.textContent = ""; }); note.hidden = true; return; }
    cells.forEach(function(c){
      var row = SIZES[+c.dataset.i] || {};
      var v = info.isWA ? row.wa : row.other;
      c.textContent = (v || v === 0) ? "A$" + Number(v).toLocaleString() : "POA";
    });
    note.hidden = false;
    hint.hidden = true;
  }
  function setHint(){
    var one = chips.length === 1;
    hint.hidden = false;
    if (locked()) {
      // The postcode is already known — never announce a state back at anyone.
      // The work is made for the whole country.
      form.hidden = true;
      hint.textContent = one ? "" : "Choose a finish.";
      if (one) hint.hidden = true;
    } else {
      form.hidden = false;
      hint.textContent = one ? "Enter your postcode to see pricing for your area."
                             : "Choose a finish, then enter your postcode to see pricing for your area.";
    }
  }
  // A range made in one finish only — Corten — has nothing to choose between,
  // so it is chosen already rather than asking.
  if (chips.length === 1) { finish = chips[0].dataset.fin; chips[0].classList.add("sel"); }
  if (open) open.addEventListener("click", function(){
    box.hidden = false;
    if (size === null && rows.length) { size = 0; rows[0].classList.add("sel"); }
    setHint(); paint(); addState();
    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
    if (!locked()) setTimeout(function(){ input.focus(); }, 350);
  });
  chips.forEach(function(c){
    c.addEventListener("click", function(){
      finish = c.dataset.fin;
      chips.forEach(function(x){ x.classList.toggle("sel", x === c); });
      errE.textContent = ""; paint();
      if (typeof addState === "function") addState();
    });
  });
  form.addEventListener("submit", function(e){
    e.preventDefault();
    if (!finish) { errE.textContent = "Select a finish first."; return; }
    var v = (input.value || "").trim();
    if (!/^\\d{4}$/.test(v)) { errE.textContent = "Enter a 4-digit Australian postcode."; return; }
    info = { postcode: v, isWA: checkWA(v), state: getState(v), isAdmin: false };
    try { localStorage.setItem(KEY, JSON.stringify(info)); } catch (err) { /* private browsing */ }
    errE.textContent = ""; form.hidden = true; paint();
  });

  // Add to quote — the same basket the galleries and the contact form use,
  // so a piece added here is waiting in the quote request like any other.
  function basket(){ try { var a = JSON.parse(localStorage.getItem(BKEY) || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function addState(){
    var ok = !!finish && size !== null;
    addQ.disabled = !ok;
    aqh.textContent = ok ? "Add this design, finish and size to your quote."
      : !finish ? "Choose a finish to add to your quote." : "Choose a size to add to your quote.";
    if (basket().length) toQ.hidden = false;
  }
  rows.forEach(function(tr){
    tr.addEventListener("click", function(){
      size = +tr.dataset.i;
      rows.forEach(function(x){ x.classList.toggle("sel", x === tr); });
      if (box.hidden) { box.hidden = false; setHint(); paint(); }
      addState();
    });
  });
  addQ.addEventListener("click", function(){
    if (!finish || size === null) return;
    var t = SIZES[size];
    var mat = /corten/i.test(finish) ? MATS[MATS.length - 1] : MATS[0];
    var items = basket();
    var dup = items.some(function(q){ return q.name === PIECE.name && q.size && q.size.id === t.id && q.material && q.material.id === mat.id; });
    if (!dup) {
      items.push({ id: PIECE.name + "-" + Date.now(), name: PIECE.name, series: PIECE.series,
                   size: { id: t.id, label: t.label, dims: t.dims, fixings: t.fixings }, material: mat, img: PIECE.img });
      try { localStorage.setItem(BKEY, JSON.stringify(items)); } catch (e) { /* ignore */ }
    }
    addQ.classList.add("added");
    addQ.textContent = "Added to quote \\u2713";
    toQ.hidden = false;
    setTimeout(function(){ addQ.classList.remove("added"); addQ.textContent = "Add to quote"; }, 2200);
  });
  addState();
})();
</script>`}
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
      const w = wordsFor(range.label, design.n);
      index.push({
        url: `${base}/${rangeSlug(range.label)}/${slug}`,
        name: design.n,
        range: range.label,
        parent: gallery.parent,
        subject: w.subject,
        img: data.imgs[design.imgs[0]],
        written: Boolean(PIECE_SEO[design.n]),
        hasSpiel: Boolean(w.spiel),
        hasFace: Boolean(
          (TITLE_OVERRIDE[design.n] && TITLE_OVERRIDE[design.n].face) ||
          RANGE_TITLE[range.label] ||
          TITLE_FONT[design.n.split(" ")[0].toUpperCase()] ||
          WORDMARKS[design.n.toUpperCase()] ||
          WORDMARKS[design.n.split(" ")[0].toUpperCase()]
        ),
        hasPlant: Boolean(BOTANY[design.n] || RANGE_BOTANY[range.label]),
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
a{color:inherit;text-decoration:none}
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
a.card span{display:block;font-family:"Jost",sans-serif;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);padding:0 12px 6px}
a.card .tags{display:flex;gap:5px;flex-wrap:wrap;padding:0 12px 12px;font-style:normal}
a.card .tags i{font-style:normal;font-family:"Jost",sans-serif;font-size:9px;letter-spacing:.14em;text-transform:uppercase;
color:#D4A75C;border:1px solid rgba(212,167,92,.4);border-radius:20px;padding:2px 7px}
a.card .tags i.none{color:rgba(237,232,223,.3);border-color:rgba(237,232,223,.18)}
footer{padding:60px 0;color:var(--faint);font-family:"Jost",sans-serif;font-size:11px;letter-spacing:.16em;text-transform:uppercase}
</style></head><body><div class="wrap">
<h1>Every piece, its own page</h1>
<p class="lede">${written} pages, one per catalogued design. ${PREVIEW
  ? "Hidden from Google and not in the sitemap until you say they go live."
  : "Live — every one is open to Google and listed in the sitemap."}
Click any piece to open it. The tags say what each one has so far —
<b>font</b> its own title face, <b>words</b> your spiel, <b>plant</b> its botanical lines. Keep this page
open as your list; it rebuilds every time the site does.</p>
${groups.map((g) => {
  const rows = index.filter((i) => `${i.parent} — ${i.range}` === g);
  return `<h2>${esc(g)}</h2><span class="count">${rows.length} pieces</span>
  <div class="grid">${rows.map((r) => `<a class="card" href="${r.url}">
    <div class="im"><img src="${img(r.img, 400)}" alt="${esc(r.name)}" loading="lazy" /></div>
    <b>${esc(r.name)}</b><span>${esc(r.subject)}</span>
    <em class="tags">${[r.hasFace ? "font" : "", r.hasSpiel ? "words" : "", r.hasPlant ? "plant" : ""].filter(Boolean).map(t => `<i>${t}</i>`).join("") || `<i class="none">nothing yet</i>`}</em></a>`).join("")}</div>`;
}).join("")}
<footer>Preview only · nothing here is visible to Google</footer>
</div></body></html>`;
writeFileSync(join(DIST, "pieces.html"), contents, "utf-8");

// ── the list of addresses that actually exist ─────────────────────────────
// The galleries read this before sending anyone to a design's page. Ranges
// built from uploads (Fire Sculptures, Displays) have no page, and without
// this the gallery would walk visitors into a 404.
writeFileSync(join(DIST, "piece-pages.json"),
  JSON.stringify(index.map((i) => i.url)), "utf-8");

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


// ── The catalogues, each with its own address ─────────────────────────────
// Same list the nav bar and the galleries use (src/catalogues.js) — the pages
// here just give each one a web address so it can be linked to.
const catSlug = (label) => label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const catShell = (title, description, body, url) => `<!doctype html>
<html lang="en" style="background:#020202"><head>
<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<meta name="robots" content="${PREVIEW ? "noindex, nofollow" : "index, follow"}" />
<link rel="canonical" href="${url}" />
<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Jost:wght@300;400&family=DM+Sans:wght@300;400&family=Plus+Jakarta+Sans:wght@400;700&family=Playfair+Display:ital@1&display=swap" rel="stylesheet" />
<link rel="icon" href="/favicon.ico" sizes="any" />
<style>
:root{--matt:#020202;--pewter:#181818;--cream:#EDE8DF;--dim:rgba(237,232,223,.68);--faint:rgba(237,232,223,.42);
--clay-lit:#D4A75C;--rule:rgba(237,232,223,.10)}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--matt);color:var(--cream);font-family:"DM Sans",sans-serif;font-weight:300;line-height:1.65}
img{display:block;max-width:100%}a{color:inherit;text-decoration:none}
.wrap{max-width:1100px;margin:0 auto;padding:0 24px}@media(min-width:820px){.wrap{padding:0 48px}}
header{border-bottom:1px solid var(--rule)}
.hdr{display:flex;align-items:center;justify-content:space-between;height:74px}
.mark{font-family:"Plus Jakarta Sans",sans-serif;font-weight:700;font-size:19px}
.mark i{font-family:"Playfair Display",Georgia,serif;font-style:italic;font-weight:400}
nav{display:flex;gap:26px;font-family:"Jost",sans-serif;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--dim)}
.crumbs{display:flex;gap:9px;padding:18px 0;font-family:"Jost",sans-serif;font-size:12px;color:var(--faint)}
h1{font-family:"Syne",sans-serif;font-weight:800;font-size:clamp(30px,4.5vw,54px);letter-spacing:-.02em;padding-top:22px}
p.lede{color:var(--dim);max-width:60ch;margin-top:14px;padding-bottom:30px;border-bottom:1px solid var(--rule)}
.pages{display:grid;gap:18px;grid-template-columns:1fr;padding:28px 0 70px}
@media(min-width:760px){.pages{grid-template-columns:repeat(2,1fr)}}
.pages img{width:100%;border-radius:10px;background:var(--pewter)}
.cards{display:grid;gap:18px;grid-template-columns:1fr;padding:28px 0 70px}
@media(min-width:760px){.cards{grid-template-columns:repeat(2,1fr)}}
.card{background:var(--pewter);border-radius:12px;overflow:hidden;display:block}
.card img{width:100%;aspect-ratio:4/3;object-fit:cover;object-position:top}
.card b{display:block;font-family:"Syne",sans-serif;font-size:17px;padding:14px 16px 2px}
.card span{display:block;font-family:"Jost",sans-serif;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint);padding:0 16px 16px}
footer{border-top:1px solid var(--rule);padding:30px 0 60px;font-family:"Jost",sans-serif;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint)}
</style></head><body>
<header><div class="wrap hdr"><a class="mark" href="/">ROGET<i>james</i></a>
<nav><a href="/wall-art">Wall Art</a><a href="/sculpture">Sculpture</a><a href="/screens">Screens</a><a href="/catalogues">Catalogues</a></nav></div></header>
${body}
<footer><div class="wrap"><a href="/catalogues">← All catalogues</a></div></footer>
</body></html>`;

mkdirSync(join(DIST, "catalogues"), { recursive: true });
for (const cat of CATALOGUES) {
  const slug = catSlug(cat.label);
  const url = `${SITE}/catalogues/${slug}`;
  const isColour = /colour/i.test(cat.label);
  const description = isColour
    ? `${cat.label} for ROGETjames powder-coated aluminium wall art, sculpture and screens — the full powder coat colour chart.`
    : `The ROGETjames ${cat.label.toLowerCase()} catalogue — laser cut designs in Corten steel and powder-coated aluminium, made to order in Australia.`;
  const body = `<div class="wrap">
    <div class="crumbs"><a href="/">Home</a> › <a href="/catalogues">Catalogues</a> › <span>${esc(cat.label)}</span></div>
    <h1>${esc(cat.label)}</h1>
    <p class="lede">${esc(description)}</p>
    <div class="pages">${cat.pages.map((src, i) =>
      `<img src="${img(src, 1000)}" alt="${esc(cat.label)} — page ${i + 1}" loading="${i < 2 ? "eager" : "lazy"}" />`).join("")}</div>
  </div>`;
  writeFileSync(join(DIST, "catalogues", `${slug}.html`), catShell(`${cat.label} | ROGETjames`, description, body, url), "utf-8");
}
const catIndexBody = `<div class="wrap">
  <div class="crumbs"><a href="/">Home</a> › <span>Catalogues</span></div>
  <h1>Catalogues</h1>
  <p class="lede">The design catalogues and the powder coat colour charts, page by page.</p>
  <div class="cards">${CATALOGUES.map((c) =>
    `<a class="card" href="/catalogues/${catSlug(c.label)}"><img src="${img(c.pages[0], 800)}" alt="${esc(c.label)}" loading="lazy" /><b>${esc(c.label)}</b><span>${c.pages.length} pages</span></a>`).join("")}</div>
</div>`;
writeFileSync(join(DIST, "catalogues.html"),
  catShell("Catalogues | ROGETjames", "ROGETjames design catalogues and the Dulux and Interpon powder coat colour charts.", catIndexBody, `${SITE}/catalogues`), "utf-8");
console.log(`  ✓ ${CATALOGUES.length} catalogue pages + contents at /catalogues`);

const unwritten = index.filter((i) => !i.written).map((i) => i.name);
console.log(`  ✓ ${written} piece pages${PREVIEW ? " (preview — no-index, not in sitemap)" : " (live)"}`);
console.log(`  ✓ contents page at /pieces`);
if (unwritten.length) console.log(`  ! using fallback words: ${unwritten.join(", ")}`);
