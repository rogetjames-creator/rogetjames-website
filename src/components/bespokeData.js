// Pure catalogue data for the Bespoke Commissions section.
// Extracted verbatim from BespokeCommissions.jsx — data only, no React/JSX/hooks.
// Kept in dependency order; several derived exports (SCULPTURE_ITEMS, CONCEPTS_ITEMS,
// SCREEN_COVERS, SCREEN_DESIGNS_SECTIONED, ...) are computed here and consumed by the
// components in BespokeCommissions.jsx.

const CDN = import.meta.env.DEV ? "/images/cdn-gallery" : "/.netlify/images?url=%2Fimages%2Fcdn-gallery";

const COMMISSIONS = {
  commercial: [],
  public: [
    {
      id: "public-2",
      label: "SCULPTURES & TOTEMS",
      items: [
        { name: "UNITY IN DIVERSITY",             img: `${CDN}/ce906d3c-248e-42c2-a76c-e7547bae20e7_rw_1200.jpg`, slides: [`${CDN}/ce906d3c-248e-42c2-a76c-e7547bae20e7_rw_1200.jpg`, `${CDN}/5504bc00-e901-49b2-b14b-337476409a29_rw_1200.jpg`, `${CDN}/6745c491-3d3b-4501-b01c-76a351d2d9d1_rw_1920.jpeg`, `${CDN}/e0829bf1-b7fb-433d-a143-748457e1a18f_rw_1200.jpg`, `${CDN}/b32ea229-d756-4e86-9f8e-ddd64ab25e66_rw_1200.jpg`, `/images/omare-marion-front.jpg`, `/images/hero/hero-marakesh-tall.jpg`, `${CDN}/931545f6-0a20-4f80-8707-7f6367b77839_rw_1920.jpg`] },
        { name: "UNITY IN DIVERSITY",             img: `${CDN}/5504bc00-e901-49b2-b14b-337476409a29_rw_1200.jpg` },
        { name: "Unity in Diversity",             img: `${CDN}/6745c491-3d3b-4501-b01c-76a351d2d9d1_rw_1920.jpeg` },
        { name: "UNITY IN DIVERSITY",             img: `${CDN}/e0829bf1-b7fb-433d-a143-748457e1a18f_rw_1200.jpg` },
        { name: "UNITY IN DIVERSITY",             img: `${CDN}/b32ea229-d756-4e86-9f8e-ddd64ab25e66_rw_1200.jpg` },
        { name: "MARAKESH TRIO (Custom)",         img: "/images/hero/hero-marakesh-tall.jpg" },
        { name: "MARAKESH TRIO (Custom)",         img: `${CDN}/931545f6-0a20-4f80-8707-7f6367b77839_rw_1920.jpg` },
        { name: "OMARE (Custom)",                 img: `/images/omare-marion-front.jpg` },
        { name: "HOMEBASE Totems",                img: "/images/hero/hero-homebase-totems.jpg" },
        { name: "HOMEBASE Entrance",              img: "/images/hero/hero-homebase-entrance.jpg" },
        { name: "Homebase Motif",                 img: "/images/homebase/homebase-motif-closeup.jpg" },
        { name: "Homebase Feature",               img: "/images/hero/hero-homebase-sculpture.jpg" },
        { name: "Homebase Feature",               img: `${CDN}/cffc33df-3d81-460f-b4aa-9f8adc9d81d8_rw_1200.jpg` },
        { name: "Homebase Feature",               img: `${CDN}/68de0a24-fad7-4ca7-815c-c69bc555e26b_rw_1200.jpg` },
        { name: "Fiona Stanley",                  img: `${CDN}/13dddf44-cb0a-4ad6-a4ac-3b229792d04d_rw_1920.jpg` },
        { name: "FIONA STANLEY TOTEMS",           img: `${CDN}/14c73030-575d-46e2-ae9e-eb407eb06e16_rw_1200.jpg` },
        { name: "FIONA STANLEY TOTEMS",           img: `${CDN}/0bb31cda-116a-4ec4-8c20-5f25f900287c_rw_1200.jpg` },
        { name: "ORIAN Totem",                    img: `${CDN}/79a0816f-0847-4bb5-aa06-a9077f7db746_rw_1200.jpg` },
        { name: "REVO Planter",                   img: `${CDN}/65b28727-1582-4a73-9cef-d8da2edcf885_rw_1200.jpg` },
      ],
    },
    {
      id: "public-7",
      label: "CONCEPTS",
      items: [
        { name: "Percent for Art", img: `${CDN}/a017e095-21a4-41a4-bdd7-630bb270b4f3_rw_1200.jpg`, slides: [`${CDN}/a017e095-21a4-41a4-bdd7-630bb270b4f3_rw_1200.jpg`, `${CDN}/713bf242-7075-4082-90cd-c885aa129107_rw_1920.jpg`] },
        { name: "Outback Info Bays",           img: `${CDN}/882272cb-30b0-4cef-8f0e-dee3241578e3_rw_1920.jpg` },
        { name: "Shire of Peel", img: `${CDN}/8157a7f2-763b-469d-bca4-dee47707d7da_rw_1920.jpg`, slides: [`${CDN}/8157a7f2-763b-469d-bca4-dee47707d7da_rw_1920.jpg`, `${CDN}/39f2b9a7-cf77-4a54-a88e-a92948a82ebe_rw_1920.jpg`], videoUrl: "/videos/waroona.mp4" },
        { name: "Homebase Landscape Final Design", img: `/images/homebase-concept-final.jpg` },
        { name: "Homebase Landscape Design First Draft", img: `${CDN}/4fe97b52-7eca-4995-a9b0-e9caa6d72967_rw_1920.jpg` },
        { name: "Homebase Entrance Signage", img: `${CDN}/66a80833-aa96-4e7a-a62e-6ce882831573_rw_1200.jpg` },
        { name: "Home Base",                   img: `${CDN}/ba29da64-778e-4e6c-a942-02acff420a19_rw_1200.jpg` },
        { name: "Home Base Landscape",         img: `${CDN}/8aabcc1e-b8c3-45e3-aa3d-c56d5911ea03_rw_1920.jpg` },
        { name: "Home Base Landscape",         img: `${CDN}/3ef7ea8e-eec1-4856-b37a-f2d23978aca3_rw_1920.jpg` },
        { name: "Home Base Landscape",         img: `${CDN}/9422ac0b-5ce1-4cca-83fc-660e854c3bb0_rw_1200.jpg` },
        { name: "Home Base Landscape",         img: `${CDN}/04ac8236-413f-4590-a522-dfca01a94fe8_rw_1200.jpg` },
        { name: "Centennial Park — Final Concept", img: `${CDN}/437cf607-c821-4331-8874-d47ecda32ca3_rw_1920.jpg` },
        { name: "Centennial Park — Concepts",  img: `${CDN}/8b43f372-e1ca-4882-b630-bc0d985db4a7_rw_1200.jpg` },
        { name: "Cottesloe Residence",         img: `${CDN}/7c66f9e9-9682-4d93-8bb6-36aa19318e94_rw_1920.jpg` },
        { name: "Cottesloe Residence",         img: `${CDN}/d8d96ede-c60e-4b48-991b-b80f157db3a5_rw_1920.jpg` },
      ],
    },
  ],
  residential: [
    {
      id: "residential-3",
      label: "GARDEN SCULPTURES",
      items: [
        { name: "HUE",         img: "/images/sculptures/hue-dalkieth.jpg" },
        { name: "ESFERA",      img: "/images/sculptures/esfera-fire-burner.jpg" },
        { name: "ORIAN Totem", img: `${CDN}/79a0816f-0847-4bb5-aa06-a9077f7db746_rw_1200.jpg` },
        { name: "MARAKESH",    img: "/images/hero/hero-marakesh-tall.jpg" },
        { name: "YAZAD",       img: `${CDN}/a9ffceab-afdf-47d9-8ba1-53687b469ec4_rw_1200.jpg` },
      ],
    },
  ],
};

