// Writes a page of its own for every screen design.
//
//   dist/screens/<design>.html   e.g. /screens/uro, /screens/wattle
//
// Until now a screen design existed only inside the /screens gallery: clicking
// URO opened a viewer, but the address stayed /screens, so Google saw one page
// with fifty names on it and nothing to show for "wattle laser cut screen".
// Wall art designs have had pages of their own since Sep 2026; screens were
// left out. Each page here carries only what already exists — the design's
// name, every photograph of it, James's approved photo descriptions and the
// uses it is tagged for. No new wording is written for any design.
//
// Data: src/data/screenDesigns.js plus every Screens upload in
// public/media-manifest.json (the same two sources the /screens gallery reads).

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { confirmedPhotoDescription, isScreenPhotoAllowed } from "../src/data/confirmedPhotoDescriptions.js";
import { SCREEN_DESIGNS } from "../src/data/screenDesigns.js";
import { SCREEN_APPLICATIONS, applicationKey } from "../src/mediaDestinations.js";
import { MEDIA_SUPPRESS } from "../src/utils/mediaUploads.js";

const PREVIEW = false;

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const SITE = "https://rogetjames.com";

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
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
  // LOCAL_IMAGES=1 for a local look: there is no Netlify image service off the live site.
  return PREVIEW || process.env.LOCAL_IMAGES ? p : `/.netlify/images?url=${encodeURIComponent(p)}&w=${w}&fm=webp&q=82`;
};
const norm = (s) => String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
const slugOf = (s) => String(s || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const title = (s) => String(s || "").toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());

// Section keys an upload can carry, and their names (as the gallery shows them).
const SECTION_LABELS = {
  icons: "The Icons", architectural: "The Architectural", organics: "The Organics",
  classics: "The Classics", indies: "The Indies", "light-features": "The Light Features",
  mirrors: "The Mirrors", custom: "Custom",
};
const APP_KEYS = new Set(SCREEN_APPLICATIONS.map((a) => applicationKey(a.id)));
const isScreenUpload = (d) => d.includes("screens") ||
  d.some((x) => (SECTION_LABELS[x] && x !== "classics") || APP_KEYS.has(x));

// ── Every design, with its photographs ─────────────────────────────────────
const designs = new Map(); // norm(name) → { name, section, photos:[{src,tags,apps}] }
let section = "The Icons";
for (const d of SCREEN_DESIGNS) {
  if (d.sectionStart) section = title(d.sectionStart);
  const key = norm(d.name);
  const entry = designs.get(key) || { name: d.name, section, photos: [] };
  for (const it of d.items || []) {
    for (const src of (it.slides && it.slides.length ? it.slides : [it.img])) {
      if (src && isScreenPhotoAllowed(src)) entry.photos.push({ src, tags: (it.tags || []).map((t) => String(t).toLowerCase()), apps: [] });
    }
  }
  designs.set(key, entry);
}

let uploads = [];
try {
  const m = JSON.parse(readFileSync(join(ROOT, "public", "media-manifest.json"), "utf-8"));
  uploads = Array.isArray(m) ? m : [];
} catch { uploads = []; }
for (const u of uploads) {
  const dests = u.destinations || [];
  const src = "/" + u.path;
  if (!isScreenUpload(dests) || !isScreenPhotoAllowed(src)) continue;
  if (MEDIA_SUPPRESS.some((id) => src.includes(id))) continue;
  const raw = String(u.name || "").replace(/\.(jpe?g|png|webp|gif)$/i, "").trim();
  if (!/[A-Za-z]/.test(raw)) continue;
  // "URO — Privacy, Sydney" or "ERGO - divider …" belong to URO / ERGO.
  const lead = raw.split(/\s+[—–-]\s+/)[0];
  const key = designs.has(norm(raw)) ? norm(raw) : designs.has(norm(lead)) ? norm(lead) : norm(raw);
  const secKey = dests.find((x) => SECTION_LABELS[x] && x !== "light-features");
  const entry = designs.get(key) || { name: raw, section: secKey ? SECTION_LABELS[secKey] : "Custom", photos: [] };
  if (!entry.photos.some((p) => p.src === src)) {
    entry.photos.push({
      src, tags: dests.includes("light-features") ? ["light features"] : [],
      apps: dests.filter((x) => APP_KEYS.has(x)).map((x) => x.slice("application-".length)),
    });
  }
  designs.set(key, entry);
}

