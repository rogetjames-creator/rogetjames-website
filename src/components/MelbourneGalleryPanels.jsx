import { useEffect, useMemo, useRef, useState } from "react";
import { netlifyImg } from "../utils/img";
import { IVY_WORDS } from "./ivyModeWords";
import { cityPanelKey } from "../mediaDestinations";
import { useUploadsByKey } from "../utils/mediaUploads";

// ── Melbourne "browse every gallery" panels ───────────────────────────────
// Slim vertical rectangles, one per gallery. Hover expands a panel out to reveal
// its image; click goes to that gallery on the live site. Gallery name runs
// vertically (bottom→top) in IVY MODE (assembled from the supplied alphabet),
// centred down the panel and anchored LEFT so it stays put as a panel opens
// wide. Fixed letter size (STRIP_PX) so every name reads the same size.
const NAME_COLOR = "rgba(194,194,194,0.85)";  // light grey at rest
const NAME_COLOR_ON = "rgba(255,252,246,1)";  // lit, while the panel is open
const STRIP_PX = 18;                          // letter thickness — all names equal
// No pill: the lettering carries a drop shadow so it holds against a pale
// photo, and lights up — brighter, with a soft glow — on the open panel.
const NAME_SHADOW =
  "drop-shadow(0 0 2px rgba(0,0,0,0.95)) drop-shadow(0 2px 5px rgba(0,0,0,0.85)) drop-shadow(0 0 14px rgba(0,0,0,0.6))";
const NAME_SHADOW_ON =
  "drop-shadow(0 0 2px rgba(0,0,0,0.85)) drop-shadow(0 2px 6px rgba(0,0,0,0.8)) drop-shadow(0 0 10px rgba(255,246,228,0.55)) drop-shadow(0 0 26px rgba(255,238,205,0.35))";

// One assembled IVY MODE word, sized to a fixed strip thickness (height auto so
// longer names just run taller). fill:currentColor picks up NAME_COLOR.
function IvyWord({ name, className = "", lit = false }) {
  const w = IVY_WORDS[name.toUpperCase()];
  if (!w) return null;
  return (
    <svg
      viewBox={w.viewBox}
      className={className}
      style={{
        width: STRIP_PX,
        height: "auto",
        color: lit ? NAME_COLOR_ON : NAME_COLOR,
        filter: lit ? NAME_SHADOW_ON : NAME_SHADOW,
        transition: "color 0.55s ease, filter 0.55s ease",
      }}
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

  // Read the row's size. Called as the mouse ENTERS a panel — not from an
  // effect — so the measurement is always there before it is needed. A resize
  // observer alone was not enough: its callbacks ride on animation frames, so
  // in a background or hidden window it may never deliver, and the panels
  // would then be measured for the first time mid-hover.
  // A zero reading (hidden tab, collapsed window) is ignored — the last good
  // measurement is kept instead.
  const measureRow = () => {
    const el = rowRef.current;
    if (!el || !el.clientWidth) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    setRow((prev) =>
      prev && prev.w === el.clientWidth && prev.h === el.clientHeight && prev.gap === gap
        ? prev
        : { w: el.clientWidth, h: el.clientHeight, gap }
    );
  };

  // Keep it current when the window is resized mid-hover.
  useEffect(() => {
    const el = rowRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measureRow);
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
  //
  // EVERY state is a pixel width, resting included. That matters: if closing
  // switched back to letting flex share the row, the panel would snap shut
  // instead of easing, the edges would jump under the cursor, and the panel now
  // under it would open — on and on. Same model throughout, so it always eases.
  const n = panels.length;
  const spare = row ? Math.max(0, row.w - row.gap * (n - 1)) : 0;
  const widthOf = (i) => {
    if (!spare) return null;             // first paint, before the row is measured
    if (hover === null) return spare / n; // resting — an even share each
    const cap = spare - MIN_COLLAPSED_PX * (n - 1);
    const shape = shapes[panels[hover]?.name];
    // The picture's own width at panel height. Until it has loaded, open on a
    // plain 5-to-1 share so the panel still moves.
    const open = Math.min(shape ? row.h * shape : (spare * 5) / (n + 4), cap);
    return i === hover ? open : (spare - open) / (n - 1);
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
                onMouseEnter={() => { measureRow(); setHover(i); }}
                onMouseLeave={() => setHover(null)}
                className="group relative overflow-hidden rounded-lg cursor-pointer block"
                style={
                  // Measured: each panel is given an exact width. Before that
                  // (and if a picture never loads) fall back to sharing the row.
                  px !== null
                    // Shrink is allowed (0 1) so a fraction of a pixel of
                    // rounding is absorbed rather than overflowing the row —
                    // an overflow would raise a scrollbar, which resizes the
                    // row, which recomputes the widths, on and on.
                    ? { flex: `0 1 ${px}px`, transition: OPEN_EASE }
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

                {/* Gallery name — IVY MODE, centred down the panel and held
                    LEFT so it stays put as the panel opens. No pill: a drop
                    shadow holds it against the photo, and it lights up while
                    the panel is open. */}
                <div className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <IvyWord name={p.name} lit={active} />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
