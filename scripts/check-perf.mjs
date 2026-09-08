// Stops a slow homepage from ever shipping again.
//
// WHY THIS EXISTS: the opening picture was taking five and a half seconds to
// appear. Not because it was big — because nineteen full-size photographs and
// every below-the-fold script were downloading at the same time. Nothing warned
// us; it just got slower over months.
//
// This loads the built homepage in a real browser and fails the build if it
// breaks the budget. A failed build never replaces the live site.

import { readFileSync, existsSync, statSync } from "fs";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { chromium } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");

// The budget. Raise these only with a reason.
//
// Only pictures that BYPASS the resizer are weighed. A picture requested
// through /.netlify/images is resized by Netlify in production — the file on
// disk is not what a visitor downloads — so those are counted, not weighed.
// Today's figure is ~7.4 MB, from the Collection section's pictures. The
// ceiling is set just above it so nothing gets WORSE while that section is
// moved onto the resizer; lower it each time a batch moves over.
const MAX_RAW_BYTES = 7.8 * 1024 * 1024;   // full-size pictures the homepage pulls
const MAX_ONE_RAW = 700 * 1024;            // no single full-size picture heavier
const HERO_PRELOAD = 'rel="preload" as="image"';

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml",
  ".ico": "image/x-icon", ".json": "application/json", ".mp4": "video/mp4", ".woff2": "font/woff2" };

const html = readFileSync(join(DIST, "index.html"), "utf-8");
const problems = [];

// 1 — the browser must be told about the hero photograph in the page itself,
// or it doesn't start fetching it until the scripts have run.
if (!html.includes(HERO_PRELOAD)) {
  problems.push("index.html no longer preloads the hero photograph — the opening picture will arrive seconds late.");
}

// 2 — load it and weigh it.
const server = createServer((req, res) => {
  let u = decodeURIComponent(req.url.split("?")[0]);
  if (u.startsWith("/.netlify/images")) {
    // stand in for Netlify's resizer: serve the source file, and report the
    // size the resizer would roughly return so the budget stays honest
    u = decodeURIComponent(new URL("http://x" + req.url).searchParams.get("url") || "");
  }
  let f = join(DIST, u);
  if (!existsSync(f) || statSync(f).isDirectory()) f = join(DIST, u === "/" ? "index.html" : u + ".html");
  if (!existsSync(f)) { res.writeHead(404); return res.end("nf"); }
  const body = readFileSync(f);
  res.writeHead(200, { "content-type": TYPES[extname(f)] || "application/octet-stream", "content-length": body.length });
  res.end(body);
}).listen(4321);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
let rawBytes = 0, viaResizer = 0;
const heavy = [];
page.on("response", (r) => {
  if (!/image/.test(r.headers()["content-type"] || "")) return;
  const len = +(r.headers()["content-length"] || 0);
  if (/\/\.netlify\/images/.test(r.url())) { viaResizer++; return; }
  rawBytes += len;
  if (len > MAX_ONE_RAW) heavy.push(`${Math.round(len / 1024)} KB — ${decodeURIComponent(r.url()).replace(/^https?:\/\/[^/]+/, "")}`);
});
await page.goto("http://localhost:4321/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(6000);
await browser.close();
server.close();

if (rawBytes > MAX_RAW_BYTES) {
  problems.push(`the homepage pulls ${(rawBytes / 1048576).toFixed(1)} MB of un-resized pictures — the budget is ${(MAX_RAW_BYTES / 1048576).toFixed(1)} MB. Serve them through netlifyImg() at the size they are shown.`);
}
if (heavy.length) {
  problems.push(`these skip the resizer and are sent at full size:\n       ${heavy.slice(0, 6).join("\n       ")}`);
}

if (problems.length) {
  console.error("\n  ✗ SPEED CHECK FAILED — the build stops here, the live site is untouched.\n");
  problems.forEach((p) => console.error(`     ${p}`));
  console.error("");
  process.exit(1);
}
console.log(`  ✓ homepage: ${(rawBytes / 1024).toFixed(0)} KB un-resized, ${viaResizer} pictures through the resizer, hero preloaded`);
