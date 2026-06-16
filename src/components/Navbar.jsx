import { useEffect, useRef, useState, useCallback, lazy, Suspense } from "react";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import { Menu, X, Search, Lock } from "lucide-react";
import SearchModal from "./SearchModal";
const CatPageViewer = lazy(() => import("./CatPageViewer"));
const ClientPreview = lazy(() => import("./ClientPreview"));

const CAT1 = Array.from({ length: 38 }, (_, i) => `/images/catalogues/cat1/page-${String(i + 1).padStart(2, "0")}.jpg`);
const CAT2 = [1, 3, 4, 5, 6, 7, 8, 9, 10].map(n => `/images/catalogues/cat2/page-${String(n).padStart(2, "0")}.jpg`);
const DULUX_PAGES    = Array.from({ length: 8 }, (_, i) => `/images/catalogues/dulux/page-${String(i + 1).padStart(2, "0")}.jpg`);
const INTERPON_PAGES = Array.from({ length: 8 }, (_, i) => `/images/catalogues/interpon/page-${String(i + 1).padStart(2, "0")}.jpg`);

const NAV_LINKS = [
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

const CATALOGUES = [
  { label: "Wall Art & Screens",                pages: CAT1 },
  { label: "Sculpture, Light Features & Mirrors", pages: CAT2 },
  { label: "Dulux Colours",                     pages: DULUX_PAGES },
  { label: "Interpon Colours",                  pages: INTERPON_PAGES },
];

export default function Navbar({ quoteCount = 0 }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [bespokeOpen, setBespokeOpen] = useState(false);
  const [openCat, setOpenCat] = useState(null);
  const [clientPreviewOpen, setClientPreviewOpen] = useState(false);
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  // Animate mobile menu open/close
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    if (mobileOpen) {
      lenis?.stop();
      // Make visible, then animate in
      gsap.set(menu, { visibility: "visible" });
      gsap.fromTo(
        menu,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: "power2.out" }
      );
      // Stagger links in from below
      const links = menu.querySelectorAll(".mobile-link");
      gsap.fromTo(
        links,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.07,
          ease: "power3.out",
          delay: 0.1,
        }
      );
    } else {
      // Animate out, then hide
      gsap.to(menu, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(menu, { visibility: "hidden" });
          lenis?.start();
        },
      });
    }
  }, [mobileOpen, lenis]);

  const closeMenu = useCallback(() => setMobileOpen(false), []);

  // Hypnotic smooth scroll — intercepts all nav anchor clicks
  const scrollTo = useCallback((href, closeMobileMenu = false) => (e) => {
    e.preventDefault();
    const target = href === "#" ? document.body : document.querySelector(href);
    if (!target) return;
    if (closeMobileMenu) {
      setMobileOpen(false);
      // Lenis is stopped while menu is open — restart it before scrolling
      lenis?.start();
    }
    if (lenis) {
      lenis.scrollTo(target, {
        duration: 2.8,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, [lenis]);

  return (
    <>
      <nav
        ref={navRef}
        className={`group fixed top-0 left-0 z-[100] flex items-center justify-between gap-1 px-6 py-3 transition-all duration-500 ${
          scrolled ? "shadow-lg" : ""
        }`}
        style={{ width: "100%", background: scrolled ? "rgba(158, 113, 52, 0.45)" : "transparent" }}
      >
        <a
          href="#"
          onClick={scrollTo("#")}
          className={`font-heading font-bold text-lg tracking-tight px-4 py-1 transition-colors duration-500 whitespace-nowrap ${
            scrolled ? "text-cream" : "text-cream"
          }`}
        >
          ROGET<span className="font-normal italic font-drama">james</span>
        </a>

        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300">
          {/* Collection dropdown */}
          <div className="relative" onMouseEnter={() => setCollectionOpen(true)} onMouseLeave={() => setCollectionOpen(false)}>
            <button className={`lift-hover text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-500 flex items-center gap-1 nav-link-glow text-cream/70`}>
              Collection
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform duration-200 ${collectionOpen ? "rotate-180" : ""}`}><path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {collectionOpen && (
              <div className={`absolute top-full left-0 mt-1 rounded-2xl overflow-hidden shadow-xl border py-1 min-w-[160px] ${scrolled ? "bg-cream border-charcoal/10" : "bg-charcoal/95 border-white/10 backdrop-blur-xl"}`}>
                {[{ label: "Wall Art", tab: "wall-art" }, { label: "Sculpture", tab: "sculpture" }].map(({ label, tab }) => (
                  <button key={tab} onClick={() => { setCollectionOpen(false); window.dispatchEvent(new CustomEvent("open-gallery-tab", { detail: tab })); setTimeout(() => { const el = document.querySelector("#collection"); if (el) lenis ? lenis.scrollTo(el, { duration: 2, easing: t => 1 - Math.pow(1 - t, 4) }) : el.scrollIntoView({ behavior: "smooth" }); }, 50); }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${scrolled ? "text-cream/70 hover:text-cream hover:bg-white/5" : "text-cream/70 hover:text-cream hover:bg-white/5"}`}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bespoke dropdown */}
          <div className="relative" onMouseEnter={() => setBespokeOpen(true)} onMouseLeave={() => setBespokeOpen(false)}>
            <button onClick={scrollTo("#bespoke")} className={`lift-hover text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-500 flex items-center gap-1 nav-link-glow text-cream/70`}>
              Bespoke
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform duration-200 ${bespokeOpen ? "rotate-180" : ""}`}><path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {bespokeOpen && (
              <div className={`absolute top-full left-0 mt-1 rounded-2xl overflow-hidden shadow-xl border py-1 min-w-[160px] ${scrolled ? "bg-cream border-charcoal/10" : "bg-charcoal/95 border-white/10 backdrop-blur-xl"}`}>
                {[{ label: "Screens", cat: "screens" }, { label: "Sculpture", cat: "sculpture" }, { label: "Projects", cat: "projects" }, { label: "Concepts", cat: "concepts" }].map(({ label, cat }) => (
                  <button key={cat} onClick={() => { setBespokeOpen(false); window.dispatchEvent(new CustomEvent("open-bespoke-category", { detail: cat })); setTimeout(() => { const el = document.querySelector("#bespoke"); if (el) lenis ? lenis.scrollTo(el, { duration: 2, easing: t => 1 - Math.pow(1 - t, 4) }) : el.scrollIntoView({ behavior: "smooth" }); }, 50); }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${scrolled ? "text-cream/70 hover:text-cream hover:bg-white/5" : "text-cream/70 hover:text-cream hover:bg-white/5"}`}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Process */}
          <a href="#process" onClick={scrollTo("#process")} className={`lift-hover text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-500 nav-link-glow text-cream/70`}>Process</a>

          {/* Catalogues dropdown */}
          <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <button
              className="lift-hover text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-500 flex items-center gap-1 nav-link-glow text-cream/70"
            >
              Catalogues
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`}>
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {catOpen && (
              <div className={`absolute top-full left-0 mt-1 rounded-2xl overflow-hidden shadow-xl border py-1 min-w-[220px] ${
                scrolled ? "bg-cream border-charcoal/10" : "bg-charcoal/95 border-white/10 backdrop-blur-xl"
              }`}>
                {CATALOGUES.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => {
                      setOpenCat(cat);
                      setCatOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                      scrolled ? "text-cream/70 hover:text-cream hover:bg-white/5" : "text-cream/70 hover:text-cream hover:bg-white/5"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Contact */}
          <a href="#contact" onClick={scrollTo("#contact")} className={`lift-hover text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-500 nav-link-glow text-cream/70`}>Contact</a>
        </div>

        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setSearchOpen(true)}
            className="lift-hover p-2 rounded-full transition-colors duration-500 nav-link-glow text-cream/70"
            aria-label="Search"
          >
            <Search size={17} />
          </button>
          <button
            onClick={() => setClientPreviewOpen(true)}
            className="lift-hover p-2 rounded-full transition-colors duration-500 nav-link-glow text-cream/70"
            aria-label="Client Preview"
            title="Client Preview"
          >
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

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden p-2 rounded-full transition-colors duration-500 ${
            scrolled ? "text-cream" : "text-cream"
          }`}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu — always in DOM, controlled via visibility + GSAP */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-[99] bg-charcoal/95 backdrop-blur-xl overflow-y-auto"
        style={{ visibility: "hidden", opacity: 0 }}
      >
      <div className="flex flex-col items-center justify-center gap-6 min-h-full py-20">

        {/* Collection */}
        <div className="mobile-link flex flex-col items-center gap-2">
          <span className="text-cream/40 text-xs uppercase tracking-[0.2em] font-detail">Collection</span>
          <div className="flex gap-5">
            {[{ label: "Wall Art", tab: "wall-art" }, { label: "Sculpture", tab: "sculpture" }].map(({ label, tab }) => (
              <button key={tab} onClick={() => { closeMenu(); window.dispatchEvent(new CustomEvent("open-gallery-tab", { detail: tab })); setTimeout(() => { const el = document.querySelector("#collection"); if (el) lenis ? lenis.scrollTo(el, { duration: 2, easing: t => 1 - Math.pow(1 - t, 4) }) : el.scrollIntoView({ behavior: "smooth" }); }, 50); }}
                className="text-cream text-lg font-heading font-medium lift-hover">
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Bespoke */}
        <div className="mobile-link flex flex-col items-center gap-2">
          <span className="text-cream/40 text-xs uppercase tracking-[0.2em] font-detail">Bespoke</span>
          <div className="flex flex-wrap justify-center gap-5">
            {[{ label: "Screens", cat: "screens" }, { label: "Sculpture", cat: "sculpture" }, { label: "Projects", cat: "projects" }, { label: "Concepts", cat: "concepts" }].map(({ label, cat }) => (
              <button key={cat} onClick={() => { closeMenu(); window.dispatchEvent(new CustomEvent("open-bespoke-category", { detail: cat })); setTimeout(() => { const el = document.querySelector("#bespoke"); if (el) lenis ? lenis.scrollTo(el, { duration: 2, easing: t => 1 - Math.pow(1 - t, 4) }) : el.scrollIntoView({ behavior: "smooth" }); }, 50); }}
                className="text-cream text-lg font-heading font-medium lift-hover">
                {label}
              </button>
            ))}
          </div>
        </div>

        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={scrollTo(link.href, true)}
            className="mobile-link text-cream text-lg font-heading font-medium lift-hover"
          >
            {link.label}
          </a>
        ))}

        {/* Catalogues */}
        <div className="mobile-link flex flex-col items-center gap-2">
          <span className="text-cream/40 text-xs uppercase tracking-[0.2em] font-detail">Catalogues</span>
          <div className="flex flex-col items-center gap-3">
            {CATALOGUES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => { closeMenu(); setOpenCat(cat); }}
                className="text-cream/70 text-lg font-heading font-medium lift-hover"
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => { closeMenu(); setClientPreviewOpen(true); }}
          className="mobile-link flex items-center gap-2 text-cream/50 text-sm font-detail uppercase tracking-[0.2em] lift-hover mt-2"
        >
          <Lock size={13} />
          Client Preview
        </button>
        <div className="mobile-link relative mt-4 inline-block">
          <a
            href="#contact"
            onClick={scrollTo("#contact", true)}
            className="btn-quote px-8 py-3 text-cream/80 font-semibold whitespace-nowrap select-none"
          >
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
