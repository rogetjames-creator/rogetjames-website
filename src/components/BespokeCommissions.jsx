import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { X, Search } from "lucide-react";
import CatPageViewer from "./CatPageViewer";
import { netlifyImg } from "../utils/img";
import {
  SCULPTURE_ITEMS,
  CONCEPTS_ITEMS,
  SCREENS_SLIDESHOW_SLIDES,
  SCREEN_DESIGNS_SECTIONED,
  SCREEN_TABS,
  SCREEN_SEARCH_SUGGESTIONS,
  SCREENS_CAT_PAGES,
  PROJECT_CATEGORIES,
  PROJECTS_ROWS,
  SCULPTURE_SEARCH_SUGGESTIONS,
} from "./bespokeData";

// Data-derived public API kept importable from this file (moved to bespokeData.js).
export { SCREEN_COVERS } from "./bespokeData";
export { SCULPTURE_ITEMS, CONCEPTS_ITEMS };


// Serve any gallery image at an explicit width through the Netlify Image CDN.
// - external URLs pass through unchanged
// - srcs already built from the CDN constant (/.netlify/images?url=...) just get sizing params appended
// - plain local /images/... paths go through netlifyImg
function sizedImg(src, w, q = 80) {
  if (!src || src.startsWith("http") || src.startsWith("data:")) return src;
  if (src.startsWith("/.netlify/images")) return `${src}&w=${w}&fm=webp&q=${q}`;
  return netlifyImg(src, { w, q });
}


function ScreensStoryModal({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 9000, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: "#111", width: "min(500px, 92vw)", maxHeight: "90vh", overflowY: "auto", scrollbarWidth: "none", position: "relative", border: "1px solid rgba(242,240,233,0.07)", display: "flex", flexDirection: "column" }}
      >
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "rgba(242,240,233,0.35)", cursor: "pointer", fontSize: 18, lineHeight: 1, zIndex: 2 }}>✕</button>

        {/* Spiel header image */}
        <div style={{ position: "relative", width: "100%", height: 200, overflow: "hidden", flexShrink: 0 }}>
          <img src="/images/screens/spiel-poster.jpg" alt="ROGETjames architectural screens — bespoke laser cut designs" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.35)" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ display: "block", width: 60, height: "1.5px", background: "rgba(242,240,233,0.35)" }} />
                <span style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "clamp(18px, 3.5vw, 26px)", letterSpacing: "0.06em", color: "rgba(242,240,233,0.85)", whiteSpace: "nowrap" }}>The Art Form</span>
                <span style={{ display: "block", width: 60, height: "1.5px", background: "rgba(242,240,233,0.35)" }} />
              </div>
              <p style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "clamp(18px, 3.5vw, 26px)", margin: 0, lineHeight: 1.05, letterSpacing: "0.06em", textAlign: "center" }}>
                <span style={{ color: "rgba(242,240,233,0.32)" }}>Shadows </span><span style={{ color: "rgba(242,240,233,0.55)" }}>& </span><span style={{ color: "rgba(242,240,233,0.9)" }}>Light</span>
              </p>
            </div>
          </div>
        </div>

        {/* Body text */}
        <div style={{ padding: "36px 40px 44px", display: "flex", flexDirection: "column", gap: 20 }}>
          <p style={{ fontFamily: "var(--font-detail)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(242,240,233,0.65)", lineHeight: 1.9, margin: 0, textAlign: "center" }}>
            For three thousand years, humanity has shaped shadows with form and light — honing the ancient craft of screens.
          </p>
          {[
            "From the woven reeds of ancient Egypt to the carved lattices of Mesopotamian palaces — screens were never merely functional. They were a language. One that spoke of shelter and mystery, of the threshold between public and private, of shadow and adornment made beautiful.",
            "The Islamic Golden Age gave that language its most eloquent voice — breathtaking geometric complexity that turned a wall into a meditation, a doorway into an experience. It rippled through Medieval Europe, through the courts of Asia, through the ornate ironwork of the Victorian colonial era.",
            "Then came the machine. Laser and CNC technology did not replace the craft — they set it free. Suddenly the organic, the intricate, the impossibly fine became possible in aluminium, steel, timber and stone.",
            "ROGETjames occupies this space today — drawing on the depth of that lineage, bringing new thinking and original design into one of the oldest crafts in the built world with contemporary precision.",
          ].map((para, i) => (
            <p key={i} style={{ fontFamily: "var(--font-detail)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(242,240,233,0.65)", lineHeight: 1.9, margin: 0, textAlign: "center" }}>
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScreensFeatureSlideshow() {
  const [cur, setCur] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const timerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCur(p => (p + 1) % SCREENS_SLIDESHOW_SLIDES.length);
        setAnimating(false);
      }, 500);
    }, 4500);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const slide = SCREENS_SLIDESHOW_SLIDES[cur];

  return (
    <div style={{ gridColumn: "1 / -1", margin: "8px 0 24px 0", position: "relative", height: isMobile ? "420px" : "620px", borderRadius: "12px", overflow: "hidden", background: "#111" }}>
      {/* Slide image */}
      {SCREENS_SLIDESHOW_SLIDES.map((s, i) => (
        <img
          key={i}
          src={s.img}
          alt={s.heading}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: s.objectPosition || "center center",
            opacity: i === cur ? (animating ? 0 : 1) : 0,
            transition: "opacity 0.5s ease",
          }}
        />
      ))}

      {/* Gradient overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)" }} />

      {/* Text content — animate/edit per slide here */}
      <div style={{
        position: "absolute", left: 48, top: "50%", transform: "translateY(-50%)",
        opacity: animating ? 0 : 1, transition: "opacity 0.45s ease",
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        {slide.subheading && (
          <p style={{ fontFamily: "var(--font-detail)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(242,240,233,0.55)", margin: 0 }}>
            {slide.subheading}
          </p>
        )}
        <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(16px, 2.5vw, 28px)", letterSpacing: "0.06em", color: "rgba(242,240,233,0.6)", margin: 0, lineHeight: 1 }}>
          {slide.heading}
        </h2>
        {slide.body && (
          <p style={{ fontFamily: "var(--font-detail)", fontSize: 14, color: "rgba(242,240,233,0.7)", maxWidth: 360, margin: 0, lineHeight: 1.6 }}>
            {slide.body}
          </p>
        )}
      </div>

      {/* Slide counter */}
      <p style={{ position: "absolute", bottom: 22, right: 24, fontFamily: "var(--font-detail)", fontSize: 11, color: "rgba(242,240,233,0.4)", letterSpacing: "0.12em", margin: 0 }}>
        {String(cur + 1).padStart(2, "0")} / {String(SCREENS_SLIDESHOW_SLIDES.length).padStart(2, "0")}
      </p>

      {/* Category tags */}
      <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "center", padding: "0 32px" }}>
        <p style={{ fontFamily: "var(--font-detail)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#F2F0E9", margin: 0, textAlign: "center", lineHeight: 1.8 }}>
          Wall Decor · Entrance Gates · Security Gates Automated · Fencing · Infills · Dividers · Privacy Screens · Awnings · Light Features
        </p>
      </div>

      {/* Story button */}
      <div style={{ position: "absolute", top: 20, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => setStoryOpen(true)}
          className="pill-trace"
          style={{
            fontFamily: "var(--font-detail)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
            color: "rgba(242,240,233,0.7)", background: "rgba(0,0,0,0.35)", border: "1px solid rgba(242,240,233,0.18)",
            borderRadius: 9999, padding: "9px 22px", cursor: "pointer",
          }}
        >
          THE ART OF SHADOWS AND LIGHT
        </button>
      </div>

      {storyOpen && <ScreensStoryModal onClose={() => setStoryOpen(false)} />}
    </div>
  );
}


