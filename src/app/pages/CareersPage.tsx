import { useState } from "react";
import { IMAGES } from "@/config/images";

const POSITIONS = [
  {
    dept: "Engineering",
    title: "CNC Programmer — 5-Axis Milling",
    type: "Full-time",
    exp: "5–10 years",
    location: "Hyderabad",
    desc: "Write, verify and optimise CNC programs for 5-axis machining centres. Experience with Siemens 840D or Fanuc FOCAS. Aerospace material background preferred.",
    skills: ["CATIA V5 / NX CAM", "Titanium & Inconel machining", "GD&T proficiency", "AS9100 process awareness"],
  },
  {
    dept: "Engineering",
    title: "Senior Structural Engineer — Aerostructures",
    type: "Full-time",
    exp: "7–12 years",
    location: "Hyderabad",
    desc: "Lead structural design and analysis of aluminium alloy airframe assemblies. ISRO or DRDO programme experience essential.",
    skills: ["FEA / NASTRAN", "Riveted joint design", "Drawing interpretation (DRDO/ISRO formats)", "ECAD tooling design"],
  },
  {
    dept: "Production",
    title: "TIG Welder — Aerospace Certified",
    type: "Full-time",
    exp: "4–8 years",
    location: "Hyderabad",
    desc: "Precision TIG welding of 15CDV6, AA2219, Maraging Steel and Inconel 718 in ISO 8 clean room. NADCAP-style process discipline mandatory.",
    skills: ["15CDV6 & Ti Grade V welding", "Clean room protocols", "RT/UT interpretation", "Procedure qualification"],
  },
  {
    dept: "Quality",
    title: "NDT Inspector — Level II",
    type: "Full-time",
    exp: "4–7 years",
    location: "Hyderabad",
    desc: "Radiography, ultrasonic and dye-penetrant inspection of motor casings and structural assemblies. ASNT Level II mandatory.",
    skills: ["RT / UT / DP", "ASNT Level II certification", "CMM operation", "Non-conformance reporting"],
  },
  {
    dept: "Quality",
    title: "Quality Assurance Engineer",
    type: "Full-time",
    exp: "3–6 years",
    location: "Hyderabad",
    desc: "Maintain AS9100D documentation, coordinate customer audits, manage FAIR packages and first-article inspection reports.",
    skills: ["AS9100D / ISO 9001", "PPAP / FAIR documentation", "SPC / control charting", "Customer liaison"],
  },
  {
    dept: "Production",
    title: "Assembly Technician — Riveted Structures",
    type: "Full-time",
    exp: "3–6 years",
    location: "Hyderabad",
    desc: "Assembly of complex riveted aerostructures including hi-lok, jo-bolt and shear bolt fastening. Experience with jig-based assembly preferred.",
    skills: ["Riveting & fastening", "Fixture-based assembly", "Torque control", "Laser measurement familiarity"],
  },
];

const DEPTS = ["All", "Engineering", "Production", "Quality"];

const VALUES = [
  { label: "Zero defect delivery", desc: "Every part ships with a full quality dossier. We do not compromise on certification." },
  { label: "Mission-critical culture", desc: "Our output protects lives and enables India's strategic programmes. We act accordingly." },
  { label: "Technical depth", desc: "We invest in skill — from NADCAP-certified welders to CMM operators who read blue prints like prose." },
  { label: "Long-cycle thinking", desc: "SVAPL has built the same programmes for 25 years. We hire people who want to master a craft, not just fill a role." },
];

