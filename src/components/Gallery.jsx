import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { X, ChevronLeft, ChevronRight, Pause, Play, Maximize2 } from "lucide-react";
import CatPageViewer from "./CatPageViewer";
import { CommissionsGalleryPopup, MiniPortal } from "./DiscoverPortals";
import { SculptureGalleryModal, ScreensGalleryModal } from "./BespokeCommissions";

gsap.registerPlugin(ScrollTrigger);

// ── Regional Pricing Gate ─────────────────────────────────────────────────
const PC_KEY = "roj_postcode";
const ADMIN_CODE = "1966";
const TEMP_SHOW_ALL_PRICES = false;
const loadPostcode = () => { try { const s = localStorage.getItem(PC_KEY); return s ? JSON.parse(s) : null; } catch { return null; } };
const savePostcode = (info) => localStorage.setItem(PC_KEY, JSON.stringify(info));
const checkWA = (pc) => { const n = parseInt(pc, 10); return n >= 6000 && n <= 6999; };
const trackEvent = (payload) => {
  fetch("/api/track-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
};
const getState = (pc) => {
  const n = parseInt(pc, 10);
  if (n >= 200 && n <= 299) return "ACT";
  if (n >= 800 && n <= 999) return "NT";
  if (n >= 1000 && n <= 1999) return "NSW";
  if (n >= 2000 && n <= 2599) return "NSW";
  if (n >= 2600 && n <= 2618) return "ACT";
  if (n >= 2900 && n <= 2920) return "ACT";
  if (n >= 2619 && n <= 2999) return "NSW";
  if (n >= 3000 && n <= 3999) return "VIC";
  if (n >= 8000 && n <= 8999) return "VIC";
  if (n >= 4000 && n <= 4999) return "QLD";
  if (n >= 9000 && n <= 9999) return "QLD";
  if (n >= 5000 && n <= 5999) return "SA";
  if (n >= 6000 && n <= 6999) return "WA";
  if (n >= 7000 && n <= 7999) return "TAS";
  return null;
};
const STATE_NAMES = {
  NSW: "New South Wales", VIC: "Victoria", QLD: "Queensland",
  SA: "South Australia", WA: "Western Australia", TAS: "Tasmania",
  NT: "Northern Territory", ACT: "Australian Capital Territory",
};
// ─────────────────────────────────────────────────────────────────────────

const REELS = [
  {
    id: "branches",
    title: "Branches",
    thumb: "/images/reels/branches-thumb.jpg",
    video: "/videos/reels/branches.mp4",
    detail: "A close-up reel of the Branches laser-cut design — birds perched on delicate steel branches.",
  },
  {
    id: "rue",
    title: "Rue",
    thumb: "/images/reels/rue-thumb.jpg",
    video: "/videos/reels/rue.mp4",
    detail: "Rue — a ROGETjames reel.",
  },
  {
    id: "banksia",
    title: "Banksia",
    thumb: "/images/reels/banksia-thumb.jpg",
    video: "/videos/reels/banksia.mp4",
    detail: "Banksia — a ROGETjames reel.",
  },
  {
    id: "b-editions",
    title: "B Editions",
    thumb: "/images/reels/b-editions-thumb.jpg",
    video: "/videos/reels/b-editions.mp4",
    detail: "B Editions — a curated collection reel.",
  },
  {
    id: "waroona",
    title: "Waroona",
    thumb: "/images/reels/waroona-thumb.jpg",
    video: "/videos/waroona.mp4",
    detail: "Waroona — a ROGETjames reel.",
    noPortal: true,
  },
];

const PORTAL_REELS = REELS.filter(r => !r.noPortal);

const SCULPTURE_PORTAL = {
  id: "gallery-sculpture",
  label: "Sculpture",
  sublabel: "",
  slides: [
    "/images/marakesh/marakesh-1.jpg",
    "/images/autumn-leaf/leaf-fire.jpg",
    "/images/sculptures/medina.jpg",
    "/images/halo/pavia-1.jpg",
    "/images/sculptures/bon-bon.jpg",
    "/images/villa-leaf/villa-leaf-trio-pool.jpg",
  ],
};

const SCREENS_PORTAL = {
  id: "gallery-screens",
  label: "Screens",
  sublabel: "",
  slides: [
    { src: "/images/screens/orian-wall-decor.jpg", pos: "5% 5%", scale: 1.5 },
    "/images/screens/strip/ferlie-close.jpg",
    "/images/screens/strip/grail-close.jpg",
    "/images/screens/wattle-close-tdl.jpg",
    "/images/screens/viasi-close-up.jpg",
    "/images/screens/elle-corten.jpg",
    { src: "/images/bloom/bloom-closeup.jpg", pos: "center top" },
  ],
};

function ReelsPortal({ onOpen }) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [glowing, setGlowing] = useState(false);
  const [curReel, setCurReel] = useState(0);
  const [editionsVisible, setEditionsVisible] = useState(false);
  const [introTriggered, setIntroTriggered] = useState(false);
  const portalRef = useRef(null);
  const videoRef = useRef(null);
  const transitioningRef = useRef(false);

  // Scroll trigger — show EDITIONS intro on first enter
  useEffect(() => {
    const el = portalRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !introTriggered) {
        setIntroTriggered(true);
        setEditionsVisible(true);
        setTimeout(() => setEditionsVisible(false), 3500);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [introTriggered]);

  // Imperatively play the video — autoPlay attribute can be silently ignored by browsers
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  }, [curReel]);

  // Between-reel transition: EDITIONS fades in, then next reel starts
  const handleVideoEnd = () => {
    if (transitioningRef.current) return;
    transitioningRef.current = true;
    setEditionsVisible(true);
    setTimeout(() => {
      setCurReel(i => (i + 1) % PORTAL_REELS.length);
      setTimeout(() => {
        setEditionsVisible(false);
        transitioningRef.current = false;
      }, 1000);
    }, 2500);
  };

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") { setGalleryOpen(false); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(galleryOpen ? "gallery-modal-open" : "gallery-modal-close"));
  }, [galleryOpen]);

  return (
    <>
      {/* Portal sphere */}
      <button
        ref={portalRef}
        onClick={() => onOpen ? onOpen() : setGalleryOpen(true)}
        onMouseEnter={() => setGlowing(true)}
        onMouseLeave={() => setGlowing(false)}
        className="group relative cursor-pointer"
        style={{
          borderRadius: "50%",
          padding: "9px",
          background: "linear-gradient(180deg, #6a6a6a 0%, #3a3a3a 28%, #1c1c1c 60%, #222222 100%)",
          boxShadow: glowing
            ? "inset 0 -5px 10px rgba(0,0,0,0.65), 0 8px 24px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.7), 0 0 0 5px #0a0a0a, 0 0 0 8px rgba(158,113,52,0.85), 0 0 40px 10px rgba(158,113,52,0.22)"
            : "inset 0 -5px 10px rgba(0,0,0,0.65), 0 8px 24px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.7), 0 0 0 5px #0a0a0a, 0 0 0 8px rgba(255,255,255,0.22)",
          transition: "box-shadow 0.6s ease",
        }}
        aria-label="Reels"
      >
        <div className="relative overflow-hidden w-64 h-64 md:w-72 md:h-72" style={{ borderRadius: "50%" }}>
          <video
            ref={videoRef}
            key={curReel}
            src={PORTAL_REELS[curReel].video}
            autoPlay muted playsInline preload="auto"
            onEnded={handleVideoEnd}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* EDITIONS overlay — intro + between-reel transition */}
          <div className="absolute inset-0 z-20 pointer-events-none" style={{
            opacity: editionsVisible ? 1 : 0,
            transition: "opacity 2s ease",
          }}>
            <img src="/images/reels/editions.jpg" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 pointer-events-none z-10" style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.18) 32%, transparent 55%)",
            boxShadow: "inset 0 14px 24px rgba(0,0,0,0.55)"
          }} />
          <div className="absolute inset-0 pointer-events-none z-10" style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 18%)"
          }} />
          {/* Hover overlay — darken + centre label */}
          <div className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-black/50 flex items-center justify-center">
            <span style={{ fontFamily: "'Jost','DM Sans',sans-serif", fontWeight: 400, fontSize: "12px", letterSpacing: "4px", color: "rgba(242,240,233,0.85)", textShadow: "0 0 8px rgba(0,0,0,0.9)", textTransform: "uppercase" }}>WALL ART</span>
          </div>
          {/* Arc label — always visible */}
          <svg viewBox="0 0 256 256" className="absolute inset-0 w-full h-full pointer-events-none z-20" aria-hidden="true">
            <defs>
              <path id="roj-reels-arc" d="M 36,61 A 112,112 0 0,1 220,61" />
              <filter id="roj-reels-shadow" x="-30%" y="-80%" width="160%" height="260%">
                <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="rgba(0,0,0,0.9)" floodOpacity="1" />
              </filter>
            </defs>
            <text fill="rgba(242,240,233,0.85)" fontSize="12" fontFamily="'Jost','DM Sans',sans-serif" fontWeight="400" letterSpacing="4" filter="url(#roj-reels-shadow)">
              <textPath href="#roj-reels-arc" startOffset="50%" textAnchor="middle">WALL ART</textPath>
            </text>
          </svg>
        </div>
      </button>

      {/* Reels gallery modal */}
      {galleryOpen && (
        <CommissionsGalleryPopup
          videos={REELS.map(r => ({ src: r.video, title: r.title, detail: r.detail, poster: r.thumb }))}
          onClose={() => setGalleryOpen(false)}
        />
      )}
    </>
  );
}

const CDN = import.meta.env.DEV ? "/images/cdn-gallery" : "/.netlify/images?url=%2Fimages%2Fcdn-gallery";

// Wall Art series — display order
const CDN_G = import.meta.env.DEV ? "/images/cdn-gallery" : "/.netlify/images?url=%2Fimages%2Fcdn-gallery";

const WALL_ART_SERIES = [
  // ── AUSTRALIAN NATIVES ───────────────────
  {
    id: "australian-natives",
    label: "AUSTRALIAN NATIVES",
    items: [
      { name: "BANKSIA Card",              img: "/images/banksia/banksia-card-1.jpg" },
      { name: "BANKSIA Oldmanis",          img: "/images/banksia/banksia-oldmanis-bronze.jpg", slides: ["/images/banksia/banksia-oldmanis-bronze.jpg", "/images/banksia/banksia-oldmanis-black.jpg", "/images/banksia/banksia-oldmanis-framed.jpg"] },
      { name: "WANDOO",                    img: "/images/australian-natives/wandoo-1.jpg" },
      { name: "BANKSIA Free Range",        img: "/images/banksia/banksia-main.jpg" },
      { name: "BANKSIA Rec Landscape",     img: "/images/banksia/banksia-rec-rust.jpg", slides: ["/images/banksia/banksia-rec-rust.jpg", "/images/banksia/banksia-rec-framed.jpg", "/images/banksia/banksia-rec-landscape.jpg"] },
      { name: "BANKSIA Rec Portrait",      img: "/images/banksia/banksia-framed-rust.jpg" },
      { name: "BANKSIA Free Range — Custom", img: "/images/banksia/banksia-free-2.jpg" },
      { name: "BANKSIA Round",             img: "/images/banksia/banksia-round.jpg", slides: ["/images/banksia/banksia-round.jpg", "/images/banksia/banksia-round-2.jpg", "/images/banksia/banksia-framed-circle.jpg"] },
      { name: "BANKSIA Deco",              img: "/images/banksia/banksia-deco-2.jpg", slides: ["/images/banksia/banksia-deco-2.jpg", "/images/banksia/banksia-deco.jpg"] },
      { name: "WATTLE",                    img: "/images/australian-natives/wattle-1.jpg" },
      { name: "BANKSIA Diamond",           img: "/images/placeholder.svg" },
      { name: "WANDOO DIAMOND",            img: "/images/placeholder.svg" },
      { name: "NATIVE COLLAGE",            img: "/images/placeholder.svg" },
    ],
  },
  // ── CREEPING FIG SERIES ──────────────────
  {
    id: "creeping-fig",
    label: "CREEPING FIGS",
    items: [
      { name: "AUTUMN",  img: "/images/creeping-fig/autumn-2.jpg", slides: ["/images/creeping-fig/autumn-2.jpg", "/images/creeping-fig/autumn-1.jpg", "/images/creeping-fig/autumn-3.jpg"], detailSlides: ["/images/creeping-fig/closeup-1.jpg", "/images/creeping-fig/closeup-2.jpg", "/images/creeping-fig/closeup-3.jpg", "/images/creeping-fig/closeup-4.jpg", "/images/creeping-fig/closeup-5.jpg", "/images/creeping-fig/closeup-6.jpg"], singleInAll: true },
      { name: "GRANDE",  img: "/images/creeping-fig/grande-1.jpg", slides: ["/images/creeping-fig/grande-1.jpg", "/images/creeping-fig/grande-2.jpg"] },
      { name: "SPRING",  img: "/images/creeping-fig/spring-1.jpg" },
      { name: "FIGARO",  img: "/images/creeping-fig/figaro-1.jpg" },
      { name: "ONTIO",   img: "/images/creeping-fig/ontio-1.jpg", slides: ["/images/creeping-fig/ontio-1.jpg", "/images/creeping-fig/ontio-2.jpg"] },
      { name: "NUVINE",    img: "/images/creeping-fig/nuvine-1.jpg" },
      { name: "BUTTERFLY", img: "/images/creeping-fig/butterfly-1.jpg" },
    ],
  },
  // ── BRANCHES SERIES ──────────────────────
  {
    id: "branches",
    label: "BRANCHES",
    items: [
      { name: "GREN Edge", img: "/images/branches/gren-edge-1.jpg", slides: ["/images/branches/gren-edge-1.jpg", "/images/branches/gren-edge-2.jpg", "/images/branches/gren-edge-3.jpg"] },
      { name: "GREN Tao",  img: "/images/branches/gren-tao-2.jpg", slides: ["/images/branches/gren-tao-2.jpg", "/images/branches/gren-tao-1.jpg"] },
      { name: "GREN Free", img: "/images/branches/gren-free-1.jpg" },
      { name: "GREN X",    img: "/images/branches/gren-x-1.jpg" },
    ],
  },
  // ── FLOWERS & BLOOMS ─────────────────────
  {
    id: "blooms",
    label: "FLOWERS & BLOOMS",
    items: [
      { name: "RUE",          img: "/images/flowers/rue-original.jpg", slides: ["/images/flowers/rue-original.jpg", "/images/flowers/rue-office.jpg"], focus: "center top" },
      { name: "RUE the 3rd", img: "/images/flowers/rue-the-3rd.jpg" },
      { name: "OLIN",         img: "/images/flowers/olin.jpg" },
      { name: "PETUNIA",      img: "/images/flowers/petunia.jpg" },
      { name: "DIAMOND BLOOM",img: `${CDN}/5f33d76a-d731-4265-904f-87e0f5a7eb22_rw_1200.jpg` },
      { name: "FUEILLES",     img: "/images/flowers/fuelles.jpg" },
      { name: "FERLICE",      img: "/images/flowers/ferlice.jpg" },
      { name: "PALM RAJA",    img: "/images/flowers/palm-raja.jpg" },
      { name: "DANDELIONS",   img: `${CDN}/03980b30-48fd-48a3-8027-741f35a87421_rw_1200.jpg` },
      { name: "BLOOM",        img: "/images/placeholder.svg" },
    ],
  },
  // ── PLUME COLLECTION ─────────────────────
  {
    id: "plume",
    label: "PLUMES",
    items: [
      { name: "PLUME DECO Black",    img: "/images/plume/plume-deco-black.jpg" },
      { name: "PLUME DECO",          img: "/images/plume/plume-deco-rust2.jpg" },
      { name: "PLUME DECO Pink",     img: "/images/plume/plume-deco-pink.jpg" },
      { name: "FEATHER",             img: "/images/plume/feather.jpg" },
      { name: "FEATHER — Toivottaa", img: "/images/plume/feather-wish.jpg" },
      { name: "FLOCK O FEATHERS",    img: "/images/plume/flock-o-feathers.jpg", subtitle: "Hyvää · Toivottaa · Sinulle" },
    ],
  },
  // ── JUNGLE COLLECTION ────────────────────
  {
    id: "jungle",
    label: "JUNGLE",
    items: [
      { name: "BAMBU",          img: "/images/jungle/bambu-insitu-1.jpg", slides: ["/images/jungle/bambu-insitu-1.jpg", "/images/jungle/bambu-insitu-2.jpg"] },
      { name: "UBUD Round",     img: "/images/jungle/ubud-round-1.jpg", slides: ["/images/jungle/ubud-round-1.jpg", "/images/jungle/ubud-round-2.jpg"] },
      { name: "UBUD Rectangle", img: "/images/jungle/ubud-rec.jpg" },
    ],
  },
  // ── B EDITIONS ───────────────────────────
  {
    id: "b-editions",
    label: "B EDITIONS",
    items: [
      { name: "HALSTON B", img: "/images/b-editions/halston-b.jpg", focus: "center 85%" },
      { name: "PAVIA B",   img: "/images/b-editions/pavia-b.jpg" },
      { name: "ZED B",     img: "/images/b-editions/zed-b.jpg" },
    ],
  },
  // ── THERUS ───────────────────────────────
  {
    id: "therus",
    label: "THERUS",
    items: [
      { name: "SEAWEED", img: "/images/therus/seaweed-1.jpg", slides: ["/images/therus/seaweed-1.jpg", "/images/therus/seaweed-2.jpg"] },
      { name: "ZON ZEE", img: "/images/neazar/zon-zee-1.jpg", slides: ["/images/neazar/zon-zee-1.jpg", "/images/neazar/zon-zee-2.jpg", "/images/zon-zee-rust2.jpg"] },
      { name: "NEA",     img: "/images/neazar/nea-2.jpg", slides: ["/images/neazar/nea-2.jpg", "/images/neazar/nea-1.jpg"] },
      { name: "ASLYIAM CLASSIC",       img: "/images/placeholder.svg" },
      { name: "THE SUM OF EVERYTHING", img: "/images/placeholder.svg" },
    ],
  },
  // ── IKONA ────────────────────────────────
  {
    id: "ikona",
    label: "IKONA",
    items: [
      { name: "VASUKI",   img: "/images/vasuki/vasuki-sabi.jpg", slides: ["/images/vasuki/vasuki-sabi.jpg", "/images/ikona/vasuka.jpg"] },
      { name: "MAHOLA",   img: "/images/ikona/mahola-1.jpg", slides: ["/images/ikona/mahola-1.jpg", "/images/ikona/mahola-2.jpg"], focus: "center top" },
      { name: "GEO LEAF", img: "/images/ikona/geo-leaf-1.jpg", focus: "center top" },
    ],
  },
  // ── PENDANT SERIES ───────────────────────
  {
    id: "pendant",
    label: "PENDANTS",
    items: [
      { name: "LIBERATUM", img: "/images/pendant/liberatum-1.jpg" },
      { name: "METROPOLIS", img: "/images/neazar/metropolis-1.jpg" },
      { name: "BENIN", img: "/images/pendant/benin-horizontal.jpg", slides: ["/images/pendant/benin-horizontal.jpg", "/images/pendant/benin-vertical.jpg"], focus: "30% top" },
      { name: "SANUR",     img: "/images/pendant/sanur-1.jpg", focus: "center top" },
      { name: "SALAMANKA",  img: "/images/neazar/salamanka-1.jpg" },
    ],
  },
  // ── OBLIATIONES SERIES ───────────────────
  {
    id: "obliationes",
    label: "OBLIATIONES",
    items: [
      { name: "OBLIATIONES",         img: "/images/obliationes/obliationes-1.jpg" },
      { name: "OBLIATIONES — Large", img: "/images/obliationes/obliationes-2.jpg" },
      { name: "OBLIATIONES TIBETAN — Patha", img: "/images/obliationes/obliationes-tibetan-patha.jpg" },
      { name: "OKO", img: "/images/obliationes/oko-1.jpg", slides: ["/images/obliationes/oko-1.jpg", "/images/obliationes/oko-2.jpg", "/images/obliationes/oko-3.jpg"] },
    ],
  },
  // ── THE BIRDS ────────────────────────────
  {
    id: "birds",
    label: "BIRDS",
    items: [
      { name: "BIRDY NUM NUM",              img: "/images/birds/birdy-num-num-1.jpg" },
      { name: "SWALLOWS",                   img: "/images/birds/swallows-install-1.jpg", slides: ["/images/birds/swallows-install-1.jpg", "/images/birds/swallows-free2fly-1.jpg"] },
      { name: "WREN",                       img: "/images/birds/wren-1.jpg" },
      { name: "BIRDY NUM NUM (Free range)", img: "/images/placeholder.svg" },
      { name: "SAVANAH",                    img: "/images/placeholder.svg" },
    ],
  },
  // ── RETRO ────────────────────────────────
  {
    id: "retro",
    label: "RETRO",
    items: [
      { name: "JEAGER",       img: "/images/retro/jeager-insitu.jpg", slides: ["/images/retro/jeager-insitu.jpg", "/images/retro/jeager-2.jpg"] },
      { name: "HALSTON Tall", img: "/images/retro/halston-tall-1.jpg" },
      { name: "ZED O",        img: "/images/retro/zed-o-1.jpg" },
      { name: "ZED",          img: "/images/retro/zed-rec-1.jpg", focus: "right center" },
      { name: "HALSTON",      img: "/images/placeholder.svg" },
      { name: "ORIGINS",      img: "/images/placeholder.svg" },
    ],
  },
  // ── VITAE SERIES ─────────────────────────
  {
    id: "vitae",
    label: "VITAE",
    items: [
      { name: "VITAE — GREN",   img: "/images/vitae/vitae-gren-1.jpg",   slides: ["/images/vitae/vitae-gren-1.jpg", "/images/vitae/vitae-gren-2.jpg"] },
      { name: "VITAE — SHIOGI", img: "/images/vitae/vitae-shiogi-1.jpg", focus: "center top" },
    ],
  },
  // ── NEAZAR ───────────────────────────────
  {
    id: "neazar",
    label: "NEAZAR",
    items: [
      { name: "TRIBE", img: "/images/placeholder.svg" },
      { name: "RAVI",  img: "/images/placeholder.svg" },
      { name: "RYE",   img: "/images/placeholder.svg" },
    ],
  },
  // ── CLIENT IMAGES ─────────────────────────
  {
    id: "client-images",
    label: "CLIENT IMAGES",
    items: [
      { name: "LIBRATUM",   img: "/images/libratum-1.jpg" },
      { name: "METROPOLIS",     img: "/images/metropolis-client-1.jpg" },
      { name: "BENIN Inspired",  img: "/images/benin-inspired-1.jpg" },
      { name: "OMARE — Marion", img: "/images/omare-marion-front.jpg" },
    ],
  },
];

