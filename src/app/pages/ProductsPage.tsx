import { useState } from "react";
import { IMAGES } from "@/config/images";
import { useSanity } from "@/lib/useSanity";
import { PRODUCTS_QUERY } from "@/lib/queries";
import type { SanityProduct } from "@/lib/types";

type Programme = "ALL" | "ISRO" | "DRDO" | "HSFC";

const I = {
  shell: IMAGES.products.shell,
  fin:   IMAGES.products.fin,
  weld:  IMAGES.products.weld,
  prec:  IMAGES.products.precision,
  assy:  IMAGES.products.assembly,
  fac:   IMAGES.products.facility,
};

const FALLBACK_PRODUCTS: SanityProduct[] = [
  {
    _id: "1", id: "lvm3-shroud", num: "01", title: "LVM3 Core Base Shroud", programme: "ISRO", img: I.shell,
    specs: [{ k: "DIAMETER", v: "4200 MM" }, { k: "HEIGHT", v: "3300 MM" }, { k: "MATERIAL", v: "AA 7075, AA2014, 15CDV6" }],
    desc: "Assembly combines advanced sheet metal forming with isogrid panel machining, structural riveting through fixture and integration, rolling of brackets.",
  },
  { _id: "2",  id: "stab-fin",           num: "02", title: "Stabilizer Fin Assy.",                      programme: "DRDO", img: I.fin,   specs: [{ k: "HEIGHT", v: "500 MM" }, { k: "LENGTH", v: "800 MM" }, { k: "MATERIAL", v: "Ti. Grade-V, Inconel 13-8MO" }], desc: "Constructed from 108 components showcasing complex machining and riveting of specialized materials like Titanium Grade 5, Inconel, and 13-8 MO." },
  { _id: "3",  id: "rcs-vtp",            num: "03", title: "RCS & VTP",                                  programme: "DRDO", img: I.prec,  specs: [{ k: "DIAMETER", v: "1500 MM" }, { k: "HEIGHT", v: "1000 MM" }, { k: "MATERIAL", v: "Al. Alloy 2014, SS316L & SS308L Graphite" }], desc: "Integration of propellent tanks with adaptors, thrusters and pipeline assemblies." },
  { _id: "4",  id: "metal-canister",     num: "04", title: "Metal Canister",                             programme: "DRDO", img: I.weld,  specs: [{ k: "DIAMETER", v: "1300 MM" }, { k: "LENGTH", v: "9000 MM" }, { k: "MATERIAL", v: "SA516, 15CDV6" }], desc: "Specialized missile launch canister utilizing welded SA516 and 15CDV6 construction. Hydraulic pressure testing up to 10 bar and pneumatic leak testing up to 0.3 bar." },
  { _id: "5",  id: "nose-cap",           num: "05", title: "Nose Cap",                                   programme: "DRDO", img: I.assy,  specs: [{ k: "DIAMETER", v: "1400 MM" }, { k: "HEIGHT", v: "2000 MM" }, { k: "MATERIAL", v: "15CDV6, AA2219, Titanium Grade V" }], desc: "Combination of honeycomb machining, welding AA2219 honeycomb sections and final assembly with lock ring, inner ring, dome and package fitting brackets." },
  { _id: "6",  id: "payload",            num: "06", title: "Pay Load",                                   programme: "DRDO", img: I.prec,  specs: [{ k: "DIAMETER", v: "600 MM" }, { k: "HEIGHT", v: "1500 MM" }, { k: "MATERIAL", v: "15CDV6, AA2014" }], desc: "Combination of machining, riveting, and assembly." },
  { _id: "7",  id: "smf",               num: "07", title: "SMF",                                        programme: "HSFC", img: I.fac,   specs: [{ k: "DIAMETER", v: "4200 MM" }, { k: "HEIGHT", v: "4000 MM" }, { k: "MATERIAL", v: "AA7075" }], desc: "Features sophisticated blend of precision-machined isogrid panels and high-strength riveted assembly." },
  { _id: "8",  id: "airframe-structure", num: "08", title: "Air Frame Structure",                        programme: "DRDO", img: I.fin,   specs: [{ k: "DIAMETER", v: "740 MM" }, { k: "HEIGHT", v: "3200 MM" }, { k: "MATERIAL", v: "15CDV6, Tungsten" }], desc: "Assembly integrates sections with precision milling, turning and welding techniques for final structure realisation." },
  { _id: "9",  id: "nozzle-assy",        num: "09", title: "Nozzle Assy.",                               programme: "ISRO", img: I.assy,  specs: [{ k: "DIAMETER", v: "2500 MM" }, { k: "HEIGHT", v: "1500 MM" }, { k: "MATERIAL", v: "15CDV6" }], desc: "Precision-engineered fabrication, rolling of Grade 70 plates, RT quality weld and machining to final stage maintaining thickness very accurately to avoid weight penalties for launch vehicle." },
  { _id: "10", id: "lem-motor-case",     num: "10", title: "LEM Motor Case",                             programme: "ISRO", img: I.shell, specs: [{ k: "DIAMETER", v: "800 MM" }, { k: "HEIGHT", v: "4000 MM" }, { k: "MATERIAL", v: "15CDV6" }], desc: "Fabricated from sheet rolling to machining to welding; featuring complex machining of cant angle nozzle convergents, with certificated proof pressure testing up to 132 kg/cm²." },
  { _id: "11", id: "sagarika-motor-case",num: "11", title: "Sagarika Motor Case",                        programme: "DRDO", img: I.weld,  specs: [{ k: "DIAMETER", v: "800 MM" }, { k: "HEIGHT", v: "1500 MM" }, { k: "MATERIAL", v: "Maraging Steel M250" }], desc: "Fabricated from sheet rolling to final assembly: featuring high-precision machining, specialized heat treatment and rigorous 125 kg/cm² pressure validation." },
  { _id: "12", id: "mandrel",            num: "12", title: "Mandrel",                                    programme: "ISRO", img: I.prec,  specs: [{ k: "DIAMETER", v: "3200 MM" }, { k: "HEIGHT", v: "5000 MM" }, { k: "MATERIAL", v: "Grade 70" }], desc: "One of its kind 13 fin mandrel for S200 boosters executed by welding of Grade 70 material, machining of fins to highest accuracy, final assembly by laser inspection followed by Teflon coating." },
  { _id: "13", id: "tbsl",              num: "13", title: "TBSL",                                       programme: "ISRO", img: I.shell, specs: [{ k: "DIAMETER", v: "2000 MM (3200 INC. FINS)" }, { k: "HEIGHT", v: "1800 MM" }, { k: "MATERIAL", v: "AA7075" }], desc: "Features precision machining of isogrid panels and high strength riveted assembly." },
  { _id: "14", id: "astra-casing",       num: "14", title: "Astra Rocket Motor Casing",                 programme: "DRDO", img: I.weld,  specs: [{ k: "DIAMETER", v: "190 MM" }, { k: "LENGTH", v: "2000 MM" }, { k: "MATERIAL", v: "Maraging Steel M250" }], desc: "Combination of flowform tube welding, machining, RT, DP, and proof pressure testing up to 210 bar." },
  { _id: "15", id: "control-surface",    num: "15", title: "Control Surface",                            programme: "DRDO", img: I.fin,   specs: [{ k: "HEIGHT", v: "400 MM" }, { k: "LENGTH", v: "500 MM" }, { k: "MATERIAL", v: "Ti. Grade V, Inconel 718, 13-8MO, Custom 465" }], desc: "Constructed from 95 components, showcasing complex machining and riveting of specialized materials including Titanium Grade 5, Custom 465, Inconel 718 and 13-8 MO." },
  { _id: "16", id: "l110-egc",           num: "16", title: "L110 EGC Actuator System Components",        programme: "ISRO", img: I.prec,  specs: [{ k: "MATERIAL", v: "15CDV6, Inconel 718, 15-5PH, 17-4PH, AA7075" }, { k: "TOLERANCE", v: "15–25 MICRONS" }, { k: "COMPONENTS", v: "56 INDIVIDUAL PARTS" }], desc: "High-precision actuator systems engineered to tolerances of 15–25 microns, featuring a sophisticated integration of 56 individual components." },
  { _id: "17", id: "sbs-assy",           num: "17", title: "SBS Assy.",                                  programme: "ISRO", img: I.fac,   specs: [{ k: "DIAMETER", v: "2160 MM" }, { k: "HEIGHT", v: "2000 MM" }, { k: "MATERIAL", v: "15CDV6, Al. Alloy 2014" }], desc: "Assembly of engine mounting adaptor with 2° angular accuracy in internal section, along with rings, sheet metal formation of skins and stiffeners, assembled with reviting, jo-bolt and shear bolt fixing." },
  { _id: "18", id: "slant-nose-cone",    num: "18", title: "Slant Nose Cone Assy.",                      programme: "ISRO", img: I.assy,  specs: [{ k: "DIAMETER", v: "2160 MM" }, { k: "HEIGHT", v: "3800 MM" }, { k: "MATERIAL", v: "Al. Alloy 2014, 15CDV6" }], desc: "Precision-engineered assembly — a combination of sheet rolling and ring machining, finalised with high-strength riveting and specialised jobolt fastening." },
  { _id: "19", id: "rcs-assy",           num: "19", title: "Reaction Control Structure Assy.",           programme: "ISRO", img: I.shell, specs: [{ k: "DIAMETER", v: "700 MM" }, { k: "HEIGHT", v: "2700 MM" }, { k: "MATERIAL", v: "Al. Alloy 2014, 15CDV6, EN24, AISI304" }], desc: "Unique structure 700mm dia and height 2700mm. Assembly from top to bottom concentricity shall be maintained within 0.4mm, achieved by precision fixturing and assembly sequence techniques." },
  { _id: "20", id: "thrust-frame",       num: "20", title: "Thrust Frame",                               programme: "ISRO", img: I.assy,  specs: [{ k: "DIAMETER", v: "3000 MM" }, { k: "HEIGHT", v: "1500 MM" }, { k: "MATERIAL", v: "Al. Alloy 2014, 15CD V6" }], desc: "Combination of sheet rolling, riveting, ring machining, and jo-bolt fixing." },
  { _id: "21", id: "strap-on-nose-cone", num: "21", title: "Strap On Nose Cone Assy.",                   programme: "ISRO", img: I.fin,   specs: [{ k: "DIAMETER", v: "Ø 1000 MM" }, { k: "HEIGHT", v: "1387 MM" }, { k: "MATERIAL", v: "Al. Alloy 2014, 15CDV6, MDN 250 & EN24" }], desc: "Combination of sheet rolling, riveting, ring machining, and jo-bolt fixing." },
  { _id: "22", id: "its-assy",           num: "22", title: "ITS Assy.",                                  programme: "ISRO", img: I.shell, specs: [{ k: "DIAMETER", v: "Ø 2160 MM" }, { k: "HEIGHT", v: "2000 MM" }, { k: "MATERIAL", v: "Al.Alloy2014, 15CD V6, AISI 304" }], desc: "Features precision machining of rings, sheet metal formation of skins and stiffeners, assembled with reviting, jo-bolt fixing, shear bolt fixing and quality checked by laser measurement." },
  { _id: "23", id: "propellant-tank",    num: "23", title: "Propellant Tank Assy.",                      programme: "DRDO", img: I.prec,  specs: [{ k: "OVERALL SIZE", v: "80, 48, 36, 32, 21, 7 LTS" }, { k: "MATERIAL", v: "Al. Alloy 65032, 19500, & AISI 321" }], desc: "Combination of machining of top dish and bottom dish welding, hydraulic pressure test up to 60 bar and pneumatic pressure test up to 45 bar." },
  { _id: "24", id: "akash-airframes",    num: "24", title: "Airframes Section 1A & II Assy. (AKASH)",   programme: "DRDO", img: I.fin,   specs: [{ k: "DIAMETER", v: "300 MM" }, { k: "HEIGHT", v: "1200 MM" }, { k: "MATERIAL", v: "Al. Alloy AA 2014 & FRP" }], desc: "Combination of machining, riveting, and assembly of Section I & II." },
];

