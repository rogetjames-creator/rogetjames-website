import { useEffect, useRef, useState, useCallback, lazy, Suspense } from "react";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import { Search, Lock } from "lucide-react";
import SearchModal from "./SearchModal";
const CatPageViewer = lazy(() => import("./CatPageViewer"));
const ClientPreview = lazy(() => import("./ClientPreview"));

const CAT1 = Array.from({ length: 38 }, (_, i) => `/images/catalogues/cat1/page-${String(i + 1).padStart(2, "0")}.jpg`);
const CAT2 = [1, 3, 4, 5, 6, 7, 8, 9, 10].map(n => `/images/catalogues/cat2/page-${String(n).padStart(2, "0")}.jpg`);
const DULUX_PAGES    = Array.from({ length: 8 }, (_, i) => `/images/catalogues/dulux/page-${String(i + 1).padStart(2, "0")}.jpg`);
const INTERPON_PAGES = Array.from({ length: 8 }, (_, i) => `/images/catalogues/interpon/page-${String(i + 1).padStart(2, "0")}.jpg`);

// Bespoke portals locked as "under construction" in production (Screens stays open).
const LOCKED_BESPOKE_CATS = import.meta.env.PROD ? ["sculpture", "projects", "commissions", "concepts"] : [];

const CATALOGUES = [
  { label: "Wall Art & Screens",                pages: CAT1 },
  { label: "Sculpture, Light Features & Mirrors", pages: CAT2 },
  { label: "Dulux Colours",                     pages: DULUX_PAGES },
  { label: "Interpon Colours",                  pages: INTERPON_PAGES },
];

// SVG icons for social
function InstagramIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4.5"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
    </svg>
  );
}

