import { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, House, Link2, Check } from "lucide-react";

// Maps a catalogue's label to its shareable link so the Copy-link button always
// hands out a URL that actually reopens this catalogue.
const SHARE_PATH = {
  "Wall Art & Screens": "?catalogue=wallart",
  "Sculpture, Light Features & Mirrors": "?catalogue=sculpture",
  "Dulux Colours": "?catalogue=dulux",
  "Interpon Colours": "?catalogue=interpon",
  "Wall Art Catalogue": "?view=wallartcat",
  "Sculpture Catalogue": "?view=sculpturecat",
};

/**
 * Simple full-screen catalogue page viewer.
 * - Click left/right half of image to navigate
 * - Zoom button opens full-res scrollable view
 * - Thumbnail strip at bottom
 * Props: pages[], label, onClose, onCloseAll (optional back-to-home)
 */
export default function CatPageViewer({ pages, label, onClose, onCloseAll }) {
  const [page, setPage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [copied, setCopied] = useState(false);
  const total = pages.length;
  const thumbsRef = useRef(null);
  const sharePath = SHARE_PATH[label];

  const copyLink = () => {
    if (!sharePath) return;
    const url = window.location.origin + window.location.pathname + sharePath;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const go = (dir) => setPage(p => Math.max(0, Math.min(total - 1, p + dir)));
  const goTo = (i) => setPage(i);

  // Hover-scroll the thumbnail strip: the middle is a dead zone, and as the
  // cursor nears an edge the strip scrolls that way continuously — speed ramps
  // up the closer you get to the edge. Gentle and gradual, never a jump.
  const hoverVelRef = useRef(0);
  const rafRef = useRef(null);
  const stopHoverScroll = () => {
    hoverVelRef.current = 0;
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  };
  const onThumbHover = (e) => {
    const strip = thumbsRef.current;
    if (!strip || strip.scrollWidth - strip.clientWidth <= 0) { stopHoverScroll(); return; }
    const rect = strip.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width; // 0..1
    const EDGE = 0.3;      // outer 30% each side is the active zone
    const MAX_SPEED = 8;   // px per frame at the very edge
    let vel = 0;
    if (ratio < EDGE)          vel = -MAX_SPEED * (EDGE - ratio) / EDGE;
    else if (ratio > 1 - EDGE) vel =  MAX_SPEED * (ratio - (1 - EDGE)) / EDGE;
    hoverVelRef.current = vel;
    if (vel && !rafRef.current) {
      const tick = () => {
        const s = thumbsRef.current;
        if (!s || !hoverVelRef.current) { rafRef.current = null; return; }
        const m = s.scrollWidth - s.clientWidth;
        s.scrollLeft = Math.max(0, Math.min(m, s.scrollLeft + hoverVelRef.current));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }
  };
  useEffect(() => stopHoverScroll, []);

  // Scroll active thumb into view
  useEffect(() => {
    const strip = thumbsRef.current;
    if (!strip) return;
    const thumb = strip.children[page];
    thumb?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [page]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") { if (zoomed) { setZoomed(false); return; } onClose(); }
      if (e.key === "ArrowLeft")  go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, zoomed, total]);

  // Block casual copy/download (right-click + drag + touch save) without touching
  // image quality — catalogues stay full original resolution, no watermark.
  const noCopy = { onContextMenu: (e) => e.preventDefault(), onDragStart: (e) => e.preventDefault() };
  const noCopyImg = { draggable: false, onDragStart: (e) => e.preventDefault(), style: { WebkitUserSelect: "none", userSelect: "none", WebkitTouchCallout: "none", WebkitUserDrag: "none" } };

  return (
    <>
      <div {...noCopy} className="fixed inset-0 z-[10010] flex flex-col bg-[#0a0a0a]">

        {/* Header */}
        <div className="flex-none px-5 py-3.5 flex items-center gap-3 border-b border-white/10">
          {onCloseAll && (
            <button onClick={onCloseAll} title="Back to all catalogues" aria-label="Back to all catalogues"
              className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-cream/40 hover:text-cream hover:bg-white/15 transition-all flex-none">
              <House size={13} />
            </button>
          )}
          <span className="font-heading text-cream text-sm tracking-[0.2em] uppercase flex-1">{label}</span>
          <span className="text-cream/40 text-xs font-detail">{page + 1} / {total}</span>
          {sharePath && (
            <div className="relative group/copy flex-none">
              <button onClick={copyLink} aria-label="Copy a link to this catalogue"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${copied ? "bg-clay text-cream" : "bg-white/10 text-cream/50 hover:text-cream"}`}>
                {copied ? <Check size={14} /> : <Link2 size={14} />}
              </button>
              {/* Instant custom tooltip — the native title attribute only appears
                  after ~1s and feels unresponsive; this fades in on hover at once. */}
              <span className="pointer-events-none absolute top-full right-0 mt-2 whitespace-nowrap rounded-lg bg-black/90 border border-white/10 px-2.5 py-1.5 text-[11px] font-detail text-cream/90 opacity-0 translate-y-1 group-hover/copy:opacity-100 group-hover/copy:translate-y-0 transition-all duration-150 z-10">
                {copied ? "Link copied" : "Copy a link to this catalogue to send"}
              </span>
            </div>
          )}
          <button onClick={() => setZoomed(true)} title="Zoom in / full screen" aria-label="Zoom in / full screen"
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-cream/50 hover:text-cream transition-colors">
            <ZoomIn size={14} />
          </button>
          <button onClick={onClose} title="Close" aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-cream/70 hover:text-cream transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* Main page — click left/right halves to navigate */}
        <div className="flex-1 relative flex items-center justify-center bg-black/40 min-h-0 overflow-hidden">
          <img src={pages[page]} alt={`Page ${page + 1}`} {...noCopyImg}
            className="max-h-full max-w-full object-contain pointer-events-none select-none" />

          {page > 0 && (
            <div onClick={() => go(-1)}
              className="absolute inset-y-0 left-0 w-1/2 cursor-pointer flex items-center justify-start pl-4 group/prev">
              <div className="w-9 h-9 rounded-full bg-black/60 border border-white/15 flex items-center justify-center text-cream/0 group-hover/prev:text-cream/80 transition-colors">
                <ChevronLeft size={16} />
              </div>
            </div>
          )}

          {page < total - 1 && (
            <div onClick={() => go(1)}
              className="absolute inset-y-0 right-0 w-1/2 cursor-pointer flex items-center justify-end pr-4 group/next">
              <div className="w-9 h-9 rounded-full bg-black/60 border border-white/15 flex items-center justify-center text-cream/0 group-hover/next:text-cream/80 transition-colors">
                <ChevronRight size={16} />
              </div>
            </div>
          )}
        </div>

        {/* Thumbnail strip — large, ~6 visible, scrollable */}
        <div ref={thumbsRef} onMouseMove={onThumbHover} onMouseLeave={stopHoverScroll} className="flex-none px-4 py-3 flex gap-2 overflow-x-auto bg-black/30"
          style={{ scrollbarWidth: "none", height: 110 }}>
          {pages.map((src, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`flex-none rounded-lg overflow-hidden border transition-all duration-200 ${
                i === page ? "border-clay opacity-100 scale-105" : "border-white/10 opacity-45 hover:opacity-75"
              }`}
              style={{ height: 82, width: 62 }}>
              <img src={src} alt={`${label} page ${i + 1}`} {...noCopyImg} className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {/* Zoom overlay — full-res scrollable */}
      {zoomed && (
        <div {...noCopy} className="fixed inset-0 z-[10011] bg-black/97 flex flex-col">
          <div className="flex-none flex items-center justify-between px-5 py-3 border-b border-white/10">
            <span className="font-detail text-xs text-cream/40 uppercase tracking-[0.2em]">
              Page {page + 1} of {total}
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => go(-1)} disabled={page === 0}
                className="w-8 h-8 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-cream/60 hover:text-cream disabled:opacity-25 disabled:pointer-events-none transition-all">
                <ChevronLeft size={15} />
              </button>
              <button onClick={() => go(1)} disabled={page >= total - 1}
                className="w-8 h-8 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-cream/60 hover:text-cream disabled:opacity-25 disabled:pointer-events-none transition-all">
                <ChevronRight size={15} />
              </button>
              <button onClick={() => setZoomed(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 border border-white/10 text-cream/70 hover:text-cream hover:bg-white/15 transition-all text-xs font-detail">
                <ZoomOut size={13} />
                <span>Reduce</span>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto" data-lenis-prevent>
            <img src={pages[page]} alt={`${label} page ${page + 1}`} {...noCopyImg} className="w-full h-auto block max-w-4xl mx-auto p-6" />
          </div>
        </div>
      )}
    </>
  );
}