// Other categories (flat grid — more to be structured later)
const OTHER_CATEGORIES = [
  {
    id: "sculpture",
    label: "Sculpture",
    description: "",
    items: [
      { name: "MARAKESH",   cat: "classics", img: "/images/marakesh/marakesh-promo.jpg", slides: ["/images/marakesh/marakesh-promo.jpg", "/images/marakesh/marakesh-1.jpg", "/images/marakesh/marakesh-cassie.jpg"], materials: ["corten"] },
      { name: "PAVIA",      cat: "classics", img: "/images/halo/pavia-1.jpg" },
      { name: "MOWHITI",    cat: "classics", img: "/images/sculptures/mowhiti.jpg" },
      { name: "OMARE",      cat: "classics", img: "/images/sculptures/omare.jpg", materials: ["corten"] },
      { name: "BON BON",    cat: "bonbons",  img: "/images/sculptures/bon-bon.jpg" },
      { name: "MEDINA",     cat: "bonbons",  img: "/images/sculptures/medina.jpg" },
      { name: "AUTUMN LEAF",cat: "leafs",    img: "/images/autumn-leaf/leaf-bali-1.jpg", slides: ["/images/autumn-leaf/leaf-bali-1.jpg", "/images/autumn-leaf/leaf-fire.jpg", "/images/autumn-leaf/leaf-bali-2.jpg", "/images/autumn-leaf/leafs-wg-copper.jpg", "/images/autumn-leaf/leafs-wg-a.jpg", "/images/autumn-leaf/leafs-wg-black.jpg"] },
      { name: "VILLA LEAF", cat: "leafs",    img: "/images/villa-leaf/villa-leaf-trio-pool.jpg", slides: ["/images/villa-leaf/villa-leaf-trio-pool.jpg", "/images/villa-leaf/villa-leaf-black.jpg", `${CDN}/362f312d-4a16-4ba4-ab9d-8d199041a8cb_rw_1200.jpg`] },
    ],
  },
];

const ALL_TABS = [
  { id: "wall-art", label: "Wall Art" },
  ...OTHER_CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
];

// Size tiers shown in the detail popup — edit these to match actual offerings
const SIZE_TIERS = [
  { id: "s", label: "Small",  dims: "600 × 400 mm" },
  { id: "m", label: "Medium", dims: "900 × 600 mm" },
  { id: "l", label: "Large",  dims: "1200 × 800 mm" },
];

const MATERIAL_OPTIONS = [
  { id: "aluminium", label: "Aluminium Powder Coated" },
  { id: "corten",    label: "Natural Corten Steel" },
];

// Per-piece size tiers — sourced from ROGETjames 2024 catalogue
const PIECE_SIZES = {
  // ── Flowers & Blooms ──────────────────────
  "RUE": [
    { id: "s", label: "Small",  dims: "Ø 900 mm",  fixings: "4–6", price: 780,   pricePC: 1190 },
    { id: "m", label: "Medium", dims: "Ø 1100 mm", fixings: "4–6", price: 910,   pricePC: 1320 },
    { id: "l", label: "Large",  dims: "Ø 1500 mm", fixings: "4–6", price: 1240,  pricePC: 1610 },
  ],
  "RUE the 3rd": [
    { id: "s", label: "Small",  dims: "Ø 900 mm",  fixings: "4–6", price: 780,   pricePC: 1190 },
    { id: "m", label: "Medium", dims: "Ø 1100 mm", fixings: "4–6", price: 910,   pricePC: 1320 },
    { id: "l", label: "Large",  dims: "Ø 1500 mm", fixings: "4–6", price: 1240,  pricePC: 1610 },
  ],
  "BLOOM": [
    { id: "l", label: "Standard", dims: "Ø 1800 mm", fixings: 4 },
  ],
  "OLIN": [
    { id: "l", label: "Standard", dims: "Ø 1100 mm", fixings: 4 },
  ],
  "PETUNIA": [
    { id: "s", label: "Small", dims: "1100 mm", fixings: 0 },
    { id: "l", label: "Large", dims: "1700 mm", fixings: 0 },
  ],
  "DIAMOND BLOOM": [
    { id: "m", label: "Medium", dims: "1410 × 1597 mm", fixings: 4, price: 1145, pricePC: 1450, priceCorten: 1145, priceCortenPC: 1250 },
    { id: "l", label: "Large",  dims: "1814 × 2055 mm", fixings: 4, price: 1650, pricePC: 2150, priceCorten: 1650, priceCortenPC: 1650 },
  ],
  "FUEILLES": [
    { id: "s", label: "Small", dims: "Ø 1100 mm", fixings: 4, price: 850,  pricePC: 1400, priceCorten: 850,  priceCortenPC: 1100 },
    { id: "l", label: "Large", dims: "Ø 1490 mm", fixings: 4, price: 1350, pricePC: 1750, priceCorten: 1350, priceCortenPC: 1350 },
  ],
  "FERLICE": [
    { id: "s", label: "Standard", dims: "Ø 1000 mm", fixings: 4, price: 780, pricePC: 780 },
  ],
  "PALM RAJA": [
    { id: "s", label: "Small", dims: "1280 × 1190 mm", fixings: 6 },
    { id: "l", label: "Large", dims: "1600 × 1490 mm", fixings: 6 },
  ],
  "DANDELIONS": [
    { id: "s", label: "Square",   dims: "1200 × 1200 mm", price: 1630, pricePC: 1630 },
    { id: "l", label: "Portrait", dims: "1200 × 2400 mm", price: 2180, pricePC: 2180 },
  ],
  // ── Plume Collection ──────────────────────
  "PLUME DECO": [
    { id: "s", label: "Small",  dims: "1800 × 638 mm",  fixings: 4, price: 895,  priceCorten: 895,  pricePC: 1600, priceCortenPC: 1200 },
    { id: "m", label: "Medium", dims: "2100 × 745 mm",  fixings: 4, price: 1030, priceCorten: 1030, pricePC: 1800, priceCortenPC: 1300 },
    { id: "l", label: "Large",  dims: "2400 × 851 mm",  fixings: 4, price: 1270, priceCorten: 1270, pricePC: 2200, priceCortenPC: 1400 },
  ],
  "FLOCK O FEATHERS": [
    { id: "s", label: "Small",  dims: "1800 mm", fixings: 3, price: 910,  pricePC: 1050 },
    { id: "m", label: "Medium", dims: "2100 mm", fixings: 3, price: 990,  pricePC: 1300 },
    { id: "l", label: "Large",  dims: "2400 mm", fixings: 3, price: 1090, pricePC: 1550 },
  ],
  "FEATHER — Toivottaa": [
    { id: "s", label: "Small",  dims: "1800 mm", fixings: 3, price: 910,  pricePC: 1050 },
    { id: "m", label: "Medium", dims: "2100 mm", fixings: 3, price: 990,  pricePC: 1300 },
    { id: "l", label: "Large",  dims: "2400 mm", fixings: 3, price: 1090, pricePC: 1550 },
  ],
  // ── Jungle Collection ─────────────────────
  "BAMBU": [
    { id: "s", label: "Small",  dims: "750 × 1800 mm",  fixings: 8,  price: 990,  pricePC: 990,  priceCorten: 690,  priceCortenPC: 690  },
    { id: "m", label: "Medium", dims: "950 × 2390 mm",  fixings: 10, price: 1285, pricePC: 1285, priceCorten: 970,  priceCortenPC: 970  },
    { id: "l", label: "Large",  dims: "1190 × 2990 mm", fixings: 10, price: 1615, pricePC: 1615, priceCorten: 1175, priceCortenPC: 1175 },
  ],
  "UBUD Round": [
    { id: "s", label: "Small", dims: "Ø 1195 mm", fixings: 4 },
    { id: "l", label: "Large", dims: "Ø 3495 mm", fixings: 4 },
  ],
  "UBUD Rectangle": [
    { id: "s", label: "Small", dims: "2195 × 850 mm",  fixings: 6 },
    { id: "l", label: "Large", dims: "2995 × 1060 mm", fixings: 6 },
  ],
  // ── IKONA ─────────────────────────────────
  "MAHOLA": [
    { id: "xs", label: "XS",     dims: "463 × 1490 mm", fixings: 4 },
    { id: "s",  label: "Small",  dims: "563 × 1800 mm", fixings: 4 },
    { id: "m",  label: "Medium", dims: "660 × 2100 mm", fixings: 4 },
    { id: "l",  label: "Large",  dims: "775 × 2390 mm", fixings: 4 },
  ],
  "VASUKI": [
    { id: "s",  label: "S",  dims: "1190 × 1683 mm" },
    { id: "m",  label: "M",  dims: "1490 × 2107 mm" },
    { id: "l",  label: "L",  dims: "2120 × 2990 mm (2 parts)" },
    { id: "xl", label: "XL", dims: "2990 × 4230 mm (5 parts)" },
  ],
  "GEO LEAF": [
    { id: "xs", label: "XS",     dims: "528 × 1490 mm", fixings: 4 },
    { id: "s",  label: "Small",  dims: "637 × 1800 mm", fixings: 4 },
    { id: "m",  label: "Medium", dims: "784 × 2100 mm", fixings: 4 },
    { id: "l",  label: "Large",  dims: "846 × 2390 mm", fixings: 4 },
  ],
  // ── Obliationes Series ────────────────────
  "OBLIATIONES": [
    { id: "xs", label: "Mini",   dims: "Ø 550 mm",   fixings: 4 },
    { id: "s",  label: "Small",  dims: "Ø 820 mm",   fixings: 4 },
    { id: "m",  label: "Medium", dims: "Ø 1190 mm",  fixings: 4 },
    { id: "l",  label: "Large",  dims: "Ø 1490 mm",  fixings: 4 },
  ],
  "OBLIATIONES — Large": [
    { id: "s", label: "Small",  dims: "Ø 820 mm",  fixings: 4 },
    { id: "m", label: "Medium", dims: "Ø 1190 mm", fixings: 4 },
    { id: "l", label: "Large",  dims: "Ø 1490 mm", fixings: 4 },
  ],
  "OBLIATIONES TIBETAN — Patha": [
    { id: "l", label: "Standard", dims: "Ø 1450 mm", fixings: 4 },
  ],
  "OKO": [
    { id: "s", label: "Small", dims: "1490 × 2060 mm", fixings: 4 },
    { id: "l", label: "Large", dims: "1990 × 1646 mm", fixings: 4 },
  ],
  // ── Branches Series ───────────────────────
  "GREN Edge": [
    { id: "s", label: "Small",  dims: "1418 × 950 mm",  fixings: 8, price: 1420, pricePC: 1820 },
    { id: "m", label: "Medium", dims: "1780 × 1190 mm", fixings: 8, price: 1640, pricePC: 2430 },
    { id: "l", label: "Large",  dims: "2248 × 1490 mm", fixings: 9, price: 1980, pricePC: 2830 },
  ],
  "GREN Tao": [
    { id: "s", label: "Small",  dims: "1490 × 950 mm",  fixings: 9, price: 1420, pricePC: 1820 },
    { id: "m", label: "Medium", dims: "1800 × 1146 mm", fixings: 9, price: 1640, pricePC: 2430 },
    { id: "l", label: "Large",  dims: "2340 × 1490 mm", fixings: 9, price: 1980, pricePC: 2830 },
  ],
  "GREN Free": [
    { id: "s", label: "Small",  dims: "1660 × 950 mm",  fixings: 8, price: 1420, pricePC: 1820 },
    { id: "m", label: "Medium", dims: "2079 × 1190 mm", fixings: 9, price: 1640, pricePC: 2430 },
    { id: "l", label: "Large",  dims: "2390 × 1368 mm", fixings: 9, price: 1980, pricePC: 2830 },
  ],
  "GREN X": [
    { id: "s", label: "Small", dims: "1810 × 1190 mm", fixings: 10, price: 1420, pricePC: 1820 },
    { id: "l", label: "Large", dims: "2267 × 1490 mm", fixings: 11, price: 1980, pricePC: 2830 },
  ],
  // ── Australian Natives ────────────────────
  "WANDOO": [
    { id: "s", label: "Small", dims: "1100 × 1260 mm", fixings: 4, price: 850,  pricePC: 1300, priceCorten: 850,  priceCortenPC: 1050 },
    { id: "l", label: "Large", dims: "1495 × 1713 mm", fixings: 4, price: 1390, pricePC: 1700, priceCorten: 1390, priceCortenPC: 1350 },
  ],
  "WANDOO DIAMOND": [
    { id: "s", label: "Small", dims: "1089 × 977 mm",  fixings: 4 },
    { id: "l", label: "Large", dims: "1508 × 1353 mm", fixings: 4 },
  ],
  "WATTLE": [
    { id: "s", label: "Small", dims: "Ø 1200 mm", fixings: 4, price: 850,  pricePC: 1350, priceCorten: 850,  priceCortenPC: 1100 },
    { id: "l", label: "Large", dims: "Ø 1490 mm", fixings: 4, price: 1300, pricePC: 1700, priceCorten: 1300, priceCortenPC: 1450 },
  ],
  "NATIVE COLLAGE": [
    { id: "s", label: "Small", dims: "1200 × 592 mm" },
    { id: "l", label: "Large", dims: "2390 × 1180 mm" },
  ],
  // ── Banksia Collection ────────────────────
  "BANKSIA Card": [
    { id: "s", label: "Small", dims: "900 × 1800 mm",  fixings: 6, price: 1200, priceCorten: 1200, pricePC: 1500, priceCortenPC: 1400 },
    { id: "l", label: "Large", dims: "1184 × 2386 mm", fixings: 6, price: 1930, priceCorten: 1930, pricePC: 2230, priceCortenPC: 2130 },
  ],
  "BANKSIA Free Range": [
    { id: "s", label: "Small", dims: "890 mm",  fixings: 4 },
    { id: "l", label: "Large", dims: "1490 mm", fixings: 4 },
  ],
  "BANKSIA Free Range 2": [
    { id: "l", label: "Standard", dims: "2225 × 1466 mm", fixings: 12 },
  ],
  "BANKSIA Free Range — Custom": [
    { id: "l", label: "Custom", dims: "Custom sizes available", fixings: 0 },
  ],
  "BANKSIA Round": [
    { id: "s", label: "Small", dims: "1100 × 1200 mm", fixings: 4, price: 1200, priceCorten: 1200, pricePC: 1350, priceCortenPC: 1200 },
    { id: "l", label: "Large", dims: "1495 × 1631 mm", fixings: 4, price: 1750, priceCorten: 1750, pricePC: 1850, priceCortenPC: 1750 },
  ],
  "BANKSIA Rec Portrait": [
    { id: "s", label: "Small", dims: "1100 × 1200 mm",  fixings: 4, price: 1200, pricePC: 1200 },
    { id: "l", label: "Large", dims: "1495 × 1631 mm",  fixings: 4, price: 1750, pricePC: 1750 },
  ],
  "BANKSIA Rec Landscape": [
    { id: "s", label: "Small", dims: "1100 × 1200 mm",  fixings: 4, price: 1200, pricePC: 1200 },
    { id: "l", label: "Large", dims: "1495 × 1631 mm",  fixings: 4, price: 1750, pricePC: 1750 },
  ],
  "BANKSIA Oldmanis": [
    { id: "s", label: "Medium", dims: "1190 × 1911 mm", fixings: 6, price: 2650, pricePC: 2650, priceCorten: 1900, priceCortenPC: 1900 },
    { id: "l", label: "Large",  dims: "1488 × 2390 mm", fixings: 6, price: 3150, pricePC: 3150, priceCorten: 2200, priceCortenPC: 2200 },
  ],
  "BANKSIA Deco": [
    { id: "s", label: "Small", dims: "1142 × 1495 mm", fixings: 4, price: 1630, pricePC: 1630 },
    { id: "l", label: "Large", dims: "1956 × 1495 mm", fixings: 4, price: 2295, pricePC: 2295 },
  ],
  "BANKSIA Diamond": [
    { id: "s", label: "Small",  dims: "1200 × 1200 mm", fixings: 4 },
    { id: "m", label: "Medium", dims: "1590 × 1590 mm", fixings: 4 },
    { id: "l", label: "Large",  dims: "1990 × 1990 mm", fixings: 4 },
  ],
  "BANKSIA Free Range 4": [
    { id: "s", label: "Small", dims: "2780 × 1190 mm", fixings: 10 },
    { id: "l", label: "Large", dims: "2854 × 1490 mm", fixings: 10 },
  ],
  "BANKSIA Free Range 5": [
    { id: "s", label: "Small",  dims: "1378 × 882 mm",  fixings: 7 },
    { id: "m", label: "Medium", dims: "1490 × 1190 mm", fixings: 7 },
    { id: "l", label: "Large",  dims: "1866 × 1490 mm", fixings: 7 },
  ],
  // ── Neazar ────────────────────────────────
  "SALAMANKA": [
    { id: "s", label: "Small", dims: "700 × 1200 mm",  fixings: 2 },
    { id: "l", label: "Large", dims: "2020 × 1093 mm", fixings: 2 },
  ],
  "TRIBE": [
    { id: "l", label: "Standard", dims: "Ø 1100 mm", fixings: 4 },
  ],
  "RAVI": [
    { id: "l", label: "Standard", dims: "Ø 1200 mm" },
  ],
  "RYE": [
    { id: "l", label: "Standard", dims: "Ø 800 mm", fixings: 4 },
  ],
  "ZON ZEE": [
    { id: "s", label: "Small", dims: "1490 × 1578 mm", fixings: 4, price: 2000, pricePC: 2000, priceCorten: 1450, priceCortenPC: 1450 },
    { id: "l", label: "Large", dims: "2212 × 2327 mm", fixings: 4, price: 2650, pricePC: 2650, priceCorten: 1900, priceCortenPC: 1900 },
  ],
  "NEA": [
    { id: "s", label: "Small", dims: "820 × 1880 mm",  fixings: 6 },
    { id: "l", label: "Large", dims: "1185 × 1700 mm", fixings: 6, price: 1630, pricePC: 2020 },
  ],
  "METROPOLIS": [
    { id: "s", label: "Small", dims: "1800 × 990 mm",  fixings: 6 },
    { id: "l", label: "Large", dims: "2100 × 1155 mm", fixings: 6 },
  ],
  // ── Pendant Series ────────────────────────
  "BENIN": [
    { id: "s", label: "Small",  dims: "276 × 1800 mm", fixings: 4 },
    { id: "m", label: "Medium", dims: "362 × 2390 mm", fixings: 4 },
    { id: "l", label: "Large",  dims: "460 × 2990 mm", fixings: 4 },
  ],
  "LIBERATUM": [
    { id: "s", label: "Small",  dims: "276 × 1800 mm", fixings: 4 },
    { id: "m", label: "Medium", dims: "362 × 2390 mm", fixings: 4 },
    { id: "l", label: "Large",  dims: "460 × 2990 mm", fixings: 4 },
  ],
  "SANUR": [
    { id: "s", label: "Small",  dims: "276 × 1800 mm" },
    { id: "m", label: "Medium", dims: "362 × 2390 mm" },
    { id: "l", label: "Large",  dims: "460 × 2990 mm" },
  ],
  // ── The Birds ─────────────────────────────
  "BIRDY NUM NUM": [
    { id: "s", label: "Small", dims: "1077 × 1190 mm", fixings: 4 },
    { id: "l", label: "Large", dims: "1490 × 1664 mm", fixings: 4 },
  ],
  "WREN": [
    { id: "l", label: "Custom", dims: "Custom sizes", fixings: 4 },
  ],
  "BIRDY NUM NUM (Free range)": [
    { id: "l", label: "Standard", dims: "812 × 1490 mm", fixings: 4 },
  ],
  "SAVANAH": [
    { id: "s", label: "Small",  dims: "1200 × 523 mm",  fixings: "4–6" },
    { id: "m", label: "Medium", dims: "1800 × 785 mm",  fixings: "4–6" },
    { id: "l", label: "Large",  dims: "2400 × 1045 mm", fixings: "4–6" },
  ],
  // ── Centis ────────────────────────────────
  "URCHIN": [
    { id: "l", label: "Standard", dims: "Ø 1800 mm", fixings: 4 },
  ],
  "VIASI O": [
    { id: "s", label: "Small", dims: "Ø 1490 mm", fixings: 4 },
    { id: "l", label: "Large", dims: "Ø 1800 mm", fixings: 4 },
  ],
  "ASLYIAM O": [
    { id: "xs", label: "Small",  dims: "Ø 1100 mm", fixings: 4, pricePC: 1250, priceCortenPC: 750 },
    { id: "s",  label: "Medium", dims: "Ø 1490 mm", fixings: 4, pricePC: 1450, priceCortenPC: 950 },
    { id: "l",  label: "Large",  dims: "Ø 1800 mm", fixings: 4 },
  ],
  "CENTENNIAL": [
    { id: "l", label: "Standard", dims: "Ø 1100 mm", fixings: 4 },
  ],
  "LUMIER": [
    { id: "l", label: "Standard", dims: "Ø 1200 mm", fixings: 4 },
  ],
  // ── Therus ────────────────────────────────
  "ASLYIAM CLASSIC": [
    { id: "s", label: "Small", dims: "1495 × 1142 mm", fixings: 6 },
    { id: "l", label: "Large", dims: "1956 × 1495 mm", fixings: 6 },
  ],
  "THE SUM OF EVERYTHING": [
    { id: "l", label: "Standard", dims: "1200 × 1200 mm", fixings: 4 },
  ],
  "SEAWEED": [
    { id: "l", label: "Standard", dims: "1860 × 995 mm" },
  ],
  // ── Retro ─────────────────────────────────
  "HALSTON B": [
    { id: "l", label: "Standard", dims: "990 × 2380 mm", fixings: 6 },
  ],
  "ZED B": [
    { id: "l", label: "Standard", dims: "Ø 1627 mm", fixings: 4 },
  ],
  "PAVIA B": [
    { id: "l", label: "Standard", dims: "TBC" },
  ],
  "HALSTON Tall": [
    { id: "s", label: "Small", dims: "979 × 1878 mm",  fixings: 6, price: 1750, pricePC: 1750, priceCorten: 1500, priceCortenPC: 1500 },
    { id: "l", label: "Large", dims: "1190 × 2381 mm", fixings: 6, price: 2400, pricePC: 2400, priceCorten: 2050, priceCortenPC: 2050 },
  ],
  "HALSTON": [
    { id: "l", label: "Standard", dims: "Ø 1100 mm / 1100 × 1100 mm", fixings: 4 },
  ],
  "ZED O": [
    { id: "l", label: "Standard", dims: "Ø 1627 mm", fixings: 4 },
  ],
  "ZED O SCREEN": [
    { id: "l", label: "Standard", dims: "990 × 2358 mm", fixings: 6 },
  ],
  "ORIGINS": [
    { id: "l", label: "Standard", dims: "Ø 1800 mm", fixings: 4 },
  ],
  // ── Creeping Fig Series ────────────────────
  "AUTUMN": [
    { id: "s", label: "Small",  dims: "1800 × 1000 mm", price: 1150, priceCorten: 1150 },
    { id: "m", label: "Medium", dims: "2315 × 1195 mm", price: 1870, priceCorten: 1870 },
    { id: "l", label: "Large",  dims: "2870 × 1490 mm", price: 2350, pricePC: 2550, priceCorten: 2350, priceCortenPC: 1900 },
  ],
  "FIGARO": [
    { id: "s", label: "Small", dims: "2395 × 1330 mm", price: 1870, pricePC: 1870 },
    { id: "l", label: "Large", dims: "2685 × 1490 mm", price: 2200, pricePC: 2200 },
  ],
  "GRANDE": [
    { id: "l", label: "Standard", dims: "4150 × 1465 mm", price: 3200, pricePC: 3150, priceCortenPC: 2400 },
  ],
  "SPRING": [
    { id: "l", label: "Standard", dims: "900 × 2400 mm" },
  ],
  "ONTIO": [
    { id: "s", label: "Small", dims: "800 × 1000 mm" },
    { id: "l", label: "Large", dims: "1420 × 1733 mm" },
  ],
  "NUVINE": [
    { id: "s", label: "Small", dims: "479 × 2390 mm",  fixings: 4, pricePC: 1250, priceCortenPC: 600 },
    { id: "l", label: "Large", dims: "600 × 2990 mm",  fixings: 4, pricePC: 1500, priceCortenPC: 800 },
  ],
  "BUTTERFLY": [
    { id: "l", label: "Standard", dims: "4371 × 1377 mm", price: 3900, pricePC: 3900 },
  ],
  // ── Screens ───────────────────────────────
  "JEAGER": [
    { id: "l", label: "Standard", dims: "2395 × 540 mm", priceCorten: 1100, priceCortenPC: 1100, price: 1150, pricePC: 1150 },
  ],
  // ── Sculpture — The Classics ───────────────
  "MARAKESH": [
    { id: "s",  label: "1500mm", dims: "H 1500 mm", price: 3000, priceCorten: 3000, pricePC: 3245, priceCortenPC: 3245 },
    { id: "m",  label: "1800mm", dims: "H 1800 mm", price: 3500, priceCorten: 3500, pricePC: 3795, priceCortenPC: 3795 },
    { id: "l",  label: "2100mm", dims: "H 2100 mm", price: 4150, priceCorten: 4150, pricePC: 4345, priceCortenPC: 4345 },
  ],
  "OMARE": [
    { id: "s",  label: "1500mm", dims: "H 1500 mm" },
    { id: "m",  label: "1800mm", dims: "H 1800 mm" },
    { id: "l",  label: "2100mm", dims: "H 2100 mm" },
    { id: "xl", label: "2400mm", dims: "H 2400 mm" },
  ],
  // ── Sculpture — Bon Bons ───────────────────
  "BON BON": [
    { id: "x", label: "BON BON X", dims: "H 1800 mm" },
    { id: "e", label: "BON BON E", dims: "H 3000 mm" },
  ],
  // ── Sculpture — Leaf Sculptures ───────────
  "AUTUMN LEAF": [
    { id: "m",  label: "1500mm", dims: "680 × 1500 mm", price: 1495, priceCorten: 1495, pricePC: 1695, priceCortenPC: 1695 },
    { id: "l",  label: "1800mm", dims: "785 × 1800 mm", price: 1795, priceCorten: 1795, pricePC: 1995, priceCortenPC: 1995 },
    { id: "xl", label: "2100mm", dims: "915 × 2100 mm", price: 2100, priceCorten: 2100, pricePC: 2300, priceCortenPC: 2300 },
    { id: "2x", label: "2400mm", dims: "935 × 2400 mm", price: 2350, priceCorten: 2350, pricePC: 2550, priceCortenPC: 2550 },
  ],
  "VILLA LEAF": [
    { id: "m",  label: "1500mm", dims: "428 × 1500 mm", price: 1150, priceCorten: 1150, pricePC: 1350, priceCortenPC: 1350 },
    { id: "l",  label: "1800mm", dims: "512 × 1800 mm", price: 1270, priceCorten: 1270, pricePC: 1470, priceCortenPC: 1470 },
    { id: "xl", label: "2100mm", dims: "598 × 2100 mm", price: 1390, priceCorten: 1390, pricePC: 1590, priceCortenPC: 1590 },
    { id: "2x", label: "2400mm", dims: "684 × 2400 mm", price: 1630, priceCorten: 1630, pricePC: 1830, priceCortenPC: 1830 },
  ],
};

