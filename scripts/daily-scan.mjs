// Daily scan of the LIVE site — rogetjames.com.
//
// James was finding a new fault most days: the same photo twice in a gallery,
// a picture that would not load, a page that broke. This walks the live site
// the way a visitor does and lists what is wrong, so he is not the one who
// finds it.
//
//   node scripts/daily-scan.mjs                 scan https://rogetjames.com
//   node scripts/daily-scan.mjs --base=URL      scan another address (e.g. a preview)
//   node scripts/daily-scan.mjs --quick         galleries only, skip the link sweep
//
// Writes reports/daily-scan/latest.md and latest.json. Exit code 1 if anything
// serious was found, so a scheduled run can tell at a glance.
//
// Things James has looked at and is happy with go in
// scripts/daily-scan-ignore.json ({ "ignore": ["text that appears in the finding", …] })
// so they stop being reported.

import { mkdirSync, writeFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (k) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || "").split("=").slice(1).join("=");
const BASE = (arg("base") || "https://rogetjames.com").replace(/\/$/, "");
const QUICK = process.argv.includes("--quick");

// Playwright from the project if installed, otherwise the copy on the machine.
function loadPlaywright() {
  for (const from of [join(ROOT, "package.json"), "/opt/node22/lib/node_modules/", "/usr/lib/node_modules/", "/usr/local/lib/node_modules/"]) {
    try { return createRequire(from)("playwright"); } catch { /* try next */ }
  }
  throw new Error("Playwright not found");
}
const { chromium } = loadPlaywright();

const IGNORE = (() => {
  const f = join(ROOT, "scripts", "daily-scan-ignore.json");
  try { return existsSync(f) ? JSON.parse(readFileSync(f, "utf-8")).ignore || [] : []; } catch { return []; }
})();

// ── Findings ────────────────────────────────────────────────────────────────
const findings = [];
const seen = new Set();
function report(level, where, what, detail = "") {
  const line = `${where} — ${what}${detail ? ` — ${detail}` : ""}`;
  if (IGNORE.some((s) => line.includes(s))) return;
  if (seen.has(line)) return;
  seen.add(line);
  findings.push({ level, where, what, detail });
}

// The real file behind a Netlify Image CDN address, so the same photo at
// different sizes counts as one photo.
function realSrc(u) {
  if (!u) return "";
  try {
    const url = new URL(u, BASE);
    if (url.pathname.startsWith("/.netlify/images")) return decodeURIComponent(url.searchParams.get("url") || "");
    if (url.pathname === "/api/media-img") return `/api/media-img?id=${url.searchParams.get("id")}`;
    if (url.origin === new URL(BASE).origin) return url.pathname;
    return url.href;
  } catch { return u; }
}
const short = (s) => s.replace(/^\/images\//, "").slice(0, 90);

// Captions/alt text that are really phone filenames.
const PHONE_NAME = /^(IMG|DSC|PXL|MVIMG|Screenshot)[_ -]?\d|^[0-9A-F]{8}-[0-9A-F]{4}-|^\d{1,4}$|_1_\d{3}_a$|\.(jpe?g|png|heic|webp)$/i;
// Any price showing before the postcode step.
const PRICE = /(?:A?\$|AUD\s?)\s?\d[\d,]{2,}/;

// ── Browser helpers ─────────────────────────────────────────────────────────
function watch(page, where) {
  page.on("pageerror", (e) => report("serious", where, "Page script crashed", e.message.split("\n")[0].slice(0, 160)));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (/favicon|Failed to load resource/i.test(t)) return; // counted under failed requests instead
    report("minor", where, "Error message in the browser", t.slice(0, 160));
  });
  page.on("response", (r) => {
    const s = r.status();
    if (s < 400) return;
    const u = r.url();
    if (!u.startsWith(BASE)) return;
    const path = u.slice(BASE.length);
    if (/\/api\/(track-event|chat)/.test(path)) return;
    report(s >= 500 ? "serious" : "serious", where, `Missing file or broken address (${s})`, short(realSrc(u) || path));
  });
}

