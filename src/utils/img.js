/**
 * Wrap a local image path with the Netlify Image CDN URL.
 * Automatically serves WebP at the requested width.
 * External URLs (http/https) are returned unchanged.
 */
export function netlifyImg(src, { w = 1920, q = 80 } = {}) {
  if (!src || src.startsWith("http") || src.startsWith("data:")) return src;
  const dev = !!(import.meta.env && import.meta.env.DEV);
  // Already a Netlify Image URL (e.g. the cdn-gallery images are pre-wrapped with
  // no size). Pull out the real source path and re-wrap it at the requested width
  // so thumbnails aren't served full-size (and it isn't double-encoded).
  if (src.startsWith("/.netlify/images")) {
    try {
      const inner = new URLSearchParams(src.split("?")[1] || "").get("url");
      if (inner) {
        const path = decodeURIComponent(inner);
        return dev ? path : `/.netlify/images?url=${encodeURIComponent(path)}&w=${w}&fm=webp&q=${q}`;
      }
    } catch { /* fall through to returning src as-is */ }
    return src;
  }
  // Plain Vite dev doesn't serve the Netlify Image CDN (/.netlify/images), so
  // serve the raw local file in dev and only rewrite to the CDN in production.
  if (dev) return src;
  return `/.netlify/images?url=${encodeURIComponent(src)}&w=${w}&fm=webp&q=${q}`;
}
