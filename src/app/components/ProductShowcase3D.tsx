import { useState } from "react";
import { ProductCanvas3D } from "./ProductCanvas3D";

const PRODUCTS = [
  {
    id: "impeller",
    label: "01 // IMPELLER BLISK",
    title: "INTEGRAL BLADED ROTOR IMPELLER",
    desc: "MACHINED FROM A SINGLE SOLID BLOCK OF TITANIUM ALLOY USING SYNCHRONIZED 5-AXIS CNC MACHINING. GUARANTEES FLUID DYNAMIC EFFICIENCY AND ZERO BLADE JOINT FATIGUE UNDER HIGH VELOCITIES.",
    specs: [
      { key: "MATERIAL", val: "TITANIUM ALLOY (TI-6AL-4V)" },
      { key: "TOLERANCE", val: "± 0.005 MM (5 MICRONS)" },
      { key: "DIMENSIONS", val: "Ø 170 MM X 85 MM HEIGHT" },
      { key: "APPLICATION", val: "TURBOPUMP PROPELLANT FEED SYSTEMS" },
      { key: "PROGRAMME", val: "ISRO CRYOGENIC ENGINE PROGRAMME" },
      { key: "SIMULATION", val: "FEA STRESS & DEVIATION: CONFORMING" }
    ]
  },
  {
    id: "casing",
    label: "02 // MOTOR CASING",
    title: "MARAGING STEEL ROCKET MOTOR CASING",
    desc: "HIGH-PRESSURE PROPELLANT CONTAINMENT CASING CONSTRUCTED USING MARAGING STEEL M250. PRECISION WELDED AND HYDRAULICALLY TESTED TO STAND LAUNCH PROPULSION LOADS.",
    specs: [
      { key: "MATERIAL", val: "MARAGING STEEL M250" },
      { key: "TOLERANCE", val: "± 0.05 MM CONCENTRICITY" },
      { key: "DIMENSIONS", val: "Ø 740 MM X 2800 MM LENGTH" },
      { key: "APPLICATION", val: "SOLID ROCKET MOTOR BOOSTER BODY" },
      { key: "PROGRAMME", val: "DRDO & ISRO STRATEGIC MOTOR SYSTEMS" },
      { key: "SIMULATION", val: "HYDRO-PROOF PRESSURE TEST: PASS // 120BAR" }
    ]
  },
  {
    id: "nozzle",
    label: "03 // THRUST CHAMBER",
    title: "CONVERGING-DIVERGING NOZZLE ASSEMBLY",
    desc: "ROCKET THRUST CHAMBER LINER FEATURING INTEGRAL SPIRAL COOLANT CHANNELS. COMBINES COPPER ALLOY CORE WITH ELECTROFORMED STRENGTH CLADDING FOR THERMAL DISSIPATION.",
    specs: [
      { key: "MATERIAL", val: "COPPER ALLOY (CU-CR-ZR) + NI CLAD" },
      { key: "TOLERANCE", val: "± 0.02 MM HELIX WALL BOUND" },
      { key: "DIMENSIONS", val: "Ø 320 MM EXIT / Ø 48 MM THROAT" },
      { key: "APPLICATION", val: "REGENERATIVE ENGINE CHAMBER" },
      { key: "PROGRAMME", val: "ISRO VIKAS PROPULSION PLATFORMS" },
      { key: "SIMULATION", val: "THERMAL STEADY-STATE GRADIENT: CONFORMING" }
    ]
  },
  {
    id: "bracket",
    label: "04 // SUPPORT BRACKET",
    title: "AEROSTRUCTURE MACHINED RIB JOINT BRACKET",
    desc: "HIGH-FATIGUE BRACKET MACHINED FROM AL2219. WEIGHT OPTIMIZED VIA STRENGTH-TO-MASS ALGORITHMS WHILE RETAINING FLIGHT-CRITICAL RIGIDITY RATINGS.",
    specs: [
      { key: "MATERIAL", val: "ALUMINIUM ALLOY (AA2219)" },
      { key: "TOLERANCE", val: "± 0.008 MM AXIAL SYMMETRY" },
      { key: "DIMENSIONS", val: "220 MM X 150 MM X 95 MM" },
      { key: "APPLICATION", val: "FLIGHT-CONTROL ACTUATION MOUNT" },
      { key: "PROGRAMME", val: "HAL LIGHT COMBAT AIRCRAFT (LCA)" },
      { key: "SIMULATION", val: "VIBRATION SPECTRA RESONANCE: OK" }
    ]
  }
] as const;

