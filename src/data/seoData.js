// The one place the site's business and artist details live for search
// engines (structured data). scripts/build-jsonld.mjs reads this after every
// build and writes ONE linked @graph into each indexable page, so every page
// points at the same ROGETjames and the same James Roget.
//
// Facts only — every value here was already on the site (index.html,
// perth.html) before 27 Nov 2026. Never add an address, price, rating or
// review that James has not given.
//
// Organization, not LocalBusiness: there is no street address to publish,
// and LocalBusiness without one draws warnings (James, 27 Nov 2026).

export const SITE = "https://rogetjames.com";
export const ORG_ID = `${SITE}/#org`;
export const PERSON_ID = `${SITE}/#james-roget`;
export const WEBSITE_ID = `${SITE}/#website`;

export const ORG = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "ROGETjames",
  alternateName: ["Q DESIGN Architectural Features", "qdesign.net"],
  url: `${SITE}/`,
  logo: { "@type": "ImageObject", url: `${SITE}/images/roj-logo.png` },
  image: `${SITE}/images/hero/hero-banksia-oldmanis.jpg`,
  email: "james@rogetjames.com",
  telephone: "+61488878073",
  foundingDate: "2008",
  founder: { "@id": PERSON_ID },
  // Australia first — most work is interstate. Every city the site already
  // listed stays (James, 27 Nov 2026: never narrow it).
  areaServed: [
    { "@type": "Country", name: "Australia" },
    ...["Perth", "Melbourne", "Sydney", "Brisbane", "Adelaide", "Gold Coast", "Canberra", "Hobart", "Darwin"]
      .map((name) => ({ "@type": "City", name })),
  ],
  sameAs: [
    "https://instagram.com/rogetjames/",
    "https://www.pinterest.com/ROGETjamesArtDesign/",
    "https://youtube.com/@jamesroget4318",
    "https://www.wikidata.org/wiki/Q142119246",
  ],
};

export const PERSON = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "James Roget",
  url: `${SITE}/`,
  description:
    "Australian laser-cut artist and designer. Founder of ROGETjames, formerly known as Q DESIGN Architectural Features and qdesign.net (Subiaco, Perth), creating original wall art, sculpture, and architectural features in Corten steel, stainless steel and powdercoated aluminium since 2008.",
  hasOccupation: { "@type": "Occupation", name: "Laser-cut Artist & Designer" },
  knowsAbout: ["Laser cutting", "Corten steel", "Architectural metalwork", "Public art commissions"],
  worksFor: { "@id": ORG_ID },
  sameAs: [
    "https://instagram.com/rogetjames/",
    "https://www.pinterest.com/ROGETjamesArtDesign/",
    "https://youtube.com/@jamesroget4318",
    "https://www.wikidata.org/wiki/Q142119243",
  ],
};

// Home page only.
export const WEBSITE = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: "ROGETjames",
  url: `${SITE}/`,
  publisher: { "@id": ORG_ID },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE}/wall-art?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

// Screen design pages (/screens/<design>) are marked up as Product, as James
// asked (27 Nov 2026), with no offers block because prices are never shown
// openly. By design this will NOT produce Product rich results: Google wants
// offers, review or aggregateRating before it shows one.
export const SCREEN_DESIGN_TYPE = "Product";

// The three materials, as captions spell them.
export const MATERIALS = ["Corten steel", "stainless steel", "powder-coated aluminium"];
