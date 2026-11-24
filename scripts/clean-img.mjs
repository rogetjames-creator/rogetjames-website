// One readable, stable address per photo for the pages the build writes.
//
// /images/banksia/banksia-card-1.jpg at 1400px  →  /img/w1400/banksia/banksia-card-1.jpg
//
// netlify.toml rewrites /img/w<width>/* to the Netlify Image CDN, so the
// picture, the WebP format and the speed are exactly what
// /.netlify/images?url=…&w=…&fm=webp&q=82 gave — but the address carries the
// file name and never changes, which is what Google Images and Bing want.
//
// Only the widths that have a rule in netlify.toml are rewritten; any other
// width falls back to the plain image CDN address so nothing can break.

export const CLEAN_WIDTHS = [400, 600, 700, 800, 1000, 1400, 1600];

export function cleanImg(path, w) {
  if (!path || /^https?:|^data:/.test(path)) return path;
  if (path.startsWith("/images/") && CLEAN_WIDTHS.includes(w)) {
    return `/img/w${w}${path.slice("/images".length)}`;
  }
  return `/.netlify/images?url=${encodeURIComponent(path)}&w=${w}&fm=webp&q=82`;
}

// Copyright and credit for every photo, in the form Google Images reads to show
// "© ROGETjames" and the creator under a picture. No prices, ever.
export const IMAGE_RIGHTS = {
  creditText: "ROGETjames",
  copyrightNotice: "© ROGETjames. All rights reserved.",
  copyrightHolder: { "@type": "Organization", name: "ROGETjames", url: "https://rogetjames.com/" },
  acquireLicensePage: "https://rogetjames.com/#contact",
};
