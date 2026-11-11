export default function StudioBio() {
  return (
    <section className="relative bg-ink py-[88px] md:py-[144px] overflow-hidden">
      <div aria-hidden="true" className="absolute inset-x-0 top-10 bottom-10 md:top-16 md:bottom-16 bg-cover bg-center" style={{ backgroundImage: "radial-gradient(ellipse 60% 100% at 0% 45%, rgba(119,96,77,0.45), rgba(119,96,77,0) 70%), linear-gradient(to bottom right, #77604d 0%, #6e5b48 10%, #655243 20%, #56483b 30%, #4c4035 40%, #40362e 50%, #342d29 60%, #2a2421 70%, #201c1a 80%, #181516 90%, #0f0f0f 100%)" }} />

      <div className="relative z-10 max-w-2xl mx-auto px-6 md:px-12 text-center">
        <div className="studio-bio-inner flex flex-col items-center gap-0">

          <span className="font-detail text-xs text-clay uppercase tracking-[0.2em]">Est. 2008</span>

          <h2 className="font-syne font-bold text-xl md:text-3xl tracking-tight mt-3">
            <span className="uppercase text-cream">Roget</span><span className="lowercase text-cream/60">James</span>
          </h2>

          <p className="text-cream/70 text-base leading-relaxed mt-8">
            ROGETjames is the creative practice of Australian multidisciplinary artist and designer James Roget.
          </p>

          <p className="text-cream/70 text-base leading-relaxed mt-5">
            With more than three decades of experience creating original laser-cut metal sculpture, public art, architectural features and bespoke installations, Roget’s practice brings together artistic expression, architectural integration and an innovative approach to materials and form.
          </p>

          <p className="text-cream/70 text-base leading-relaxed mt-5">
            Through Q DESIGN Architectural Features and subsequently ROGETjames, his portfolio spans public art commissions at Centennial Park and Fiona Stanley Hospital, Perth’s Homebase Design Centre, prominent commercial and hospitality venues, display homes and significant private residences.
          </p>

          <p className="text-cream/70 text-base leading-relaxed mt-5">
            Collaborating with architects, landscape architects, interior designers, developers and private clients, ROGETjames creates distinctive, original works conceived specifically for their architectural and environmental settings. Based in Perth, Brisbane and Melbourne, it delivers throughout Australia and internationally.
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
