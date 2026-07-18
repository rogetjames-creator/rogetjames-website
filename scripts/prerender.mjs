/**
 * Post-build prerender script.
 * Serves the dist/ folder, renders each entry page with Playwright, and writes
 * the fully-rendered HTML back so crawlers see real content without running JS.
 *
 * Pages: the homepage plus the two standalone gallery pages (/wall-art,
 * /sculpture) — those were shipping as near-empty shells, so Google crawled
 * them thin and left them unindexed. Prerendering gives them real content.
 */
import { createServer } from "http";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, join, extname } from "path";
import { chromium } from "playwright";

const DIST = resolve("dist");
const PORT = 4173;

// Pages to prerender: the URL to visit and the dist file to overwrite.
const PAGES = [
  { url: "/", file: "index.html" },
  { url: "/wall-art.html", file: "wall-art.html" },
  { url: "/sculpture.html", file: "sculpture.html" },
];

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

// Simple static file server
function serve() {
  return new Promise((resolvePromise) => {
    const server = createServer((req, res) => {
      let filePath = join(DIST, req.url === "/" ? "index.html" : req.url.split("?")[0]);
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

// Reset animated intro elements to their initial hidden state before snapshot.
// These selectors only exist on the homepage; on the gallery pages the call is
// a harmless no-op (the galleries animate via CSS classes, which aren't baked
// into the serialized HTML, so they hydrate cleanly without this).
function resetIntro() {
  const sel = [
    ".hero-mark", ".hero-sub",
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
  document.querySelectorAll("[data-prerender-strip]").forEach((el) => el.remove());
}

async function prerender() {
  console.log("Starting prerender...");

  const server = await serve();
  console.log(`Serving dist/ on http://localhost:${PORT}`);

  const browser = await chromium.launch({
    headless: true,
    // Local runs set PRERENDER_CHROMIUM to the pre-installed browser; on
    // Netlify it's unset and Playwright uses the browser from postinstall.
    executablePath: process.env.PRERENDER_CHROMIUM || undefined,
  });

  for (const { url, file } of PAGES) {
    try {
      const page = await browser.newPage();
      await page.goto(`http://localhost:${PORT}${url}`, { waitUntil: "networkidle", timeout: 20000 }).catch(() => {});
      // Let content/images settle in the DOM for crawlers.
      await page.waitForTimeout(2000);
      await page.evaluate(resetIntro);
      const html = await page.content();
      await page.close();
      writeFileSync(join(DIST, file), html, "utf-8");
      console.log(`Prerendered dist/${file} (${url})`);
    } catch (err) {
      // Never fail the whole build over one page — leave that page's shell.
      console.error(`Prerender skipped for ${url}:`, err.message);
    }
  }

  await browser.close();
  server.close();
  console.log("Prerender complete.");
}

prerender().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});
