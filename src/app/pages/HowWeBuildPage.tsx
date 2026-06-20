import { useState } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

/* ─── Content from SVAPL PPT + brochure ─── */

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Raw Material Receipt & Verification",
    desc: "Incoming raw materials — aluminium alloys, 15CDV6, maraging steel, titanium billet and forgings — are received, tagged and tested for mechanical and chemical compliance against customer-approved material certificates. Traceability is established from first log entry through to final dispatch.",
    detail: "Destructive and non-destructive sample testing, heat number traceability, storage zoning by material class.",
  },
  {
    step: "02",
    title: "Manufacturing Process & QA Plan",
    desc: "For every new component, SVAPL generates a Manufacturing Process Sheet and Quality Assurance Plan with defined inspection hold points. These documents are reviewed and signed off by the customer before shop-floor release.",
    detail: "Customer DDP review, process FMEA, first-article inspection plan, tooling design approval.",
  },
  {
    step: "03",
    title: "Tooling & Fixturing",
    desc: "Critical tooling, jigs and fixtures are designed and manufactured in-house using CATIA V5. All tooling is dimensionally verified by CMM before first-piece production. We maintain a tooling library for repeat programmes, reducing qualification cycles.",
    detail: "In-house tooling design, CMM-verified fixtures, dedicated tooling stores.",
  },
  {
    step: "04",
    title: "Fabrication",
    desc: "Sheet metal forming, plate bending (up to 40 mm), ring rolling and large-format fabrication operations produce primary structural skins, frames and stiffeners. Weld assemblies are performed in our ISO 8 clean room with full humidity control for the most sensitive alloys.",
    detail: "Plate bending up to 40 mm, ring rolling up to Ø 5,000 mm, clean-room TIG welding, hydro/pneumatic proof.",
  },
  {
    step: "05",
    title: "CNC Machining",
    desc: "Components move to our machine shop: 11 CNC milling centres (5-axis, 4-axis, 3-axis), 4 plano mills, 4 CNC vertical turning lathes (up to Ø 5,400 mm) and 4 horizontal borers. Inter-operation inspection is performed at defined stages using CMM and 3D measuring arm.",
    detail: "In-process CMM checks, toolpath verification, fixture re-qualification after every tool change on tight-tolerance features.",
  },
  {
    step: "06",
    title: "Assembly & Integration",
    desc: "Structural assembly — riveting, jo-bolt and shear-bolt fastening — is performed in jig, with assembly sequence verified by approved traveller. Functional integration (hydraulic lines, thrusters, harness routing) is carried out in our 5,000 sq.ft clean room with customer hold-point sign-offs.",
    detail: "Jig-based assembly, approved sequence traveller, customer surveillance at IPIs.",
  },
  {
    step: "07",
    title: "NDT & Dimensional Inspection",
    desc: "Every weld joint undergoes radiographic or ultrasonic testing. Structural assemblies are inspected by CMM (600 × 600 × 500 mm), 3D arm (A6-2500, reach 2.5 m) or laser tracker. Dimensional reports are issued before release.",
    detail: "RT (X-ray 350 kVA), UT, DP, TT; CMM report, laser-tracker dimensional certificate.",
  },
  {
    step: "08",
    title: "Pressure Testing",
    desc: "Pressure-carrying structures — motor cases, nozzles, propellant tanks, canisters — are proof-tested on our dedicated hydro and pneumatic rigs: hydro up to 700 ATA, pneumatic up to 150 ATA. Strain gauge monitoring is available for critical tests.",
    detail: "Hydro rig: 700 ATA. Pneumatic rig: 150 ATA. Strain gauge equipment, cycle fatigue testing.",
  },
  {
    step: "09",
    title: "Non-Conformance Review & Disposition",
    desc: "Any non-conformance identified during inspection is documented, raised with the customer for disposition (use-as-is, rework, scrap) and resolved before the part progresses. A root-cause corrective action is raised for systemic issues.",
    detail: "Customer NCR format, RCCA log, Pareto trend review in monthly QRB.",
  },
  {
    step: "10",
    title: "Packing, Quality Docs & Dispatch",
    desc: "Finished assemblies are preserved and packed per customer specification, accompanied by a full quality dossier: material certs, inspection records, NDT films/reports, pressure test certs, dimensional reports and any customer-specific data packages.",
    detail: "Full traceability pack, preservation per customer spec, export-compliant packaging for ITAR/EAR-controlled items.",
  },
];

