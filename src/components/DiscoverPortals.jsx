import { useEffect, useRef, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Play, Pause, ExternalLink, Phone, Mail, Instagram } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScreensGalleryModal, SculptureGalleryModal, ProjectsGalleryModal, ConceptsGalleryModal } from "./BespokeCommissions";

gsap.registerPlugin(ScrollTrigger);

const ASSOCIATES = [
  {
    id: "hederablu",
    name: "HederaBlu",
    role: "Commercial Contractor",
    logo: "/images/associates/hederablu-card.png",
    description: "Commercial fitout and installations — Western Australia.",
    web: "",
    phone: "0478 044 948",
    email: "info@hederablu.com.au",
    instagram: "@hederablu.contracting",
  },
];

const PAINTINGS = [
  { src: "/images/paintings/sea-bird-bloom.jpg",   title: "Sea Bird Bloom",  medium: "Mixed media",   dims: "1500 × 1500 mm", year: "2023", sold: true  },
  { src: "/images/paintings/the-waterhole.jpg",    title: "The Waterhole",   medium: "Oil on canvas", dims: "1000 × 1500 mm", year: "2011", sold: true  },
  { src: "/images/paintings/sticks-and-stones.jpg",title: "Sticks & Stones", medium: "Oil on canvas", dims: "1500 × 1200 mm", year: "2011", sold: true  },
  { src: "/images/paintings/bluebird.jpg",          title: "Bluebird",        medium: "Oil on canvas", dims: "1800 × 1200 mm", year: "2011", sold: true  },
  { src: "/images/paintings/trees.jpg",             title: "Trees",           medium: "Mixed media",   dims: "1000 × 1500 mm", year: "2010", sold: true  },
  { src: "/images/paintings/terra-australis.jpg",  title: "Terra Australis", medium: "Oil on canvas", dims: "1500 × 1000 mm", year: "2010", sold: true, maxW: "74%"  },
];

const CDN_DP = "https://cdn.myportfolio.com/b2648aa0-9d7e-45a7-9f99-54d55b4ec92e";

const CLIENT_IMAGES = [
  { src: "/images/client/banksia-wall-art-series.jpg", title: "Banksia — Wall Art Series" },
  { src: "/images/client/wattle-melb.jpg",             title: "Wattle — Melbourne Install" },
  { src: "/images/libratum-1.jpg",                     title: "LIBRATUM" },
  { src: "/images/metropolis-client-1.jpg",            title: "METROPOLIS" },
  { src: "/images/benin-inspired-1.jpg",               title: "BENIN Inspired" },
  { src: "/images/omare-marion-front.jpg",             title: "OMARE — Marion" },
];

const PORTALS = [
  {
    id: "client-works",
    label: "Client Images",
    sublabel: "In Situ",
    slides: CLIENT_IMAGES.map(i => i.src),
    popup: CLIENT_IMAGES,
    popupType: "reels",
  },
  {
    id: "art-elements",
    label: "Art Elements",
    sublabel: "Studio & Exploration",
    slides: PAINTINGS.slice(0, 6).map(p => p.src),
    popup: PAINTINGS,
  },
  {
    id: "links",
    label: "Links",
    sublabel: "Associations",
    slides: [
      "/images/associates/hederablu-portal.png",
    ],
    slideScale: 0.92,
    popupType: "links",
  },
];

