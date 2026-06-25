import { useEffect, useRef, useState, useCallback, lazy, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis, useLenis } from "lenis/react";
import { ChevronUp, ChevronDown } from "lucide-react";

function Reveal({ children, label }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    gsap.set(wrapRef.current, { height: 0, overflow: "hidden" });
  }, []);

  const toggle = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (!open) {
      gsap.fromTo(el,
        { height: 0, overflow: "hidden" },
        { height: "auto", duration: 1.6, ease: "power3.inOut", clearProps: "overflow", onComplete: () => ScrollTrigger.refresh() }
      );
    } else {
      gsap.set(el, { overflow: "hidden" });
      gsap.to(el, { height: 0, duration: 1.1, ease: "power3.inOut", onComplete: () => ScrollTrigger.refresh() });
    }
    setOpen(o => !o);
  }, [open]);

  return (
    <div>
      <div className="flex justify-center py-12 border-t border-cream/[0.06]">
        <button
          onClick={toggle}
          className="flex items-center gap-3 font-detail text-xs text-cream/50 uppercase tracking-[0.2em] border border-cream/12 hover:border-clay/50 hover:text-cream rounded-full px-7 py-3 transition-all duration-300"
        >
          {label}
          <ChevronDown size={11} style={{ transition: "transform 0.5s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
        </button>
      </div>
      <div ref={wrapRef}>
        {children}
        <div className="flex justify-center py-8 border-b border-cream/[0.06]">
          <button onClick={toggle} className="flex items-center gap-2 font-detail text-[10px] text-cream/30 uppercase tracking-[0.2em] hover:text-cream/60 transition-colors duration-200">
            <ChevronUp size={10} /> Close
          </button>
        </div>
      </div>
    </div>
  );
}

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StudioBio from "./components/StudioBio";
import About from "./components/About";
import Process from "./components/Process";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
const Gallery            = lazy(() => import("./components/Gallery"));
const BespokeCommissions = lazy(() => import("./components/BespokeCommissions"));
const DiscoverPortals    = lazy(() => import("./components/DiscoverPortals"));
const CommissionsSection = lazy(() => import("./components/BespokePortals").then(m => ({ default: m.CommissionsSection })));

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = ['body', '#collection', '#about', '#bespoke', '#process', '#services', '#contact'];

function ScrollArrows() {
  const lenis = useLenis();
  const [visible, setVisible] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const show = () => setModalOpen(true);
    const hide = () => setModalOpen(false);
    window.addEventListener("gallery-modal-open", show);
    window.addEventListener("gallery-modal-close", hide);
    return () => {
      window.removeEventListener("gallery-modal-open", show);
      window.removeEventListener("gallery-modal-close", hide);
    };
  }, []);
  const holdRef = useRef(false);
  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200);
      setAtBottom(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goToSection = useCallback((dir) => {
    const modalBody = window.__galleryModalBody?.current;
    if (modalBody) {
      modalBody.scrollBy({ top: dir * window.innerHeight * 0.75, behavior: "smooth" });
      return;
    }
    if (!lenis) return;
    const els = SECTIONS.map(s => s === 'body' ? document.body : document.querySelector(s)).filter(Boolean);
    const y = window.scrollY;
    const target = dir > 0
      ? els.find(el => (el === document.body ? 0 : el.offsetTop) > y + 80)
      : [...els].reverse().find(el => (el === document.body ? 0 : el.offsetTop) < y - 80);
    if (target) lenis.scrollTo(target, { duration: 2.2, easing: t => 1 - Math.pow(1 - t, 4) });
  }, [lenis]);

  const stop = useCallback(() => {
    clearTimeout(timerRef.current);
    clearInterval(intervalRef.current);
    holdRef.current = false;
  }, []);

  const handleDown = useCallback((dir) => {
    holdRef.current = false;
    timerRef.current = setTimeout(() => {
      holdRef.current = true;
      intervalRef.current = setInterval(() => {
        if (lenis) lenis.scrollTo(window.scrollY + dir * 7, { immediate: true });
      }, 16);
    }, 300);

    const handleUp = () => {
      if (!holdRef.current) goToSection(dir);
      stop();
    };
    window.addEventListener('mouseup', handleUp, { once: true });
    window.addEventListener('touchend', handleUp, { once: true });
  }, [lenis, goToSection, stop]);

  return (
    <div
      className="fixed bottom-6 right-6 z-[95] flex flex-col gap-2 transition-opacity duration-500"
      style={{ opacity: visible && !modalOpen ? 1 : 0, pointerEvents: visible && !modalOpen ? "auto" : "none" }}
    >
      {[{ dir: -1, Icon: ChevronUp, label: "Scroll up" }, { dir: 1, Icon: ChevronDown, label: "Scroll down" }].map(({ dir, Icon, label }) => (
        <button
          key={dir}
          onMouseDown={e => {
            e.currentTarget.style.background = "#9E7134";
            e.currentTarget.style.color = "#EDE8DF";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(158, 113, 52,0.2), 0 0 20px rgba(158, 113, 52,0.4)";
            handleDown(dir);
          }}
          onMouseUp={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#EDE8DF";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(158, 113, 52,0.2), 0 0 16px rgba(158, 113, 52,0.35)";
          }}
          onTouchStart={() => handleDown(dir)}
          aria-label={label}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: "transparent",
            color: "rgba(237,232,223,0.5)",
            border: "1.5px solid rgba(158, 113, 52,0.4)",
            opacity: dir === 1 && atBottom ? 0 : 1,
            pointerEvents: dir === 1 && atBottom ? "none" : "auto",
            transition: "opacity 0.4s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "#9E7134";
            e.currentTarget.style.color = "#EDE8DF";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(158, 113, 52,0.2), 0 0 16px rgba(158, 113, 52,0.35)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(158, 113, 52,0.4)";
            e.currentTarget.style.color = "rgba(237,232,223,0.5)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <Icon size={15} />
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const lenisRef = useRef();
  const [quoteItems, setQuoteItems] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      setQuoteItems((prev) => {
        const exists = prev.some(
          (p) => p.name === e.detail.name && p.size?.id === e.detail.size?.id && p.material?.id === e.detail.material?.id
        );
        return exists ? prev : [...prev, e.detail];
      });
    };
    window.addEventListener("quote-add", handler);
    return () => window.removeEventListener("quote-add", handler);
  }, []);

  const removeQuoteItem = useCallback((id) => {
    setQuoteItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearQuoteItems = useCallback(() => {
    setQuoteItems([]);
  }, []);

  useEffect(() => {
    function onScroll() { ScrollTrigger.update(); }
    lenisRef.current?.lenis?.on("scroll", onScroll);

    function update(time) { lenisRef.current?.lenis?.raf(time * 1000); }
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    const timeout = setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => {
      lenisRef.current?.lenis?.off("scroll", onScroll);
      gsap.ticker.remove(update);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ autoRaf: false, lerp: 0.1, syncTouch: false, anchors: true }}
    >
      <Navbar quoteCount={quoteItems.length} />
      <main>
        <Hero />
        <StudioBio />
        <Suspense fallback={null}><Gallery /></Suspense>
        {/* <About /> */}
        {/* <BespokeCommissions /> */}
        <Suspense fallback={null}><CommissionsSection /></Suspense>
        <Process />
        <Services />
        <Contact
          quoteItems={quoteItems}
          onRemoveQuoteItem={removeQuoteItem}
          onQuoteSubmitted={clearQuoteItems}
        />
      </main>
      <Suspense fallback={null}><DiscoverPortals /></Suspense>
      <Footer />
      <ScrollArrows />
      <ChatWidget />
    </ReactLenis>
  );
}