const EQUIPMENT = [
  { qty: "11", desc: "CNC Milling (5-axis, 4-axis, 3-axis)" },
  { qty: "4", desc: "CNC Plano Milling — 4,500 × 2,300 × 1,850 mm" },
  { qty: "4", desc: "CNC VTL — Ø 1,200 to Ø 5,400 mm" },
  { qty: "4", desc: "CNC Horizontal Boring (4-axis) — Ø 120 / 130 mm" },
  { qty: "5", desc: "CNC Lathes" },
  { qty: "2", desc: "CNC Jig Boring" },
  { qty: "1", desc: "CNC SPM Contour Milling — up to Ø 2,600 mm" },
  { qty: "1", desc: "Central Lathe — Ø 3,400 × 8,000 mm" },
  { qty: "2", desc: "Conventional Lathes — Ø 1,200 × 7,200 mm" },
  { qty: "6", desc: "TIG / MIG Welding Machines" },
  { qty: "1", desc: "CNC Auto-TIG (humidity control clean room)" },
  { qty: "4", desc: "Heat Treatment Furnaces — 1,700 × 1,700 × 2,000 mm" },
  { qty: "9", desc: "Cranes — up to 20 T" },
  { qty: "3", desc: "Captive Power DG Sets — up to 160 kVA" },
];

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

const CERTS = [
  {
    code: "AS 9100D : 2016",
    name: "Aerospace Quality Management System",
    desc: "The global gold standard for aerospace manufacturing. Covers design, development and production of all flight hardware.",
  },
  {
    code: "ISO 9001 : 2015",
    name: "Quality Management System",
    desc: "Foundation QMS covering document control, traceability, non-conformance management and continual improvement.",
  },
  {
    code: "ISO 14001 : 2015",
    name: "Environmental Management System",
    desc: "Ensures all processes — chemical milling, plating, surface treatment — meet environmental compliance requirements.",
  },
  {
    code: "ISO 45001 : 2018",
    name: "Occupational Health & Safety",
    desc: "Mandatory for safe operation of high-energy test rigs, cranes, hot-work areas and chemical processing.",
  },
];

