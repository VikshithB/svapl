import { useState } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

/* ─── Content from SVAPL brochure + PPT ─── */

const CAPABILITIES = [
  {
    id: "aerostructures",
    label: "Aerostructures",
    tag: "ISRO · DRDO · HAL",
    image: "https://images.unsplash.com/photo-1674897537555-dd6fbf72b4eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    headline: "Structural assemblies built to print, delivered flight-ready.",
    desc: "SVAPL fabricates the primary structural elements of India's launch vehicles — fuselage panels, wing ribs, bulkheads, base shrouds, inter-tank structures and nose cones. Every assembly integrates aluminium alloy skins, machined rings and 15CDV6 frames through precision riveting, jo-bolt and shear-bolt fastening, checked by laser metrology.",
    specs: [
      { label: "Max diameter", value: "Ø 4,200 mm" },
      { label: "Max assembly height", value: "4,000 mm" },
      { label: "Positional tolerance", value: "±0.4 mm concentricity" },
      { label: "Fastening types", value: "Hi-lok, jo-bolt, shear-bolt" },
    ],
    materials: ["Al Alloy 2014", "Al Alloy 7075", "15CDV6", "AISI 304", "MDN 250"],
    products: [
      "PSLV Core Base Shroud (Ø 2860 × 2600 mm) — 130+ delivered",
      "LVM3 Core Base Shroud (Ø 4060 × 4000 mm) — CBS, CTS & LFS sets",
      "GSLV L40 Strapon Nose Cones (Ø 2160 × 3800 mm) — 26 delivered",
      "GSLV L40 Inter-Tank Structure (Ø 2160 × 2000 mm) — 26 delivered",
      "PSLV Reaction Control Structure (Ø 700 × 2700 mm) — 62 delivered",
      "Gaganyaan Crew Module Structure — first unmanned article, 2020",
    ],
  },
  {
    id: "precision-machining",
    label: "Precision Machining",
    tag: "ISRO · DRDO",
    image: "https://images.unsplash.com/photo-1740209475472-aa7d280f7452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    headline: "±5 µm across a 1.2 m envelope. Every time.",
    desc: "Our machine shop operates 11 CNC milling centres (5-axis, 4-axis, 3-axis), 4 CNC plano mills, 4 CNC vertical turning lathes up to Ø5400 mm and 4 horizontal borers. We machine titanium, Inconel, aluminium alloys, maraging steel and exotic alloys. Thermal control protocols, custom fixturing and closed-loop CMM verification deliver repeatable accuracy on every shipment.",
    specs: [
      { label: "VTL capacity", value: "Up to Ø 5,400 mm" },
      { label: "Gantry milling", value: "Ø 3,200 × 6,000 mm (6-axis)" },
      { label: "Lathe capacity", value: "Ø 3,200 × 10,000 mm" },
      { label: "Positional accuracy", value: "±5 µm across 1.2 m" },
    ],
    materials: ["Titanium Grade V", "Inconel 718", "Al Alloy 2014 / 7075", "15CDV6", "MDN250", "Maraging M250"],
    products: [
      "L110 EGC Actuator System (56 components, 15–25 µm tolerance)",
      "S200 Mandrel — 13-fin, Ø 3200 × 5000 mm, laser-verified",
      "Motor case rings, profile sections up to Ø 5000 mm",
      "Isogrid panels — precision-milled for LVM3, GSLV and PSLV stages",
      "Nozzle convergents — complex cant-angle machining",
    ],
  },
  {
    id: "welded-structures",
    label: "Welded Structures",
    tag: "ISRO · DRDO",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    headline: "NADCAP-accredited welding of the most demanding alloys in service.",
    desc: "Our 4,000 sq.ft ISO Class 8 clean room houses a CNC auto-TIG station with full humidity control — mandatory for welding aluminium alloys and maraging steels. We are an approved vendor for TIG and electron-beam welding of MDN250, Inconel 718, AA2219, AA65032, 15CDV6, 15-5PH, 17-4PH, SS304/316 and Ti6Al4V. All welders are operator-qualified per NADCAP special process requirements. Every weld joint is subject to RT, UT or DP inspection before release.",
    specs: [
      { label: "Clean room", value: "ISO Class 8, 4,000 sq.ft" },
      { label: "Weld envelope", value: "Up to Ø 3,500 × 8,000 mm" },
      { label: "Material thickness", value: "Up to 40 mm" },
      { label: "Proof pressure", value: "Up to 220 ATA hydraulic" },
    ],
    materials: ["MDN 250", "Inconel 718", "AA 2219", "15CDV6", "Ti6Al4V", "Maraging M250", "SS 304/316"],
    products: [
      "PSOXL Motor Case (Ø 1000 × 12600 mm) — 90 casings delivered",
      "Sagarika Motor Case (Ø 800 × 1500 mm) — Maraging M250, 210 Bar proof",
      "LEM Motor Case (Ø 800 × 4000 mm) — RT-quality weld, final machining",
      "Nose Cap for DRDO (Ø 1500 × 1900 mm) — AA2219 honeycomb + Ti sections",
      "Nozzle Assembly (Ø 2500 × 1500 mm) — proof tested to 132 kg/cm²",
      "Metal Canister A1P (Ø 1400 × 9000 mm) — SA516 + 15CDV6 welded assembly",
    ],
  },
  {
    id: "integrated-assemblies",
    label: "Integrated Assemblies",
    tag: "ISRO · DRDO",
    image: "https://images.unsplash.com/photo-1585347890782-6e1ddd365053?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    headline: "From individual parts to flight-certified systems.",
    desc: "SVAPL integrates complex multi-material, multi-process assemblies — routing hydraulic lines, mounting thrusters, routing harnesses and running functional test sequences — all under our own roof. Our 5,000 sq.ft dedicated clean room supports precision assembly of propulsion subsystems and actuator packages. Every integration plan is customer-approved; every assembly ships with a full first-article inspection record.",
    specs: [
      { label: "Assembly clean room", value: "5,000 sq.ft with handling equipment" },
      { label: "Actuator tolerance", value: "15–25 µm, 56 components" },
      { label: "Propellant tank range", value: "7 to 80 litres" },
      { label: "Hydro test", value: "Up to 700 ATA" },
    ],
    materials: ["Al Alloy 65032", "AISI 321", "15CDV6", "Inconel 718", "15-5PH", "17-4PH"],
    products: [
      "L110 EGC Actuator System — 56-component integration, 15–25 µm tolerance",
      "RCS & VTP Assembly — propellant tanks, thrusters, pipeline integration",
      "Propellant Tank Assemblies (7–80 litres) — hydro-tested to 60 Bar",
      "PSLV Reaction Control Structure — 700 mm dia × 2700 mm, ±0.4 mm concentricity",
      "ASTRA Airframe integration — 40+ airframes for air-to-air missile",
      "Akash Airframe Sections I & II — 500+ sets delivered to DRDO",
    ],
  },
  {
    id: "defence-systems",
    label: "Defence Systems",
    tag: "DRDO · ASL · RCI",
    image: "https://images.unsplash.com/photo-1515272751348-25380c6c1f9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    headline: "From ballistic missile motor cases to launch canisters.",
    desc: "SVAPL operates India's first private-sector metallic canister manufacturing facility — commissioned in 2023 for DRDO's strategic programmes. We manufacture motor casings in maraging steel M250 (the most demanding material in the Indian defence supply chain), fabricate airframe structures in 15CDV6 and tungsten, and build stabiliser fin assemblies in Titanium Grade V, Inconel 718 and 13-8MO. In 2025 we delivered India's first Hypersonic Glide Vehicle airframes.",
    specs: [
      { label: "Canister envelope", value: "Ø 1,300–1,400 × 9,000 mm" },
      { label: "Motor case material", value: "Maraging M250, 15CDV6" },
      { label: "Fin assembly parts", value: "108 components (Ti / Inconel / 13-8MO)" },
      { label: "Canister pressure test", value: "Hydro 10 Bar, Pneumatic 0.3 Bar" },
    ],
    materials: ["Maraging Steel M250", "15CDV6", "Titanium Grade V", "Inconel 718", "13-8MO", "Tungsten"],
    products: [
      "Agni Series Motor Casings (I–V) — 15CDV6, MDN250",
      "Pralay Airframe Structure (Ø 740 × 3200 mm) — 15CDV6 + Tungsten",
      "Sagarika Motor Case (Ø 800 × 1500 mm) — Maraging M250, flowform-welded",
      "Metal Canister A1P (Ø 1400 × 9000 mm) — SA516 + 15CDV6",
      "Stabiliser Fin Assembly — 108 parts, Ti Grade V / Inconel / 13-8MO",
      "Hypersonic Glide Vehicle — airframes, motor casings, control surfaces (2025)",
    ],
  },
];