export default function CareersPage() {
  const [dept, setDept] = useState("All");
  const [open, setOpen] = useState<string | null>(null);
  const visible = dept === "All" ? POSITIONS : POSITIONS.filter((p) => p.dept === dept);

  return (
    <div className="bg-[#0a0a0a] pt-24">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <img
          src={IMAGES.careers.hero}
          alt="Engineering team"
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/50 to-[#0a0a0a]" />
        <div className="relative max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-[44px] py-20 lg:py-28">
          <p className="font-tech text-blueprint text-[11px] tracking-[0.2em] uppercase mb-5">CAREERS</p>
          <h1 className="font-sans font-bold text-[#eaf2fb] text-4xl sm:text-5xl lg:text-[58px] leading-[1.05] tracking-[-2px] max-w-3xl mb-6">
            Build the hardware that builds India's future.
          </h1>
          <p className="font-body text-[rgba(234,242,251,0.82)] text-base lg:text-lg max-w-xl leading-relaxed">
            Join a team that has been at the heart of India's ISRO and DRDO programmes for 25 years.
            We are expanding for the next generation of defence and space work — and we hire for depth.
          </p>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-panel border-t border-rule py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-[44px]">
          <p className="font-tech text-blueprint text-[11px] tracking-[0.2em] uppercase mb-10">HOW WE WORK</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((v) => (
              <div key={v.label}>
                <div className="w-8 h-px bg-blueprint mb-4" />
                <h3 className="font-sans font-bold text-[#eaf2fb] text-[16px] mb-2">{v.label}</h3>
                <p className="font-body text-[rgba(234,242,251,0.82)] text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open positions ── */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-[44px] py-16 lg:py-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <p className="font-tech text-blueprint text-[11px] tracking-[0.2em] uppercase mb-2">OPEN POSITIONS</p>
            <h2 className="font-sans font-bold text-[#eaf2fb] text-3xl lg:text-[38px] leading-tight tracking-[-0.8px]">
              We&apos;re hiring.
            </h2>
          </div>
          {/* Dept filter */}
          <div className="flex gap-2">
            {DEPTS.map((d) => (
              <button
                key={d}
                onClick={() => setDept(d)}
                className={`font-sans font-bold text-xs px-4 py-2 rounded-[4px] transition-all ${
                  dept === d ? "bg-blueprint text-black" : "border border-rule text-blueprint-dim hover:text-white"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-px bg-white/10">
          {visible.map((pos) => (
            <div key={pos.title} className="bg-[#0a0a0a]">
              {/* Row header */}
              <button
                className="w-full text-left p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center gap-4 group hover:bg-[#141414] transition-colors"
                aria-expanded={open === pos.title}
                aria-controls={`career-${pos.title}`}
                onClick={() => setOpen(open === pos.title ? null : pos.title)}
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <span className="font-sans text-blueprint-dim text-[10px] tracking-[1.5px] uppercase border border-rule px-2 py-[2px] rounded-[3px]">
                      {pos.dept}
                    </span>
                    <span className="font-body text-[rgba(234,242,251,0.72)] text-xs">{pos.exp} exp.</span>
                    <span className="font-body text-[rgba(234,242,251,0.72)] text-xs">{pos.location}</span>
                  </div>
                  <h3 className="font-sans font-bold text-[#eaf2fb] text-lg">{pos.title}</h3>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-body text-blueprint-dim text-xs border border-rule px-3 py-1 rounded-full">{pos.type}</span>
                  <span className={`text-blueprint text-lg transition-transform ${open === pos.title ? "rotate-45" : ""}`}>+</span>
                </div>
              </button>

              {/* Expanded */}
              {open === pos.title && (
                <div className="px-6 lg:px-8 pb-8 border-t border-white/[0.06]">
                  <div className="pt-6 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
                    <div>
                      <p className="font-body text-[rgba(234,242,251,0.85)] text-sm leading-relaxed mb-6">{pos.desc}</p>
                      <p className="font-sans text-blueprint-dim text-[10px] tracking-[1.5px] uppercase mb-3">KEY SKILLS</p>
                      <div className="flex flex-wrap gap-2">
                        {pos.skills.map((s) => (
                          <span key={s} className="bg-white/[0.04] border border-rule text-[rgba(234,242,251,0.88)] font-body text-xs px-3 py-1 rounded-[3px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <a
                      href={`mailto:contracts@svapl.in?subject=Application%3A%20${encodeURIComponent(pos.title)}`}
                      className="shrink-0 bg-white text-black font-sans font-bold text-sm px-6 py-3 rounded-[4px] hover:bg-safety transition-colors text-center"
                    >
                      Apply via email
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="py-16 text-center border border-rule rounded-[4px]">
            <p className="font-sans text-blueprint-dim text-sm">No open positions in this department currently.</p>
          </div>
        )}
      </section>

      {/* ── General application CTA ── */}
      <section className="bg-panel border-t border-rule py-16">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-[44px] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <h3 className="font-sans font-bold text-[#eaf2fb] text-2xl lg:text-[30px] tracking-[-0.5px] mb-2">
              Don&apos;t see the right role?
            </h3>
            <p className="font-body text-[rgba(234,242,251,0.82)] text-base max-w-md">
              Send us your CV with a note on your specialisation. We review all applications — especially from
              aerospace welders, precision machinists and NDT inspectors.
            </p>
          </div>
          <a
            href="mailto:contracts@svapl.in?subject=General Application — SVAPL"
            className="shrink-0 border border-white/30 text-[#eaf2fb] font-body font-semibold text-sm px-8 py-4 rounded-[4px] hover:bg-white/5 transition-colors"
          >
            Send general application
          </a>
        </div>
      </section>
    </div>
  );
}
