import { useEffect, useRef, useState, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import gsap from "gsap";

const CATALOGUES = {
  "Wall Art & Screens": {
    pages: Array.from({ length: 38 }, (_, i) => `/images/catalogues/cat1/page-${String(i + 1).padStart(2, "0")}.jpg`),
  },
  "Sculpture, Light Features & Mirrors": {
    pages: Array.from({ length: 10 }, (_, i) => `/images/catalogues/cat2/page-${String(i + 1).padStart(2, "0")}.jpg`),
  },
};

// Preload all pages for a catalogue
function usePreload(pages) {
  const [loaded, setLoaded] = useState(0);
  useEffect(() => {
    if (!pages) return;
    let count = 0;
    pages.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        count++;
        setLoaded(count);
      };
      img.src = src;
    });
  }, [pages]);
  return loaded;
}

export default function FlipbookModal({ catalogue, onClose }) {
  const overlayRef = useRef(null);
  const bookRef = useRef(null);
  const flipRef = useRef(null);
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(1);

  const data = CATALOGUES[catalogue];
  const totalPages = data?.pages.length ?? 0;
  const loaded = usePreload(data?.pages);
  const ready = loaded >= totalPages && totalPages > 0;

  // Animate in
  useEffect(() => {
    if (!overlayRef.current) return;
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
    gsap.fromTo(bookRef.current, { scale: 0.93, y: 20 }, { scale: 1, y: 0, duration: 0.4, ease: "power3.out" });
    // Lock scroll
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const close = useCallback(() => {
    gsap.to(overlayRef.current, {
      opacity: 0, duration: 0.25, ease: "power2.in",
      onComplete: onClose,
    });
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  const prev = () => flipRef.current?.pageFlip()?.flipPrev();
  const next = () => flipRef.current?.pageFlip()?.flipNext();

  // Page dimensions — A4 portrait ratio, scaled to viewport
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const maxH = Math.min(typeof window !== "undefined" ? window.innerHeight * (isMobile ? 0.72 : 0.82) : 700, 760);
  const pageH = maxH;
  const pageW = isMobile
    ? Math.round(Math.min(window.innerWidth - 32, maxH * (595 / 842)))
    : Math.round(pageH * (595 / 842));

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-charcoal/92 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      {/* Header */}
      <div className="w-full max-w-5xl px-4 flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <p className="font-detail text-[10px] text-cream/40 uppercase tracking-[0.2em]">Catalogue</p>
          <h2 className="font-heading font-semibold text-cream text-lg leading-tight">{catalogue}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(0.7, +(z - 0.15).toFixed(2)))}
            className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center text-cream/60 hover:text-cream hover:bg-cream/20 transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOut size={15} />
          </button>
          <button
            onClick={() => setZoom((z) => Math.min(1.5, +(z + 0.15).toFixed(2)))}
            className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center text-cream/60 hover:text-cream hover:bg-cream/20 transition-colors"
            aria-label="Zoom in"
          >
            <ZoomIn size={15} />
          </button>
          <button
            onClick={close}
            className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center text-cream/60 hover:text-cream hover:bg-cream/20 transition-colors ml-1"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      {/* Book area */}
      <div
        ref={bookRef}
        className="relative flex items-center justify-center flex-1 w-full"
        style={{ overflow: "hidden" }}
      >
        {!ready ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-cream/20 border-t-cream/70 animate-spin" />
            <p className="font-detail text-xs text-cream/40 uppercase tracking-wider">
              Loading {loaded}/{totalPages}
            </p>
          </div>
        ) : (
          <div style={{ transform: `scale(${zoom})`, transformOrigin: "center center", transition: "transform 0.3s ease" }}>
            <HTMLFlipBook
              ref={flipRef}
              width={pageW}
              height={pageH}
              size="fixed"
              minWidth={pageW}
              maxWidth={pageW}
              minHeight={pageH}
              maxHeight={pageH}
              showCover={true}
              flippingTime={700}
              usePortrait={isMobile}
              startPage={0}
              drawShadow={true}
              onFlip={(e) => setPage(e.data)}
              className="flipbook-shadow"
            >
              {data.pages.map((src, i) => (
                <div key={i} className="flipbook-page bg-white overflow-hidden">
                  <img
                    src={src}
                    alt={`Page ${i + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    draggable={false}
                  />
                </div>
              ))}
            </HTMLFlipBook>
          </div>
        )}

        {/* Prev / Next arrows */}
        {ready && (
          <>
            <button
              onClick={prev}
              disabled={page === 0}
              className="absolute left-2 md:left-6 w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center text-cream/60 hover:text-cream hover:bg-cream/20 transition-all disabled:opacity-20 disabled:cursor-default"
              aria-label="Previous page"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              disabled={page >= totalPages - 2}
              className="absolute right-2 md:right-6 w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center text-cream/60 hover:text-cream hover:bg-cream/20 transition-all disabled:opacity-20 disabled:cursor-default"
              aria-label="Next page"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Footer — page counter */}
      {ready && (
        <div className="flex items-center gap-6 mt-4 flex-shrink-0">
          <p className="font-detail text-[10px] text-cream/40 uppercase tracking-wider">
            {page + 1} — {Math.min(page + 2, totalPages)} of {totalPages}
          </p>
        </div>
      )}
    </div>
  );
}
