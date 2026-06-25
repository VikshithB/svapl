import { useState, useRef, useEffect } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { MetrologySimulator } from "@/app/components/MetrologySimulator";
import { IMAGES } from "@/config/images";

/* ─── Content from SVAPL PPT + brochure ─── */

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Raw Material Receipt & Verification",
    desc: "Incoming raw materials — aluminium alloys, 15CDV6, maraging steel, titanium billet and forgings — are received, tagged and tested for mechanical and chemical compliance against customer-approved material certificates. Traceability is established from first log entry through to final dispatch.",
    detail: "Destructive and non-destructive sample testing, heat number traceability, storage zoning by material class.",
    image: IMAGES.howWeBuild.process.rawMaterial
  },
  {
    step: "02",
    title: "Manufacturing Process & QA Plan",
    desc: "For every new component, SVAPL generates a Manufacturing Process Sheet and Quality Assurance Plan with defined inspection hold points. These documents are reviewed and signed off by the customer before shop-floor release.",
    detail: "Customer DDP review, process FMEA, first-article inspection plan, tooling design approval.",
    image: IMAGES.howWeBuild.process.qaPlanning
  },
  {
    step: "03",
    title: "Tooling & Fixturing",
    desc: "Critical tooling, jigs and fixtures are designed and manufactured in-house using CATIA V5. All tooling is dimensionally verified by CMM before first-piece production. We maintain a tooling library for repeat programmes, reducing qualification cycles.",
    detail: "In-house tooling design, CMM-verified fixtures, dedicated tooling stores.",
    image: IMAGES.howWeBuild.process.tooling
  },
  {
    step: "04",
    title: "Fabrication",
    desc: "Sheet metal forming, plate bending (up to 40 mm), ring rolling and large-format fabrication operations produce primary structural skins, frames and stiffeners. Weld assemblies are performed in our ISO 8 clean room with full humidity control for the most sensitive alloys.",
    detail: "Plate bending up to 40 mm, ring rolling up to Ø 5,000 mm, clean-room TIG welding, hydro/pneumatic proof.",
    image: IMAGES.howWeBuild.process.fabrication
  },
  {
    step: "05",
    title: "CNC Machining",
    desc: "Components move to our machine shop: 11 CNC milling centres (5-axis, 4-axis, 3-axis), 4 plano mills, 4 CNC vertical turning lathes (up to Ø 5,400 mm) and 4 horizontal borers. Inter-operation inspection is performed at defined stages using CMM and 3D measuring arm.",
    detail: "In-process CMM checks, toolpath verification, fixture re-qualification after every tool change on tight-tolerance features.",
    image: IMAGES.howWeBuild.process.cncMachining
  },
  {
    step: "06",
    title: "Assembly & Integration",
    desc: "Structural assembly — riveting, jo-bolt and shear-bolt fastening — is performed in jig, with assembly sequence verified by approved traveller. Functional integration (hydraulic lines, thrusters, harness routing) is carried out in our 5,000 sq.ft clean room with customer hold-point sign-offs.",
    detail: "Jig-based assembly, approved sequence traveller, customer surveillance at IPIs.",
    image: IMAGES.howWeBuild.process.assembly
  },
  {
    step: "07",
    title: "NDT & Dimensional Inspection",
    desc: "Every weld joint undergoes radiographic or ultrasonic testing. Structural assemblies are inspected by CMM (600 × 600 × 500 mm), 3D arm (A6-2500, reach 2.5 m) or laser tracker. Dimensional reports are issued before release.",
    detail: "RT (X-ray 350 kVA), UT, DP, TT; CMM report, laser-tracker dimensional certificate.",
    image: IMAGES.howWeBuild.process.ndtInspection
  },
  {
    step: "08",
    title: "Pressure Testing",
    desc: "Pressure-carrying structures — motor cases, nozzles, propellant tanks, canisters — are proof-tested on our dedicated hydro and pneumatic rigs: hydro up to 700 ATA, pneumatic up to 150 ATA. Strain gauge monitoring is available for critical tests.",
    detail: "Hydro rig: 700 ATA. Pneumatic rig: 150 ATA. Strain gauge equipment, cycle fatigue testing.",
    image: IMAGES.howWeBuild.process.pressureTesting
  },
  {
    step: "09",
    title: "Non-Conformance Review & Disposition",
    desc: "Any non-conformance identified during inspection is documented, raised with the customer for disposition (use-as-is, rework, scrap) and resolved before the part progresses. A root-cause corrective action is raised for systemic issues.",
    detail: "Customer NCR format, RCCA log, Pareto trend review in monthly QRB.",
    image: IMAGES.howWeBuild.process.nonConformance
  },
  {
    step: "10",
    title: "Packing, Quality Docs & Dispatch",
    desc: "Finished assemblies are preserved and packed per customer specification, accompanied by a full quality dossier: material certs, inspection records, NDT films/reports, pressure test certs, dimensional reports and any customer-specific data packages.",
    detail: "Full traceability pack, preservation per customer spec, export-compliant packaging for ITAR/EAR-controlled items.",
    image: IMAGES.howWeBuild.process.packingDispatch
  }
];