export function CommissionsGalleryPopup({ videos, onClose, title }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const lineLeftRef  = useRef(null);
  const lineRightRef = useRef(null);

  useEffect(() => {
    gsap.set(lineLeftRef.current,  { scaleX: 0 });
    gsap.set(lineRightRef.current, { scaleX: 0 });
    const t = setTimeout(() => {
      gsap.to(lineLeftRef.current,  { scaleX: 1, duration: 1.1, ease: "power3.out" });
      gsap.to(lineRightRef.current, { scaleX: 1, duration: 1.1, ease: "power3.out" });
    }, 120);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = e => { if (e.key === "Escape") { if (activeIdx !== null) setActiveIdx(null); else onClose(); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, activeIdx]);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90" onClick={onClose}>
      <div className="flex flex-col bg-[#1c1c1c] rounded-2xl overflow-hidden shadow-2xl"
        style={{ width: "min(90vw, 700px)", maxHeight: "90dvh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header — logo + animated lines */}
        <div className="flex-none flex items-center px-5 border-b border-white/8" style={{ height: "clamp(60px, 12vw, 88px)" }}>
          <div className="w-8 h-8 flex-none" />
          <div className="flex-1 flex items-center justify-center overflow-visible">
            <div className="relative flex items-center justify-center overflow-visible" style={{ width: "58px", height: "58px" }}>
              <span ref={lineLeftRef} style={{
                position: "absolute", right: "calc(100% + 10px)", top: "50%", marginTop: "-0.75px",
                width: "90px", height: "1.5px",
                background: "rgba(242,240,233,0.35)",
                transformOrigin: "right center",
              }} />
              <span ref={lineRightRef} style={{
                position: "absolute", left: "calc(100% + 10px)", top: "50%", marginTop: "-0.75px",
                width: "90px", height: "1.5px",
                background: "rgba(242,240,233,0.35)",
                transformOrigin: "left center",
              }} />
              <div style={{ position: "absolute", width: "62px", height: "62px", top: "50%", left: "50%", transform: "translate(-54%, -50%)", borderRadius: "50%", background: "#111", border: "1px solid rgba(242,240,233,0.2)" }} />
              <img src="/images/roj-logo.png" alt="ROGETjames" style={{ position: "relative", zIndex: 1, height: "62px", opacity: 0.45, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }} />
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex-none rounded-full border border-white/15 flex items-center justify-center text-cream/50 hover:text-cream hover:border-white/35 transition-all">
            <X size={14} />
          </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-5 py-5 border-b border-white/8" style={{ background: "#141414", boxShadow: "inset 0 8px 14px -6px rgba(0,0,0,0.55)" }} data-lenis-prevent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {videos.map((v, i) => (
              <button key={i} onClick={() => setActiveIdx(i)}
                className="group relative rounded-xl overflow-hidden text-left aspect-square border border-white/8 hover:border-white/25 transition-all duration-300"
              >
                {v.poster
                  ? <img src={v.poster || v.thumb} alt={v.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" style={{ objectPosition: v.posterPos || "center center" }} />
                  : <video src={v.src || v.video} muted playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" />
                }
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center">
                    <Play size={18} className="text-cream ml-0.5" />
                  </div>
                </div>
                {v.title && (
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5 bg-gradient-to-t from-black/90 to-transparent">
                    <p className="font-heading font-semibold text-[11px] uppercase tracking-[0.12em] text-cream truncate">{v.title}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom — title */}
        <div className="flex-none flex items-center justify-center px-5 border-t border-white/8" style={{ background: "#222222", height: "clamp(52px, 10vw, 88px)" }}>
          {title && <span className="font-heading font-bold text-sm uppercase tracking-[0.25em] text-cream/70">{title}</span>}
        </div>

      </div>

      {/* Full-screen video playback */}
      {activeIdx !== null && (
        <VideoPopup videos={videos} startIdx={activeIdx} onClose={() => setActiveIdx(null)} />
      )}
    </div>
  );
}

function VideoPopup({ videos, startIdx, onClose }) {
  const [idx, setIdx] = useState(startIdx);
  const v = videos[idx];

  const next = () => setIdx(i => (i + 1) % videos.length);
  const prev = () => setIdx(i => (i - 1 + videos.length) % videos.length);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/95" onClick={e => { e.stopPropagation(); onClose(); }}>
      <button onClick={onClose} className="absolute top-5 right-5 w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-cream/50 hover:text-cream hover:border-white/40 transition-all">
        <X size={15} />
      </button>
      {videos.length > 1 && <>
        <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-cream/50 hover:text-cream hover:border-white/40 transition-all">
          <ChevronLeft size={18} />
        </button>
        <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-cream/50 hover:text-cream hover:border-white/40 transition-all">
          <ChevronRight size={18} />
        </button>
      </>}
      <div className="flex flex-col items-center gap-4" onClick={e => e.stopPropagation()}>
        <video key={v.src}
          src={v.src} autoPlay controls controlsList="nodownload noremoteplayback nofullscreen" disablePictureInPicture playsInline
          className="max-w-[62vw] max-h-[60vh] rounded-2xl"
        />
        {(v.title || v.detail) && (
          <div className="text-center max-w-[62vw]">
            {v.title && <p className="font-heading font-semibold text-cream text-sm tracking-wide">{v.title}</p>}
            {v.detail && <p className="font-detail text-cream/55 text-xs leading-relaxed mt-1">{v.detail}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function ArtPopup({ images, startIndex, onClose }) {
  const [cur, setCur] = useState(startIndex);
  const [dir, setDir] = useState(1);
  const [animKey, setAnimKey] = useState(0);
  const [playing, setPlaying] = useState(false);
  const thumbRowRef = useRef(null);
  const thumbRefs = useRef([]);

  const go = useCallback((d) => {
    setDir(d);
    setAnimKey(k => k + 1);
    setCur(c => (c + d + images.length) % images.length);
  }, [images.length]);

  const prev = useCallback(() => go(-1), [go]);
  const next = useCallback(() => go(1), [go]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => go(1), 6000);
    return () => clearInterval(id);
  }, [playing, go]);

  const handleImageAreaClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) prev(); else next();
  }, [prev, next]);

  useEffect(() => {
    const handler = e => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  useEffect(() => {
    thumbRefs.current[cur]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [cur]);

  const slideAnim = dir > 0 ? "slideInRight 0.7s cubic-bezier(0.25,0.46,0.45,0.94)" : "slideInLeft 0.7s cubic-bezier(0.25,0.46,0.45,0.94)";

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/55 backdrop-blur-md" onClick={onClose}>
    <div className="flex flex-col bg-[#222222] rounded-2xl overflow-hidden shadow-2xl" style={{ width: "85vw", height: "85vh", maxWidth: "1100px" }} onClick={e => e.stopPropagation()}>

      {/* Header */}
      <div className="flex-none flex items-center justify-between px-5 py-3 border-b border-white/8">
        <p className="font-detail text-[9px] text-cream/60 uppercase tracking-[0.22em]">
          Painting — by James Roget
          <span className="text-cream/40 ml-3">{cur + 1} / {images.length}</span>
        </p>
        <div className="flex items-center gap-2">
          <button onClick={() => setPlaying(p => !p)} className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-cream/60 hover:text-cream hover:bg-white/15 transition-all" aria-label={playing ? "Pause" : "Play"}>
            {playing ? <Pause size={12} /> : <Play size={12} />}
          </button>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-cream/60 hover:text-cream hover:bg-white/15 transition-all">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Main image — click left half = prev, right half = next */}
      <div
        className="flex-1 min-h-0 relative flex items-center justify-center px-6 py-5 cursor-pointer select-none"
        onClick={handleImageAreaClick}
      >
        <img
          key={animKey}
          src={images[cur].src}
          alt={images[cur].title || `Painting ${cur + 1}`}
          className="max-h-full object-contain rounded-lg pointer-events-none"
          style={{ animation: slideAnim, filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.7))", maxWidth: images[cur].maxW || "100%" }}
        />
        {/* Left/right nav zones — always visible on mobile, hover-only on desktop */}
        <div className="absolute left-0 top-0 w-1/2 h-full flex items-center pl-4 opacity-100 md:opacity-0 md:hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="w-9 h-9 rounded-full bg-black/30 border border-white/10 flex items-center justify-center text-cream/50">
            <ChevronLeft size={16} />
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-end pr-4 opacity-100 md:opacity-0 md:hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="w-9 h-9 rounded-full bg-black/30 border border-white/10 flex items-center justify-center text-cream/50">
            <ChevronRight size={16} />
          </div>
        </div>
      </div>

      {/* Caption */}
      {(images[cur].title || images[cur].medium) && (
        <div className="flex-none px-6 pb-3 pt-1 flex items-center gap-3">
          {images[cur].title && <span className="font-heading font-bold text-sm text-cream/90">{images[cur].title}</span>}
          {images[cur].medium && <span className="font-detail text-[10px] text-cream/60">{images[cur].medium}</span>}
          {images[cur].dims   && <span className="font-detail text-[10px] text-cream/50">{images[cur].dims}</span>}
          {images[cur].year   && <span className="font-detail text-[10px] text-cream/40">{images[cur].year}</span>}
          {images[cur].sold   && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 flex-none inline-block" style={{ boxShadow: "0 0 4px rgba(239,68,68,0.8)" }} />
          )}
        </div>
      )}

      {/* Thumbnail strip */}
      <div
        ref={thumbRowRef}
        className="flex-none flex gap-2 px-4 py-3 overflow-x-auto border-t border-white/8"
        data-lenis-prevent
        style={{ scrollbarWidth: "none" }}
      >
        {images.map((p, i) => (
          <button
            key={i}
            ref={el => { thumbRefs.current[i] = el; }}
            onClick={() => { setDir(i > cur ? 1 : -1); setAnimKey(k => k + 1); setCur(i); }}
            className={`flex-none rounded-md overflow-hidden border-2 transition-all duration-200 ${i === cur ? "border-clay opacity-100" : "border-transparent opacity-50 hover:opacity-80"}`}
            style={{ width: "64px", height: "48px" }}
          >
            <img src={p.src} alt="" className="w-full h-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
    </div>
  );
}

function LinksPopup({ onClose }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/55 backdrop-blur-md" onClick={onClose}>
      <div className="flex flex-col bg-[#222222] rounded-2xl overflow-hidden shadow-2xl" style={{ width: "85vw", maxWidth: "760px", maxHeight: "85vh" }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex-none flex items-center justify-between px-5 py-3 border-b border-white/8">
          <p className="font-detail text-[9px] text-warm-gray uppercase tracking-[0.22em]">Associations</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-cream/60 hover:text-cream hover:bg-white/15 transition-all">
            <X size={14} />
          </button>
        </div>

        {/* Associate cards */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3" data-lenis-prevent>
          {ASSOCIATES.map((a) => (
            <div key={a.id} className="w-full bg-white/5 rounded-[2rem] border border-white/10 px-7 py-6 flex items-center gap-5 hover:border-white/25 transition-colors duration-700">

              {/* Logo */}
              <div className="flex-none w-20 h-20 rounded-full overflow-hidden bg-white flex items-center justify-center">
                <img src={a.logo} alt={a.name} className="w-full h-full object-cover" />
              </div>

              {/* Divider */}
              <div className="w-px self-stretch bg-white/10 flex-none" />

              {/* Name + role + description */}
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-bold text-lg text-cream/80">{a.name}</h3>
                <p className="font-detail text-[10px] text-warm-gray uppercase tracking-wider mt-0.5 mb-2">{a.role}</p>
                <p className="text-sm text-warm-gray leading-relaxed">{a.description}</p>
              </div>

              {/* Clay divider */}
              <div className="w-px self-stretch bg-clay/40 flex-none" />

              {/* Contact & links */}
              <div className="flex-none w-36 pl-2 flex flex-col gap-2.5">
                {a.web       && <a href={a.web} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-detail text-[11px] text-clay hover:text-cream transition-colors"><ExternalLink size={12} />Website</a>}
                {a.phone     && <a href={`tel:${a.phone}`}    className="flex items-center gap-2 font-detail text-[11px] text-clay hover:text-cream transition-colors"><Phone size={12} />{a.phone}</a>}
                {a.email     && <a href={`mailto:${a.email}`} className="flex items-center gap-2 font-detail text-[11px] text-clay hover:text-cream transition-colors"><Mail size={12} />{a.email}</a>}
                {a.instagram && <span className="flex items-center gap-2 font-detail text-[11px] text-clay"><Instagram size={12} />{a.instagram}</span>}
                {!a.web && !a.phone && !a.email && !a.instagram && <span className="font-detail text-[10px] text-warm-gray/40 uppercase tracking-wider">Details coming</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniPortal({ portal, size = 166, hideLabel = false, onOpen = null, hoverLabel = "View", hoverLabelSize = "11px", alwaysLabel = false, arcLabel = null, noGlow = false }) {
  const [cur, setCur] = useState(0);
  const [glowing, setGlowing] = useState(false);
  const [popOpen, setPopOpen] = useState(false);
  const timerRef = useRef(null);
  const videos = portal.videos || (portal.video ? [{ src: portal.video, title: portal.videoTitle, detail: portal.videoDetail }] : null);
  const canOpen = videos || portal.popup || portal.popupType;

  useEffect(() => {
    if (videos) {
      timerRef.current = setInterval(() => setCur(p => (p + 1) % videos.length), 8000);
      return () => clearInterval(timerRef.current);
    }
    if (!portal.slides.length) return;
    timerRef.current = setInterval(
      () => setCur(p => (p + 1) % portal.slides.length),
      3400 + Math.random() * 800
    );
    return () => clearInterval(timerRef.current);
  }, [portal.slides.length, videos?.length]);

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        {/* Wrapper gives us a clean relative context outside the button's border-radius clipping */}
        <div style={{ position: "relative", display: "inline-block" }}>
          {/* Radiating lines — outside the button so border-radius can't clip them */}
          {noGlow && (() => {
            const total = 24;
            const bw = size + 18;
            const pad = 60; // extra space for lines to extend into
            const svgW = bw + pad * 2;
            const cx = svgW / 2;
            const cy = svgW / 2;
            const r1 = size / 2 + 16;
            const r2 = r1 + 28;
            const lines = Array.from({ length: total }, (_, i) => {
              const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
              return {
                x1: cx + Math.cos(angle) * r1,
                y1: cy + Math.sin(angle) * r1,
                x2: cx + Math.cos(angle) * r2,
                y2: cy + Math.sin(angle) * r2,
              };
            });
            return (
              <svg
                style={{ position: "absolute", top: -pad, left: -pad, width: svgW, height: svgW, pointerEvents: "none", zIndex: 50, opacity: glowing ? 1 : 0, transition: "opacity 0.4s ease" }}
              >
                {lines.map((l, i) => (
                  <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="rgba(242,240,233,0.5)" strokeWidth="0.9" />
                ))}
              </svg>
            );
          })()}
          <button
            onClick={() => onOpen ? onOpen() : canOpen && setPopOpen(true)}
            onMouseEnter={() => setGlowing(true)}
            onMouseLeave={() => setGlowing(false)}
            className="group relative cursor-pointer"
            style={{
              borderRadius: "50%",
              padding: "9px",
              background: "linear-gradient(180deg, #6a6a6a 0%, #3a3a3a 28%, #1c1c1c 60%, #222222 100%)",
              boxShadow: (glowing && !noGlow)
                ? "inset 0 -4px 8px rgba(0,0,0,0.65), 0 6px 20px rgba(0,0,0,0.95), 0 0 0 4px #111, 0 0 0 6px rgba(255,255,255,0.28), 0 0 45px 12px rgba(255,255,255,0.12), 0 0 80px 24px rgba(255,255,255,0.05)"
                : "inset 0 -4px 8px rgba(0,0,0,0.65), 0 6px 20px rgba(0,0,0,0.95), 0 0 0 4px #111, 0 0 0 6px rgba(255,255,255,0.22)",
              transition: "box-shadow 0.6s ease",
            }}
            aria-label={portal.label}
          >
            <div className="relative overflow-hidden" style={{ width: `${size}px`, height: `${size}px`, borderRadius: "50%" }}>
              {videos ? videos.map((v, i) => (
                <video key={v.src} src={v.src} autoPlay muted loop playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: i === cur ? 1 : 0, transition: "opacity 1.8s ease" }} />
              )) : portal.slides.map((slide, i) => {
                const src = typeof slide === "string" ? slide : slide.src;
                const pos = typeof slide === "object" && slide.pos ? slide.pos : "center center";
                const scale = typeof slide === "object" && slide.scale ? slide.scale : (portal.slideScale || 1);
                return (
                  <img key={i} src={src} alt="" className="absolute inset-0 w-full h-full object-cover"
                    style={{ opacity: i === cur ? 1 : 0, transition: "opacity 1.4s ease", objectPosition: pos, transform: `scale(${scale})`, transformOrigin: pos }} loading="lazy" />
                );
              })}
              <div className="absolute inset-0 pointer-events-none z-10"
                style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 50%)" }} />
              <div className="absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-400 bg-black/60 opacity-0 group-hover:opacity-100"
                style={alwaysLabel ? { opacity: 1 } : {}}>
                <span className="font-detail font-bold text-cream uppercase tracking-[0.25em]" style={{ fontSize: hoverLabelSize }}>{hoverLabel}</span>
              </div>
            </div>
          {arcLabel && (() => {
            const fr = 9; // frame padding px
            // SVG covers the image circle only (inside the frame padding)
            const cx = size / 2;
            const cy = size / 2;
            const r = size / 2 - 10; // arc sits just inside the frame inner edge
            const fs = Math.max(6.5, Math.min(9, size * 0.048));
            const ls = Math.max(1.8, size * 0.024);
            return (
              <svg
                style={{ position: "absolute", top: fr, left: fr, pointerEvents: "none", zIndex: 30, overflow: "visible" }}
                width={size} height={size}
              >
                <defs>
                  <path id={`arc-${portal.id}`} d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`} />
                </defs>
                <text fill="rgba(255,255,255,0.80)" fontSize={fs} fontFamily="var(--font-heading, sans-serif)" fontWeight="700" letterSpacing={ls}>
                  <textPath href={`#arc-${portal.id}`} startOffset="50%" textAnchor="middle" dy="-3">
                    {arcLabel.toUpperCase()}
                  </textPath>
                </text>
              </svg>
            );
          })()}
          </button>
        </div>{/* end wrapper */}
        {!hideLabel && (
          <div className="text-center">
            <p className="font-detail text-[9px] text-warm-gray uppercase tracking-[0.22em]">{portal.sublabel}</p>
            <p className="font-heading font-bold text-xs text-cream/70 mt-0.5">{portal.label}</p>
          </div>
        )}
      </div>

      {popOpen && videos && portal.popupType !== "commissions-gallery" && <VideoPopup src={videos[cur].src} title={videos[cur].title} detail={videos[cur].detail} onClose={() => setPopOpen(false)} />}
      {popOpen && portal.popup                      && <ArtPopup   images={portal.popup} startIndex={cur} onClose={() => setPopOpen(false)} />}
      {popOpen && portal.popupType === "links"      && <LinksPopup onClose={() => setPopOpen(false)} />}
      {popOpen && portal.popupType === "commissions-gallery" && <CommissionsGalleryPopup videos={videos} images={portal.commissionImages} onClose={() => setPopOpen(false)} />}
    </>
  );
}

export default function DiscoverPortals() {
  const headerRef = useRef(null);
  const [bottomH, setBottomH] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [screensOpen, setScreensOpen] = useState(false);
  const [sculptureOpen, setSculptureOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [conceptsOpen, setConceptsOpen] = useState(false);
  const [clientReelsOpen, setClientReelsOpen] = useState(false);

  useEffect(() => {
    if (!headerRef.current) return;
    const measure = () => {
      setBottomH(headerRef.current.offsetHeight);
      setIsMobile(window.innerWidth < 768);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const getOnOpen = (portal) => {
    if (portal.popupType === "reels")     return () => setClientReelsOpen(true);
    if (portal.popupType === "screens")   return () => setScreensOpen(true);
    if (portal.popupType === "sculpture") return () => setSculptureOpen(true);
    if (portal.popupType === "projects")  return () => setProjectsOpen(true);
    if (portal.popupType === "concepts")  return () => setConceptsOpen(true);
    return null;
  };

  return (
    <section className="bg-graphite overflow-x-hidden">
      <div ref={headerRef} className="px-8 pt-20 pb-10 text-center">
        <span className="font-detail text-xs text-warm-gray uppercase tracking-[0.2em]">Discover</span>
        <h2 className="font-syne font-bold text-2xl md:text-4xl lg:text-5xl text-cream/60 tracking-tight mt-3">Portals</h2>
      </div>
      <div className="w-full h-px bg-white/10" />
      <div className="bg-matt-black px-8 py-[55px]">
        <div className={`flex justify-center ${isMobile ? "items-start gap-3" : "items-end gap-10 md:gap-20"}`}>
          {PORTALS.map(portal => (
            <MiniPortal
              key={portal.id}
              portal={portal}
              size={isMobile ? Math.round((portal.size ?? 166) * 0.53) : (portal.size ?? 166)}
              onOpen={getOnOpen(portal)}
              hoverLabel="View"
            />
          ))}
        </div>
      </div>
      <div className="w-full h-px bg-white/10" />
      <div style={{ height: bottomH || 160 }} />
      {clientReelsOpen && <ArtPopup images={CLIENT_IMAGES} startIndex={0} onClose={() => setClientReelsOpen(false)} />}
      {screensOpen   && <ScreensGalleryModal   onClose={() => setScreensOpen(false)} />}
      {sculptureOpen && <SculptureGalleryModal onClose={() => setSculptureOpen(false)} />}
      {projectsOpen  && <ProjectsGalleryModal  onClose={() => setProjectsOpen(false)} />}
      {conceptsOpen  && <ConceptsGalleryModal  onClose={() => setConceptsOpen(false)} />}
    </section>
  );
}

const CDN_SC = "https://cdn.myportfolio.com/b2648aa0-9d7e-45a7-9f99-54d55b4ec92e";

const COMMISSIONS_GALLERY = [
  { src: "/images/villa-leaf/villa-leaf-trio-pool.jpg" },
  { src: "/images/hero/hero-cottesloe-patio.jpg" },
  { src: "/images/marakesh/marakesh-cassie.jpg" },
  { src: "/images/hex/lalarook-2.jpg" },
  { src: "/images/hero/hero-homebase-dusk.jpg" },
  { src: "/images/hero/hero-cottesloe-gate.jpg" },
];

const CLIENT_REELS = [
  { src: "/videos/reels/banksia.mp4",    title: "BANKSIA",    detail: "", poster: "/images/reels/banksia-thumb.jpg", posterPos: "center 20%" },
  { src: "/videos/reels/branches.mp4",   title: "Branches",   detail: "", poster: "/images/reels/branches-thumb.jpg" },
  { src: "/videos/reels/rue.mp4",        title: "RUE",        detail: "", poster: "/images/reels/rue-thumb-v2.jpg",  posterPos: "center 50%" },
  { src: "/videos/reels/b-editions.mp4", title: "B Editions", detail: "", poster: "/images/reels/b-editions-thumb.jpg" },
];

const COMMISSIONS_PORTAL = {
  id: "commissions",
  label: "Commissions",
  sublabel: "Bespoke & Commercial",
  slides: [],
  videos: [
    { src: "/videos/natives-collage-2.mp4", title: "CUSTOM Natives — Collage", detail: "A commission in our native botanicals series — hand-composed and laser cut to order.", poster: "/images/concept-4-natives.jpg" },
    { src: "/videos/waroona.mp4",           title: "Waroona",                  detail: "", poster: "/images/reels/waroona-thumb.jpg" },
  ],
  commissionImages: COMMISSIONS_GALLERY,
  popupType: "commissions-gallery",
};

const SIDE_PORTAL_LEFT = {
  id: "side-left",
  label: "Screens",
  sublabel: "",
  slides: [
    { src: `/images/screens/orian-wall-decor.jpg`, pos: "5% 5%", scale: 1.5 },
    `/images/screens/strip/ferlie-close.jpg`,
    `/images/screens/strip/grail-close.jpg`,
    `/images/screens/wattle-close-tdl.jpg`,
    `/images/screens/viasi-close-up.jpg`,
    `/images/screens/elle-corten.jpg`,
    { src: `/images/bloom/bloom-closeup.jpg`, pos: "center top" },
  ],
};

const SIDE_PORTAL_RIGHT = {
  id: "side-right",
  label: "",
  sublabel: "",
  slides: [
    `${CDN_SC}/cffc33df-3d81-460f-b4aa-9f8adc9d81d8_rw_1200.jpg?h=b0a0ebd2ca83e06d7b56e5fbee049be2`,
    `${CDN_SC}/6745c491-3d3b-4501-b01c-76a351d2d9d1_rw_1920.jpeg?h=52cf56ba89edab095b94d025686dd55a`,
    `${CDN_SC}/79a0816f-0847-4bb5-aa06-a9077f7db746_rw_1200.jpg?h=1fcf914a6813bdea5a959d6dc3a50086`,
    `${CDN_SC}/7975db43-6e77-4a2d-8b33-6cdf7218ad48_rw_1920.jpg?h=263a833c03a447a8a37804176866e779`,
    "/images/hero/hero-marakesh-tall.jpg",
    `/images/homebase/homebase-motif-closeup.jpg`,
  ],
};

const SIDE_PORTAL_PROJECTS = {
  id: "side-projects",
  label: "Projects",
  sublabel: "",
  slides: [
    `/images/hero/hero-homebase-entrance.jpg`,
    `/images/hero/hero-homebase-dusk.jpg`,
    `${CDN_SC}/ce906d3c-248e-42c2-a76c-e7547bae20e7_rw_1200.jpg?h=96bf8823ab48bc3e90055aef0b93ea1f`,
    `${CDN_SC}/ff393903-5912-40da-9b37-aca22ef599b4_rw_1920.jpg?h=1ef862e9145edcf101d46bcd4a02fb15`,
    `${CDN_SC}/0bb31cda-116a-4ec4-8c20-5f25f900287c_rw_1200.jpg?h=bfcf87b6d12a3c5a71b0094e8fba92cd`,
  ],
};

const SIDE_PORTAL_CONCEPTS = {
  id: "side-concepts",
  label: "Concepts",
  sublabel: "",
  slides: [
    // Percent for Art
    `${CDN_SC}/a017e095-21a4-41a4-bdd7-630bb270b4f3_rw_1200.jpg?h=b4276b4f7952052c0cdbc1db1526c232`,
    `${CDN_SC}/713bf242-7075-4082-90cd-c885aa129107_rw_1920.jpg?h=a51d01c9d949978e58515742c345cd34`,
    // Outback Info Bays
    `${CDN_SC}/882272cb-30b0-4cef-8f0e-dee3241578e3_rw_1920.jpg?h=accf777e0802c55ffa064f37bb13befe`,
    // Shire of Peel
    `${CDN_SC}/8157a7f2-763b-469d-bca4-dee47707d7da_rw_1920.jpg?h=8c83e1b4dca7446ea02465c6438a82e9`,
    `${CDN_SC}/39f2b9a7-cf77-4a54-a88e-a92948a82ebe_rw_1920.jpg?h=9e5d420ad71060f91b222a0d11ac0a67`,
    // Home Base concepts
    "/images/homebase-concept-final.jpg",
    "/images/concepts-homebase-exterior.jpg",
    `${CDN_SC}/ba29da64-778e-4e6c-a942-02acff420a19_rw_1200.jpg?h=c81199c62bdc877ac5244d0b3b22f17f`,
    `${CDN_SC}/8aabcc1e-b8c3-45e3-aa3d-c56d5911ea03_rw_1920.jpg?h=142926ed21c731745b66587a99e4c8e0`,
    `${CDN_SC}/4fe97b52-7eca-4995-a9b0-e9caa6d72967_rw_1920.jpg?h=e8870627f871e657b986a401d62100fe`,
    `${CDN_SC}/3ef7ea8e-eec1-4856-b37a-f2d23978aca3_rw_1920.jpg?h=6ec1f7e1ff1f709ad73ac4e78cf30736`,
    `${CDN_SC}/66a80833-aa96-4e7a-a62e-6ce882831573_rw_1200.jpg?h=b3a5cf5b979eb22dc56bd82cc14f5946`,
    `${CDN_SC}/9422ac0b-5ce1-4cca-83fc-660e854c3bb0_rw_1200.jpg?h=3b92abcf4f65601c8e5cd9872c6e3121`,
    `${CDN_SC}/04ac8236-413f-4590-a522-dfca01a94fe8_rw_1200.jpg?h=37ffcbb1ecba586da34b3acca113e525`,
    // Centennial Park
    `${CDN_SC}/8b43f372-e1ca-4882-b630-bc0d985db4a7_rw_1200.jpg?h=c300bdda09947b73eb5e16f3aa004970`,
    `${CDN_SC}/437cf607-c821-4331-8874-d47ecda32ca3_rw_1920.jpg?h=c750d85f1ffad919b8eeefcb3ecfb597`,
    // Cottesloe Residence
    `${CDN_SC}/7c66f9e9-9682-4d93-8bb6-36aa19318e94_rw_1920.jpg?h=610337b8800e7a8f32bcb1e992b7da2e`,
    `${CDN_SC}/d8d96ede-c60e-4b48-991b-b80f157db3a5_rw_1920.jpg?h=3958d3517925745ac20a9c1ce75ff1c0`,
  ],
};

export function CommissionsSection() {
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const leftOuterRef = useRef(null);
  const rightOuterRef = useRef(null);
  const practiceLineRef = useRef(null);
  const practiceLineRightRef = useRef(null);
  const [sculptureOpen, setSculptureOpen] = useState(false);
  const [screensOpen, setScreensOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [conceptsOpen, setConceptsOpen] = useState(false);
  const [reelsOpen, setReelsOpen] = useState(false);

  const anyOpen = screensOpen || projectsOpen || conceptsOpen || reelsOpen;
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(anyOpen ? "gallery-modal-open" : "gallery-modal-close"));
  }, [anyOpen]);

  useEffect(() => {
    gsap.set([leftRef.current, rightRef.current, leftOuterRef.current, rightOuterRef.current], { x: 0, opacity: 0 });

    const ctx = gsap.context(() => {
      const mob = window.innerWidth < 768;
      const st = { trigger: sectionRef.current, start: "top 75%", end: "bottom 20%", toggleActions: "play reverse play reverse" };
      if (!mob) {
        gsap.fromTo(leftRef.current,      { x: 0, opacity: 0 }, { x: -300, opacity: 1, duration: 2.2, ease: "power2.out", scrollTrigger: st });
        gsap.fromTo(rightRef.current,     { x: 0, opacity: 0 }, { x:  300, opacity: 1, duration: 2.2, ease: "power2.out", scrollTrigger: st });
        gsap.fromTo(leftOuterRef.current, { x: 0, opacity: 0 }, { x: -580, opacity: 1, duration: 2.6, ease: "power2.out", scrollTrigger: st });
        gsap.fromTo(rightOuterRef.current,{ x: 0, opacity: 0 }, { x:  580, opacity: 1, duration: 2.6, ease: "power2.out", scrollTrigger: st });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Nav dropdown — open specific portal on event
  useEffect(() => {
    const handler = (e) => {
      const cat = e.detail;
      if (cat === "screens")   setScreensOpen(true);
      if (cat === "sculpture") setSculptureOpen(true);
      if (cat === "projects")  setProjectsOpen(true);
      if (cat === "concepts")  setConceptsOpen(true);
    };
    window.addEventListener("open-bespoke-category", handler);
    return () => window.removeEventListener("open-bespoke-category", handler);
  }, []);


  // UPDATING — depth surge, smooth drift, warm glow on illumination
  useEffect(() => {
    const words = [1,2,3,4,5,6].map(n => document.querySelector(`.updtg-w${n}`));
    if (!words[0]) return;

    words.forEach(w => w && gsap.set(w, { xPercent: -50, yPercent: -50, transformOrigin: "50% 50%" }));

    const BASE = [0.055, 0.042, 0.060, 0.038, 0.050, 0.045];
    words.forEach((w, i) => w && gsap.set(w, { opacity: BASE[i], scale: 0.5, filter: "drop-shadow(0 0 0px rgba(210,165,70,0))" }));

    // Depth — each word placed at a random point in its cycle immediately, no delays
    const DEPTH = [
      [0.18, 2.8, 42],
      [0.18, 2.1, 34],
      [0.18, 2.5, 29],
      [0.18, 1.8, 25],
      [0.18, 2.3, 38],
      [0.18, 1.6, 21],
    ];
    words.forEach((w, i) => {
      if (!w) return;
      const [min, max, dur] = DEPTH[i];
      const startScale = min + Math.random() * (max - min);
      gsap.set(w, { scale: startScale });
      const goToMax = startScale < (min + max) / 2;
      gsap.to(w, { scale: goToMax ? max : min, duration: dur * (goToMax ? (max - startScale) / (max - min) : (startScale - min) / (max - min)), ease: "sine.inOut", yoyo: true, repeat: -1 });
    });

    // Drift — continuous overlapping moves so there is never a stop
    const drift = (el, range, minDur, maxDur, initDelay) => {
      const go = () => {
        const x = (Math.random() - 0.5) * range;
        const y = (Math.random() - 0.5) * 40;
        const dur = minDur + Math.random() * (maxDur - minDur);
        gsap.to(el, { x, y, duration: dur, ease: "sine.inOut" });
        setTimeout(go, dur * 680);
      };
      setTimeout(go, initDelay);
    };
    drift(words[0], 900, 45, 70, 0);
    drift(words[1], 700, 36, 56, 0);
    drift(words[2], 600, 30, 48, 0);
    drift(words[3], 500, 26, 42, 0);
    drift(words[4], 750, 40, 62, 0);
    drift(words[5], 580, 28, 44, 0);

    // Random illumination — warm amber glow rises and fades on a random word
    const illuminate = () => {
      const pick = Math.floor(Math.random() * 6);
      const el = words[pick];
      if (!el) { setTimeout(illuminate, 3000 + Math.random() * 5000); return; }
      gsap.to(el, {
        opacity: 0.28 + Math.random() * 0.14,
        filter: `drop-shadow(0 0 ${18 + Math.random() * 14}px rgba(210,165,70,0.60))`,
        duration: 3.5 + Math.random() * 3.5,
        ease: "sine.inOut",
        overwrite: false,
        onComplete: () => {
          gsap.to(el, {
            opacity: BASE[pick],
            filter: "drop-shadow(0 0 0px rgba(210,165,70,0))",
            duration: 5 + Math.random() * 6,
            ease: "sine.inOut",
            onComplete: () => setTimeout(illuminate, 2500 + Math.random() * 7000),
          });
        },
      });
    };
    setTimeout(illuminate, 1500);

    // Warm light roams over letters on ALL words simultaneously
    const lights = [...document.querySelectorAll(".letter-light")];
    lights.forEach(l => {
      l.style.webkitBackgroundClip = "text";
      l.style.backgroundClip = "text";
      l.style.color = "transparent";
      l.style.webkitTextFillColor = "transparent";
    });
    const lts = [
      { x: 15, y: 50, size: 240, op: 0.60 },
      { x: 72, y: 50, size: 180, op: 0.48 },
    ];
    const updateLights = () => {
      const img = lts.map(l =>
        `radial-gradient(ellipse ${l.size}px ${Math.round(l.size * 0.5)}px at ${l.x}% ${l.y}%, rgba(235,200,130,${l.op}) 0%, transparent 65%)`
      ).join(", ");
      lights.forEach(l => { l.style.backgroundImage = img; });
    };
    updateLights();
    const roamLight = (l, ax) => {
      const linger = Math.random() < 0.25;
      const target = linger ? l[ax] + (Math.random() - 0.5) * 10 : 5 + Math.random() * 90;
      gsap.to(l, {
        [ax]: target,
        duration: linger ? 3 + Math.random() * 5 : 9 + Math.random() * 20,
        ease: "sine.inOut",
        onUpdate: updateLights,
        onComplete: () => roamLight(l, ax),
      });
    };
    lts.forEach((l, i) => setTimeout(() => { roamLight(l, "x"); roamLight(l, "y"); }, i * 900));

    return () => words.forEach(w => w && gsap.killTweensOf(w));
  }, []);

  // Practice text — split bright/dim animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set all text invisible to start
      gsap.set(".about-practice-label", { y: -10, opacity: 0 });
      gsap.set(".para1-bright", { x: 28, opacity: 0 });
      gsap.set(".para1-dim",    { x: -28, opacity: 0 });
      gsap.set(".para2-bright", { x: 28, opacity: 0 });
      gsap.set(".para2-dim",    { opacity: 0 });

      const resetAll = () => {
        gsap.killTweensOf(".about-practice-label, .para1-bright, .para1-dim-word, .para2-bright, .para2-dim");
        gsap.set(".about-practice-label", { y: -10, opacity: 0 });
        gsap.set(".para1-bright",   { x: 28, opacity: 0 });
        gsap.set(".para1-dim-word", { opacity: 0 });
        gsap.set(".para2-bright",   { x: 28, opacity: 0 });
        gsap.set(".para2-dim",      { opacity: 0 });
      };

      const playAll = () => {
        gsap.to(".about-practice-label", { y: 0, opacity: 1, duration: 1.8, ease: "power1.out" });
        // Para 1 bright phrases drift in from the side
        gsap.to(".para1-bright",   { x: 0, opacity: 1, duration: 3.2, stagger: 0.45, ease: "power1.out", delay: 0.4 });
        // Para 1 grey words fade in word by word after bright settled
        gsap.to(".para1-dim-word", { opacity: 1, duration: 1.6, stagger: 0.28, ease: "power1.out", delay: 3.2 });
        // Para 2 bright phrases — same behaviour as para 1
        gsap.to(".para2-bright",   { x: 0, opacity: 1, duration: 3.2, stagger: 0.45, ease: "power1.out", delay: 9.0 });
        // Para 2 grey text fades in after bright settled
        gsap.to(".para2-dim",      { opacity: 1, duration: 4.2, stagger: 0.65, ease: "power1.out", delay: 12.5 });
      };

      // Logo lines — open outward left and right
      gsap.set(practiceLineRef.current, { scaleX: 0 });
      gsap.set(practiceLineRightRef.current, { scaleX: 0 });
      ScrollTrigger.create({
        trigger: ".about-practice-label",
        start: "top 82%",
        onEnter: () => {
          gsap.to(practiceLineRef.current,      { scaleX: 1, duration: 1.1, ease: "power3.out" });
          gsap.to(practiceLineRightRef.current, { scaleX: 1, duration: 1.1, ease: "power3.out" });
          resetAll(); playAll();
        },
        onLeaveBack: () => {
          gsap.set(practiceLineRef.current,      { scaleX: 0 });
          gsap.set(practiceLineRightRef.current, { scaleX: 0 });
          resetAll();
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="bespoke" ref={sectionRef} className="bg-graphite overflow-x-hidden">
      <div className="px-8 pt-12 pb-24 text-center">
        <span className="font-detail text-xs text-warm-gray uppercase tracking-[0.2em]">Commissions</span>
        <h2 className="font-syne font-bold text-2xl md:text-4xl lg:text-5xl tracking-tight mt-3">
          <span className="bespoke-heading inline-block text-cream/60">Bespoke</span>
        </h2>
      </div>
      <div className="w-full h-px bg-white/10" />

      {/* Mobile vertical layout — hidden on md+ */}
      <div className="bg-matt-black py-14 flex flex-col items-center gap-10 md:hidden w-full">
        <div className="flex flex-col items-center gap-2">
          <MiniPortal portal={SIDE_PORTAL_RIGHT} size={160} hideLabel hoverLabel="Sculpture" onOpen={() => setSculptureOpen(true)} />
          <span className="font-heading font-bold text-xs text-cream/70">Sculpture</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <MiniPortal portal={SIDE_PORTAL_LEFT} size={200} hideLabel hoverLabel="Screens" noGlow onOpen={() => setScreensOpen(true)} />
          <span className="font-heading font-bold text-xs text-cream/70">Screens</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <MiniPortal portal={COMMISSIONS_PORTAL} size={160} hideLabel hoverLabel="Commissions" alwaysLabel onOpen={() => setReelsOpen(true)} />
          <span className="font-heading font-bold text-xs text-cream/70">Commissions</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <MiniPortal portal={SIDE_PORTAL_PROJECTS} size={160} hideLabel hoverLabel="Projects" onOpen={() => setProjectsOpen(true)} />
          <span className="font-heading font-bold text-xs text-cream/70">Projects</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <MiniPortal portal={SIDE_PORTAL_CONCEPTS} size={160} hideLabel hoverLabel="Concepts" onOpen={() => setConceptsOpen(true)} />
          <span className="font-heading font-bold text-xs text-cream/70">Concepts</span>
        </div>
      </div>

      {/* Desktop horizontal fan — hidden below md */}
      <div className="bg-matt-black px-8 relative overflow-visible hidden md:block" style={{ height: "185px" }}>
        {/* UPDATING — 6 words surging in/out of depth, some illuminate randomly */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {[1,2,3,4,5,6].map(n => (
            <span key={n} className={`updtg-w${n}`} style={{ position: "absolute", display: "inline-block", top: "50%", left: "50%", transformOrigin: "center center", opacity: 0 }}>
              <span style={{ position: "relative", display: "inline-block", fontFamily: "Impact,'Arial Narrow',sans-serif", fontSize: "130px", lineHeight: 1, letterSpacing: "0.10em", color: "rgb(242,240,233)", whiteSpace: "nowrap" }}>
                UPDATING
                <span aria-hidden="true" className="letter-light" style={{ position: "absolute", inset: 0, fontFamily: "Impact,'Arial Narrow',sans-serif", fontSize: "130px", lineHeight: 1, letterSpacing: "0.10em", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent", whiteSpace: "nowrap" }}>UPDATING</span>
              </span>
            </span>
          ))}
          {/* Ambient warm wash */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 100% at 50% 50%, rgba(210,175,120,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center overflow-visible">
          <div ref={leftOuterRef} className="absolute z-0" style={{ opacity: 0 }}>
            <MiniPortal portal={SIDE_PORTAL_PROJECTS} size={110} hideLabel hoverLabel="Projects" onOpen={() => setProjectsOpen(true)} />
          </div>
          <div ref={leftRef} className="absolute z-0" style={{ opacity: 0 }}>
            <MiniPortal portal={SIDE_PORTAL_RIGHT} size={130} hideLabel hoverLabel="Sculpture" onOpen={() => setSculptureOpen(true)} />
          </div>
          <div className="relative z-10">
            <MiniPortal portal={SIDE_PORTAL_LEFT} size={248} hideLabel hoverLabel="Screens" hoverLabelSize="16px" noGlow onOpen={() => setScreensOpen(true)} />
          </div>
          <div ref={rightRef} className="absolute z-0" style={{ opacity: 0 }}>
            <MiniPortal portal={COMMISSIONS_PORTAL} size={130} hideLabel hoverLabel="Commissions" onOpen={() => setReelsOpen(true)} />
          </div>
          <div ref={rightOuterRef} className="absolute z-0" style={{ opacity: 0 }}>
            <MiniPortal portal={SIDE_PORTAL_CONCEPTS} size={110} hideLabel hoverLabel="Concepts" onOpen={() => setConceptsOpen(true)} />
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-white/10" />

      {/* The Practice */}
      <div className="pt-32 pb-0 flex flex-col items-center">
        <div className="relative flex items-center justify-center overflow-visible" style={{ width: "80px", height: "80px" }}>
          <span ref={practiceLineRef} style={{
            position: "absolute", right: "calc(100% + 10px)", top: "50%", marginTop: "-0.75px",
            width: "90px", height: "1.5px",
            background: "rgba(242,240,233,0.35)",
            transformOrigin: "right center",
            transform: "scaleX(0)",
          }} />
          <span ref={practiceLineRightRef} style={{
            position: "absolute", left: "calc(100% + 10px)", top: "50%", marginTop: "-0.75px",
            width: "90px", height: "1.5px",
            background: "rgba(242,240,233,0.35)",
            transformOrigin: "left center",
            transform: "scaleX(0)",
          }} />
          <img src="/images/roj-logo.png" alt="ROGETjames" className="relative z-10 w-full h-auto"
            style={{ opacity: 0.5, filter: "drop-shadow(0px 5px 0px rgba(0,0,0,0.55))" }} />
        </div>
      </div>
      <div className="about-practice-label px-8 pt-4 pb-0 text-center">
        <span className="font-detail text-xs text-cream/90 uppercase tracking-[0.2em]">The Practice</span>
      </div>
      <div className="max-w-2xl mx-auto px-8 pt-8 pb-0 text-center">
        <p className="about-practice-para1 text-lg md:text-2xl font-heading font-bold leading-tight" style={{ wordSpacing: "0.22em" }}>
          {"Our work lives in two worlds — an evolving catalogue of".split(" ").map((word, i) => (
            <span key={`a${i}`} className="para1-dim-word inline-block text-cream/40">{word}&thinsp;</span>
          ))}
          {" "}<span className="para1-bright inline-block text-cream/90">signature designs</span>{" "}
          {"and fully bespoke commissions crafted".split(" ").map((word, i) => (
            <span key={`b${i}`} className="para1-dim-word inline-block text-cream/40">{word}&thinsp;</span>
          ))}
          {" "}<span className="para1-bright inline-block text-cream/90">for the spaces they will define.</span>
        </p>
        <div className="about-practice-para2 mt-8">
          <p className="text-cream/65 text-base leading-relaxed">
            <span className="para2-bright inline-block text-cream">Drawing from</span>
            <span className="para2-dim inline">{" "}</span>
            <span className="para2-bright inline-block text-cream">nature</span>
            <span className="para2-dim inline">{", "}the study and appreciation of{" "}</span>
            <span className="para2-bright inline-block text-cream">cultural forms and patterns</span>
            <span className="para2-dim inline">{", "}sculptural inspirations{" "}</span>
            <span className="para2-bright inline-block text-cream">and an active imagination.</span>
          </p>
        </div>
      </div>


      <div style={{ height: "220px" }} />
      {sculptureOpen && <SculptureGalleryModal onClose={() => setSculptureOpen(false)} />}
      {screensOpen   && <ScreensGalleryModal   onClose={() => setScreensOpen(false)} />}
      {projectsOpen  && <ProjectsGalleryModal  onClose={() => setProjectsOpen(false)} />}
      {conceptsOpen  && <ConceptsGalleryModal  onClose={() => setConceptsOpen(false)} />}
      {reelsOpen     && <CommissionsGalleryPopup videos={COMMISSIONS_PORTAL.videos} onClose={() => setReelsOpen(false)} />}
    </section>
  );
}
