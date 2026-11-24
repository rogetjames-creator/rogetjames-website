// Last step on the list handed to Google and Bing (dist/sitemap.xml), run once
// every page has been written and pre-rendered.
//
// 1. PHOTOS — each page lists photos it actually shows, at the very address it
//    shows them. A photo is listed once, under the page that shows it largest. Before
//    this, only 7 pages listed photos and some listed photos they never showed;
//    the 117 piece and screen pages listed none.
//
// 2. DATES — <lastmod> is the day a page's content last changed, not the day
//    of the build. Every page used to claim it had changed on every deploy, so
//    Google ignored the dates and Bing could not tell what was new. Each page is
//    compared with the live one; if the words and photos are the same, the live
//    date is kept. If the live site can't be reached, the live dates are kept
//    where known, and only pages with no known date get today's date.

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createHash } from "crypto";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const SITE = "https://rogetjames.com";
const TODAY = new Date().toISOString().slice(0, 10);

const sitemapPath = join(DIST, "sitemap.xml");
if (!existsSync(sitemapPath)) { console.log("finalize-sitemap: no sitemap — skipped"); process.exit(0); }

const xmlEsc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const unEsc = (s) => String(s).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

// Words-and-photos fingerprint, ignoring what changes on every build
// (scripts, inlined styles, hashed /assets/ names). Same idea as the IndexNow
// hook in netlify/functions/deploy-succeeded.mjs.
function fingerprint(html) {
  const body = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<link\b[^>]*>/gi, "")
    .replace(/<meta name="robots"[^>]*>/gi, "")
    .replace(/\/assets\/[^"'\s)]+/g, "")
    .replace(/\s+/g, " ");
  return createHash("sha1").update(body).digest("hex");
}

// The source photo behind any address a page uses.
function sourceOf(src) {
  src = unEsc(src);
  let m = src.match(/^\/img\/w(\d+)(\/.+)$/);
  if (m) return { path: "/images" + m[2].split("?")[0], w: +m[1] };
  if (src.startsWith("/.netlify/images")) {
    try {
      const q = new URLSearchParams(src.split("?")[1] || "");
      const p = decodeURIComponent(q.get("url") || "");
      if (p.startsWith("/images/")) return { path: p, w: +(q.get("w") || 0) };
    } catch { /* ignore */ }
    return null;
  }
  if (src.startsWith("/images/")) return { path: src.split("?")[0], w: 99999 };
  return null;
}

// Photos a page shows: one entry per source photo, at its largest size on the page.
function photosOn(html) {
  const best = new Map();
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    const src = (tag.match(/\ssrc="([^"]+)"/i) || [])[1];
    if (!src) continue;
    const s = sourceOf(src);
    // A full-size file shown small (e.g. a 300px range thumbnail) counts at its shown size.
    const shown = +((tag.match(/\swidth="(\d+)"/i) || [])[1] || 0);
    if (s && s.w === 99999 && shown) s.w = shown;
    if (!s || /roj-logo|\/favicon|\/icons?\/|\/fixings\//i.test(s.path)) continue;
    const alt = unEsc((tag.match(/\salt="([^"]*)"/i) || [])[1] || "");
    const prev = best.get(s.path);
    if (!prev || s.w > prev.w) best.set(s.path, { path: s.path, w: s.w, src: unEsc(src), alt: alt || prev?.alt || "" });
  }
  return [...best.values()].slice(0, 1000);
}

function fileFor(loc) {
  let p = loc.replace(SITE, "").replace(/\/$/, "") || "/index";
  const cands = [join(DIST, p + ".html"), join(DIST, p, "index.html")];
  return cands.find((f) => existsSync(f));
}

async function fetchText(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 10000);
  try {
    const r = await fetch(url, { signal: ctrl.signal, headers: { "User-Agent": "rogetjames-build-sitemap" } });
    return r.ok ? await r.text() : null;
  } catch { return null; } finally { clearTimeout(t); }
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length); let i = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (i < items.length) { const n = i++; out[n] = await fn(items[n]); }
  }));
  return out;
}

const xml = readFileSync(sitemapPath, "utf-8");
const blocks = [...xml.matchAll(/<url>[\s\S]*?<\/url>/g)].map((m) => m[0]);
const locs = blocks.map((b) => (b.match(/<loc>\s*([^<\s]+)\s*<\/loc>/) || [])[1]);

// Live dates, and live pages to compare against.
const liveXml = await fetchText(`${SITE}/sitemap.xml`);
const liveDate = new Map();
if (liveXml) {
  for (const b of liveXml.matchAll(/<url>[\s\S]*?<\/url>/g)) {
    const loc = (b[0].match(/<loc>\s*([^<\s]+)\s*<\/loc>/) || [])[1];
    const lm = (b[0].match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1];
    if (loc && lm) liveDate.set(loc, lm.trim());
  }
}
const livePrints = liveXml
  ? await mapLimit(locs, 10, async (loc) => { const h = await fetchText(loc); return h ? fingerprint(h) : null; })
  : locs.map(() => null);

// Each photo is filed under ONE page: the page that shows it largest (its own
// piece or design page), not every gallery that carries a thumbnail of it.
const htmlOf = locs.map((loc) => { const f = loc && fileFor(loc); return f ? readFileSync(f, "utf-8") : null; });
const photosOf = htmlOf.map((h) => (h ? photosOn(h) : []));
const home = new Map();
photosOf.forEach((list, n) => list.forEach((p) => {
  const cur = home.get(p.path);
  if (!cur || p.w > cur.w) home.set(p.path, { n, w: p.w });
}));

let photoCount = 0, kept = 0, changed = 0;
const out = blocks.map((block, n) => {
  const loc = locs[n];
  const html = htmlOf[n];
  if (!html) return block;

  // date
  const known = liveDate.get(loc);
  let date;
  if (known && livePrints[n] && livePrints[n] === fingerprint(html)) { date = known; kept++; }
  else if (known && !livePrints[n]) { date = known; kept++; } // live page unreachable: don't invent a change
  else { date = TODAY; changed++; }

  // photos
  const photos = photosOf[n].filter((p) => home.get(p.path)?.n === n);
  photoCount += photos.length;
  const imgXml = photos.map((p) =>
    `    <image:image>\n      <image:loc>${xmlEsc(SITE + p.src)}</image:loc>\n    </image:image>`).join("\n");

  let b = block.replace(/\s*<image:image>[\s\S]*?<\/image:image>/g, "");
  b = /<lastmod>/.test(b)
    ? b.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${date}</lastmod>`)
    : b.replace(/(<\/loc>)/, `$1\n    <lastmod>${date}</lastmod>`);
  if (imgXml) b = b.replace(/\n?\s*<\/url>$/, `\n${imgXml}\n  </url>`);
  return b;
});

let result = xml;
blocks.forEach((b, n) => { result = result.replace(b, () => out[n]); });
if (!/xmlns:image=/.test(result)) {
  result = result.replace("<urlset ", '<urlset xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" ');
}
writeFileSync(sitemapPath, result, "utf-8");
console.log(`  ✓ sitemap: ${blocks.length} pages, ${photoCount} photos listed; dates kept ${kept}, changed today ${changed}${liveXml ? "" : " (live site unreachable)"}`);
