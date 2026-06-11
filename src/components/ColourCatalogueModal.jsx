import { useState, useEffect, useCallback } from "react";
import { X, Download, ZoomIn, ZoomOut } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const CATALOGUES = {
  dulux:     { label: "Dulux",     pdf: "/pdfs/dulux-colours.pdf" },
  interpon:  { label: "Interpon",  pdf: "/pdfs/interpon-colours.pdf" },
};

export default function ColourCatalogueModal({ open, onClose, initial = "dulux" }) {
  const [active, setActive]     = useState(initial);
  const [numPages, setNumPages] = useState(null);
  const [width, setWidth]       = useState(800);
  const [zoom, setZoom]         = useState(0.7);

  useEffect(() => { if (open) setActive(initial); }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Keep page width responsive to the container
  useEffect(() => {
    const update = () => setWidth(Math.min(window.innerWidth - 80, 960));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const onDocLoad = useCallback(({ numPages }) => setNumPages(numPages), []);

  // Reset page count when catalogue switches
  useEffect(() => { setNumPages(null); }, [active]);

  if (!open) return null;

  const current = CATALOGUES[active];

  return (
    <div className="fixed inset-0 z-[9990] flex flex-col bg-charcoal">

      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/10 flex-none">
        <div className="flex flex-col gap-2.5">
          <span className="font-detail text-xs text-warm-gray uppercase tracking-[0.2em]">Colour Selection</span>
          <div className="flex gap-2">
            {Object.entries(CATALOGUES).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`font-detail text-sm px-4 py-1.5 rounded-full border transition-colors duration-300 ${
                  active === key
                    ? "bg-clay text-charcoal border-clay"
                    : "text-cream/60 border-white/15 hover:border-white/30 hover:text-cream/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom(z => Math.max(0.5, +(z - 0.15).toFixed(2)))}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-white/15 text-cream/60 hover:text-cream hover:border-white/30 transition-colors"
            >
              <ZoomOut size={14} />
            </button>
            <span className="font-detail text-xs text-cream/40 w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(z => Math.min(2.5, +(z + 0.15).toFixed(2)))}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-white/15 text-cream/60 hover:text-cream hover:border-white/30 transition-colors"
            >
              <ZoomIn size={14} />
            </button>
          </div>

          <a
            href={current.pdf}
            download
            className="flex items-center gap-2 font-detail text-xs text-clay border border-clay/40 hover:border-clay hover:bg-clay/10 transition-colors px-4 py-2 rounded-full"
          >
            <Download size={13} />
            Download PDF
          </a>
          <button onClick={onClose} className="text-warm-gray/50 hover:text-cream transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Scrollable pages */}
      <div className="flex-1 overflow-y-auto py-8 px-4 md:px-8" data-lenis-prevent>
        <Document
          key={active}
          file={current.pdf}
          onLoadSuccess={onDocLoad}
          loading={
            <div className="flex items-center justify-center h-64 text-cream/30 font-detail text-xs uppercase tracking-widest">
              Loading…
            </div>
          }
          className="flex flex-col items-center gap-4"
        >
          {numPages && Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i + 1}
              pageNumber={i + 1}
              width={width * zoom}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="rounded-xl overflow-hidden shadow-lg"
            />
          ))}
        </Document>
      </div>
    </div>
  );
}
