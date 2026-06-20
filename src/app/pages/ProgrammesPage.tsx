import { useState } from "react";

type Client = "ALL" | "ISRO" | "DRDO" | "HAL";

interface Programme {
  client: "ISRO" | "DRDO" | "HAL";
  name: string;
  tag: string;
  size?: string;
  material?: string;
  desc: string;
  image: string;
}

const PROGRAMMES: Programme[] = [
  {
    client: "ISRO",
    name: "PSLV Core Base Shroud",
    tag: "PSLV",
    size: "Ø 2860 × 2600 mm",
    material: "Al Alloy 2014, 15CDV6, SS",
    desc: "Full structural assembly integrating aluminium alloy skins, machined rings and 15CDV6 frames — delivered across 130+ units to VSSC.",
    image: "https://images.unsplash.com/photo-1614642240262-a452c2c11724?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    client: "ISRO",
    name: "GSLV L40 Strapon Structures",
    tag: "GSLV",
    size: "Ø 2160 × 2000–3800 mm",
    material: "Al Alloy 2014, 15CDV6, AISI 304",
    desc: "Inter-tank structures, strapon nose cones and base shrouds for L40 liquid stages. First private company to develop these in 2004.",
    image: "https://images.unsplash.com/photo-1515272751348-25380c6c1f9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    client: "ISRO",
    name: "LVM3 Core Base Shroud",
    tag: "LVM3",
    size: "Ø 3000 × 1500 mm",
    material: "Al Alloy 2014, 15CDV6",
    desc: "Combines advanced sheet metal forming with isogrid panel machining, structural riveting, fixture integration and bracket rolling.",
    image: "https://images.unsplash.com/photo-1674897537555-dd6fbf72b4eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    client: "ISRO",
    name: "Gaganyaan Crew Module Structure",
    tag: "Gaganyaan",
    size: "Ø 3.1 m",
    material: "15CDV6, Al Alloy",
    desc: "First unmanned crew module structure delivered in 2019–2020. Critical milestone in India's human spaceflight programme.",
    image: "https://images.unsplash.com/photo-1585347890782-6e1ddd365053?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    client: "ISRO",
    name: "L110 EGC Actuator Systems",
    tag: "GSLV Mk III",
    size: "56-component assembly",
    material: "15CDV6, Inconel 718, 15-5PH",
    desc: "High-precision actuator systems engineered to 15–25 micron tolerances, integrating 56 individual components for GSLV Mk III L110 stage.",
    image: "https://images.unsplash.com/photo-1740209475472-aa7d280f7452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    client: "ISRO",
    name: "PSOXL Motor Case",
    tag: "PSLV",
    size: "Ø 1000 × 12600 mm",
    material: "15CDV6",
    desc: "Full segment motor casing successfully tested and delivered — 90 motor casings to date for PSLV solid stages.",
    image: "https://images.unsplash.com/photo-1598302936625-6075fbd98dd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    client: "DRDO",
    name: "Agni Series Motor Casings",
    tag: "Agni I–V",
    size: "Ø 1500 × 1000 mm",
    material: "15CDV6, MDN250",
    desc: "Motor casings for Agni-1, 2, 3, 4 and 5 ballistic missiles. One of the original programmes that established SVAPL's defence credentials.",
    image: "https://images.unsplash.com/photo-1710750266544-d5b41e6847aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    client: "DRDO",
    name: "Pralay Airframe & Motor Assembly",
    tag: "Pralay",
    size: "Ø 740 × 3200 mm",
    material: "15CDV6, Tungsten",
    desc: "Complete airframe structure, motor casings, control surface panels and stabiliser fins for India's tactical ballistic missile — delivered 2019.",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    client: "DRDO",
    name: "Sagarika Series Motor Cases",
    tag: "Sagarika / K-15",
    size: "Ø 800 × 1500 mm",
    material: "Maraging Steel M250",
    desc: "Flowform tube welding, precision machining, RT/DP inspection and proof pressure testing up to 210 Bar for submarine-launched ballistic missiles.",
    image: "https://images.unsplash.com/photo-1515272751348-25380c6c1f9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    client: "DRDO",
    name: "Metal Canister — A1 PRIME",
    tag: "A1 PRIME",
    size: "Ø 1300–1400 × 8500–9000 mm",
    material: "SA516, 15CDV6",
    desc: "Specialised missile launch canister — welded SA516 and 15CDV6 construction. Hydraulic pressure testing to 10 Bar, pneumatic to 0.3 Bar. First facility of its kind in Hyderabad.",
    image: "https://images.unsplash.com/photo-1455165814004-1126a7199f9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    client: "DRDO",
    name: "ASTRA Airframe",
    tag: "ASTRA",
    size: "Ø 170 × 1650 mm",
    material: "Al Alloy 2014, SS304, SS420",
    desc: "40+ airframes delivered for India's beyond-visual-range air-to-air missile. Complex machining, riveting and integration of multi-material sections.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    client: "DRDO",
    name: "Stabiliser Fin Assembly — Titanium",
    tag: "Pralay / HGV",
    size: "500 mm × 800 mm",
    material: "Ti Grade V, Inconel, 13-8MO",
    desc: "108-component fin assembly showcasing complex machining and riveting of Titanium Grade 5, Inconel and 13-8MO for hypersonic and tactical programmes.",
    image: "https://images.unsplash.com/photo-1666634157070-6fd830fb5672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
  {
    client: "HAL",
    name: "Maraging Steel Structural Components",
    tag: "Helicopter Structures",
    size: "Up to 1140 × 326 × 300 mm",
    material: "Maraging Steel",
    desc: "Precision-machined legs and struts in Maraging Steel for HAL helicopter programmes — Bangalore facility.",
    image: "https://images.unsplash.com/photo-1585916788784-64aa099fec1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  },
];

const CLIENT_COLORS: Record<string, string> = {
  ISRO: "bg-blue-900/40 text-blue-300 border-blue-700/40",
  DRDO: "bg-blueprint/10 text-blueprint border-[#f70]/30",
  HAL: "bg-emerald-900/30 text-emerald-400 border-emerald-700/40",
};

export default function ProgrammesPage() {
  const [filter, setFilter] = useState<Client>("ALL");
  const visible = filter === "ALL" ? PROGRAMMES : PROGRAMMES.filter((p) => p.client === filter);

  return (
    <div className="bg-[#0a0a0a] pt-24">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1614642240262-a452c2c11724?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600"
          alt="Rocket launch"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 to-[#0a0a0a]" />
        <div className="relative max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px] py-20 lg:py-28">
          <p className="font-tech text-blueprint text-[11px] tracking-[0.2em] uppercase mb-5">
            PROGRAMMES
          </p>
          <h1 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-4xl sm:text-5xl lg:text-[56px] leading-[1.05] tracking-[-2px] max-w-3xl mb-6">
            25 years of trusted delivery to India's most critical programmes.
          </h1>
          <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.6)] text-base lg:text-lg max-w-xl leading-relaxed">
            From PSLV and LVM3 to Agni and Pralay — every structure, motor casing and integrated assembly
            built to print, certified and delivered flight-ready.
          </p>
        </div>
      </section>

      {/* Filter + grid share a wrapper so the sticky bar releases at the end
          of the grid instead of staying pinned over later sections. */}
      <div className="relative">

      {/* ── Filter tabs ── */}
      <div className="sticky top-20 z-40 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-rule">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px] flex gap-1 py-3">
          {(["ALL", "ISRO", "DRDO", "HAL"] as Client[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-['Space_Grotesk',sans-serif] font-bold text-xs px-4 py-2 rounded-[4px] transition-all ${
                filter === f
                  ? "bg-blueprint text-black"
                  : "text-[#a6a6a6] hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
          <span className="ml-auto font-['Archivo',sans-serif] text-[#a6a6a6] text-xs self-center">
            {visible.length} programme{visible.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ── Programme grid ── */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px] py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule">
          {visible.map((prog) => (
            <div key={prog.name} className="bg-ink flex flex-col group cursor-pointer hover:bg-[#141414] transition-colors">
              {/* Image */}
              <div className="relative h-[200px] overflow-hidden">
                <img
                  src={prog.image}
                  alt={prog.name}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent" />
                {/* Client badge */}
                <div className={`absolute top-4 left-4 border text-xs font-['Space_Grotesk',sans-serif] font-bold px-2 py-[3px] rounded-[3px] tracking-wide ${CLIENT_COLORS[prog.client]}`}>
                  {prog.client}
                </div>
              </div>
              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-['Space_Grotesk',sans-serif] text-[#a6a6a6] text-[10px] tracking-[1.5px] uppercase border border-rule px-2 py-[2px] rounded-[3px]">
                    {prog.tag}
                  </span>
                </div>
                <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-[17px] leading-snug mb-3">
                  {prog.name}
                </h3>
                <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.6)] text-[13px] leading-relaxed flex-1 mb-4">
                  {prog.desc}
                </p>
                {/* Specs */}
                {prog.size && (
                  <div className="pt-4 border-t border-white/[0.06] flex flex-col gap-1">
                    {prog.size && (
                      <div className="flex gap-2">
                        <span className="font-['Space_Grotesk',sans-serif] text-[#a6a6a6] text-[10px] tracking-[1px] uppercase w-16 shrink-0">SIZE</span>
                        <span className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.55)] text-[11px]">{prog.size}</span>
                      </div>
                    )}
                    {prog.material && (
                      <div className="flex gap-2">
                        <span className="font-['Space_Grotesk',sans-serif] text-[#a6a6a6] text-[10px] tracking-[1px] uppercase w-16 shrink-0">MATERIAL</span>
                        <span className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.55)] text-[11px]">{prog.material}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      </div>{/* end sticky wrapper (filter + grid) */}

      {/* ── Hypersonic callout ── */}
      <section className="bg-panel border-t border-rule">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px] py-16 lg:py-20 flex flex-col lg:flex-row items-start lg:items-center gap-8 justify-between">
          <div className="max-w-xl">
            <p className="font-tech text-blueprint text-[11px] tracking-[0.2em] uppercase mb-3">2025 MILESTONE</p>
            <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-2xl lg:text-[32px] leading-tight tracking-[-0.5px] mb-3">
              India's first Hypersonic Glide Vehicle.
            </h3>
            <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.65)] text-base leading-relaxed">
              In 2025 SVAPL delivered airframes, motor casings and control surface panels for India's first
              Hypersonic Glide Vehicle — our most technically demanding programme to date.
            </p>
          </div>
          <button className="shrink-0 border border-white/30 text-[#eaf2fb] font-['Archivo',sans-serif] font-semibold text-sm px-8 py-4 rounded-[4px] hover:bg-white/5 transition-colors">
            Request Strategic Briefing
          </button>
        </div>
      </section>
    </div>
  );
}
