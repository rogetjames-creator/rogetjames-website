// The Screens designs — pure data, lifted out of BespokeCommissions.jsx so the
// build can read it too. A build step runs in plain Node, which cannot parse a
// .jsx file, and the Applications pages are written at build time from these
// same tags. BespokeCommissions imports it straight back, so there is one list.
const CDN = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.DEV)
  ? "/images/cdn-gallery"
  : "/.netlify/images?url=%2Fimages%2Fcdn-gallery";

export const SCREEN_DESIGNS = [
  // ── THE ICONS (A–Z) ───────────────────────────────────────────────────────
  {
    name: "ASLYIAM", sectionStart: "THE ICONS",
    items: [
      { name: "ASLYIAM",               img: `${CDN}/bb795500-d407-424b-bc89-a099f1c7a24f_rw_1200.jpg` },
      { name: "ASLYIAM Cellar Door", img: "/images/uploads/1785936773170_lbq7tk.jpg", tags: ["light features"] },
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
      { name: "VIASI", img: `${CDN}/8dd14241-86af-4d62-8a14-6987e02de827_rw_1920.jpg`, tags: ["fencing", "residential"] },
      { name: "VIASI", img: `${CDN}/37079841-e329-43a9-81ab-614b04773986_rw_1200.jpg`, slides: [`${CDN}/37079841-e329-43a9-81ab-614b04773986_rw_1200.jpg`, `${CDN}/6bac8b33-cc48-4d67-ad5e-f4f6de63ebf5_rw_1200.jpg`, `${CDN}/1d4392ab-4a58-4537-b7ce-9fb1823860dd_rw_1200.jpg`], tags: ["fencing", "gates", "residential"] },
      { name: "VIASI", img: "/images/viasi/viasi-1.jpg", tags: ["fencing", "gates", "residential"] },
      { name: "VIASI", img: "/images/viasi/viasi-3.jpg", tags: ["fencing", "gates", "residential"] },
      { name: "VIASI", img: "/images/viasi/viasi-4.jpg", tags: ["fencing", "residential"] },
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
      { name: "ERGO",                 img: "/images/uploads/1786870478636_qd8g0w.jpg", tags: ["fencing", "balustrade", "residential"] },
      { name: "ERGO — Residential",  img: "/images/ergo/ergo-residential.jpg", description: "ERGO residential entrance gates and screen panels", tags: ["fencing", "gates", "residential"] },
      { name: "ERGO",                 img: "/images/screens/ergo-display-home.jpg", pos: "right center", tags: ["divider", "residential", "display homes"] },
    ],
  },
  {
    name: "EROS",
    items: [
      { name: "EROS",               img: `${CDN}/3e02a9f2-e096-472b-85f8-567a453a710c_rw_1200.jpg` },
      { name: "EROS Pool Compliant", img: `${CDN}/b4e3f929-4c8f-433b-a535-3500ca5058a3_rw_1200.jpg`, slides: [`${CDN}/b4e3f929-4c8f-433b-a535-3500ca5058a3_rw_1200.jpg`, `${CDN}/53ed3716-9227-4116-b4b6-be2973bbb29e_rw_1200.jpg`], tags: ["fencing", "gates", "residential"] },
      { name: "EROS",               img: `${CDN}/ee61c9e8-2d02-434f-9751-5b00c0142edd_rw_1200.jpg` },
      { name: "EROS",               img: "/images/eros/eros-1.jpg", tags: ["fencing", "residential"] },
      { name: "EROS",               img: "/images/eros/eros-2.jpg", tags: ["fencing", "gates", "residential"] },
      { name: "EROS Canopy / Pergola", img: "/images/eros/eros-3.jpg", tags: ["pergola", "residential"] },
      { name: "EROS Pool Gate",        img: "/images/eros/eros-4.jpg", tags: ["gates", "residential"] },
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
  {
    name: "CUSTOM",
    items: [
      { name: "CUSTOM", img: `${CDN}/0c753703-bc6a-444c-ba4e-b7983f836b30_rw_1200.jpg`, tags: ["gates", "residential"] },
      { name: "CUSTOM — Hollingworth", img: "/images/custom/custom-hollingworth-1.jpg", tags: ["fencing", "residential"] },
      { name: "CUSTOM — Hollingworth", img: "/images/custom/custom-hollingworth-2.jpg", tags: ["fencing", "residential"] },
    ],
  },
  { name: "BLOOM", tabs: ["icons", "organics"], items: [
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
      { name: "XAVIER Rollingstone Sydney", img: `${CDN}/f3dc2b7b-8496-45da-9ff9-8bc4ba20e8f7_rw_1920.jpg`, tags: ["wall decor", "display homes"] },
      { name: "XAVIER Dale Alcock Display", img: `${CDN}/a6956154-7410-44b9-97ce-e5b66efaeb3c_rw_1920.jpg` },
      { name: "XAVIER",                     img: "/images/xavier/xavier-1.jpg", tags: ["wall decor", "display homes"] },
      { name: "XAVIER",                     img: "/images/xavier/xavier-2.jpg", tags: ["wall decor", "display homes"] },
      { name: "XAVIER",                     img: "/images/xavier/xavier-3.jpg", tags: ["wall decor", "display homes"] },
      { name: "XAVIER",                     img: "/images/xavier/xavier-4.jpg", tags: ["wall decor", "display homes"] },
      { name: "XAVIER — Display Home",      img: "/images/xavier/xavier-display-home.jpg", tags: ["wall decor", "residential", "display homes"] },
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

  // Cross-listed from Fire & Light (Wall Art) so it also surfaces under the
  // Light Features tab. _crossListed keeps it out of the "All" screens view and
  // the section covers — here it's a light feature, not a general screen design.
  { name: "REEDS of UNGARO", tabs: ["light-features"], tags: ["light features"], _crossListed: true,
    items: [{ name: "REEDS of UNGARO", img: `${CDN}/b03ec13b-fba3-432f-9723-3f646b508054_rw_1920.jpg` }] },
];
