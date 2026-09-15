import { useEffect, useState } from "react";
import { netlifyImg } from "../utils/img";
import {
  ART_SYMBOL, WORD_FILL, SYMBOL_FILL, SYMBOL_FILTER,
  SEQUENCE, leftSlot, rightSlot, cellsFor,
} from "./heroMark";

// The ART meets design mark, playing inside a portal on black.
//
// The same mark the hero draws, from heroMark.js, but standing still: no
// entrance and no flip-board, just ART meets design. The movement in this
// portal belongs to the pictures behind it.
// The mark itself is fixed here — ART meets design, and nothing else. What
// moves is behind it: two pictures dissolving slowly into one another.
const BACKDROPS = [
  "/images/portals/art-mark-trip.jpg",
  "/images/portals/art-mark-ochre-light-shadow.jpg",
  "/images/portals/art-mark-leaves.jpg",
  "/images/portals/art-mark-tropics.jpg",
];
const BACKDROP_FADE = 5;      // seconds of crossfade
const BACKDROP_HOLD = 6000;   // ms each picture is held before the next fade

export default function ArtMarkPortal({ size = 288, onOpen = null, label = "Sculpture" }) {
  const [backdrop, setBackdrop] = useState(0);

  useEffect(() => {
    if (BACKDROPS.length < 2) return;
    const id = setInterval(() => setBackdrop(i => (i + 1) % BACKDROPS.length), BACKDROP_HOLD + BACKDROP_FADE * 1000);
    return () => clearInterval(id);
  }, []);

  const opening = SEQUENCE[0];
  const lSlot = leftSlot(opening);
  const rSlot = rightSlot(opening);

  return (
    <div className="flex flex-col items-center gap-3">
      <div style={{ position: "relative", display: "inline-block" }}>
        <button
          onClick={onOpen || undefined}
          className={`group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-black ${onOpen ? "cursor-pointer" : "cursor-default"}`}
          style={{
            borderRadius: "50%",
            padding: "9px",
            background: "linear-gradient(180deg, #6a6a6a 0%, #3a3a3a 28%, #1c1c1c 60%, #222222 100%)",
            // The gold ring is not a hover state here — it stays lit.
            boxShadow: "inset 0 -4px 8px rgba(0,0,0,0.65), 0 6px 20px rgba(0,0,0,0.95), 0 0 0 4px #111, 0 0 0 6px rgba(158,113,52,0.85), 0 0 40px 10px rgba(158,113,52,0.22)",
          }}
          aria-label={label}
        >
          <div
            className="relative overflow-hidden flex items-center justify-center"
            style={{ width: `${size}px`, height: `${size}px`, borderRadius: "50%", background: "#000" }}
          >
            {/* Behind the mark: James's two pictures, dissolving slowly into
                one another. Both are already circles filling their frame, so
                they meet the portal's rim exactly. */}
            {BACKDROPS.map((src, i) => (
              <img
                key={src}
                src={netlifyImg(src, { w: Math.round(size * 2.4), q: 82 })}
                alt=""
                role="presentation"
                className="absolute inset-0 w-full h-full object-cover"
                // Each picture is cropped to its own circle before it gets here,
                // then pushed a little past the portal's rim so no edge of it can
                // show. A sliver is cropped; nothing that matters.
                style={{ opacity: i === backdrop ? 1 : 0, transition: `opacity ${BACKDROP_FADE}s ease-in-out`, transform: "scale(1.06)" }}
              />
            ))}

            {/* The mark, sized to sit clear of the circle's edge. */}
            <svg
              viewBox="18 150 1098 880"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="ART meets design"
              role="img"
              style={{ width: "82%", height: "auto", overflow: "visible", position: "relative", zIndex: 2 }}
            >
              <path d={ART_SYMBOL} style={{ fill: SYMBOL_FILL, filter: SYMBOL_FILTER }} />
              <g style={{ fill: WORD_FILL }}>
                {cellsFor(lSlot, opening[0]).map((c, i) => (
                  <g key={i} transform={`translate(${c.x} ${lSlot.baseline})`}>
                    <path d={c.d} />
                  </g>
                ))}
              </g>
              <g style={{ fill: WORD_FILL }}>
                {cellsFor(rSlot, opening[1]).map((c, i) => (
                  <g key={i} transform={`translate(${c.x} ${rSlot.baseline})`}>
                    <path d={c.d} />
                  </g>
                ))}
              </g>
            </svg>

          </div>
        </button>
      </div>
    </div>
  );
}