async function scrollAll(page) {
  let last = -1;
  for (let i = 0; i < 120; i++) {
    const h = await page.evaluate(() => { window.scrollBy(0, window.innerHeight * 0.9); return [window.scrollY, document.body.scrollHeight]; });
    if (h[0] === last) break;
    last = h[0];
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(1500);
}

// Fingerprint of what a picture looks like (16-bit-ish difference hash),
// taken in the page so a re-uploaded copy of the same photo is caught even
// though it has a different file name.
const FINGERPRINT = `async (srcs) => {
  const c = document.createElement('canvas'); c.width = 16; c.height = 16;
  const x = c.getContext('2d', { willReadFrequently: true });
  const out = {};
  await Promise.all(srcs.map(src => new Promise(res => {
    const im = new Image(); im.crossOrigin = 'anonymous';
    im.onload = () => {
      try {
        if (im.naturalWidth < 120) return res();       // logos and icons
        x.clearRect(0, 0, 16, 16); x.drawImage(im, 0, 0, 16, 16);
        const d = x.getImageData(0, 0, 16, 16).data, g = [];
        for (let i = 0; i < d.length; i += 4) g.push(Math.round((d[i]*3 + d[i+1]*6 + d[i+2]) / 10));
        out[src] = { g, r: +(im.naturalWidth / im.naturalHeight).toFixed(2) };
      } catch { /* skip */ }
      res();
    };
    im.onerror = () => res();
    im.src = src;
  })));
  return out;
}`;
// Two pictures are the same photo when their shapes match and their tiny
// greyscale versions are nearly identical, pixel for pixel.
function samePhoto(a, b) {
  if (Math.abs(a.r - b.r) > 0.04) return false;
  let diff = 0;
  for (let i = 0; i < a.g.length; i++) diff += Math.abs(a.g[i] - b.g[i]);
  const mean = a.g.reduce((s, v) => s + v, 0) / a.g.length;
  const spread = a.g.reduce((s, v) => s + Math.abs(v - mean), 0) / a.g.length;
  return spread > 8 && diff / a.g.length < 9;
}

// Look for repeats in one gallery: same file twice, or two files that are the
// same photo.
async function duplicates(page, where, groups) {
  // groups: [{ name, items: [{ src, alt }] }]
  const all = [];
  for (const g of groups) {
    const byFile = {};
    for (const it of g.items) (byFile[realSrc(it.src)] ||= []).push(it);
    for (const [file, list] of Object.entries(byFile)) {
      if (file && list.length > 1)
        report("serious", where, `Same photo appears ${list.length}× in “${g.name}”`, `${short(file)}${list[0].alt ? ` (“${list[0].alt}”)` : ""}`);
    }
    for (const file of Object.keys(byFile)) if (file) all.push({ group: g.name, file, src: byFile[file][0].src, alt: byFile[file][0].alt });
  }
  // Same-looking photos under different file names.
  const srcs = [...new Set(all.map((a) => a.src))];
  const fp = {};
  for (let i = 0; i < srcs.length; i += 40) Object.assign(fp, await page.evaluate(`(${FINGERPRINT})(${JSON.stringify(srcs.slice(i, i + 40))})`));
  const withFp = all.filter((a) => fp[a.src]);
  for (let i = 0; i < withFp.length; i++) for (let j = i + 1; j < withFp.length; j++) {
    const a = withFp[i], b = withFp[j];
    if (a.file === b.file || a.group !== b.group) continue;
    if (samePhoto(fp[a.src], fp[b.src]))
      report("serious", where, `Looks like the same photo twice in “${a.group}” under two file names`, `${short(a.file)} and ${short(b.file)}`);
  }
  return all;
}

async function checkImagesAndText(page, where, { pricesAllowed = false } = {}) {
  const r = await page.evaluate(() => {
    const broken = [...document.images]
      .filter((i) => i.currentSrc && i.complete && i.naturalWidth === 0 && i.getBoundingClientRect().width > 0)
      .map((i) => i.currentSrc);
    const alts = [...document.images].map((i) => i.alt || "").filter(Boolean);
    const caps = [...document.querySelectorAll("figcaption, .cap, .p-name, .t-name, .sh-name, [class*='caption']")].map((e) => e.textContent.trim()).filter(Boolean);
    const text = document.body.innerText;
    const overflow = document.documentElement.scrollWidth - window.innerWidth;
    return { broken, alts, caps, text, overflow };
  });
  for (const b of r.broken) report("serious", where, "Picture not loading", short(realSrc(b)));
  for (const n of new Set([...r.alts, ...r.caps])) if (PHONE_NAME.test(n.trim())) report("minor", where, "Caption is a phone file name", `“${n.trim().slice(0, 60)}”`);
  if (!pricesAllowed) {
    const m = r.text.match(PRICE);
    if (m) report("serious", where, "A price is visible without the postcode step", `“${m[0]}”`);
  }
  if (r.overflow > 4) report("minor", where, "Page is wider than the screen (sideways scroll)", `${r.overflow}px`);
}

// Fetch through the browser itself (it goes through whatever network the
// machine uses; Playwright's own request client does not).
async function get(page, url, { as = "status" } = {}) {
  try {
    return await page.evaluate(async ([u, as]) => {
      const r = await fetch(u, { redirect: "follow", cache: "no-store" });
      return { status: r.status, body: as === "json" ? await r.json().catch(() => undefined) : as === "text" ? await r.text() : null };
    }, [url, as]);
  } catch { return null; }
}
async function blankOn(browser) {
  const page = await browser.newPage();
  await page.goto(BASE + "/robots.txt").catch(() => {});
  return page;
}

async function open(page, url) {
  for (let i = 0; i < 2; i++) {
    try { return await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 }); }
    catch (e) { if (i === 1) throw e; }
  }
}

