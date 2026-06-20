const STATS = [
  { value: "25+", label: "Years in Service" },
  { value: "1.2L", label: "Sq.ft Facility" },
  { value: "180+", label: "Skilled Engineers" },
  { value: "25T", label: "Crane Capacity" },
  { value: "AS9100D", label: "Certified" },
  { value: "3", label: "Manufacturing Plants" },
];

const TIMELINE = [
  { year: "2000", text: "Established Unit-I with 10,000 sq.ft shop floor under the leadership of C.S.N. Reddy." },
  { year: "2002", text: "First aerostructure RCS delivered to ISRO. Agni-1 & 2 rocket motor casings delivered to DRDO." },
  { year: "2004", text: "First industry to develop the L40 structure for GSLV — successfully delivered to ISRO." },
  { year: "2008", text: "First private sector company to integrate RCS & VTP and deliver to DRDO." },
  { year: "2010", text: "Became lead vendor for PSLV & GSLV auxiliary separation systems. Sagarika series airframes delivered." },
  { year: "2012", text: "Established Unit-II with 70,000 sq.ft — dedicated to DRDO & ISRO programmes." },
  { year: "2014", text: "First Hyderabad-based industry to produce Maraging Steel M250 rocket motor casings Ø740mm for DRDO. Over 100 casings delivered to date." },
  { year: "2019", text: "Airframes, control surfaces and motor casings for Pralay (DRDO) delivered. First unmanned crew module structure to ISRO. LVM3 Core Base Shroud completed." },
  { year: "2023", text: "First metal canister manufacturing facility for DRDO established. PSOXL motor case successfully tested — 90 casings delivered." },
  { year: "2025", text: "Airframes, motor casings and control surface panels delivered for India's first Hypersonic Glide Vehicle." },
  { year: "2026", text: "Unit-III established — 45,000 sq.ft dedicated to global defence manufacturing requirements." },
];

const PLANTS = [
  {
    name: "Unit I",
    area: "60,000 sq.ft",
    plot: "20,370 sq.yards",
    highlights: ["6 shop floor bays", "Crane capacity up to 20T", "Clean room 5,000 sq.ft", "Hydro & pneumatic test rigs"],
  },
  {
    name: "Unit II",
    area: "45,000 sq.ft",
    plot: "14,800 sq.yards",
    highlights: ["DRDO & ISRO dedicated", "Crane capacity 10T × 3", "Auto TIG ISO 8 clean room", "CMM & NDT facility"],
  },
  {
    name: "Unit III",
    area: "45,000 sq.ft",
    plot: "3 acres",
    highlights: ["Global defence focus", "9.5m bay height", "Expanded welding facility", "Commissioned 2026"],
  },
];

const CERTS = [
  { code: "AS 9100D : 2016", name: "Aerospace Quality Management System" },
  { code: "ISO 9001 : 2015", name: "Quality Management System" },
  { code: "ISO 14001 : 2015", name: "Environmental Management System" },
  { code: "ISO 45001 : 2018", name: "Occupational Health & Safety" },
];

const CLIENTS = ["ISRO", "DRDO", "HAL", "BEL", "BDL"];

