// ─────────────────────────────────────────────────────────────────────────
//  PROJECT CASE STUDIES — the data behind /projects.
//
//  One entry per project. The names, locations, descriptions and photos match
//  the Projects popup on the home page; the extra case-study fields (approach,
//  specs, hero) live only here, because only these pages use them.
//
//  This page set is PRIVATE while it is being built — see src/projects.jsx.
//
//  To fill a project in, edit its `approach` steps and `specs` rows below.
//  Anything left as an empty array simply doesn't render.
// ─────────────────────────────────────────────────────────────────────────

// Same rewrite the galleries use: local folder in dev, Netlify's image service
// (WebP + resizing) in production.
const CDN = import.meta.env.DEV ? "/images/cdn-gallery" : "/.netlify/images?url=%2Fimages%2Fcdn-gallery";

export const PROJECTS = [
  {
    slug: "homebase",
    name: "HOMEBASE",
    // The key /media uploads are tagged with, so photos James adds to this
    // project appear in its gallery without a code change.
    projectCategory: "homebase",
    location: "Subiaco, Western Australia",
    sector: "Mixed-use precinct",
    material: "Corten steel & aluminium",
    scope: "Landscape design, art features, project management",
    completed: "",
    hero: "/images/hero/hero-homebase-dusk.jpg",
    description:
      "A landmark mixed-use development in Subiaco, Western Australia. ROGETjames was engaged across the full scope of the project — designing the landscape, creating and fabricating a suite of architectural art features, and project managing the commission from concept through to installation. The works include totems, entrance signage, feature sculptures, fire pit elements and landscape art, each conceived to activate the public spaces of the precinct and work in dialogue with the surrounding architecture.",
    approachIntro:
      "One studio carried the precinct from first sketch to the last bolt — the landscape, the artworks and the installation were drawn together rather than handed between trades, so every element shares a language.",
    approach: [
      { title: "Site & landscape design", text: "The public spaces were designed first, so the artwork had somewhere to belong instead of being placed after the fact." },
      { title: "Motif development", text: "A single cut motif was drawn for the precinct and carried across totems, signage and screens at different scales." },
      { title: "Fabrication", text: "Laser cut and finished in Corten steel and powdercoated aluminium, built for weather and public contact." },
      { title: "Install & project management", text: "Engineering, footings, delivery and installation coordinated as one commission through to handover." },
    ],
    specs: [
      ["Client", "Homebase, Subiaco"],
      ["Scope", "Landscape design · architectural art features · fabrication · project management"],
      ["Elements", "Entrance signage · totems · feature sculptures · fire pit · planters · landscape art"],
      ["Materials", "Corten steel, powdercoated aluminium"],
      ["Fabrication", "Laser cut, folded and welded in Western Australia"],
      ["Location", "Subiaco, Western Australia"],
    ],
    images: [
      { name: "HOMEBASE Entrance", img: "/images/hero/hero-homebase-entrance.jpg" },
      { name: "HOMEBASE", img: `${CDN}/cffc33df-3d81-460f-b4aa-9f8adc9d81d8_rw_1200.jpg` },
      { name: "Homebase Motif", img: "/images/homebase/homebase-motif-closeup.jpg" },
      { name: "Homebase Landscape Design", img: "/images/hero/hero-homebase-dusk.jpg" },
      { name: "HOMEBASE Totems", img: "/images/hero/hero-homebase-totems.jpg" },
      { name: "HOMEBASE Fire Pit", img: `${CDN}/b4fe3827-e371-4bd2-9bb5-1c0b3def3095_rw_1920.jpg` },
      { name: "EVO Planters", img: `${CDN}/181378db-3310-4b32-8704-00836f3e0cc8_rw_1200.jpg` },
      { name: "EVO Planters", img: `${CDN}/3826640c-6476-446d-b49c-ba7d1e312544_rw_1200.jpg` },
    ],
  },

  {
    slug: "unity-in-diversity",
    name: "UNITY IN DIVERSITY",
    projectCategory: "centennial",
    location: "Centennial Park, Western Australia",
    sector: "Public art",
    material: "Corten steel",
    scope: "Concept design, fabrication, installation",
    completed: "",
    hero: `${CDN}/ce906d3c-248e-42c2-a76c-e7547bae20e7_rw_1200.jpg`,
    description:
      "A significant public art commission at Centennial Park, Western Australia. The selected design was developed through an extensive concept process, culminating in a site-specific installation that celebrates the identity and spirit of the precinct.",
    approachIntro: "",
    approach: [],
    specs: [
      ["Location", "Centennial Park, Western Australia"],
    ],
    images: [
      { name: "UNITY IN DIVERSITY", img: `${CDN}/ce906d3c-248e-42c2-a76c-e7547bae20e7_rw_1200.jpg` },
      { name: "Unity in Diversity", img: `${CDN}/6745c491-3d3b-4501-b01c-76a351d2d9d1_rw_1920.jpeg` },
      { name: "UNITY IN DIVERSITY", img: `${CDN}/5504bc00-e901-49b2-b14b-337476409a29_rw_1200.jpg` },
      { name: "UNITY IN DIVERSITY", img: "/images/uploads/1785745463839_tie649.jpg" },
    ],
  },

  {
    slug: "fiona-stanley",
    name: "FIONA STANLEY HOSPITAL",
    projectCategory: "fiona-stanley",
    location: "Murdoch, Western Australia",
    sector: "Health · public art",
    material: "Corten steel",
    scope: "Design, fabrication, installation",
    completed: "",
    hero: `${CDN}/13dddf44-cb0a-4ad6-a4ac-3b229792d04d_rw_1920.jpg`,
    description:
      "Fiona Stanley Hospital sits on land with deep indigenous significance — a place of gathering long before the hospital existed. This commission was an artistic homage to that history. ROGETjames designed and fabricated a series of totem sculptures and installations drawing on indigenous motifs, created with respect for Country and a genuine desire to bring meaning, warmth and identity to the spaces people move through every day.",
    approachIntro: "",
    approach: [],
    specs: [
      ["Location", "Murdoch, Western Australia"],
    ],
    images: [
      { name: "Fiona Stanley", img: `${CDN}/13dddf44-cb0a-4ad6-a4ac-3b229792d04d_rw_1920.jpg` },
      { name: "DANDELIONS Totems", img: `${CDN}/14c73030-575d-46e2-ae9e-eb407eb06e16_rw_1200.jpg` },
      { name: "FIONA STANLEY TOTEMS", img: `${CDN}/0bb31cda-116a-4ec4-8c20-5f25f900287c_rw_1200.jpg` },
    ],
  },

  {
    slug: "ergo-cottesloe-hotel",
    name: "ERGO — COTTESLOE HOTEL",
    projectCategory: "cottesloe",
    location: "Cottesloe, Western Australia",
    sector: "Hospitality",
    material: "",
    scope: "",
    completed: "",
    hero: `${CDN}/9ea86aef-4d28-4b92-bb98-5293deef8c93_rw_3840.jpg`,
    description: "",
    approachIntro: "",
    approach: [],
    specs: [
      ["Location", "Cottesloe, Western Australia"],
    ],
    images: [
      { name: "ERGO Cottesloe Hotel", img: `${CDN}/9ea86aef-4d28-4b92-bb98-5293deef8c93_rw_3840.jpg` },
      { name: "ERGO Cottesloe Hotel", img: `${CDN}/ff393903-5912-40da-9b37-aca22ef599b4_rw_1920.jpg` },
      { name: "ERGO Cottesloe Hotel — Gates", img: "/images/hero/hero-cottesloe-gate.jpg" },
    ],
  },

  {
    slug: "williamstown",
    name: "WILLIAMSTOWN",
    projectCategory: "williamstown",
    location: "Williamstown, Victoria",
    sector: "Residential",
    material: "",
    scope: "",
    completed: "",
    hero: "/images/eros/eros-3.jpg",
    description: "",
    approachIntro: "",
    approach: [],
    specs: [
      ["Location", "Williamstown, Victoria"],
    ],
    images: [
      { name: "EROS Canopy", img: "/images/eros/eros-3.jpg" },
      { name: "EROS Pool Compliant", img: `${CDN}/b4e3f929-4c8f-433b-a535-3500ca5058a3_rw_1200.jpg` },
      { name: "EROS", img: "/images/eros/eros-2.jpg" },
      { name: "EROS", img: "/images/eros/eros-1.jpg" },
    ],
  },
];

export const projectBySlug = (slug) => PROJECTS.find((p) => p.slug === slug);