const FILTERS: Programme[] = ["ALL", "ISRO", "DRDO", "HSFC"];

export function ProductsPage({ onBack }: { onBack: () => void }) {
  const { data } = useSanity<SanityProduct[]>(PRODUCTS_QUERY);
  const PRODUCTS = data?.length ? data : FALLBACK_PRODUCTS;

  const PROGRAMME_COUNTS = {
    ALL:  PRODUCTS.length,
    ISRO: PRODUCTS.filter(p => p.programme === "ISRO").length,
    DRDO: PRODUCTS.filter(p => p.programme === "DRDO").length,
    HSFC: PRODUCTS.filter(p => p.programme === "HSFC").length,
  };

  const [filter, setFilter] = useState<Programme>("ALL");
  const [activeId, setActiveId] = useState(PRODUCTS[0].id);

  const filtered = filter === "ALL" ? PRODUCTS : PRODUCTS.filter(p => p.programme === filter);
  const display = filtered.find(p => p.id === activeId) ?? filtered[0];

  const handleFilter = (f: Programme) => {
    setFilter(f);
    const next = f === "ALL" ? PRODUCTS : PRODUCTS.filter(p => p.programme === f);
    if (next.length > 0 && !next.find(p => p.id === activeId)) {
      setActiveId(next[0].id);
    }
  };

  return (
    <section className="bg-[#050505] min-h-screen py-20 lg:py-28 relative">
      {/* Blueprint side lines */}
      <div className="absolute left-6 md:left-10 top-0 bottom-0 w-[1px] bg-white/[0.025] pointer-events-none" />
      <div className="absolute right-6 md:right-10 top-0 bottom-0 w-[1px] bg-white/[0.025] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-[44px]">

        {/* Section header */}
        <div className="mb-14 lg:mb-16">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <p className="font-tech text-blueprint text-[10px] tracking-[0.25em] uppercase mb-4">
                FLIGHT HARDWARE // COMPLETE PRODUCT REGISTRY
              </p>
              <h2 className="font-sans font-bold text-white text-3xl lg:text-[42px] leading-tight tracking-[-1px] uppercase">
                ALL PROGRAMMES.
              </h2>
              <p className="font-tech text-xs text-blueprint-dim tracking-wider uppercase max-w-xl mt-3 leading-relaxed">
                24 FLIGHT-QUALIFIED PRODUCTS DELIVERED TO ISRO, DRDO & HSFC — EACH ENGINEERED TO MISSION-CRITICAL TOLERANCES.
              </p>
            </div>
            <button
              onClick={onBack}
              className="flex-shrink-0 flex items-center gap-2 font-tech text-[10px] tracking-wider text-blueprint-dim uppercase border border-white/[0.08] px-5 py-3 hover:border-blueprint/30 hover:text-white transition-all duration-300 self-start mt-1"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              BACK TO SCHEMATICS
            </button>
          </div>
        </div>

        {/* 3-column layout — same as ProductShowcase3D */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* ── Left: filter + scrollable selector ── */}
          <div className="lg:col-span-3 flex flex-col gap-2 text-left">
            {/* Programme filter pills */}
            <span className="font-tech text-[9px] text-blueprint-dim tracking-widest uppercase mb-2 select-none">
              FILTER BY PROGRAMME
            </span>
            <div className="grid grid-cols-2 gap-1.5 mb-4">
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => handleFilter(f)}
                  className={`flex items-center justify-between px-3 py-2 font-tech text-[9px] tracking-wider uppercase border transition-all duration-200 focus:outline-none ${
                    filter === f
                      ? "border-blueprint/40 bg-blueprint/10 text-blueprint"
                      : "border-white/[0.06] text-blueprint-dim hover:border-white/20 hover:text-white"
                  }`}
                >
                  <span>{f}</span>
                  <span className={`text-[8px] ${filter === f ? "text-blueprint/70" : "text-white/20"}`}>
                    {PROGRAMME_COUNTS[f]}
                  </span>
                </button>
              ))}
            </div>

            {/* Product list */}
            <span className="font-tech text-[9px] text-blueprint-dim tracking-widest uppercase mb-2 select-none">
              SELECT PRODUCT — {filtered.length} RESULTS
            </span>
            <div className="flex flex-col gap-1 overflow-y-auto max-h-[520px]" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,119,0,0.15) transparent" }}>
              {filtered.map((p) => {
                const active = p.id === display.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveId(p.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left border transition-all duration-200 focus:outline-none ${
                      active
                        ? "bg-[#0D0F12] border-blueprint/25 text-white"
                        : "bg-transparent border-white/[0.03] text-blueprint-dim hover:text-white hover:bg-[#0D0F12]/20"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300 ${active ? "bg-blueprint shadow-[0_0_8px_#ff7700]" : "bg-white/10"}`} />
                      <span className="font-tech text-[9px] tracking-wide font-semibold uppercase leading-tight truncate">
                        {p.num} // {p.title}
                      </span>
                    </div>
                    <span className={`font-tech text-[7px] tracking-wider uppercase flex-shrink-0 ml-2 px-1.5 py-0.5 border ${
                      p.programme === "ISRO" ? "border-blueprint/20 text-blueprint/60" :
                      p.programme === "DRDO" ? "border-verified/20 text-verified/60" :
                      "border-white/10 text-white/30"
                    }`}>
                      {p.programme}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Center: product photo (greyscale → colour on hover) ── */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            <span className="font-tech text-[9px] text-blueprint-dim tracking-widest uppercase mb-2 select-none">
              PRODUCT REFERENCE — HOVER TO REVEAL COLOUR
            </span>
            <div className="relative aspect-[4/3] bg-[#0d0f12]/30 border border-white/[0.06] rounded-[2px] overflow-hidden group cursor-crosshair select-none">
              {/* Corner brackets */}
              <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t border-l border-blueprint/40 pointer-events-none z-20" />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t border-r border-blueprint/40 pointer-events-none z-20" />
              <div className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b border-l border-blueprint/40 pointer-events-none z-20" />
              <div className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b border-r border-blueprint/40 pointer-events-none z-20" />

              {/* Photo — greyscale by default, full colour on hover */}
              <img
                key={display.id}
                src={display.img}
                alt={display.title}
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-75 contrast-110 group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none z-10" />

              {/* Scanlines */}
              <div
                className="absolute inset-0 pointer-events-none z-10 opacity-[0.025] group-hover:opacity-0 transition-opacity duration-700"
                style={{ background: "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(255,255,255,0.4) 3px, rgba(255,255,255,0.4) 4px)" }}
              />

              {/* HUD — top */}
              <div className="absolute top-4 left-4 bg-black/75 border border-white/[0.06] px-2 py-1 font-tech text-[8px] text-blueprint tracking-wider z-20">
                SYS_REF: PROD_{display.num}
              </div>
              <div className={`absolute top-4 right-4 bg-black/75 border px-2 py-1 font-tech text-[8px] tracking-wider z-20 ${
                display.programme === "ISRO" ? "border-blueprint/20 text-blueprint" :
                display.programme === "DRDO" ? "border-verified/20 text-verified" :
                "border-white/10 text-white/50"
              }`}>
                FOR {display.programme}
              </div>

              {/* HUD — bottom */}
              <div className="absolute bottom-4 left-4 bg-black/75 border border-white/[0.06] px-3 py-1.5 font-tech text-[10px] text-white tracking-wider z-20 uppercase max-w-[60%]">
                {display.title}
              </div>
              <div className="absolute bottom-4 right-4 bg-black/75 border border-white/[0.06] px-2 py-1 font-tech text-[7px] text-blueprint-dim tracking-wider z-20 group-hover:text-blueprint transition-colors duration-300">
                HOVER: COLOUR ON
              </div>
            </div>

            {/* Mini nav arrows */}
            <div className="flex items-center justify-between mt-1">
              <button
                onClick={() => {
                  const idx = filtered.findIndex(p => p.id === display.id);
                  if (idx > 0) setActiveId(filtered[idx - 1].id);
                }}
                disabled={filtered.findIndex(p => p.id === display.id) === 0}
                className="font-tech text-[9px] tracking-wider text-blueprint-dim uppercase px-3 py-2 border border-white/[0.04] hover:border-white/20 hover:text-white transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
              >
                ← PREV
              </button>
              <span className="font-tech text-[9px] text-blueprint-dim tracking-wider uppercase">
                {filtered.findIndex(p => p.id === display.id) + 1} / {filtered.length}
              </span>
              <button
                onClick={() => {
                  const idx = filtered.findIndex(p => p.id === display.id);
                  if (idx < filtered.length - 1) setActiveId(filtered[idx + 1].id);
                }}
                disabled={filtered.findIndex(p => p.id === display.id) === filtered.length - 1}
                className="font-tech text-[9px] tracking-wider text-blueprint-dim uppercase px-3 py-2 border border-white/[0.04] hover:border-white/20 hover:text-white transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
              >
                NEXT →
              </button>
            </div>
          </div>

          {/* ── Right: hardware specs panel ── */}
          <div className="lg:col-span-4 flex flex-col text-left h-full justify-between">
            <div>
              <span className="font-tech text-[9px] text-blueprint-dim tracking-widest uppercase block mb-3 select-none">
                HARDWARE PARAMETERS
              </span>
              <div className="flex items-center gap-2 mb-4">
                <span className={`font-tech text-[8px] tracking-wider px-2 py-1 border ${
                  display.programme === "ISRO" ? "border-blueprint/30 text-blueprint bg-blueprint/5" :
                  display.programme === "DRDO" ? "border-verified/30 text-verified bg-verified/5" :
                  "border-white/10 text-white/50"
                }`}>
                  {display.programme}
                </span>
                <span className="font-tech text-[8px] tracking-wider text-blueprint-dim border border-white/[0.04] px-2 py-1">
                  PROD {display.num} / 24
                </span>
              </div>
              <h3 className="font-sans font-bold text-white text-lg lg:text-xl tracking-tight uppercase mb-4 leading-tight">
                {display.title}
              </h3>
              <p className="font-tech text-[11px] text-[rgba(234,242,251,0.8)] tracking-wider leading-relaxed uppercase">
                {display.desc}
              </p>
            </div>

            <div className="flex flex-col gap-3.5 border-t border-white/[0.06] pt-6 mt-6">
              {display.specs.map((s) => (
                <div key={s.k} className="flex flex-col border-b border-white/[0.03] pb-2.5 last:border-b-0">
                  <span className="font-tech text-[8px] tracking-wider text-blueprint-dim uppercase">{s.k}</span>
                  <span className="font-tech text-[11px] tracking-widest text-white font-medium uppercase mt-0.5">{s.v}</span>
                </div>
              ))}
            </div>

            {/* Bottom counter */}
            <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className="font-tech text-[8px] text-blueprint-dim tracking-wider uppercase">
                {filtered.length} PRODUCTS LISTED
              </span>
              <div className="flex gap-0.5">
                {filtered.slice(0, Math.min(filtered.length, 12)).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveId(p.id)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${p.id === display.id ? "bg-blueprint shadow-[0_0_4px_#ff7700]" : "bg-white/10 hover:bg-white/30"}`}
                  />
                ))}
                {filtered.length > 12 && (
                  <span className="font-tech text-[7px] text-blueprint-dim ml-1 self-center">+{filtered.length - 12}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
