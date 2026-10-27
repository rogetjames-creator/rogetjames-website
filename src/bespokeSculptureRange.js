// Bespoke Sculpture at /bespoke-sculpture — the same "range" gallery as
// /screens (pills per gallery, slideshow strip, design pills, no prices).
// Galleries and their pictures exactly as James assigned them, 28 Oct 2026.
// The old flat popup (SculptureGalleryModal) is left intact as a rollback copy.
import { mountRangeGallery } from "./rangeGalleryApp";

const CDN = "/images/cdn-gallery";

// Gallery → designs, in James's order. One design can hold several photos.
const GALLERIES = [
  { label: "PUBLIC ART", designs: [
    { n: "UNITY IN DIVERSITY", imgs: [
      `${CDN}/ce906d3c-248e-42c2-a76c-e7547bae20e7_rw_1200.jpg`,
      `${CDN}/5504bc00-e901-49b2-b14b-337476409a29_rw_1200.jpg`,
      `${CDN}/6745c491-3d3b-4501-b01c-76a351d2d9d1_rw_1920.jpeg`,
      "/images/uploads/1785745463839_tie649.jpg",
    ] },
    { n: "Fiona Stanley", imgs: [`${CDN}/13dddf44-cb0a-4ad6-a4ac-3b229792d04d_rw_1920.jpg`] },
    { n: "BALGA MIA MIA — Fiona Stanley Hospital Sculpture Park", imgs: [
      `${CDN}/14c73030-575d-46e2-ae9e-eb407eb06e16_rw_1200.jpg`,
      `${CDN}/0bb31cda-116a-4ec4-8c20-5f25f900287c_rw_1200.jpg`,
    ] },
  ] },
  { label: "COMMERCIAL", designs: [
    { n: "MARAKESH TRIO (Custom)", imgs: [
      "/images/hero/hero-marakesh-tall.jpg",
      `${CDN}/931545f6-0a20-4f80-8707-7f6367b77839_rw_1920.jpg`,
    ] },
    { n: "Totems — Homebase Design Centre, Subiaco, Perth WA", imgs: ["/images/hero/hero-homebase-totems.jpg"] },
    { n: "Entrance — Homebase Design Centre, Subiaco, Perth WA", imgs: ["/images/hero/hero-homebase-entrance.jpg"] },
    { n: "Motif — Homebase Design Centre, Subiaco, Perth WA", imgs: ["/images/homebase/homebase-motif-closeup.jpg"] },
    { n: "Feature — Homebase Design Centre, Subiaco, Perth WA", imgs: [
      `${CDN}/cffc33df-3d81-460f-b4aa-9f8adc9d81d8_rw_1200.jpg`,
      `${CDN}/68de0a24-fad7-4ca7-815c-c69bc555e26b_rw_1200.jpg`,
    ] },
  ] },
  { label: "PLANTERS", designs: [
    { n: "REVO Planter", imgs: [`${CDN}/65b28727-1582-4a73-9cef-d8da2edcf885_rw_1200.jpg`] },
    { n: "EVO Planters", imgs: [
      `${CDN}/181378db-3310-4b32-8704-00836f3e0cc8_rw_1200.jpg`,
      `${CDN}/3826640c-6476-446d-b49c-ba7d1e312544_rw_1200.jpg`,
    ] },
  ] },
  { label: "RESIDENTIAL", designs: [
    { n: "HUE", imgs: [
      "/images/sculptures/hue-dalkieth.jpg",
      "/images/uploads/1784898045994_5s59zd.jpg",
    ] },
  ] },
];

// Into the range-gallery shape:
//   { imgs:[…urls…], ranges:[{ label, count, designs:[{n,imgs:[idx]}], flat:[[design,variant]] }] }
function buildData() {
  const imgs = [];
  const idxOf = (src) => { let i = imgs.indexOf(src); if (i < 0) { i = imgs.length; imgs.push(src); } return i; };
  const ranges = GALLERIES.map((g) => {
    const designs = g.designs.map((d) => ({ n: d.n, imgs: d.imgs.map(idxOf) }));
    const flat = [];
    designs.forEach((d, di) => d.imgs.forEach((_, vi) => flat.push([di, vi])));
    return { label: g.label, count: designs.length, designs, flat };
  });
  return { imgs, ranges };
}

export function mountBespokeSculptureRange(rootId) {
  mountRangeGallery({
    rootId,
    data: buildData(),
    label: "Bespoke Sculpture",
    noun: "sculpture",
    section: "bespoke-sculpture",
    rangeWord: "Range",
    pricing: false,
    designPills: true,
    viewLabel: "View design",
    // Over the slideshow strip: "Bespoke Sculpture", not "The Range".
    bandTitle: `<span class="w2">Bespoke</span> Sculpture`,
  });
}