// ── The scan ────────────────────────────────────────────────────────────────
const stats = { pages: 0, galleries: {}, links: 0 };

async function scanRangePage(browser, path) {
  const where = path;
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  watch(page, where);
  const res = await open(page, BASE + path).catch((e) => { report("serious", where, "Page did not load", e.message.split("\n")[0].slice(0, 120)); });
  if (!res) return page.close();
  await page.waitForTimeout(3000);
  if (res.status() >= 400) report("serious", where, `Page returns ${res.status()}`);
  stats.pages++;
  await scrollAll(page);

  const groups = await page.evaluate(() =>
    [...document.querySelectorAll("section.poster")].map((sec) => ({
      name: sec.dataset.label || sec.querySelector(".p-name")?.textContent?.trim() || "?",
      app: !!sec.querySelector(".p-idx") && sec.querySelector(".p-idx").textContent.includes("Used for"),
      // Each piece has one thumbnail; the big stage image repeats one of them.
      items: [...sec.querySelectorAll("img")]
        .filter((i) => !i.closest(".stage"))
        .map((i) => ({ src: i.currentSrc || i.src, alt: i.alt || "" }))
        .filter((i) => i.src),
      count: parseInt((sec.querySelector(".p-count")?.textContent || "").replace(/\D/g, "") || "0", 10),
    })));
  if (!groups.length) report("serious", where, "Gallery shows no ranges at all");
  for (const g of groups) {
    if (!g.items.length) report("serious", where, `“${g.name}” shows no pictures`);
  }
  const all = await duplicates(page, where, groups);
  stats.galleries[path] = { ranges: groups.length, photos: all.length };

  // The intro strip at the top: a repeat there is visible straight away.
  const strip = await page.evaluate(() => [...document.querySelectorAll("#introStrip img")].map((i) => i.currentSrc || i.src));
  const files = strip.map(realSrc);
  // The strip repeats its run of photos to fill the screen and loop; look at
  // one run only.
  let period = files.length;
  for (let q = 1; q < files.length; q++) if (files.every((f, i) => f === files[i % q])) { period = q; break; }
  const half = files.slice(0, period);
  const cnt = {};
  for (const f of half) cnt[f] = (cnt[f] || 0) + 1;
  for (const [f, n] of Object.entries(cnt)) if (n > 1) report("minor", where, `Same photo ${n}× in the moving strip at the top`, short(f));

  await checkImagesAndText(page, where);

  // Open the first piece's detail and make sure it works.
  const detail = await page.$("section.poster .detail-btn");
  if (detail) {
    const href = await detail.getAttribute("href");
    if (href && href !== "#") {
      const r = await get(page, new URL(href, BASE + path).href);
      if (!r || r.status >= 400) report("serious", where, "Piece page link is broken", `${href} (${r ? r.status : "no reply"})`);
    } else {
      await detail.click().catch(() => {});
      await page.waitForTimeout(800);
      const open = await page.evaluate(() => getComputedStyle(document.getElementById("ov") || document.body).display !== "none" && !!document.getElementById("ovName")?.textContent?.trim());
      if (!open) report("serious", where, "Piece details panel does not open");
    }
  }

  // Collect every piece-page link for the link sweep.
  const links = await page.evaluate(() => [...document.querySelectorAll("a[href]")].map((a) => a.href));
  await page.close();
  return links;
}

