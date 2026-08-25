import { useEffect, useMemo, useRef, useState } from "react";
import { netlifyImg } from "../utils/img";
import { IVY_WORDS } from "./ivyModeWords";
import { cityPanelKey } from "../mediaDestinations";
import { useUploadsByKey } from "../utils/mediaUploads";

// ── Melbourne "browse every gallery" panels ───────────────────────────────
// Slim vertical rectangles, one per gallery. Hover expands a panel out to reveal
// its image; click goes to that gallery on the live site. Gallery name runs
// vertically (bottom→top) in IVY MODE (assembled from the supplied alphabet),
// light grey, 85% opaque (15% transparent), on a dark pill anchored top-LEFT
// so it stays left when a panel expands. Fixed letter size (STRIP_PX) so every
// name reads the same size.
const NAME_COLOR = "rgba(194,194,194,0.85)"; // light grey, 85% opaque
const STRIP_PX = 18;                          // letter thickness — all names equal
// The lettering sits on a dark pill (below) rather than carrying a shadow —
// a shadow was not enough to hold it against a pale photo.

// One assembled IVY MODE word, sized to a fixed strip thickness (height auto so
// longer names just run taller). fill:currentColor picks up NAME_COLOR.
function IvyWord({ name, className = "" }) {
  const w = IVY_WORDS[name.toUpperCase()];
  if (!w) return null;
  return (
    <svg
      viewBox={w.viewBox}
      className={className}
      style={{ width: STRIP_PX, height: "auto", color: NAME_COLOR }}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={name}
    >
      <g transform={w.outer}>
        {w.groups.map((g, i) => (
          <g key={i} transform={`translate(${g.t} 0)`}><path d={g.d} /></g>
        ))}
      </g>
    </svg>
  );
}

const PANELS = [
  { name: "Wall Art",          img: "/images/banksia/banksia-framed-rust.jpg", href: "https://rogetjames.com/wall-art" },
  { name: "Sculpture",         img: "/images/autumn-leaf/autumn-leafs-wg.jpg",                                href: "https://rogetjames.com/sculpture" },
  { name: "Screens",           img: "/images/cdn-gallery/f940abcb-61e1-4097-8525-2be2df42c732_rw_1200.jpg",  href: "https://rogetjames.com/?open=screens" },
  { name: "Bespoke Sculpture", img: "/images/uploads/1785745463839_tie649.jpg",                              href: "https://rogetjames.com/?open=sculpture" },
  { name: "Projects",          img: "/images/eros/eros-3.jpg",                                              href: "https://rogetjames.com/?open=projects" },
  { name: "Commissions",       img: "/images/cdn-gallery/e6796e77-b853-4fca-99ee-5915afe3f048_rw_1920.jpg",  href: "https://rogetjames.com/?open=commissions" },
  { name: "Concepts",          img: "/images/cdn-gallery/cdd20f14-69b8-4224-ab94-80bc4a4b42bf_rw_1200.jpg",  href: "https://rogetjames.com/?open=concepts" },
  { name: "Concrete",          img: null,                                                                     href: "https://rogetjames.com/#bespoke" },
];

// The panels are shared by every city page. `city` is the slug used in the
// /media destination key, so each city gets its own set of pictures.
// A city can drop a panel it does not want — Melbourne shows Wall Art,
// Sculpture, Screens and Bespoke Sculpture only.
const HIDDEN_BY_CITY = { melbourne: ["Concrete", "Concepts", "Commissions", "Projects"] };
const panelsFor = (city) =>
  PANELS.filter((p) => !(HIDDEN_BY_CITY[city] || []).includes(p.name));

// Panel names a given city actually shows — /media only offers these as
// upload destinations, so no photo can be filed to a panel that isn't there.
export const CITY_PANEL_NAMES_FOR = (city) => panelsFor(city).map((p) => p.name);

// How wide a hovered panel opens: its picture's OWN width at panel height, so
// the photo is shown whole rather than blown up. A collapsed panel never gets
// thinner than this, so its name always stays readable.
const MIN_COLLAPSED_PX = 56;
// Slow and soft — the panel eases open rather than snapping.
const OPEN_EASE = "flex-basis 0.9s cubic-bezier(0.22, 1, 0.36, 1)";

export default function MelbourneGalleryPanels({ city = "melbourne" }) {
  const [hover, setHover] = useState(null);
  // The row's own size, and each picture's true shape — both measured, because
  // the width a panel opens to is worked out from them.
  const rowRef = useRef(null);
  const [row, setRow] = useState(null);      // { w, h, gap }
  const [shapes, setShapes] = useState({});  // panel name -> width ÷ height

  useEffect(() => {
    const el = rowRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      setRow({ w: el.clientWidth, h: el.clientHeight, gap });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // A photo uploaded to a panel REPLACES that panel's picture — newest wins.
  const shown = useMemo(() => panelsFor(city), [city]);
  const keys = useMemo(() => shown.map((p) => cityPanelKey(city, p.name)), [shown, city]);
  const uploads = useUploadsByKey(keys);
  const panels = useMemo(
    () => shown.map((p) => {
      const hits = uploads[cityPanelKey(city, p.name)];
      return hits?.length ? { ...p, img: hits[hits.length - 1].img } : p;
    }),
    [uploads, shown, city]
  );

  // The width each panel should be right now, in pixels. Everything shares the
  // row evenly until one is hovered; that one opens to its picture's true width
  // and the others give up the difference between them.
  const n = panels.length;
  const spare = row ? Math.max(0, row.w - row.gap * (n - 1)) : 0;
  const openShape = hover !== null ? shapes[panels[hover]?.name] : null;
  const openWidth = openShape
    ? Math.min(row.h * openShape, spare - MIN_COLLAPSED_PX * (n - 1))
    : null;
  const widthOf = (i) => {
    if (!spare) return null;                       // not measured yet
    if (hover === null || !openWidth) return null; // even, or picture not sized yet
    return i === hover ? openWidth : (spare - openWidth) / (n - 1);
  };

  return (
    <section className="bg-jet pb-20 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div ref={rowRef} className="flex gap-1.5 md:gap-2 w-full h-[60vh] min-h-[380px] max-h-[660px]">
          {panels.map((p, i) => {
            const active = hover === i;
            const px = widthOf(i);
            return (
              <a
                key={p.name}
                href={p.href}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className="group relative overflow-hidden rounded-lg cursor-pointer block"
                style={
                  // Measured: each panel is given an exact width. Before that
                  // (and if a picture never loads) fall back to sharing the row.
                  px !== null
                    ? { flex: `0 0 ${px}px`, transition: OPEN_EASE }
                    : { flexGrow: active ? 5 : 1, flexBasis: 0, transition: "flex-grow 0.9s cubic-bezier(0.22, 1, 0.36, 1)" }
                }
              >
                {p.img ? (
                  <img
                    src={netlifyImg(p.img, { w: 1000, q: 80 })}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    onLoad={(e) => {
                      const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
                      if (!w || !h) return;
                      setShapes((prev) => (prev[p.name] ? prev : { ...prev, [p.name]: w / h }));
                    }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-b from-graphite to-onyx" />
                )}

                {/* Gallery name — IVY MODE, top-LEFT, stays left on expand.
                    It sits on a dark pill that runs out of the TOP of the panel:
                    square across the top, fully rounded at the bottom. */}
                <div className="absolute top-0 left-4 md:left-5 pointer-events-none">
                  <div className="flex justify-center rounded-b-full bg-black/55 backdrop-blur-[2px] px-3 pt-6 pb-5">
                    <IvyWord name={p.name} />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
