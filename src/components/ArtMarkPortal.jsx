import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  ART_SYMBOL, WORD_FILL, SYMBOL_FILL, SYMBOL_FILTER,
  SEQUENCE, leftSlot, rightSlot, cellsFor, MEETS_CELLS, DESIGN_CELLS,
  FLIP_EVERY, FLIP_STAGGER, FLIP_DOWN, FLIP_UP,
} from "./heroMark";

// The ART meets design mark, playing inside a portal on black.
//
// Same mark and same flip-board as the hero, drawn from heroMark.js so there is
// one set of letters and one sequence of phrases. What is different here: the
// hero's long entrance is gone — this one is already assembled and simply keeps
// turning — and every element is reached through a ref rather than a DOM id, so
// the two marks can never animate each other.
export default function ArtMarkPortal({ size = 288, onOpen = null, label = "Sculpture" }) {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    const at = { i: 0 };

    const hostFor = (slot) => (slot.side === "left" ? leftRef.current : rightRef.current);

    const flipSlot = (slot, key) => {
      const host = hostFor(slot);
      if (!host) return;
      const cells = [...host.querySelectorAll(".flip-cell")];
      const next = cellsFor(slot, key);
      cells.forEach((cell, i) => {
        const path = cell.querySelector("path");
        const target = next[i];
        // Written by hand rather than through GSAP's transform system — the
        // glyphs sit on a baseline of y=0, so scale(1, sy) folds the letter
        // straight down onto the line and back, exactly as in the hero.
        const st = { sy: 1, x: parseFloat(cell.dataset.x || "0") };
        const write = () => cell.setAttribute(
          "transform", `translate(${st.x} ${slot.baseline}) scale(1 ${st.sy})`);
        gsap.timeline({ delay: i * FLIP_STAGGER })
          .to(st, { sy: 0, duration: FLIP_DOWN, ease: "power2.in", onUpdate: write })
          .to(cell, { opacity: 0.55, duration: 0.01 }, "<0.14")
          .add(() => {
            path.setAttribute("d", target ? target.d : "");
            if (target) { st.x = target.x; cell.dataset.x = target.x; }
            write();
          })
          .to(st, { sy: target ? 1 : 0, duration: FLIP_UP, ease: "power2.out", onUpdate: write })
          .to(cell, { opacity: target ? 1 : 0, duration: FLIP_UP * 0.6 }, "<");
      });
    };

    const id = setInterval(() => {
      at.i = (at.i + 1) % SEQUENCE.length;
      const entry = SEQUENCE[at.i];
      flipSlot({ ...leftSlot(entry),  side: "left"  }, entry[0]);
      flipSlot({ ...rightSlot(entry), side: "right" }, entry[1]);
    }, FLIP_EVERY * 1000);
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
            {/* The mark, sized to sit clear of the circle's edge. */}
            <svg
              viewBox="18 150 1098 880"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="ART meets design"
              role="img"
              style={{ width: "82%", height: "auto", overflow: "visible" }}
            >
              <path d={ART_SYMBOL} style={{ fill: SYMBOL_FILL, filter: SYMBOL_FILTER }} />
              <g ref={leftRef} style={{ fill: WORD_FILL }}>
                {Array.from({ length: MEETS_CELLS }, (_, i) => {
                  const c = cellsFor(lSlot, opening[0])[i];
                  return (
                    <g key={i} className="flip-cell" data-x={c ? c.x : 0}
                       transform={`translate(${c ? c.x : 0} ${lSlot.baseline}) scale(1 1)`}
                       style={c ? undefined : { opacity: 0 }}>
                      <path d={c ? c.d : ""} />
                    </g>
                  );
                })}
              </g>
              <g ref={rightRef} style={{ fill: WORD_FILL }}>
                {Array.from({ length: DESIGN_CELLS }, (_, i) => {
                  const c = cellsFor(rSlot, opening[1])[i];
                  return (
                    <g key={i} className="flip-cell" data-x={c ? c.x : 0}
                       transform={`translate(${c ? c.x : 0} ${rSlot.baseline}) scale(1 1)`}
                       style={c ? undefined : { opacity: 0 }}>
                      <path d={c ? c.d : ""} />
                    </g>
                  );
                })}
              </g>
            </svg>

          </div>
        </button>
      </div>
    </div>
  );
}