async function scanHome(browser) {
  const where = "/ (home)";
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  watch(page, where);
  const res = await open(page, BASE + "/").catch((e) => { report("serious", where, "Page did not load", e.message.split("\n")[0].slice(0, 120)); });
  if (!res) return [];
  await page.waitForTimeout(3000);
  stats.pages++;
  await scrollAll(page);
  await checkImagesAndText(page, where);

  // Bespoke portals that open as popups on the home page.
  const missing = await page.evaluate((names) => {
    const t = document.querySelector("#bespoke")?.textContent || "";
    return names.filter((n) => !t.toLowerCase().includes(n.toLowerCase()));
  }, ["Sculpture", "Screens", "Displays", "Reels", "Concepts", "Projects"]);
  for (const n of missing) report("serious", where, `Bespoke portal “${n}” is missing`);

  const links = await page.evaluate(() => [...document.querySelectorAll("a[href]")].map((a) => a.href));
  await page.close();

  for (const which of ["displays", "reels", "concepts", "concrete"]) {
    const w = `Bespoke › ${which[0].toUpperCase() + which.slice(1)} popup`;
    const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    watch(p, w);
    await open(p, `${BASE}/?open=${which}`).catch(() => {});
    await p.waitForTimeout(5000);
    const items = await p.evaluate(() => {
      // The popup is the top-most fixed layer holding pictures.
      const layers = [...document.querySelectorAll("body *")].filter((e) => {
        const s = getComputedStyle(e);
        return s.position === "fixed" && e.querySelectorAll("img, video").length > 0 && e.getBoundingClientRect().width > window.innerWidth * 0.5;
      });
      const box = layers.sort((a, b) => b.querySelectorAll("img, video").length - a.querySelectorAll("img, video").length)[0];
      if (!box) return null;
      // Count each picture once per tile: the big picture (and its fading
      // copy) repeats one of the thumbnails, so leave anything large out
      // when there is a thumbnail row.
      const els = [...box.querySelectorAll("img, video")].filter((i) => { const r = i.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
      const small = els.filter((i) => i.getBoundingClientRect().width < window.innerWidth * 0.3);
      return (small.length > 1 ? small : els)
        .map((i) => ({ src: i.tagName === "VIDEO" ? (i.currentSrc || i.src || i.querySelector("source")?.src || i.poster || "") : (i.currentSrc || i.src), alt: i.alt || "", video: i.tagName === "VIDEO" }))
        .filter((i) => i.src);
    });
    if (items === null) {
      if (which !== "concrete") report("serious", w, "Popup did not open");
    } else {
      const filtered = items;
      await duplicates(p, w, [{ name: w.split("› ")[1].replace(" popup", ""), items: filtered.filter((i) => !i.video) }]);
      const vids = {};
      for (const v of filtered.filter((i) => i.video)) vids[realSrc(v.src)] = (vids[realSrc(v.src)] || 0) + 1;
      for (const [f, n] of Object.entries(vids)) if (n > 1) report("serious", w, `Same video appears ${n}×`, short(f));
      stats.galleries[w] = { photos: new Set(items.map((i) => realSrc(i.src))).size };
      await checkImagesAndText(p, w);
    }
    await p.close();
  }
  return links;
}

async function scanMobile(browser, path) {
  const where = `${path} (phone)`;
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  watch(page, where);
  await open(page, BASE + path).catch((e) => report("serious", where, "Page did not load", e.message.split("\n")[0].slice(0, 120)));
  await scrollAll(page);
  await checkImagesAndText(page, where);
  await ctx.close();
}

async function checkFunctions(browser) {
  const page = await blankOn(browser);
  const json = async (path) => {
    const r = await get(page, BASE + path, { as: "json" });
    if (!r || r.status >= 400) { report("serious", "Behind the scenes", `${path} is not answering`, r ? `status ${r.status}` : "no reply"); return null; }
    if (r.body === undefined) { report("serious", "Behind the scenes", `${path} returns something unreadable`); return null; }
    return r.body;
  };
  const list = await json("/api/media-list");
  await json("/api/up-close-list");
  const manifest = await json("/media-manifest.json");

  // A photo uploaded with no place chosen shows up nowhere — the usual way a
  // photo "vanishes".
  if (Array.isArray(manifest)) {
    for (const m of manifest) if (!(m.destinations || []).length && !(m.note || "").trim()) report("minor", "Uploads", "Photo uploaded but not placed in any gallery", `“${m.name || m.id}” (${m.id})`);
    const dest = manifest.flatMap((m) => (m.destinations || []).map((d) => [d, m]));
    stats.uploads = { files: manifest.length, placements: dest.length };
  }
  if (list && Array.isArray(list.images)) stats.liveUploads = list.images.length;

  // Every page Google is told about must open.
  const sm = await get(page, BASE + "/sitemap.xml", { as: "text" });
  const urls = sm?.body ? [...sm.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]) : [];
  if (!urls.length) report("serious", "Sitemap", "Sitemap is missing or empty");
  for (const u of urls) {
    const r = await get(page, u.replace("https://rogetjames.com", BASE));
    if (!r || r.status >= 400) report("serious", "Sitemap", "Page listed for Google does not open", `${u} (${r ? r.status : "no reply"})`);
  }
  await page.close();
}

async function sweepLinks(browser, links) {
  const page = await blankOn(browser);
  const host = new URL(BASE).host;
  const todo = [...new Set(links.map((l) => l.split("#")[0]).filter((l) => { try { return new URL(l).host === host; } catch { return false; } }))];
  let i = 0;
  const worker = async () => {
    while (i < todo.length) {
      const u = todo[i++];
      const r = await get(page, u);
      stats.links++;
      if (!r || r.status >= 400) report("serious", "Links", "Link leads to a dead page", `${u.replace(BASE, "")} (${r ? r.status : "no reply"})`);
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  await page.close();
}

// ── Run ─────────────────────────────────────────────────────────────────────
const started = new Date();
const browser = await chromium.launch();
const links = [];
try {
  for (const p of ["/wall-art", "/sculpture", "/screens", "/bespoke-sculpture"]) links.push(...(await scanRangePage(browser, p)) || []);
  links.push(...(await scanHome(browser)));
  for (const p of ["/", "/wall-art", "/sculpture", "/screens"]) await scanMobile(browser, p);
  await checkFunctions(browser);
  if (!QUICK) await sweepLinks(browser, links);
} finally {
  await browser.close();
}

// ── Report ──────────────────────────────────────────────────────────────────
const serious = findings.filter((f) => f.level === "serious");
const minor = findings.filter((f) => f.level === "minor");
const day = started.toISOString().slice(0, 10);
const lines = [
  `# Site scan — ${day}`,
  "",
  `${BASE} · ${stats.pages} pages · ${Object.values(stats.galleries).reduce((a, g) => a + (g.photos || 0), 0)} gallery photos · ${stats.links} links checked`,
  "",
  serious.length || minor.length ? `**${serious.length} serious, ${minor.length} minor.**` : "**Nothing wrong found.**",
  "",
];
const section = (title, list) => {
  if (!list.length) return;
  lines.push(`## ${title}`, "");
  const byWhere = {};
  for (const f of list) (byWhere[f.where] ||= []).push(f);
  for (const [w, fs] of Object.entries(byWhere)) {
    lines.push(`**${w}**`);
    for (const f of fs) lines.push(`- ${f.what}${f.detail ? ` — ${f.detail}` : ""}`);
    lines.push("");
  }
};
section("Serious", serious);
section("Minor", minor);
lines.push("## Galleries scanned", "");
for (const [g, s] of Object.entries(stats.galleries)) lines.push(`- ${g}: ${s.ranges ? `${s.ranges} ranges, ` : ""}${s.photos} photos`);

const outDir = join(ROOT, "reports", "daily-scan");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "latest.md"), lines.join("\n") + "\n");
writeFileSync(join(outDir, "latest.json"), JSON.stringify({ day, base: BASE, stats, findings }, null, 2));
console.log(lines.join("\n"));
process.exit(serious.length ? 1 : 0);
