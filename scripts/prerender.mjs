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

  // Wait for GSAP animations to settle and images to start loading
  await page.waitForTimeout(2000);

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