// What the design is, for the title. "Laser cut" describes screens only —
// never mirrors or light features (James, 21 Nov 2026).
// A design whose only described job is not metal is not called metal.
const KIND_OVERRIDE = { SABU: "Laser Cut Screen" }; // SABU, Noosa: laminated MDF
function kindOf(d) {
  if (KIND_OVERRIDE[norm(d.name)]) return KIND_OVERRIDE[norm(d.name)];
  const anyLight = d.photos.some((p) => p.tags.some((t) => /light feature/.test(t)));
  if (d.section === "The Mirrors") return anyLight ? "Metal Light Feature" : "Metal Mirror";
  return "Laser Cut Metal Screen";
}
function usesOf(d) {
  const ids = new Set();
  for (const p of d.photos) {
    p.apps.forEach((a) => ids.add(a));
    for (const app of SCREEN_APPLICATIONS) if (p.tags.some((t) => app.tags.includes(t))) ids.add(app.id);
  }
  return SCREEN_APPLICATIONS.filter((a) => ids.has(a.id));
}

// The headline job for each design, taken only from James's approved photo
// descriptions (or his own description in screenDesigns.js). It goes in the
// title Google prints. Named projects first; where a design has none, an
// interstate job, since the business serves Australia-wide.
const HEADLINE = {
  ERGO: "Cottesloe Hotel",
  HEXO: "Lalla Rookh",
  ZARATHSTRA: "Helvetica Bar",
  AYYAD: "Ventura Homes",
  DOTTI: "Country Builders",
  LUCARIO: "Principal Landscapes",
  WATTLE: "Frasers, Kings Park",
  VUELTA: "Aquila Homes",
  URO: "North Sydney",
  SABU: "Noosa",
};

const list = [...designs.values()].filter((d) => d.photos.length);
const built = [];
mkdirSync(join(DIST, "screens"), { recursive: true });
const appIds = new Set(SCREEN_APPLICATIONS.map((a) => a.id));