type ProductId = typeof PRODUCTS[number]["id"];

export function ProductShowcase3D() {
  const [activeTab, setActiveTab] = useState<ProductId>("impeller");
  const product = PRODUCTS.find((p) => p.id === activeTab) || PRODUCTS[0];

  return (
    <section className="bg-[#050505] border-b border-white/[0.06] py-20 lg:py-28 relative">
      {/* Blueprint grid lines */}
      <div className="absolute left-6 md:left-10 top-0 bottom-0 w-[1px] bg-white/[0.03] pointer-events-none" />
      <div className="absolute right-6 md:right-10 top-0 bottom-0 w-[1px] bg-white/[0.03] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px]">
        {/* Section header */}
        <div className="mb-14 lg:mb-16 text-left">
          <p className="font-tech text-blueprint text-[10px] tracking-[0.25em] uppercase mb-4">
            FLIGHT HARDWARE // 3D MODEL PREVIEWS
          </p>
          <h2 className="font-sans font-bold text-white text-3xl lg:text-[42px] leading-tight tracking-[-1px] uppercase">
            INTERACTIVE SCHEMATICS.
          </h2>
          <p className="font-tech text-xs text-blueprint-dim tracking-wider uppercase max-w-xl mt-3 leading-relaxed">
            CLICK AND DRAG DIRECTLY ON THE 3D MODEL CANVAS TO ROTATE AND INSPECT SPECIFIC METROLOGY NODES AND COMPONENT INTERIOR GEOMETRIES.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Tab Selectors */}
          <div className="lg:col-span-3 flex flex-col gap-2 text-left">
            <span className="font-tech text-[9px] text-blueprint-dim tracking-widest uppercase mb-2 select-none">
              SELECT PRODUCT TELEMETRY
            </span>
            <div className="flex flex-col gap-1.5">
              {PRODUCTS.map((p) => {
                const active = p.id === activeTab;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveTab(p.id)}
                    className={`w-full flex items-center justify-between p-4 text-left border transition-all duration-300 relative focus:outline-none ${
                      active
                        ? "bg-[#0D0F12] border-blueprint/25 text-white"
                        : "bg-transparent border-white/[0.03] text-blueprint-dim hover:text-white hover:bg-[#0D0F12]/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          active ? "bg-blueprint shadow-[0_0_8px_#ff7700]" : "bg-white/10"
                        }`}
                      />
                      <span className="font-tech text-[10px] tracking-wider font-semibold uppercase mt-0.5">
                        {p.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center Column: Interactive 3D Canvas */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            <span className="font-tech text-[9px] text-blueprint-dim tracking-widest uppercase mb-2 text-left select-none">
              LIVE VIEWPORT GRID
            </span>
            <ProductCanvas3D modelName={activeTab} />
          </div>

          {/* Right Column: Blueprint specs */}
          <div className="lg:col-span-4 flex flex-col text-left h-full justify-between">
            <div>
              <span className="font-tech text-[9px] text-blueprint-dim tracking-widest uppercase block mb-3 select-none">
                HARDWARE PARAMETERS
              </span>
              <h3 className="font-sans font-bold text-white text-lg tracking-tight uppercase mb-3">
                {product.title}
              </h3>
              <p className="font-tech text-[11px] text-[rgba(234,242,251,0.85)] tracking-wider leading-relaxed uppercase mb-6">
                {product.desc}
              </p>
            </div>

            <div className="flex flex-col gap-3.5 border-t border-white/[0.06] pt-5">
              {product.specs.map((s) => (
                <div key={s.key} className="flex flex-col border-b border-white/[0.03] pb-2 last:border-b-0">
                  <span className="font-tech text-[8px] tracking-wider text-blueprint-dim uppercase">
                    {s.key}
                  </span>
                  <span className="font-tech text-[11px] tracking-widest text-white font-medium uppercase mt-0.5">
                    {s.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