interface Machine {
  name: string;
  category: string;
  image: string;
  specs: { label: string; value: string }[];
  schematics: {
    origin: string;
    travelRatio: string;
    laserCalib: string;
    axisEngaged: string;
  };
}

const MACHINE_DATA: Machine[] = [
  {
    name: "MAZAK INTEGREX i-200",
    category: "milling",
    image: IMAGES.howWeBuild.process.assembly,
    specs: [
      { label: "ENVELOPE SIZE", value: "Ø 658 mm × 1016 mm" },
      { label: "AXIS TRAVEL", value: "X: 615 // Y: 250 // Z: 1077" },
      { label: "SPINDLE CAPACITY", value: "12,000 RPM // 22 kW" },
      { label: "MAX LOAD LIMIT", value: "1,000 kg" }
    ],
    schematics: {
      origin: "X0.000 / Y0.000 / Z0.000",
      travelRatio: "1.25m/sec Max",
      laserCalib: "DEV: < 0.002mm",
      axisEngaged: "5-AXIS CONTINUOUS (B/C)"
    }
  },
  {
    name: "DECKEL MAHO DMU 80 P",
    category: "milling",
    image: IMAGES.howWeBuild.process.pressureTesting,
    specs: [
      { label: "ENVELOPE SIZE", value: "800 mm × 800 mm × 800 mm" },
      { label: "AXIS TRAVEL", value: "X: 800 // Y: 800 // Z: 800" },
      { label: "SPINDLE CAPACITY", value: "18,000 RPM // 35 kW" },
      { label: "MAX LOAD LIMIT", value: "800 kg" }
    ],
    schematics: {
      origin: "X0.001 / Y0.002 / Z0.000",
      travelRatio: "0.98m/sec Max",
      laserCalib: "DEV: < 0.003mm",
      axisEngaged: "5-AXIS GANTRY INTERFACE"
    }
  },
  {
    name: "HAAS VF-6/50",
    category: "milling",
    image: IMAGES.howWeBuild.machines.haasVf6,
    specs: [
      { label: "ENVELOPE SIZE", value: "1626 mm × 813 mm × 762 mm" },
      { label: "AXIS TRAVEL", value: "X: 1626 // Y: 813 // Z: 762" },
      { label: "SPINDLE CAPACITY", value: "7,500 RPM // 22.4 kW" },
      { label: "MAX LOAD LIMIT", value: "1,814 kg" }
    ],
    schematics: {
      origin: "X0.000 / Y0.000 / Z0.001",
      travelRatio: "0.85m/sec Max",
      laserCalib: "DEV: < 0.005mm",
      axisEngaged: "3-AXIS + Rotary Table"
    }
  },
  {
    name: "TOSHIBA VTL Ø5400",
    category: "turning",
    image: IMAGES.howWeBuild.process.fabrication,
    specs: [
      { label: "ENVELOPE SIZE", value: "Ø 5,400 mm × 3,200 mm" },
      { label: "AXIS TRAVEL", value: "X: 3,000 // Z: 1,800" },
      { label: "TABLE CAPACITY", value: "60,000 kg" },
      { label: "MAX CUTTING POWER", value: "75 kW" }
    ],
    schematics: {
      origin: "X0.000 / Z0.000",
      travelRatio: "0.45m/sec Max",
      laserCalib: "DEV: < 0.008mm",
      axisEngaged: "2-AXIS VTL HYDRAULIC RAM"
    }
  },
  {
    name: "PUMA 400L",
    category: "turning",
    image: IMAGES.howWeBuild.machines.puma400l,
    specs: [
      { label: "ENVELOPE SIZE", value: "Ø 550 mm × 2,028 mm" },
      { label: "AXIS TRAVEL", value: "X: 362 // Z: 2,150" },
      { label: "SPINDLE SPEED", value: "2,000 RPM // 30 kW" },
      { label: "MAX LOAD LIMIT", value: "1,500 kg" }
    ],
    schematics: {
      origin: "X0.000 / Z0.002",
      travelRatio: "0.75m/sec Max",
      laserCalib: "DEV: < 0.004mm",
      axisEngaged: "2-AXIS RIGID LATHE BED"
    }
  },
  {
    name: "DOOSAN VTL V8300",
    category: "turning",
    image: IMAGES.howWeBuild.process.cncMachining,
    specs: [
      { label: "ENVELOPE SIZE", value: "Ø 830 mm × 780 mm" },
      { label: "AXIS TRAVEL", value: "X: 490 // Z: 780" },
      { label: "SPINDLE SPEED", value: "2,500 RPM // 45 kW" },
      { label: "MAX LOAD LIMIT", value: "3,500 kg" }
    ],
    schematics: {
      origin: "X0.001 / Z0.001",
      travelRatio: "0.60m/sec Max",
      laserCalib: "DEV: < 0.005mm",
      axisEngaged: "2-AXIS VERTICAL RAM CHUCK"
    }
  },
  {
    name: "HEXAGON GLOBAL CMM",
    category: "metrology",
    image: IMAGES.howWeBuild.process.ndtInspection,
    specs: [
      { label: "MEASURING VOLUME", value: "600 mm × 600 mm × 500 mm" },
      { label: "VOLUMETRIC ERROR", value: "MPEE = 1.5 + L/333 µm" },
      { label: "PROBING SYSTEM", value: "Renishaw SP25M Continuous" },
      { label: "METROLOGY SUITE", value: "PC-DMIS CAD++" }
    ],
    schematics: {
      origin: "X0.000 / Y0.000 / Z0.000 (CALIBRATED)",
      travelRatio: "0.35m/sec Max",
      laserCalib: "DEV: < 0.0005mm",
      axisEngaged: "3-AXIS Gantry Metrology CMM"
    }
  },
  {
    name: "TRIMOS MEASURING ARM",
    category: "metrology",
    image: IMAGES.howWeBuild.process.nonConformance,
    specs: [
      { label: "MEASURING REACH", value: "2,500 mm (Radial Sphere)" },
      { label: "SINGLE POINT REPEATABILITY", value: "< 0.015 mm" },
      { label: "ENCODER JOINTS", value: "7-Axis Absolute System" },
      { label: "COMPLIANCE STANDARD", value: "ISO 10360-12" }
    ],
    schematics: {
      origin: "Radial Polar Center Point",
      travelRatio: "Manual Operator Feed",
      laserCalib: "DEV: < 0.012mm",
      axisEngaged: "7-AXIS ABSOLUTE ENCODER ARM"
    }
  }
];

