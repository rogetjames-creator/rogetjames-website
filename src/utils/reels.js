import { useEffect, useMemo, useState } from "react";

// The reels, in one place. Both the Discover section and the Bespoke section
// show the same Reels portal, so a new reel is typed out once and appears in
// both. Lives in its own file so neither component file ends up exporting
// something that isn't a component.
export const REELS_PORTAL = {
  id: "reels",
  label: "Reels",
  sublabel: "Behind the Work",
  slides: [],
  videos: [
    { src: "/videos/reels/banksia.mp4",     title: "Banksia",                  detail: "Banksia — a ROGETjames reel.", poster: "/images/reels/banksia-thumb.jpg" },
    { src: "/videos/reels/branches.mp4",    title: "Branches",                 detail: "A close-up reel of the Branches laser-cut design — birds perched on delicate steel branches.", poster: "/images/reels/branches-thumb.jpg" },
    { src: "/videos/reels/b-editions.mp4",  title: "B Editions",               detail: "B Editions — a curated collection reel.", poster: "/images/reels/b-editions-thumb.jpg" },
    { src: "/videos/reels/gren-free.mp4",   title: "GREN Free",                detail: "GREN Free — Branches design.", poster: "/images/reels/gren-free-thumb.jpg" },
    { src: "/videos/reels/rue.mp4",         title: "Rue",                      detail: "Rue — a ROGETjames reel.", poster: "/images/reels/rue-thumb.jpg" },
    { src: "/videos/waroona.mp4",           title: "Waroona",                  detail: "Waroona — a ROGETjames reel.", poster: "/images/reels/waroona-thumb.jpg" },
    { src: "/videos/reels/obliationes.mp4", title: "Obliationes",              detail: "Obliationes — a ROGETjames reel.", poster: "/images/reels/obliationes-thumb.jpg" },
  ],
  popupType: "commissions-gallery",
};

// Uploaded reels (media loader) merge into the Reels portal, so a new reel
// appears without a code change. Falls back to the built-ins if absent.
export function useReelsPortal() {
  const [xReels, setXReels] = useState([]);
  useEffect(() => {
    let ok = true;
    fetch("/reels-manifest.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => { if (ok && Array.isArray(d)) setXReels(d); })
      .catch(() => {});
    return () => { ok = false; };
  }, []);
  return useMemo(() => {
    const extra = xReels
      .filter((x) => x && x.id && x.video && (!Array.isArray(x.targets) || x.targets.includes("reels")))
      .map((x) => ({ src: x.video, title: x.title || x.id, detail: x.detail || "", poster: x.poster || "" }))
      .filter((e) => !REELS_PORTAL.videos.some((v) => v.src === e.src));
    return extra.length
      ? { ...REELS_PORTAL, videos: [...REELS_PORTAL.videos, ...extra] }
      : REELS_PORTAL;
  }, [xReels]);
}