const ALL_SERIES = [
  ...COMMISSIONS.commercial,
  ...COMMISSIONS.public,
  ...COMMISSIONS.residential,
];

export const SCULPTURE_ITEMS = (() => {
  const seriesIds = ["public-2", "residential-3"];
  const seen = new Set();
  const items = ALL_SERIES
    .filter(s => seriesIds.includes(s.id))
    .flatMap(s => s.items)
    .filter(item => { if (seen.has(item.img)) return false; seen.add(item.img); return true; });
  return items;
})();

export const CONCEPTS_ITEMS = (() => {
  const seen = new Set();
  return ALL_SERIES
    .filter(s => s.id === "public-7")
    .flatMap(s => s.items)
    .filter(item => { if (seen.has(item.img)) return false; seen.add(item.img); return true; });
})();

// ── Screens feature slideshow — edit slides here ──────────────────────────────
// Each slide: img (path), heading, subheading, body (optional text lines)
// Animation text per slide goes here — James will populate these
export const SCREENS_SLIDESHOW_SLIDES = [
  {
    img: "/images/screens/viasi-mt-lawley-day.jpg",
    heading: "VIASI",
    subheading: "Mt Lawley — Fence Infills & Entry Gate",
    body: "",
  },
  {
    img: "/images/screens/ergo-display-home.jpg",
    heading: "ERGO",
    subheading: "Display Home Interior",
    body: "",
  },
  {
    img: "/images/screens/ergo-cottesloe-gate.jpg",
    heading: "ERGO",
    subheading: "Cottesloe Hotel — Gate",
    body: "",
    objectPosition: "center 85%",
  },
  {
    img: "/images/screens/ergo-fence-northstead.jpg",
    heading: "ERGO",
    subheading: "Fence Infills & Balustrade — Northstead",
    body: "",
    objectPosition: "center 70%",
  },
  {
    img: "/images/screens/homebase-display-2.jpg",
    heading: "HOMEBASE",
    subheading: "Homebase Display — TVC 2015",
    body: "",
    objectPosition: "center 20%",
  },
  {
    img: "/images/screens/eros-pergola-williamstown.jpg",
    heading: "EROS",
    subheading: "Pergola — Williamstown",
    body: "",
    objectPosition: "center 20%",
  },
];

