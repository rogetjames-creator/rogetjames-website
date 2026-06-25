import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef      = useRef(null);
  const triggerRef      = useRef(null);
  const lineLeftRef     = useRef(null);
  const lineRightRef    = useRef(null);
  const playRef         = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".ab-label",     { y: -10, opacity: 0 });
      gsap.set(".ab-p1-bright", { x: 28,  opacity: 0 });
      gsap.set(".ab-p1-dim",    { opacity: 0 });
      gsap.set(".ab-p2-bright", { x: 28,  opacity: 0 });
      gsap.set(".ab-p2-dim",    { opacity: 0 });
      gsap.set(lineLeftRef.current,     { scaleX: 0 });
      gsap.set(lineRightRef.current,    { scaleX: 0 });

      playRef.current = () => {
        gsap.to(lineLeftRef.current,  { scaleX: 1, duration: 1.1, ease: "power3.out" });
        gsap.to(lineRightRef.current, { scaleX: 1, duration: 1.1, ease: "power3.out" });
        gsap.to(".ab-label",     { y: 0, opacity: 1, duration: 1.8, ease: "power1.out" });
        gsap.to(".ab-p1-bright", { x: 0, opacity: 1, duration: 3.2, stagger: 0.45, ease: "power1.out", delay: 0.4 });
        gsap.to(".ab-p1-dim",    { opacity: 1, duration: 1.6, stagger: 0.28, ease: "power1.out", delay: 3.2 });
        gsap.to(".ab-p2-bright", { x: 0, opacity: 1, duration: 3.2, stagger: 0.45, ease: "power1.out", delay: 9.0 });
        gsap.to(".ab-p2-dim",    { opacity: 1, duration: 4.2, stagger: 0.65, ease: "power1.out", delay: 12.5 });
      };

      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: "top bottom",
        once: true,
        onEnter: () => playRef.current?.(),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="bg-jet py-24 md:py-32">
      <div className="flex flex-col items-center px-8 text-center">

        {/* Logo + flanking lines */}
        <div className="relative flex items-center justify-center overflow-visible" style={{ width: "80px", height: "80px" }}>
          <span ref={lineLeftRef} style={{
            position: "absolute", right: "calc(100% + 10px)", top: "50%", marginTop: "-0.75px",
            width: "90px", height: "1.5px",
            background: "rgba(242,240,233,0.35)",
            transformOrigin: "right center",
            transform: "scaleX(0)",
          }} />
          <span ref={lineRightRef} style={{
            position: "absolute", left: "calc(100% + 10px)", top: "50%", marginTop: "-0.75px",
            width: "90px", height: "1.5px",
            background: "rgba(242,240,233,0.35)",
            transformOrigin: "left center",
            transform: "scaleX(0)",
          }} />
          <img src="/images/roj-logo.png?v=2" alt="ROGETjames" className="relative z-10 w-full h-auto" width="3035" height="3035"
            style={{ opacity: 0.5, filter: "drop-shadow(0px 5px 0px rgba(0,0,0,0.55))" }} />
        </div>

        {/* Label */}
        <div className="ab-label pt-4">
          <span className="font-detail text-xs text-cream/90 uppercase tracking-[0.2em]">The Practice</span>
        </div>

        {/* Para 1 */}
        <div className="max-w-2xl pt-8">
          <p className="text-lg md:text-2xl font-heading font-bold leading-tight" style={{ wordSpacing: "0.22em" }}>
            {"Our work lives in two worlds — an evolving catalogue of".split(" ").map((word, i) => (
              <span key={`a${i}`} className="ab-p1-dim inline-block text-cream/40">{word}&thinsp;</span>
            ))}
            {" "}<span className="ab-p1-bright inline-block text-cream/90">signature designs</span>{" "}
            {"and fully bespoke commissions crafted".split(" ").map((word, i) => (
              <span key={`b${i}`} className="ab-p1-dim inline-block text-cream/40">{word}&thinsp;</span>
            ))}
            {" "}<span className="ab-p1-bright inline-block text-cream/90">for the spaces they will define.</span>
          </p>
        </div>

        {/* Para 2 */}
        <div className="max-w-2xl mt-8">
          <p className="text-lg md:text-2xl font-heading font-bold leading-tight text-cream/65" style={{ wordSpacing: "0.22em" }}>
            <span className="ab-p2-bright inline-block text-cream">Drawing from</span>
            <span className="ab-p2-dim inline">{" "}</span>
            <span className="ab-p2-bright inline-block text-cream">nature</span>
            <span className="ab-p2-dim inline">{", "}the study and appreciation of{" "}</span>
            <span className="ab-p2-bright inline-block text-cream">cultural forms and patterns</span>
            <span className="ab-p2-dim inline">{", "}sculptural inspirations{" "}</span>
            <span className="ab-p2-bright inline-block text-cream">and an active imagination.</span>
          </p>
        </div>

        {/* Scroll trigger sentinel */}
        <div ref={triggerRef} style={{ height: "1px", marginTop: "60px" }} />
      </div>
    </section>
  );
}
