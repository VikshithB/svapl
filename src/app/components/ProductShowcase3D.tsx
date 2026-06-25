import { useState } from "react";
import { ProductCanvas3D } from "./ProductCanvas3D";

const PRODUCTS = [
  {
    id: "shroud",
    label: "01 // LVM3 CORE BASE SHROUD",
    title: "LVM3 CORE BASE SHROUD",
    desc: "THIS ASSEMBLY COMBINES ADVANCED SHEET METAL FORMING WITH ISOGRID PANEL MACHINING, STRUCTURAL RIVETING THROUGH FIXTURE AND INTEGRATION, ROLLING OF BRACKETS.",
    specs: [
      { key: "PROGRAMME", val: "FOR ISRO" },
      { key: "DIAMETER", val: "4200 MM" },
      { key: "HEIGHT", val: "3300 MM" },
      { key: "MATERIAL", val: "AA 7075, AA2014, 15CDV6" }
    ]
  },
  {
    id: "fin",
    label: "02 // STABILIZER FIN ASSY.",
    title: "STABILIZER FIN ASSEMBLY",
    desc: "CONSTRUCTED FROM 108 COMPONENTS, THE COMPLETE FIN ASSEMBLY SHOWCASES COMPLEX MACHINING AND RIVETING OF SPECIALIZED MATERIALS LIKE TITANIUM GRADE 5, INCONEL, AND 13-8 MO.",
    specs: [
      { key: "PROGRAMME", val: "FOR DRDO" },
      { key: "HEIGHT", val: "500 MM" },
      { key: "LENGTH", val: "800 MM LONG" },
      { key: "MATERIAL", val: "TI. GRADE-V, INCONEL 13-8MO" }
    ]
  },
  {
    id: "rcs",
    label: "03 // RCS & VTP",
    title: "RCS & VTP ASSEMBLY",
    desc: "PRODUCT IS AN INTEGRATION OF PROPELLENT TANKS WITH ADAPTORS, THRUSTERS AND PIPELINE ASSEMBLIES.",
    specs: [
      { key: "PROGRAMME", val: "FOR DRDO" },
      { key: "DIAMETER", val: "1500 MM" },
      { key: "HEIGHT", val: "1000 MM" },
      { key: "MATERIAL", val: "AL. ALLOY 2014, SS316L & SS308L GRAPHITE" }
    ]
  },
  {
    id: "canister",
    label: "04 // METAL CANISTER",
    title: "METAL CANISTER",
    desc: "SPECIALIZED MISSILE LAUNCH CANISTER UTILIZING WELDED SA516 AND 15CDV6 CONSTRUCTION. HYDRAULIC PRESSURE TESTING UP TO 10 BAR AND PNEUMATIC LEAK TESTING UP TO 0.3 BAR.",
    specs: [
      { key: "PROGRAMME", val: "FOR DRDO" },
      { key: "DIAMETER", val: "1300 MM" },
      { key: "LENGTH", val: "9000 MM" },
      { key: "MATERIAL", val: "SA516, 15CDV6" }
    ]
  }
] as const;

type ProductId = typeof PRODUCTS[number]["id"];

export function ProductShowcase3D({ onViewAll }: { onViewAll?: () => void }) {
  const [activeTab, setActiveTab] = useState<ProductId>("shroud");
  const product = PRODUCTS.find((p) => p.id === activeTab) || PRODUCTS[0];

  return (
    <section className="bg-[#050505] border-b border-white/[0.06] py-20 lg:py-28 relative">
      {/* Blueprint grid lines */}
      <div className="absolute left-6 md:left-10 top-0 bottom-0 w-[1px] bg-white/[0.03] pointer-events-none" />
      <div className="absolute right-6 md:right-10 top-0 bottom-0 w-[1px] bg-white/[0.03] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-[44px]">
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

            {/* View All button — below product list */}
            {onViewAll && (
              <button
                onClick={onViewAll}
                className="group mt-2 w-full flex items-center justify-between px-4 py-3 font-tech text-[10px] tracking-wider text-blueprint-dim uppercase border border-white/[0.06] hover:border-blueprint/30 hover:text-white hover:bg-[#0d0f12]/40 transition-all duration-300 focus:outline-none"
              >
                <span>(VIEW ALL PRODUCTS)</span>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-0.5 transition-transform duration-300">
                  <path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
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
