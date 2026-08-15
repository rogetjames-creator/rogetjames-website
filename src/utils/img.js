/**
 * Wrap a local image path with the Netlify Image CDN URL.
 * Automatically serves WebP at the requested width.
 * External URLs (http/https) are returned unchanged.
 */
export function netlifyImg(src, { w = 1920, q = 80 } = {}) {
  if (!src || src.startsWith("http") || src.startsWith("data:")) return src;
  // Plain Vite dev doesn't serve the Netlify Image CDN (/.netlify/images), so
  // serve the raw local file in dev and only rewrite to the CDN in production.
  if (import.meta.env && import.meta.env.DEV) return src;
  return `/.netlify/images?url=${encodeURIComponent(src)}&w=${w}&fm=webp&q=${q}`;
}