const SCREEN_DESIGNS = [
  // ── THE ICONS (A–Z) ───────────────────────────────────────────────────────
  {
    name: "ASLYIAM", sectionStart: "THE ICONS",
    items: [
      { name: "ASLYIAM",               img: `${CDN}/50c8fb4e-fa4f-459c-89a0-01fb69b9a875_rw_1920.jpg` },
      { name: "ASLYIAM Light Feature", img: `${CDN}/1a26b497-b278-4edc-a050-a2b42e3718d4_rw_1200.jpg` },
      { name: "ASLYIAM",               img: `${CDN}/bb795500-d407-424b-bc89-a099f1c7a24f_rw_1200.jpg` },
      { name: "ASLYIAM",               img: `${CDN}/90166d8d-2652-40c1-8b4f-b0c9a35778af_rw_1200.jpg` },
      { name: "ASLYIAM", img: `${CDN}/783b12fc-1521-44f3-afa8-17b4f1a5e85c_rw_1200.jpg`, slides: [`${CDN}/783b12fc-1521-44f3-afa8-17b4f1a5e85c_rw_1200.jpg`, `${CDN}/f9a69d89-d090-4620-ad47-1569381a5503_rw_1200.jpg`] },
    ],
  },
  {
    name: "LUCARIO",
    tabs: ["icons", "classics"],
    tags: ["dividers"],
    items: [
      { name: "LUCARIO", img: `${CDN}/bf29f83d-b73c-4e2e-89b6-bc0f97489251_rw_1200.jpg`, slides: [`${CDN}/bf29f83d-b73c-4e2e-89b6-bc0f97489251_rw_1200.jpg`, `${CDN}/dfb5f9eb-ba6e-4863-9a8f-e75c77d22339_rw_1200.jpg`] },
      { name: "LUCARIO TDL Landscapes", img: `${CDN}/586176b6-66ff-45c4-afd7-59eaa3da6181_rw_1920.jpg` },
      { name: "LUCARIO Dividers",       img: `${CDN}/0176062d-e9cc-4ed6-8b71-cb1b361b688b_rw_1200.jpg` },
      { name: "LUCARIO",                img: `${CDN}/d8769e63-8cec-44d3-991f-cee986bc6360_rw_1200.jpg` },
      { name: "LUCARIO",                img: `${CDN}/35fe8b17-6414-4ac4-bc5d-977e3feb1ac2_rw_1200.jpg` },
    ],
  },
  {
    name: "ROANDER",
    tabs: ["icons", "classics"],
    items: [
      { name: "ROANDER", img: "/images/roander/roander-1.jpg", pos: "20% center" },
      { name: "ROANDER", img: `${CDN}/b6751fc7-b7c7-4f41-b84d-bb501d184e62_rw_1920.jpg`, slides: [`${CDN}/b6751fc7-b7c7-4f41-b84d-bb501d184e62_rw_1920.jpg`, `${CDN}/f5e2a05d-f862-4427-983a-bfd5b700a9e2_rw_1200.jpg`, `${CDN}/8f61889e-8e26-41b7-9f63-af05771238f7_rw_1200.jpg`] },
    ],
  },
  {
    name: "VIASI",
    tabs: ["icons", "organics"],
    items: [
      { name: "VIASI", img: `${CDN}/db223306-7723-48dc-a4e6-df471493fab8_rw_1920.jpg`, tags: ["light features", "residential", "display homes"] },
      { name: "VIASI", img: `${CDN}/8dd14241-86af-4d62-8a14-6987e02de827_rw_1920.jpg`, tags: ["fencing", "gates", "residential"] },
      { name: "VIASI", img: `${CDN}/37079841-e329-43a9-81ab-614b04773986_rw_1200.jpg`, slides: [`${CDN}/37079841-e329-43a9-81ab-614b04773986_rw_1200.jpg`, `${CDN}/6bac8b33-cc48-4d67-ad5e-f4f6de63ebf5_rw_1200.jpg`, `${CDN}/1d4392ab-4a58-4537-b7ce-9fb1823860dd_rw_1200.jpg`], tags: ["fencing", "gates", "residential"] },
      { name: "VIASI", img: "/images/viasi/viasi-1.jpg", tags: ["fencing", "gates", "residential"] },
      { name: "VIASI", img: "/images/viasi/viasi-3.jpg", tags: ["fencing", "gates", "residential"] },
      { name: "VIASI", img: "/images/viasi/viasi-4.jpg", tags: ["fencing", "gates", "residential"] },
    ],
  },

  // ── THE ARCHITECTURAL (A–Z) ───────────────────────────────────────────────
  { name: "ELLE", sectionStart: "THE ARCHITECTURAL", tabs: ["architectural"], items: [
    { name: "ELLE — Corten Screen", img: "/images/screens/elle-corten.jpg", tags: ["screens", "residential"] },
  ] },
  { name: "CHIOLA", items: [
    { name: "CHIOLA",                       img: `${CDN}/a7051a98-18b5-4a76-bf4f-f9569636a04b_rw_1200.jpg`, tags: ["gates", "residential"] },
    { name: "CHIOLA — Display Home",        img: "/images/chiola/chiola-display-home.jpg", description: "CHIOLA as room divider and window feature in a display home", tags: ["dividers", "residential", "display homes"] },
  ] },
  {
    name: "ERGO",
    tabs: ["icons", "architectural"],
    items: [
      { name: "ERGO Cottesloe Hotel", img: `${CDN}/9ea86aef-4d28-4b92-bb98-5293deef8c93_rw_3840.jpg`, tags: ["divider", "commercial"] },
      { name: "ERGO Cottesloe Hotel", img: `${CDN}/ff393903-5912-40da-9b37-aca22ef599b4_rw_1920.jpg`, tags: ["commercial", "gates"] },
      { name: "ERGO",                 img: `${CDN}/407aaa0c-2e00-4727-8033-fb2d4c493345_rw_1920.jpg`, pos: "left center", tags: ["divider", "residential", "display homes"] },
      { name: "ERGO",                 img: `${CDN}/e3107b10-9669-4608-a72a-6f3d1c796cae_rw_1200.jpg`, tags: ["fencing", "residential"] },
      { name: "ERGO",                 img: `${CDN}/52906986-dcb0-493a-b84b-508165599d56_rw_3840.jpg`, tags: ["fencing", "balustrade", "residential"] },
      { name: "ERGO — Residential",  img: "/images/ergo/ergo-residential.jpg", description: "ERGO residential entrance gates and screen panels", tags: ["fencing", "gates", "residential"] },
      { name: "ERGO",                 img: "/images/screens/ergo-display-home.jpg", pos: "right center", tags: ["divider", "residential", "display homes"] },
    ],
  },
  {
    name: "CUSTOM",
    items: [
      { name: "CUSTOM", img: `${CDN}/0c753703-bc6a-444c-ba4e-b7983f836b30_rw_1200.jpg`, tags: ["gates", "residential"] },
      { name: "CUSTOM — Hollingworth", img: "/images/custom/custom-hollingworth-1.jpg", tags: ["fencing", "gates", "residential"] },
      { name: "CUSTOM — Hollingworth", img: "/images/custom/custom-hollingworth-2.jpg", tags: ["fencing", "gates", "residential"] },
    ],
  },
  {
    name: "EROS",
    items: [
      { name: "EROS",               img: `${CDN}/3e02a9f2-e096-472b-85f8-567a453a710c_rw_1200.jpg` },
      { name: "EROS Pool Compliant", img: `${CDN}/b4e3f929-4c8f-433b-a535-3500ca5058a3_rw_1200.jpg`, slides: [`${CDN}/b4e3f929-4c8f-433b-a535-3500ca5058a3_rw_1200.jpg`, `${CDN}/53ed3716-9227-4116-b4b6-be2973bbb29e_rw_1200.jpg`], tags: ["fencing", "gates", "residential"] },
      { name: "EROS",               img: `${CDN}/ee61c9e8-2d02-434f-9751-5b00c0142edd_rw_1200.jpg` },
      { name: "EROS",               img: "/images/eros/eros-1.jpg", tags: ["fencing", "gates", "residential"] },
      { name: "EROS",               img: "/images/eros/eros-2.jpg", tags: ["fencing", "gates", "residential"] },
      { name: "EROS Canopy / Pergola", img: "/images/eros/eros-3.jpg", tags: ["pergola", "residential"] },
      { name: "EROS Pool Gate",        img: "/images/eros/eros-4.jpg", tags: ["fencing", "gates", "residential"] },
    ],
  },
  {
    name: "EQUISETTI",
    tabs: ["architectural", "light-features"],
    tags: ["light features"],
    items: [
      { name: "EQUISETTI", img: `${CDN}/453b1942-6be0-4365-b111-0affe46a048e_rw_1920.jpg` },
      { name: "EQUISETTI", img: "/images/equisetti/equisetti-1.jpg" },
    ],
  },
  {
    name: "GRAIL",
    tags: ["privacy screens", "dividers"],
    items: [
      { name: "GRAIL",                img: `${CDN}/8a9e1d1b-a7b1-4c28-a1c1-d6a4b0dfee8c_rw_1200.jpg` },
      { name: "GRAIL", description: "Grail privacy screen — under-framed divider and tinted perspex", img: `${CDN}/bfb2cefd-e38d-4cbf-86cb-eb955a34f2f9_rw_3840.jpg` },
      { name: "GRAIL Pool Compliant", img: `${CDN}/72b56ce0-8e7a-4269-a157-c96927dd0683_rw_1920.jpg` },
      { name: "GRAIL — Garage Door",  img: "/images/grail/grail-garage.jpg", description: "GRAIL as inset panels in a timber garage door" },
      { name: "GRAIL — Display",      img: "/images/grail/grail-display.jpg" },
    ],
  },
  {
    name: "HEXO",
    items: [
      { name: "HEXO", img: "/images/hex/lalarook-1.jpg", slides: ["/images/hex/lalarook-1.jpg", "/images/hex/lalarook-2.jpg", "/images/hex/lalarook-copper.jpg"], description: "HEXO — Lalarook Restaurant commercial installation." },
      { name: "HEXO", img: "/images/hex/hex-restaurant.jpg" },
    ],
  },
  {
    name: "ORIEL",
    tags: ["screens", "dividers"],
    items: [
      { name: "ORIEL", img: `${CDN}/314d10c1-5cca-4761-9eb6-7b39034f7a44_rw_1200.jpg`, tags: ["screens", "dividers"] },
      { name: "ORIEL", img: `${CDN}/8e870d8c-8b02-4a6a-82b2-7aed7fc22c83_rw_1920.jpg`, tags: ["fencing", "commercial"] },
    ],
  },
  {
    name: "SABU",
    items: [
      { name: "SABU", img: `${CDN}/42277356-e737-4dca-aae9-3e9121b97db4_rw_1200.jpg`, slides: [`${CDN}/42277356-e737-4dca-aae9-3e9121b97db4_rw_1200.jpg`, `${CDN}/b46cc1c0-5446-4f3d-83ea-3bd918fdf7eb_rw_1920.jpg`] },
    ],
  },
  {
    name: "URO",
    items: [
      { name: "URO", img: `${CDN}/b07ca875-b7c4-4cc6-b61c-91faadf1fa90_rw_1920.jpg`, tags: ["gates", "fencing", "residential"] },
      { name: "URO", img: `${CDN}/99fc46c3-e4c6-4d13-84d5-c0a8b6c33e77_rw_1920.jpg` },
    ],
  },
  {
    name: "ZARATHSTRA",
    items: [
      { name: "ZARATHSTRA — Helvetica Bar", img: "/images/zarathstra/helvetica-bar.jpg", description: "ZARATHSTRA as a full-height commercial divider at Helvetica Bar — Corten finish.", tags: ["dividers", "commercial"] },
      { name: "ZARATHSTRA",                 img: `${CDN}/4c7e2bda-c2ef-4b97-b455-d2791cc51677_rw_1200.jpg`, description: "ZARATHSTRA gate for a residential client in WA south west — Corten powder coat finish.", tags: ["gates", "residential"] },
      { name: "ZARATHSTRA — Kitchen Bench", img: "/images/zarathstra/zarathstra-kitchen-1.jpg", description: "ZARATHSTRA as kitchen bench screen panel — display home", tags: ["screens", "display homes", "residential"] },
    ],
  },

  // ── THE ORGANICS (A–Z) ────────────────────────────────────────────────────
  { name: "BANKSIA", sectionStart: "THE ORGANICS", items: [{ name: "BANKSIA", img: `${CDN}/d9839268-e16d-4adf-8591-580d484748b6_rw_1200.jpg` }] },
  { name: "BLOOM", items: [
    { name: "BLOOM", img: "/images/bloom/bloom-closeup.jpg", pos: "center top", tags: ["screens", "dividers", "residential"] },
    { name: "BLOOM — Light Feature", img: "/images/bloom/bloom-light-feature.jpg", tags: ["light features", "residential"] },
  ]},
  {
    name: "FERLIE",
    tags: ["gates", "fencing"],
    items: [
      { name: "FERLIE", img: `${CDN}/a8f3ce2e-c51d-47fa-bbee-4563523ef01a_rw_1920.jpg`, slides: [`${CDN}/a8f3ce2e-c51d-47fa-bbee-4563523ef01a_rw_1920.jpg`, `${CDN}/bdb61a14-c6db-4b1d-afdb-2f2a4a4fc5e6_rw_1920.jpg`], tags: ["divider", "residential", "display homes"] },
      { name: "FERLIE", img: `${CDN}/029eac2b-60ad-4e18-8069-d6fd0461e636_rw_1920.jpg`, slides: [`${CDN}/029eac2b-60ad-4e18-8069-d6fd0461e636_rw_1920.jpg`, `${CDN}/ba33fe1d-7307-43fa-9673-44619efde183_rw_1920.jpg`], tags: ["divider", "residential"] },
      { name: "FERLIE Maek Architects", img: `${CDN}/8e8bddb1-93fa-475c-913b-7dd82eabdef9_rw_1920.jpg`, tags: ["wall decor", "residential"] },
      { name: "FERLIE",                 img: `${CDN}/679d192a-d3c1-4316-aff1-03ac0d9a6326_rw_1200.jpg`, tags: ["gates", "residential"] },
      { name: "FERLIE",                 img: `${CDN}/87c759cb-528b-4f7e-b17a-6646de8aedca_rw_1200.jpg`, tags: ["divider", "residential"] },
    ],
  },
  { name: "PANGEA",  items: [{ name: "PANGEA",  img: `${CDN}/59a1ba1e-dc20-4f20-a4bf-b0a9d7a13a34_rw_1920.jpg`, tags: ["divider", "commercial"] }] },
  {
    name: "VUELTA",
    tabs: ["icons", "organics"],
    items: [
      { name: "VUELTA",              img: `${CDN}/1fcdb08d-cdb7-4792-8883-01100fee426d_rw_1200.jpg` },
      { name: "VUELTA Aquila Homes", img: `${CDN}/df7270df-1c0c-49b2-ae6f-7eeb7545e953_rw_1920.jpg`, tags: ["fencing", "residential"] },
      { name: "VUELTA",              img: `${CDN}/c9cc882b-cd1b-4ea9-964a-3b0cddd3cb65_rw_1200.jpg`, tags: ["fencing", "residential"] },
      { name: "VUELTA Pergola",      img: "/images/vuelta/vuelta-pergola.jpg", tags: ["pergolas", "awning", "residential"] },
      { name: "VUELTA Balustrade",   img: "/images/vuelta/vuelta-balustrade.jpg", tags: ["balustrade", "residential"] },
    ],
  },
  {
    name: "WATTLE",
    tabs: ["icons", "organics"],
    tags: ["light features", "pergolas"],
    items: [
      { name: "WATTLE", img: `${CDN}/f940abcb-61e1-4097-8525-2be2df42c732_rw_1200.jpg`, tags: ["wall decor", "residential"] },
      { name: "WATTLE Architectural Screen", img: `${CDN}/4f9d07e7-a1ba-4215-b4ed-86dee879d606_rw_600.jpg`, tags: ["wall decor", "residential"] },
      { name: "WATTLE",      img: `${CDN}/ddb014e7-a9d1-43df-8902-f27c1411d25c_rw_1200.jpg`, tags: ["gates", "residential"] },
      { name: "WATTLE Auto", img: `${CDN}/ab946f3b-cf58-4bd7-b219-c383e827944d_rw_1200.jpg`, tags: ["gates", "residential"] },
      { name: "WATTLE",      img: `${CDN}/dc0ca52a-cee0-491c-9f63-7a83b0ae70fd_rw_1200.jpg`, tags: ["gates", "residential"] },
      { name: "WATTLE Light Feature",        img: "/images/wattle/wattle-1.jpg", tags: ["light features", "divider", "commercial"] },
      { name: "WATTLE",                      img: "/images/wattle/wattle-2.jpg", tags: ["light features", "residential"] },
      { name: "WATTLE",                      img: "/images/wattle/wattle-3.jpg", tags: ["fencing", "residential"] },
      { name: "WATTLE",                      img: "/images/wattle/wattle-4.jpg", tags: ["wall decor", "display homes"] },
      { name: "WATTLE Light Feature — Chew Residence", img: "/images/wattle/wattle-5.jpg", tags: ["light features", "residential"] },
      { name: "WATTLE",                      img: "/images/wattle/wattle-6.jpg", tags: ["fencing", "residential"] },
      { name: "WATTLE Architectural Canopy", img: "/images/wattle/wattle-7.jpg", tags: ["awning", "commercial"] },
      { name: "WATTLE Screen",               img: "/images/wattle/wattle-8.jpg", tags: ["fencing", "residential"] },
      { name: "WATTLE Privacy Screen",       img: "/images/wattle/wattle-9.jpg", tags: ["light features", "residential"] },
      { name: "WATTLE Pool Feature",         img: "/images/wattle/wattle-pool-1.jpg", tags: ["light features", "residential"] },
    ],
  },
  { name: "ZED",     items: [{ name: "ZED",     img: `${CDN}/08e92d6e-6d81-4d7b-926f-8ab6ab4c7629_rw_1200.jpg`, tags: ["wall decor", "residential"] }] },

  // ── THE CLASSICS (A–Z) ────────────────────────────────────────────────────
  {
    name: "DOTTI", sectionStart: "THE CLASSICS",
    items: [
      { name: "DOTTI", img: `${CDN}/5d641ee3-f68a-46f0-836e-a439215cb153_rw_1200.jpg`, pos: "right center", tags: ["dividers", "residential", "display homes"] },
      { name: "DOTTI", img: `${CDN}/d0878a20-07d6-43df-84b4-0cfea3ff72b1_rw_1200.jpg`, tags: ["privacy screens", "residential", "display homes"] },
      { name: "DOTTI — Applecross", img: "/images/dotti/dotti-applecross.jpg", tags: ["privacy screens", "residential"] },
      { name: "DOTTI — Platinum", img: "/images/dotti/dotti-platinum.jpg", tags: ["privacy screens", "residential", "display homes"] },
      { name: "DOTTI — Pool", img: "/images/dotti/dotti-pool.jpg", tags: ["privacy screens", "residential"] },
      { name: "DOTTI — Aquilla", img: "/images/dotti/dotti-aquilla.jpg", tags: ["privacy screens", "residential"] },
    ],
  },
  {
    name: "LUMIER",
    items: [
      { name: "LUMIER",                  img: `${CDN}/65df5eb8-8965-49e7-a31c-9fdd5db80da9_rw_1200.jpg`, tags: ["divider", "residential"] },
      { name: "LUMIER Riverstone Homes", img: `${CDN}/b3bcabc9-b1a6-4362-8c1f-fb0cd111b697_rw_1200.jpg`, tags: ["wall decor", "residential", "display homes"] },
      { name: "LUMIER Mirvac Melbourne", img: `${CDN}/0cb8128a-5efd-4474-851e-636aa772a9b4_rw_1920.jpg`, pos: "left center", tags: ["divider", "commercial"] },
    ],
  },
  {
    name: "ORIAN",
    items: [
      { name: "ORIAN", img: "/images/screens/orian-wall-decor.jpg", tags: ["wall decor", "residential"] },
      { name: "ORIAN", img: `${CDN}/faa234c5-9ad4-4613-a5fa-7f0d409b38cf_rw_1920.jpg`, tags: ["privacy screens", "residential"] },
      { name: "ORIAN", img: `${CDN}/cf4e542e-07a7-4e7f-9d93-7f022739b389_rw_1920.jpg`, tags: ["divider", "residential"] },
      { name: "ORIAN", img: "/images/orian/orian-1.jpg", tags: ["gates", "residential"] },
    ],
  },
  {
    name: "RISHIKESH",
    items: [
      { name: "RISHIKESH", img: "/images/rishikesh/rishikesh-2.jpg" },
      { name: "RISHIKESH", img: "/images/rishikesh/rishikesh-3.jpg" },
    ],
  },
  {
    name: "VAYA",
    tags: ["dividers"],
    items: [
      { name: "VAYA", img: `${CDN}/62e39404-9a0d-4aaf-b345-7a5c24162ba0_rw_1200.jpg`, tags: ["dividers", "residential"] },
      { name: "VAYA", img: `${CDN}/f158bc26-4f22-47d2-bee1-ba39cc74113e_rw_1200.jpg`, pos: "left center", tags: ["dividers", "residential", "display homes"] },
    ],
  },
  {
    name: "XAVIER",
    items: [
      { name: "XAVIER",                     img: `${CDN}/c811003e-fc79-4bc1-96fc-8c5b5e9019ba_rw_1200.jpg` },
      { name: "XAVIER Rollingstone Sydney", img: `${CDN}/f3dc2b7b-8496-45da-9ff9-8bc4ba20e8f7_rw_1920.jpg`, tags: ["wall decor", "display homes"] },
      { name: "XAVIER Dale Alcock Display", img: `${CDN}/a6956154-7410-44b9-97ce-e5b66efaeb3c_rw_1920.jpg` },
      { name: "XAVIER",                     img: "/images/xavier/xavier-1.jpg", tags: ["wall decor", "display homes"] },
      { name: "XAVIER",                     img: "/images/xavier/xavier-2.jpg", tags: ["wall decor", "display homes"] },
      { name: "XAVIER",                     img: "/images/xavier/xavier-3.jpg", tags: ["wall decor", "display homes"] },
      { name: "XAVIER",                     img: "/images/xavier/xavier-4.jpg", tags: ["wall decor", "display homes"] },
      { name: "XAVIER — Display Home",      img: "/images/xavier/xavier-display-home.jpg", tags: ["wall decor", "residential", "display homes"] },
      { name: "XAVIER — HIA Show Sydney",    img: "/images/xavier/xavier-hia.jpg", description: "XAVIER — HIA Show Sydney Winning Display" },
    ],
  },
  {
    name: "ZANADA",
    tags: ["gates", "fencing"],
    items: [
      { name: "ZANADA 16mm Aluminium", img: `${CDN}/815b0730-4c38-4163-b3c7-f5c3ac7592ee_rw_1200.jpg`, tags: ["gates", "residential"] },
      { name: "ZANADA Auto",           img: `${CDN}/c9d58bb5-01c5-41be-8bfb-a0f78df67f0c_rw_1200.jpg` },
    ],
  },

  // ── THE INDIES (A–Z) ──────────────────────────────────────────────────────
  { name: "AUDA",    sectionStart: "THE INDIES", items: [{ name: "AUDA",    img: `${CDN}/18320e7a-11d9-401e-be88-2882883feca6_rw_1920.jpg` }] },
  { name: "SPANGLE", items: [{ name: "SPANGLE", img: `${CDN}/59f5ae87-a618-4e13-95ba-fddf818fc3d8_rw_1200.jpg` }] },

  // ── THE MIRRORS ───────────────────────────────────────────────────────────
  { name: "SABAH", sectionStart: "THE MIRRORS", items: [{ name: "SABAH", img: "/images/mirrors/sabah-1.jpg" }] },
];

