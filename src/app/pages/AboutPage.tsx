import { useState, useRef } from "react";

const STATS = [
  { value: "25+", label: "Years in Service" },
  { value: "1.2L", label: "Sq.ft Facility" },
  { value: "180+", label: "Skilled Engineers" },
  { value: "25T", label: "Crane Capacity" },
  { value: "AS9100D", label: "Certified" },
  { value: "3", label: "Manufacturing Plants" },
];

const TIMELINE = [
  { 
    year: "2000", 
    text: "Established Unit-I with 10,000 sq.ft shop floor under the leadership of C.S.N. Reddy.", 
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600" 
  },
  { 
    year: "2002", 
    text: "First aerostructure RCS delivered to ISRO. Agni-1 & 2 rocket motor casings delivered to DRDO.", 
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=600" 
  },
  { 
    year: "2004", 
    text: "First industry to develop the L40 structure for GSLV — successfully delivered to ISRO.", 
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=600" 
  },
  { 
    year: "2008", 
    text: "First private sector company to integrate RCS & VTP and deliver to DRDO.", 
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600" 
  },
  { 
    year: "2010", 
    text: "Became lead vendor for PSLV & GSLV auxiliary separation systems. Sagarika series airframes delivered.", 
    image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&q=80&w=600" 
  },
  { 
    year: "2012", 
    text: "Established Unit-II with 70,000 sq.ft — dedicated to DRDO & ISRO programmes.", 
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=600" 
  },
  { 
    year: "2014", 
    text: "First Hyderabad-based industry to produce Maraging Steel M250 rocket motor casings Ø740mm for DRDO. Over 100 casings delivered to date.", 
    image: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&q=80&w=600" 
  },
  { 
    year: "2019", 
    text: "Airframes, control surfaces and motor casings for Pralay (DRDO) delivered. First unmanned crew module structure to ISRO. LVM3 Core Base Shroud completed.", 
    image: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&q=80&w=600" 
  },
  { 
    year: "2023", 
    text: "First metal canister manufacturing facility for DRDO established. PSOXL motor case successfully tested — 90 casings delivered.", 
    image: "https://images.unsplash.com/photo-1618979284981-670a5543b333?auto=format&fit=crop&q=80&w=600" 
  },
  { 
    year: "2025", 
    text: "Airframes, motor casings and control surface panels delivered for India's first Hypersonic Glide Vehicle.", 
    image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=600" 
  },
  { 
    year: "2026", 
    text: "Unit-III established — 45,000 sq.ft dedicated to global defence manufacturing requirements.", 
    image: "https://images.unsplash.com/photo-1716643863806-989dd76ae093?auto=format&fit=crop&q=80&w=600" 
  },
];

const PLANTS = [
  {
    name: "Unit I",
    area: "60,000 SQ.FT",
    plot: "20,370 SQ.YARDS",
    highlights: ["6 shop floor bays", "Crane capacity up to 20T", "Clean room 5,000 sq.ft", "Hydro & pneumatic test rigs"],
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Unit II",
    area: "45,000 SQ.FT",
    plot: "14,800 SQ.YARDS",
    highlights: ["DRDO & ISRO dedicated", "Crane capacity 10T × 3", "Auto TIG ISO 8 clean room", "CMM & NDT facility"],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Unit III",
    area: "45,000 SQ.FT",
    plot: "3 ACRES",
    highlights: ["Global defence focus", "9.5m bay height", "Expanded welding facility", "Commissioned 2026"],
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800",
  },
];

const CERTS = [
  { code: "AS 9100D : 2016", name: "Aerospace Quality Management System" },
  { code: "ISO 9001 : 2015", name: "Quality Management System" },
  { code: "ISO 14001 : 2015", name: "Environmental Management System" },
  { code: "ISO 45001 : 2018", name: "Occupational Health & Safety" },
];

const CLIENTS = ["ISRO", "DRDO", "HAL", "BEL", "BDL"];

