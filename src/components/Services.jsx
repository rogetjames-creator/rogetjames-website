import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Hexagon, Gem, Layers } from "lucide-react";
const openColourCatalogue = (tab) =>
  window.dispatchEvent(new CustomEvent("open-colour-catalogue", { detail: tab }));

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    icon: Hexagon,
    title: "Catalogue Designs",
    subtitle: "Ready to Specify",
    description:
      "Browse our extensive catalogue of original design templates. Wall art, screens, sculpture, light features & mirrors. Available in standard sizes or custom sized.",
    features: [
      "Corten steel or powdercoated aluminium",
      { text: "Custom colour selection", colours: true },
      "Standard + custom sizing",
      "Australia-wide delivery",
    ],
    cta: "View Catalogues",
    ctaCatalogues: true,
    featured: false,
    texture: "/images/concrete-texture.jpg",
  },
  {
    icon: Gem,
    title: "Bespoke Design",
    subtitle: "Crafting a Vision",
    description:
      "Commission a completely original piece.",
    features: [
      "Original design creation",
      "In-situ rendering previews",
      "Multi-medium: steel, stone, concrete, wood",
      "Project coordination",
    ],
    cta: "Start a Commission",
    featured: true,
  },
  {
    icon: Layers,
    title: "Commercial & Public Art",
    subtitle: "Architectural Scale",
    description:
      "Large-scale fabrications for commercial and residential developments. From concept through fabrication to install.",
    features: [
      "Homebase — Landscape Design & Features",
      "Kings Park — Frasers Restaurant",
      "Cottesloe Hotel — MJA Architects",
      "Centennial Park",
      "Fiona Stanley Hospital",
    ],
    cta: "Discuss a Project",
    featured: false,
    texture: "/images/brick-texture.jpg",
  },
];

const CATALOGUES = ["Wall Art & Screens", "Sculpture, Light Features & Mirrors"];

const openCatalogue = (label) =>
  window.dispatchEvent(new CustomEvent("open-catalogue", { detail: label }));

export default function Services() {
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);
  const [catPopover, setCatPopover] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".services-header",
        { opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".services-header",
            start: "top 88%",
            toggleActions: "play none none none",
          },
          opacity: 1, duration: 1.6, ease: "sine.inOut",
        }
      );

      const serviceCards = gsap.utils.toArray(".service-card", cardsRef.current);
      gsap.set(".service-underline", { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      // Left to right — each card waits for the previous to fully appear
      tl.fromTo(
        serviceCards,
        { opacity: 0 },
        { opacity: 1, duration: 1.6, stagger: 1.6, ease: "sine.inOut" }
      );

      // Underline sweeps — card i finishes at: i * 1.6 + 1.6
      serviceCards.forEach((card, i) => {
        const ul = card?.querySelector(".service-underline");
        if (!ul) return;
        const t = i * 1.6 + 1.6;
        tl.to(ul, { scaleX: 1, duration: 0.55, ease: "power2.out" }, t);
        tl.to(ul, { x: 200, opacity: 0, duration: 0.45, ease: "power2.in" }, t + 0.7);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="relative py-20 md:py-32 bg-pewter overflow-hidden">

      {/* Limewash — uneven tonal wash patches */}
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

      {/* Limewash — chalky grain texture */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
        mixBlendMode: "soft-light",
        opacity: 0.14,
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="services-header text-center mb-16">
          <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <span className="bespoke-ring-1 absolute w-20 h-20 rounded-full border border-white/30" />
            <span className="bespoke-ring-2 absolute w-20 h-20 rounded-full border border-white/20" />
            <span className="bespoke-ring-3 absolute w-20 h-20 rounded-full border border-white/12" />
            <img src="/images/roj-logo.png" alt="ROGETjames" className="relative z-10 w-full h-auto" style={{ opacity: 0.5, filter: "drop-shadow(0px 5px 0px rgba(0,0,0,0.55))" }} />
          </div>
          <span className="font-detail text-xs text-warm-gray uppercase tracking-[0.2em]">
            Custom Services
          </span>
          <h2 className="font-syne font-bold text-2xl md:text-4xl lg:text-5xl text-cream/60 tracking-tight mt-3">
            Three Paths{" "}
            <span className="text-cream/60">Forward</span>
          </h2>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="service-card group bg-black border border-white/25 hover:border-white/45 hover:bg-white/5 rounded-[2rem] p-5 md:p-8 lg:p-10 flex flex-col transition-all duration-500"
                style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.55), 0 2px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)" }}
              >
                <div className="flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 transition-colors duration-500 group-hover:bg-clay/10 group-hover:border group-hover:border-clay/30">
                    <Icon size={18} className="text-clay transition-colors duration-500 group-hover:text-clay-light" />
                  </div>
                  <span className="font-detail text-xs uppercase tracking-wider text-cream/50 transition-colors duration-500 group-hover:text-cream/80">
                    {service.subtitle}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-xl md:text-2xl mb-3 text-cream/75 transition-colors duration-500 group-hover:text-cream">
                  <span className="relative inline-block">
                    {service.title}
                    <span className="service-underline" style={{ position: "absolute", bottom: "-2px", left: 0, right: 0, height: "1px", background: "rgba(242,240,233,0.35)", display: "block", transformOrigin: "left center", transform: "scaleX(0)" }} />
                  </span>
                </h3>
                <p className="text-sm leading-relaxed mb-6 text-cream/70 transition-colors duration-500 group-hover:text-cream/90">
                  {service.description}
                </p>

                <ul className="flex-1 space-y-2 mb-8">
                  {service.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-cream/60 transition-colors duration-500 group-hover:text-cream/80">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-clay" />
                      {typeof f === "string" ? f : (
                        <>
                          {f.text}{" "}
                          <button onClick={() => openColourCatalogue("dulux")} className="text-clay underline underline-offset-2 hover:text-cream transition-colors">Dulux</button>
                          {" & "}
                          <button onClick={() => openColourCatalogue("interpon")} className="text-clay underline underline-offset-2 hover:text-cream transition-colors">Interpon</button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>

                {service.ctaCatalogues ? (
                  <div className="relative">
                    <button
                      onClick={() => setCatPopover((o) => !o)}
                      className="btn-magnetic btn-service-cta inline-flex items-center justify-center w-full py-3 px-6 rounded-full text-sm font-semibold tracking-wide text-cream bg-black/20 shadow-[0_2px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.3)] hover:bg-black/30"
                    >
                      <span className="btn-bg rounded-full bg-black/30" />
                      <span className="relative z-10">{service.cta}</span>
                    </button>
                    {catPopover && (
                      <div className="absolute bottom-full mb-2 left-0 right-0 rounded-2xl bg-charcoal/95 border border-white/10 overflow-hidden backdrop-blur-sm shadow-xl z-20">
                        {CATALOGUES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => { openCatalogue(cat); setCatPopover(false); }}
                            className="w-full text-left px-5 py-3 text-sm font-detail text-cream/80 hover:text-cream hover:bg-white/5 transition-colors"
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href="#contact"
                    className="btn-magnetic btn-service-cta inline-flex items-center justify-center py-3 px-6 rounded-full text-sm font-semibold tracking-wide text-cream bg-black/20 shadow-[0_2px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.3)] hover:bg-black/30"
                  >
                    <span className={`btn-bg rounded-full ${service.featured ? "bg-black/30" : "bg-black/30"}`} />
                    <span className="relative z-10">{service.cta}</span>
                  </a>
                )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}

