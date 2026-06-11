import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ABOUT_DRIFT = [
      { el: ".about-practice-label", x: -60, y: -20, delay: 0.2  },
      { el: ".about-practice-para1", x: 80,  y: 0,   delay: 0.5  },
      { el: ".about-practice-para2", x: -60, y: 30,  delay: 0.85 },
    ];

    ABOUT_DRIFT.forEach(({ el, x, y }) => gsap.set(el, { x, y, opacity: 0 }));

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 75%",
      once: true,
      onEnter: () => {
        ABOUT_DRIFT.forEach(({ el, x, y, delay }) => {
          gsap.fromTo(el,
            { x, y, opacity: 0 },
            { x: 0, y: 0, opacity: 1, duration: 1.6, delay, ease: "power2.out" }
          );
        });
      },
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-jet pt-24 md:pt-32"
      style={{ paddingBottom: "260px" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-2xl">
          <div className="about-practice-label font-detail text-xs text-cream/90 uppercase tracking-[0.2em]">
            The Practice
          </div>
          <p className="about-practice-para1 text-cream/65 text-xl md:text-2xl lg:text-3xl font-heading font-bold leading-tight mt-8">
            Our work lives in two worlds — an evolving catalogue of{" "}
            <span className="text-cream/90">signature designs</span>{" "}
            and fully bespoke commissions crafted{" "}
            <span className="text-cream/90">for the spaces they will define.</span>
          </p>
          <div className="about-practice-para2 max-w-md">
            <p className="text-cream/65 text-base mt-8 leading-relaxed">
              Drawing from{" "}<span className="text-cream/90">nature</span>{", "}
              the study and appreciation of{" "}<span className="text-cream/90">cultural</span>{" "}forms and{" "}<span className="text-cream/90">patterns</span>{", "}
              sculptural inspirations and an active{" "}<span className="text-cream/90">imagination.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
