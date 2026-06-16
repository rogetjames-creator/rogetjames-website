import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { X, ChevronLeft, ChevronRight, Trash2, Eye, EyeOff } from "lucide-react";

// ─────────────────────────────────────────────────────────────
//  CLIENT DATA
//  To add a client: copy one of the entries below, give it a
//  unique access code, and fill in their details.
//  Put their images in public/images/client/[folder]/
// ─────────────────────────────────────────────────────────────
const CLIENT_PROJECTS = {
  "DEMO2024": {
    clientName: "Smith Residence",
    greeting: "Your private preview is ready",
    note: "Concepts prepared exclusively for your review. All designs remain confidential.",
    location: "Perth, WA",
    items: [
      {
        title: "Banksia Card — Entry Foyer",
        src: "/images/banksia/banksia-card-1.jpg",
        note: "Powder-coated steel, matt black · 900 × 900 mm",
      },
      {
        title: "Gren Tao — Living Room",
        src: "/images/branches/gren-tao-2.jpg",
        note: "Natural patina steel · 1800 × 1200 mm",
      },
      {
        title: "Villa Leaf — Terrace",
        src: "/images/villa-leaf/villa-leaf-rust.jpg",
        note: "Weathering steel · 1500 × 900 mm",
      },
    ],
  },
};

// Your private admin code — change this to something only you know
const ADMIN_CODE = "ROJADMIN";

// ── localStorage helpers for admin hide/show ──────────────────
const HIDDEN_KEY = "roj_client_hidden";
function getHidden() {
  try { return JSON.parse(localStorage.getItem(HIDDEN_KEY) || "{}"); }
  catch { return {}; }
}
function saveHidden(data) {
  localStorage.setItem(HIDDEN_KEY, JSON.stringify(data));
}
function isHidden(code, idx) {
  const h = getHidden();
  return Array.isArray(h[code]) && h[code].includes(idx);
}
function toggleHidden(code, idx) {
  const h = getHidden();
  if (!h[code]) h[code] = [];
  if (h[code].includes(idx)) {
    h[code] = h[code].filter(i => i !== idx);
  } else {
    h[code].push(idx);
  }
  saveHidden(h);
}

// ── Lightbox with prev / next arrows ─────────────────────────
function ImageLightbox({ items, startIndex, onClose }) {
  const overlayRef = useRef(null);
  const [idx, setIdx] = useState(startIndex);
  const item = items[idx];
  const total = items.length;

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
  }, []);

  const close = useCallback(() => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: "power2.in", onComplete: onClose });
  }, [onClose]);

  const prev = useCallback(() => setIdx(i => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setIdx(i => (i + 1) % total), [total]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close, prev, next]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[310] flex items-center justify-center bg-black/90 backdrop-blur-xl"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      {/* X button — always visible top-right */}
      <button
        onClick={close}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-cream/15 flex items-center justify-center text-cream hover:bg-cream/30 transition-colors z-10"
        aria-label="Close"
      >
        <X size={18} />
      </button>

      {/* Prev arrow */}
      {total > 1 && (
        <button
          onClick={prev}
          className="absolute left-4 md:left-8 w-11 h-11 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/25 transition-colors z-10"
          aria-label="Previous"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* Image */}
      <div className="relative max-w-4xl w-full mx-20 md:mx-28 flex flex-col items-center">
        <img
          key={idx}
          src={item.src}
          alt={item.title}
          className="w-full max-h-[75vh] object-contain rounded-2xl"
        />
        {(item.title || item.note) && (
          <div className="mt-5 text-center">
            {item.title && <p className="font-heading font-semibold text-cream text-base">{item.title}</p>}
            {item.note && <p className="font-detail text-xs text-cream/65 mt-1.5 uppercase tracking-wider">{item.note}</p>}
          </div>
        )}
        {/* Counter */}
        {total > 1 && (
          <p className="font-detail text-[10px] text-cream/45 uppercase tracking-widest mt-4">
            {idx + 1} / {total}
          </p>
        )}
      </div>

      {/* Next arrow */}
      {total > 1 && (
        <button
          onClick={next}
          className="absolute right-4 md:right-8 w-11 h-11 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/25 transition-colors z-10"
          aria-label="Next"
        >
          <ChevronRight size={22} />
        </button>
      )}
    </div>
  );
}

