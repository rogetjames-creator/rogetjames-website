// A snapshot of what the site is meant to be, and a check against it.
//
// James kept finding faults I had introduced and not noticed — a strip
// animation switched off, a portal removed, a page left un-prerendered, a
// caption showing a phone filename. He should not be the regression detector.
//
//   node scripts/check-site.mjs            compare the build against the snapshot
//   node scripts/check-site.mjs --save     record the current state as correct
//   node scripts/check-site.mjs --live     also check rogetjames.com itself
//
// The snapshot lives in scripts/site-snapshot.json. When a change is
// deliberate, re-save it in the same commit so the reason is in the history.

import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const SNAP = join(ROOT, "scripts", "site-snapshot.json");
const SAVE = process.argv.includes("--save");
const LIVE = process.argv.includes("--live");

const read = (p) => { try { return readFileSync(p, "utf-8"); } catch { return ""; } };
const words = (html) =>
  html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
const pick = (html, re) => (html.match(re) || [])[1] || "";

// ── What we look at ───────────────────────────────────────────────────────
function survey() {
  const out = { pages: {}, motion: {}, portals: {}, sitemap: {}, captions: {}, weight: {} };

  // Pages: the words a crawler reads, plus the four things that decide whether
  // a page can rank at all.
  for (const f of readdirSync(DIST).filter((f) => f.endsWith(".html")).sort()) {
    const html = read(join(DIST, f));
    if (!html) continue;
    out.pages[f] = {
      words: words(html),
      title: pick(html, /<title>([^<]*)<\/title>/i),
      robots: pick(html, /<meta name="robots" content="([^"]*)"/i) || "(none)",
      hasOgImage: /<meta property="og:image"/i.test(html),
      hasH1: /<h1[\s>]/i.test(html),
    };
  }

  // Motion: any strip whose animation has been switched off, and the rules
  // that can switch one off without anybody noticing.
  const css = readdirSync(join(DIST, "assets")).filter((f) => f.endsWith(".css")).map((f) => read(join(DIST, "assets", f))).join("\n");
  out.motion.marqueeClasses = [...new Set((css.match(/\.marquee[a-z-]*/gi) || []))].sort();
  out.motion.animationNoneRules = (css.match(/[^{}]*\{[^{}]*animation:\s*none[^{}]*\}/gi) || [])
    .map((r) => r.trim().slice(0, 90));
  out.motion.reducedMotionBlocks = (css.match(/@media[^{]*prefers-reduced-motion[^{]*/gi) || []).length;

  // Portals: how many the Bespoke section renders, and at what sizes — the
  // thing that silently lost its Screens portal for three months.
  const src = read(join(ROOT, "src", "components", "BespokePortals.jsx"));
  const portalLine = (block) => [...block.matchAll(/centerLabel="([^"]+)"[^/]*?\/>/g)].map((m) => m[1]);
  const sizes = [...src.matchAll(/size=\{(\d+)\}[^/]*?centerLabel="([^"]+)"/g)].map((m) => `${m[2]}:${m[1]}`);
  out.portals.names = [...new Set((src.match(/centerLabel="([^"]+)"/g) || []).map((s) => s.slice(13, -1)))].sort();
  out.portals.sizes = [...new Set(sizes)].sort();
  void portalLine;

  // Sitemap: how many addresses we publish.
  const sm = read(join(DIST, "sitemap.xml"));
  out.sitemap.count = (sm.match(/<loc>/g) || []).length;

  // Captions: a photo captioned with whatever the phone called the file. That
  // caption is also its alt text.
  const man = (() => { try { return JSON.parse(read(join(ROOT, "public", "media-manifest.json"))); } catch { return []; } })();
  const cameraJunk = (n) => {
    const b = String(n || "").replace(/\.(jpe?g|png|webp|heic|heif)$/i, "");
    return /^\s*\d+\s*$/.test(b) || /^(IMG|DSC|PXL|Screenshot)[_ -]/i.test(b) || /^[0-9A-F]{8}-[0-9A-F]{4}/i.test(b);
  };
  out.captions.filenameCaptions = man.filter((e) => cameraJunk(e.name) && (e.destinations || []).length).length;

  // Weight: pictures the homepage asks for without going through the resizer.
  const idx = read(join(DIST, "index.html"));
  let raw = 0;
  for (const s of new Set([...idx.matchAll(/(?:src|href)="(\/images\/[^"]+)"/g)].map((m) => m[1]))) {
    try { raw += statSync(join(ROOT, "public", decodeURIComponent(s))).size; } catch { /* resized */ }
  }
  out.weight.homepageRawKB = Math.round(raw / 1024);

  return out;
}

// ── Things that are wrong regardless of the snapshot ──────────────────────
function absolutes(now) {
  const bad = [];
  for (const [f, p] of Object.entries(now.pages)) {
    // Pages that exist for James, not for Google. Their noindex is deliberate.
    const isPrivate = /^(admin|media|stats|vault|hero|feature-screens|screens-range|projects|sydney|gold-coast|adelaide|fonts|pieces)\./.test(f);
    if (isPrivate) continue;
    if (p.words < 60) bad.push(`${f} — only ${p.words} words for a crawler; is it prerendered?`);
    if (!p.hasH1) bad.push(`${f} — no h1 a crawler can read`);
    if (!p.hasOgImage) bad.push(`${f} — no og:image, so a shared link shows a blank card`);
    if (/noindex/i.test(p.robots)) bad.push(`${f} — noindex, Google is told to stay away`);
  }
  if (now.motion.animationNoneRules.length)
    bad.push(`a strip animation is switched off: ${now.motion.animationNoneRules.join(" | ")}`);
  if (now.captions.filenameCaptions)
    bad.push(`${now.captions.filenameCaptions} photographs are captioned with a phone filename`);
  try {
    execSync("git fetch -q origin", { cwd: ROOT, stdio: "ignore" });
    const un = execSync('git branch -r --no-merged origin/main', { cwd: ROOT }).toString()
      .split("\n").map((s) => s.trim()).filter(Boolean)
      .filter((b) => {
        try {
          const d = execSync(`git log -1 --format=%ct ${b}`, { cwd: ROOT }).toString().trim();
          return (Date.now() / 1000 - Number(d)) < 60 * 86400;
        } catch { return false; }
      });
    if (un.length) bad.push(`work not on main and therefore not live: ${un.join(", ")}`);
  } catch { /* offline */ }
  return bad;
}

// ── Compare ───────────────────────────────────────────────────────────────
const now = survey();

if (SAVE) {
  writeFileSync(SNAP, JSON.stringify(now, null, 2) + "\n", "utf-8");
  console.log(`  ✓ snapshot saved — ${Object.keys(now.pages).length} pages, ${now.portals.names.length} portals, ${now.sitemap.count} addresses`);
  process.exit(0);
}

if (!existsSync(SNAP)) {
  console.log("  ! no snapshot yet — run: node scripts/check-site.mjs --save");
  process.exit(0);
}

const was = JSON.parse(read(SNAP));
const changes = [];

for (const [f, p] of Object.entries(now.pages)) {
  const b = was.pages[f];
  if (!b) { changes.push(`new page ${f}`); continue; }
  if (Math.abs(p.words - b.words) > Math.max(40, b.words * 0.25))
    changes.push(`${f} — ${b.words} words became ${p.words}`);
  if (p.robots !== b.robots) changes.push(`${f} — robots was "${b.robots}", now "${p.robots}"`);
  if (b.hasOgImage && !p.hasOgImage) changes.push(`${f} — lost its og:image`);
  if (b.hasH1 && !p.hasH1) changes.push(`${f} — lost its h1`);
  if (p.title !== b.title) changes.push(`${f} — title was "${b.title}"`);
}
for (const f of Object.keys(was.pages)) if (!now.pages[f]) changes.push(`page gone: ${f}`);

const gonePortals = was.portals.names.filter((n) => !now.portals.names.includes(n));
const newPortals = now.portals.names.filter((n) => !was.portals.names.includes(n));
if (gonePortals.length) changes.push(`portal gone from Bespoke: ${gonePortals.join(", ")}`);
if (newPortals.length) changes.push(`portal added to Bespoke: ${newPortals.join(", ")}`);
if (JSON.stringify(now.portals.sizes) !== JSON.stringify(was.portals.sizes))
  changes.push(`portal sizes changed: ${was.portals.sizes.join(" ")} → ${now.portals.sizes.join(" ")}`);

const goneMarquee = was.motion.marqueeClasses.filter((c) => !now.motion.marqueeClasses.includes(c));
if (goneMarquee.length) changes.push(`a moving strip lost its rule: ${goneMarquee.join(", ")}`);
if (now.motion.reducedMotionBlocks > was.motion.reducedMotionBlocks)
  changes.push(`a new reduced-motion rule appeared — it can freeze a strip without anyone noticing`);

if (now.sitemap.count !== was.sitemap.count)
  changes.push(`sitemap went from ${was.sitemap.count} addresses to ${now.sitemap.count}`);
if (now.weight.homepageRawKB > was.weight.homepageRawKB * 1.25)
  changes.push(`homepage pictures grew from ${was.weight.homepageRawKB}KB to ${now.weight.homepageRawKB}KB un-resized`);

const faults = absolutes(now);
const bar = "─".repeat(70);

if (!changes.length && !faults.length) {
  console.log("  ✓ site matches the snapshot, nothing amiss");
} else {
  console.log(`\n${bar}\n  SITE CHECK\n${bar}`);
  if (faults.length) {
    console.log("\n  Wrong regardless of the snapshot:");
    for (const f of faults) console.log(`   • ${f}`);
  }
  if (changes.length) {
    console.log("\n  Changed since the snapshot — deliberate, or not?");
    for (const c of changes) console.log(`   • ${c}`);
    console.log("\n  If these are all intended: node scripts/check-site.mjs --save");
  }
  console.log(`${bar}\n`);
}

if (LIVE) {
  const sm = read(join(DIST, "sitemap.xml"));
  const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const sample = urls.filter((_, i) => i % Math.max(1, Math.floor(urls.length / 12)) === 0).slice(0, 12);
  console.log("  Checking the live site…");
  for (const u of sample) {
    try {
      const r = await fetch(u, { method: "HEAD" });
      if (!r.ok) console.log(`   • ${r.status} ${u}`);
    } catch { console.log(`   • unreachable ${u}`); }
  }
  console.log("  ✓ live check done (faults only are listed)");
}