/* ─── Component ─── */

export default function WhatWeBuildPage() {
  const [active, setActive] = useState(CAPABILITIES[0].id);
  const cap = CAPABILITIES.find((c) => c.id === active)!;

  return (
    <div className="bg-[#0a0a0a] pt-24">
      {/* ── Page hero ── */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px] py-16 lg:py-24 border-b border-rule">
        <p className="font-tech text-blueprint text-[11px] tracking-[0.2em] uppercase mb-5">WHAT WE BUILD</p>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <h1 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-4xl sm:text-5xl lg:text-[58px] leading-[1.05] tracking-[-2px] max-w-2xl">
            Five decades of critical hardware. One roof.
          </h1>
          <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.82)] text-base lg:text-lg max-w-sm leading-relaxed shrink-0">
            From aerostructures to defence motor casings — mission-critical manufacturing under AS9100D quality management.
          </p>
        </div>
      </section>

      {/* ── Capability selector + detail ── */}
      <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px]">
        {/* Tab strip */}
        <div className="flex gap-1 overflow-x-auto py-6 border-b border-rule -mx-5 px-5 sm:-mx-10 sm:px-10 lg:mx-0 lg:px-0 scrollbar-hide">
          {CAPABILITIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`whitespace-nowrap font-['Space_Grotesk',sans-serif] font-bold text-sm px-5 py-2.5 rounded-[4px] transition-all duration-200 shrink-0 ${
                active === c.id
                  ? "bg-blueprint text-black"
                  : "text-blueprint-dim hover:text-white border border-rule"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div key={active} className="py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start" style={{ animation: "fadeSlideUp 0.35s cubic-bezier(0.22,1,0.36,1) both" }}>
          <style>{`@keyframes fadeSlideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>

          {/* Left: image */}
          <div className="relative h-[340px] sm:h-[440px] lg:h-[560px] rounded-[2px] border border-rule overflow-hidden">
            <ImageWithFallback
              src={cap.image}
              alt={cap.label}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-5 left-5">
              <span className="font-['Space_Grotesk',sans-serif] text-blueprint-dim text-[10px] tracking-[1.5px] border border-white/20 px-2 py-[3px] rounded-[3px]">
                {cap.tag}
              </span>
            </div>
          </div>

          {/* Right: content */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-2xl lg:text-[30px] leading-snug tracking-[-0.5px] mb-4">
                {cap.headline}
              </h2>
              <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.82)] text-sm lg:text-base leading-relaxed">
                {cap.desc}
              </p>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-px bg-white/10">
              {cap.specs.map((s) => (
                <div key={s.label} className="bg-[#0a0a0a] p-4">
                  <p className="font-['Space_Grotesk',sans-serif] text-blueprint-dim text-[9px] tracking-[1.5px] uppercase mb-1">{s.label}</p>
                  <p className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-sm">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Materials */}
            <div>
              <p className="font-['Space_Grotesk',sans-serif] text-blueprint-dim text-[10px] tracking-[1.5px] uppercase mb-3">MATERIALS</p>
              <div className="flex flex-wrap gap-2">
                {cap.materials.map((m) => (
                  <span key={m} className="bg-white/[0.04] border border-rule text-[rgba(234,242,251,0.82)] font-['Archivo',sans-serif] text-xs px-3 py-1.5 rounded-[3px]">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Key products */}
            <div>
              <p className="font-['Space_Grotesk',sans-serif] text-blueprint-dim text-[10px] tracking-[1.5px] uppercase mb-3">KEY PRODUCTS DELIVERED</p>
              <ul className="flex flex-col gap-2">
                {cap.products.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <span className="text-blueprint mt-[3px] text-xs shrink-0">—</span>
                    <span className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.82)] text-xs leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── All capabilities quick-ref grid ── */}
      <section className="bg-panel border-t border-rule py-16 lg:py-20">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px]">
          <p className="font-tech text-blueprint text-[11px] tracking-[0.2em] uppercase mb-10">ALL CAPABILITIES AT A GLANCE</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {[
              { label: "CNC Machining", spec: "Up to Ø 5,400 mm VTL; 5-axis, 4-axis, 3-axis" },
              { label: "Sheet Metal Forming", spec: "Plate bending 25–40 mm; rolling up to 6 m assemblies" },
              { label: "TIG / MIG Welding", spec: "Ferrous & non-ferrous, ISO 8 clean room, up to Ø 3,500 mm" },
              { label: "Structural Riveting", spec: "Hi-lok, jo-bolt, shear bolt; jig-based fixture assembly" },
              { label: "Surface Treatment", spec: "Chromic acid anodising, cadmium plating (sister concern)" },
              { label: "Chemical Milling", spec: "Precision chemical removal for complex profiles" },
              { label: "Heat Treatment", spec: "Bogie furnaces up to 1,700 × 1,700 × 2,200 mm; aging" },
              { label: "Hydro & Pneumatic Testing", spec: "Hydro up to 700 ATA; pneumatic up to 150 ATA" },
              { label: "NDT", spec: "RT, UT, DP, TT; X-ray 350 kVA; 3D CMM 600 × 600 × 500 mm" },
            ].map((item) => (
              <div key={item.label} className="bg-panel p-6">
                <p className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-[15px] mb-2">{item.label}</p>
                <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.78)] text-[13px] leading-relaxed">{item.spec}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 lg:py-20 border-t border-rule">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-2xl lg:text-[32px] tracking-[-0.5px] mb-2">
              Have a programme requirement?
            </h3>
            <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.82)] text-base max-w-lg">
              Share your drawing package or specification. Our engineering team will assess feasibility and provide a first-response within 5 working days.
            </p>
          </div>
          <div className="flex gap-4 flex-wrap shrink-0">
            <button className="bg-white text-black font-['Space_Grotesk',sans-serif] font-bold text-sm px-8 py-4 rounded-[4px] hover:bg-safety hover:text-white transition-colors">
              Request Strategic Briefing
            </button>
            <button className="border border-white/30 text-[#eaf2fb] font-['Archivo',sans-serif] font-semibold text-sm px-6 py-4 rounded-[4px] hover:bg-white/5 transition-colors">
              View Programmes
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
