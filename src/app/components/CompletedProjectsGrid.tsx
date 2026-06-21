import { useState } from "react";

const PROJECTS = [
  {
    code: "PRJ-001",
    name: "LVM3 CORE BASE SHROUD",
    programme: "ISRO // LVM3 LAUNCH VEHICLE",
    material: "ALUMINIUM ALLOY AA2219",
    status: "FLIGHT QUALIFIED",
    deliveries: "12 ASSEMBLIES",
    year: "2021–2024",
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800&h=600",
    badge: "ORBIT",
  },
  {
    code: "PRJ-002",
    name: "AGNI-V MOTOR CASING",
    programme: "DRDO // STRATEGIC SYSTEMS",
    material: "MARAGING STEEL M250",
    status: "OPERATIONAL DELIVERY",
    deliveries: "40+ CASINGS",
    year: "2015–2025",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800&h=600",
    badge: "DEFENCE",
  },
  {
    code: "PRJ-003",
    name: "GAGANYAAN MODULE STRUCTURE",
    programme: "ISRO // CREW MODULE",
    material: "TITANIUM TI-6AL-4V",
    status: "TEST PHASE COMPLETE",
    deliveries: "1 FULL UNIT",
    year: "2022–2023",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=600",
    badge: "CREWED",
  },
  {
    code: "PRJ-004",
    name: "PSLV AUXILIARY SEPARATION SYSTEM",
    programme: "ISRO // PSLV & GSLV",
    material: "ALUMINIUM AL7075 + MARAGING",
    status: "LEAD VENDOR CERTIFIED",
    deliveries: "60+ FLIGHT SETS",
    year: "2010–2025",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=800&h=600",
    badge: "ORBIT",
  },
  {
    code: "PRJ-005",
    name: "SAGARIKA AIRFRAME STRUCTURE",
    programme: "DRDO // SUBSURFACE MISSILE",
    material: "15CDV6 STEEL ALLOY",
    status: "OPERATIONAL",
    deliveries: "MULTIPLE AIRFRAMES",
    year: "2010–2018",
    image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&q=80&w=800&h=600",
    badge: "DEFENCE",
  },
  {
    code: "PRJ-006",
    name: "HYPERSONIC GLIDE VEHICLE CASINGS",
    programme: "DRDO // HGV PROGRAMME",
    material: "TITANIUM + INCONEL 718",
    status: "DELIVERY COMPLETE",
    deliveries: "FLIGHT HARDWARE",
    year: "2024–2025",
    image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800&h=600",
    badge: "HYPERSONIC",
  },
];

const BADGE_STYLES: Record<string, string> = {
  ORBIT:      "text-blue-300 border-blue-700/40 bg-blue-900/20",
  DEFENCE:    "text-orange-300 border-orange-700/40 bg-orange-900/15",
  CREWED:     "text-emerald-300 border-emerald-700/40 bg-emerald-900/15",
  HYPERSONIC: "text-purple-300 border-purple-700/40 bg-purple-900/15",
};

export function CompletedProjectsGrid() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="bg-[#0a0a0a] border-b border-white/[0.06] py-20 lg:py-28 relative">
      <div className="absolute left-6 md:left-10 top-0 bottom-0 w-[1px] bg-white/[0.025] pointer-events-none" />
      <div className="absolute right-6 md:right-10 top-0 bottom-0 w-[1px] bg-white/[0.025] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px]">
        {/* Section header */}
        <div className="mb-14 lg:mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="font-tech text-blueprint text-[10px] tracking-[0.25em] uppercase mb-4">
              DELIVERED PROGRAMMES // FLIGHT & DEFENCE HARDWARE
            </p>
            <h2 className="font-sans font-bold text-white text-3xl lg:text-[42px] leading-tight tracking-[-1px] uppercase">
              PROOF IN EVERY PAYLOAD.
            </h2>
          </div>
          <p className="font-tech text-xs text-blueprint-dim tracking-wider uppercase max-w-sm leading-relaxed">
            EVERY CARD REPRESENTS A CONTRACT DELIVERED FLIGHT-READY — FROM MACHINING TO CMM SIGN-OFF TO DISPATCH.
          </p>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROJECTS.map((p) => {
            const isActive = active === p.code;
            return (
              <div
                key={p.code}
                onMouseEnter={() => setActive(p.code)}
                onMouseLeave={() => setActive(null)}
                className={`relative border rounded-[2px] overflow-hidden group cursor-pointer transition-all duration-500 ${
                  isActive
                    ? "border-blueprint/30 shadow-[0_0_24px_rgba(255,119,0,0.07)]"
                    : "border-white/[0.06] hover:border-white/[0.12]"
                }`}
              >
                {/* Photo */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className={`w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive
                        ? "grayscale-0 brightness-[0.85] scale-[1.04]"
                        : "grayscale brightness-[0.65] scale-100"
                    }`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent pointer-events-none" />

                  {/* Corner tick marks */}
                  <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-blueprint/50" />
                  <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-blueprint/50" />

                  {/* Badge */}
                  <div className={`absolute top-3 right-3 font-tech text-[8px] font-bold tracking-widest px-2 py-1 rounded-[2px] border uppercase ${BADGE_STYLES[p.badge] || ""}`}>
                    {p.badge}
                  </div>

                  {/* Code label */}
                  <div className="absolute bottom-3 left-3 font-tech text-[8px] text-blueprint/70 tracking-widest bg-black/70 border border-white/[0.05] px-2 py-0.5">
                    {p.code} // {p.year}
                  </div>
                </div>

                {/* Card details */}
                <div className="p-5 bg-[#0a0a0a] flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-tech text-[9px] text-blueprint tracking-widest uppercase font-bold">
                      {p.programme}
                    </span>
                    <h3 className="font-sans font-bold text-white text-[15px] tracking-tight uppercase">
                      {p.name}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 border-t border-white/[0.04] pt-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-tech text-[8px] text-blueprint-dim tracking-wider uppercase">MATERIAL</span>
                      <span className="font-tech text-[10px] text-white/80 tracking-wider uppercase">{p.material}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-tech text-[8px] text-blueprint-dim tracking-wider uppercase">DELIVERED</span>
                      <span className="font-tech text-[10px] text-white/80 tracking-wider uppercase">{p.deliveries}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300 ${
                        isActive ? "bg-blueprint shadow-[0_0_6px_#ff7700]" : "bg-white/15"
                      }`}
                    />
                    <span className="font-tech text-[9px] tracking-widest text-blueprint-dim uppercase">
                      {p.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