function ScreensCatalogueModal({ onClose }) {
  return <CatPageViewer pages={SCREENS_CAT_PAGES} label="Screens Catalogue" onClose={onClose} />;
}


export function ScreensGalleryModal({ onClose, initialShowCat = false }) {
  const [tab, setTab] = useState("all");
  const [activeDesign, setActiveDesign] = useState(null); // null = show all, string = filtered to one design
  const [designPillsOpen, setDesignPillsOpen] = useState(false);
  const [flatIdx, setFlatIdx] = useState(null); // null = grid view, integer = expanded slideshow
  const [slideIdx, setSlideIdx] = useState(0);
  const [animDir, setAnimDir] = useState(null);
  const [jumpByDesign, setJumpByDesign] = useState(true); // true = arrows hop design-to-design; false = image-by-image
  const [showCat, setShowCat] = useState(initialShowCat);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const searchInputRef = useRef(null);
  const thumbStripRef = useRef(null);
  const activeThumbRef = useRef(null);
  const touchStartX = useRef(0);
  const navTimerRef = useRef(null);
  const schedule = useCallback((fn, ms = 180) => {
    clearTimeout(navTimerRef.current);
    navTimerRef.current = setTimeout(fn, ms);
  }, []);
  useEffect(() => () => clearTimeout(navTimerRef.current), []);

  const tabDesigns = useMemo(() => (
    tab === "all"
      ? SCREEN_DESIGNS_SECTIONED
      : SCREEN_DESIGNS_SECTIONED.filter(d => d._sections.includes(tab))
  ), [tab]);
  const visibleDesigns = useMemo(() => (
    activeDesign ? tabDesigns.filter(d => d.name === activeDesign) : tabDesigns
  ), [tabDesigns, activeDesign]);
  const activeDrillDesign = activeDesign ? tabDesigns.find(d => d.name === activeDesign) : null;

  // One entry per image across all visible designs
  const gridItems = useMemo(() => (
    visibleDesigns.flatMap((d, dIdx) =>
      d.items.map((it, iIdx) => ({ img: it.img, pos: it.pos, name: d.name, section: d._section, dIdx, iIdx }))
    )
  ), [visibleDesigns]);

  // Flat index map over ALL designs — resolves a search hit to a grid position
  const allFlat = useMemo(() => (
    SCREEN_DESIGNS_SECTIONED.flatMap((d, dI) => d.items.map((_, iI) => ({ dIdx: dI, iIdx: iI })))
  ), []);

  // Current image in expanded view
  const curFlat   = flatIdx !== null ? gridItems[flatIdx] : null;
  const curDesign = curFlat ? visibleDesigns[curFlat.dIdx] : null;
  const curItem   = curFlat ? curDesign?.items[curFlat.iIdx] : null;
  const curSlides = curItem ? (curItem.slides ?? [curItem.img]) : [];
  const displayImg = curSlides[slideIdx] ?? curFlat?.img;

  // Search results (always across all designs)
  const q = searchQuery.trim().toLowerCase();
  const searchResults = useMemo(() => (
    !q
      ? []
      : SCREEN_DESIGNS_SECTIONED.flatMap((d, dIdx) => {
          const nameMatch = d.name.toLowerCase().includes(q);
          const tabMatch  = (d.tabs ?? []).some(t => t.includes(q) || q.includes(t));
          // Check if any items in this design have item-level tags (if so, don't fall back to design-level)
          const hasItemTags = d.items.some(it => (it.tags ?? []).length > 0);
          const designTagMatch = !hasItemTags && (d.tags ?? []).some(t => t.includes(q) || q.includes(t));
          return d.items.flatMap((it, iIdx) => {
            const itemMatch = it.name?.toLowerCase().includes(q) || it.description?.toLowerCase().includes(q);
            // Item-level tag: if item has tags, check those; else if design has no item-level tags, use design tags
            const itemTagMatch = (it.tags ?? []).length > 0
              ? (it.tags).some(t => t.includes(q) || q.includes(t))
              : designTagMatch;
            if (!nameMatch && !itemTagMatch && !tabMatch && !itemMatch) return [];
            return [{ img: it.img, pos: it.pos, name: it.name ?? d.name, dIdx, iIdx }];
          });
        })
  ), [q]);

  // Auto-scroll thumb strip to keep active thumb visible
  useEffect(() => {
    if (activeThumbRef.current && thumbStripRef.current) {
      activeThumbRef.current.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [flatIdx]);

  // Navigate: two modes depending on how the view was entered.
  // jumpByDesign=true (grid click): arrows hop to the first image of the next/prev design.
  // jumpByDesign=false (name pill click): arrows step image-by-image within the current design.
  const navigateFlat = useCallback((dir) => {
    if (flatIdx === null) return;
    const curName = gridItems[flatIdx]?.name;

    if (jumpByDesign) {
      // Design-hop: skip to first image of next / prev design
      if (dir > 0) {
        let next = flatIdx + 1;
        while (next < gridItems.length && gridItems[next].name === curName) next++;
        if (next >= gridItems.length) next = 0;
        setAnimDir(1);
        schedule(() => { setFlatIdx(next); setSlideIdx(0); setAnimDir(null); });
      } else {
        const firstOfCurrent = gridItems.findIndex(it => it.name === curName);
        if (firstOfCurrent > 0) {
          const prevName = gridItems[firstOfCurrent - 1].name;
          const firstOfPrev = gridItems.findIndex(it => it.name === prevName);
          setAnimDir(-1);
          schedule(() => { setFlatIdx(firstOfPrev >= 0 ? firstOfPrev : 0); setSlideIdx(0); setAnimDir(null); });
        } else {
          // Already first design — wrap to last
          const lastName = gridItems[gridItems.length - 1]?.name;
          const firstOfLast = gridItems.findIndex(it => it.name === lastName);
          setAnimDir(-1);
          schedule(() => { setFlatIdx(firstOfLast >= 0 ? firstOfLast : 0); setSlideIdx(0); setAnimDir(null); });
        }
      }
    } else {
      // Image-step within current design (with slide support)
      if (dir > 0) {
        if (slideIdx < curSlides.length - 1) { setSlideIdx(s => s + 1); return; }
        const next = flatIdx + 1;
        if (next < gridItems.length && gridItems[next].name === curName) {
          setAnimDir(1);
          schedule(() => { setFlatIdx(next); setSlideIdx(0); setAnimDir(null); });
        } else {
          const first = gridItems.findIndex(it => it.name === curName);
          setAnimDir(1);
          schedule(() => { setFlatIdx(first >= 0 ? first : 0); setSlideIdx(0); setAnimDir(null); });
        }
      } else {
        if (slideIdx > 0) { setSlideIdx(s => s - 1); return; }
        const prev = flatIdx - 1;
        if (prev >= 0 && gridItems[prev].name === curName) {
          setAnimDir(-1);
          schedule(() => { setFlatIdx(prev); setSlideIdx(0); setAnimDir(null); });
        } else {
          let last = flatIdx;
          while (last + 1 < gridItems.length && gridItems[last + 1].name === curName) last++;
          setAnimDir(-1);
          schedule(() => { setFlatIdx(last); setSlideIdx(0); setAnimDir(null); });
        }
      }
    }
  }, [flatIdx, jumpByDesign, slideIdx, curSlides.length, gridItems, schedule]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        if (searchQuery) { setSearchQuery(""); setSearchOpen(false); return; }
        if (showCat) { setShowCat(false); return; }
        if (flatIdx !== null) { setFlatIdx(null); setSlideIdx(0); return; }
        onClose();
      }
      if (flatIdx !== null && !searchQuery) {
        if (e.key === "ArrowRight") navigateFlat(1);
        if (e.key === "ArrowLeft")  navigateFlat(-1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flatIdx, showCat, searchQuery, navigateFlat, onClose]);

  return (
    <div
      className="fixed inset-0 z-[10000] bg-jet flex flex-col"
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={e => { const dx = e.changedTouches[0].clientX - touchStartX.current; if (Math.abs(dx) > 50 && flatIdx !== null && !searchQuery) navigateFlat(dx < 0 ? 1 : -1); }}
    >
      {/* Top bar */}
      <div className="flex items-center px-5 py-3 border-b border-white/10 flex-shrink-0 gap-3">
        <button onClick={() => { onClose(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="font-heading font-bold text-sm tracking-widest text-cream flex-none">
          ROGET<span className="font-light italic">james</span>
          <span className="font-detail text-[9px] font-normal not-italic uppercase tracking-[0.2em] text-cream/50 ml-2">· Screens</span>
        </button>
        <div className="flex-1 flex justify-center">
          <button onClick={() => setShowCat(true)}
            className="pill-trace font-detail text-[9px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-white/35 bg-transparent text-cream/88 transition-colors duration-200">
            Catalogue
          </button>
        </div>
        <div className="flex items-center gap-2 flex-none">
          {searchOpen
            ? <div className="relative flex items-center">
                <input ref={searchInputRef} type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)} onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                  placeholder="Search designs…"
                  className="bg-white/6 border border-white/15 rounded-full pl-3 pr-7 py-1.5 font-detail text-[12px] text-cream placeholder:text-cream/30 focus:outline-none focus:border-clay/50 transition-colors w-24 md:w-36"
                  autoFocus />
                <button onClick={() => { setSearchQuery(""); setSearchOpen(false); }} className="absolute right-2.5 text-cream/30 hover:text-cream/70 transition-colors"><X size={10} /></button>
              </div>
            : <button onClick={() => { setSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 50); }}
                className="flex items-center gap-2 text-cream/40 hover:text-cream transition-colors" aria-label="Search">
                <span className="hidden md:inline font-detail text-[9px] uppercase tracking-[0.2em]">Refine Search</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="6" cy="6" r="4"/><line x1="9.5" y1="9.5" x2="13" y2="13"/></svg>
              </button>
          }
          <button onClick={onClose} className="flex-none text-cream/40 hover:text-cream transition-colors"><X size={15} /></button>
        </div>
      </div>

      {/* Search suggestions dropdown */}
      {searchOpen && searchFocused && !searchQuery && (
        <div className="absolute left-0 right-0 z-50 bg-[#111] border-b border-white/10 px-10 md:px-20 py-4" style={{ top: "49px" }}>
          {SCREEN_SEARCH_SUGGESTIONS.map(group => (
            <div key={group.label} className="mb-3 last:mb-0">
              <p className="font-detail text-[9px] text-cream/40 uppercase tracking-[0.2em] mb-2">{group.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map(term => (
                  <button key={term} onMouseDown={e => e.preventDefault()} onClick={() => { setSearchQuery(term); }}
                    className="px-3 py-1 rounded-full font-detail text-[9px] bg-white/5 border border-white/10 text-cream/60 hover:border-clay/60 hover:text-cream transition-all duration-200 uppercase tracking-[0.12em]">
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category tabs — clicking filters the view; also lights up as position indicator */}
      {!searchQuery && (
        <div className="flex justify-center gap-2 px-5 py-2.5 overflow-x-auto border-b border-white/8 flex-shrink-0" style={{ scrollbarWidth: "none" }}>
          {SCREEN_TABS.map(t => {
            const isFilter   = tab === t.id;
            // Highlight ALL sections the current design belongs to (e.g. ERGO → ICONS + ARCHITECTURAL)
            const isPosition = !isFilter && t.id !== "all" && (
              (activeDrillDesign?._sections?.includes(t.id)) ||
              (curDesign?._sections?.includes(t.id) && flatIdx !== null)
            );
            return (
              <button key={t.id}
                onClick={() => { setTab(t.id); setFlatIdx(null); setSlideIdx(0); setJumpByDesign(true); setActiveDesign(null); setShowGrid(t.id !== "all"); }}
                className={`pill-trace flex-shrink-0 px-4 py-1.5 rounded-full font-detail text-[9px] uppercase tracking-[0.16em] border transition-colors duration-200${isFilter ? " pill-active" : ""}`}
                style={{
                  background: "transparent",
                  borderColor: isFilter ? "#9e7134" : isPosition ? "rgba(242,240,233,0.8)" : "rgba(242,240,233,0.45)",
                  color:       isFilter ? "#f2f0e9"  : isPosition ? "#f2f0e9"               : "rgba(242,240,233,0.9)",
                  whiteSpace: "nowrap",
                }}>
                {t.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Design name pills — animated drawer */}
      {!searchQuery && (
        <div className="flex-shrink-0 border-b border-white/6">
          {/* Trigger row */}
          <div className="flex items-center gap-3 px-5 py-2">
            <button
              onClick={() => { if (tab === "all" && !activeDesign && showGrid) { setShowGrid(false); setDesignPillsOpen(false); } else setDesignPillsOpen(o => !o); }}
              className="group flex items-center gap-2.5 transition-colors duration-200"
            >
              <span
                className="flex items-center justify-center rounded-full border font-detail text-[8px] uppercase tracking-[0.14em] transition-all duration-200"
                style={{
                  width: 30, height: 30, flexShrink: 0,
                  borderColor: designPillsOpen ? "#9e7134" : "rgba(242,240,233,0.3)",
                  background: designPillsOpen ? "#9e7134" : "transparent",
                  color: designPillsOpen ? "#f2f0e9" : "rgba(242,240,233,0.6)",
                }}
                onMouseEnter={e => { if (!designPillsOpen) { e.currentTarget.style.background = "#9e7134"; e.currentTarget.style.borderColor = "#9e7134"; e.currentTarget.style.color = "#f2f0e9"; }}}
                onMouseLeave={e => { if (!designPillsOpen) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(242,240,233,0.3)"; e.currentTarget.style.color = "rgba(242,240,233,0.6)"; }}}
              >
                ✦
              </span>
              <span className="font-detail text-[9px] uppercase tracking-[0.18em] transition-colors duration-200"
                style={{ color: designPillsOpen ? "#f2f0e9" : "rgba(242,240,233,0.75)" }}>
                The Editions
              </span>
            </button>
            {/* Active design shown inline when drawer closed */}
            {!designPillsOpen && activeDesign && (
              <span className="font-detail text-[9px] uppercase tracking-[0.14em] px-3 py-1 rounded-full border"
                style={{ borderColor: "#9e7134", color: "#f2f0e9", background: "transparent" }}>
                {activeDesign}
              </span>
            )}
          </div>
          {/* Animated drawer */}
          <div style={{ overflow: "hidden", maxHeight: designPillsOpen ? "300px" : "0px", transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
            <div className="flex flex-wrap gap-2 px-5 pb-3">
              <button
                onClick={() => { setActiveDesign(null); setFlatIdx(null); setSlideIdx(0); setDesignPillsOpen(false); }}
                className="pill-trace flex-shrink-0 px-3 py-1 rounded-full font-detail text-[8px] uppercase tracking-[0.14em] border transition-colors duration-200"
                style={{ background: "transparent", borderColor: !activeDesign ? "#9e7134" : "rgba(242,240,233,0.45)", color: "#f2f0e9", whiteSpace: "nowrap" }}>
                All
              </button>
              {tabDesigns.map((d) => {
                const isActive = activeDesign === d.name;
                return (
                  <button key={d.name}
                    onClick={() => { setActiveDesign(d.name); setFlatIdx(null); setSlideIdx(0); }}
                    className={`pill-trace flex-shrink-0 px-3 py-1 rounded-full font-detail text-[8px] uppercase tracking-[0.14em] border transition-colors duration-200${isActive ? " pill-active" : ""}`}
                    style={{ background: "transparent", borderColor: isActive ? "#9e7134" : "rgba(242,240,233,0.45)", color: "#f2f0e9", whiteSpace: "nowrap" }}>
                    {d.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Search results */}
      {searchQuery && (
        <div className="flex-1 overflow-y-auto px-10 md:px-20 py-4" data-lenis-prevent>
          {searchResults.length === 0
            ? <p className="font-detail text-cream/30 text-xs uppercase tracking-[0.2em] text-center mt-10">No results</p>
            : <div className="flex flex-wrap justify-center gap-2">
                {searchResults.map((it, i) => (
                  <div key={it.img} onClick={() => {
                    // dIdx/iIdx are relative to SCREEN_DESIGNS_SECTIONED = ALL designs
                    const fi = allFlat.findIndex(x => x.dIdx === it.dIdx && x.iIdx === it.iIdx);
                    setTab("all"); setFlatIdx(fi >= 0 ? fi : null); setSlideIdx(0);
                    setSearchQuery(""); setSearchOpen(false);
                  }}
                    className="group cursor-pointer relative aspect-square rounded-lg overflow-hidden border border-white/8 group-hover:border-clay/50 transition-all duration-200"
                    style={{ width: "calc(10% - 8px)", minWidth: 80, opacity: 0, animation: "fadeIn 0.6s ease forwards", animationDelay: `${(((i * 0.618) % 1) * 2.2).toFixed(2)}s` }}>
                    <img src={sizedImg(it.img, 700)} alt={it.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      style={it.pos ? { objectPosition: it.pos } : undefined} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-1.5">
                      <p className="font-detail text-[9px] font-semibold uppercase tracking-wide text-cream leading-tight">{it.name}</p>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      )}

      {/* Grid view */}
      {!searchQuery && flatIdx === null && (
        <div className="flex-1 overflow-y-auto px-10 md:px-20 py-4 relative" data-lenis-prevent>
          {/* Slideshow + pill — ALL tab only, hidden once grid covers it */}
          {tab === "all" && !activeDesign && (
            <div style={{ opacity: showGrid ? 0 : 1, transition: "opacity 0.4s ease", pointerEvents: showGrid ? "none" : "auto" }}>
              <ScreensFeatureSlideshow />
              <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 82px" }}>
                <button
                  onClick={() => setShowGrid(true)}
                  style={{
                    background: "rgba(10,8,6,0.55)",
                    backdropFilter: "blur(18px) saturate(1.4)",
                    WebkitBackdropFilter: "blur(18px) saturate(1.4)",
                    border: "1px solid rgba(237,232,223,0.18)",
                    borderRadius: "999px",
                    padding: "10px 28px",
                    color: "rgba(237,232,223,0.9)",
                    fontFamily: "var(--font-detail)",
                    fontSize: "11px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                  }}
                >
                  View Gallery
                </button>
              </div>
            </div>
          )}
          {/* Grid — slides up over the slideshow like a blind */}
          <div style={{
            transform: tab === "all" && !activeDesign && showGrid ? "translateY(-508px)" : "translateY(0)",
            transition: "transform 0.9s cubic-bezier(0.22,1,0.36,1)",
          }}>
          <div className="flex flex-wrap justify-center gap-2">
            {gridItems.map((it, i) => (
              <React.Fragment key={it.img}>
                <div
                  onClick={() => {
                    if (!activeDesign) {
                      setActiveDesign(it.name); setFlatIdx(null); setSlideIdx(0);
                    } else {
                      setFlatIdx(i); setSlideIdx(0); setJumpByDesign(false);
                    }
                  }}
                  className="group cursor-pointer relative aspect-square rounded-lg overflow-hidden border border-white/8 group-hover:border-clay/50 transition-all duration-200"
                  style={{ width: "calc(10% - 8px)", minWidth: 80, opacity: 0, animation: "fadeIn 0.6s ease forwards", animationDelay: `${(((i * 0.618) % 1) * 2.2).toFixed(2)}s` }}>
                  <img src={sizedImg(it.img, 700)} alt={it.name} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    style={it.pos ? { objectPosition: it.pos } : undefined} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-1.5">
                    <p className="font-detail text-[9px] font-semibold uppercase tracking-wide text-cream leading-tight">{it.name}</p>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
          </div>
        </div>
      )}

      {/* Expanded / slideshow view */}
      {!searchQuery && flatIdx !== null && curFlat && curItem && (
        <>
          <div className="flex-1 flex relative overflow-hidden min-h-0">
            <div className="flex-1 flex flex-col items-center justify-center relative min-w-0">
              <button onClick={() => navigateFlat(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-cream transition-colors"
                style={{ fontSize: 20 }}>‹</button>

              <div style={{ transition: "opacity 0.18s, transform 0.18s", opacity: animDir ? 0 : 1, transform: animDir ? `translateX(${animDir > 0 ? 28 : -28}px)` : "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "16px 64px", width: "100%" }}>
                <img src={sizedImg(displayImg, 1600)} alt={curFlat.name}
                  style={{ maxHeight: "68vh", maxWidth: "100%", objectFit: "contain", borderRadius: 12, boxShadow: "0 20px 56px rgba(0,0,0,0.7)" }} />
                <p className="font-heading font-semibold text-base text-cream/90 tracking-wide">{curFlat.name}</p>
              </div>

              <button onClick={() => navigateFlat(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-cream transition-colors"
                style={{ fontSize: 20 }}>›</button>
            </div>
          </div>

          {/* Thumbs strip */}
          <div className="flex-shrink-0 border-t border-white/10" style={{ marginTop: 24 }}>
            <div ref={thumbStripRef} data-lenis-prevent className="flex items-center gap-1.5 px-5 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}
              onWheel={e => { e.preventDefault(); thumbStripRef.current.scrollLeft += e.deltaY + e.deltaX; }}>
              {gridItems.map((it, fi) => {
                const isActive     = fi === flatIdx;
                const isSameDesign = it.name === curFlat?.name;
                return (
                  <div key={fi}
                    ref={isActive ? activeThumbRef : null}
                    onClick={() => { setFlatIdx(fi); setSlideIdx(0); setJumpByDesign(true); }}
                    className="flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                    style={{ width: 52, height: 52, border: `1.5px solid ${isActive ? "#9e7134" : "transparent"}`, opacity: isActive ? 1 : isSameDesign ? 0.75 : 0.35, transition: "all 0.2s" }}>
                    <img src={sizedImg(it.img, 600)} alt={it.name} className="w-full h-full object-cover" />
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {showCat && <ScreensCatalogueModal onClose={() => setShowCat(false)} />}
    </div>
  );
}


function ProjectInfoPopup({ project, onClose }) {
  if (!project) return null;
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 10100, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: "#141414", border: "1px solid rgba(242,240,233,0.1)", borderRadius: 18, width: "100%", maxWidth: 820, maxHeight: "90dvh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}
      >
        {/* Header */}
        <div style={{ flexShrink: 0, padding: "28px 32px 20px", borderBottom: "1px solid rgba(242,240,233,0.08)" }}>
          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 18, background: "none", border: "none", color: "rgba(242,240,233,0.35)", cursor: "pointer", fontSize: 20, lineHeight: 1 }}>✕</button>
          {project.location && (
            <p style={{ fontFamily: "var(--font-detail)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9E7134", margin: "0 0 8px" }}>
              {project.location}
            </p>
          )}
          <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(20px,3vw,30px)", color: "#F2F0E9", margin: 0, letterSpacing: "0.05em", textTransform: "uppercase", lineHeight: 1.15 }}>
            {project.name}
          </p>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px 32px" }} data-lenis-prevent>

          {/* Description */}
          {project.description && (
            <p style={{ fontFamily: "var(--font-detail)", fontSize: 14, color: "rgba(242,240,233,0.7)", lineHeight: 1.85, margin: "0 0 28px" }}>
              {project.description}
            </p>
          )}

          {/* Behind the Scenes images */}
          {!project.hideBehindTheScenes && (
            <>
              <p style={{ fontFamily: "var(--font-detail)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(242,240,233,0.6)", margin: "0 0 12px" }}>Behind the Scenes</p>
              {project.behindTheScenes && project.behindTheScenes.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
                  {project.behindTheScenes.map((it, i) => (
                    <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(242,240,233,0.08)" }}>
                      <img src={it.img} alt={it.name} loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: it.pos || "center" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)", opacity: 0, transition: "opacity 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                        onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                        <p style={{ position: "absolute", bottom: 8, left: 8, right: 8, fontFamily: "var(--font-detail)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "#F2F0E9", lineHeight: 1.3 }}>{it.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectsGalleryModal({ onClose }) {
  const [activeProjectCat, setActiveProjectCat] = useState("all");
  const [itemIdx, setItemIdx] = useState(null);
  const [slideIdx, setSlideIdx] = useState(0);
  const [animDir, setAnimDir] = useState(null);
  const [infoProject, setInfoProject] = useState(null);

  const items = activeProjectCat === "all"
    ? PROJECTS_ROWS.flatMap(r => r.items.map(it => ({ ...it, _cat: r.projectCategory, _rowId: r.id })))
    : PROJECTS_ROWS.filter(r => r.projectCategory === activeProjectCat).flatMap(r => r.items.map(it => ({ ...it, _cat: r.projectCategory, _rowId: r.id })));

  const item = itemIdx !== null ? items[itemIdx] : null;
  const currentItemCat = item?._cat ?? null;
  const slides = item ? (item.slides || [item.img]) : [];
  const total = items.length;

  const navTimerRef = useRef(null);
  const schedule = useCallback((fn, ms = 180) => {
    clearTimeout(navTimerRef.current);
    navTimerRef.current = setTimeout(fn, ms);
  }, []);
  useEffect(() => () => clearTimeout(navTimerRef.current), []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setItemIdx(null); setSlideIdx(0); }, [activeProjectCat]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        if (itemIdx !== null) { setItemIdx(null); setSlideIdx(0); return; }
        onClose();
      }
      if (itemIdx !== null) {
        if (e.key === "ArrowRight") { setAnimDir(1); schedule(() => { setItemIdx(i => (i + 1) % total); setSlideIdx(0); setAnimDir(null); }); }
        if (e.key === "ArrowLeft")  { setAnimDir(-1); schedule(() => { setItemIdx(i => (i - 1 + total) % total); setSlideIdx(0); setAnimDir(null); }); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [itemIdx, onClose, total, schedule]);

  const navigate = (dir) => {
    setAnimDir(dir);
    schedule(() => { setItemIdx(i => (i + dir + total) % total); setSlideIdx(0); setAnimDir(null); });
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-jet flex flex-col">
      {/* Top bar */}
      <div className="flex items-center px-5 py-3 border-b border-white/10 flex-shrink-0 gap-3">
        <button onClick={() => { onClose(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="font-heading font-bold text-sm tracking-widest text-cream flex-none">
          ROGET<span className="font-light italic">james</span>
          <span className="font-detail text-[9px] font-normal not-italic uppercase tracking-[0.2em] text-cream/50 ml-2">· Projects</span>
        </button>
        <div className="flex-1" />
        <button onClick={onClose} className="flex-none text-cream/40 hover:text-cream transition-colors"><X size={15} /></button>
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-2 px-5 py-2.5 border-b border-white/8 flex-shrink-0">
        <div className="flex gap-2 overflow-x-auto flex-1" style={{ scrollbarWidth: "none" }}>
        {[{ id: "all", label: "All" }, ...PROJECT_CATEGORIES].map(cat => {
          const isActive = activeProjectCat === cat.id;
          const isPosition = !isActive && cat.id !== "all" && currentItemCat === cat.id && itemIdx !== null;
          return (
            <button
              key={cat.id}
              onClick={() => { setActiveProjectCat(cat.id); setItemIdx(null); setSlideIdx(0); }}
              className={`pill-trace flex-shrink-0 px-4 py-1.5 rounded-full font-detail text-[9px] uppercase tracking-[0.16em] border transition-colors duration-200${isActive ? " pill-active" : ""}`}
              style={{
                background: "transparent",
                borderColor: isActive ? "#9e7134" : isPosition ? "rgba(242,240,233,0.8)" : "rgba(242,240,233,0.45)",
                color:       isActive ? "#f2f0e9"  : isPosition ? "#f2f0e9"               : "rgba(242,240,233,0.9)",
                whiteSpace: "nowrap",
              }}
            >
              {cat.label}
            </button>
          );
        })}
        </div>
        {activeProjectCat !== "all" && (() => {
          const row = PROJECTS_ROWS.find(r => r.projectCategory === activeProjectCat);
          return row ? (
            <button
              onClick={() => setInfoProject(row)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-detail text-[9px] uppercase tracking-[0.16em] border transition-all duration-200"
              style={{ borderColor: "rgba(242,240,233,0.25)", color: "rgba(242,240,233,0.9)", whiteSpace: "nowrap" }}
            >
              <span style={{ fontSize: 11 }}>ⓘ</span> Project Info
            </button>
          ) : null;
        })()}
      </div>

      {/* Grid view */}
      {itemIdx === null && (
        <div className="flex-1 overflow-y-auto px-5 md:px-10 py-4" data-lenis-prevent>
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="font-detail text-[11px] text-cream/30 uppercase tracking-widest">Images coming soon</p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2">
              {items.map((it, i) => (
                <div key={it.img} onClick={() => { setItemIdx(i); setSlideIdx(0); }}
                  className="group cursor-pointer relative aspect-square rounded-lg overflow-hidden border border-white/8 hover:border-clay/50 transition-all duration-200"
                  style={{ width: "calc(10% - 8px)", minWidth: 80, opacity: 0, animation: "fadeIn 0.6s ease forwards", animationDelay: `${(((i * 0.618) % 1) * 2.2).toFixed(2)}s` }}>
                  <img src={sizedImg(it.img, 700)} alt={it.name} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    style={it.pos ? { objectPosition: it.pos } : undefined} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-1.5">
                    <p className="font-detail text-[9px] font-semibold uppercase tracking-wide text-cream leading-tight">{it.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {itemIdx !== null && item && (
        <>
          <div className="flex-1 flex relative overflow-hidden min-h-0">
            <div className="flex-1 flex flex-col items-center justify-center relative min-w-0">
              <button onClick={() => navigate(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-cream transition-colors"
                style={{ fontSize: 20 }}>‹</button>
              <div style={{ transition: "opacity 0.18s, transform 0.18s", opacity: animDir ? 0 : 1, transform: animDir ? `translateX(${animDir > 0 ? 28 : -28}px)` : "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "16px 64px", width: "100%" }}>
                <img src={sizedImg(slides[slideIdx] ?? item.img, 1600)} alt={item.name}
                  style={{ maxHeight: "68vh", maxWidth: "100%", objectFit: "contain", borderRadius: 12, boxShadow: "0 20px 56px rgba(0,0,0,0.7)" }} />
                <p className="font-heading font-semibold text-base text-cream/90 tracking-wide">{item.name}</p>
              </div>
              <button onClick={() => navigate(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-cream transition-colors"
                style={{ fontSize: 20 }}>›</button>
            </div>
          </div>
          <div className="flex-shrink-0 border-t border-white/10">
            <div className="flex items-center gap-1.5 px-5 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {items.flatMap((it, iIdx) => {
                const thumbSlides = it.slides || [it.img];
                const els = thumbSlides.map((src, sIdx) => {
                  const isActive = iIdx === itemIdx && sIdx === slideIdx;
                  return (
                    <div key={`${iIdx}-${sIdx}`} onClick={() => { setItemIdx(iIdx); setSlideIdx(sIdx); }}
                      className="flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                      style={{ width: 52, height: 52, border: `1.5px solid ${isActive ? "#9e7134" : "transparent"}`, opacity: isActive ? 1 : iIdx === itemIdx ? 0.75 : 0.45, transition: "all 0.2s" }}>
                      <img src={sizedImg(src, 600)} alt={it.name} className="w-full h-full object-cover" />
                    </div>
                  );
                });
                if (iIdx > 0) els.unshift(<div key={`sep-${iIdx}`} style={{ width: 1, height: 34, background: "rgba(242,240,233,0.12)", flexShrink: 0, borderRadius: 1, margin: "0 3px" }} />);
                return els;
              })}
            </div>
          </div>
        </>
      )}
      <ProjectInfoPopup project={infoProject} onClose={() => setInfoProject(null)} />
    </div>
  );
}

export function ConceptsGalleryModal({ onClose }) {
  return <SculptureGalleryModal onClose={onClose} items={CONCEPTS_ITEMS} label="Concepts" />;
}

export function SculptureGalleryModal({ onClose, items: itemsProp = null, label: labelProp = "Sculpture" }) {
  const items = itemsProp ?? SCULPTURE_ITEMS;
  const [itemIdx, setItemIdx] = useState(null);
  const [slideIdx, setSlideIdx] = useState(0);
  const [animDir, setAnimDir] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef(null);
  const touchStartX = useRef(0);

  const item = itemIdx !== null ? items[itemIdx] : null;

  const slides = item ? (item.slides || [item.img]) : [];
  const total = items.length;

  const navTimerRef = useRef(null);
  const schedule = useCallback((fn, ms = 180) => {
    clearTimeout(navTimerRef.current);
    navTimerRef.current = setTimeout(fn, ms);
  }, []);
  useEffect(() => () => clearTimeout(navTimerRef.current), []);

  const searchResults = searchQuery
    ? items.map((it, i) => ({ ...it, origIdx: i })).filter(it => it.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        if (searchQuery) { setSearchQuery(""); return; }
        if (searchOpen) { setSearchOpen(false); return; }
        if (itemIdx !== null) { setItemIdx(null); setSlideIdx(0); return; }
        onClose();
      }
      if (itemIdx !== null && !searchOpen) {
        if (e.key === "ArrowRight") { setAnimDir(1); schedule(() => { setItemIdx(i => (i + 1) % total); setSlideIdx(0); setAnimDir(null); }); }
        if (e.key === "ArrowLeft")  { setAnimDir(-1); schedule(() => { setItemIdx(i => (i - 1 + total) % total); setSlideIdx(0); setAnimDir(null); }); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [itemIdx, onClose, total, searchQuery, searchOpen, schedule]);

  const navigate = (dir) => {
    setAnimDir(dir);
    schedule(() => { setItemIdx(i => (i + dir + total) % total); setSlideIdx(0); setAnimDir(null); });
  };

  return (
    <div
      className="fixed inset-0 z-[10000] bg-jet flex flex-col"
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={e => { const dx = e.changedTouches[0].clientX - touchStartX.current; if (Math.abs(dx) > 50 && itemIdx !== null) navigate(dx < 0 ? 1 : -1); }}
    >
      {/* Top bar */}
      <div className="flex items-center px-5 py-3 border-b border-white/10 flex-shrink-0 gap-3 relative">
        <button onClick={() => { onClose(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="font-heading font-bold text-sm tracking-widest text-cream flex-none">
          ROGET<span className="font-light italic">james</span>
          <span className="font-detail text-[9px] font-normal not-italic uppercase tracking-[0.2em] text-cream/50 ml-2">· {labelProp}</span>
        </button>
        <div className="flex-1" />

        {/* Search */}
        <div className="flex items-center gap-2 relative">
          <div style={{ display: "flex", alignItems: "center", background: searchOpen ? "rgba(242,240,233,0.08)" : "transparent", borderRadius: 20, transition: "all 0.2s", padding: searchOpen ? "4px 10px" : "4px 6px", border: searchOpen ? "1px solid rgba(242,240,233,0.15)" : "1px solid transparent" }}>
            <button onClick={() => { setSearchOpen(s => !s); if (!searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50); else { setSearchQuery(""); setSearchFocused(false); } }}
              className="text-cream/50 hover:text-cream transition-colors flex-shrink-0" style={{ lineHeight: 1 }}>
              <Search size={13} />
            </button>
            {searchOpen && (
              <input ref={searchInputRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)} onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                placeholder="search sculpture…"
                className="bg-transparent text-cream text-[13px] outline-none ml-2 w-20 md:w-32 placeholder-cream/30 font-detail" />
            )}
          </div>
          {/* Suggestions dropdown */}
          {searchOpen && searchFocused && !searchQuery && (
            <div className="absolute right-0 bg-jet border border-white/12 rounded-xl shadow-2xl z-50 min-w-[200px] py-2" style={{ top: "49px" }}>
              {SCULPTURE_SEARCH_SUGGESTIONS.map(group => (
                <div key={group.label} className="px-3 py-1">
                  <p className="font-detail text-[9px] uppercase tracking-[0.14em] text-cream/30 mb-1">{group.label}</p>
                  <div className="flex flex-wrap gap-1">
                    {group.items.map(item => (
                      <button key={item} onMouseDown={() => { setSearchQuery(item); }}
                        className="font-detail text-[10px] text-cream/60 hover:text-cream bg-white/5 hover:bg-white/10 rounded-full px-2 py-0.5 transition-colors capitalize">
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={onClose} className="flex-none text-cream/40 hover:text-cream transition-colors"><X size={15} /></button>
      </div>

      {/* Search results */}
      {searchQuery && (
        <div className="flex-1 overflow-y-auto px-10 md:px-20 py-4" data-lenis-prevent>
          {searchResults.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="font-detail text-[11px] text-cream/30 uppercase tracking-widest">No results for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2">
              {searchResults.map((it, i) => (
                <div key={it.origIdx} onClick={() => { setItemIdx(it.origIdx); setSlideIdx(0); setSearchQuery(""); setSearchOpen(false); }}
                  className="group cursor-pointer relative aspect-square rounded-lg overflow-hidden border border-white/8 group-hover:border-clay/50 transition-all duration-200"
                  style={{ width: "calc(10% - 8px)", minWidth: 80, opacity: 0, animation: "fadeIn 0.6s ease forwards", animationDelay: `${(((i * 0.618) % 1) * 2.2).toFixed(2)}s` }}>
                  <img src={sizedImg(it.img, 700)} alt={it.name} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    style={it.pos ? { objectPosition: it.pos } : undefined} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-1.5">
                    <p className="font-detail text-[9px] font-semibold uppercase tracking-wide text-cream leading-tight">{it.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Grid view */}
      {!searchQuery && itemIdx === null && (
        <div className="flex-1 overflow-y-auto px-10 md:px-20 py-4" data-lenis-prevent>
          <div className="flex flex-wrap justify-center gap-2">
            {items.map((it, i) => (
              <div key={it.img} onClick={() => { setItemIdx(i); setSlideIdx(0); }}
                className="group cursor-pointer relative aspect-square rounded-lg overflow-hidden border border-white/8 group-hover:border-clay/50 transition-all duration-200"
                style={{ width: "calc(10% - 8px)", minWidth: 80, opacity: 0, animation: "fadeIn 0.6s ease forwards", animationDelay: `${(((i * 0.618) % 1) * 2.2).toFixed(2)}s` }}>
                <img src={sizedImg(it.img, 700)} alt={it.name} loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  style={it.pos ? { objectPosition: it.pos } : undefined} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-1.5">
                  <p className="font-detail text-[9px] font-semibold uppercase tracking-wide text-cream leading-tight">{it.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Card view */}
      {!searchQuery && itemIdx !== null && item && (
        <>
          <div className="flex-1 flex relative overflow-hidden min-h-0">
            <div className="flex-1 flex flex-col items-center justify-center relative min-w-0">
              <button onClick={() => navigate(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-cream transition-colors"
                style={{ fontSize: 20 }}>‹</button>

              <div style={{ transition: "opacity 0.18s, transform 0.18s", opacity: animDir ? 0 : 1, transform: animDir ? `translateX(${animDir > 0 ? 28 : -28}px)` : "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "16px 64px", width: "100%" }}>
                <img src={sizedImg(slides[slideIdx] ?? item.img, 1600)} alt={item.name}
                  style={{ maxHeight: "68vh", maxWidth: "100%", objectFit: "contain", borderRadius: 12, boxShadow: "0 20px 56px rgba(0,0,0,0.7)" }} />
                <p className="font-heading font-semibold text-base text-cream/90 tracking-wide">{item.name}</p>
              </div>

              <button onClick={() => navigate(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-cream transition-colors"
                style={{ fontSize: 20 }}>›</button>
            </div>
          </div>

          {/* Thumbs strip */}
          <div className="flex-shrink-0 border-t border-white/10">
            <div className="flex items-center gap-1.5 px-5 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {items.flatMap((it, iIdx) => {
                const thumbSlides = it.slides || [it.img];
                const els = thumbSlides.map((src, sIdx) => {
                  const isActive = iIdx === itemIdx && sIdx === slideIdx;
                  return (
                    <div key={`${iIdx}-${sIdx}`} onClick={() => { setItemIdx(iIdx); setSlideIdx(sIdx); }}
                      className="flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                      style={{ width: 52, height: 52, border: `1.5px solid ${isActive ? "#9e7134" : "transparent"}`, opacity: isActive ? 1 : iIdx === itemIdx ? 0.75 : 0.45, transition: "all 0.2s" }}>
                      <img src={sizedImg(src, 600)} alt={it.name} className="w-full h-full object-cover" />
                    </div>
                  );
                });
                return els;
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
