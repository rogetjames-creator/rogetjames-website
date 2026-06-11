import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Card 1: Diagnostic Shuffler ─────────── */
function ShufflerCard() {
  const [cards, setCards] = useState([
    { label: "Wall Art & Sculpture", color: "bg-moss" },
    { label: "Screens & Gates", color: "bg-clay" },
    { label: "Fire & Light Features", color: "bg-charcoal" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards((prev) => {
        const next = [...prev];
        next.unshift(next.pop());
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="feature-card bg-cream rounded-[2rem] border border-charcoal/5 p-8 md:p-10 hover:shadow-xl transition-shadow duration-500">
      <span className="font-detail text-xs text-warm-gray uppercase tracking-[0.2em]">
        Product Range
      </span>
      <h3 className="font-heading font-bold text-xl text-charcoal mt-3 mb-2">
        Diverse Catalogue
      </h3>
      <p className="text-warm-gray text-sm mb-8 leading-relaxed">
        Over 60 original designs across wall art, sculpture, architectural
        screens, gates, fencing, and fire features.
      </p>

      <div className="relative h-36">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className={`absolute inset-x-0 ${card.color} rounded-2xl px-5 py-4 text-cream font-heading font-semibold text-sm shadow-lg`}
            style={{
              top: i * 14,
              zIndex: cards.length - i,
              transform: `scale(${1 - i * 0.04})`,
              opacity: 1 - i * 0.2,
              transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <span className="font-detail text-xs text-cream/50 block mb-1">
              {String(i + 1).padStart(2, "0")}
            </span>
            {card.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Card 2: Telemetry Typewriter ────────── */
function TypewriterCard() {
  const messages = [
    "BANKSIA screen → 1800×900mm Corten steel",
    "GRAIL gate → Double frame, auto hinges",
    "GREN Edge wall art → Powdercoated aluminium",
    "REEDS of UNGARO → Fire sculpture, Adelaide",
    "AUTUMN LEAF → Bespoke commission, Perth",
    "VUELTA screen → Aquilla Homes display",
  ];
  const [text, setText] = useState("");
  const [msgIdx, setMsgIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    const msg = messages[msgIdx];
    if (charIdx < msg.length) {
      const timeout = setTimeout(() => {
        setText(msg.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      }, 40);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setMsgIdx((m) => (m + 1) % messages.length);
        setCharIdx(0);
        setText("");
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [charIdx, msgIdx]);

  return (
    <div className="feature-card bg-cream rounded-[2rem] border border-charcoal/5 p-8 md:p-10 hover:shadow-xl transition-shadow duration-500">
      <div className="flex items-center gap-2 mb-3">
        <span className="relative flex h-2 w-2">
          <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-clay opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-clay" />
        </span>
        <span className="font-detail text-xs text-clay uppercase tracking-[0.2em]">
          Live Feed
        </span>
      </div>
      <h3 className="font-heading font-bold text-xl text-charcoal mt-1 mb-2">
        Material Precision
      </h3>
      <p className="text-warm-gray text-sm mb-8 leading-relaxed">
        Every piece is precision laser-cut and finished through a multi-stage
        process: acid dip, epoxy prime, and powder coat.
      </p>

      <div className="bg-charcoal rounded-xl p-4 min-h-[80px] flex items-start">
        <span className="font-detail text-xs text-cream/70 leading-relaxed">
          {text}
          <span className="type-cursor inline-block w-[2px] h-3.5 bg-clay ml-0.5 align-middle" />
        </span>
      </div>
    </div>
  );
}

/* ─── Card 3: Cursor Protocol Scheduler ───── */
function SchedulerCard() {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const [activeDay, setActiveDay] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: -20, y: -20 });
  const [showCursor, setShowCursor] = useState(false);
  const [saved, setSaved] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    const runAnimation = () => {
      const targetDay = Math.floor(Math.random() * 5) + 1;

      setShowCursor(true);
      setSaved(false);
      setActiveDay(null);

      // Animate cursor to day
      setTimeout(() => setCursorPos({ x: targetDay * 40 + 10, y: 25 }), 300);
      setTimeout(() => setActiveDay(targetDay), 800);
      // Animate cursor to save
      setTimeout(() => setCursorPos({ x: 130, y: 70 }), 1400);
      setTimeout(() => setSaved(true), 1900);
      setTimeout(() => setShowCursor(false), 2500);
    };

    runAnimation();
    const interval = setInterval(runAnimation, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="feature-card bg-cream rounded-[2rem] border border-charcoal/5 p-8 md:p-10 hover:shadow-xl transition-shadow duration-500">
      <span className="font-detail text-xs text-warm-gray uppercase tracking-[0.2em]">
        Consultation Booking
      </span>
      <h3 className="font-heading font-bold text-xl text-charcoal mt-3 mb-2">
        Site-Specific Process
      </h3>
      <p className="text-warm-gray text-sm mb-8 leading-relaxed">
        Every project begins with understanding your space. We design
        collaboratively — not decoratively.
      </p>

      <div ref={gridRef} className="relative bg-charcoal/3 rounded-xl p-4">
        {/* Animated cursor */}
        {showCursor && (
          <svg
            className="absolute z-20 transition-all duration-500 ease-out"
            style={{ left: cursorPos.x, top: cursorPos.y }}
            width="16"
            height="20"
            viewBox="0 0 16 20"
            fill="none"
          >
            <path
              d="M1 1L1 15L5 11L9 19L12 17.5L8 10L13 10L1 1Z"
              fill="#C45018"
              stroke="#fff"
              strokeWidth="1"
            />
          </svg>
        )}

        <div className="grid grid-cols-7 gap-1 mb-3">
          {days.map((day, i) => (
            <div
              key={i}
              className={`w-9 h-9 rounded-lg flex items-center justify-center font-detail text-xs transition-all duration-300 ${
                activeDay === i
                  ? "bg-clay text-cream scale-95"
                  : "bg-charcoal/5 text-charcoal/40"
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <div
            className={`px-4 py-1.5 rounded-lg font-detail text-xs transition-all duration-300 ${
              saved
                ? "bg-moss text-cream"
                : "bg-charcoal/5 text-charcoal/30"
            }`}
          >
            {saved ? "Confirmed" : "Save"}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Features Section ────────────────────── */
export default function Features() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".features-header", {
        scrollTrigger: {
          trigger: ".features-header",
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.utils.toArray(".feature-card").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          y: 60,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.15,
          ease: "power3.out",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-cream-dark">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="features-header mb-12 md:mb-16">
          <span className="font-detail text-xs text-warm-gray uppercase tracking-[0.2em]">
            Why ROGETjames
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-5xl lg:text-6xl text-charcoal mt-3">
            Functional{" "}
            <span className="font-drama italic text-clay">Artifacts</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          <ShufflerCard />
          <TypewriterCard />
          <SchedulerCard />
        </div>
      </div>
    </section>
  );
}
