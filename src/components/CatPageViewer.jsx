import { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, House } from "lucide-react";

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
  const total = pages.length;
  const thumbsRef = useRef(null);

  const go = (dir) => setPage(p => Math.max(0, Math.min(total - 1, p + dir)));
  const goTo = (i) => setPage(i);

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

  return (
    <>
      <div className="fixed inset-0 z-[10010] flex flex-col bg-[#0a0a0a]">

        {/* Header */}
        <div className="flex-none px-5 py-3.5 flex items-center gap-3 border-b border-white/10">
          {onCloseAll && (
            <button onClick={onCloseAll}
              className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-cream/40 hover:text-cream hover:bg-white/15 transition-all flex-none">
              <House size={13} />
            </button>
          )}
          <span className="font-heading text-cream text-sm tracking-[0.2em] uppercase flex-1">{label}</span>
          <span className="text-cream/40 text-xs font-detail">{page + 1} / {total}</span>
          <button onClick={() => setZoomed(true)}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-cream/50 hover:text-cream transition-colors">
            <ZoomIn size={14} />
          </button>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-cream/70 hover:text-cream transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* Main page — click left/right halves to navigate */}
        <div className="flex-1 relative flex items-center justify-center bg-black/40 min-h-0 overflow-hidden">
          <img src={pages[page]} alt={`Page ${page + 1}`}
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
        <div ref={thumbsRef} className="flex-none px-4 py-3 flex gap-2 overflow-x-auto bg-black/30"
          style={{ scrollbarWidth: "none", height: 110 }}>
          {pages.map((src, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`flex-none rounded-lg overflow-hidden border transition-all duration-200 ${
                i === page ? "border-clay opacity-100 scale-105" : "border-white/10 opacity-45 hover:opacity-75"
              }`}
              style={{ height: 82, width: 62 }}>
              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {/* Zoom overlay — full-res scrollable */}
      {zoomed && (
        <div className="fixed inset-0 z-[10011] bg-black/97 flex flex-col">
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
            <img src={pages[page]} alt="" className="w-full h-auto block max-w-4xl mx-auto p-6" />
          </div>
        </div>
      )}
    </>
  );
}