export const PROJECT_CATEGORIES = [
  { id: "homebase",       label: "Homebase WA" },
  { id: "williamstown",   label: "Williamstown Vic" },
  { id: "fiona-stanley",  label: "Fiona Stanley Hospital WA" },
  { id: "centennial",     label: "Centennial Park WA" },
  { id: "cottesloe",      label: "Cottesloe Hotel WA" },
];

export const PROJECTS_ROWS = [
  {
    id: "projects-homebase",
    name: "HOMEBASE",
    projectCategory: "homebase",
    location: "Subiaco, Western Australia",
    description: "A landmark mixed-use development in Subiaco, Western Australia. ROGETjames was engaged across the full scope of the project — designing the landscape, creating and fabricating a suite of architectural art features, and project managing the commission from concept through to installation. The works include totems, entrance signage, feature sculptures, fire pit elements and landscape art, each conceived to activate the public spaces of the precinct and work in dialogue with the surrounding architecture.",
    items: [
      { name: "HOMEBASE Entrance",      img: "/images/hero/hero-homebase-entrance.jpg" },
      { name: "HOMEBASE",               img: `${CDN}/cffc33df-3d81-460f-b4aa-9f8adc9d81d8_rw_1200.jpg` },
      { name: "Homebase Motif",         img: "/images/homebase/homebase-motif-closeup.jpg" },
      { name: "Homebase Feature",       img: "/images/hero/hero-homebase-sculpture.jpg" },
      { name: "Homebase Landscape Design", img: "/images/hero/hero-homebase-dusk.jpg" },
      { name: "HOMEBASE Totems",        img: "/images/hero/hero-homebase-totems.jpg" },
      { name: "HOMEBASE Fire Pit",      img: `${CDN}/b4fe3827-e371-4bd2-9bb5-1c0b3def3095_rw_1920.jpg` },
      { name: "EVO Planters",           img: `${CDN}/181378db-3310-4b32-8704-00836f3e0cc8_rw_1200.jpg` },
      { name: "EVO Planters",           img: `${CDN}/3826640c-6476-446d-b49c-ba7d1e312544_rw_1200.jpg` },
    ],
  },
  {
    id: "projects-unity",
    name: "UNITY IN DIVERSITY",
    projectCategory: "centennial",
    location: "Centennial Park, Western Australia",
    description: "A significant public art commission at Centennial Park, Western Australia. The selected design was developed through an extensive concept process, culminating in a site-specific installation that celebrates the identity and spirit of the precinct.",
    items: [
      { name: "UNITY IN DIVERSITY", img: `${CDN}/ce906d3c-248e-42c2-a76c-e7547bae20e7_rw_1200.jpg` },
      { name: "Unity in Diversity", img: `${CDN}/6745c491-3d3b-4501-b01c-76a351d2d9d1_rw_1920.jpeg` },
      { name: "UNITY IN DIVERSITY", img: `${CDN}/b32ea229-d756-4e86-9f8e-ddd64ab25e66_rw_1200.jpg` },
      { name: "UNITY IN DIVERSITY", img: `${CDN}/5504bc00-e901-49b2-b14b-337476409a29_rw_1200.jpg` },
      { name: "UNITY IN DIVERSITY", img: `${CDN}/e0829bf1-b7fb-433d-a143-748457e1a18f_rw_1200.jpg` },
    ],
  },
  {
    id: "projects-cottesloe",
    name: "ERGO — COTTESLOE HOTEL",
    projectCategory: "cottesloe",
    location: "Cottesloe, Western Australia",
    hideBehindTheScenes: true,
    description: "Description to be added.",
    items: [
      { name: "ERGO Cottesloe Hotel", img: `${CDN}/9ea86aef-4d28-4b92-bb98-5293deef8c93_rw_3840.jpg`, slides: [`${CDN}/9ea86aef-4d28-4b92-bb98-5293deef8c93_rw_3840.jpg`, `${CDN}/ff393903-5912-40da-9b37-aca22ef599b4_rw_1920.jpg`] },
      { name: "ERGO Cottesloe Hotel — Gates", img: "/images/hero/hero-cottesloe-gate.jpg" },
    ],
  },
  { id: "projects-fiona-stanley",  name: "FIONA STANLEY HOSPITAL", projectCategory: "fiona-stanley",  location: "Murdoch, Western Australia", description: "Fiona Stanley Hospital sits on land with deep indigenous significance — a place of gathering long before the hospital existed. This commission was an artistic homage to that history. ROGETjames designed and fabricated a series of totem sculptures and installations drawing on indigenous motifs, created with respect for Country and a genuine desire to bring meaning, warmth and identity to the spaces people move through every day.", items: [
    { name: "Fiona Stanley",          img: `${CDN}/13dddf44-cb0a-4ad6-a4ac-3b229792d04d_rw_1920.jpg` },
    { name: "DANDELIONS Totems",      img: `${CDN}/14c73030-575d-46e2-ae9e-eb407eb06e16_rw_1200.jpg` },
    { name: "FIONA STANLEY TOTEMS", img: `${CDN}/0bb31cda-116a-4ec4-8c20-5f25f900287c_rw_1200.jpg` },
  ] },
  { id: "projects-williamstown",   name: "WILLIAMSTOWN",            projectCategory: "williamstown",    location: "Williamstown, Victoria", hideBehindTheScenes: true, description: "Description to be added.", items: [
    { name: "EROS Canopy",        img: "/images/eros/eros-3.jpg" },
    { name: "EROS Pool Compliant", img: `${CDN}/b4e3f929-4c8f-433b-a535-3500ca5058a3_rw_1200.jpg` },
    { name: "EROS",               img: "/images/eros/eros-2.jpg" },
    { name: "EROS",               img: "/images/eros/eros-1.jpg" },
  ] },
];