export default function HowWeBuildPage() {
  const [openStep, setOpenStep] = useState<string | null>("01");

  return (
    <div className="bg-[#0a0a0a] pt-24">
      {/* ── Page hero ── */}
      <section className="relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1716643863806-989dd76ae093?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600"
          alt="SVAPL manufacturing floor"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 to-[#0a0a0a]" />
        <div className="relative max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px] py-20 lg:py-28">
          <p className="font-tech text-blueprint text-[11px] tracking-[0.2em] uppercase mb-5">HOW WE BUILD</p>
          <h1 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-4xl sm:text-5xl lg:text-[58px] leading-[1.05] tracking-[-2px] max-w-3xl mb-6">
            Proven processes. Certified at every stage.
          </h1>
          <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.6)] text-base lg:text-lg max-w-xl leading-relaxed">
            Every part that leaves SVAPL follows a fully documented, customer-approved manufacturing sequence — from raw material receipt through dimensional certification and pressure proof.
          </p>
        </div>
      </section>

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
                <span className="font-['Space_Grotesk',sans-serif] font-bold text-blueprint text-xs tracking-[2px] w-6 shrink-0">{s.step}</span>
                <span className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-base lg:text-[17px] flex-1">{s.title}</span>
                <span className={`text-blueprint text-lg transition-transform shrink-0 ${openStep === s.step ? "rotate-45" : ""}`}>+</span>
              </button>
              {openStep === s.step && (
                <div className="px-6 lg:px-7 pb-7 border-t border-white/[0.06] pt-5 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">
                  <div>
                    <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.68)] text-sm lg:text-base leading-relaxed mb-4">{s.desc}</p>
                    <div className="flex items-start gap-2">
                      <span className="text-blueprint text-xs mt-[3px] shrink-0">—</span>
                      <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.45)] text-xs leading-relaxed">{s.detail}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Equipment list ── */}
      <section className="bg-panel border-t border-rule py-16 lg:py-20">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px]">
          <p className="font-tech text-blueprint text-[11px] tracking-[0.2em] uppercase mb-4">EQUIPMENT</p>
          <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-3xl lg:text-[40px] leading-tight tracking-[-0.8px] mb-10">
            50+ machines across three plants.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {EQUIPMENT.map((eq) => (
              <div key={eq.desc} className="bg-panel p-6 flex gap-5 items-start">
                <span className="font-['Space_Grotesk',sans-serif] font-bold text-blueprint text-2xl lg:text-3xl leading-none shrink-0 w-8">{eq.qty}</span>
                <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.65)] text-sm leading-relaxed">{eq.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Inspection & NDT ── */}
      <section className="py-16 lg:py-20 border-t border-rule">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <p className="font-tech text-blueprint text-[11px] tracking-[0.2em] uppercase mb-4">INSPECTION FACILITIES</p>
              <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-2xl lg:text-[34px] leading-tight tracking-[-0.6px] mb-8">
                Full dimensional verification on every shipment.
              </h2>
              <div className="flex flex-col gap-px bg-white/10">
                {INSPECTION.map((item) => (
                  <div key={item.name} className="bg-[#0a0a0a] p-4 flex items-start justify-between gap-4">
                    <span className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-sm">{item.name}</span>
                    <span className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.45)] text-xs text-right shrink-0">{item.spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Special facilities */}
            <div>
              <p className="font-tech text-blueprint text-[11px] tracking-[0.2em] uppercase mb-4">SPECIAL FACILITIES</p>
              <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-2xl lg:text-[34px] leading-tight tracking-[-0.6px] mb-8">
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
                      <p className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-sm">{f.title}</p>
                      <span className="font-['Archivo',sans-serif] text-blueprint text-[10px] tracking-[1px] whitespace-nowrap shrink-0">{f.spec}</span>
                    </div>
                    <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.5)] text-xs leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Certifications ── */}
      <section className="bg-panel border-t border-rule py-16 lg:py-20">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px]">
          <p className="font-tech text-blueprint text-[11px] tracking-[0.2em] uppercase mb-4">QUALITY SYSTEM</p>
          <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-3xl lg:text-[40px] leading-tight tracking-[-0.8px] mb-10">
            Four certifications. One culture of zero defects.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CERTS.map((c) => (
              <div key={c.code} className="bg-white/[0.025] border border-rule rounded-[2px] p-6">
                <div className="inline-block bg-blueprint text-black font-['Space_Grotesk',sans-serif] font-bold text-xs px-2 py-[3px] rounded-[3px] mb-4 tracking-wide">
                  {c.code}
                </div>
                <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-base mb-2">{c.name}</h3>
                <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.55)] text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Audit cycle callout */}
          <div className="mt-8 border border-rule rounded-[6px] p-6 lg:p-8">
            <p className="font-['Space_Grotesk',sans-serif] text-[#a6a6a6] text-[10px] tracking-[1.5px] uppercase mb-3">AUDIT PROGRAMME</p>
            <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.65)] text-sm lg:text-base leading-relaxed max-w-3xl">
              Annual internal audits and scheduled customer surveillance audits cover: incoming material storage, document & data control, material traceability, metrology & calibration, tooling control, in-process inspection, vendor & subcontractor management, non-conformance control, handling & preservation. All findings are tracked in a corrective action log reviewed at monthly QRBs.
            </p>
          </div>
        </div>
      </section>

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
                <p className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-4xl lg:text-5xl mb-2">{m.count}</p>
                <p className="font-['Archivo',sans-serif] text-[#a6a6a6] text-xs tracking-wide uppercase">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-panel border-t border-rule py-16 lg:py-20">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-2xl lg:text-[32px] tracking-[-0.5px] mb-3">
              Ready to qualify SVAPL as a supplier?
            </h3>
            <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.6)] text-base leading-relaxed">
              We welcome customer audits. Send us your supplier qualification questionnaire and our quality team will respond within 5 working days.
            </p>
          </div>
          <button className="shrink-0 bg-white text-black font-['Space_Grotesk',sans-serif] font-bold text-sm px-8 py-4 rounded-[4px] hover:bg-safety hover:text-white transition-colors">
            Request Strategic Briefing
          </button>
        </div>
      </section>
    </div>
  );
}