export default function Navbar({ quoteCount = 0 }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [bespokeOpen, setBespokeOpen] = useState(false);
  const [openCat, setOpenCat] = useState(null);
  const [clientPreviewOpen, setClientPreviewOpen] = useState(false);
  const navBarRef = useRef(null);
  const menuRef = useRef(null);
  const lenis = useLenis();

  useEffect(() => {
    const handler = (e) => {
      const label = e.detail || "Wall Art & Screens";
      const pages = label.includes("Sculpture") ? CAT2 : CAT1;
      setOpenCat({ label, pages });
    };
    window.addEventListener("open-catalogue", handler);
    return () => window.removeEventListener("open-catalogue", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const key = e.detail || "dulux";
      setOpenCat(key === "interpon"
        ? { label: "Interpon Colours", pages: INTERPON_PAGES }
        : { label: "Dulux Colours",    pages: DULUX_PAGES });
    };
    window.addEventListener("open-colour-catalogue", handler);
    return () => window.removeEventListener("open-colour-catalogue", handler);
  }, []);

  // Mobile menu open/close
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    if (mobileOpen) {
      lenis?.stop();
      gsap.set(menu, { visibility: "visible" });
      gsap.fromTo(menu, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
      const links = menu.querySelectorAll(".mobile-link");
      gsap.fromTo(links, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.07, ease: "power3.out", delay: 0.1 });
    } else {
      gsap.to(menu, { opacity: 0, duration: 0.25, ease: "power2.in", onComplete: () => { gsap.set(menu, { visibility: "hidden" }); lenis?.start(); } });
    }
    // Unmounting while the menu is open would otherwise leave scroll locked.
    return () => { lenis?.start(); };
  }, [mobileOpen, lenis]);

  const closeMenu = useCallback(() => { setMobileOpen(false); lenis?.start(); }, [lenis]);

  const scrollTo = useCallback((href, closeMobileMenu = false) => (e) => {
    e.preventDefault();
    const target = href === "#" ? document.body : document.querySelector(href);
    if (!target) return;
    if (closeMobileMenu) { setMobileOpen(false); lenis?.start(); }
    if (lenis) {
      lenis.scrollTo(target, { duration: 2.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, [lenis]);

  // Bespoke categories locked as "under construction" in production. Their menu
  // links only scroll to the Bespoke section (matching the locked portals) and
  // never open a gallery.
  const openBespokeCat = useCallback((cat, closeMobileMenu = false) => {
    setBespokeOpen(false);
    if (closeMobileMenu) { setMobileOpen(false); lenis?.start(); }
    if (!LOCKED_BESPOKE_CATS.includes(cat)) {
      window.dispatchEvent(new CustomEvent("open-bespoke-category", { detail: cat }));
    }
    setTimeout(() => {
      const el = document.querySelector("#bespoke");
      if (el) lenis ? lenis.scrollTo(el, { duration: 2, easing: t => 1 - Math.pow(1 - t, 4) }) : el.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, [lenis]);

  const handleLogoClick = useCallback((e) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(document.body, { duration: 2.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [lenis]);

  return (
    <>
      {/* ── Always-visible strip: wordmark + instagram ── */}
      <div className="fixed top-0 left-0 z-[101] flex items-center gap-3 px-5 py-3 pointer-events-none">
        {/* Wordmark */}
        <button
          onClick={handleLogoClick}
          className="pointer-events-auto font-heading font-bold text-lg tracking-tight px-1 py-1 text-cream transition-opacity duration-300 hover:opacity-70 whitespace-nowrap bg-transparent border-none cursor-pointer"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
        >
          ROGET<span className="font-normal italic font-drama">james</span>
        </button>
        <a
          href="https://instagram.com/rogetjames/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="pointer-events-auto text-cream/70 hover:text-cream transition-colors duration-300"
          style={{ filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.5))" }}
        >
          <InstagramIcon />
        </a>
      </div>

      {/* ── Glass fog nav bar — slides in/out ── */}
      <nav
        ref={navBarRef}
        className="fixed top-0 left-0 z-[100] w-full"
        style={{
          transform: "translateY(0)",
          opacity: 1,
          background: "rgba(14, 12, 10, 0.45)",
          backdropFilter: "blur(22px) saturate(1.4)",
          WebkitBackdropFilter: "blur(22px) saturate(1.4)",
          borderBottom: "1px solid rgba(237, 232, 223, 0.07)",
          boxShadow: "0 2px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(237,232,223,0.05)",
        }}
      >
        <div className="flex items-center justify-between gap-1 px-6 py-3">
          {/* Spacer where wordmark lives (it's in the layer above) */}
          <div className="w-[160px]" />

          {/* Centre nav links */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {/* Collection dropdown */}
            <div className="relative" onMouseEnter={() => setCollectionOpen(true)} onMouseLeave={() => setCollectionOpen(false)}>
              <button className="lift-hover text-sm font-medium px-3 py-1.5 flex items-center gap-1 nav-link-glow text-cream/70">
                Collection
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform duration-200 ${collectionOpen ? "rotate-180" : ""}`}><path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {collectionOpen && (
                <div className="absolute top-full left-0 mt-1 py-1 min-w-[120px]">
                  {[{ label: "Wall Art", tab: "wall-art" }, { label: "Sculpture", tab: "sculpture" }, { label: "Screens", tab: "screens" }].map(({ label, tab }) => (
                    <button key={tab} onClick={() => { setCollectionOpen(false); window.dispatchEvent(new CustomEvent("open-collection-category", { detail: tab })); setTimeout(() => { const el = document.querySelector("#collection"); if (el) lenis ? lenis.scrollTo(el, { duration: 2, easing: t => 1 - Math.pow(1 - t, 4) }) : el.scrollIntoView({ behavior: "smooth" }); }, 50); }}
                      className="block w-full text-left px-4 py-1.5 text-sm font-medium text-cream/90 hover:text-cream transition-colors duration-200 [text-shadow:0_1px_4px_rgb(0_0_0_/_0.95)]">
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bespoke dropdown */}
            <div className="relative" onMouseEnter={() => setBespokeOpen(true)} onMouseLeave={() => setBespokeOpen(false)}>
              <button onClick={scrollTo("#bespoke")} className="lift-hover text-sm font-medium px-3 py-1.5 flex items-center gap-1 nav-link-glow text-cream/70">
                Bespoke
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform duration-200 ${bespokeOpen ? "rotate-180" : ""}`}><path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {bespokeOpen && (
                <div className="absolute top-full left-0 mt-1 py-1 min-w-[120px]">
                  {[{ label: "Screens", cat: "screens" }, { label: "Sculpture", cat: "sculpture" }, { label: "Projects", cat: "projects" }, { label: "Commissions", cat: "commissions" }, { label: "Concepts", cat: "concepts" }].map(({ label, cat }) => {
                    const locked = LOCKED_BESPOKE_CATS.includes(cat);
                    return (
                      <button key={cat} onClick={() => openBespokeCat(cat)}
                        className={`w-full text-left px-4 py-1.5 text-sm font-medium transition-colors duration-200 [text-shadow:0_1px_4px_rgb(0_0_0_/_0.95)] flex items-center gap-1.5 ${locked ? "text-cream/40 cursor-default" : "text-cream/90 hover:text-cream"}`}>
                        {label}
                        {locked && <Lock size={9} className="text-cream/35" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Process */}
            <a href="#process" onClick={scrollTo("#process")} className="lift-hover text-sm font-medium px-3 py-1.5 nav-link-glow text-cream/70">Process</a>

            {/* Catalogues dropdown */}
            <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
              <button className="lift-hover text-sm font-medium px-3 py-1.5 flex items-center gap-1 nav-link-glow text-cream/70">
                Catalogues
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`}>
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 mt-1 py-1 min-w-[180px]">
                  {CATALOGUES.map((cat) => (
                    <button key={cat.label} onClick={() => { setOpenCat(cat); setCatOpen(false); }}
                      className="block w-full text-left px-4 py-1.5 text-sm font-medium text-cream/90 hover:text-cream transition-colors duration-200 [text-shadow:0_1px_4px_rgb(0_0_0_/_0.95)]">
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Contact */}
            <a href="#contact" onClick={scrollTo("#contact")} className="lift-hover text-sm font-medium px-3 py-1.5 nav-link-glow text-cream/70">Contact</a>
          </div>

          {/* Right side: search + lock + quote */}
          <div className="hidden md:flex items-center gap-1">
            <button onClick={() => setSearchOpen(true)} className="lift-hover p-2 rounded-full transition-colors duration-300 nav-link-glow text-cream/70 hover:text-cream" aria-label="Search">
              <Search size={17} />
            </button>
            <button onClick={() => setClientPreviewOpen(true)} className="lift-hover p-2 rounded-full transition-colors duration-300 nav-link-glow text-cream/70 hover:text-cream" aria-label="Client Preview" title="Client Preview">
              <Lock size={15} />
            </button>
            <div className="relative ml-1">
              <a href="#contact" className="btn-quote px-5 py-2 text-cream/80 text-sm font-semibold whitespace-nowrap select-none">
                Request a Quote
              </a>
              {quoteCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 z-20 min-w-[18px] h-[18px] rounded-full bg-moss text-cream text-[10px] font-bold flex items-center justify-center px-1 leading-none pointer-events-none">
                  {quoteCount}
                </span>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden ml-auto p-2 rounded-full text-cream/80 hover:text-cream transition-colors duration-300"
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {mobileOpen
                ? <><line x1="4" y1="4" x2="18" y2="18"/><line x1="18" y1="4" x2="4" y2="18"/></>
                : <><line x1="3" y1="7" x2="19" y2="7"/><line x1="3" y1="11" x2="19" y2="11"/><line x1="3" y1="15" x2="19" y2="15"/></>
              }
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-[99] overflow-y-auto"
        style={{ visibility: "hidden", opacity: 0, background: "rgba(6,5,4,0.96)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
      >
        <div className="flex flex-col items-center justify-center gap-6 min-h-full py-20">
          <div className="mobile-link flex flex-col items-center gap-2">
            <span className="text-cream/40 text-xs uppercase tracking-[0.2em] font-detail">Collection</span>
            <div className="flex gap-5">
              {[{ label: "Wall Art", tab: "wall-art" }, { label: "Sculpture", tab: "sculpture" }, { label: "Screens", tab: "screens" }].map(({ label, tab }) => (
                <button key={tab} onClick={() => { closeMenu(); window.dispatchEvent(new CustomEvent("open-collection-category", { detail: tab })); setTimeout(() => { const el = document.querySelector("#collection"); if (el) lenis ? lenis.scrollTo(el, { duration: 2, easing: t => 1 - Math.pow(1 - t, 4) }) : el.scrollIntoView({ behavior: "smooth" }); }, 50); }}
                  className="text-cream text-lg font-heading font-medium lift-hover">
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mobile-link flex flex-col items-center gap-2">
            <span className="text-cream/40 text-xs uppercase tracking-[0.2em] font-detail">Bespoke</span>
            <div className="flex flex-wrap justify-center gap-5">
              {[{ label: "Screens", cat: "screens" }, { label: "Sculpture", cat: "sculpture" }, { label: "Projects", cat: "projects" }, { label: "Commissions", cat: "commissions" }, { label: "Concepts", cat: "concepts" }].map(({ label, cat }) => {
                const locked = LOCKED_BESPOKE_CATS.includes(cat);
                return (
                  <button key={cat} onClick={() => { closeMenu(); if (!locked) window.dispatchEvent(new CustomEvent("open-bespoke-category", { detail: cat })); setTimeout(() => { const el = document.querySelector("#bespoke"); if (el) lenis ? lenis.scrollTo(el, { duration: 2, easing: t => 1 - Math.pow(1 - t, 4) }) : el.scrollIntoView({ behavior: "smooth" }); }, 50); }}
                    className={`text-lg font-heading font-medium lift-hover flex items-center gap-1.5 ${locked ? "text-cream/40" : "text-cream"}`}>
                    {label}
                    {locked && <Lock size={11} className="text-cream/35" />}
                  </button>
                );
              })}
            </div>
          </div>

          <a href="#process" onClick={scrollTo("#process", true)} className="mobile-link text-cream text-lg font-heading font-medium lift-hover">Process</a>

          <div className="mobile-link flex flex-col items-center gap-2">
            <span className="text-cream/40 text-xs uppercase tracking-[0.2em] font-detail">Catalogues</span>
            <div className="flex flex-col items-center gap-3">
              {CATALOGUES.map((cat) => (
                <button key={cat.label} onClick={() => { closeMenu(); setOpenCat(cat); }}
                  className="text-cream/70 text-lg font-heading font-medium lift-hover">
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <a href="#contact" onClick={scrollTo("#contact", true)} className="mobile-link text-cream text-lg font-heading font-medium lift-hover">Contact</a>

          <button onClick={() => { closeMenu(); setClientPreviewOpen(true); }}
            className="mobile-link flex items-center gap-2 text-cream/50 text-sm font-detail uppercase tracking-[0.2em] lift-hover mt-2">
            <Lock size={13} />
            Client Preview
          </button>

          <div className="mobile-link relative mt-4 inline-block">
            <a href="#contact" onClick={scrollTo("#contact", true)} className="btn-quote px-8 py-3 text-cream/80 font-semibold whitespace-nowrap select-none">
              Request a Quote
            </a>
            {quoteCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 z-20 min-w-[20px] h-[20px] rounded-full bg-moss text-cream text-[11px] font-bold flex items-center justify-center px-1 leading-none pointer-events-none">
                {quoteCount}
              </span>
            )}
          </div>
        </div>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      {openCat && (
        <Suspense fallback={null}>
          <CatPageViewer pages={openCat.pages} label={openCat.label} onClose={() => setOpenCat(null)} />
        </Suspense>
      )}
      {clientPreviewOpen && (
        <Suspense fallback={null}>
          <ClientPreview onClose={() => setClientPreviewOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
