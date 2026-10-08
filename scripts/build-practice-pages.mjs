// Writes the pages for the practice, as opposed to the product.
//
//   dist/architectural-art.html
//   dist/public-art.html
//   dist/commercial-art.html
//
// The site carried 86 pages selling wall art and one page — 179 words — for
// everything the practice does. Someone searching "architectural art
// australia" or "public art commission" found nothing here, because nothing
// here was about that. These three pages answer those searches using work
// already photographed and already named.
//
// Every fact on these pages is taken from what the site already publishes.
// Nothing is invented: the venues, the works, the materials and the dates all
// appear elsewhere on rogetjames.com.
//
// PREVIEW MODE (the default): each page is marked no-index and none are added
// to sitemap.xml, so James can walk them before Google sees them.
// TO PUT THEM LIVE: set PREVIEW to false below.

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const PREVIEW = true;

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const SITE = "https://rogetjames.com";
const CDN = "/images/cdn-gallery";

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const img = (src, w) =>
  /^https?:|^data:/.test(src) ? src : `/.netlify/images?url=${encodeURIComponent(src)}&w=${w}&fm=webp&q=82`;


// ── The three pages ───────────────────────────────────────────────────────
const PAGES = [
  {
    slug: "architectural-art",
    kicker: "Commissioned work, concept to creation",
    heading: "Architectural Art",
    title: "Architectural Art & Commissions, Australia | ROGETjames",
    desc: "Architectural art commissioned for architects, developers, landscapers and interior designers — feature screens, sculpture, lighting and site-specific work in aluminium, stainless and Corten steel.",
    lede: "Sculpture, architectural feature screens, lighting, art projects, catalogued creations and site-specific bespoke features.",
    body: [
      "Commissioned work for architects, developers, landscapers, interior designers and discerning residential clients, with works for hospitality, institutions, builders' display homes and some of Australia's premium homes.",
      "Be it an entrance, a wall, a void, a facade or an art project, ROGETjames works from concept to creation. Aluminium, stainless steel and Corten steel are a few of the materials ROGETjames utilises to make ART meet design.",
      "ROGETjames's long history does the talking, with notable works across Australia: the Homebase Design Centre in Subiaco, WA; iconic venues such as Frasers in Kings Park, the Cottesloe Hotel, the Duxton Hotel and Lalla Rookh, all in WA; retirement villages and display homes in South Australia; Mirvac developments in Melbourne; RSL fit-outs in Sydney; and award-winning and notable homes in Victoria, Sydney and Brisbane. Public sculptures stand at Fiona Stanley Hospital and Centennial Park.",
    ],
    sectors: ["Architects", "Developers", "Landscapers", "Interior designers", "Hospitality", "Institutions", "Builders & display homes", "Private residential"],
    works: [
      { img: "/images/hero/hero-homebase-entrance.jpg", name: "Entrance feature", where: "Homebase Design Centre, Subiaco WA" },
      { img: "/images/uploads/1789196612222_pzttgx.jpg", name: "LUMIER dividers", where: "Mirvac, Melbourne" },
      { img: "/images/hero/hero-cottesloe-patio.jpg", name: "ERGO", where: "Cottesloe Hotel, WA" },
      { img: "/images/uploads/1787118567628_awv18c.jpg", name: "Screens, in situ", where: "Perth, WA" },
      { img: `${CDN}/0cb8128a-5efd-4474-851e-636aa772a9b4_rw_1920.jpg`, name: "LUMIER lobby dividers", where: "Mirvac, Melbourne" },
      { img: "/images/hero/hero-homebase-dusk.jpg", name: "Precinct landscape & art features", where: "Homebase Design Centre, Subiaco WA" },
    ],
    also: [["Public art commissions", "/public-art"], ["Commercial & hospitality", "/commercial-art"], ["Screens", "/screens"]],
  },
  {
    slug: "public-art",
    kicker: "Civic & community commissions",
    heading: "Public Art",
    title: "Public Art Commissions & Civic Sculpture, Australia | ROGETjames",
    desc: "Public art and civic sculpture in Corten steel — Balga Mia Mia at Fiona Stanley Hospital Sculpture Park and Unity in Diversity at Centennial Park, Western Australia.",
    lede: "Sculpture made for public ground — lit, weathering, and built for years of open air and public contact.",
    body: [
      "Public work asks different questions of a piece than a wall in a house does. It has to survive weather and handling, it has to read from a distance and up close, and it has to mean something to the people who pass it every day rather than to whoever commissioned it.",
      "Balga Mia Mia stands at Fiona Stanley Hospital Sculpture Park in Murdoch, Western Australia — Corten steel columns cut so that light carries the pattern outward after dark. Unity in Diversity was commissioned for Centennial Park, Western Australia, and was developed through an extensive concept process before a single sheet was cut.",
      "Commissions are taken from councils, hospitals, developers and public art consultants. Concept design, engineering, fabrication, footings and installation are carried by the one studio.",
    ],
    sectors: ["Councils", "Hospitals & health", "Public art consultants", "Developers", "Community groups", "Memorial commissions"],
    works: [
      { img: `${CDN}/0bb31cda-116a-4ec4-8c20-5f25f900287c_rw_1200.jpg`, name: "BALGA MIA MIA", where: "Fiona Stanley Hospital Sculpture Park, Murdoch WA" },
      { img: `${CDN}/14c73030-575d-46e2-ae9e-eb407eb06e16_rw_1200.jpg`, name: "BALGA MIA MIA, at dusk", where: "Fiona Stanley Hospital Sculpture Park, Murdoch WA" },
      { img: `${CDN}/ce906d3c-248e-42c2-a76c-e7547bae20e7_rw_1200.jpg`, name: "UNITY IN DIVERSITY", where: "Centennial Park, WA" },
      { img: `${CDN}/6745c491-3d3b-4501-b01c-76a351d2d9d1_rw_1920.jpeg`, name: "UNITY IN DIVERSITY", where: "Centennial Park, WA" },
      { img: "/images/hero/hero-homebase-totems.jpg", name: "Totems", where: "Homebase Design Centre, Subiaco WA" },
      { img: `${CDN}/13dddf44-cb0a-4ad6-a4ac-3b229792d04d_rw_1920.jpg`, name: "Sculpture", where: "Fiona Stanley Hospital, Murdoch WA" },
    ],
    also: [["Architectural art", "/architectural-art"], ["Sculpture", "/sculpture"], ["Commercial & hospitality", "/commercial-art"]],
  },
  {
    slug: "commercial-art",
    kicker: "Hotels, hospitality, retail & developments",
    heading: "Commercial & Hospitality Artwork",
    title: "Commercial & Hospitality Artwork, Australia | ROGETjames",
    desc: "Artwork for hotels, hospitality, retail and property developments — laser cut Corten steel and powdercoated aluminium, made to the building. Australia-wide.",
    lede: "Artwork that has to work as a room does — at the door, behind the bar, across a lobby, in front of a crowd.",
    body: [
      "Commercial work is judged twice: once by the people who commissioned it and every day afterwards by the people who use the room. It has to hold up to traffic, to cleaning and to being looked at a thousand times, and it has to still be doing its job in ten years.",
      "The studio has made work for the Cottesloe Hotel and the Duxton Hotel, for Lalla Rookh, for a Mirvac lobby in Melbourne, for Frasers in Kings Park, and across the Homebase Design Centre precinct in Subiaco — where the landscape, the entrance signage, the totems, the feature sculptures and the fire pit were all drawn and built as one commission.",
      "Materials are Corten steel and powdercoated aluminium. Work is made to the opening, to the drawings and to the program, and installed by the studio that built it.",
    ],
    sectors: ["Hotels", "Restaurants & bars", "Retail", "Property developments", "Corporate", "Display homes"],
    works: [
      { img: "/images/uploads/1789196612222_pzttgx.jpg", name: "LUMIER dividers", where: "Mirvac, Melbourne" },
      { img: "/images/hero/hero-cottesloe-gate.jpg", name: "ERGO gate", where: "Cottesloe Hotel, WA" },
      { img: "/images/hero/hero-cottesloe-patio.jpg", name: "ERGO patio screens", where: "Cottesloe Hotel, WA" },
      { img: "/images/hero/hero-homebase-entrance.jpg", name: "Entrance feature", where: "Homebase Design Centre, Subiaco WA" },
      { img: "/images/uploads/1787118567628_awv18c.jpg", name: "Screens, in situ", where: "Perth, WA" },
      { img: "/images/hero/hero-homebase-dusk.jpg", name: "Precinct landscape & art", where: "Homebase Design Centre, Subiaco WA" },
    ],
    also: [["Architectural art", "/architectural-art"], ["Public art commissions", "/public-art"], ["Screens", "/screens"]],
  },
];


