const STATS = [
  { _id: "1", value: "99.984%", label: "QUALITY YIELD RATE", code: "6-SIGMA CONFORMANCE" },
  { _id: "2", value: "110+", label: "CASINGS DELIVERED", code: "M250 MARAGING STEEL" },
  { _id: "3", value: "25+ YRS", label: "FLIGHT-PROVEN HERITAGE", code: "ESTABLISHED IN 2000" },
  { _id: "4", value: "< 5µm", label: "MACHINING PRECISION", code: "SUB-MICRON METROLOGY" },
  { _id: "5", value: "1,20,000", label: "SQ.FT FACILITY FOOTPRINT", code: "UNIT I, II & III" },
  { _id: "6", value: "ISO 8", label: "CLEAN ROOM", code: "WELDING FACILITY" },
];

export function VerificationProofStrip() {
  const stats = STATS;

  return (
    <section className="bg-[#050505] border-b border-white/[0.06] py-1 relative">
      <div className="absolute inset-0 bg-[#0d0f12]/5 pointer-events-none" />
      
      <div className="px-[100px]">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y divide-white/[0.06] md:divide-y-0 lg:divide-x border-l border-r border-white/[0.06] bg-[#0d0f12]/10">
          {stats.map((s, idx) => (
            <div
              key={s._id}
              className="px-6 py-7 flex flex-col gap-1.5 text-left font-tech relative group hover:bg-[#0d0f12]/25 transition-all duration-500"
            >
              {/* Corner accent details */}
              <div className="absolute top-1 left-1 w-1 h-1 bg-blueprint/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
              
              <span className="text-blueprint text-[9px] tracking-[0.2em] font-semibold">
                SYS_PROOF_0{idx + 1}
              </span>
              {/* normal-case (not uppercase): CSS uppercase maps the micro sign
                  µ → Μ (Greek capital Mu), making "5µm" read as "5MM". Values are
                  already authored in uppercase, so nothing else changes. */}
              <span className="font-sans font-bold text-white text-2xl lg:text-[28px] tracking-tight normal-case mt-1">
                {s.value}
              </span>
              <span className="text-white/80 text-[9px] tracking-[0.15em] uppercase mt-0.5">
                {s.label}
              </span>
              <span className="text-blueprint-dim text-[9px] tracking-[0.1em] uppercase mt-0.5 opacity-60">
                {s.code}
              </span>
            </div>
          ))}
      </div>
      </div>
    </section>
  );
}
