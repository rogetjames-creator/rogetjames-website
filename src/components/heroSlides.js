// The hero slideshow's base slides — the single source of truth shared by the
// hero (Hero.jsx) and the media uploader (MediaPage.jsx). Each has a stable
// `key` used to build the "Replace: <label>" upload destination
// (`hero-replace-<key>`), a `src` (the built-in image) and a human `label`.
//
// A /media upload tagged `hero-replace-<key>` swaps that slide's image; one
// tagged `hero` is appended as a new slide. So the whole list is editable from
// /media, not just the first slide. Add a slide here and it appears in the
// uploader's Replace list automatically.
export const HERO_SLIDES = [
  { key: "gren-wide",        src: "/images/hero/hero-gren-wide.jpg",             label: "GREN Wide" },
  { key: "rue-1",            src: "/images/hero/hero-rue-1.jpg",                 label: "Rue" },
  { key: "fig-autumn-1",     src: "/images/hero/hero-creeping-fig-autumn-1.jpg", label: "Creeping Fig Autumn 1" },
  { key: "fig-autumn-2",     src: "/images/hero/hero-creeping-fig-autumn-2.jpg", label: "Creeping Fig Autumn 2" },
  { key: "banksia-oldmanis", src: "/images/hero/hero-banksia-oldmanis.jpg",      label: "Banksia Oldmanis" },
  { key: "marakesh",         src: "/images/marakesh/marakesh-promo.jpg",         label: "Marakesh" },
  { key: "autumn-leafs",     src: "/images/hero/hero-autumn-leafs.jpg",          label: "Autumn Leafs" },
  { key: "banksia-round",    src: "/images/hero/hero-banksia-round.jpg",         label: "Banksia Round" },
  { key: "fig-grande",       src: "/images/hero/hero-creeping-fig-grande.jpg",   label: "Creeping Fig Grande" },
  { key: "gren-free",        src: "/images/hero/hero-gren-free.jpg",             label: "GREN Free" },
  { key: "obliationes",      src: "/images/hero/hero-obliationes.jpg",           label: "Obliationes" },
  { key: "rue-3rd",          src: "/images/hero/hero-rue-3rd.jpg",               label: "Rue 3rd" },
  { key: "seaweed",          src: "/images/hero/hero-seaweed.jpg",               label: "Seaweed" },
  { key: "vasuki",           src: "/images/hero/hero-vasuki.jpg",                label: "Vasuki" },
  { key: "bambu",            src: "/images/hero/hero-bambu.jpg",                 label: "Bambu" },
];