// Dimensions lookup — edit these values to match actual piece measurements
const DIMENSIONS = {
  // Branches Series
  "GREN Edge":          "1200 × 900 mm",
  "GREN Tao":           "1200 × 900 mm",
  "WANDOO":             "900 × 600 mm",
  "KYRA LEAF":          "800 × 600 mm",
  "AUTUMN LEAF":        "1000 × 700 mm",
  "VILLA LEAF":         "1500 × 900 mm",
  // Banksia Collection
  "BANKSIA Free Range":     "900 × 900 mm",
  "BANKSIA Rec Landscape":  "1200 × 800 mm",
  "BANKSIA Rec Portrait":   "800 × 1200 mm",
  "BANKSIA Frame":      "1200 × 900 mm",
  "RUE the 3rd":        "800 × 800 mm",
  "UBUD Round":         "Ø 800 mm",
  "DANDELIONS":         "1200 × 600 mm",
  "DIAMOND BLOOM":      "1410 × 1597 mm",
  // Creeping Fig Series
  "Creeping Fig I":     "1800 × 1200 mm",
  "Creeping Fig II":    "1800 × 1200 mm",
  "Creeping Fig III":   "1800 × 1200 mm",
  "Creeping Fig IV":    "1800 × 1200 mm",
  "Creeping Fig V":     "1800 × 1200 mm",
  // Plume Collection
  "PLUME DECO":         "1000 × 1200 mm",
  "FEATHER":            "600 × 1200 mm",
  "BIRDY NUM NUM":      "800 × 600 mm",
  "FERLICI":            "900 × 900 mm",
  "BAMBU":              "1200 × 400 mm",
  // Screens & Gates
  "ERGO":               "2400 × 1200 mm",
  "GRAIL":              "2800 × 1600 mm",
  "FERLIE":             "2000 × 1000 mm",
  "LUCARIO":            "1800 × 900 mm",
  "LUMIER":             "2200 × 1100 mm",
  "XAVIER":             "2400 × 1800 mm",
  // Geometric Series
  "VUELTA":             "1200 × 900 mm",
  "ASLYIAM":            "1800 × 1200 mm",
  "WATTLE":             "600 × 600 mm",
  "VAYA":               "1200 × 800 mm",
  // Cultural Patterns
  "BENIN Inspired":     "1500 × 1200 mm",
  "RAVI Inspired":      "1800 × 1200 mm",
  "MARAKESH TRIO":      "3 × 600 × 900 mm",
  "Unity in Diversity": "2400 × 1200 mm",
  // Fire & Light
  "REEDS of UNGARO":    "1800 × 600 mm",
  "EQUISETTI":          "1800 × 600 mm",
  "URCHIN":             "Ø 600 mm",
  "HOMEBASE Fire Pit":  "1200 × 600 mm",
  "YAZAD Fire":         "1200 × 800 mm",
  "TOTEMS":             "H 2400 mm",
  // Sculpture
  "ORIAN Totem":        "H 1800 mm",
  "DANDELIONS Totems":  "H 2200 mm",
  "HOMEBASE":           "2400 × 1200 mm",
  "HUE":                "1800 × 1200 mm",
  "Centennial Park":    "Site-specific",
  "Fiona Stanley":      "Site-specific",
};

// Build a lookup: design name → all unique image URLs across every series/category
const NAME_TO_IMAGES = (() => {
  const map = {};
  const add = (name, img) => {
    if (!map[name]) map[name] = [];
    if (!map[name].includes(img)) map[name].push(img);
  };
  const addItem = (i) => {
    if (i.slides) i.slides.forEach(src => add(i.name, src));
    else add(i.name, i.img);
  };
  WALL_ART_SERIES.forEach((s) => s.items.forEach(addItem));
  OTHER_CATEGORIES.forEach((c) => c.items.forEach(addItem));
  return map;
})();

function SlidingThumb({ slides, alt, active, focus }) {
  const [cur, setCur] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (slides.length <= 1 || !active) return;
    timerRef.current = setInterval(() => {
      setCur(prev => (prev + 1) % slides.length);
    }, 3000);
    return () => { clearInterval(timerRef.current); timerRef.current = null; };
  }, [active, slides.length]);

  return (
    <div className="w-full h-full relative">
      {slides.map((src, i) => (
        <img key={src} src={src} alt={alt} loading="lazy" decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: i === cur ? 1 : 0, transition: 'opacity 0.8s ease', objectPosition: focus || 'center center' }}
        />
      ))}
    </div>
  );
}