const page = (p) => {
  const url = `${SITE}/${p.slug}`;
  const others = PAGES.filter((o) => o.slug !== p.slug);
  return `<!doctype html>
<html lang="en-AU" style="background:#020202"><head>
<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.desc)}" />
<meta name="robots" content="${PREVIEW ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1"}" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="website" />
<meta property="og:title" content="${esc(p.title)}" />
<meta property="og:description" content="${esc(p.desc)}" />
<meta property="og:url" content="${url}" />
<meta property="og:site_name" content="ROGETjames" />
<meta property="og:locale" content="en_AU" />
<meta property="og:image" content="${SITE}${p.works[0].img}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="${SITE}${p.works[0].img}" />
<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400&family=DM+Sans:wght@300;400&family=Plus+Jakarta+Sans:wght@400;700;800&family=Playfair+Display:ital@1&display=swap" rel="stylesheet" />
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: p.heading, item: url },
    ]},
    { "@type": "Service",
      name: p.heading,
      serviceType: p.heading,
      description: p.desc,
      url,
      provider: { "@type": "Organization", name: "ROGETjames", url: SITE, foundingDate: "2008",
        founder: { "@type": "Person", name: "James Roget" } },
      areaServed: { "@type": "Country", name: "Australia" },
      audience: { "@type": "Audience", audienceType: p.sectors.join(", ") },
    },
  ],
}, null, 2)}
</script>
<style>
:root{--matt:#020202;--pewter:#181818;--cream:#EDE8DF;--dim:rgba(237,232,223,.68);
--faint:rgba(237,232,223,.42);--clay-lit:#D4A75C;--rule:rgba(237,232,223,.10);
--jost:"Jost",sans-serif;--body:"DM Sans",sans-serif;--heading:"Plus Jakarta Sans",sans-serif;
--drama:"Playfair Display",Georgia,serif}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--matt);color:var(--cream);font-family:var(--body);font-weight:300;line-height:1.65}
img{display:block;max-width:100%}a{color:inherit;text-decoration:none}
.wrap{max-width:1200px;margin:0 auto;padding:0 24px}
@media(min-width:820px){.wrap{padding:0 48px}}
header{border-bottom:1px solid var(--rule)}
.hdr{display:flex;align-items:center;justify-content:space-between;height:74px;gap:18px}
.mark{font-family:var(--heading);font-weight:700;font-size:19px;white-space:nowrap}
.mark i{font-family:var(--drama);font-style:italic;font-weight:400}
nav{display:flex;gap:22px;font-family:var(--jost);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--dim);flex-wrap:wrap;justify-content:flex-end}
nav a:hover{color:var(--cream)}
.intro{padding:34px 0 36px;border-bottom:1px solid var(--rule)}
.kicker{font-family:var(--jost);font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--clay-lit)}
h1{font-family:var(--heading);font-weight:800;font-size:clamp(30px,4.6vw,50px);letter-spacing:-.02em;line-height:1.04;margin-top:12px}
.lede{color:var(--cream);font-size:clamp(17px,2vw,20px);margin-top:18px;max-width:46ch;font-weight:300}
.body{color:var(--dim);font-size:16px;line-height:1.78;margin-top:22px;max-width:64ch}
.body p+p{margin-top:15px}
.sectors{display:flex;flex-wrap:wrap;gap:8px;margin-top:26px}
.sectors span{font-family:var(--jost);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);border:1px solid var(--rule);border-radius:30px;padding:7px 14px}
h2{font-family:var(--heading);font-weight:700;font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:var(--faint);padding-top:40px}
.grid{display:grid;gap:16px;grid-template-columns:repeat(2,1fr);padding:20px 0 10px}
@media(min-width:760px){.grid{grid-template-columns:repeat(3,1fr)}}
.card .im{background:var(--pewter);border-radius:12px;overflow:hidden;aspect-ratio:4/3}
.card img{width:100%;height:100%;object-fit:cover;transition:transform .7s ease}
.card:hover img{transform:scale(1.04)}
.card b{display:block;font-family:var(--heading);font-weight:700;font-size:14px;margin-top:11px;letter-spacing:-.01em}
.card span{display:block;font-family:var(--jost);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint);margin-top:4px}
.cta{border-top:1px solid var(--rule);margin-top:44px;padding:44px 0 10px;text-align:center}
.cta p{font-family:var(--heading);font-weight:700;font-size:clamp(19px,2.6vw,27px);letter-spacing:-.015em}
.cta a.btn{display:inline-block;margin-top:22px;font-family:var(--jost);font-size:12px;letter-spacing:.22em;text-transform:uppercase;border:1px solid var(--clay-lit);color:var(--clay-lit);border-radius:30px;padding:13px 28px}
.cta a.btn:hover{background:var(--clay-lit);color:var(--matt)}
.also{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;padding:34px 0 0}
.also a{font-family:var(--jost);font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);border:1px solid var(--rule);border-radius:30px;padding:8px 16px}
.also a:hover{color:var(--cream);border-color:var(--clay-lit)}
footer{border-top:1px solid var(--rule);margin-top:44px;padding:28px 0 60px;font-family:var(--jost);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint);display:flex;gap:18px;flex-wrap:wrap;justify-content:space-between}
${PREVIEW ? ".pv{background:#D4A75C;color:#020202;font-family:var(--jost);font-size:11px;letter-spacing:.2em;text-transform:uppercase;text-align:center;padding:7px}" : ""}
</style></head><body>
${PREVIEW ? '<div class="pv">Preview — hidden from Google until James says go</div>' : ""}
<header><div class="wrap hdr">
  <a class="mark" href="/">ROGET<i>james</i></a>
  <nav>
    <a href="/wall-art">Wall Art</a><a href="/sculpture">Sculpture</a><a href="/screens">Screens</a>
    <a href="/architectural-art">Architectural Art</a><a href="/public-art">Public Art</a>
    <a href="/#contact">Contact</a>
  </nav>
</div></header>

<section class="wrap intro">
  <p class="kicker">${esc(p.kicker)}</p>
  <h1>${esc(p.heading)}</h1>
  <p class="lede">${esc(p.lede)}</p>
  <div class="body">${p.body.map((t) => `<p>${esc(t)}</p>`).join("\n    ")}</div>
  <div class="sectors">${p.sectors.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
</section>

<section class="wrap">
  <h2>Selected work</h2>
  <div class="grid">
    ${p.works.map((w) => `<div class="card">
      <div class="im"><img src="${img(w.img, 760)}" alt="${esc(`${w.name} — ${w.where}, laser cut metal by ROGETjames`)}" loading="lazy" decoding="async" width="760" height="570" /></div>
      <b>${esc(w.name)}</b><span>${esc(w.where)}</span>
    </div>`).join("\n    ")}
  </div>

  <div class="cta">
    <p>Working on a project that needs an artist?</p>
    <a class="btn" href="/#contact">Start a conversation</a>
    <div class="also">${p.also.map(([label, href]) => `<a href="${href}">${esc(label)}</a>`).join("")}</div>
  </div>
</section>

<footer class="wrap">
  <span>ROGETjames — laser cut metal art, Australia</span>
  <span>${others.map((o) => `<a href="/${o.slug}">${esc(o.heading)}</a>`).join(" &middot; ")}</span>
</footer>
</body></html>`;
};


for (const p of PAGES) {
  writeFileSync(join(DIST, `${p.slug}.html`), page(p), "utf-8");
}

// ── sitemap, only once they are live ──────────────────────────────────────
if (!PREVIEW) {
  const sitemapPath = join(DIST, "sitemap.xml");
  if (existsSync(sitemapPath)) {
    const today = new Date().toISOString().slice(0, 10);
    const xml = readFileSync(sitemapPath, "utf-8");
    const additions = PAGES
      .map((p) => `  <url>\n    <loc>${SITE}/${p.slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n  </url>`)
      .join("\n");
    writeFileSync(sitemapPath, xml.replace("</urlset>", `${additions}\n</urlset>`), "utf-8");
  }
}

console.log(`  ✓ ${PAGES.length} practice pages${PREVIEW ? " (preview — no-index, not in sitemap)" : " (live)"}`);
for (const p of PAGES) console.log(`      /${p.slug}`);
