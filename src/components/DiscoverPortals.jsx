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

const CDN_DP = "/images/cdn-gallery";

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
              <img src="/images/roj-logo.png?v=2" alt="ROGETjames" style={{ position: "relative", zIndex: 1, height: "62px", opacity: 0.45, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }} />
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
            <img src={p.src} alt="" role="presentation" className="w-full h-full object-cover" loading="lazy" />
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

export function MiniPortal({ portal, size = 166, hideLabel = false, onOpen = null, hoverLabel = "View", hoverLabelSize = "11px", alwaysLabel = false, arcLabel = null, noGlow = false, ringOnly = false, locked = false }) {
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
          {noGlow && glowing && (
            <>
              <span style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "1px solid rgba(242,240,233,0.30)", animation: "water-ripple-out 3s ease-out infinite", pointerEvents: "none", zIndex: 50 }} />
              <span style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "1px solid rgba(242,240,233,0.22)", animation: "water-ripple-out 3s ease-out 1s infinite", pointerEvents: "none", zIndex: 50 }} />
              <span style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "1px solid rgba(242,240,233,0.15)", animation: "water-ripple-out 3s ease-out 2s infinite", pointerEvents: "none", zIndex: 50 }} />
            </>
          )}
          <button
            onClick={() => { if (locked) return; onOpen ? onOpen() : canOpen && setPopOpen(true); }}
            onMouseEnter={() => setGlowing(true)}
            onMouseLeave={() => setGlowing(false)}
            className={`group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-black ${locked ? "cursor-not-allowed" : "cursor-pointer"}`}
            style={{
              borderRadius: "50%",
              padding: "9px",
              background: "linear-gradient(180deg, #6a6a6a 0%, #3a3a3a 28%, #1c1c1c 60%, #222222 100%)",
              boxShadow: (glowing && !noGlow)
                ? ringOnly
                  ? "inset 0 -4px 8px rgba(0,0,0,0.65), 0 6px 20px rgba(0,0,0,0.95), 0 0 0 4px #111, 0 0 0 6px rgba(255,255,255,0.55)"
                  : "inset 0 -4px 8px rgba(0,0,0,0.65), 0 6px 20px rgba(0,0,0,0.95), 0 0 0 4px #111, 0 0 0 6px rgba(255,255,255,0.28), 0 0 45px 12px rgba(255,255,255,0.12), 0 0 80px 24px rgba(255,255,255,0.05)"
                : "inset 0 -4px 8px rgba(0,0,0,0.65), 0 6px 20px rgba(0,0,0,0.95), 0 0 0 4px #111, 0 0 0 6px rgba(255,255,255,0.22)",
              transition: "box-shadow 0.6s ease",
            }}
            aria-label={locked ? `${portal.label} — under construction` : portal.label}
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
                  <img key={i} src={src} alt="" role="presentation" className="absolute inset-0 w-full h-full object-cover"
                    style={{ opacity: i === cur ? 1 : 0, transition: "opacity 1.4s ease", objectPosition: pos, transform: `scale(${scale})`, transformOrigin: pos }} loading="lazy" />
                );
              })}
              <div className="absolute inset-0 pointer-events-none z-10"
                style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 50%)" }} />
              {!hideLabel && (
                <div className="absolute bottom-0 left-0 right-0 z-[15] pointer-events-none flex flex-col items-center"
                  style={{ paddingBottom: "10%", paddingTop: "22%", background: "linear-gradient(to top, rgba(0,0,0,0.68) 0%, transparent 100%)" }}>
                  {portal.sublabel && <p className="font-detail text-cream/55 uppercase tracking-[0.18em]" style={{ fontSize: `${Math.max(6, size * 0.042)}px` }}>{portal.sublabel}</p>}
                  <p className="font-heading font-bold text-cream/90" style={{ fontSize: `${Math.max(8, size * 0.065)}px` }}>{portal.label}</p>
                  {locked && <p className="font-detail text-cream/50 uppercase tracking-[0.15em]" style={{ fontSize: `${Math.max(5.5, size * 0.038)}px`, marginTop: "2px" }}>Under Construction</p>}
                </div>
              )}
              <div className="absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-400 bg-black/60 opacity-0 group-hover:opacity-100"
                style={alwaysLabel ? { opacity: 1 } : {}}>
                <span className="font-detail font-bold text-cream uppercase tracking-[0.25em]" style={{ fontSize: hoverLabelSize }}>
                  {locked ? "Under Construction" : hoverLabel}
                </span>
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
        <h2 className="font-syne font-bold text-2xl md:text-4xl lg:text-5xl text-cream/60 tracking-tight mt-3" style={{ textShadow: "0 4px 14px rgba(0,0,0,0.55)" }}>Portals</h2>
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