export const SCREENS_CAT_PAGES = [
  ...[31, 32, 33, 34, 35, 36, 37].map(n =>
    `/images/catalogues/cat1/page-${String(n).padStart(2, "0")}.jpg`
  ),
  `/images/catalogues/cat2/page-10.jpg`,
];

export const SCREEN_DESIGNS_SECTIONED = (() => {
  const sectionMap = {
    "THE ICONS":         "icons",
    "THE ARCHITECTURAL": "architectural",
    "THE ORGANICS":      "organics",
    "THE CLASSICS":      "classics",
    "THE INDIES":        "indies",
    "THE MIRRORS":       "mirrors",
  };
  let section = "icons";
  return SCREEN_DESIGNS.map(d => {
    if (d.sectionStart) section = sectionMap[d.sectionStart] ?? section;
    return { ...d, _section: section, _sections: d.tabs ?? [section] };
  });
})();

// Self-maintaining section covers for the private Feature Screens page
// (same model as Gallery.jsx's WALL_ART_COVERS/SCULPTURE_COVERS). Each design
// becomes one piece — its several photos (SCREEN_DESIGNS items) collected as
// slides under the design's own name, rather than shown as separate pieces.
const SCREEN_SECTION_LABELS = {
  icons: "The Icons",
  architectural: "The Architectural",
  organics: "The Organics",
  classics: "The Classics",
  indies: "The Indies",
  mirrors: "The Mirrors",
};
export const SCREEN_COVERS = Object.entries(SCREEN_SECTION_LABELS)
  .map(([id, label]) => {
    const designs = SCREEN_DESIGNS_SECTIONED.filter((d) => d._section === id);
    const pieces = designs
      .map((d) => {
        const imgs = d.items.map((it) => it.img).filter(Boolean);
        if (!imgs.length) return null;
        return imgs.length > 1 ? { name: d.name, img: imgs[0], slides: imgs } : { name: d.name, img: imgs[0] };
      })
      .filter(Boolean);
    if (!pieces.length) return null;
    return { id, label, img: pieces[0].img, pieces };
  })
  .filter(Boolean);