// ── Client gallery page ───────────────────────────────────────
function ClientPage({ clientCode, project, onBack, onClose }) {
  const pageRef = useRef(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const visibleItems = project.items.filter((_, i) => !isHidden(clientCode, i));

  useEffect(() => {
    gsap.fromTo(pageRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
  }, []);

  return (
    <div ref={pageRef} className="w-full max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-shrink-0">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1 font-detail text-[10px] text-cream/65 uppercase tracking-[0.2em] hover:text-cream transition-colors mb-3"
          >
            <ChevronLeft size={12} />
            Change code
          </button>
          <p className="font-detail text-[10px] text-clay uppercase tracking-[0.2em] mb-1">
            Private Preview · {project.location}
          </p>
          <h2 className="font-heading font-bold text-cream text-2xl md:text-3xl leading-tight">
            {project.clientName}
          </h2>
          <p className="font-detail text-sm text-cream/75 mt-2 max-w-md leading-relaxed">
            {project.greeting}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/25 transition-colors flex-shrink-0 mt-1"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      {/* Note */}
      <div className="mb-8 flex-shrink-0">
        <p className="font-detail text-xs text-cream/65 uppercase tracking-[0.15em] leading-relaxed max-w-xl border-l border-clay/60 pl-4">
          {project.note}
        </p>
      </div>

      {/* Grid */}
      {visibleItems.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="font-detail text-sm text-cream/45 uppercase tracking-wider">Concepts coming soon</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-1 pb-4" data-lenis-prevent style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(158, 113, 52,0.4) transparent" }}>
          {visibleItems.map((item, i) => (
            <button
              key={i}
              onClick={() => setLightboxIndex(i)}
              className="group relative rounded-2xl overflow-hidden bg-cream/5 border border-cream/10 hover:border-clay/40 transition-all duration-300 text-left"
              style={{ aspectRatio: "4/3" }}
            >
              {item.src ? (
                <img src={item.src} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="font-detail text-xs text-cream/55 uppercase tracking-wider">Image coming soon</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="font-heading font-semibold text-cream text-sm leading-tight">{item.title}</p>
                {item.note && <p className="font-detail text-[10px] text-cream/60 mt-1 uppercase tracking-wider leading-relaxed">{item.note}</p>}
              </div>
            </button>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <ImageLightbox
          items={visibleItems}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}

// ── Admin page — James only ───────────────────────────────────
function AdminPage({ onBack, onClose }) {
  const pageRef = useRef(null);
  const [hidden, setHidden] = useState(getHidden);
  const [lightbox, setLightbox] = useState(null); // { items, startIndex }
  const [_confirmDelete, _setConfirmDelete] = useState(null); // { code, idx }

  useEffect(() => {
    gsap.fromTo(pageRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
  }, []);

  const toggle = (code, idx) => {
    toggleHidden(code, idx);
    setHidden(getHidden());
  };

  const clientEntries = Object.entries(CLIENT_PROJECTS);

  return (
    <div ref={pageRef} className="w-full max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-shrink-0">
        <div>
          <button onClick={onBack} className="flex items-center gap-1 font-detail text-[10px] text-cream/65 uppercase tracking-[0.2em] hover:text-cream transition-colors mb-3">
            <ChevronLeft size={12} />
            Back
          </button>
          <p className="font-detail text-[10px] text-clay uppercase tracking-[0.2em] mb-1">Admin</p>
          <h2 className="font-heading font-bold text-cream text-2xl md:text-3xl leading-tight">All Client Projects</h2>
          <p className="font-detail text-sm text-cream/75 mt-2">Hide or restore individual images for each client.</p>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/25 transition-colors flex-shrink-0 mt-1" aria-label="Close">
          <X size={18} />
        </button>
      </div>

      <div className="overflow-y-auto flex-1 pb-4 space-y-10" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(158, 113, 52,0.4) transparent" }}>
        {clientEntries.map(([code, project]) => (
          <div key={code}>
            {/* Client header */}
            <div className="flex items-center gap-4 mb-4 pb-3 border-b border-cream/10">
              <div className="flex-1">
                <p className="font-heading font-bold text-cream text-lg">{project.clientName}</p>
                <p className="font-detail text-xs text-cream/50 mt-0.5">{project.location}</p>
              </div>
              <div className="bg-cream/5 border border-cream/15 rounded-xl px-4 py-1.5">
                <p className="font-detail text-[10px] text-cream/45 uppercase tracking-wider mb-0.5">Access code</p>
                <p className="font-mono text-sm text-clay font-semibold tracking-widest">{code}</p>
              </div>
            </div>

            {/* Image grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {project.items.map((item, idx) => {
                const hidden = isHidden(code, idx);
                return (
                  <div key={idx} className="relative rounded-xl overflow-hidden border border-cream/10" style={{ aspectRatio: "4/3" }}>
                    {/* Thumbnail */}
                    <button
                      onClick={() => {
                        const _visibleUpToHere = project.items.slice(0, idx + 1).filter((_, i) => !isHidden(code, i));
                        const lightboxItems = project.items.filter((_, i) => !isHidden(code, i));
                        const lightboxStart = lightboxItems.indexOf(item);
                        if (lightboxStart >= 0) setLightbox({ items: lightboxItems, startIndex: lightboxStart });
                      }}
                      className="w-full h-full"
                    >
                      {item.src ? (
                        <img src={item.src} alt={item.title} className={`w-full h-full object-cover transition-opacity duration-300 ${hidden ? "opacity-20" : "opacity-100"}`} />
                      ) : (
                        <div className="w-full h-full bg-cream/5 flex items-center justify-center">
                          <p className="font-detail text-[10px] text-cream/40 uppercase tracking-wider">No image</p>
                        </div>
                      )}
                    </button>

                    {/* Hidden badge */}
                    {hidden && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-black/60 rounded-lg px-2 py-1">
                          <p className="font-detail text-[9px] text-cream/70 uppercase tracking-wider">Hidden from client</p>
                        </div>
                      </div>
                    )}

                    {/* Title bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 pb-2 pt-4">
                      <p className="font-detail text-[9px] text-cream/80 uppercase tracking-wide leading-tight line-clamp-1">{item.title}</p>
                    </div>

                    {/* Hide / show toggle */}
                    <button
                      onClick={() => toggle(code, idx)}
                      className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                        hidden
                          ? "bg-clay/80 text-cream hover:bg-clay"
                          : "bg-black/50 text-cream/70 hover:bg-red-600/80 hover:text-cream"
                      }`}
                      title={hidden ? "Restore — show to client" : "Hide from client"}
                    >
                      {hidden ? <Eye size={13} /> : <EyeOff size={13} />}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Hidden count note */}
            {hidden[code]?.length > 0 && (
              <p className="font-detail text-[10px] text-cream/45 uppercase tracking-wider mt-3">
                {hidden[code].length} image{hidden[code].length > 1 ? "s" : ""} hidden from this client
              </p>
            )}
          </div>
        ))}
      </div>

      {lightbox && (
        <ImageLightbox items={lightbox.items} startIndex={lightbox.startIndex} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────
export default function ClientPreview({ onClose }) {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const inputRef = useRef(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [view, setView] = useState(null); // null | { type: "client", code, project } | { type: "admin" }

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
    gsap.fromTo(cardRef.current, { scale: 0.94, y: 20 }, { scale: 1, y: 0, duration: 0.45, ease: "power3.out" });
    document.body.style.overflow = "hidden";
    setTimeout(() => inputRef.current?.focus(), 450);
    return () => { document.body.style.overflow = ""; };
  }, []);

  const close = useCallback(() => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25, ease: "power2.in", onComplete: onClose });
  }, [onClose]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        if (view) setView(null);
        else close();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close, view]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed === ADMIN_CODE) {
      setError("");
      setView({ type: "admin" });
      return;
    }
    const match = CLIENT_PROJECTS[trimmed];
    if (match) {
      setError("");
      setView({ type: "client", code: trimmed, project: match });
    } else {
      setError("Code not recognised. Please check and try again.");
      gsap.fromTo(cardRef.current, { x: -10 }, { x: 10, duration: 0.08, repeat: 5, yoyo: true, ease: "none", onComplete: () => gsap.set(cardRef.current, { x: 0 }) });
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-jet/96 backdrop-blur-xl"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(158, 113, 52,0.04) 0%, transparent 70%)" }} />

      {view?.type === "client" ? (
        <div ref={cardRef} className="relative w-full overflow-hidden flex flex-col" style={{ maxHeight: "calc(100vh - 2rem)" }}>
          <ClientPage clientCode={view.code} project={view.project} onBack={() => setView(null)} onClose={close} />
        </div>
      ) : view?.type === "admin" ? (
        <div ref={cardRef} className="relative w-full overflow-hidden flex flex-col" style={{ maxHeight: "calc(100vh - 2rem)" }}>
          <AdminPage onBack={() => setView(null)} onClose={close} />
        </div>
      ) : (
        <div ref={cardRef} className="relative w-full max-w-sm mx-4">
          <button onClick={close} className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/25 transition-colors" aria-label="Close">
            <X size={18} />
          </button>

          <div className="bg-charcoal/80 border border-cream/10 rounded-[2rem] p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <p className="font-heading font-bold text-cream text-xl tracking-tight">
                ROGET<span className="font-normal italic font-drama">james</span>
              </p>
              <div className="w-8 h-px bg-clay/50 mx-auto mt-3 mb-4" />
              <p className="font-detail text-[10px] text-cream/75 uppercase tracking-[0.25em]">Client Preview Access</p>
            </div>

            <p className="font-detail text-sm text-cream/80 text-center leading-relaxed mb-8">
              Enter the access code provided to you to view your private concepts.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  ref={inputRef}
                  type="text"
                  value={code}
                  onChange={(e) => { setCode(e.target.value); setError(""); }}
                  placeholder="Enter your code"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  className="w-full bg-cream/5 border border-cream/20 focus:border-clay/70 rounded-2xl px-5 py-3.5 text-center font-heading font-semibold text-cream text-lg tracking-[0.2em] uppercase placeholder:text-cream/45 placeholder:font-detail placeholder:text-sm placeholder:tracking-widest placeholder:normal-case outline-none transition-colors duration-200"
                  style={{ caretColor: "#9E7134" }}
                />
                {error && <p className="font-detail text-[11px] text-clay text-center mt-2 leading-relaxed">{error}</p>}
              </div>
              <button
                type="submit"
                disabled={code.trim().length < 3}
                className="w-full py-3.5 rounded-2xl bg-clay text-cream font-heading font-semibold text-sm tracking-wide transition-all duration-200 hover:bg-clay-light disabled:opacity-30 disabled:cursor-default"
              >
                View My Preview
              </button>
            </form>

            <p className="font-detail text-[10px] text-cream/55 text-center mt-6 leading-relaxed">
              Access codes are provided directly by ROGETjames.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
