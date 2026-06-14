import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ChevronLeft, ChevronRight, X, Download,
  Lock, ArrowRight, ArrowUpRight,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const STATUS_CONFIG = {
  "Design":      { label: "In Design",    dot: "#60a5fa" },
  "In Progress": { label: "In Progress",  dot: "#f59e0b" },
  "Review":      { label: "Under Review", dot: "#a78bfa" },
  "Complete":    { label: "Complete",     dot: "#34d399" },
  "Delivered":   { label: "Delivered",    dot: "#c45018" },
};

// ── Fullscreen lightbox ──────────────────────────────────────
function Lightbox({ items, startIndex, onClose }) {
  const overlayRef = useRef(null);
  const [idx, setIdx] = useState(startIndex);
  const total = items.length;

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const close = useCallback(() => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, onComplete: onClose });
  }, [onClose]);

  const prev = useCallback(() => setIdx(i => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setIdx(i => (i + 1) % total), [total]);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [close, prev, next]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/97 backdrop-blur-xl"
      onClick={e => e.target === e.currentTarget && close()}
    >
      <button onClick={close} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/25 transition-colors z-10">
        <X size={18} />
      </button>
      {total > 1 && (
        <button onClick={prev} className="absolute left-4 md:left-8 w-11 h-11 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/25 transition-colors">
          <ChevronLeft size={22} />
        </button>
      )}
      <div className="relative max-w-5xl w-full mx-20 md:mx-28 flex flex-col items-center">
        <img
          key={idx}
          src={items[idx].url}
          alt={items[idx].name || ""}
          className="w-full max-h-[80vh] object-contain rounded-2xl"
        />
        {items[idx].name && (
          <p className="mt-5 font-detail text-xs text-cream/45 uppercase tracking-widest">
            {items[idx].name.replace(/\.[^.]+$/, "")}
          </p>
        )}
        {total > 1 && (
          <p className="font-detail text-[10px] text-cream/30 uppercase tracking-widest mt-2">
            {idx + 1} / {total}
          </p>
        )}
      </div>
      {total > 1 && (
        <button onClick={next} className="absolute right-4 md:right-8 w-11 h-11 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/25 transition-colors">
          <ChevronRight size={22} />
        </button>
      )}
    </div>
  );
}