for (const d of list) {
  const slug = slugOf(d.name);
  if (!slug || appIds.has(slug)) continue; // never overwrite an application page
  const url = `${SITE}/screens/${slug}`;
  const kind = kindOf(d);
  const uses = usesOf(d);
  const described = d.photos.map((p) => confirmedPhotoDescription(p.src)).filter(Boolean);
  // One photograph and no approved description is too thin to show Google
  // (CLAUDE.md: never publish thin pages). It is built, but kept out of Google
  // and the sitemap until it has more.
  const thin = d.photos.length < 2 && !described.length;
  const indexable = !PREVIEW && !thin;
  const job = HEADLINE[norm(d.name)] || "";
  const pageTitle = `${d.name} ${kind}${job ? ` — ${job}` : ""} | ROGETjames`;
  const lead = (job && described.find((t) => t.toLowerCase().includes(job.toLowerCase().split(/[ ,]+/)[0]))) || described[0];
  const desc = described.length
    ? `${lead.replace(/\.?\s*$/, ".")}${uses.length ? ` Used for ${uses.map((a) => a.label.toLowerCase()).join(", ")}.` : ""} Made to order in Australia.`
    : `${d.name} — ${kind.toLowerCase()} design by ROGETjames, from ${d.section}${uses.length ? `, used for ${uses.map((a) => a.label.toLowerCase()).join(", ")}` : ""}. Made to order in Australia.`;
  const others = list.filter((o) => o !== d && o.section === d.section && slugOf(o.name) && !appIds.has(slugOf(o.name)));

  const html = `<!doctype html>
<html lang="en" style="background:#020202"><head>
<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(pageTitle)}</title>
<meta name="description" content="${esc(desc)}" />
<meta name="robots" content="${indexable ? "index, follow" : "noindex, follow"}" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="ROGETjames" />
<meta property="og:title" content="${esc(pageTitle)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${SITE}${realPath(d.photos[0].src)}" />
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
      { "@type": "ListItem", position: 3, name: d.name, item: url },
    ]},
    { "@type": "VisualArtwork", "@id": url, name: d.name, url, description: desc,
      artform: kind.replace(/^Laser Cut /, ""),
      creator: { "@type": "Organization", name: "ROGETjames", url: SITE },
      image: d.photos.map((p) => `${SITE}${realPath(p.src)}`) },
  ],
}, null, 2)}
</script>
<style>
:root{--matt:#020202;--pewter:#181818;--cream:#EDE8DF;--dim:rgba(237,232,223,.78);
--faint:rgba(237,232,223,.75);--clay:#9E7134;--clay-lit:#D4A75C;--rule:rgba(237,232,223,.10);
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
nav{display:flex;gap:26px;font-family:var(--jost);font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:var(--dim);flex-wrap:wrap}
nav a:hover{color:var(--cream)}
.crumbs{display:flex;gap:9px;align-items:center;flex-wrap:wrap;padding:18px 0;font-family:var(--jost);font-size:13px;color:var(--dim)}
.crumbs a:hover{color:var(--cream)}
.intro{padding:26px 0 30px;border-bottom:1px solid var(--rule)}
.kicker{font-family:var(--jost);font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:var(--clay-lit)}
h1{font-family:var(--heading);font-weight:800;font-size:clamp(30px,4.4vw,48px);letter-spacing:-.02em;line-height:1.05;margin-top:10px}
.sub{font-family:var(--jost);font-size:14px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);margin-top:12px}
.uses{display:flex;flex-wrap:wrap;gap:9px;margin-top:18px}
.chip{font-size:13px;color:var(--dim);border:1px solid var(--rule);border-radius:30px;padding:9px 16px;transition:.2s}
.chip:hover{border-color:var(--clay-lit);color:var(--cream);background:rgba(158,113,52,.14)}
.photos{display:grid;gap:22px;grid-template-columns:1fr;padding:34px 0 10px}
@media(min-width:760px){.photos{grid-template-columns:repeat(2,1fr)}}
figure .im{background:var(--pewter);border-radius:12px;overflow:hidden}
figure img{width:100%;height:auto}
figcaption{font-size:14px;color:var(--dim);margin-top:10px;line-height:1.55}
.also{border-top:1px solid var(--rule);margin-top:36px;padding:30px 0 10px}
.lab{font-family:var(--jost);font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:var(--dim)}
.chips{display:flex;flex-wrap:wrap;gap:9px;margin-top:14px}
.cta{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;margin:34px 0 0}
.btn{display:inline-block;border:1px solid rgba(158,113,52,.75);color:var(--clay-lit);padding:9px 20px;border-radius:999px;
font-family:var(--jost);font-size:13px;letter-spacing:.16em;text-transform:uppercase}
.btn:hover{background:rgba(158,113,52,.22)}
footer{padding:56px 0 70px;color:var(--faint);font-family:var(--jost);font-size:13px;letter-spacing:.14em;text-transform:uppercase}
</style><script src="/pin-track.js" defer></script></head><body>
<header><div class="wrap hdr">
  <a class="mark" href="/">ROGET<i>james</i></a>
  <nav><a href="/wall-art">Wall Art</a><a href="/sculpture">Sculpture</a><a href="/screens">Screens</a><a href="/#contact">Contact</a></nav>
</div></header>
<div class="wrap">
  <div class="crumbs"><a href="/">Home</a><span>&rsaquo;</span><a href="/screens">Screens</a><span>&rsaquo;</span><span>${esc(d.name)}</span></div>
  <div class="intro">
    <span class="kicker">Screens &middot; ${esc(d.section)}</span>
    <h1>${esc(d.name)}</h1>
    <p class="sub">${esc(kind)} &middot; ${d.photos.length} photograph${d.photos.length === 1 ? "" : "s"}</p>
    ${uses.length ? `<div class="uses">${uses.map((a) => `<a class="chip" href="/screens/${a.id}">${esc(a.label)}</a>`).join("")}</div>` : ""}
  </div>
  <div class="photos">
    ${d.photos.map((p) => {
      const cap = confirmedPhotoDescription(p.src);
      const alt = cap || `${d.name} — ${kind.toLowerCase()} by ROGETjames`;
      return `<figure><div class="im"><img src="${img(p.src, 1000)}" alt="${esc(alt)}" loading="lazy" /></div>${cap ? `<figcaption>${esc(cap)}</figcaption>` : ""}</figure>`;
    }).join("\n    ")}
  </div>
  ${others.length ? `<div class="also">
    <div class="lab">More from ${esc(d.section)}</div>
    <div class="chips">${others.map((o) => `<a class="chip" href="/screens/${slugOf(o.name)}">${esc(o.name)}</a>`).join("")}</div>
  </div>` : ""}
  <div class="cta"><a class="btn" href="/screens#${slug}">View in the Screens gallery</a><a class="btn" href="/#contact">Enquire</a></div>
</div>
<footer><div class="wrap"><a href="/screens">&larr; Return to Screens</a></div></footer>
</body></html>`;

  writeFileSync(join(DIST, "screens", `${slug}.html`), html, "utf-8");
  built.push({ url: `/screens/${slug}`, name: d.name, n: d.photos.length, cap: described.length, uses: uses.length, kind, indexable });
}

if (!PREVIEW && built.length) {
  const sitemapPath = join(DIST, "sitemap.xml");
  if (existsSync(sitemapPath)) {
    const today = new Date().toISOString().slice(0, 10);
    const xml = readFileSync(sitemapPath, "utf-8");
    const add = built.filter((b) => b.indexable).map((b) => `  <url>\n    <loc>${SITE}${b.url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`).join("\n");
    writeFileSync(sitemapPath, xml.replace("</urlset>", `${add}\n</urlset>`), "utf-8");
  }
}

console.log(`  ✓ ${built.length} screen design pages${PREVIEW ? " (preview — no-index, not in sitemap)" : " (live)"}`);
built.forEach((b) => console.log(`      ${b.url.padEnd(32)} ${String(b.n).padStart(2)} photos · ${b.cap} described · ${b.uses} uses · ${b.kind}${b.indexable ? "" : " · HIDDEN (thin)"}`));
