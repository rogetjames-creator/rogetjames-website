/**
 * Wrap a local image path with the Netlify Image CDN URL.
 * Automatically serves WebP at the requested width.
 * External URLs (http/https/data:) are returned unchanged, and a path that is
 * ALREADY a Netlify Image CDN URL (e.g. the `${CDN}` gallery paths) is returned
 * as-is so wrapping is idempotent and never double-encodes into a broken URL.
 */
export function netlifyImg(src, { w = 1920, q = 80 } = {}) {
  if (!src || src.startsWith("http") || src.startsWith("data:")) return src;
  if (src.startsWith("/.netlify/images")) return src;
  return `/.netlify/images?url=${encodeURIComponent(src)}&w=${w}&fm=webp&q=${q}`;
}
