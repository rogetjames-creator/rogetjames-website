import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Circle, Triangle, Octagon, Square } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    num: "01",
    icon: Circle,
    title: "Enquire",
    description: [
      "Choose from our catalogue of original designs or commission a bespoke piece.",
      "Fill in your design preferences, dimensions, material choice and postcode.",
      "We'll respond within 48 hours.",
    ],
    detail: "Corten Steel — rust finish",
    detailLink: "Aluminium Powdercoated",
    color: "bg-moss",
  },
  {
    num: "02",
    icon: Triangle,
    title: "Design",
    description: [
      "Wish to see our designs in your space, let us know the details.",
      "Looking for an original bespoke concept and fabrication, contact us with details.",
    ],
    detail: "Fees may apply.",
    color: "bg-clay",
  },
  {
    num: "03",
    icon: Octagon,
    title: "Fabricate",
    description: [
      "Precision laser-cut, fabrications and finishes through our WA, VIC, and QLD workshops.",
      "Diligently packed for careful delivery.",
    ],
    detail: "Production lead time:\n3 – 6 weeks.",
    color: "bg-charcoal",
  },
  {
    num: "04",
    icon: Square,
    title: "Deliver",
    description: [
      "Australia-wide delivery to your door.",
      "Installation available in WA via Hederablu commercial fitouts.",
    ],
    detail: "Direct sales — nationally\nand internationally.",
    color: "bg-moss-dark",
  },
];

export default function Process() {
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".process-header",
        { opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".process-header",
            start: "top 88%",
            toggleActions: "play none none none",
          },
          opacity: 1, duration: 1.6, ease: "sine.inOut",
        }
      );

      gsap.set(".process-underline", { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      const procCards = gsap.utils.toArray(".process-card", cardsRef.current);
      const isMob = window.innerWidth < 768;

      procCards.forEach((card, i) => {
        const fromX = i % 2 === 0 ? (isMob ? -30 : -160) : (isMob ? 30 : 160);
        const cardStart = i * 1.4;
        const cardEnd = cardStart + 1.3;

        tl.fromTo(card,
          { x: fromX, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.3, ease: "sine.inOut", force3D: true },
          cardStart
        );

        const ul = card.querySelector(".process-underline");
        if (ul) {
          tl.to(ul, { scaleX: 1, duration: 0.5, ease: "power2.out" }, cardEnd + 0.1);
          tl.to(ul, { x: 200, opacity: 0, duration: 0.4, ease: "power2.in" }, cardEnd + 0.7);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="process" ref={sectionRef} className="relative pt-20 pb-8 md:pt-28 md:pb-14 bg-graphite overflow-hidden">

      {/* Limewash — tonal wash patches */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: [
          "radial-gradient(ellipse 90% 55% at 10% 15%, rgba(255,255,255,0.05) 0%, transparent 65%)",
          "radial-gradient(ellipse 60% 80% at 90% 70%, rgba(255,255,255,0.04) 0%, transparent 60%)",
          "radial-gradient(ellipse 50% 50% at 55% 5%,  rgba(0,0,0,0.06) 0%, transparent 55%)",
          "radial-gradient(ellipse 70% 40% at 22% 90%, rgba(255,255,255,0.04) 0%, transparent 52%)",
          "radial-gradient(ellipse 45% 65% at 75% 30%, rgba(0,0,0,0.05) 0%, transparent 50%)",
          "radial-gradient(ellipse 55% 45% at 40% 55%, rgba(255,255,255,0.03) 0%, transparent 48%)",
          "radial-gradient(ellipse 35% 35% at 65% 80%, rgba(0,0,0,0.04) 0%, transparent 45%)",
        ].join(", "),
      }} />
      {/* Limewash — chalky grain */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
        mixBlendMode: "soft-light",
        opacity: 0.14,
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="process-header mb-6 text-center">
          <span className="font-detail text-xs text-warm-gray uppercase tracking-[0.2em]">
            How It Works
          </span>
          <h2 className="font-syne font-bold text-2xl md:text-4xl lg:text-5xl text-cream/60 tracking-tight mt-3">
            The <span className="text-cream/60">Protocol</span>
          </h2>
          <p className="font-detail text-warm-gray text-[10px] max-w-xl mt-4 leading-relaxed mx-auto uppercase tracking-[0.2em]">
            From first enquiry to delivered artwork.
          </p>
        </div>

        {/* Horizontal plates — centred column */}
        <div ref={cardsRef} className="flex flex-col gap-3 max-w-3xl mx-auto">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="process-card w-full bg-white/5 rounded-[2rem] border border-white/10 px-7 py-6 md:px-10 md:py-7 flex flex-col md:flex-row md:items-center gap-5 md:gap-8 hover:border-white/25 transition-colors duration-700"
                style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.55), 0 2px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)" }}
              >
                {/* Icon + number */}
                <div className="flex md:flex-col items-center gap-3 md:gap-2 flex-none md:w-12">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-none">
                    <Icon size={17} className="text-clay" />
                  </div>
                  <span className="font-detail text-xs text-warm-gray/60 tracking-widest">{step.num}</span>
                </div>

                {/* Divider — desktop only */}
                <div className="hidden md:block w-px self-stretch bg-white/10 flex-none" />

                {/* Title + description */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-lg text-cream/80 mb-2">
                    <span className="relative inline-block">
                      {step.title}
                      <span
                        className="process-underline"
                        style={{
                          position: "absolute", bottom: "-2px", left: 0, right: 0,
                          height: "1px", background: "rgba(242,240,233,0.35)",
                          display: "block", transformOrigin: "left center", transform: "scaleX(0)",
                        }}
                      />
                    </span>
                  </h3>
                  <ul className="space-y-1 mt-0.5">
                    {step.description.map((line, i) => (
                      <li key={i} className="flex items-start gap-2 text-warm-gray text-sm leading-relaxed">
                        <span className="w-1 h-1 rounded-full bg-clay mt-2 flex-shrink-0" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Detail — right column */}
                {(step.detail || step.detailLink) && (
                  <div className="md:w-48 flex-none md:border-l md:border-white/10 md:pl-8">
                    {step.detail && (
                      <p className="font-detail text-xs text-clay leading-relaxed whitespace-pre-line">{step.detail}</p>
                    )}
                    {step.detailLink && (
                      <button
                        onClick={() => window.dispatchEvent(new CustomEvent("open-colour-catalogue", { detail: "dulux" }))}
                        className="font-detail text-xs text-clay underline underline-offset-2 hover:text-cream transition-colors block mt-0.5"
                      >
                        {step.detailLink}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
