/**
 * Post-build prerender script.
 * Serves the dist/ folder, renders each indexable page with Playwright, and
 * overwrites its HTML with the fully-rendered markup so crawlers see real
 * content without executing JavaScript.
 *
 * Pages: the homepage (/) and the two live, indexable galleries (/wall-art,
 * /sculpture). The private preview pages (melbourne, feature-screens) are
 * noindex and deliberately not prerendered.
 */
import { createServer } from "http";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, join, extname } from "path";
import { chromium } from "playwright";

const DIST = resolve("dist");
const PORT = 4173;

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".xml": "application/xml",
};

// Pages to prerender. `url` is what we navigate to (the built .html entry);
// `file` is the dist file we overwrite; `hero` selects the homepage-only resets.
const PAGES = [
  { url: "/", file: "index.html", hero: true },
  { url: "/wall-art.html", file: "wall-art.html", hero: false },
  { url: "/sculpture.html", file: "sculpture.html", hero: false },
];

// Simple static file server
function serve() {
  return new Promise((resolvePromise) => {
    const server = createServer((req, res) => {
      let filePath = join(DIST, req.url === "/" ? "index.html" : req.url);
      if (!existsSync(filePath)) {
        filePath = join(DIST, "index.html");
      }
      try {
        const content = readFileSync(filePath);
        const ext = extname(filePath);
        res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
        res.end(content);
      } catch {
        res.writeHead(404);
        res.end("Not found");
      }
    });
    server.listen(PORT, () => resolvePromise(server));
  });
}

// Reset entrance-animated elements to their INITIAL hidden state before we
// snapshot, so the client's first render matches the baked HTML and the
// intro plays once cleanly instead of the "glitchy flash then it appears"
// on load. The elements stay in the DOM (opacity:0), so crawlers/SEO still
// see the full content. Runs inside the page (browser context).
function resetForSnapshot(isHero) {
  if (isHero) {
    const sel = [
      ".hero-line-1", ".hero-line-2", ".hero-sub",
      ".hero-loc-1", ".hero-loc-2", ".hero-loc-3", ".hero-loc-4",
      ".hero-eyebrow",
    ].join(",");
    document.querySelectorAll(sel).forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "";
      el.style.translate = "";
      el.style.rotate = "";
      el.style.scale = "";
    });
    document.querySelectorAll("[data-prerender-hero]").forEach((el) => {
      el.style.opacity = "0";
    });
    // Strip decorative nodes React portals outside its root (the ROJ logo and
    // its glass fog); a baked mid-animation snapshot of them can't reconcile on
    // hydration and leaves a frozen ghost. Crawlers don't need them.
    document.querySelectorAll("[data-prerender-strip]").forEach((el) => el.remove());
    return;
  }
  // Feature galleries (/wall-art, /sculpture): the hero-text region animates in
  // via the CSS class `.fw-anim` (opacity:0 -> forwards). Reset those to their
  // pre-animation state so the baked HTML matches the client's first paint and
  // the intro replays once, cleanly, instead of flashing. Content stays in the
  // DOM at opacity:0 for crawlers.
  document.querySelectorAll(".fw-anim").forEach((el) => {
    el.style.opacity = "0";
    el.style.animation = "none";
    el.style.transform = "";
  });
}

async function prerenderPage(page, { url, file, hero }) {
  await page.goto(`http://localhost:${PORT}${url}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000); // let content/images settle in the DOM
  await page.evaluate(resetForSnapshot, hero);
  const html = await page.content();
  writeFileSync(join(DIST, file), html, "utf-8");
  console.log(`Prerendered dist/${file}`);
}

async function prerender() {
  console.log("Starting prerender...");

  const server = await serve();
  console.log(`Serving dist/ on http://localhost:${PORT}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const p of PAGES) {
    await prerenderPage(page, p);
  }

  await browser.close();
  server.close();

  console.log("Prerender complete.");
}

prerender().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});