function PostcodeModal({ onSubmit, onDismiss }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 120); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const pc = value.trim();
    if (!/^\d{4}$/.test(pc)) { setError("Please enter a valid 4-digit Australian postcode"); return; }
    onSubmit({ postcode: pc, isWA: checkWA(pc), state: getState(pc), isAdmin: pc === ADMIN_CODE });
  };

  return (
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
      style={{ background: "rgba(6,6,6,0.75)", backdropFilter: "blur(14px)" }}
      onClick={onDismiss}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl p-8"
        style={{ background: "rgba(18,18,18,0.98)", border: "1px solid rgba(242,240,233,0.10)" }}
        onClick={e => e.stopPropagation()}
      >
        <p className="font-detail text-[10px] text-cream/60 uppercase tracking-[0.22em] mb-3">Catalogue Pricing</p>
        <h3 className="font-heading font-bold text-cream text-lg mb-2 leading-tight">Where are you located?</h3>
        <p className="font-body text-cream/70 text-sm mb-6 leading-relaxed">Enter your postcode to view pricing available in your area.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={value}
            onChange={e => { setValue(e.target.value.replace(/\D/g, "")); setError(""); }}
            placeholder="e.g. 3000"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-cream font-detail text-sm placeholder:text-cream/25 focus:outline-none focus:border-clay/60 transition-colors"
          />
          {error && <p className="text-clay/80 text-xs font-detail">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-clay text-cream font-heading font-semibold text-sm tracking-wide hover:bg-clay-dark transition-colors duration-200"
          >
            View Pricing →
          </button>
          <button type="button" onClick={onDismiss} className="w-full py-2 text-cream/30 font-detail text-xs hover:text-cream/50 transition-colors">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

function PricingPopup({ item, postcodeInfo, onClose, onCloseAll }) {
  const sizeTiers = PIECE_SIZES[item.priceKey || item.name] || SIZE_TIERS;
  const [selectedSize, setSelectedSize] = useState(() => sizeTiers[0]?.id ?? null);
  const availableMats = item.materials
    ? MATERIAL_OPTIONS.filter(m => item.materials.includes(m.id))
    : MATERIAL_OPTIONS;
  const [selectedMaterial, setSelectedMaterial] = useState(() => availableMats[0]?.id ?? "aluminium");
  const [added, setAdded] = useState(false);

  const isAdmin = postcodeInfo?.isAdmin === true;
  const isWAUser = postcodeInfo?.isWA === true && !isAdmin;

  const tier = sizeTiers.find(t => t.id === selectedSize);
  const price = selectedMaterial === "aluminium" ? (tier?.pricePC ?? tier?.price) : tier?.price;
  const showPOA = isWAUser && !price;
  const showPrice = TEMP_SHOW_ALL_PRICES || !showPOA;
  const matLabel = MATERIAL_OPTIONS.find(m => m.id === selectedMaterial)?.label;
  const canAdd = selectedSize && selectedMaterial && !added;

  const handleAdd = useCallback(() => {
    window.dispatchEvent(new CustomEvent("quote-add", { detail: {
      id: `${item.name}-${Date.now()}`,
      name: item.name,
      series: item._series || "",
      size: tier,
      material: MATERIAL_OPTIONS.find(m => m.id === selectedMaterial),
      img: item.img,
    }}));
    setAdded(true);
    setTimeout(() => { onClose(); onCloseAll?.(); }, 950);
  }, [item, tier, selectedMaterial, onClose, onCloseAll]);

  return (
    <div
      className="fixed inset-0 z-[9996] flex items-center justify-center p-4"
      style={{ background: "rgba(6,6,6,0.65)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden"
        style={{ background: "rgba(18,18,18,0.98)", border: "1px solid rgba(242,240,233,0.10)" }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center text-cream/50 hover:text-cream hover:bg-black/80 transition-colors">
          <X size={13} />
        </button>

        <div className="px-6 py-6 space-y-5">
          <div>
            {item._series && <p className="font-detail text-[10px] text-cream/60 uppercase tracking-[0.2em] mb-0.5">{item._series}</p>}
            <h3 className="font-heading font-bold text-cream text-lg leading-tight" style={{ wordSpacing: "-0.05em" }}>{item.name}</h3>
            {postcodeInfo?.state && (
              <p className="font-detail text-[9px] text-clay/70 uppercase tracking-[0.15em] mt-1">
                {STATE_NAMES[postcodeInfo.state] ?? postcodeInfo.state}
              </p>
            )}
          </div>

          <div>
            <p className="font-detail text-[10px] text-cream/80 uppercase tracking-[0.18em] mb-2">Material</p>
            <div className="flex gap-2">
              {availableMats.map(mat => (
                <button key={mat.id} onClick={() => setSelectedMaterial(mat.id)}
                  className={`flex-1 py-2.5 px-3 rounded-xl border text-center transition-all duration-150 bg-transparent ${selectedMaterial === mat.id ? "border-[#9e7134] text-[#9e7134]" : "border-white/15 text-cream/75 hover:border-white/35 hover:text-cream"}`}>
                  <p className="font-detail text-[11px] leading-snug">{mat.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-detail text-[10px] text-cream/80 uppercase tracking-[0.18em] mb-2">Dimensions</p>
            <div className="flex gap-2 flex-wrap">
              {sizeTiers.map(t => (
                <button key={t.id} onClick={() => setSelectedSize(t.id)}
                  className={`flex-1 min-w-[4rem] py-2.5 rounded-xl border text-center transition-all duration-150 bg-transparent ${selectedSize === t.id ? "border-[#9e7134] text-[#9e7134]" : "border-white/15 text-cream/75 hover:border-white/35 hover:text-cream"}`}>
                  {t.label !== "Standard" && <p className={`font-detail text-[9px] uppercase tracking-wider mb-0.5 ${selectedSize === t.id ? "text-[#9e7134]/90" : "text-cream/70"}`}>{t.label}</p>}
                  <p className="font-detail text-[11px] font-medium leading-tight">{t.dims}</p>
                  {t.fixings != null && t.fixings !== 0 && <p className={`font-detail text-[9px] mt-0.5 ${selectedSize === t.id ? "text-[#9e7134]/70" : "text-cream/60"}`}>{t.fixings} fixings</p>}
                </button>
              ))}
            </div>
          </div>

          {showPrice && selectedSize && selectedMaterial && (
            <div className="rounded-xl border border-white/15 px-4 py-3 flex items-stretch gap-4">
              <div className="flex-1 space-y-0.5">
                <p className="font-detail text-[10px] text-cream/70 uppercase tracking-[0.2em]">Your Selection</p>
                <p className="font-detail text-[11px] text-cream/90">{matLabel}</p>
                {tier && <p className="font-detail text-[11px] text-cream/90">{tier.dims}</p>}
                <p className="font-heading font-bold text-clay text-xl pt-1">
                  {price ? `A$${price.toLocaleString()}` : "POA"}
                </p>
                {!price && <p className="font-detail text-[10px] text-cream/70">Contact us for pricing</p>}
              </div>
              <div className="w-px bg-clay/70 self-stretch" />
              <div className="flex items-center justify-end w-28 shrink-0">
                <p className="font-detail text-[9px] text-cream/75 text-right leading-relaxed">Fixings &amp; freight to be determined</p>
              </div>
            </div>
          )}

          {showPOA && (
            <div className="rounded-xl border border-white/10 px-4 py-3 text-center space-y-1">
              <p className="font-detail text-[10px] text-warm-gray uppercase tracking-[0.2em]">Pricing</p>
              <p className="font-heading font-bold text-cream text-base">Price on Application</p>
              <a href="#contact" onClick={() => { onClose(); onCloseAll?.(); }}
                className="block mt-2 text-clay/80 font-detail text-xs hover:text-clay transition-colors underline underline-offset-2">
                Contact us for a quote →
              </a>
            </div>
          )}

          {showPrice && (
            <button onClick={canAdd ? handleAdd : undefined}
              className={`w-full py-3 rounded-xl font-heading font-semibold text-sm tracking-wide transition-all duration-300 ${added ? "bg-moss text-cream cursor-default" : canAdd ? "bg-clay text-cream hover:bg-clay-dark" : "bg-white/5 text-cream/25 cursor-not-allowed"}`}>
              {added ? "Added to Quote ✓" : "Add to Quote →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailCard({ item, seriesLabel, onClose, postcodeInfo, onSetPostcode }) {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [showPostcodeModal, setShowPostcodeModal] = useState(false);
  const [showPricingPopup, setShowPricingPopup] = useState(false);

  // Pricing gate logic
  const pcKnown = postcodeInfo !== null;

  const slides = NAME_TO_IMAGES[item.name] || [item.img];

  // Auto-advance slideshow every 2 seconds when there are multiple images
  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      if (!imgRef.current) return;
      gsap.to(imgRef.current, {
        opacity: 0, duration: 1.2, ease: "power2.inOut",
        onComplete: () => {
          setSlideIndex((i) => (i + 1) % slides.length);
          gsap.to(imgRef.current, { opacity: 1, duration: 1.2, ease: "power2.inOut" });
        },
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.1, ease: "power2.out" });
    gsap.fromTo(cardRef.current, { y: 14, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.15, ease: "power3.out" });
  }, []);

  const handleClose = useCallback(() => {
    gsap.to(cardRef.current, { y: 14, opacity: 0, scale: 0.95, duration: 0.2, ease: "power2.in" });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25, ease: "power2.in", delay: 0.05, onComplete: onClose });
  }, [onClose]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  const handleSeePricing = () => {
    if (!pcKnown) setShowPostcodeModal(true);
    else setShowPricingPopup(true);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9995] flex items-center justify-center p-4"
      style={{ background: "rgba(10,10,10,0.82)", backdropFilter: "blur(18px)" }}
      onClick={handleClose}
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-[400px] rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "rgba(20,20,20,0.97)", border: "1px solid rgba(242,240,233,0.09)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center text-cream/50 hover:text-cream hover:bg-black/80 transition-colors"
        >
          <X size={13} />
        </button>

        {/* Slideshow — cycles through all images of this design */}
        <div className="aspect-[4/3] overflow-hidden relative bg-charcoal flex items-center justify-center">
          <img
            ref={imgRef}
            src={slides[slideIndex]}
            alt={item.name}
            className="w-full h-full object-contain"
          />
          {slides.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={`block w-1 h-1 rounded-full transition-all duration-300 ${i === slideIndex ? "bg-cream w-3" : "bg-cream/30"}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-5 py-5 space-y-3 text-center">
          <div>
            {seriesLabel && (
              <p className="font-detail text-[10px] text-cream/60 uppercase tracking-[0.2em] mb-0.5">{seriesLabel}</p>
            )}
            <h3 className="font-heading font-bold text-cream text-lg leading-tight" style={{ wordSpacing: "-0.05em" }}>{item.name}</h3>
          </div>

          {/* Sizes — always visible */}
          {PIECE_SIZES[item.priceKey || item.name] && (
            <div className="flex flex-col gap-1 border-t border-white/8 pt-3 items-center">
              {PIECE_SIZES[item.priceKey || item.name].map((t) => (
                <div key={t.id} className="flex items-baseline gap-2 justify-center">
                  {t.label !== "Standard" && (
                    <span className="font-detail text-[10px] text-clay/80 uppercase tracking-wider">{t.label}</span>
                  )}
                  <span className="font-detail text-[11px] text-cream/90">{t.dims}</span>
                  {t.fixings != null && t.fixings !== 0 && (
                    <span className="font-detail text-[10px] text-cream/50">· {t.fixings} fixings</span>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleSeePricing}
            className="mt-1 px-5 py-1.5 rounded-full bg-black/60 border border-white/20 text-cream/90 font-detail text-[10px] uppercase tracking-[0.2em] hover:bg-clay hover:border-clay hover:text-cream transition-all duration-200"
          >
            Pricing
          </button>
        </div>
      </div>

      {showPostcodeModal && (
        <PostcodeModal
          onSubmit={(info) => { onSetPostcode(info); setShowPostcodeModal(false); setShowPricingPopup(true); }}
          onDismiss={() => setShowPostcodeModal(false)}
        />
      )}

      {showPricingPopup && (
        <PricingPopup
          item={{ ...item, _series: seriesLabel }}
          postcodeInfo={postcodeInfo}
          onClose={() => setShowPricingPopup(false)}
          onCloseAll={handleClose}
        />
      )}
    </div>
  );
}

function Lightbox({ items, index, onClose, onPrev, onNext, postcodeInfo, onSetPostcode, onDetail }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const imgRef = useRef(null);
  const lenis = useLenis();
  const [slideIdx, setSlideIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showPostcodeModal, setShowPostcodeModal] = useState(false);
  const [showPricingPopup, setShowPricingPopup] = useState(false);
  const [imgExpanded, setImgExpanded] = useState(false);

  const item = items[index];
  const slides = item.slides || [item.img];

  // Pricing gate
  const pcKnown = postcodeInfo !== null;

  // Reset slide index when item changes
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setSlideIdx(0); setShowPricingPopup(false); setImgExpanded(false); }, [index]);

  useEffect(() => {
    lenis?.stop();
    const ctx = gsap.context(() => {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
      gsap.fromTo(contentRef.current, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" });
    });
    return () => { ctx.revert(); lenis?.start(); };
  }, [lenis]);

  const prevIndex = useRef(index);
  useEffect(() => {
    if (prevIndex.current !== index && contentRef.current) {
      gsap.fromTo(contentRef.current, { scale: 0.96, opacity: 0.3 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
    }
    prevIndex.current = index;
  }, [index]);

  const handleClose = useCallback(() => {
    setPlaying(false);
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(contentRef.current, { scale: 0.92, opacity: 0, duration: 0.3, ease: "power2.in" });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: "power2.in" }, "-=0.15");
  }, [onClose]);

  const crossfadeTo = useCallback((fn) => {
    if (!imgRef.current) { fn(); return; }
    gsap.to(imgRef.current, {
      opacity: 0, duration: 0.35, ease: "power2.inOut",
      onComplete: () => { fn(); gsap.to(imgRef.current, { opacity: 1, duration: 0.35, ease: "power2.inOut" }); },
    });
  }, []);

  const handleLeft = useCallback(() => {
    if (slideIdx > 0) crossfadeTo(() => setSlideIdx(i => i - 1));
    else crossfadeTo(() => { setSlideIdx(0); onPrev(); });
  }, [slideIdx, crossfadeTo, onPrev]);

  const handleRight = useCallback(() => {
    if (slideIdx < slides.length - 1) crossfadeTo(() => setSlideIdx(i => i + 1));
    else crossfadeTo(() => { setSlideIdx(0); onNext(); });
  }, [slideIdx, slides.length, crossfadeTo, onNext]);

  // Slideshow auto-advance
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => handleRight(), 3500);
    return () => clearTimeout(id);
  }, [playing, handleRight, slideIdx, index]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handleLeft();
      if (e.key === "ArrowRight") handleRight();
      if (e.key === " ") { e.preventDefault(); setPlaying(p => !p); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleClose, handleLeft, handleRight]);

  return (
    <div ref={overlayRef} className="lightbox-overlay" onClick={handleClose}>
      {/* Left arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); handleLeft(); }}
        className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 active:bg-white/30 transition-colors z-20"
        style={{ touchAction: "manipulation" }}
        aria-label="Previous"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Image + info */}
      <div ref={contentRef} className="flex flex-col items-center justify-center px-14 md:px-20 w-full max-w-5xl gap-3" style={{ height: "calc(100vh - 96px)", marginTop: "72px" }} onClick={(e) => e.stopPropagation()}>
        <div className="w-full flex items-center justify-center relative flex-none group/img">
          <img ref={imgRef} src={slides[slideIdx]} alt={item.name} className="max-w-full object-contain rounded-2xl" style={{ maxHeight: "68vh" }} />
          <button
            onClick={(e) => { e.stopPropagation(); setImgExpanded(true); }}
            className="absolute bottom-3 right-3 p-1.5 rounded-full bg-black/55 text-cream/60 hover:bg-black/80 hover:text-cream transition-all duration-200 opacity-0 group-hover/img:opacity-100"
            aria-label="Expand image"
          >
            <Maximize2 size={13} />
          </button>
        </div>
        <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-0 pb-4 w-full max-w-lg">
          <div className="flex items-center gap-3">
            <p className="text-cream font-heading font-semibold text-base tracking-wide" style={{ wordSpacing: "-0.07em" }}>{item.name}</p>
            {item._series && <span className="font-detail text-[11px] text-cream/80 uppercase tracking-wider">· {item._series}</span>}
          </div>
          {/* Sizes strip */}
          {PIECE_SIZES[item.priceKey || item.name] && (
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 justify-center">
              {PIECE_SIZES[item.priceKey || item.name].map((t) => (
                <span key={t.id} className="font-detail text-[11px] text-cream/65">
                  {t.label !== "Standard" ? `${t.label} · ${t.dims}` : t.dims}
                  {t.fixings != null && t.fixings !== 0 && ` · ${t.fixings} fixings`}
                </span>
              ))}
            </div>
          )}
          <div className="mt-2 flex gap-2 items-center">
            {onDetail && (
              <button
                onClick={(e) => { e.stopPropagation(); onDetail({ ...item }); }}
                className="px-5 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-cream/90 font-detail text-[10px] uppercase tracking-[0.2em] hover:bg-white/15 hover:border-white/40 hover:text-cream transition-all duration-200 whitespace-nowrap"
              >
                details
              </button>
            )}
            <button
              onClick={() => {
                if (!pcKnown) setShowPostcodeModal(true);
                else setShowPricingPopup(true);
              }}
              className="px-5 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-cream/90 font-detail text-[10px] uppercase tracking-[0.2em] hover:bg-clay hover:border-clay hover:text-cream transition-all duration-200 whitespace-nowrap"
            >
              Pricing
            </button>
          </div>
          {slides.length > 1 && (
            <div className="flex gap-2 mt-0.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { if (i !== slideIdx) crossfadeTo(() => setSlideIdx(i)); }}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === slideIdx ? "bg-cream" : "bg-cream/40"}`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); handleRight(); }}
        className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 active:bg-white/30 transition-colors z-20"
        style={{ touchAction: "manipulation" }}
        aria-label="Next"
      >
        <ChevronRight size={24} />
      </button>

      {/* Top bar */}
      <div className="absolute top-4 md:top-6 left-4 right-4 flex items-center justify-between z-20" onClick={(e) => e.stopPropagation()}>
        <div className="font-detail text-cream/40 text-xs tracking-wider">{index + 1} / {items.length}</div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClose}
            className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 active:bg-white/30 transition-colors"
            style={{ touchAction: "manipulation" }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {imgExpanded && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black cursor-zoom-out"
          style={{ zIndex: 10000 }}
          onClick={(e) => { e.stopPropagation(); setImgExpanded(false); }}
        >
          <img
            src={slides[slideIdx]}
            alt={item.name}
            className="max-w-[95vw] max-h-[95vh] object-contain"
          />
          <button
            onClick={(e) => { e.stopPropagation(); setImgExpanded(false); }}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Close expanded view"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {showPostcodeModal && (
        <PostcodeModal
          onSubmit={(info) => { onSetPostcode(info); setShowPostcodeModal(false); setShowPricingPopup(true); }}
          onDismiss={() => setShowPostcodeModal(false)}
        />
      )}

      {showPricingPopup && (
        <PricingPopup
          item={item}
          postcodeInfo={postcodeInfo}
          onClose={() => setShowPricingPopup(false)}
        />
      )}
    </div>
  );
}

function GridCard({ item, idx, cat, onOpen, onDetail, onDrill, rowActive }) {
  const [_hovered, setHovered] = useState(false);
  return (
    <div
      className="gallery-card group cursor-pointer rounded-2xl overflow-hidden bg-cream-dark relative aspect-square"
      onClick={() => onDrill ? onDrill(item, cat.label) : onOpen(cat.items, idx, cat.label)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {item.slides ? (
        <SlidingThumb slides={item.slides} alt={`${item.name} — ROGETjames`} active={rowActive} focus={item.focus} />
      ) : (
        <img src={item.img} alt={`${item.name} — ROGETjames`} loading="lazy" decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={item.focus ? { objectPosition: item.focus } : undefined} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
        <p className="text-cream font-heading font-semibold text-sm" style={{ wordSpacing: "-0.05em" }}>{item.name}</p>
      </div>
      <button
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-cream/80 text-[9px] font-detail tracking-widest uppercase opacity-0 group-hover:opacity-100 hover:bg-clay hover:border-clay hover:text-cream transition-all duration-200 whitespace-nowrap"
        onClick={(e) => { e.stopPropagation(); onDetail({ ...item, _series: cat.label }); }}
      >
        details
      </button>
    </div>
  );
}

function WallArtCard({ item, idx, series, onOpen, onDetail, onDrill, rowActive }) {
  const [_hovered, setHovered] = useState(false);
  return (
    <div
      className="gallery-card group cursor-pointer rounded-2xl overflow-hidden relative flex-none h-full aspect-square"
      onClick={() => onDrill ? onDrill(item, series.label) : onOpen(series.items, idx, series.label)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {item.slides ? (
        <SlidingThumb slides={item.slides} alt={`${item.name} — ROGETjames`} active={rowActive} focus={item.focus} />
      ) : (
        <img src={item.img} alt={`${item.name} — ROGETjames`} loading="lazy" decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={item.focus ? { objectPosition: item.focus } : undefined} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
        <p className="text-cream font-heading font-semibold text-xs" style={{ wordSpacing: "-0.05em" }}>{item.name}</p>
        {item.subtitle && <p className="text-cream/60 font-detail text-[9px] mt-0.5">{item.subtitle}</p>}
      </div>
      <button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-cream/80 text-[9px] font-detail tracking-widest uppercase opacity-0 group-hover:opacity-100 hover:bg-clay hover:border-clay hover:text-cream transition-all duration-200 whitespace-nowrap"
        onClick={(e) => { e.stopPropagation(); onDetail({ ...item, _series: series.label }); }}
      >
        details
      </button>
    </div>
  );
}

const SCREENS_STRIP_IMGS = [
  "/images/screens/strip/aslyiam.jpg",
  "/images/screens/strip/ferlie-close.jpg",
  "/images/screens/strip/grail-close.jpg",
  "/images/screens/strip/marakesh-fdl.jpg",
  "/images/screens/strip/orian.jpg",
  "/images/screens/strip/viasi.jpg",
  "/images/screens/strip/wattle-urn.jpg",
  "/images/screens/strip/wattle.jpg",
  "/images/screens/strip/xavier-close.jpg",
];

function ScreensStrip() {
  const tiles = [...SCREENS_STRIP_IMGS, ...SCREENS_STRIP_IMGS];
  return (
    <div className="w-full overflow-hidden my-4" style={{ height: "120px" }}>
      <div
        className="flex gap-2 h-full"
        style={{
          width: "max-content",
          animation: "marquee-scroll 40s linear infinite",
          willChange: "transform",
        }}
      >
        {tiles.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="h-full w-auto object-cover rounded"
            style={{ aspectRatio: "4/3", flexShrink: 0 }}
          />
        ))}
      </div>
    </div>
  );
}

function SeriesRow({ series, openLightbox, setDetailItem, onDrill }) {
  const rowRef = useRef(null);
  const [showRight, setShowRight] = useState(series.items.length > 5);
  const [showLeft, setShowLeft] = useState(false);
  const [rowActive, setRowActive] = useState(false);


  const checkScroll = () => {
    const el = rowRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 8);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  const scrollAmount = () => {
    const el = rowRef.current;
    if (!el) return 200;
    const card = el.firstElementChild;
    const cardW = card ? card.offsetWidth + 12 : 172;
    return window.innerWidth < 768 ? cardW : cardW * 2;
  };
  const scrollRight = () => rowRef.current?.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  const scrollLeft  = () => rowRef.current?.scrollBy({ left: -scrollAmount(), behavior: "smooth" });

  const arrowClass = "hidden md:flex absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-charcoal/90 border border-white/15 items-center justify-center text-cream/70 hover:text-cream hover:border-clay hover:bg-charcoal active:bg-charcoal transition-all backdrop-blur-sm z-20";

  return (
    <div onMouseEnter={() => setRowActive(true)} onMouseLeave={() => setRowActive(false)}>
      <div data-series-label className="group/lbl inline-flex mb-2 px-1 cursor-default gap-[0.01em]">
        {series.label.split("").map((char, i) => (
          <span
            key={i}
            className="font-detail text-xs uppercase text-warm-gray group-hover/lbl:text-clay group-hover/lbl:-translate-y-0.5 transition-all"
            style={{ letterSpacing: "0.2em", transitionDuration: "350ms", transitionDelay: `${i * 22}ms`, display: "inline-block", whiteSpace: "pre" }}
          >
            {char}
          </span>
        ))}
      </div>
      <div className="relative">
          <div
            ref={rowRef}
            className="series-scroll flex gap-3 overflow-x-auto pb-1 h-52"
            data-lenis-prevent
            onScroll={checkScroll}
          >
            {series.items.map((item, idx) => (
              <WallArtCard key={idx} item={item} idx={idx} series={series} onOpen={openLightbox} onDetail={setDetailItem} onDrill={onDrill} rowActive={rowActive} />
            ))}
          </div>
          {showLeft && (
            <button onClick={scrollLeft} aria-label="Scroll left" style={{ touchAction: "manipulation" }} className={`${arrowClass} left-1`}>
              <ChevronLeft size={16} />
            </button>
          )}
          {showRight && (
            <button onClick={scrollRight} aria-label="Scroll right" style={{ touchAction: "manipulation" }} className={`${arrowClass} right-5`}>
              <ChevronRight size={16} />
            </button>
          )}
      </div>
    </div>
  );
}

// Search aliases — maps a keyword to items that should appear in results.
// Each entry is either a name string (matches any series) or {name, series} (exact series match).
const ROUND_ITEMS = [
  "OBLIATIONES",
  "OBLIATIONES — Large",
  "OBLIATIONES TIBETAN — Patha",
  "WANDOO",
  { name: "WATTLE", series: "AUSTRALIAN NATIVES" },
  "BIRDY NUM NUM",
  "FERLICE",
  "OLIN",
  "FUEILLES",
  "DANDELIONS",
];
const SEARCH_ALIASES = {
  round:    ROUND_ITEMS,
  circle:   ROUND_ITEMS,
  circular: ROUND_ITEMS,
  floral: [
    "RUE", "RUE the 3rd", "OLIN", "FERLICE", "FUEILLES", "DANDELIONS",
    "BANKSIA Free Range", "BANKSIA Round", "BANKSIA Rec Landscape", "BANKSIA Rec Portrait",
    "BANKSIA Oldmanis", "BANKSIA Deco", "BANKSIA Diamond",
    { name: "WATTLE", series: "AUSTRALIAN NATIVES" }, "WANDOO", "BIRDY NUM NUM",
    "GREN Edge", "GREN Tao", "GREN Free", "GREN X",
  ],
  organic: [
    "RUE", "RUE the 3rd", "OLIN", "FERLICE", "FUEILLES", "DANDELIONS",
    "BANKSIA Free Range", "BANKSIA Round", "BANKSIA Rec Landscape", "BANKSIA Rec Portrait", "BANKSIA Oldmanis", "BANKSIA Deco",
    "GREN Edge", "GREN Tao", "GREN Free", "GREN X",
    { name: "WATTLE", series: "AUSTRALIAN NATIVES" }, "WANDOO", "BIRDY NUM NUM",
    "CREEPING FIG", "GRANDE CF", "OASIS CF", "BANKSIA CF",
    "VITAE — GREN", "VITAE — SHIOGI",
  ],
  geometric: [
    "OBLIATIONES", "OBLIATIONES — Large", "OBLIATIONES TIBETAN — Patha", "OKO",
    "SALAMANKA", "METROPOLIS", "NEA", "ZON ZEE",
    "JEAGER", "ZED O", "ORIGINS",
    "PLUME", "PLUME FERN",
  ],
  abstract: [
    "SALAMANKA", "METROPOLIS", "NEA", "ZON ZEE", "OKO",
    "JEAGER", "ZED O",
    "PLUME", "PLUME FERN",
  ],
};

// Suggestion groups shown when search is focused but empty
const SEARCH_SUGGESTIONS = [
  {
    label: "By Style",
    items: ["round", "floral", "organic", "geometric", "abstract", "sculptural"],
  },
  {
    label: "By Series",
    items: ["flowers", "plume", "branches", "australian natives", "creeping fig", "jungle", "b editions", "therus", "ikona", "obliationes", "neazar", "pendant", "birds", "centis", "retro", "vitae", "sculpture", "screens", "fire & light"],
  },
];

// Flat list of every item across all series/categories for search
const ALL_SEARCHABLE = [
  ...WALL_ART_SERIES.flatMap(s => s.items.map(item => ({ ...item, _series: s.label }))),
  ...OTHER_CATEGORIES.flatMap(c => c.items.map(item => ({ ...item, _series: c.label }))),
];

function GridSection({ cat, openLightbox, setDetailItem, onDrill }) {
  const [rowActive, setRowActive] = useState(false);
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"
      onMouseEnter={() => setRowActive(true)}
      onMouseLeave={() => setRowActive(false)}
    >
      {cat.items.map((item, idx) => (
        <GridCard key={idx} item={item} idx={idx} cat={cat} onOpen={openLightbox} onDetail={setDetailItem} onDrill={onDrill} rowActive={rowActive} />
      ))}
    </div>
  );
}

// Wall Art catalogue: pages 1–20 covers the section up to and including Creeping Fig.
// Adjust the 20 if the cutoff page changes.
const WALL_ART_CAT_PAGES = Array.from({ length: 26 }, (_, i) =>
  `/images/catalogues/cat1/page-${String(i + 4).padStart(2, "0")}.jpg`
);
const SCULPTURE_CAT_PAGES = [1, 5, 4, 6, 7].map(n =>
  `/images/catalogues/cat2/page-${String(n).padStart(2, "0")}.jpg`
);

function DrillView({ item, seriesLabel, onClose, onExpand }) {
  const images = [...new Set([...(item.slides ?? [item.img]), ...(item.detailSlides ?? [])].filter(Boolean))];
  return (
    <div className="fixed inset-0 z-[9992] bg-jet flex flex-col">
      <div className="flex items-center px-5 py-3 border-b border-white/10 flex-shrink-0 gap-3">
        <button onClick={onClose} className="text-cream/40 hover:text-cream transition-colors flex items-center gap-1">
          <ChevronLeft size={16} /><span className="font-detail text-[9px] uppercase tracking-[0.15em]">Back</span>
        </button>
        <div className="flex-1 text-center">
          <p className="font-heading font-bold text-sm text-cream tracking-wide">{item.name}</p>
          {seriesLabel && <p className="font-detail text-[9px] text-cream/50 uppercase tracking-[0.2em]">{seriesLabel}</p>}
        </div>
        <button onClick={onClose} className="text-cream/40 hover:text-cream transition-colors"><X size={15} /></button>
      </div>
      <div className="flex-1 overflow-y-auto px-10 md:px-20 py-4" data-lenis-prevent>
        <div className="flex flex-wrap justify-center gap-2">
          {images.map((src, i) => (
            <div key={i} onClick={onExpand}
              className="group cursor-pointer aspect-square rounded-lg overflow-hidden border border-white/8 hover:border-clay/50 transition-all duration-200"
              style={{ opacity: 0, animation: "fadeIn 0.5s ease forwards", animationDelay: `${i * 0.06}s` }}>
              <img src={src} alt={item.name} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryContent({ containerRef, query = "", onCloseAll, initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || "wall-art");
  const [catOpen, setCatOpen] = useState(false);
  const [lightboxItems, setLightboxItems] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [sweepingId, setSweepingId] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [drilledItem, setDrilledItem] = useState(null);
  const [postcodeInfo, setPostcodeInfo] = useState(() => loadPostcode());
  const handleSetPostcode = useCallback((info) => { savePostcode(info); setPostcodeInfo(info); }, []);
  const gridRef = useRef(null);
  const searchRowRef = useRef(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    const handler = (e) => { if (e.detail) setActiveTab(e.detail); };
    window.addEventListener("open-gallery-tab", handler);
    return () => window.removeEventListener("open-gallery-tab", handler);
  }, []);

  const searchResults = query.trim().length > 0
    ? ALL_SEARCHABLE.filter(item => {
        const q = query.trim().toLowerCase();
        const nameMatch = item.name.toLowerCase().includes(q) || item._series.toLowerCase().includes(q);
        const aliasMatch = Object.entries(SEARCH_ALIASES).some(([keyword, entries]) =>
          keyword.includes(q) && entries.some(e =>
            typeof e === "string"
              ? e === item.name
              : e.name === item.name && item._series.includes(e.series)
          )
        );
        return (nameMatch || aliasMatch) && !item.img.includes("placeholder");
      })
    : null;

  // Reset catalogue panel when switching tabs
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setCatOpen(false); }, [activeTab]);

  // Animate cards on tab switch (skip wall-art — handled by row fade-in)
  useEffect(() => {
    if (activeTab === "wall-art") return;
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".gallery-card");
    if (!cards.length) return;
    gsap.fromTo(cards, { y: 30, opacity: 0, scale: 0.97 }, {
      y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.05, ease: "power3.out",
    });
  }, [activeTab]);

  // Series label flip-in animation (IntersectionObserver works inside modal scroll)
  useEffect(() => {
    if (activeTab !== "wall-art") return;
    const labels = containerRef.current?.querySelectorAll("[data-series-label]");
    if (!labels?.length) return;
    const observers = [];
    labels.forEach((label) => {
      const spans = label.querySelectorAll("span");
      gsap.set(spans, { rotationY: 90, transformPerspective: 400, transformOrigin: "center center", opacity: 0 });
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(spans, {
            rotationY: 0, opacity: 1, color: "#9E7134",
            duration: 0.5, stagger: 0.04, ease: "back.out(1.4)",
            onComplete: () => gsap.set(spans, { clearProps: "rotationY,transformPerspective,transformOrigin" }),
          });
        } else {
          gsap.killTweensOf(spans);
          gsap.set(spans, { rotationY: 90, transformPerspective: 400, transformOrigin: "center center", opacity: 0 });
        }
      }, { threshold: 0.3 });
      observer.observe(label);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [activeTab, containerRef]);

  // Wall-art accordion: unfold rows one at a time
  useEffect(() => {
    if (activeTab !== "wall-art") return;
    const container = containerRef.current;
    if (!container) return;

    const rowEls = Array.from(container.querySelectorAll(".series-scroll"));
    if (!rowEls.length) return;

    // Set all cards invisible
    rowEls.forEach(row => {
      gsap.set(Array.from(row.children), { opacity: 0 });
    });

    function unfoldRow(rowEl, onDone) {
      const cards = Array.from(rowEl.children);
      if (!cards.length) { onDone?.(); return; }
      const DURATION = 1.2;
      const STAGGER = 0.9;
      gsap.to(cards, {
        opacity: 1,
        duration: DURATION,
        stagger: STAGGER,
        ease: "sine.inOut",
        onComplete: () => gsap.set(rowEl, { clearProps: "overflow" }),
      });
      // Start next row after the 3rd card begins fading
      const triggerAfter = Math.min(2, cards.length - 1) * STAGGER;
      setTimeout(() => onDone?.(), triggerAfter * 1000);
    }

    function chainRows(idx) {
      if (idx >= rowEls.length) return;
      unfoldRow(rowEls[idx], () => chainRows(idx + 1));
    }

    // Start chain when first row enters view
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      chainRows(0);
    }, { threshold: 0.1, root: container });

    observer.observe(rowEls[0]);
    return () => observer.disconnect();
  }, [activeTab, containerRef]);

  // Horizontal scroll + edge-scroll on hover
  useEffect(() => {
    const rows = containerRef.current?.querySelectorAll('.series-scroll');
    if (!rows?.length) return;
    const cleanup = [];
    let hoveredRow = null;

    const updateFirstVisible = (row) => {
      const cards = Array.from(row.querySelectorAll('.gallery-card'));
      cards.forEach(c => { c.classList.remove('is-row-first'); c.classList.add('is-row-other'); });
      const first = cards.find(c => c.offsetLeft + c.offsetWidth > row.scrollLeft + 1);
      if (first) { first.classList.remove('is-row-other'); first.classList.add('is-row-first'); }
    };

    rows.forEach(row => {
      updateFirstVisible(row);
      let targetSpeed = 0;
      let scrollSpeed = 0;
      let rafId = null;

      const tick = () => {
        scrollSpeed += (targetSpeed - scrollSpeed) * 0.1;
        if (Math.abs(scrollSpeed) > 0.05) { row.scrollLeft += scrollSpeed; updateFirstVisible(row); }
        rafId = requestAnimationFrame(tick);
      };
      const onMouseMove = (e) => {
        const rect = row.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const w = rect.width;
        const zone = w * 0.22;
        if (x > w - zone)      targetSpeed = ((x - (w - zone)) / zone) * 14;
        else if (x < zone)     targetSpeed = -((zone - x) / zone) * 14;
        else                   targetSpeed = 0;
      };
      const onWheel = (e) => {
        if (Math.abs(e.deltaX) < Math.abs(e.deltaY) && e.deltaX === 0) return;
        e.preventDefault(); e.stopPropagation();
        row.scrollLeft += e.deltaX; updateFirstVisible(row);
      };
      const onScroll = () => updateFirstVisible(row);
      const onEnter = () => { hoveredRow = row; rafId = requestAnimationFrame(tick); };
      const onLeave = () => {
        if (hoveredRow === row) hoveredRow = null;
        targetSpeed = 0;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; scrollSpeed = 0; }
      };
      row.addEventListener('wheel', onWheel, { passive: false });
      row.addEventListener('mousemove', onMouseMove);
      row.addEventListener('scroll', onScroll);
      row.addEventListener('mouseenter', onEnter);
      row.addEventListener('mouseleave', onLeave);
      cleanup.push(() => {
        row.removeEventListener('wheel', onWheel);
        row.removeEventListener('mousemove', onMouseMove);
        row.removeEventListener('scroll', onScroll);
        row.removeEventListener('mouseenter', onEnter);
        row.removeEventListener('mouseleave', onLeave);
        if (rafId) cancelAnimationFrame(rafId);
      });
    });

    const onKeyDown = (e) => {
      if (!hoveredRow) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); hoveredRow.scrollTo({ left: hoveredRow.scrollLeft + 240, behavior: 'smooth' }); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); hoveredRow.scrollTo({ left: hoveredRow.scrollLeft - 240, behavior: 'smooth' }); }
    };
    window.addEventListener('keydown', onKeyDown);
    cleanup.push(() => window.removeEventListener('keydown', onKeyDown));
    return () => cleanup.forEach(fn => fn());
  }, [activeTab, containerRef, query]);

  // Dedicated hover-direction scroll for the search results row
  useEffect(() => {
    const row = searchRowRef.current;
    if (!row) return;
    let targetSpeed = 0, scrollSpeed = 0, rafId = null;
    const tick = () => {
      scrollSpeed += (targetSpeed - scrollSpeed) * 0.1;
      if (Math.abs(scrollSpeed) > 0.05) row.scrollLeft += scrollSpeed;
      rafId = requestAnimationFrame(tick);
    };
    const onMouseMove = (e) => {
      const rect = row.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const w = rect.width;
      const zone = w * 0.22;
      if (x > w - zone)  targetSpeed = ((x - (w - zone)) / zone) * 14;
      else if (x < zone) targetSpeed = -((zone - x) / zone) * 14;
      else               targetSpeed = 0;
    };
    const onEnter = () => { rafId = requestAnimationFrame(tick); };
    const onLeave = () => { targetSpeed = 0; if (rafId) { cancelAnimationFrame(rafId); rafId = null; scrollSpeed = 0; } };
    row.addEventListener('mouseenter', onEnter);
    row.addEventListener('mouseleave', onLeave);
    row.addEventListener('mousemove', onMouseMove);
    return () => {
      row.removeEventListener('mouseenter', onEnter);
      row.removeEventListener('mouseleave', onLeave);
      row.removeEventListener('mousemove', onMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [searchResults]);

  const switchTab = useCallback((id) => {
    if (id === activeTab || isAnimating.current) return;
    isAnimating.current = true;
    const cards = gridRef.current?.querySelectorAll(".gallery-card");
    if (!cards?.length) { setActiveTab(id); isAnimating.current = false; return; }
    gsap.to(cards, {
      opacity: 0, scale: 0.95, y: -15, duration: 0.2, stagger: 0.02, ease: "power2.in",
      onComplete: () => { setActiveTab(id); isAnimating.current = false; },
    });
  }, [activeTab]);

  // Always open lightbox on the full global list so arrows navigate all gallery items
  const openLightbox = (items, idx, seriesLabel) => {
    const clickedItem = items[idx];
    const seriesName = seriesLabel ?? clickedItem._series;
    const globalIdx = ALL_SEARCHABLE.findIndex(
      (it) => it.name === clickedItem.name && (!seriesName || it._series === seriesName)
    );
    setLightboxItems(ALL_SEARCHABLE);
    setLightboxIndex(globalIdx >= 0 ? globalIdx : 0);
  };
  const closeLightbox = useCallback(() => { setLightboxItems(null); setLightboxIndex(null); }, []);
  const prevLightbox = useCallback(() => setLightboxIndex((i) => (i > 0 ? i - 1 : ALL_SEARCHABLE.length - 1)), []);
  const nextLightbox = useCallback(() => setLightboxIndex((i) => (i < ALL_SEARCHABLE.length - 1 ? i + 1 : 0)), []);

  const handleDrill = useCallback((item, seriesLabel) => {
    setDrilledItem({ item, seriesLabel });
  }, []);

  const handleDrillExpand = useCallback(() => {
    if (!drilledItem) return;
    openLightbox([drilledItem.item], 0, drilledItem.seriesLabel);
    setDrilledItem(null);
  }, [drilledItem, openLightbox]);

  const activeCat = OTHER_CATEGORIES.find((c) => c.id === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">

      {/* Search results — horizontal scrolling rows of 10, same card size as gallery */}
      {searchResults !== null && (
        <div className="space-y-4">
          <p className="font-detail text-xs text-warm-gray uppercase tracking-[0.2em]">
            {searchResults.length === 0 ? "No results found" : `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""}`}
          </p>
          {searchResults.length > 0 && (
            <div ref={searchRowRef} className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2" data-lenis-prevent>
              {searchResults.map((item, idx) => (
                <div
                  key={idx}
                  className="gallery-card group cursor-pointer rounded-xl overflow-hidden bg-cream-dark relative aspect-square"
                  onClick={() => openLightbox([item], 0, item._series)}
                >
                  <img src={item.img} alt={`${item.name} — ROGETjames`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                    <p className="text-cream font-heading font-semibold text-xs" style={{ wordSpacing: "-0.05em" }}>{item.name}</p>
                    <p className="text-cream/50 font-detail text-[9px] uppercase tracking-wider mt-0.5">{item._series}</p>
                  </div>
                  <button
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-cream/80 text-[9px] font-detail tracking-widest uppercase opacity-0 group-hover:opacity-100 hover:bg-clay hover:border-clay hover:text-cream transition-all duration-200 whitespace-nowrap"
                    onClick={(e) => { e.stopPropagation(); setDetailItem({ ...item }); }}
                  >
                    details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Normal tabbed view — hidden while searching */}
      {searchResults === null && <>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center items-center gap-2 mb-10">
        {ALL_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === activeTab || sweepingId) return;
              setSweepingId(tab.id);
              setTimeout(() => { setSweepingId(null); switchTab(tab.id); }, 700);
            }}
            className={`filter-btn px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              sweepingId === tab.id ? "filter-btn-sweeping" :
              activeTab === tab.id ? "filter-btn-active" : "filter-btn-inactive"
            }`}
            style={{
              backgroundColor: activeTab === tab.id ? "#9E7134" : "#1A1A1A",
              color: activeTab === tab.id ? "#1A1A1A" : "#F2F0E9",
              border: activeTab === tab.id ? "none" : "1px solid rgba(242,240,233,0.15)",
              transition: "background-color 0.6s ease 0.7s, color 0.6s ease 0.7s",
              position: "relative",
            }}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div ref={gridRef}>
        {activeTab === "wall-art" && (
          <div className="flex flex-col gap-6">
            {/* Catalogue sub-section */}
            <div>
              <button
                onClick={() => setCatOpen(v => !v)}
                className="w-full flex items-center gap-3 py-3 border-b border-white/10 group"
              >
                <span className="relative flex-none w-3 h-3">
                  <span className="absolute inset-0 rounded-full border border-clay animate-ping opacity-50" />
                  <span className="relative w-3 h-3 rounded-full border border-clay group-hover:bg-clay transition-all duration-200 block" />
                </span>
                <span className="font-heading font-bold text-base tracking-wide flex-1 text-left flex flex-col gap-0.5">
                  <span>
                    <span className="text-cream/60 group-hover:text-clay transition-colors duration-200 mr-1.5">WALL ART</span><span className="text-cream">CATALOGUE</span>
                  </span>
                  <svg viewBox="0 0 100 7" preserveAspectRatio="none" className="w-full text-cream/30 group-hover:text-clay/60 transition-colors duration-200" style={{ height: "6px", display: "block" }}>
                    <path d="M 0.5,1 Q 50,6.5 99.5,1" stroke="currentColor" fill="none" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </span>
                <ChevronRight
                  size={15}
                  className="text-cream/30 group-hover:text-clay/60 transition-all duration-300"
                />
              </button>
            </div>

            {WALL_ART_SERIES.map((series) => (
              <SeriesRow key={series.id} series={series} openLightbox={openLightbox} setDetailItem={setDetailItem} onDrill={handleDrill} />
            ))}
          </div>
        )}

        {activeTab !== "wall-art" && activeCat && (
          <>
            {activeCat.id === "sculpture" && (
              <div className="mb-8">
                <button
                  onClick={() => setCatOpen(v => !v)}
                  className="w-full flex items-center gap-3 py-3 border-b border-white/10 group"
                >
                  <span className="relative flex-none w-3 h-3">
                  <span className="absolute inset-0 rounded-full border border-clay animate-ping opacity-50" />
                  <span className="relative w-3 h-3 rounded-full border border-clay group-hover:bg-clay transition-all duration-200 block" />
                </span>
                  <span className="font-heading font-bold text-base tracking-wide flex-1 text-left flex flex-col gap-0.5">
                    <span>
                      <span className="text-cream/60 group-hover:text-clay transition-colors duration-200">SCULPTURE</span>
                      {" "}
                      <span className="text-cream">CATALOGUE</span>
                    </span>
                    <svg viewBox="0 0 100 7" preserveAspectRatio="none" className="w-full text-cream/30 group-hover:text-clay/60 transition-colors duration-200" style={{ height: "6px", display: "block" }}>
                      <path d="M 0.5,1 Q 50,6.5 99.5,1" stroke="currentColor" fill="none" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  </span>
                  <ChevronRight
                    size={15}
                    className="text-cream/30 group-hover:text-clay/60 transition-all duration-300"
                  />
                </button>
              </div>
            )}
            {activeCat.description && <p className="text-warm-gray text-sm mb-8 font-detail">{activeCat.description}</p>}
            <GridSection cat={activeCat} openLightbox={openLightbox} setDetailItem={setDetailItem} onDrill={handleDrill} />
          </>
        )}
      </div>

      </>}

      {drilledItem && (
        <DrillView item={drilledItem.item} seriesLabel={drilledItem.seriesLabel} onClose={() => setDrilledItem(null)} onExpand={handleDrillExpand} />
      )}
      {lightboxItems !== null && lightboxIndex !== null && (
        <Lightbox items={lightboxItems} index={lightboxIndex} onClose={closeLightbox} onPrev={prevLightbox} onNext={nextLightbox} postcodeInfo={postcodeInfo} onSetPostcode={handleSetPostcode} onDetail={setDetailItem} />
      )}
      {detailItem && (
        <DetailCard item={detailItem} seriesLabel={detailItem._series} onClose={() => setDetailItem(null)} postcodeInfo={postcodeInfo} onSetPostcode={handleSetPostcode} />
      )}

      {catOpen && (
        <CatPageViewer
          pages={activeTab === "wall-art" ? WALL_ART_CAT_PAGES : SCULPTURE_CAT_PAGES}
          label={activeTab === "wall-art" ? "Wall Art Catalogue" : "Sculpture Catalogue"}
          onClose={() => setCatOpen(false)}
          onCloseAll={onCloseAll}
        />
      )}
    </div>
  );
}

function GalleryModal({ onClose, initialTab }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const bodyRef = useRef(null);
  const searchRef = useRef(null);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [collectionInfoOpen, setCollectionInfoOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    lenis?.stop();
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
    gsap.fromTo(panelRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" });
    window.__galleryModalBody = bodyRef;
    return () => { lenis?.start(); window.__galleryModalBody = null; };
  }, [lenis]);

  const handleClose = useCallback(() => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(panelRef.current, { y: 30, opacity: 0, duration: 0.3, ease: "power2.in" });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.25, ease: "power2.in" }, "-=0.15");
  }, [onClose]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape" && !query) handleClose(); else if (e.key === "Escape") setQuery(""); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose, query]);

  return (
    <>
      <div ref={overlayRef} className="fixed inset-0 z-[100] bg-charcoal/80 backdrop-blur-sm" onClick={handleClose} />
      <div ref={panelRef} className="fixed inset-0 md:inset-6 z-[110] bg-charcoal md:rounded-3xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 px-5 md:px-8 py-4 md:py-5 border-b border-white/10 flex-none">
          <div className="flex-none">
            <span className="font-detail text-xs text-cream/60 uppercase tracking-[0.2em]">The Collection</span>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-cream mt-1">
              Catalogued <span className="text-cream/60">Creations</span>
            </h2>
          </div>
          {/* Search bar + suggestions dropdown */}
          <div className="relative flex-1 min-w-[140px] max-w-sm ml-auto">
            <div className={`flex items-center gap-2 bg-white/5 border rounded-full px-4 py-2 transition-colors ${searchFocused ? "border-clay/50" : "border-white/10"}`}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-warm-gray flex-none">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                placeholder="Search by style or name…"
                className="flex-1 bg-transparent text-cream text-sm font-detail font-medium outline-none placeholder:text-cream/60 min-w-0"
              />
              {query && (
                <button onClick={() => { setQuery(""); searchRef.current?.focus(); }} className="text-warm-gray hover:text-cream transition-colors flex-none">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Suggestions dropdown — shows on focus when search is empty */}
            {searchFocused && !query && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#1a1a1a] border border-white/10 rounded-2xl p-4 shadow-2xl">
                {SEARCH_SUGGESTIONS.map(group => (
                  <div key={group.label} className="mb-3 last:mb-0">
                    <p className="font-detail text-[9px] text-warm-gray/60 uppercase tracking-[0.2em] mb-2">{group.label}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map(term => (
                        <button
                          key={term}
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => { setQuery(term); searchRef.current?.focus(); }}
                          className="px-3 py-1 rounded-full text-xs font-detail bg-white/5 border border-white/10 text-cream/60 hover:border-clay/60 hover:text-cream hover:bg-white/8 transition-all duration-200 capitalize"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setCollectionInfoOpen(true)} title="About the Collection" className="flex-none transition-colors duration-200" style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(242,240,233,0.4)", fontSize: 17, lineHeight: 1, padding: "2px 0" }}>
            ⓘ
          </button>
          <button onClick={handleClose} className="flex-none p-2.5 rounded-full bg-white/10 text-cream hover:bg-white/20 transition-colors" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {/* Scrollable body */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto" data-lenis-prevent>
          <GalleryContent containerRef={bodyRef} query={query} onCloseAll={handleClose} initialTab={initialTab} />
        </div>
      </div>

      {/* About the Collection popup */}
      {collectionInfoOpen && (
        <div onClick={() => setCollectionInfoOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 10500, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#1A1A1A", border: "1px solid rgba(242,240,233,0.08)", borderRadius: 16, maxWidth: 640, width: "100%", maxHeight: "85vh", overflowY: "auto", scrollbarWidth: "none", padding: "48px 52px", position: "relative" }}>
            <button onClick={() => setCollectionInfoOpen(false)} style={{ position: "absolute", top: 18, right: 20, background: "none", border: "none", color: "rgba(242,240,233,0.4)", cursor: "pointer", fontSize: 20, lineHeight: 1 }}>✕</button>
            <p style={{ fontFamily: "var(--font-detail)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#9E7134", margin: "0 0 12px" }}>Wall Art</p>
            <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(20px,3vw,30px)", color: "#F2F0E9", margin: "0 0 36px", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1.15 }}>The Collection</p>
            <p style={{ fontFamily: "var(--font-detail)", fontSize: 15, color: "rgba(242,240,233,0.7)", lineHeight: 1.85, margin: 0 }}>
              Your text here — write about the wall art range, the designs, materials, what makes them distinct.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// ── Card Deck Overlay ─────────────────────────────────────────────────────
const DECK_SERIES = [...WALL_ART_SERIES, ...OTHER_CATEGORIES].map(s => ({
  id: s.id,
  label: s.label,
  items: s.items.filter(i => i.img && !i.img.includes("placeholder")),
})).filter(s => s.items.length > 0);

// Stamp every item with a stable numeric ID for reliable navigation
let _uidCounter = 0;
DECK_SERIES.forEach(s => s.items.forEach(it => { it._uid = ++_uidCounter; }));

const DECK_ALL_ITEMS = (() => {
  const arr = DECK_SERIES.flatMap(s => s.items.flatMap(it => {
    const imgs = it.singleInAll ? [it.img] : (it.slides && it.slides.length > 1) ? it.slides : [it.img];
    return imgs.map((img, sIdx) => ({ ...it, img, _seriesId: s.id, _seriesLabel: s.label, _slideIdx: sIdx }));
  }));
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  return arr;
})();

function CardDeckOverlay({ onClose, categoryFilter = "wall-art", onOpenCatalogue, onSwitchCategory }) {
  const [tab, setTab] = useState("all");
  const [pillsOpen, setPillsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [collectionInfoOpen, setCollectionInfoOpen] = useState(false);
  const searchInputRef = useRef(null);
  const [cardIdx, setCardIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [animDir, setAnimDir] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [sliding, setSliding] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [postcodeInfo, setPostcodeInfo] = useState(() => loadPostcode());
  const [postcodeInput, setPostcodeInput] = useState("");
  const [postcodeStep, setPostcodeStep] = useState(false);
  const [selectedMat, setSelectedMat] = useState("aluminium");
  const [selectedSize, setSelectedSize] = useState(null);
  const slideRef = useRef(null);
  const touchStartX = useRef(0);

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const [sculptureCat, setSculptureCat] = useState("all");
  const [drilledSeries, setDrilledSeries] = useState(null); // { id, label, items } or null
  const [slideshowActive, setSlideshowActive] = useState(false);
  const slideshowSnapshotRef = useRef([]);
  const slideshowFlatIdxRef = useRef(0);
  const slideshowTimerRef = useRef(null);

  const SCULPTURE_CATS = [
    { id: "all",      label: "All" },
    { id: "classics", label: "The Classics" },
    { id: "bonbons",  label: "Bon Bons & Genie Bottles" },
    { id: "leafs",    label: "Leaf Sculptures" },
  ];

  const prevCategoryFilter = useRef(categoryFilter);
  useEffect(() => {
    if (prevCategoryFilter.current !== categoryFilter) {
      prevCategoryFilter.current = categoryFilter;
      setTab("all");
      setDrilledSeries(null);
      setCardIdx(0);
      setSlideIdx(0);
      setSculptureCat("all");
    }
  }, [categoryFilter]);

  const wallArtIds = new Set(WALL_ART_SERIES.map(s => s.id));
  const filteredSeries = (() => {
    const base = categoryFilter === "sculpture"
      ? DECK_SERIES.filter(s => !wallArtIds.has(s.id))
      : DECK_SERIES.filter(s => wallArtIds.has(s.id));
    if (categoryFilter !== "sculpture" || sculptureCat === "all") return base;
    return base.map(s => ({ ...s, items: s.items.filter(it => it.cat === sculptureCat) })).filter(s => s.items.length > 0);
  })();

  const filteredAllItems = (() => {
    const seen = new Set();
    const arr = filteredSeries.flatMap(s => s.items.flatMap(it => {
      const imgs = it.singleInAll ? [it.img] : (it.slides && it.slides.length > 1 ? it.slides : [it.img]);
      return imgs
        .filter(img => { if (seen.has(img)) return false; seen.add(img); return true; })
        .map((img, sIdx) => ({ ...it, img, _seriesId: s.id, _seriesLabel: s.label, _slideIdx: sIdx }));
    }));
    arr.forEach((_, i) => { if (i > 0) { const j = ((i * 2654435769) >>> 0) % (i + 1); [arr[i], arr[j]] = [arr[j], arr[i]]; } });
    return arr;
  })();

  const isAll = tab === "all";
  const series = isAll ? null : filteredSeries.find(s => s.id === tab);
  const items = isAll ? [] : (series?.items || []);
  const item = isAll ? null : items[cardIdx];
  const itemSlides = item ? (item.slides && item.slides.length > 1 ? item.slides : [item.img]) : [];
  const displayImg = itemSlides[slideIdx] ?? item?.img;
  const [detailZoom, setDetailZoom] = useState(null);

  const navigate = (dir) => {
    if (isAll) return;
    setAnimDir(dir);
    setShowDetails(false);
    setSlideIdx(0);
    setSelectedSize(null);
    setShowPricing(false);
    setTimeout(() => {
      setCardIdx(i => (i + dir + items.length) % items.length);
      setAnimDir(null);
    }, 380);
  };

  const startSlideshow = () => {
    slideshowSnapshotRef.current = [...filteredAllItems];
    slideshowFlatIdxRef.current = 0;
    const it = slideshowSnapshotRef.current[0];
    if (!it) return;
    const ser = filteredSeries.find(s => s.id === it._seriesId);
    const iIdx = ser ? (() => { const i = ser.items.findIndex(x => x.img === it.img || (x.slides && x.slides.includes(it.img))); return i === -1 ? Math.max(0, ser.items.findIndex(x => x.name === it.name)) : i; })() : 0;
    setTab(it._seriesId);
    setCardIdx(iIdx);
    setSlideIdx(it._slideIdx ?? 0);
    setShowDetails(false);
    setSlideshowActive(true);
  };

  const stopSlideshow = () => {
    setSlideshowActive(false);
    clearTimeout(slideshowTimerRef.current);
  };

  // Slideshow: auto-advance through the full flat item list
  useEffect(() => {
    clearTimeout(slideshowTimerRef.current);
    if (!slideshowActive || isAll) return;
    slideshowTimerRef.current = setTimeout(() => {
      const snap = slideshowSnapshotRef.current;
      if (!snap.length) return;
      slideshowFlatIdxRef.current = (slideshowFlatIdxRef.current + 1) % snap.length;
      const it = snap[slideshowFlatIdxRef.current];
      const ser = filteredSeries.find(s => s.id === it._seriesId);
      const iIdx = ser ? (() => { const i = ser.items.findIndex(x => x.img === it.img || (x.slides && x.slides.includes(it.img))); return i === -1 ? Math.max(0, ser.items.findIndex(x => x.name === it.name)) : i; })() : 0;
      setTab(it._seriesId);
      setCardIdx(iIdx);
      setSlideIdx(it._slideIdx ?? 0);
    }, 3500);
    return () => clearTimeout(slideshowTimerRef.current);
  }, [slideshowActive, tab, cardIdx, slideIdx]);

  // Auto-advance to next design after pausing on the last slide (disabled during slideshow)
  const autoAdvanceRef = useRef(null);
  useEffect(() => {
    clearTimeout(autoAdvanceRef.current);
    if (!isAll && !slideshowActive && itemSlides.length > 1 && slideIdx === itemSlides.length - 1) {
      autoAdvanceRef.current = setTimeout(() => navigate(1), 3200);
    }
    return () => clearTimeout(autoAdvanceRef.current);
  }, [slideIdx, cardIdx, tab]);

  // Arrow/swipe: step through slides within an item before jumping to next item
  const handleArrow = (dir) => {
    if (isAll) return;
    if (dir > 0 && slideIdx < itemSlides.length - 1) {
      setAnimDir(dir);
      setTimeout(() => { setSlideIdx(i => i + 1); setAnimDir(null); }, 380);
    } else if (dir < 0 && slideIdx > 0) {
      setAnimDir(dir);
      setTimeout(() => { setSlideIdx(i => i - 1); setAnimDir(null); }, 380);
    } else {
      navigate(dir);
    }
  };

  const openSeries = (seriesId, idx = 0, sIdx = 0) => {
    setTab(seriesId);
    setCardIdx(idx);
    setSlideIdx(sIdx);
    setShowDetails(false);
  };

  const jumpToItem = (seriesId, itemIdx, sIdx = 0, openDet = false) => {
    setTab(seriesId);
    setCardIdx(itemIdx);
    setSlideIdx(sIdx);
    setShowDetails(openDet);
  };

  // Reset material when switching to an item that doesn't support aluminium
  useEffect(() => {
    if (item?.materials && !item.materials.includes(selectedMat)) {
      setSelectedMat(item.materials[0]);
    }
  }, [item]);

  // Slideshow
  useEffect(() => {
    if (!sliding || isAll) return;
    slideRef.current = setInterval(() => navigate(1), 2800);
    return () => clearInterval(slideRef.current);
  }, [sliding, tab, cardIdx, isAll]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") { if (showDetails) setShowDetails(false); else onClose(); }
      if (!isAll && e.key === "ArrowRight") handleArrow(1);
      if (!isAll && e.key === "ArrowLeft") handleArrow(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isAll, items, showDetails, slideIdx, cardIdx]);

  const sizes = item ? (PIECE_SIZES[item.name] || []) : [];

  return (
    <div className="fixed inset-0 z-[10000] bg-jet flex flex-col"
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={e => { const dx = e.changedTouches[0].clientX - touchStartX.current; if (Math.abs(dx) > 50 && !isAll) handleArrow(dx < 0 ? 1 : -1); }}
    >
      {/* Top bar */}
      <div className="flex flex-col flex-shrink-0">
      <div className="flex items-center px-5 py-3 gap-3" style={{ borderBottom: categoryFilter === "sculpture" ? "none" : "1px solid rgba(255,255,255,0.1)" }}>
        {/* Left — logo */}
        <span className="font-heading font-bold text-sm tracking-widest text-cream flex-none">ROGET<span className="font-light italic">james</span></span>
        {/* Centre — catalogue + info */}
        <div className="flex-1 flex justify-center items-center gap-1.5">
          <button onClick={() => onOpenCatalogue?.(categoryFilter)}
            className="pill-trace font-detail text-[9px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-white/35 bg-transparent text-cream/88 transition-colors duration-200">
            Catalogue
          </button>
          <div style={{ width: 8 }} />
          {categoryFilter !== "sculpture" && (
            <button onClick={() => setCollectionInfoOpen(true)}
              className="group relative flex items-center justify-center rounded-full border bg-transparent hover:border-clay hover:bg-clay/10 transition-all duration-150"
              style={{ width: 22, height: 22, flexShrink: 0, borderColor: "rgba(242,240,233,0.35)" }}>
              <span style={{ fontFamily: "var(--font-detail)", fontSize: 11, color: "rgba(242,240,233,0.88)", lineHeight: 1, userSelect: "none" }}>i</span>
              <span className="pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2 font-detail text-[9px] uppercase tracking-[0.16em] text-cream/50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-100" style={{ transitionDelay: "80ms" }}>
                About the Collection
              </span>
            </button>
          )}
        </div>
        {/* Right — search + controls */}
        <div className="flex items-center gap-2 flex-none">
          {searchOpen
            ? <div className="relative flex items-center">
                <input ref={searchInputRef} type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search…"
                  className="bg-white/6 border border-white/15 rounded-full pl-3 pr-7 py-1.5 font-detail text-[10px] text-cream placeholder:text-cream/30 focus:outline-none focus:border-clay/50 transition-colors w-36"
                  autoFocus
                />
                <button onClick={() => { setSearchQuery(""); setSearchOpen(false); }} className="absolute right-2.5 text-cream/30 hover:text-cream/70 transition-colors">
                  <X size={10} />
                </button>
              </div>
            : <>
                {categoryFilter !== "sculpture" && onSwitchCategory && (
                  <button
                    onClick={() => onSwitchCategory("sculpture")}
                    className="pill-trace font-detail text-[9px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-full border border-white/20 bg-transparent text-cream/88 hover:text-cream hover:border-white/50 transition-colors duration-200 whitespace-nowrap"
                  >
                    Browse Sculpture
                  </button>
                )}
                {categoryFilter === "sculpture" && onSwitchCategory && (
                  <button
                    onClick={() => onSwitchCategory("wall-art")}
                    className="pill-trace font-detail text-[9px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-full border border-white/20 bg-transparent text-cream/88 hover:text-cream hover:border-white/50 transition-colors duration-200 whitespace-nowrap"
                  >
                    Browse Wall Art
                  </button>
                )}
                <button onClick={() => { setSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 50); }}
                  className="group flex items-center gap-2 text-cream/70 hover:text-cream transition-colors md:ml-8" aria-label="Search">
                  <svg width="20" height="20" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="6" cy="6" r="4"/><line x1="9.5" y1="9.5" x2="13" y2="13"/></svg>
                  <span className="hidden md:inline font-detail text-[9px] uppercase tracking-[0.2em]">Refine Search</span>
                </button>
              </>
          }
          {!isAll && !searchQuery && (
            <button onClick={() => setSliding(s => !s)} className={`pill-trace font-detail text-[9px] uppercase tracking-[0.18em] px-3 py-1 rounded-full border transition-colors duration-200${sliding ? " pill-active" : ""}`}
              style={{ borderColor: sliding ? "#9e7134" : "rgba(242,240,233,0.2)", color: sliding ? "#9e7134" : "rgba(242,240,233,0.45)", background: "transparent" }}>
              {sliding ? "⏸ Slide" : "▶ Slide"}
            </button>
          )}
          <button onClick={onClose}
            className="flex items-center justify-center rounded-full transition-colors"
            style={{ width: isMobile ? 38 : 24, height: isMobile ? 38 : 24, background: isMobile ? "rgba(242,240,233,0.12)" : "transparent", border: isMobile ? "1.5px solid rgba(242,240,233,0.25)" : "none", color: isMobile ? "rgba(242,240,233,0.9)" : "rgba(242,240,233,0.4)" }}
            aria-label="Close">
            <X size={isMobile ? 18 : 15} />
          </button>
        </div>
      </div>
      {categoryFilter === "sculpture" && (
        <div className="relative flex-shrink-0">
          <div className="flex gap-2 px-5 py-2 border-b border-white/10 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {SCULPTURE_CATS.map(({ id, label }) => (
              <button key={id} onClick={() => { setSculptureCat(id); setCardIdx(0); setTab("all"); }}
                className={`pill-trace flex-shrink-0 px-4 py-1.5 rounded-full font-detail text-[9px] uppercase tracking-[0.16em] border transition-colors duration-200${sculptureCat === id ? " pill-active" : ""}`}
                style={{ background: "transparent", borderColor: sculptureCat === id ? "#9e7134" : "rgba(242,240,233,0.35)", color: sculptureCat === id ? "#f2f0e9" : "rgba(242,240,233,0.88)", whiteSpace: "nowrap" }}>
                {label}
              </button>
            ))}
          </div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10" style={{ background: "linear-gradient(to right, transparent, #0a0a0a)" }} />
        </div>
      )}
      </div>

      {/* Series tabs — hidden while searching or in sculpture view */}
      {!searchQuery && categoryFilter !== "sculpture" && (
        <div className="flex-shrink-0 border-b border-white/8 px-5 py-2" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Row 1 — Edition pills, centred on one line */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "nowrap", overflowX: "auto", scrollbarWidth: "none" }}>
            <button onClick={() => { setTab("all"); setDrilledSeries(null); }}
              className={`pill-trace flex-shrink-0 px-4 py-1.5 rounded-full font-detail text-[9px] uppercase tracking-[0.16em] border transition-all duration-200${isAll ? " pill-active" : ""}`}
              style={{ background: "transparent", borderColor: isAll ? "#9e7134" : "rgba(242,240,233,0.35)", color: isAll ? "#f2f0e9" : "rgba(242,240,233,0.88)", whiteSpace: "nowrap" }}>
              All
            </button>
            {filteredSeries.map((s) => {
              const isActive = tab === s.id || drilledSeries?.id === s.id;
              return (
                <button key={s.id} onClick={() => { setTab(s.id); setDrilledSeries(s); }}
                  className={`pill-trace flex-shrink-0 px-4 py-1.5 rounded-full font-detail text-[9px] uppercase tracking-[0.16em] border transition-colors duration-200${isActive ? " pill-active" : ""}`}
                  style={{ background: "transparent", borderColor: isActive ? "#9e7134" : "rgba(242,240,233,0.35)", color: isActive ? "#f2f0e9" : "rgba(242,240,233,0.88)", whiteSpace: "nowrap" }}>
                  {s.label}
                </button>
              );
            })}
          </div>
          {/* Row 2 — Slideshow / Stop, centred below */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            {isAll && (
              <button onClick={startSlideshow}
                className="flex items-center gap-1.5 pill-trace px-3 py-1 rounded-full border font-detail text-[9px] uppercase tracking-[0.18em] transition-colors duration-200"
                style={{ borderColor: "rgba(242,240,233,0.25)", color: "rgba(242,240,233,0.65)", background: "transparent" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#9e7134"; e.currentTarget.style.color = "#f2f0e9"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(242,240,233,0.25)"; e.currentTarget.style.color = "rgba(242,240,233,0.65)"; }}
              >
                <Play size={8} />
                Slideshow
              </button>
            )}
            {!isAll && slideshowActive && (
              <button onClick={stopSlideshow}
                className="flex items-center gap-1.5 pill-trace px-3 py-1 rounded-full border font-detail text-[9px] uppercase tracking-[0.18em] transition-colors duration-200"
                style={{ borderColor: "rgba(158,113,52,0.6)", color: "#9e7134", background: "transparent" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#9e7134"; e.currentTarget.style.color = "#f2f0e9"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(158,113,52,0.6)"; e.currentTarget.style.color = "#9e7134"; }}
              >
                <Pause size={8} />
                Stop
              </button>
            )}
          </div>
        </div>
      )}

      {/* Search results */}
      {searchQuery && (() => {
        const q = searchQuery.trim().toLowerCase();
        const results = filteredSeries.flatMap(s => s.items.filter(it => it.name.toLowerCase().includes(q)).map(it => ({ ...it, _seriesId: s.id, _seriesLabel: s.label })));
        return (
          <div className="flex-1 overflow-y-auto px-10 md:px-20 py-4" data-lenis-prevent>
            {results.length === 0
              ? <p className="font-detail text-cream/30 text-xs uppercase tracking-[0.2em] text-center mt-10">No results</p>
              : <div className="flex flex-wrap justify-center gap-2">
                  {results.map((it, i) => {
                    const sIdx = filteredSeries.findIndex(s => s.id === it._seriesId);
                    const iIdx = (() => { const ser = filteredSeries[sIdx]; if (!ser) return 0; let i = ser.items.findIndex(x => x.img === it.img || (x.slides && x.slides.includes(it.img))); return i === -1 ? Math.max(0, ser.items.findIndex(x => x.name === it.name)) : i; })();
                    return (
                      <div key={i} onClick={() => { setSearchQuery(""); jumpToItem(it._seriesId, iIdx, 0); }}
                        className="group cursor-pointer relative aspect-square rounded-lg overflow-hidden border border-white/8 transition-all duration-200"
                        style={{ width: "calc(10% - 8px)", minWidth: 80, opacity: 0, animation: "fadeIn 0.4s ease forwards", animationDelay: `${(i * 0.04).toFixed(2)}s` }}>
                        <img src={it.img} alt={it.name} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-1.5">
                          <p className="font-detail text-[9px] font-semibold uppercase tracking-wide text-cream leading-tight">{it.name}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
            }
          </div>
        );
      })()}

      {/* ALL view — grid of all thumbs */}
      {!searchQuery && isAll && (
        <div className="flex-1 overflow-y-auto px-10 md:px-20 py-4" data-lenis-prevent>
          <div className="flex flex-wrap justify-center gap-2">
            {filteredAllItems.map((it, i) => {
              const sIdx = filteredSeries.findIndex(s => s.id === it._seriesId);
              const iIdx = (() => { const ser = filteredSeries[sIdx]; if (!ser) return 0; let i = ser.items.findIndex(x => x.img === it.img || (x.slides && x.slides.includes(it.img))); return i === -1 ? Math.max(0, ser.items.findIndex(x => x.name === it.name)) : i; })();
              const delay = (((i * 0.618) % 1) * 2.2).toFixed(2);
              return (
                <div key={i} onClick={() => { const s = filteredSeries.find(s => s.id === it._seriesId); if (s) { setDrilledSeries(s); setTab(it._seriesId); setCardIdx(iIdx); setSlideIdx(it._slideIdx ?? 0); } }}
                  className="group cursor-pointer relative aspect-square rounded-lg overflow-hidden border border-white/8 group-hover:border-clay/50 transition-all duration-200"
                  style={{ width: "calc(10% - 8px)", minWidth: 80, opacity: 0, animation: `fadeIn 0.6s ease forwards`, animationDelay: `${delay}s` }}>
                  <img src={it.img} alt={it.name} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none flex items-end p-1.5">
                    <p className="font-detail text-[9px] font-semibold uppercase tracking-wide text-cream leading-tight">{it.name}</p>
                  </div>
                  {/* Details pill */}
                  <button
                    onClick={(e) => { e.stopPropagation(); jumpToItem(it._seriesId, iIdx, it._slideIdx ?? 0, true); }}
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-cream/80 text-[8px] font-detail tracking-widest uppercase opacity-0 group-hover:opacity-100 hover:bg-clay hover:border-clay hover:text-cream transition-all duration-200 whitespace-nowrap"
                  >
                    details
                  </button>
                  {/* Expand image */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setDetailZoom(it.img); }}
                    className="absolute top-1.5 right-1.5 z-10 p-1 rounded-full bg-black/50 text-cream/40 hover:bg-black/80 hover:text-cream opacity-0 group-hover:opacity-100 transition-all duration-200"
                    aria-label="Expand image"
                  >
                    <Maximize2 size={9} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SERIES card view */}
      {!searchQuery && !isAll && item && (
        <>
          <div className="flex-1 flex relative overflow-hidden min-h-0">
            {/* Main image column */}
            <div className={`flex-1 flex flex-col items-center relative min-w-0 ${isMobile ? "justify-start pt-4" : "justify-center"}`}>
              <button onClick={() => handleArrow(-1)} className="absolute left-10 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-cream transition-colors" style={{ fontSize: 20 }}>‹</button>

              {/* Card image */}
              <div style={{ transition: "opacity 0.7s ease", opacity: animDir ? 0 : 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: isMobile ? "16px 20px" : "16px 64px", width: "100%" }}>
                <img src={displayImg} alt={item.name}
                  style={{ maxHeight: "68vh", maxWidth: "100%", objectFit: "contain", borderRadius: 12, boxShadow: "0 20px 56px rgba(0,0,0,0.7)", transition: "opacity 0.7s ease" }} />
                {/* Title + Details directly under image */}
                <div className="flex items-center gap-4">
                  <p className="font-heading font-semibold text-base text-cream/90 tracking-wide">{item.name}</p>
                  <button onClick={() => setShowDetails(d => !d)}
                    className={`pill-trace font-detail text-[9px] uppercase tracking-[0.18em] px-3 py-1 rounded-full border transition-colors duration-200${showDetails ? " pill-active" : ""}`}
                    style={{ borderColor: showDetails ? "#9e7134" : "rgba(242,240,233,0.25)", color: showDetails ? "#9e7134" : "rgba(242,240,233,0.6)", background: "transparent" }}>
                    {showDetails ? "Close" : "Details"}
                  </button>
                </div>
              </div>

              <button onClick={() => handleArrow(1)} className="absolute right-10 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-cream transition-colors" style={{ fontSize: 20 }}>›</button>
            </div>

            {/* Details panel — slides in from right; overlay on mobile */}
            <div style={isMobile
              ? { position: "absolute", right: 0, top: 0, width: showDetails ? "100%" : 0, height: "100%", overflow: "hidden", zIndex: 20, transition: "width 0.28s ease", background: "rgba(18,18,18,0.98)" }
              : { width: showDetails ? 260 : 0, minWidth: 0, overflow: "hidden", transition: "width 0.28s ease", flexShrink: 0, borderLeft: showDetails ? "1px solid rgba(242,240,233,0.12)" : "none", background: "rgba(255,255,255,0.03)" }
            }>
              <div style={{ width: isMobile ? "100%" : 260, padding: isMobile ? "20px 16px" : "28px 22px", display: "flex", flexDirection: "column", gap: 18, height: "100%", overflowY: "auto" }}>
                <div>
                  <p className="font-detail text-[10px] uppercase tracking-[0.2em] mb-1.5" style={{ color: "rgba(242,240,233,0.5)" }}>{series?.label}</p>
                  <p className="font-heading font-semibold text-lg text-cream leading-snug">{item.name}</p>
                </div>
                {sizes.length > 0 && (
                  <div className="flex flex-col gap-3 border-t pt-4" style={{ borderColor: "rgba(242,240,233,0.12)" }}>
                    <p className="font-detail text-[10px] uppercase tracking-[0.16em]" style={{ color: "rgba(242,240,233,0.5)" }}>Sizes</p>
                    {sizes.map(t => (
                      <div key={t.id} className="flex flex-col gap-0.5">
                        {t.label !== "Standard" && <span className="font-detail text-[10px] uppercase tracking-wider" style={{ color: "#9e7134" }}>{t.label}</span>}
                        <span className="font-detail text-sm" style={{ color: "rgba(242,240,233,0.9)" }}>{t.dims}</span>
                        {t.fixings != null && t.fixings !== 0 && <span className="font-detail text-[10px]" style={{ color: "rgba(242,240,233,0.45)" }}>{t.fixings} fixings</span>}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-col gap-3 border-t pt-4" style={{ borderColor: "rgba(242,240,233,0.12)" }}>
                  <p className="font-detail text-[10px] uppercase tracking-[0.16em]" style={{ color: "rgba(242,240,233,0.5)" }}>Materials</p>
                  {(!item.materials || item.materials.includes("aluminium")) && (
                    <div className="flex items-center gap-2.5">
                      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#111", flexShrink: 0, border: "1px solid rgba(242,240,233,0.25)" }} />
                      <span className="font-detail text-sm" style={{ color: "rgba(242,240,233,0.85)" }}>Aluminium / Powder Coated</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5">
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#7a3520", flexShrink: 0 }} />
                    <span className="font-detail text-sm" style={{ color: "rgba(242,240,233,0.85)" }}>Corten / Rusting Steel</span>
                  </div>
                </div>
                {/* Pricing */}
                <div className="border-t pt-4" style={{ borderColor: "rgba(242,240,233,0.12)" }}>
                  {!showPricing ? (
                    <button onClick={() => {
                      setShowPricing(true);
                      if (!postcodeInfo?.isAdmin) trackEvent({ type: "view_pricing", item: item.name, series: series?.label });
                    }}
                      className="w-full py-2.5 rounded-xl font-detail text-[10px] uppercase tracking-[0.2em] transition-all duration-200"
                      style={{ background: "rgba(158,113,52,0.15)", border: "1px solid rgba(158,113,52,0.4)", color: "#9e7134" }}>
                      View Pricing
                    </button>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <p className="font-detail text-[10px] uppercase tracking-[0.16em]" style={{ color: "rgba(242,240,233,0.5)" }}>Pricing</p>
                      {!postcodeInfo ? (
                        postcodeStep ? (
                          <div className="flex flex-col gap-2">
                            <p className="font-detail text-xs" style={{ color: "rgba(242,240,233,0.7)" }}>Enter your postcode for delivery pricing:</p>
                            <input
                              value={postcodeInput}
                              onChange={e => setPostcodeInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
                              placeholder="e.g. 6000"
                              className="w-full bg-transparent rounded-lg px-3 py-2 font-mono text-sm text-cream outline-none"
                              style={{ border: "1px solid rgba(242,240,233,0.2)" }}
                              maxLength={4}
                              onKeyDown={e => {
                                if (e.key === "Enter" && postcodeInput.length === 4) {
                                  const isAdmin = postcodeInput === ADMIN_CODE;
                                  const isWA = checkWA(postcodeInput);
                                  const state = isAdmin ? null : getState(postcodeInput);
                                  const info = { postcode: postcodeInput, isWA, isAdmin, state };
                                  savePostcode(info);
                                  setPostcodeInfo(info);
                                  setPostcodeStep(false);
                                  if (!isAdmin) trackEvent({ type: "postcode", postcode: postcodeInput, state, isWA });
                                }
                              }}
                            />
                            <button
                              onClick={() => {
                                if (postcodeInput.length < 4) return;
                                const isAdmin = postcodeInput === ADMIN_CODE;
                                const isWA = checkWA(postcodeInput);
                                const state = isAdmin ? null : getState(postcodeInput);
                                const info = { postcode: postcodeInput, isWA, isAdmin, state };
                                savePostcode(info);
                                setPostcodeInfo(info);
                                setPostcodeStep(false);
                                if (!isAdmin) trackEvent({ type: "postcode", postcode: postcodeInput, state, isWA });
                              }}
                              className="w-full py-2 rounded-lg font-detail text-[10px] uppercase tracking-[0.18em] transition-all"
                              style={{ background: postcodeInput.length === 4 ? "#9e7134" : "rgba(242,240,233,0.08)", color: postcodeInput.length === 4 ? "#f2f0e9" : "rgba(242,240,233,0.3)", border: "none" }}>
                              Confirm
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setPostcodeStep(true)}
                            className="w-full py-2 rounded-lg font-detail text-[10px] uppercase tracking-[0.18em] transition-all"
                            style={{ background: "rgba(242,240,233,0.06)", border: "1px solid rgba(242,240,233,0.15)", color: "rgba(242,240,233,0.7)" }}>
                            Enter postcode to see prices
                          </button>
                        )
                      ) : (
                        <div className="flex flex-col gap-2">
                          {/* Material selector */}
                          <div className="flex gap-2">
                            {["aluminium", "corten"].filter(m => !item.materials || item.materials.includes(m)).map(m => (
                              <button key={m} onClick={() => setSelectedMat(m)}
                                className="flex-1 py-1.5 rounded-lg font-detail text-[9px] uppercase tracking-wider transition-all"
                                style={{ background: selectedMat === m ? "rgba(255,220,50,0.15)" : "transparent", border: `1px solid ${selectedMat === m ? "#ffd700" : "rgba(242,240,233,0.15)"}`, color: selectedMat === m ? "#ffd700" : "rgba(242,240,233,0.75)" }}>
                                {m === "aluminium" ? "Powder Coated" : "Corten"}
                              </button>
                            ))}
                          </div>
                          {/* Price list */}
                          {sizes.length > 0 ? sizes.map(t => {
                            const isCorten = selectedMat === "corten";
                            let p;
                            if (postcodeInfo.isWA) {
                              p = isCorten ? (t.priceCorten ?? null) : (t.price ?? null);
                            } else {
                              p = isCorten ? (t.priceCortenPC ?? null) : (t.pricePC ?? null);
                            }
                            const sizeLabel = t.label !== "Standard" ? t.label : t.dims;
                            const isSelected = selectedSize?.id === t.id;
                            return (
                              <button key={t.id} onClick={() => setSelectedSize(t)}
                                className="w-full flex justify-between items-center px-3 py-2 rounded-lg transition-all duration-150"
                                style={{ background: isSelected ? "rgba(158,113,52,0.15)" : "transparent", border: `1px solid ${isSelected ? "#9e7134" : "rgba(242,240,233,0.1)"}`, cursor: "pointer" }}>
                                <span className="font-detail text-xs text-left" style={{ color: isSelected ? "#f2f0e9" : "rgba(242,240,233,0.7)" }}>{sizeLabel}</span>
                                <span className="font-heading font-semibold text-sm" style={{ color: isSelected ? "#f2f0e9" : "rgba(242,240,233,0.7)" }}>
                                  {p != null ? `$${p.toLocaleString()}` : "Enquire"}
                                </span>
                              </button>
                            );
                          }) : (
                            <p className="font-detail text-xs" style={{ color: "rgba(242,240,233,0.4)" }}>Pricing on enquiry</p>
                          )}
                          {!selectedSize && sizes.length > 0 && (
                            <p className="font-detail text-xs" style={{ color: "rgba(242,240,233,0.4)" }}>Select a size above</p>
                          )}
                          {/* Fixings & shipping note */}
                          <p className="font-detail text-xs mt-1" style={{ color: "rgba(242,240,233,0.6)", lineHeight: 1.5 }}>
                            Fixings &amp; shipping additional
                          </p>
                          {/* Add to Quote */}
                          {item && (() => {
                            const isCorten = selectedMat === "corten";
                            const t = selectedSize;
                            let p = null;
                            if (t) {
                              if (postcodeInfo.isWA) {
                                p = isCorten ? (t.priceCorten ?? null) : (t.price ?? null);
                              } else {
                                p = isCorten ? (t.priceCortenPC ?? null) : (t.pricePC ?? null);
                              }
                            }
                            const canAdd = !!selectedSize;
                            return (
                              <button
                                onClick={() => {
                                  if (!canAdd) return;
                                  window.dispatchEvent(new CustomEvent("quote-add", { detail: {
                                    name: item.name,
                                    img: displayImg,
                                    material: MATERIAL_OPTIONS.find(m => m.id === selectedMat),
                                    size: selectedSize,
                                    price: p,
                                  }}));
                                  if (!postcodeInfo?.isAdmin) {
                                    trackEvent({
                                      type: "add_to_quote",
                                      item: item.name,
                                      series: series?.label,
                                      material: selectedMat,
                                      size: selectedSize?.label !== "Standard" ? selectedSize?.label : selectedSize?.dims,
                                      price: p,
                                      postcode: postcodeInfo?.postcode,
                                      state: postcodeInfo?.state,
                                      isWA: postcodeInfo?.isWA,
                                    });
                                  }
                                }}
                                className="w-full py-2.5 rounded-xl font-detail text-[10px] uppercase tracking-[0.2em] transition-all duration-200 mt-1"
                                style={{
                                  background: canAdd ? "rgba(158,113,52,0.15)" : "rgba(242,240,233,0.04)",
                                  border: `1px solid ${canAdd ? "rgba(158,113,52,0.4)" : "rgba(242,240,233,0.1)"}`,
                                  color: canAdd ? "#9e7134" : "rgba(242,240,233,0.25)",
                                  cursor: canAdd ? "pointer" : "default",
                                }}>
                                Add to Quote
                              </button>
                            );
                          })()}
                          {/* Admin only: reset postcode */}
                          {postcodeInfo.isAdmin && (
                            <button onClick={() => { setPostcodeInfo(null); setPostcodeInput(""); savePostcode(null); setPostcodeStep(false); }}
                              className="font-detail text-[9px] uppercase tracking-wider mt-1 text-left"
                              style={{ color: "rgba(242,240,233,0.25)", background: "none", border: "none", cursor: "pointer" }}>
                              Reset
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Thumbs — one per slide across all items */}
          <div className="flex-shrink-0 border-t border-white/10">
            <div className="flex items-center gap-1.5 px-5 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {(() => {
                const allThumbs = items.flatMap((it, iIdx) => {
                  const imgs = (it.slides && it.slides.length > 1) ? it.slides : [it.img];
                  const thumbs = imgs.map((img, sIdx) => {
                    const isActive = iIdx === cardIdx && sIdx === slideIdx;
                    return (
                      <div key={`${iIdx}-${sIdx}`}
                        onClick={() => { setCardIdx(iIdx); setSlideIdx(sIdx); setShowDetails(false); }}
                        className="flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                        style={{ width: 52, height: 52, border: `1.5px solid ${isActive ? "#9e7134" : "transparent"}`, opacity: isActive ? 1 : iIdx === cardIdx ? 0.75 : 0.45, transition: "all 0.2s" }}>
                        <img src={img} alt={it.name} className="w-full h-full object-cover" />
                      </div>
                    );
                  });
                  if (iIdx > 0) {
                    thumbs.unshift(
                      <div key={`sep-${iIdx}`} style={{ width: 1, height: 34, background: "rgba(242,240,233,0.12)", flexShrink: 0, borderRadius: 1, margin: "0 3px" }} />
                    );
                  }
                  return thumbs;
                });
                // Append detail slides for any item at the very end
                items.forEach((it, iIdx) => {
                  if (it.detailSlides && it.detailSlides.length > 0) {
                    allThumbs.push(
                      <div key={`detail-sep-${iIdx}`} style={{ width: 1, height: 34, background: "rgba(242,240,233,0.15)", flexShrink: 0, borderRadius: 1, margin: "0 3px" }} />
                    );
                    it.detailSlides.forEach((img, dIdx) => {
                      allThumbs.push(
                        <div key={`${iIdx}-d${dIdx}`}
                          onClick={() => { setCardIdx(iIdx); setDetailZoom(img); }}
                          className="flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                          style={{ width: 52, height: 52, border: "1.5px solid transparent", opacity: 0.6, transition: "all 0.2s" }}>
                          <img src={img} alt={`${it.name} detail`} className="w-full h-full object-cover" />
                        </div>
                      );
                    });
                  }
                });
                return allThumbs;
              })()}
              {/* Placeholder slot for future illustration card */}
              <div key="placeholder" style={{ width: 1, height: 34, background: "rgba(242,240,233,0.12)", flexShrink: 0, borderRadius: 1, margin: "0 3px" }} />
              <div style={{ width: 52, height: 52, flexShrink: 0, borderRadius: 8, border: "1px dashed rgba(242,240,233,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.2 }}>
                  <path d="M8 1C8 1 5 4 5 7.5C5 9.43 6.34 11 8 11C9.66 11 11 9.43 11 7.5C11 4 8 1 8 1Z" stroke="#f2f0e9" strokeWidth="1" fill="none"/>
                  <path d="M8 11V15M6 13H10" stroke="#f2f0e9" strokeWidth="1" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Drill-in: series thumb view — shown after clicking a design in ALL view */}
      {drilledSeries && (
        <div className="absolute inset-0 z-[10002] bg-jet flex flex-col">
          <div className="flex flex-col border-b border-white/10 flex-shrink-0">
            <div className="flex items-center px-5 py-3 gap-3">
              <button onClick={() => setDrilledSeries(null)} className="group flex items-center gap-2.5 transition-colors duration-200">
                <span
                  className="flex items-center justify-center rounded-full border font-detail text-[8px] uppercase tracking-[0.14em] transition-all duration-200"
                  style={{ width: 30, height: 30, flexShrink: 0, borderColor: "rgba(242,240,233,0.3)", background: "transparent", color: "rgba(242,240,233,0.6)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#9e7134"; e.currentTarget.style.borderColor = "#9e7134"; e.currentTarget.style.color = "#f2f0e9"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(242,240,233,0.3)"; e.currentTarget.style.color = "rgba(242,240,233,0.6)"; }}
                >✦</span>
                <span className="font-detail text-[9px] uppercase tracking-[0.18em]" style={{ color: "rgba(242,240,233,0.75)" }}>All</span>
              </button>
              <div className="flex-1 text-center">
                <p className="font-heading font-bold text-sm text-cream tracking-wide">{drilledSeries.label}</p>
              </div>
              <button onClick={() => setDrilledSeries(null)} className="text-cream/40 hover:text-cream transition-colors"><X size={15} /></button>
            </div>
            <div className="flex flex-wrap gap-2 px-5 pb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {filteredSeries.map((s) => (
                <button key={s.id} onClick={() => setDrilledSeries(s)}
                  className="flex-shrink-0 px-4 py-1.5 rounded-full font-detail text-[9px] uppercase tracking-[0.16em] border transition-colors duration-200"
                  style={{ borderColor: drilledSeries.id === s.id ? "#9e7134" : "rgba(242,240,233,0.25)", color: drilledSeries.id === s.id ? "#f2f0e9" : "rgba(242,240,233,0.7)", background: "transparent", whiteSpace: "nowrap" }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-10 md:px-20 py-4" data-lenis-prevent>
            <div className="flex flex-wrap justify-center gap-2">
              {drilledSeries.items.flatMap((it, designIdx) => {
                const slides = (it.slides && it.slides.length > 1) ? it.slides : [it.img];
                return slides.map((img, sIdx) => ({ img, name: it.name, designIdx, sIdx }));
              }).map((thumb, i) => (
                <div key={i} onClick={() => { openSeries(drilledSeries.id, thumb.designIdx, thumb.sIdx); setDrilledSeries(null); }}
                  className="group cursor-pointer relative aspect-square rounded-lg overflow-hidden border border-white/8 hover:border-clay/50 transition-all duration-200"
                  style={{ width: "calc(10% - 8px)", minWidth: 80, opacity: 0, animation: "fadeIn 0.5s ease forwards", animationDelay: `${i * 0.06}s` }}>
                  <img src={thumb.img} alt={thumb.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-1.5 pointer-events-none">
                    <p className="font-detail text-[9px] font-semibold uppercase tracking-wide text-cream leading-tight">{thumb.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detail image zoom overlay */}
      {detailZoom && (
        <div className="fixed inset-0 z-[10004] flex items-center justify-center bg-black/90" onClick={() => setDetailZoom(null)}>
          <img src={detailZoom} alt="detail" className="max-w-[88vw] max-h-[88vh] rounded-2xl object-contain" />
        </div>
      )}

      {/* About the Collection popup */}
      {collectionInfoOpen && (
        <div onClick={() => setCollectionInfoOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 10005, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#1A1A1A", border: "1px solid rgba(242,240,233,0.08)", borderRadius: 16, maxWidth: 640, width: "100%", maxHeight: "85vh", overflowY: "auto", scrollbarWidth: "none", padding: "48px 52px", position: "relative", textAlign: "center" }}>
            <button onClick={() => setCollectionInfoOpen(false)} style={{ position: "absolute", top: 18, right: 20, background: "none", border: "none", color: "rgba(242,240,233,0.4)", cursor: "pointer", fontSize: 20, lineHeight: 1 }}>✕</button>
            <p style={{ fontFamily: "var(--font-detail)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#9E7134", margin: "0 0 12px" }}>Wall Art</p>
            <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(20px,3vw,30px)", color: "#F2F0E9", margin: "0 0 36px", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1.15 }}>The Collection</p>
            <p style={{ fontFamily: "var(--font-detail)", fontSize: 15, color: "rgba(242,240,233,0.7)", lineHeight: 1.85, margin: "0 0 24px" }}>
              The Wall Art Collection is a curated gallery of freeform designs, each conceived as a standalone artwork — created for architectural, interior, and landscape settings. Colour finishes and material options tailor each piece to its space.
            </p>
            <p style={{ fontFamily: "var(--font-detail)", fontSize: 13, color: "rgba(242,240,233,0.75)", lineHeight: 1.7, margin: 0 }}>
              Click "Details" for size options and pricing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
function BrowseCollectionLabel({ setCardDeckOpen, setSelectedCategory, setCategoryClicked, selectedCategory, categoryClicked, inSection, setSculpOpen, setScreensOpen }) {
  const [hovered, setHovered] = useState(false);
  const browseColor = hovered
    ? "rgba(242,240,233,0.95)"
    : inSection
      ? "rgba(242,240,233,0.75)"
      : "rgba(242,240,233,0.35)";
  const dotBg     = inSection ? "#9e7134" : "transparent";
  const dotBorder = inSection ? "#9e7134" : "rgba(242,240,233,0.35)";

  const GoldDot = () => (
    <span style={{ position: "relative", width: 5, height: 5, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: dotBg, border: `1px solid ${dotBorder}`, display: "block", transition: "background 0.4s, border-color 0.4s", flexShrink: 0 }} />
      {inSection && (
        <span style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)", width: 5, height: 5,
          borderRadius: "50%", border: "0.5px solid #9e7134",
          animation: "bcl-ripple 2.4s ease-out infinite", pointerEvents: "none",
        }} />
      )}
      <style>{`@keyframes bcl-ripple { 0% { transform: translate(-50%,-50%) scale(1); opacity: 0.7; } 100% { transform: translate(-50%,-50%) scale(8); opacity: 0; } }`}</style>
    </span>
  );

  const pills = [
    { id: "sculpture", label: "Sculpture", onOpen: () => setSculpOpen(true) },
    { id: "wall-art",  label: "Wall Art",  onOpen: () => { setSelectedCategory("wall-art"); setCategoryClicked(true); setCardDeckOpen(true); } },
    { id: "screens",   label: "Screens",   onOpen: () => setScreensOpen(true) },
  ];

  return (
    <>
      <span
        className="font-detail text-[9px] uppercase tracking-[0.25em] transition-colors duration-300"
        style={{ color: browseColor, cursor: "default", userSelect: "none" }}
      >
        Browse Collection
      </span>
      {/* 3-col grid: Wall Art locked to centre column, Screens/Sculpture in equal outer columns */}
      {/* 5-col grid: 1fr | dot | Wall Art | dot | 1fr — dots are each in their own column so gap is identical on both sides */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto 1fr", alignItems: "center", columnGap: "16px", width: "100%" }}>
        {/* Col 1 — Screens, flush right */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {(() => { const { id, label, onOpen } = pills[0]; const isActive = categoryClicked && selectedCategory === id; return (
            <button onClick={onOpen}
              onMouseEnter={e => { setHovered(true); if (!isActive) { e.currentTarget.style.borderColor = "#9e7134"; e.currentTarget.style.color = "#f2f0e9"; }}}
              onMouseLeave={e => { setHovered(false); if (!isActive) { e.currentTarget.style.borderColor = "rgba(242,240,233,0.3)"; e.currentTarget.style.color = "rgba(242,240,233,0.85)"; }}}
              className="pill-trace font-detail text-[10px] uppercase tracking-[0.22em] px-4 py-1.5 rounded-full border bg-transparent transition-colors duration-300"
              style={{ borderColor: isActive ? "#9e7134" : "rgba(242,240,233,0.3)", color: isActive ? "#f2f0e9" : "rgba(242,240,233,0.85)", cursor: "pointer", boxShadow: isActive ? "none" : "0 0 0 1px rgba(242,240,233,0.18)" }}>
              {label}
            </button>
          ); })()}
        </div>
        {/* Col 2 — left dot */}
        <GoldDot />
        {/* Col 3 — Wall Art, centred */}
        {(() => { const { id, label, onOpen } = pills[1]; const isActive = categoryClicked && selectedCategory === id; return (
          <button onClick={onOpen}
            onMouseEnter={e => { setHovered(true); if (!isActive) { e.currentTarget.style.borderColor = "#9e7134"; e.currentTarget.style.color = "#f2f0e9"; }}}
            onMouseLeave={e => { setHovered(false); if (!isActive) { e.currentTarget.style.borderColor = "rgba(242,240,233,0.3)"; e.currentTarget.style.color = "rgba(242,240,233,0.85)"; }}}
            className="pill-trace font-detail text-[10px] uppercase tracking-[0.22em] px-4 py-1.5 rounded-full border bg-transparent transition-colors duration-300"
            style={{ borderColor: isActive ? "#9e7134" : "rgba(242,240,233,0.3)", color: isActive ? "#f2f0e9" : "rgba(242,240,233,0.85)", cursor: "pointer", boxShadow: isActive ? "none" : "0 0 0 1px rgba(242,240,233,0.18)" }}>
            {label}
          </button>
        ); })()}
        {/* Col 4 — right dot */}
        <GoldDot />
        {/* Col 5 — Sculpture, flush left */}
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          {(() => { const { id, label, onOpen } = pills[2]; const isActive = categoryClicked && selectedCategory === id; return (
            <button onClick={onOpen}
              onMouseEnter={e => { setHovered(true); if (!isActive) { e.currentTarget.style.borderColor = "#9e7134"; e.currentTarget.style.color = "#f2f0e9"; }}}
              onMouseLeave={e => { setHovered(false); if (!isActive) { e.currentTarget.style.borderColor = "rgba(242,240,233,0.3)"; e.currentTarget.style.color = "rgba(242,240,233,0.85)"; }}}
              className="pill-trace font-detail text-[10px] uppercase tracking-[0.22em] px-4 py-1.5 rounded-full border bg-transparent transition-colors duration-300"
              style={{ borderColor: isActive ? "#9e7134" : "rgba(242,240,233,0.3)", color: isActive ? "#f2f0e9" : "rgba(242,240,233,0.85)", cursor: "pointer", boxShadow: isActive ? "none" : "0 0 0 1px rgba(242,240,233,0.18)" }}>
              {label}
            </button>
          ); })()}
        </div>
      </div>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────────

export default function Gallery() {
  const [catFlipOpen, setCatFlipOpen] = useState(false);
  const [catFlipTab, setCatFlipTab] = useState("wall-art");
  const [cardDeckOpen, setCardDeckOpen] = useState(false);
  const [sculpOpen, setSculpOpen] = useState(false);
  const [screensOpen, setScreensOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("wall-art");
  const [categoryClicked, setCategoryClicked] = useState(false);
  const [inSection, setInSection] = useState(false);
  const [stripPaused, _setStripPaused] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768);
  const sectionRef      = useRef(null);
  const gateLeftRef     = useRef(null);
  const gateRightRef    = useRef(null);
  const stripAreaRef    = useRef(null);
  const wallArtLabelRef = useRef(null);

  const autoStripImages = WALL_ART_SERIES
    .map(s => s.items.find(i => i.img && !i.img.includes('placeholder'))?.img)
    .filter(Boolean);
  const [stripImages] = useState(() => {
    const arr = [
      ...autoStripImages.slice(0, 2),
      "/images/marakesh/marakesh-promo.jpg",
      "/images/marakesh/marakesh-1.jpg",
      ...autoStripImages.slice(2),
      "/images/autumn-leaf/leafs-wg-a.jpg",
      "/images/villa-leaf/villa-leaf-trio-pool.jpg",
    ];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  const half = Math.ceil(stripImages.length / 2);
  const leftImages  = stripImages.slice(0, half);
  const rightImages = stripImages.slice(half);
  const leftDup  = [...leftImages,  ...leftImages];
  const rightDup = [...rightImages, ...rightImages];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gallery-strip-label", {
        scrollTrigger: { trigger: ".gallery-strip-label", start: "top 90%", toggleActions: "play none none none" },
        y: 20, opacity: 0, duration: 0.7, ease: "power3.out",
      });

      // Gate reveal — two black panels slide outward from centre
      const tl = gsap.timeline({
        delay: 0,
        scrollTrigger: {
          trigger: stripAreaRef.current,
          start: "top bottom",
          toggleActions: "play none none none",
        },
      });
      tl.to(gateLeftRef.current,  { x: "-100%", duration: 8, ease: "none" }, 0);
      tl.to(gateRightRef.current, { x: "100%",  duration: 8, ease: "none" }, 0);

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setInSection(entry.isIntersecting), { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Only one of the desktop/mobile strip layouts is mounted at a time —
  // both used to render simultaneously (just CSS-hidden), which meant two
  // <video> elements were autoplaying the reels portal at once and mobile
  // browsers would silently drop the visible one in favour of the hidden one.
  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Deep-link handler — ?view=wallart / sculpture / wallartcat / sculpturecat
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get("view");
    if (!view) return;
    // Clean URL without reload
    const clean = window.location.pathname + window.location.hash;
    window.history.replaceState(null, "", clean);
    const timer = setTimeout(() => {
      if (view === "wallart") {
        setSelectedCategory("wall-art"); setCategoryClicked(true); setCardDeckOpen(true);
        sectionRef.current?.scrollIntoView({ behavior: "smooth" });
      } else if (view === "sculpture") {
        setSelectedCategory("sculpture"); setCategoryClicked(true); setCardDeckOpen(true);
        sectionRef.current?.scrollIntoView({ behavior: "smooth" });
      } else if (view === "wallartcat") {
        setCatFlipTab("wall-art"); setCatFlipOpen(true);
        sectionRef.current?.scrollIntoView({ behavior: "smooth" });
      } else if (view === "sculpturecat") {
        setCatFlipTab("sculpture"); setCatFlipOpen(true);
        sectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Navbar's Collection dropdown/submenu dispatches this to actually open
  // the catalogue overlay for the chosen category — scrolling to
  // #collection alone only reveals the static strip section.
  useEffect(() => {
    const handler = (e) => {
      const cat = e.detail;
      if (cat === "wall-art") { setSelectedCategory("wall-art"); setCategoryClicked(true); setCardDeckOpen(true); }
      else if (cat === "sculpture") { setSculpOpen(true); }
      else if (cat === "screens") { setScreensOpen(true); }
    };
    window.addEventListener("open-collection-category", handler);
    return () => window.removeEventListener("open-collection-category", handler);
  }, []);

  return (
    <>
      {cardDeckOpen && <CardDeckOverlay onClose={() => { setCardDeckOpen(false); setCategoryClicked(false); }} categoryFilter={selectedCategory} onOpenCatalogue={(tab) => { setCatFlipOpen(true); setCatFlipTab(tab || selectedCategory); }} onSwitchCategory={(cat) => { setSelectedCategory(cat); setCategoryClicked(true); }} />}
      <section id="collection" ref={sectionRef} className="bg-ink pt-32 pb-20">

        {/* Label row */}
        <div className="gallery-strip-label max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-16 text-center">
          <span className="font-detail text-xs text-cream/60 uppercase tracking-[0.2em]">The Collection</span>
          <h2 className="font-syne font-bold text-2xl md:text-4xl lg:text-5xl text-cream/60 tracking-tight mt-4">
            Catalogued <span className="text-cream/60">Creations</span>
          </h2>
          {/* Browse Collection + Wall Art / Sculpture */}
          <div ref={wallArtLabelRef} className="flex flex-col items-center gap-3 mt-6">
            {/* Browse Collection label — lights up on hover of either option */}
            <BrowseCollectionLabel setCardDeckOpen={setCardDeckOpen} setSelectedCategory={setSelectedCategory} setCategoryClicked={setCategoryClicked} selectedCategory={selectedCategory} categoryClicked={categoryClicked} inSection={inSection} setSculpOpen={setSculpOpen} setScreensOpen={setScreensOpen} />
          </div>
        </div>

        {/* ── Desktop: converging strips ──────────────────── */}
        {isDesktop && (
        <div className="flex flex-col items-center">
          {/* Faint rule above strip */}
          <div className="w-full h-px bg-white/20 mb-4" />

          <div ref={stripAreaRef} className="relative flex items-stretch h-52 w-full px-0 gap-0">
            {/* Gate panels — slide outward from centre on scroll into view */}
            <div ref={gateLeftRef}  className="absolute inset-y-0 left-0 w-1/2 z-20 pointer-events-none" style={{ background: "#010101" }} />
            <div ref={gateRightRef} className="absolute inset-y-0 right-0 w-1/2 z-20 pointer-events-none" style={{ background: "#010101" }} />

            {/* Left strip */}
            <div className="flex-1 overflow-hidden">
              <div className="marquee-track flex gap-3 h-full" style={{ width: "max-content", animationPlayState: stripPaused ? "paused" : "running", animationDuration: "78s" }}>
                {leftDup.map((src, i) => (
                  <div key={i} className="flex-none h-full aspect-square rounded-2xl overflow-hidden cursor-pointer" onClick={() => setCardDeckOpen(true)}>
                    <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>

            {/* Centre spacer — keeps strip images clear of the portal column */}
            <div className="flex-none" style={{ width: "338px" }} />

            {/* Right strip */}
            <div className="flex-1 overflow-hidden">
              <div className="marquee-track-right flex gap-3 h-full" style={{ width: "max-content", animationPlayState: stripPaused ? "paused" : "running", animationDuration: "78s" }}>
                {rightDup.map((src, i) => (
                  <div key={i} className="flex-none h-full aspect-square rounded-2xl overflow-hidden cursor-pointer" onClick={() => setCardDeckOpen(true)}>
                    <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Faint rule below strip */}
          <div className="w-full h-px bg-white/20 mt-4" />

          {/* All three portals in one column — equal gap guaranteed.
              Negative margin pulls Wall Art up to float in the strip centre. */}
          <div className="flex flex-col items-center gap-10 pb-16 relative z-30" style={{ marginTop: "-274px" }}>
            <ReelsPortal onOpen={() => { setSelectedCategory("wall-art"); setCardDeckOpen(true); }} />
            <MiniPortal portal={SCULPTURE_PORTAL} size={186} arcLabel="Sculpture" hideLabel hoverLabel="Sculpture" goldHover onOpen={() => setSculpOpen(true)} />
            <MiniPortal portal={SCREENS_PORTAL} size={186} arcLabel="Screens" hideLabel hoverLabel="Screens" goldHover onOpen={() => setScreensOpen(true)} />
          </div>

        </div>
        )}

        {/* ── Mobile: stacked strips + center button ──────── */}
        {!isDesktop && (
        <div className="flex flex-col">

          {/* Top strip */}
          <div className="relative h-28 overflow-hidden">
            <div className="marquee-track flex gap-2 h-full" style={{ width: "max-content", animationPlayState: stripPaused ? "paused" : "running" }}>
              {[...stripImages, ...stripImages].map((src, i) => (
                <div key={i} className="flex-none h-full aspect-square rounded-xl overflow-hidden" onClick={() => setCardDeckOpen(true)}>
                  <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-ink to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-ink to-transparent pointer-events-none" />
          </div>

          {/* All three portals in one column — equal gap guaranteed. */}
          <div className="flex flex-col items-center gap-10 py-8">
            <ReelsPortal onOpen={() => { setSelectedCategory("wall-art"); setCardDeckOpen(true); }} />
            <MiniPortal portal={SCULPTURE_PORTAL} size={186} arcLabel="Sculpture" hideLabel hoverLabel="Sculpture" goldHover onOpen={() => setSculpOpen(true)} />
            <MiniPortal portal={SCREENS_PORTAL} size={186} arcLabel="Screens" hideLabel hoverLabel="Screens" goldHover onOpen={() => setScreensOpen(true)} />
          </div>

        </div>
        )}

      </section>

      {catFlipOpen && (
        <CatPageViewer
          pages={catFlipTab === "wall-art" ? WALL_ART_CAT_PAGES : SCULPTURE_CAT_PAGES}
          label={catFlipTab === "wall-art" ? "Wall Art Catalogue" : "Sculpture Catalogue"}
          onClose={() => { setCatFlipOpen(false); setCardDeckOpen(false); }}
        />
      )}
      {sculpOpen   && <SculptureGalleryModal onClose={() => setSculpOpen(false)} />}
      {screensOpen && <ScreensGalleryModal   onClose={() => setScreensOpen(false)} />}
    </>
  );
}