export const SCREEN_TABS = [
  { id: "all",           label: "ALL" },
  { id: "icons",         label: "ICONS" },
  { id: "architectural", label: "ARCHITECTURAL" },
  { id: "organics",      label: "ORGANICS" },
  { id: "classics",      label: "CLASSICS" },
  { id: "indies",        label: "INDIES" },
  { id: "light-features", label: "LIGHT FEATURES" },
  { id: "mirrors",        label: "MIRRORS" },
];

export const SCREEN_SEARCH_SUGGESTIONS = [
  { label: "By Category", items: ["icons", "architectural", "organics", "classics", "indies"] },
  { label: "By Use",      items: ["gates", "fencing", "balustrade", "privacy screens", "dividers", "wall decor", "light features", "pergolas", "awning", "commercial", "residential", "display homes"] },
  { label: "By Design",  items: SCREEN_DESIGNS.map(d => d.name.toLowerCase()) },
];

export const SCULPTURE_SEARCH_SUGGESTIONS = [
  { label: "By Design", items: ["homebase", "xavier", "orian", "marakesh", "hue", "yazad", "dandelions", "centennial park", "fiona stanley", "unity in diversity", "aslyiam", "vuelta"] },
  { label: "By Type", items: ["totem", "sculpture", "planter", "feature"] },
];