function TimelinePanel({ activeItem }: { activeItem: typeof TIMELINE[0] }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setCoords({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative w-full aspect-[4/3] bg-[#0d0f12] border border-white/[0.08] rounded-[2px] overflow-hidden group select-none"
    >
      <img
        src={activeItem.image}
        alt={activeItem.year}
        className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.7] group-hover:grayscale-0 group-hover:brightness-[0.9] group-hover:scale-[1.03] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

      {hovered && (
        <>
          <div
            className="absolute top-0 bottom-0 w-[1px] bg-blueprint/25 pointer-events-none z-10"
            style={{ left: `${coords.x}px` }}
          />
          <div
            className="absolute left-0 right-0 h-[1px] bg-blueprint/25 pointer-events-none z-10"
            style={{ top: `${coords.y}px` }}
          />
          <div
            className="absolute font-tech text-[8px] text-blueprint/50 tracking-wider bg-[#050505]/90 px-2 py-0.5 border border-white/[0.05] pointer-events-none select-none z-20"
            style={{
              left: `${coords.x + 10}px`,
              top: `${coords.y + 10}px`,
            }}
          >
            SYS_REF: {coords.x}X // {coords.y}Y
          </div>
        </>
      )}

      {/* Blueprint corner details */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-blueprint/50 pointer-events-none" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-blueprint/50 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-blueprint/50 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-blueprint/50 pointer-events-none" />

      {/* HUD labels */}
      <div className="absolute top-4 left-4 bg-black/60 border border-white/[0.05] px-2 py-0.5 font-tech text-[8px] text-blueprint tracking-wider">
        SYS_LOG: MILESTONE_{activeItem.year}
      </div>
      
      <div className="absolute bottom-4 left-4 right-4 text-left">
        <span className="font-tech text-[#ff7700] text-xs font-bold block mb-0.5">SVAPL // {activeItem.year}</span>
        <span className="font-tech text-white text-[10px] uppercase tracking-wider block opacity-90 truncate max-w-full">
          {activeItem.text}
        </span>
      </div>
    </div>
  );
}

function InfrastructureShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const plant = PLANTS[activeIdx];
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setCoords({ x, y });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      {/* Left side: plant selectors & lists */}
      <div className="lg:col-span-5 flex flex-col gap-6 text-left select-none">
        <span className="font-tech text-[9px] text-blueprint-dim tracking-widest uppercase mb-1">
          SELECT FACILITY NODE
        </span>
        <div className="flex flex-col gap-2">
          {PLANTS.map((p, idx) => {
            const active = idx === activeIdx;
            return (
              <button
                key={p.name}
                onClick={() => setActiveIdx(idx)}
                className={`w-full flex items-center justify-between p-4 text-left border border-white/[0.04] transition-all duration-300 relative focus:outline-none ${
                  active
                    ? "bg-[#0D0F12] border-blueprint/25 text-white"
                    : "bg-transparent text-blueprint-dim hover:text-white hover:bg-[#0D0F12]/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    active ? "bg-blueprint shadow-[0_0_8px_#ff7700]" : "bg-white/10"
                  }`} />
                  <span className="font-tech text-[11px] tracking-wider font-semibold uppercase mt-0.5">{p.name}</span>
                </div>
                <span className="font-tech text-[10px] text-blueprint-dim">SYS_NODE_0{idx+1}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Plant Specifications Grid */}
        <div className="grid grid-cols-2 gap-4 border-t border-b border-white/[0.06] py-5 mt-4">
          <div className="flex flex-col">
            <span className="font-tech text-[9px] tracking-widest text-blueprint-dim uppercase">COVERED AREA</span>
            <span className="font-tech text-base tracking-tight text-white font-bold uppercase mt-1">{plant.area}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-tech text-[9px] tracking-widest text-blueprint-dim uppercase">PLOT SIZE</span>
            <span className="font-tech text-xs tracking-wider text-white font-semibold uppercase mt-1.5">{plant.plot}</span>
          </div>
        </div>

        {/* Highlights List */}
        <div>
          <span className="font-tech text-[9px] tracking-widest text-blueprint-dim uppercase block mb-3">NODE CAPABILITY PROFILES</span>
          <ul className="space-y-2">
            {plant.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5">
                <span className="text-blueprint text-xs mt-[1px] shrink-0">—</span>
                <span className="font-tech text-[11px] uppercase tracking-wider text-[rgba(234,242,251,0.85)]">{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right side: plant high-resolution photo with overlay details */}
      <div className="lg:col-span-7 flex flex-col gap-3">
        <div
          ref={imageRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative aspect-[16/10] w-full bg-[#0d0f12] border border-white/[0.08] rounded-[2px] overflow-hidden group select-none"
        >
          <img
            src={plant.image}
            alt={plant.name}
            className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.7] group-hover:grayscale-0 group-hover:brightness-[0.9] group-hover:scale-[1.02] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

          {hovered && (
            <>
              <div
                className="absolute top-0 bottom-0 w-[1px] bg-blueprint/20 pointer-events-none z-10"
                style={{ left: `${coords.x}px` }}
              />
              <div
                className="absolute left-0 right-0 h-[1px] bg-blueprint/20 pointer-events-none z-10"
                style={{ top: `${coords.y}px` }}
              />
              <div
                className="absolute font-tech text-[8px] text-blueprint/50 tracking-wider bg-[#050505]/95 px-2 py-0.5 border border-white/[0.05] pointer-events-none z-20"
                style={{
                  left: `${coords.x + 12}px`,
                  top: `${coords.y + 12}px`,
                }}
              >
                PT_SCAN: X{coords.x} // Y{coords.y}
              </div>
            </>
          )}

          {/* Blueprint corner details */}
          <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t border-l border-blueprint/50 pointer-events-none" />
          <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t border-r border-blueprint/50 pointer-events-none" />
          <div className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 border-b border-l border-blueprint/50 pointer-events-none" />
          <div className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b border-r border-blueprint/50 pointer-events-none" />

          {/* Calibration label */}
          <div className="absolute bottom-4 right-4 bg-black/60 border border-white/[0.05] px-2 py-0.5 font-tech text-[8px] text-blueprint-dim tracking-wider uppercase">
            CALIBRATION LOG: ACTIVE_NODE
          </div>
        </div>
        <div className="flex items-center justify-between text-[8px] font-tech text-blueprint-dim uppercase tracking-wider select-none px-1">
          <span>FACILITY_SCAN: RESOLUTION_OK</span>
          <span>COORDINATE GRID: SYSTEM_ACTIVE</span>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const [activeTimelineYear, setActiveTimelineYear] = useState(TIMELINE[0].year);

  return (
    <div className="bg-[#050505] pt-24">

      {/* ── Page Hero ── */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px] py-16 lg:py-24 border-b border-white/[0.06]">
        <p className="font-tech text-blueprint text-[10px] tracking-[0.25em] uppercase mb-4">
          ABOUT SVAPL // COMPANY PROFILE
        </p>
        <h1 className="font-sans font-bold text-white text-4xl sm:text-5xl lg:text-[72px] leading-[0.95] tracking-[-0.04em] uppercase max-w-4xl mb-8">
          BUILDING<br />HARDWARE THAT<br />CANNOT FAIL.
        </h1>
        <p className="font-tech text-xs tracking-wider text-blueprint-dim leading-relaxed uppercase border-l-2 border-blueprint/30 pl-4 py-1 max-w-2xl text-left">
          "ESTABLISHED IN 2000 IN HYDERABAD, SVAPL HAS BECOME ONE OF INDIA'S MOST TRUSTED CONTRACTORS OF MISSION-CRITICAL STRUCTURES, MOTOR CASINGS, AND INTEGRATED ASSEMBLIES FOR FRONTIER SPACE AND DEFENCE PLATFORMS."
        </p>
      </section>

      {/* ── Stats Strip ── */}
      <section className="bg-[#050505] border-b border-white/[0.06] py-1">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px]">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 lg:divide-x divide-white/[0.06] border-l border-r border-white/[0.06] bg-[#0d0f12]/10">
            {STATS.map((s, i) => (
              <div key={s.label} className="px-6 py-8 flex flex-col gap-1.5 text-left font-tech relative group hover:bg-[#0d0f12]/20 transition-colors">
                <span className="text-blueprint text-[9px] tracking-[0.2em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-bold text-white text-3xl tracking-tight mt-1">
                  {s.value}
                </span>
                <span className="text-blueprint-dim text-[10px] tracking-[0.12em] uppercase mt-0.5">
                  {s.label}
                </span>
                <div className="absolute top-1 left-1 w-1 h-1 bg-blueprint/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px] py-20 lg:py-28 border-b border-white/[0.06]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="text-left">
            <p className="font-tech text-blueprint text-[10px] tracking-[0.25em] uppercase mb-4">OUR STORY // FOUNDATION GENESIS</p>
            <h2 className="font-sans font-bold text-[#eaf2fb] text-3xl lg:text-[38px] leading-tight tracking-[-1px] mb-6">
              FROM PRECISION WORKSHOPS TO DEFENCE FRONT LINES.
            </h2>
            <div className="space-y-5 font-tech text-xs sm:text-[13px] uppercase tracking-wider text-[rgba(234,242,251,0.85)] leading-relaxed">
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
          <div className="relative aspect-[16/11] w-full rounded-[2px] border border-white/[0.08] overflow-hidden group select-none">
            <img
              src="https://images.unsplash.com/photo-1716643863806-989dd76ae093?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="SVAPL manufacturing facility"
              className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.7] group-hover:grayscale-0 group-hover:brightness-[0.9] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Blueprint ticks */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-blueprint/50" />
            <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-blueprint/50" />
            <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-blueprint/50" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-blueprint/50" />
          </div>
        </div>
      </section>

      {/* ── Timeline Section ── */}
      <section className="bg-[#050505] py-20 lg:py-28 border-b border-white/[0.06]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px]">
          <div className="mb-16 text-left">
            <p className="font-tech text-blueprint text-[10px] tracking-[0.25em] uppercase mb-4">OUR JOURNEY // CHRONOLOGICAL LOG</p>
            <h2 className="font-sans font-bold text-white text-3xl lg:text-[42px] leading-tight tracking-[-1px]">
              HISTORICAL MILESTONES.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Timeline scrollable tracker */}
            <div className="lg:col-span-7 relative pl-4 sm:pl-10">
              {/* Vertical timeline axis line */}
              <div className="absolute left-[12px] sm:left-[28px] top-2 bottom-2 w-[1px] bg-white/[0.08]" />

              <div className="flex flex-col gap-0">
                {TIMELINE.map((item) => {
                  const active = item.year === activeTimelineYear;
                  return (
                    <div
                      key={item.year}
                      onMouseEnter={() => setActiveTimelineYear(item.year)}
                      className="flex gap-6 sm:gap-8 group cursor-pointer relative pb-10 last:pb-0"
                    >
                      {/* Circle Indicator */}
                      <div className="absolute left-[7px] sm:left-[23px] top-1.5 z-10 flex items-center justify-center">
                        <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          active 
                            ? "bg-blueprint ring-4 ring-[#ff7700]/25 shadow-[0_0_8px_#ff7700]" 
                            : "bg-[#0d0f12] border border-white/20 group-hover:border-white/50"
                        }`} />
                      </div>

                      {/* Timeline text content */}
                      <div className="flex-1 text-left pl-6 sm:pl-10">
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className={`font-sans font-bold text-sm tracking-wider transition-colors duration-300 ${
                            active ? "text-blueprint" : "text-white/60 group-hover:text-white"
                          }`}>
                            {item.year}
                          </span>
                          <span className="font-tech text-[8px] text-blueprint-dim/40 tracking-widest uppercase select-none">// RECORDED ENTRY</span>
                        </div>
                        <p className={`font-tech text-xs sm:text-[13px] leading-relaxed uppercase tracking-wider transition-colors duration-300 ${
                          active ? "text-white" : "text-blueprint-dim/80 group-hover:text-blueprint-dim"
                        }`}>
                          {item.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sticky milestone visual container */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="flex flex-col gap-2">
                <span className="font-tech text-[9px] text-blueprint-dim tracking-widest uppercase mb-1 text-left">
                  MILESTONE VISUAL INDEX
                </span>
                <TimelinePanel activeItem={TIMELINE.find(t => t.year === activeTimelineYear) || TIMELINE[0]} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Facility Showcase Section ── */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px] py-20 lg:py-28 border-b border-white/[0.06]">
        <div className="mb-16 text-left">
          <p className="font-tech text-blueprint text-[10px] tracking-[0.25em] uppercase mb-4">INFRASTRUCTURE // PHYSICAL NODES</p>
          <h2 className="font-sans font-bold text-white text-3xl lg:text-[42px] leading-tight tracking-[-1px]">
            1,20,000 SQ.FT OF PRECISION.
          </h2>
        </div>
        <InfrastructureShowcase />
      </section>

      {/* ── Certifications Section ── */}
      <section className="bg-[#050505] py-20 border-b border-white/[0.06]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px]">
          <div className="mb-16 text-left">
            <p className="font-tech text-blueprint text-[10px] tracking-[0.25em] uppercase mb-4">QUALITY ASSURANCE // COMPLIANCE CODES</p>
            <h2 className="font-sans font-bold text-white text-3xl lg:text-[42px] leading-tight tracking-[-1px]">
              PROCESS AUDITS & ACCREDITATIONS.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CERTS.map((c) => (
              <div key={c.code} className="bg-[#0D0F12]/30 border border-white/[0.06] hover:border-blueprint/30 rounded-[3px] p-6 text-left relative group transition-all duration-300 select-none">
                {/* Corner accent details */}
                <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 border-t border-l border-white/10 group-hover:border-blueprint/40 transition-colors" />
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 border-t border-r border-white/10 group-hover:border-blueprint/40 transition-colors" />
                <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 border-b border-l border-white/10 group-hover:border-blueprint/40 transition-colors" />
                <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 border-b border-r border-white/10 group-hover:border-blueprint/40 transition-colors" />

                <div className="inline-block bg-blueprint/15 text-blueprint font-tech text-[10px] font-bold px-2.5 py-1 rounded-[3px] mb-4 tracking-wider uppercase border border-blueprint/10">
                  {c.code}
                </div>
                <p className="font-tech text-[12px] uppercase tracking-wider text-[rgba(234,242,251,0.85)] group-hover:text-white transition-colors">
                  {c.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Clientele Section ── */}
      <section className="py-20 bg-[#050505]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px]">
          <div className="mb-12 text-left">
            <span className="font-tech text-blueprint-dim text-[10px] tracking-[2px] uppercase block">
              APPROVED SUPPLY CHAINS // CLIENTELE DIRECTORY
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 border border-white/[0.06] divide-x divide-y sm:divide-y-0 divide-white/[0.06] bg-[#0a0a0a]/20">
            {CLIENTS.map((c) => (
              <div key={c} className="flex flex-col items-center justify-center p-8 bg-transparent hover:bg-[#0d0f12]/30 transition-colors text-center group select-none">
                <span className="font-sans font-black text-[#eaf2fb] text-2xl tracking-wider group-hover:text-blueprint transition-colors duration-300">
                  {c}
                </span>
                <span className="font-tech text-[8px] text-blueprint-dim tracking-widest mt-2.5 uppercase opacity-50 group-hover:opacity-90 transition-opacity">
                  CONTRACTOR_NODE
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
