import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StudioBio() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reset = () => {
        gsap.killTweensOf(".studio-bio-label, .studio-bio-para1, .studio-bio-para2, .studio-bio-tag1, .studio-bio-tag2");
        gsap.set(".studio-bio-label",  { opacity: 0 });
        gsap.set(".studio-bio-para1",  { opacity: 0 });
        gsap.set(".studio-bio-para2",  { opacity: 0 });
        gsap.set(".studio-bio-tag1",   { opacity: 0, x: -40 });
        gsap.set(".studio-bio-tag2",   { opacity: 0, x:  40 });
      };

      const play = () => {
        gsap.to(".studio-bio-label",  { opacity: 1, duration: 0.4, delay: 0.0,  ease: "power1.out" });
        gsap.to(".studio-bio-para1",  { opacity: 1, duration: 3.0, delay: 0.35, ease: "power1.out" });
        gsap.to(".studio-bio-para2",  { opacity: 1, duration: 3.0, delay: 1.2,  ease: "power1.out" });
        gsap.to(".studio-bio-tag1",   { opacity: 1, x: 0, duration: 2.2, delay: 3.8, ease: "power2.out" });
        gsap.to(".studio-bio-tag2",   { opacity: 1, x: 0, duration: 2.2, delay: 4.5, ease: "power2.out" });
      };

      reset();

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        onEnter:     () => { reset(); play(); },
        onLeaveBack: () => reset(),
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-charcoal py-12 md:py-20 overflow-hidden">

      {/* Limewash — tonal wash patches (subtle) */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: [
          "radial-gradient(ellipse 90% 55% at 10% 15%, rgba(255,255,255,0.05) 0%, transparent 65%)",
          "radial-gradient(ellipse 60% 80% at 90% 70%, rgba(255,255,255,0.04) 0%, transparent 60%)",
          "radial-gradient(ellipse 50% 50% at 55% 5%,  rgba(0,0,0,0.06) 0%, transparent 55%)",
          "radial-gradient(ellipse 70% 40% at 22% 90%, rgba(255,255,255,0.04) 0%, transparent 52%)",
          "radial-gradient(ellipse 45% 65% at 75% 30%, rgba(0,0,0,0.05) 0%, transparent 50%)",
        ].join(", "),
      }} />
      {/* Limewash — chalky grain (subtle) */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
        mixBlendMode: "soft-light",
        opacity: 0.15,
      }} />

      <div className="relative z-10 max-w-2xl mx-auto px-6 md:px-12 text-center">
        <div className="studio-bio-inner flex flex-col items-center gap-0">

          <span className="studio-bio-label font-detail text-xs text-clay uppercase tracking-[0.2em]">Est. 2008</span>

          <h2 className="font-syne font-bold text-xl md:text-3xl tracking-tight mt-3">
            <span className="uppercase text-cream">Roget</span><span className="lowercase text-cream/60">James</span>
          </h2>

          <p className="studio-bio-para1 text-cream/70 text-base leading-relaxed mt-8">
            With over 18 years in laser-cut design, James created and led Q DESIGN Architectural Features — one of Australia's top-tier laser art companies — from 2008 to 2015, before establishing his independent studio, to focus on evolving a more artistic approach to the medium.
          </p>

          <p className="studio-bio-para2 text-cream/70 text-base leading-relaxed mt-5">
            Today, ROGETjames operates from Perth, the Gold Coast and Melbourne, delivering original designs, a ready-to-specify product line, and bespoke design services for Architects, Designers and discerning clients,<br />throughout Australia and internationally.
          </p>

          <div className="mt-10 pt-6 border-t border-cream/10 w-full space-y-1.5">
            <p className="studio-bio-tag1 font-detail font-semibold text-xs text-clay uppercase tracking-wider">
              Architecture · Landscapes · Interiors
            </p>
            <p className="studio-bio-tag2 font-detail font-semibold text-xs text-clay uppercase tracking-wider" style={{ wordSpacing: "0.4em" }}>
              Commercial — Residential
            </p>
          </div>

        </div>
      </div>

    </section>
  );
}
