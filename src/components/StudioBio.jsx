export default function StudioBio() {
  return (
    <section className="relative bg-ink py-12 md:py-20 overflow-hidden">

      <div className="relative z-10 max-w-2xl mx-auto px-6 md:px-12 text-center">
        <div className="studio-bio-inner flex flex-col items-center gap-0">

          <span className="font-detail text-xs text-clay uppercase tracking-[0.2em]">Est. 2008</span>

          <h2 className="font-syne font-bold text-xl md:text-3xl tracking-tight mt-3">
            <span className="uppercase text-cream">Roget</span><span className="lowercase text-cream/60">James</span>
          </h2>

          <p className="text-cream/70 text-base leading-relaxed mt-8">
            With over 18 years designing and creating art features, James established and led Q Design Architectural Features — one of Australia's top-tier laser art companies — from 2008 to 2015, before establishing an independent studio, to bring to focus a more evolving artistic approach to the medium.
          </p>

          <p className="text-cream/70 text-base leading-relaxed mt-5">
            Today, ROGETjames operates from Perth, the Gold Coast and Melbourne, delivering original designs, a ready-to-specify product line, and bespoke design services for Architects, Designers and discerning clients,<br />throughout Australia and internationally.
          </p>

          <div className="mt-10 pt-6 border-t border-cream/10 w-full space-y-1.5">
            <p className="font-detail font-semibold text-xs text-clay uppercase tracking-wider">
              Architecture · Landscapes · Interiors
            </p>
            <p className="font-detail font-semibold text-xs text-clay uppercase tracking-wider" style={{ wordSpacing: "0.4em" }}>
              Commercial — Residential
            </p>
          </div>

        </div>
      </div>

    </section>
  );
}
