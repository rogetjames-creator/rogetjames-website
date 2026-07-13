/**
 * Post-build prerender script.
 * Serves the dist/ folder, renders it with Playwright, and replaces
 * dist/index.html with the fully-rendered HTML so crawlers see content
 * without needing JavaScript execution.
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

async function prerender() {
  console.log("Starting prerender...");

  const server = await serve();
  console.log(`Serving dist/ on http://localhost:${PORT}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });

  // Wait for content/images to be present in the DOM (for crawlers).
  await page.waitForTimeout(2000);

  // Reset the hero entrance-animated elements to their INITIAL hidden state
  // before snapshotting. GSAP leaves them baked in at opacity:1 (or a random
  // mid-animation value), but React's first client render has them at
  // opacity:0 — the mismatch made the visible prerendered text snap to
  // invisible on hydration and re-animate, i.e. the "glitchy text then the
  // site appears" flash on every load. Matching the initial state removes it;
  // the text is still in the DOM (opacity:0) so crawlers/SEO are unaffected,
  // and the drift-in intro then plays once, cleanly, on the client.
  await page.evaluate(() => {
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
  });

  // Extract the rendered HTML
  const html = await page.content();

  await browser.close();
  server.close();

  // Write the prerendered HTML back to dist/index.html
  writeFileSync(join(DIST, "index.html"), html, "utf-8");

  console.log("Prerendered dist/index.html with full page content.");
}

prerender().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});