export default function AboutPage() {
  return (
    <div className="bg-[#0a0a0a] pt-24">

      {/* ── Page hero ── */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px] py-16 lg:py-24">
        <p className="font-tech text-blueprint text-[11px] tracking-[0.2em] uppercase mb-5">
          ABOUT SVAPL
        </p>
        <h1 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-4xl sm:text-5xl lg:text-[58px] xl:text-[64px] leading-[1.05] tracking-[-2px] max-w-4xl mb-8">
          25 years building hardware that cannot fail.
        </h1>
        <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.65)] text-base lg:text-lg leading-relaxed max-w-2xl">
          Sri Venkateswara Aerospace Private Limited was established in 2000 by Shri C.S.N. Reddy in Hyderabad.
          Over two and a half decades we have become one of India's most trusted suppliers of mission-critical
          structures, motor casings, and integrated assemblies for ISRO and DRDO programmes.
        </p>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-t border-b border-rule">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px]">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-rule">
            {STATS.map((s, i) => (
              <div key={s.label} className="px-6 py-8 flex flex-col gap-1.5">
                <span className="font-tech text-blueprint-dim text-[10px] tracking-[0.2em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-tech font-medium text-vellum text-3xl lg:text-4xl tracking-tight tabular-nums">
                  {s.value}
                </span>
                <span className="font-tech text-blueprint-dim text-[11px] tracking-[0.14em] uppercase">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Company story ── */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px] py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="font-tech text-blueprint text-[11px] tracking-[0.2em] uppercase mb-4">OUR STORY</p>
            <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-3xl lg:text-[38px] leading-tight tracking-[-0.8px] mb-6">
              From a single bay to India's frontier defence programmes.
            </h2>
            <div className="space-y-4 font-['Archivo',sans-serif] text-[rgba(234,242,251,0.68)] text-base leading-relaxed">
              <p>
                Founded in Hyderabad's Maheshwaram industrial corridor, SVAPL began with a focus on precision
                welding and machining for India's strategic programmes. Our first delivery — a Reaction Control
                Structure for ISRO — set the standard we have held ever since.
              </p>
              <p>
                Today we are an approved vendor for welding of MDN250, Inconel 718, AA2219, 15CDV6 and
                Maraging Steel M250 for both DRDO and ISRO. We have delivered motor casings, aerostructures,
                canisters, and integrated assemblies across every major Indian launch vehicle and missile
                programme of the last two decades.
              </p>
              <p>
                With Unit-III commissioned in 2026, we are scaling to meet global defence supply chain
                requirements while maintaining the zero-defect delivery record that defines SVAPL.
              </p>
            </div>
          </div>
          <div className="relative h-[400px] lg:h-[520px] rounded-[2px] border border-rule overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1716643863806-989dd76ae093?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="SVAPL manufacturing facility"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="bg-panel py-20 lg:py-28">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px]">
          <p className="font-tech text-blueprint text-[11px] tracking-[0.2em] uppercase mb-4">OUR JOURNEY</p>
          <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-3xl lg:text-[42px] leading-tight tracking-[-1px] mb-16">
            Milestones that built the company.
          </h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[60px] sm:left-[72px] top-0 bottom-0 w-px bg-white/10 hidden sm:block" />

            <div className="flex flex-col gap-0">
              {TIMELINE.map((item, i) => (
                <div key={item.year} className="flex gap-6 sm:gap-10 group">
                  {/* Year */}
                  <div className="shrink-0 w-[60px] sm:w-[72px] pt-1 text-right sm:text-right">
                    <span className="font-['Space_Grotesk',sans-serif] font-bold text-blueprint text-sm tracking-wider">
                      {item.year}
                    </span>
                  </div>
                  {/* Dot */}
                  <div className="hidden sm:flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-blueprint mt-[6px] shrink-0 relative z-10" />
                    {i < TIMELINE.length - 1 && <div className="flex-1 w-px bg-transparent" />}
                  </div>
                  {/* Content */}
                  <div className={`flex-1 pb-10 ${i === TIMELINE.length - 1 ? "pb-0" : ""}`}>
                    <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.72)] text-sm sm:text-base leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Facility overview ── */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px] py-20 lg:py-28">
        <p className="font-tech text-blueprint text-[11px] tracking-[0.2em] uppercase mb-4">INFRASTRUCTURE</p>
        <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-3xl lg:text-[42px] leading-tight tracking-[-1px] mb-12">
          1,20,000 sq.ft of precision manufacturing.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10">
          {PLANTS.map((plant) => (
            <div key={plant.name} className="bg-[#0a0a0a] p-8">
              <p className="font-tech text-blueprint text-[11px] tracking-[0.18em] uppercase mb-3">{plant.name}</p>
              <p className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-4xl mb-1">{plant.area}</p>
              <p className="font-['Archivo',sans-serif] text-[#a6a6a6] text-xs mb-6">{plant.plot} total plot</p>
              <ul className="space-y-2">
                {plant.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <span className="text-blueprint mt-[3px] text-xs">—</span>
                    <span className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.65)] text-sm">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Certifications ── */}
      <section className="bg-panel py-20">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px]">
          <p className="font-tech text-blueprint text-[11px] tracking-[0.2em] uppercase mb-4">QUALITY & CERTIFICATIONS</p>
          <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-3xl lg:text-[38px] leading-tight tracking-[-0.8px] mb-12">
            Every process certified. Every shipment verified.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CERTS.map((c) => (
              <div key={c.code} className="bg-white/[0.025] border border-rule rounded-[2px] p-6">
                <div className="inline-block bg-blueprint text-black font-['Space_Grotesk',sans-serif] font-bold text-xs px-2 py-1 rounded-[3px] mb-4 tracking-wide">
                  {c.code}
                </div>
                <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.72)] text-sm leading-relaxed">{c.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Clientele ── */}
      <section className="py-16 border-t border-rule">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px] flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <span className="font-['Space_Grotesk',sans-serif] text-[#a6a6a6] text-xs tracking-[2px] uppercase shrink-0">
            OUR CLIENTELE
          </span>
          <div className="flex flex-wrap gap-6">
            {CLIENTS.map((c) => (
              <span key={c} className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-lg tracking-wider">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