// ── Full-screen hero with autoplay crossfade ─────────────────
function HeroSlideshow({ images, clientName, projectTitle, location }) {
  const [idx, setIdx] = useState(0);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const progressRef = useRef(null);
  const progressTlRef = useRef(null);
  const DURATION = 5.5;

  const advanceTo = useCallback((next) => {
    if (!containerRef.current) return;
    const slides = containerRef.current.querySelectorAll(".hero-slide");
    if (!slides[next]) return;

    gsap.to(slides, { opacity: 0, duration: 1.2, ease: "power2.inOut" });
    gsap.to(slides[next], { opacity: 1, duration: 1.2, ease: "power2.inOut" });
    setIdx(next);
  }, []);

  const restartProgress = useCallback(() => {
    if (!progressRef.current) return;
    progressTlRef.current?.kill();
    gsap.set(progressRef.current, { scaleX: 0 });
    progressTlRef.current = gsap.to(progressRef.current, {
      scaleX: 1, duration: DURATION, ease: "none",
    });
  }, []);

  // Initial entrance
  useEffect(() => {
    if (!containerRef.current) return;
    const slides = containerRef.current.querySelectorAll(".hero-slide");
    slides.forEach((s, i) => gsap.set(s, { opacity: i === 0 ? 1 : 0 }));

    if (titleRef.current) {
      const children = Array.from(titleRef.current.children);
      gsap.fromTo(children,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 1.1, delay: 0.5, stagger: 0.12, ease: "power3.out" }
      );
    }

    if (images.length > 1) restartProgress();
  }, [images, restartProgress]);

  // Auto-advance
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIdx(prev => {
        const next = (prev + 1) % images.length;
        advanceTo(next);
        restartProgress();
        return next;
      });
    }, DURATION * 1000);
    return () => clearInterval(timer);
  }, [images.length, advanceTo, restartProgress]);

  const manualGo = (next) => {
    if (next === idx) return;
    advanceTo(next);
    restartProgress();
  };

  return (
    <section className="relative h-screen overflow-hidden bg-jet select-none">
      <div ref={containerRef} className="absolute inset-0">
        {images.map((img, i) => (
          <div key={i} className="hero-slide absolute inset-0">
            <img
              src={img.url}
              alt=""
              className="w-full h-full object-cover"
              style={{ transform: "scale(1.04)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-jet/85 via-jet/15 to-jet/20" />
          </div>
        ))}
      </div>

      {/* Client identity overlay */}
      <div ref={titleRef} className="absolute bottom-0 left-0 px-8 md:px-16 pb-20 max-w-3xl">
        <p className="font-detail text-[10px] text-clay uppercase tracking-[0.3em] mb-4 opacity-0">
          Private Client Vault{location ? ` · ${location}` : ""}
        </p>
        <h1 className="font-drama text-5xl md:text-6xl lg:text-7xl font-light text-cream leading-none mb-3 opacity-0">
          {clientName}
        </h1>
        {projectTitle && (
          <p className="font-detail text-sm text-cream/45 uppercase tracking-[0.18em] opacity-0">
            {projectTitle}
          </p>
        )}
      </div>

      {/* Manual slide dots */}
      {images.length > 1 && (
        <div className="absolute bottom-8 right-8 flex items-center gap-2.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => manualGo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="transition-all duration-300"
              style={{
                width: i === idx ? 20 : 6,
                height: 4,
                borderRadius: 999,
                background: i === idx ? "#c45018" : "rgba(237,232,223,0.3)",
              }}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-cream/[0.08]">
          <div
            ref={progressRef}
            className="h-full bg-clay/60 origin-left"
            style={{ scaleX: 0 }}
          />
        </div>
      )}

      {/* Scroll cue */}
      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-50">
        <p className="font-detail text-[8px] text-cream/50 uppercase tracking-[0.25em]">Scroll</p>
        <div className="w-px h-8 bg-gradient-to-b from-cream/0 to-cream/40" />
      </div>
    </section>
  );
}

// ── Large gallery slideshow ──────────────────────────────────
function GallerySlideshow({ images, onOpenLightbox }) {
  const [idx, setIdx] = useState(0);
  const containerRef = useRef(null);
  const activeRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const slides = containerRef.current.querySelectorAll(".gal-slide");
    slides.forEach((s, i) => gsap.set(s, { opacity: i === 0 ? 1 : 0, xPercent: 0 }));
  }, []);

  const go = useCallback((next, dir) => {
    if (!containerRef.current || next === activeRef.current) return;
    const slides = containerRef.current.querySelectorAll(".gal-slide");
    const prev = activeRef.current;

    gsap.to(slides[prev], { xPercent: dir > 0 ? -18 : 18, opacity: 0, duration: 0.42, ease: "power2.in" });
    gsap.fromTo(slides[next],
      { xPercent: dir > 0 ? 60 : -60, opacity: 0 },
      { xPercent: 0, opacity: 1, duration: 0.52, ease: "power3.out" }
    );
    activeRef.current = next;
    setIdx(next);
  }, []);

  const prev = () => go(idx > 0 ? idx - 1 : images.length - 1, -1);
  const next = () => go(idx < images.length - 1 ? idx + 1 : 0, 1);

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl cursor-pointer"
        style={{ height: "clamp(320px, 60vh, 680px)" }}
        onClick={() => onOpenLightbox(idx)}
      >
        {images.map((img, i) => (
          <div key={i} className="gal-slide absolute inset-0">
            <img
              src={img.url}
              alt={img.name || ""}
              className="w-full h-full object-cover"
            />
            {/* Tap-to-fullscreen hint */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/25">
              <div className="w-12 h-12 rounded-full bg-jet/60 backdrop-blur-sm border border-cream/20 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cream">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </div>
            </div>
          </div>
        ))}

        {images.length > 1 && (
          <>
            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-jet/60 backdrop-blur-sm border border-cream/15 flex items-center justify-center text-cream hover:bg-jet/80 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={e => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-jet/60 backdrop-blur-sm border border-cream/15 flex items-center justify-center text-cream hover:bg-jet/80 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Caption row */}
      <div className="flex items-center justify-between mt-4 px-1">
        <p className="font-detail text-xs text-cream/40 uppercase tracking-wider truncate">
          {images[idx]?.name?.replace(/\.[^.]+$/, "") || ""}
        </p>
        {images.length > 1 && (
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-4">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i, i > idx ? 1 : -1)}
                className="transition-all duration-300"
                style={{
                  width: i === idx ? 16 : 5,
                  height: 3,
                  borderRadius: 999,
                  background: i === idx ? "#c45018" : "rgba(237,232,223,0.2)",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Key points ───────────────────────────────────────────────
function KeyPoints({ points }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const items = sectionRef.current.querySelectorAll(".kp-item");
    if (!items.length) return;
    gsap.fromTo(items,
      { opacity: 0, y: 28 },
      {
        opacity: 1, y: 0, duration: 0.65, stagger: 0.09, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
      }
    );
  }, [points]);

  return (
    <section ref={sectionRef} className="max-w-6xl mx-auto px-6 py-14 border-b border-cream/[0.07]">
      <p className="font-detail text-[10px] text-cream/30 uppercase tracking-[0.22em] mb-8">Key Points</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {points.map((point, i) => (
          <div
            key={i}
            className="kp-item flex gap-4 p-5 bg-cream/[0.03] border border-cream/[0.07] rounded-2xl hover:border-clay/25 transition-colors duration-300"
          >
            <div className="w-7 h-7 rounded-full bg-clay/12 border border-clay/25 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="font-mono text-[9px] text-clay font-semibold">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <p className="font-detail text-sm text-cream/70 leading-relaxed">{point}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Links / resources ────────────────────────────────────────
function LinksSection({ links }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll(".link-card");
    if (!cards.length) return;
    gsap.fromTo(cards,
      { opacity: 0, y: 22 },
      {
        opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      }
    );
  }, [links]);

  return (
    <section ref={sectionRef} className="max-w-6xl mx-auto px-6 py-14 border-b border-cream/[0.07]">
      <p className="font-detail text-[10px] text-cream/30 uppercase tracking-[0.22em] mb-8">Links & Resources</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link, i) => {
          const isExternal = link.url.startsWith("http");
          return (
            <a
              key={i}
              href={link.url}
              target={isExternal ? "_blank" : "_self"}
              rel={isExternal ? "noreferrer" : undefined}
              className="link-card group flex items-start justify-between p-5 bg-cream/[0.03] border border-cream/[0.07] rounded-2xl hover:border-clay/35 hover:bg-cream/[0.06] transition-all duration-200"
            >
              <div className="pr-3">
                <p className="font-heading font-semibold text-cream text-sm group-hover:text-clay transition-colors duration-200">
                  {link.label}
                </p>
                {link.description && (
                  <p className="font-detail text-xs text-cream/40 mt-1.5 leading-relaxed">{link.description}</p>
                )}
              </div>
              <ArrowUpRight size={15} className="text-cream/20 group-hover:text-clay transition-colors flex-shrink-0 mt-0.5" />
            </a>
          );
        })}
      </div>
    </section>
  );
}

// ── PDF documents ────────────────────────────────────────────
function DocumentsSection({ pdfs }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-14 border-b border-cream/[0.07]">
      <p className="font-detail text-[10px] text-cream/30 uppercase tracking-[0.22em] mb-8">Documents</p>
      <div className="space-y-3 max-w-xl">
        {pdfs.map((pdf, i) => (
          <a
            key={i}
            href={pdf.url}
            download={pdf.name}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 p-4 bg-cream/[0.03] border border-cream/[0.07] rounded-2xl hover:border-clay/35 hover:bg-cream/[0.06] transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-xl bg-clay/10 border border-clay/20 flex items-center justify-center flex-shrink-0">
              <Download size={15} className="text-clay" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-detail text-sm text-cream/75 truncate">{pdf.name || "Document"}</p>
              <p className="font-detail text-[10px] text-cream/30 uppercase tracking-wider mt-0.5">PDF</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ── Assembled vault content page ─────────────────────────────
function VaultContent({ clientData }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef(null);
  const overviewRef = useRef(null);

  const {
    clientName, projectTitle, location, status, greeting,
    projectDescription, images = [], keyPoints = [], links = [], pdfs = [],
  } = clientData;

  const statusConfig = STATUS_CONFIG[status] || null;
  const hasImages = images.length > 0;

  useEffect(() => {
    // Sticky header appears after scrolling past hero
    const st = ScrollTrigger.create({
      trigger: "body",
      start: "80px top",
      onEnter: () => setHeaderVisible(true),
      onLeaveBack: () => setHeaderVisible(false),
    });

    // Overview section entrance
    if (overviewRef.current) {
      const els = overviewRef.current.querySelectorAll(".reveal");
      if (els.length) {
        gsap.fromTo(els,
          { opacity: 0, y: 22 },
          {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: overviewRef.current, start: "top 70%" },
          }
        );
      }
    }

    return () => st.kill();
  }, []);

  return (
    <div className="min-h-screen bg-jet text-cream">
      {/* Sticky header */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 border-b border-cream/[0.07] bg-jet/92 backdrop-blur-md transition-all duration-400"
        style={{ transform: headerVisible ? "translateY(0)" : "translateY(-100%)" }}
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="font-heading font-bold text-cream tracking-tight hover:text-cream/75 transition-colors">
            ROGET<span className="font-normal italic font-drama">james</span>
          </a>
          <div className="flex items-center gap-5">
            <span className="font-detail text-[10px] text-cream/35 uppercase tracking-[0.2em] hidden sm:block truncate max-w-[200px]">
              {clientName}
            </span>
            <a
              href="/"
              className="flex items-center gap-1.5 font-detail text-[10px] text-cream/50 uppercase tracking-[0.15em] hover:text-cream transition-colors border border-cream/12 hover:border-cream/30 rounded-full px-3.5 py-1.5"
            >
              Explore Studio <ArrowRight size={10} />
            </a>
          </div>
        </div>
      </header>

      {/* Hero slideshow */}
      {hasImages ? (
        <HeroSlideshow
          images={images}
          clientName={clientName}
          projectTitle={projectTitle}
          location={location}
        />
      ) : (
        <div className="h-56 flex flex-col justify-end px-8 md:px-16 pb-10 border-b border-cream/[0.07]">
          <p className="font-detail text-[10px] text-clay uppercase tracking-[0.3em] mb-2">
            Private Client Vault{location ? ` · ${location}` : ""}
          </p>
          <h1 className="font-drama text-4xl font-light text-cream">{clientName}</h1>
          {projectTitle && (
            <p className="font-detail text-sm text-cream/45 uppercase tracking-[0.18em] mt-2">{projectTitle}</p>
          )}
        </div>
      )}

      {/* Project overview */}
      <section ref={overviewRef} className="max-w-6xl mx-auto px-6 py-14 border-b border-cream/[0.07]">
        <div className="flex flex-col md:flex-row md:items-start gap-10">
          <div className="flex-1">
            {greeting && (
              <p className="reveal font-detail text-base text-cream/70 leading-relaxed mb-6 border-l-2 border-clay/40 pl-5 max-w-xl">
                {greeting}
              </p>
            )}
            {projectDescription && (
              <p className="reveal font-detail text-sm text-cream/60 leading-relaxed max-w-2xl whitespace-pre-line">
                {projectDescription}
              </p>
            )}
          </div>
          {statusConfig && (
            <div className="reveal flex-shrink-0">
              <div className="inline-flex items-center gap-2.5 bg-cream/[0.04] border border-cream/[0.08] rounded-2xl px-5 py-3">
                <div className="w-2 h-2 rounded-full" style={{ background: statusConfig.dot }} />
                <div>
                  <p className="font-detail text-[9px] text-cream/35 uppercase tracking-[0.2em] mb-0.5">Status</p>
                  <p className="font-detail text-sm text-cream/80">{statusConfig.label}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Gallery slideshow */}
      {hasImages && (
        <section className="max-w-6xl mx-auto px-6 py-14 border-b border-cream/[0.07]">
          <p className="font-detail text-[10px] text-cream/30 uppercase tracking-[0.22em] mb-8">Project Images</p>
          <GallerySlideshow
            images={images}
            onOpenLightbox={setLightboxIndex}
          />
        </section>
      )}

      {/* Key points */}
      {keyPoints.length > 0 && <KeyPoints points={keyPoints} />}

      {/* Links */}
      {links.length > 0 && <LinksSection links={links} />}

      {/* Documents */}
      {pdfs.length > 0 && <DocumentsSection pdfs={pdfs} />}

      {/* Footer CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="max-w-xl mx-auto">
          <p className="font-detail text-[10px] text-cream/25 uppercase tracking-[0.25em] mb-3">Discover more</p>
          <h2 className="font-drama text-3xl md:text-4xl text-cream font-light mb-8 leading-tight">
            Explore the full<br />ROGETjames collection
          </h2>
          <a
            href="/"
            className="inline-flex items-center gap-3 bg-clay text-cream px-9 py-4 rounded-full font-detail text-xs uppercase tracking-[0.2em] hover:bg-clay-light transition-colors"
          >
            Explore the Studio
            <ArrowRight size={13} />
          </a>
        </div>
        <div className="mt-14 pt-8 border-t border-cream/[0.06]">
          <p className="font-detail text-[9px] text-cream/18 uppercase tracking-widest">
            ROGETjames · Perth · Gold Coast · Melbourne
          </p>
        </div>
      </section>

      {lightboxIndex !== null && images.length > 0 && (
        <Lightbox items={images} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  );
}

// ── Skeleton screens ─────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-jet flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-clay/30 border-t-clay rounded-full animate-spin" />
    </div>
  );
}

function ErrorScreen() {
  return (
    <div className="min-h-screen bg-jet flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <a href="/" className="inline-block font-heading font-bold text-cream text-xl tracking-tight">
          ROGET<span className="font-normal italic font-drama">james</span>
        </a>
        <div className="w-8 h-px bg-clay/50 mx-auto my-5" />
        <p className="font-detail text-sm text-cream/55 leading-relaxed">
          This link is invalid or has expired. Please contact us to request a new one.
        </p>
        <a href="/" className="mt-8 inline-flex items-center gap-2 font-detail text-xs text-cream/40 uppercase tracking-[0.2em] hover:text-cream transition-colors">
          <ChevronLeft size={12} /> Return to site
        </a>
      </div>
    </div>
  );
}

// ── Email verification gate ──────────────────────────────────
function VerifyStep({ token, onVerified }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/vault-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Email not recognised. Please check and try again.");
        if (formRef.current) {
          gsap.fromTo(formRef.current, { x: -8 }, { x: 8, duration: 0.06, repeat: 5, yoyo: true, ease: "none", onComplete: () => gsap.set(formRef.current, { x: 0 }) });
        }
        return;
      }
      onVerified(data, email.trim().toLowerCase());
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(formRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
    }
  }, []);

  return (
    <div className="min-h-screen bg-jet flex items-center justify-center px-6">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(196,80,24,0.05) 0%, transparent 65%)" }} />
      <div ref={formRef} className="relative w-full max-w-sm opacity-0">
        <div className="bg-white/8 border border-white/18 rounded-[2rem] p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <a href="/" className="inline-block font-heading font-bold text-cream text-xl tracking-tight hover:text-cream/75 transition-colors">
              ROGET<span className="font-normal italic font-drama">james</span>
            </a>
            <div className="w-8 h-px bg-clay/50 mx-auto mt-3 mb-4" />
            <p className="font-detail text-[10px] text-cream/65 uppercase tracking-[0.25em]">Private Client Vault</p>
          </div>
          <div className="flex justify-center mb-6">
            <div className="w-11 h-11 rounded-full bg-clay/10 border border-clay/30 flex items-center justify-center">
              <Lock size={16} className="text-clay" />
            </div>
          </div>
          <p className="font-detail text-sm text-cream/65 text-center leading-relaxed mb-8">
            Enter the email address associated with your exclusive preview.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder="Your email address"
                autoComplete="email"
                className="w-full bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-2xl px-5 py-3.5 text-center font-detail text-cream placeholder:text-cream/30 outline-none transition-colors duration-200"
                style={{ caretColor: "#C45018" }}
              />
              {error && (
                <p className="font-detail text-[11px] text-clay text-center mt-2 leading-relaxed">{error}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={!email.trim() || loading}
              className="w-full py-3.5 rounded-2xl bg-clay text-cream font-heading font-semibold text-sm tracking-wide hover:bg-clay-light disabled:opacity-30 disabled:cursor-default transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />Verifying…</>
              ) : "Access My Vault"}
            </button>
          </form>
          <p className="font-detail text-[10px] text-cream/35 text-center mt-6">
            This page was prepared exclusively for you.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Admin panel ───────────────────────────────────────────────
function AdminPanel() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/vault-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminSecret: secret, clientEmail: inviteEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setResult({ error: data.error || "Failed to send invite." });
        if (res.status === 401) setAuthed(false);
      } else {
        setResult({ success: true, vaultUrl: data.vaultUrl });
        setInviteEmail("");
      }
    } catch {
      setResult({ error: "Request failed. Check your connection." });
    } finally {
      setLoading(false);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-jet flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="bg-white/8 border border-white/18 rounded-[2rem] p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <a href="/" className="inline-block font-heading font-bold text-cream text-xl tracking-tight">
                ROGET<span className="font-normal italic font-drama">james</span>
              </a>
              <div className="w-8 h-px bg-clay/60 mx-auto mt-3 mb-4" />
              <p className="font-detail text-[10px] text-cream/85 uppercase tracking-[0.25em]">Vault Admin</p>
            </div>
            <form onSubmit={e => { e.preventDefault(); if (secret.trim()) setAuthed(true); }} className="space-y-4">
              <input
                type="password"
                value={secret}
                onChange={e => setSecret(e.target.value)}
                placeholder="Admin password"
                className="w-full bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-2xl px-5 py-3.5 text-center font-heading text-cream tracking-[0.15em] placeholder:text-cream/30 placeholder:font-detail placeholder:text-sm placeholder:tracking-widest outline-none transition-colors"
                style={{ caretColor: "#C45018" }}
              />
              <button
                type="submit"
                disabled={!secret.trim()}
                className="w-full py-3.5 rounded-2xl bg-clay text-cream font-heading font-semibold text-sm tracking-wide hover:bg-clay-light disabled:opacity-30 transition-all"
              >
                Enter
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jet px-6 py-12">
      <div className="max-w-lg mx-auto">
        <div className="mb-10">
          <a href="/" className="font-heading font-bold text-cream text-xl tracking-tight">
            ROGET<span className="font-normal italic font-drama">james</span>
          </a>
          <div className="w-8 h-px bg-clay/50 mt-3 mb-5" />
          <p className="font-detail text-[10px] text-clay/90 uppercase tracking-[0.25em]">Vault Admin · Send Invite</p>
        </div>
        <div className="bg-white/8 border border-white/18 rounded-2xl p-8">
          <p className="font-detail text-sm text-cream/80 leading-relaxed mb-6">
            Enter a client's email to send their exclusive vault invite. They must already have a row in Airtable with this email address.
          </p>
          <form onSubmit={handleSend} className="space-y-4">
            <input
              type="email"
              value={inviteEmail}
              onChange={e => { setInviteEmail(e.target.value); setResult(null); }}
              placeholder="client@email.com"
              className="w-full bg-cream/5 border border-cream/18 focus:border-clay/65 rounded-2xl px-5 py-3.5 font-detail text-cream placeholder:text-cream/30 outline-none transition-colors"
              style={{ caretColor: "#C45018" }}
            />
            <button
              type="submit"
              disabled={!inviteEmail.trim() || loading}
              className="w-full py-3.5 rounded-2xl bg-clay text-cream font-heading font-semibold text-sm tracking-wide hover:bg-clay-light disabled:opacity-30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />Sending…</>
              ) : "Send Vault Invite"}
            </button>
          </form>

          {result?.error && (
            <div className="mt-5 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="font-detail text-sm text-red-300">{result.error}</p>
            </div>
          )}
          {result?.success && (
            <div className="mt-5 p-4 bg-green-500/10 border border-green-500/20 rounded-xl space-y-3">
              <p className="font-detail text-sm text-green-300">Invite sent.</p>
              <p className="font-detail text-[10px] text-cream/35 uppercase tracking-wider">Vault URL</p>
              <p className="font-mono text-xs text-cream/60 break-all bg-cream/5 rounded-lg px-3 py-2">
                {result.vaultUrl}
              </p>
              <button
                onClick={() => navigator.clipboard?.writeText(result.vaultUrl)}
                className="font-detail text-[10px] text-clay uppercase tracking-wider hover:text-cream transition-colors"
              >
                Copy link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Root component ────────────────────────────────────────────
export default function VaultPage() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const isAdmin = params.get("admin") === "1";
  const STORAGE_KEY = token ? `roj_vault_${token}` : null;

  const [step, setStep] = useState("loading");
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    if (isAdmin) { setStep("admin"); return; }
    if (!token) { setStep("error"); return; }
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const { data } = JSON.parse(cached);
        if (data) { setClientData(data); setStep("content"); return; }
      }
    } catch {}
    setStep("verify");
  }, []);

  const handleVerified = (data, verifiedEmail) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, verifiedEmail }));
    } catch {}
    setClientData(data);
    setStep("content");
  };

  if (step === "loading") return <LoadingScreen />;
  if (step === "error")   return <ErrorScreen />;
  if (step === "admin")   return <AdminPanel />;
  if (step === "verify")  return <VerifyStep token={token} onVerified={handleVerified} />;
  if (step === "content") return <VaultContent clientData={clientData} />;
  return null;
}
