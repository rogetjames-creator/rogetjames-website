// Single source of truth for the studio catalogues — used by the nav bar
// (Navbar.jsx), the gallery pages (rangeGalleryApp.js) and the client vault
// (VaultGallery.jsx). Do NOT redefine this list locally anywhere: import from
// here so every catalogue UI on the site stays identical.
export const CAT1 = Array.from({ length: 38 }, (_, i) => `/images/catalogues/cat1/page-${String(i + 1).padStart(2, "0")}.jpg`);
export const CAT2 = [1, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => `/images/catalogues/cat2/page-${String(n).padStart(2, "0")}.jpg`);
export const DULUX_PAGES = Array.from({ length: 8 }, (_, i) => `/images/catalogues/dulux/page-${String(i + 1).padStart(2, "0")}.jpg`);
export const INTERPON_PAGES = Array.from({ length: 8 }, (_, i) => `/images/catalogues/interpon/page-${String(i + 1).padStart(2, "0")}.jpg`);

export const CATALOGUES = [
  { label: "Wall Art & Screens", pages: CAT1 },
  { label: "Sculpture, Light Features & Mirrors", pages: CAT2 },
  { label: "Dulux Colours", pages: DULUX_PAGES },
  { label: "Interpon Colours", pages: INTERPON_PAGES },
];