function MachineCard({ machine }: { machine: Machine }) {
  const [hovered, setHovered] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [revealed, setRevealed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setCoords({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setRevealed(false);
      }}
      onMouseMove={handleMouseMove}
      className="relative border-b border-white/[0.06] bg-[#050505] p-6 md:p-8 overflow-hidden select-none group transition-colors duration-500 hover:bg-[#0D0F12]/40"
    >
      {hovered && (
        <>
          <div
            className="absolute top-0 bottom-0 w-[1px] bg-blueprint/15 pointer-events-none z-10"
            style={{ left: `${coords.x}px` }}
          />
          <div
            className="absolute left-0 right-0 h-[1px] bg-blueprint/15 pointer-events-none z-10"
            style={{ top: `${coords.y}px` }}
          />
          <div
            className="absolute font-tech text-[9px] text-blueprint/50 tracking-wider bg-[#050505] px-2 py-0.5 pointer-events-none select-none border border-white/[0.05] z-20"
            style={{
              left: `${coords.x + 12}px`,
              top: `${coords.y + 12}px`,
            }}
          >
            X: {coords.x}PX // Y: {coords.y}PX
          </div>
        </>
      )}

      <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/10 group-hover:border-blueprint/40 transition-colors" />
      <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/10 group-hover:border-blueprint/40 transition-colors" />
      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-white/10 group-hover:border-blueprint/40 transition-colors" />
      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/10 group-hover:border-blueprint/40 transition-colors" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left column: specs and text */}
        <div className="md:col-span-8 flex flex-col gap-6 text-left">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-lg sm:text-xl tracking-tight text-white uppercase group-hover:text-blueprint transition-colors duration-300">
              {machine.name}
            </h3>
            <span className="font-tech text-[10px] text-blueprint-dim uppercase tracking-widest bg-white/[0.02] border border-white/[0.05] px-2.5 py-1">
              SYS: ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-b border-white/[0.04] py-5">
            {machine.specs.map((spec, index) => (
              <div key={index} className="flex flex-col">
                <span className="font-tech text-[9px] tracking-widest text-blueprint-dim uppercase">{spec.label}</span>
                <span className="font-tech text-xs tracking-wider text-white font-medium uppercase mt-1">{spec.value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col">
            <button
              onClick={() => setRevealed(!revealed)}
              className="flex items-center gap-2 self-start font-tech text-[10px] tracking-widest text-blueprint hover:text-white transition-colors py-1 focus:outline-none"
            >
              <span>[ {revealed ? "HIDE" : "REVEAL"} TELEMETRY SCHEMATICS ]</span>
            </button>

            {revealed && (
              <div className="mt-4 p-4 border border-blueprint/20 bg-[#0D0F12]/60 rounded-sm grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="font-tech text-[9px] text-blueprint-dim tracking-wider">AXIS ENGAGED:</span>
                  <span className="font-tech text-[11px] text-white tracking-widest uppercase mt-0.5">{machine.schematics.axisEngaged}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-tech text-[9px] text-blueprint-dim tracking-wider">CALIBRATION CONSTANT:</span>
                  <span className="font-tech text-[11px] text-white tracking-widest uppercase mt-0.5">{machine.schematics.laserCalib}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-tech text-[9px] text-blueprint-dim tracking-wider">INTEGRATION ORIGIN:</span>
                  <span className="font-tech text-[11px] text-white tracking-widest uppercase mt-0.5">{machine.schematics.origin}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-tech text-[9px] text-blueprint-dim tracking-wider">TRAVEL SPEED RATIO:</span>
                  <span className="font-tech text-[11px] text-white tracking-widest uppercase mt-0.5">{machine.schematics.travelRatio}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Stylized machine photo */}
        <div className="md:col-span-4 relative aspect-[4/3] md:aspect-square w-full bg-[#0D0F12] border border-white/[0.05] overflow-hidden">
          <img
            src={machine.image}
            alt={machine.name}
            className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-95 group-hover:scale-[1.03] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          
          {/* Blueprint corner details */}
          <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-blueprint/40 pointer-events-none" />
          <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-blueprint/40 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-blueprint/40 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-blueprint/40 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

function MachineMatrix() {
  const [activeCategory, setActiveCategory] = useState("all");
  const filteredMachines = activeCategory === "all" 
    ? MACHINE_DATA 
    : MACHINE_DATA.filter(m => m.category === activeCategory);

  const categories = [
    { id: "all", label: "ALL MACHINERY", num: "00" },
    { id: "milling", label: "MILLING CENTERS", num: "01" },
    { id: "turning", label: "TURNING & VTLs", num: "02" },
    { id: "metrology", label: "METROLOGY SYSTEMS", num: "03" }
  ];

  return (
    <section className="bg-[#050505] border-t border-rule py-20">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px]">
        <div className="mb-12">
          <p className="font-tech text-blueprint text-[10px] tracking-[0.25em] uppercase mb-4">
            PRODUCTION SYSTEM // INFRASTRUCTURE
          </p>
          <h2 className="font-sans font-bold text-[#FFFFFF] text-3xl lg:text-[44px] leading-tight tracking-[-1.5px]">
            MACHINE MATRIX.
          </h2>
        </div>

        {/* Shop floor telemetry strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/[0.06] border border-white/[0.06] bg-[#0d0f12]/40 mb-10">
          {[
            { label: "ACTIVE MACHINES", val: "18 UNITS" },
            { label: "SHOP TEMP",       val: "22°C CONTROLLED" },
            { label: "CLEANROOM CLASS", val: "ISO CLASS 7" },
            { label: "SHIFT STATUS",    val: "3-SHIFT / 24H OPS" },
          ].map((m) => (
            <div key={m.label} className="px-5 py-4 flex flex-col gap-1">
              <span className="font-tech text-[8px] tracking-widest text-blueprint-dim uppercase">{m.label}</span>
              <span className="font-tech text-[11px] tracking-wider text-white font-semibold uppercase">{m.val}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-4 md:sticky md:top-28 flex flex-col gap-1 select-none">
            <span className="font-tech text-[9px] text-blueprint-dim tracking-widest uppercase mb-4">
              FILTER METROLOGY SYSTEM
            </span>
            
            {categories.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center justify-between p-4 text-left border border-white/[0.04] transition-all duration-300 relative focus:outline-none ${
                    active ? "bg-[#0D0F12] border-blueprint/25 text-white" : "bg-transparent text-blueprint-dim hover:text-white hover:bg-[#0D0F12]/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      active ? "bg-blueprint shadow-[0_0_8px_#ff7700]" : "bg-white/10"
                    }`} />
                    <span className="font-tech text-[11px] tracking-wider font-medium uppercase mt-0.5">{cat.label}</span>
                  </div>
                  <span className="font-tech text-[10px] text-blueprint-dim">{cat.num}</span>
                </button>
              );
            })}

            <div className="mt-8 font-tech text-[9px] text-blueprint-dim/60 tracking-wider flex flex-col gap-1 border border-white/[0.03] p-4 bg-[#050505]">
              <span>MATRIX STATUS: ACTIVE</span>
              <span>CALIBRATION PROTOCOL: AS9100D</span>
              <span>TOTAL ACTIVE ENVELOPE: 50+ NODES</span>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col border border-white/[0.06] divide-y divide-white/[0.06]">
            {filteredMachines.map((machine) => (
              <MachineCard key={machine.name} machine={machine} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const INSPECTION = [
  { name: "3D CMM (Hexagon)", spec: "600 × 600 × 500 mm" },
  { name: "3D Measuring Arm (TRIMOS)", spec: "A6-2500, 2.5 m reach" },
  { name: "Digital Height Gauge", spec: "TRIMOS" },
  { name: "X-Ray Machine", spec: "350 kVA Radiography" },
  { name: "Ultrasonic Testing", spec: "Pulse-echo & TOFD" },
  { name: "Dye Penetrant", spec: "Fluorescent & RDP kits" },
  { name: "Profile Projector", spec: "Dynascan" },
  { name: "Universal Tensile Tester", spec: "Destructive sample testing" },
  { name: "Hardness Tester", spec: "Rockwell & Vickers" },
  { name: "Surface Plates", spec: "1,000 × 2,000 mm granite" },
];

interface CertDetail {
  code: string;
  name: string;
  scope: string;
  registryNo: string;
  registrar: string;
  status: string;
  auditCycle: string;
  sigmaTarget: string;
  toleranceLimit: string;
  ppmRate: string;
  bellWidth: number;
}

const CERTS_DATA: CertDetail[] = [
  {
    code: "AS 9100D : 2016",
    name: "Aerospace Quality Management System",
    scope: "MANUFACTURE & ASSEMBLY OF PRECISION MACHINED COMPONENTS & FABRICATED STRUCTURES FOR LAUNCH VEHICLES, AEROSTRUCTURES & DEFENCE PLATFORMS.",
    registryNo: "REG-AS9100D-5721-SV",
    registrar: "TUV SUD SUDDEUTSCHLAND",
    status: "CERTIFIED // AUDITED & ACTIVE",
    auditCycle: "ANNUAL SURVEILLANCE // NEXT DUE: DEC 2026",
    sigmaTarget: "6-SIGMA QUALITY BOUND",
    toleranceLimit: "± 0.005mm Volumetric Limit",
    ppmRate: "< 3.4 PPM Defect Rate",
    bellWidth: 25
  },
  {
    code: "ISO 9001 : 2015",
    name: "Standard Quality Management System",
    scope: "QUALITY MANAGEMENT WORKFLOWS ACROSS ADMINISTRATIVE, FABRICATION, INVENTORY, AND SYSTEM INTEGRATION OPERATIONS.",
    registryNo: "REG-ISO9001-8204-SV",
    registrar: "TUV SUD SUDDEUTSCHLAND",
    status: "CERTIFIED // AUDITED & ACTIVE",
    auditCycle: "RE-CERTIFICATION DUE: OCT 2027",
    sigmaTarget: "3-SIGMA SYSTEM STANDARD",
    toleranceLimit: "± 0.020mm Process Target",
    ppmRate: "< 2700 PPM System Deviation",
    bellWidth: 50
  },
  {
    code: "ISO 14001 : 2015",
    name: "Environmental Management System",
    scope: "ENVIRONMENTAL CONTROL MANDATES FOR WET CHEMICAL MILLING, ANODIZING, SURFACE PASSIVATION & EFFLUENT MANAGEMENT HALLS.",
    registryNo: "REG-ISO14001-9430-SV",
    registrar: "METRO REGISTRARS CORP",
    status: "CERTIFIED // ACTIVE COMPLIANCE",
    auditCycle: "SURVEILLANCE CYCLE: APR 2027",
    sigmaTarget: "100% REGULATORY COMPLIANCE",
    toleranceLimit: "0.000% Non-Neutralized Effluent",
    ppmRate: "Zero Spill Incidents",
    bellWidth: 70
  },
  {
    code: "ISO 45001 : 2018",
    name: "Occupational Health & Safety",
    scope: "HEALTH & SAFETY PROTOCOLS INVOLVING CRANE LIFT HANDLING (UP TO 20T), HIGH PRESSURE HYDRO-PNEUMATIC TEST RIGS & GAS CHAMBER LOGS.",
    registryNo: "REG-ISO45001-1024-SV",
    registrar: "METRO REGISTRARS CORP",
    status: "CERTIFIED // ZERO INCIDENT LOG",
    auditCycle: "SURVEILLANCE CYCLE: APR 2027",
    sigmaTarget: "ZERO-INCIDENT THRESHOLD",
    toleranceLimit: "100% Personal Protective Equipment compliance",
    ppmRate: "0.0 Lost-Time Injuries / Year",
    bellWidth: 60
  }
];

function QualityTrustSection() {
  const [activeCertIdx, setActiveCertIdx] = useState(0);
  const cert = CERTS_DATA[activeCertIdx];

  const width = 400;
  const height = 150;
  const centerX = width / 2;
  const scaleY = 120;

  const getBellCurvePath = (bellWidth: number) => {
    let points = [];
    for (let x = -200; x <= 200; x += 2) {
      const exponent = -Math.pow(x, 2) / (2 * Math.pow(bellWidth, 2));
      const y = height - Math.exp(exponent) * scaleY - 10;
      points.push(`${x + centerX},${y}`);
    }
    return `M ${points.join(" L ")}`;
  };

  const pathD = getBellCurvePath(cert.bellWidth);

  return (
    <section className="bg-[#050505] border-t border-rule py-20 overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 pb-8 border-b border-white/[0.04]">
          <div>
            <p className="font-tech text-blueprint text-[10px] tracking-[0.25em] uppercase mb-4">
              METROLOGY CONFORMANCE // CALIBRATION LOGS
            </p>
            <h2 className="font-sans font-bold text-white text-4xl lg:text-[52px] leading-none tracking-tighter">
              ZERO ERROR MARGIN.
            </h2>
          </div>
          <div className="max-w-md border-l border-blueprint/30 pl-6 py-1 select-none">
            <blockquote className="font-tech text-xs tracking-wider text-blueprint-dim leading-relaxed uppercase">
              "FLIGHT-CRITICAL STRUCTURES MANDATE SYSTEM INTEGRITY WITHOUT DEVIATION: SVAPL COMPONENT TOLERANCES TARGET SUB-MICRON CONFORMANCE TO PREVENT SYSTEM FAILURE."
            </blockquote>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6 flex flex-col gap-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CERTS_DATA.map((c, idx) => (
                <button
                  key={c.code}
                  onClick={() => setActiveCertIdx(idx)}
                  className={`py-3 px-2 border text-center transition-all duration-300 font-tech text-[10px] tracking-widest focus:outline-none ${
                    activeCertIdx === idx
                      ? "bg-[#0D0F12] border-blueprint text-white shadow-[0_0_8px_rgba(255,119,0,0.15)]"
                      : "bg-transparent border-white/[0.04] text-blueprint-dim hover:text-white hover:bg-[#0D0F12]/30"
                  }`}
                >
                  {c.code.split(" : ")[0]}
                </button>
              ))}
            </div>

            <div className="border border-white/[0.08] bg-[#050505] p-6 relative select-none font-tech">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blueprint/40" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blueprint/40" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-blueprint/40" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-blueprint/40" />

              <div className="grid grid-cols-3 border-b border-white/[0.08] pb-4 mb-4 gap-4 text-left">
                <div className="col-span-2 border-r border-white/[0.08] pr-4">
                  <span className="text-[9px] text-blueprint-dim tracking-wider block uppercase">DOCUMENT NAME</span>
                  <span className="text-xs text-white font-semibold tracking-widest uppercase block mt-1 leading-snug">
                    {cert.name}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-blueprint-dim tracking-wider block uppercase">STANDARD</span>
                  <span className="text-xs text-blueprint font-bold tracking-widest block mt-1 uppercase">
                    {cert.code}
                  </span>
                </div>
              </div>

              <div className="border-b border-white/[0.08] pb-4 mb-4 text-left">
                <span className="text-[9px] text-blueprint-dim tracking-wider block uppercase">SCOPE OF CERTIFICATION</span>
                <p className="text-[10px] text-white/80 tracking-widest uppercase mt-1 leading-relaxed">
                  {cert.scope}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="border-r border-white/[0.08] pr-4">
                  <span className="text-[9px] text-blueprint-dim tracking-wider block uppercase">REGISTRATION NUMBER</span>
                  <span className="text-[11px] text-white tracking-widest uppercase block mt-1">
                    {cert.registryNo}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-blueprint-dim tracking-wider block uppercase">REGISTRAR BOARD</span>
                  <span className="text-[11px] text-white tracking-widest uppercase block mt-1">
                    {cert.registrar}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 border-t border-white/[0.08] pt-4 mt-4 gap-4 text-left">
                <div className="border-r border-white/[0.08] pr-4">
                  <span className="text-[9px] text-blueprint-dim tracking-wider block uppercase">AUDIT CYCLE</span>
                  <span className="text-[10px] text-white/60 tracking-wider uppercase block mt-1">
                    {cert.auditCycle}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-blueprint-dim tracking-wider block uppercase">REGISTRY STATUS</span>
                  <span className="text-[10px] text-verified font-bold tracking-widest uppercase block mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-verified animate-pulse" />
                    {cert.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 border border-white/[0.08] bg-[#050505] p-6 flex flex-col gap-6 relative select-none">
            <div className="absolute top-2 right-2 font-tech text-[8px] text-blueprint-dim/40 tracking-wider">
              GRID: STDEV-03
            </div>

            <div className="flex items-center gap-2 border-b border-white/[0.04] pb-4">
              <span className="font-tech text-xs text-blueprint">Ø</span>
              <h3 className="font-tech text-xs tracking-widest text-white uppercase font-bold">
                TOLERANCE DEVIATION ANALYSIS // {cert.sigmaTarget}
              </h3>
            </div>

            <div className="flex flex-col items-center justify-center py-4 bg-[#050505] border border-white/[0.03] relative">
              <svg width={width} height={height} className="overflow-visible block">
                <line
                  x1="0"
                  y1={height - 10}
                  x2={width}
                  y2={height - 10}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="1"
                />

                <line
                  x1={centerX}
                  y1="10"
                  x2={centerX}
                  y2={height - 10}
                  stroke="rgba(255, 119, 0, 0.25)"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                />

                <line
                  x1={centerX - cert.bellWidth}
                  y1="20"
                  x2={centerX - cert.bellWidth}
                  y2={height - 10}
                  stroke="rgba(69, 162, 158, 0.3)"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <line
                  x1={centerX + cert.bellWidth}
                  y1="20"
                  x2={centerX + cert.bellWidth}
                  y2={height - 10}
                  stroke="rgba(69, 162, 158, 0.3)"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />

                <path
                  d={pathD}
                  fill="none"
                  stroke="#ff7700"
                  strokeWidth="2"
                  className="transition-all duration-700 ease-out"
                />

                <text
                  x={centerX}
                  y={height - 15}
                  textAnchor="middle"
                  className="fill-blueprint font-tech text-[8px] tracking-widest uppercase font-bold"
                >
                  NOMINAL VALUE (ZERO ERROR)
                </text>
                <text
                  x={centerX - cert.bellWidth - 5}
                  y="15"
                  textAnchor="end"
                  className="fill-blueprint-dim font-tech text-[7px] tracking-wider"
                >
                  -σ BOUND
                </text>
                <text
                  x={centerX + cert.bellWidth + 5}
                  y="15"
                  textAnchor="start"
                  className="fill-blueprint-dim font-tech text-[7px] tracking-wider"
                >
                  +σ BOUND
                </text>
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.04]">
              <div className="flex flex-col border-r border-white/[0.04] pr-4">
                <span className="font-tech text-[9px] text-blueprint-dim tracking-wider uppercase">TOLERANCE SPEC</span>
                <span className="font-tech text-xs text-white tracking-widest font-medium uppercase mt-1">
                  {cert.toleranceLimit}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-tech text-[9px] text-blueprint-dim tracking-wider uppercase">METRIC DEVIATION RATE</span>
                <span className="font-tech text-xs text-blueprint tracking-widest font-medium uppercase mt-1">
                  {cert.ppmRate}
                </span>
              </div>
              <div className="flex flex-col border-r border-white/[0.04] pr-4 mt-2">
                <span className="font-tech text-[9px] text-blueprint-dim tracking-wider uppercase">INSPECTION FREQUENCY</span>
                <span className="font-tech text-xs text-white tracking-widest font-medium uppercase mt-1">
                  100% STAGED CALIBRATION
                </span>
              </div>
              <div className="flex flex-col mt-2">
                <span className="font-tech text-[9px] text-blueprint-dim tracking-wider uppercase">CALIBRATION STANDARD</span>
                <span className="font-tech text-xs text-white tracking-widest font-medium uppercase mt-1">
                  DEV MPEE = 1.5 + L/333 µm
                </span>
              </div>
            </div>

            <div className="bg-[#0D0F12] border border-white/[0.04] p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-verified animate-ping" />
                <span className="font-tech text-[9px] text-verified tracking-widest uppercase font-bold">
                  QUALITY THRESHOLD VERIFIED
                </span>
              </div>
              <span className="font-tech text-[9px] text-blueprint-dim tracking-widest uppercase">
                REV. AS-91-V3
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HowWeBuildPage() {
  const [openStep, setOpenStep] = useState<string | null>("01");

  return (
    <div className="bg-[#050505] pt-24">
      {/* ── Page hero ── */}
      <section className="relative overflow-hidden bp-grid py-12 lg:py-20 border-b border-white/[0.04]">
        {/* Radial mask to fade the blueprint grid towards the edges */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(5,5,5,0.2)_10%,#050505_80%)] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-transparent to-[#050505] pointer-events-none" />
        
        <div className="relative max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[65vh]">
            {/* Left Column: Massive Stark Typography and Data Dashboard */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <p className="font-tech text-blueprint text-[10px] tracking-[0.25em] uppercase mb-4">
                HOW WE BUILD // QUALITY PROCESS
              </p>
              <h1 className="font-sans font-bold text-white text-4xl sm:text-5xl lg:text-[72px] leading-[0.95] tracking-[-0.04em] uppercase mb-6 text-balance">
                PROVEN<br />SEQUENCE.<br />VERIFIED<br />CONFORMANCE.
              </h1>
              <p className="font-tech text-xs tracking-wider text-blueprint-dim leading-relaxed uppercase border-l-2 border-blueprint/30 pl-4 py-1 mb-8 max-w-xl">
                "SVAPL SUBSYSTEM MANUFACTURING OPERATES UNDER A RIGID NINE-STAGE TRACEABILITY PROTOCOL TARGETING SUB-MICRON DEFECT BOUNDS."
              </p>

              <div className="grid grid-cols-3 gap-6 border-t border-b border-white/[0.05] py-5 w-full max-w-xl font-tech text-[10px] tracking-widest text-blueprint-dim">
                <div>
                  <span className="block text-white/70 mb-1">VERIFICATION</span>
                  <span className="text-white font-bold block text-xs">100% HOLD POINTS</span>
                </div>
                <div className="border-l border-white/[0.05] pl-6">
                  <span className="block text-white/70 mb-1">STANDARD</span>
                  <span className="text-blueprint font-bold block text-xs">AS9100D LEVEL III</span>
                </div>
                <div className="border-l border-white/[0.05] pl-6">
                  <span className="block text-white/70 mb-1">METROLOGY_DEV</span>
                  <span className="text-white font-bold block text-xs">&lt; 0.005MM LIMIT</span>
                </div>
              </div>
            </div>

            {/* Right Column: Metrology CMM Simulator */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[420px] p-2 border border-white/[0.06] bg-[#050505]">
                {/* Custom glowing orange corner ticks */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-blueprint" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-blueprint" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-blueprint" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-blueprint" />
                
                <MetrologySimulator />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Machine Matrix Dashboard ── */}
      <MachineMatrix />

      {/* ── Process steps ── */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px] py-16 lg:py-20">
        <p className="font-tech text-blueprint text-[11px] tracking-[0.2em] uppercase mb-10">MANUFACTURING SEQUENCE</p>
        <div className="flex flex-col gap-px bg-white/10">
          {PROCESS_STEPS.map((s) => (
            <div key={s.step} className="bg-[#0a0a0a]">
              <button
                className="w-full flex items-center gap-6 p-6 lg:p-7 text-left group hover:bg-[#141414] transition-colors"
                onClick={() => setOpenStep(openStep === s.step ? null : s.step)}
              >
                <span className="font-sans font-bold text-blueprint text-xs tracking-[2px] w-6 shrink-0">{s.step}</span>
                <span className="font-sans font-bold text-[#eaf2fb] text-base lg:text-[17px] flex-1">{s.title}</span>
                <span className={`text-blueprint text-lg transition-transform shrink-0 ${openStep === s.step ? "rotate-45" : ""}`}>+</span>
              </button>
              {openStep === s.step && (
                <div className="px-6 lg:px-7 pb-7 border-t border-white/[0.06] pt-5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 flex flex-col gap-4 text-left">
                    <p className="font-body text-[rgba(234,242,251,0.85)] text-sm lg:text-base leading-relaxed">
                      {s.desc}
                    </p>
                    <div className="flex items-start gap-2 border-t border-white/[0.04] pt-3">
                      <span className="text-blueprint text-xs mt-[3px] shrink-0">—</span>
                      <p className="font-body text-[rgba(234,242,251,0.75)] text-xs leading-relaxed uppercase tracking-wider">
                        {s.detail}
                      </p>
                    </div>
                  </div>
                  <div className="lg:col-span-4 relative aspect-[16/10] w-full max-w-[320px] bg-[#0D0F12] border border-white/[0.05] overflow-hidden justify-self-center lg:justify-self-end">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 border-t border-l border-blueprint/30" />
                    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 border-t border-r border-blueprint/30" />
                    <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 border-b border-l border-blueprint/30" />
                    <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 border-b border-r border-blueprint/30" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Inspection & NDT ── */}
      <section className="py-16 lg:py-20 border-t border-rule">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <p className="font-tech text-blueprint text-[11px] tracking-[0.2em] uppercase mb-4">INSPECTION FACILITIES</p>
              <h2 className="font-sans font-bold text-[#eaf2fb] text-2xl lg:text-[34px] leading-tight tracking-[-0.6px] mb-8">
                Full dimensional verification on every shipment.
              </h2>
              <div className="flex flex-col gap-px bg-white/10">
                {INSPECTION.map((item) => (
                  <div key={item.name} className="bg-[#0a0a0a] p-4 flex items-start justify-between gap-4">
                    <span className="font-sans font-bold text-[#eaf2fb] text-sm">{item.name}</span>
                    <span className="font-body text-[rgba(234,242,251,0.75)] text-xs text-right shrink-0">{item.spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Special facilities */}
            <div>
              <p className="font-tech text-blueprint text-[11px] tracking-[0.2em] uppercase mb-4">SPECIAL FACILITIES</p>
              <h2 className="font-sans font-bold text-[#eaf2fb] text-2xl lg:text-[34px] leading-tight tracking-[-0.6px] mb-8">
                Capabilities that few private shops offer.
              </h2>
              <div className="flex flex-col gap-5">
                {[
                  {
                    title: "ISO Class 8 Clean Room — TIG Welding",
                    spec: "4,000 sq.ft, humidity-controlled",
                    desc: "Dedicated auto-TIG station for aluminium alloys, maraging steels and Inconel. Humidity logging for all weld records.",
                  },
                  {
                    title: "Assembly Clean Room",
                    spec: "5,000 sq.ft with handling gantries",
                    desc: "Propulsion subsystem integration, actuator assembly, harness routing — all in controlled particle-count environment.",
                  },
                  {
                    title: "Hydro & Pneumatic Test Rigs",
                    spec: "Hydro 700 ATA · Pneumatic 150 ATA",
                    desc: "In-house proof pressure testing for motor cases, nozzles, propellant tanks and canisters, with strain gauge monitoring.",
                  },
                  {
                    title: "Strain Gauge Instrumentation",
                    spec: "Multi-channel data acquisition",
                    desc: "Available for structural load tests and pressure-cycle monitoring on complex assemblies.",
                  },
                  {
                    title: "X-Ray Radiography",
                    spec: "350 kVA machine",
                    desc: "Weld joint inspection for motor cases, pressure vessels and critical structural joints — in-house, no outsourcing delay.",
                  },
                ].map((f) => (
                  <div key={f.title} className="border border-rule rounded-[6px] p-5">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <p className="font-sans font-bold text-[#eaf2fb] text-sm">{f.title}</p>
                      <span className="font-body text-blueprint text-[10px] tracking-[1px] whitespace-nowrap shrink-0">{f.spec}</span>
                    </div>
                    <p className="font-body text-[rgba(234,242,251,0.75)] text-xs leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Zero Error Margin Quality & Conformance Trust Section ── */}
      <QualityTrustSection />

      {/* ── Manpower ── */}
      <section className="py-16 lg:py-20 border-t border-rule">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px]">
          <p className="font-tech text-blueprint text-[11px] tracking-[0.2em] uppercase mb-10">MANPOWER</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10">
            {[
              { count: "35", label: "Graduate Engineers" },
              { count: "80", label: "Skilled Workers" },
              { count: "29", label: "Quality Personnel" },
              { count: "17", label: "Admin & Support" },
            ].map((m) => (
              <div key={m.label} className="bg-[#0a0a0a] p-8">
                <p className="font-sans font-bold text-[#eaf2fb] text-4xl lg:text-5xl mb-2">{m.count}</p>
                <p className="font-body text-blueprint-dim text-xs tracking-wide uppercase">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-panel border-t border-rule py-16 lg:py-20">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="font-sans font-bold text-[#eaf2fb] text-2xl lg:text-[32px] tracking-[-0.5px] mb-3">
              Ready to qualify SVAPL as a supplier?
            </h3>
            <p className="font-body text-[rgba(234,242,251,0.82)] text-base leading-relaxed">
              We welcome customer audits. Send us your supplier qualification questionnaire and our quality team will respond within 5 working days.
            </p>
          </div>
          <button className="shrink-0 bg-white text-black font-sans font-bold text-sm px-8 py-4 rounded-[4px] hover:bg-safety hover:text-white transition-colors">
            Request Strategic Briefing
          </button>
        </div>
      </section>
    </div>
  );
}
