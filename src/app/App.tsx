import { useState, useEffect, useRef, lazy, Suspense, Component, type ReactNode, type ErrorInfo } from "react";
import { Menu, X } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { CrewModuleCanvas } from "@/app/components/CrewModuleCanvas";
import { motion, useScroll, useTransform, useMotionValue, useAnimationFrame } from "motion/react";
import { PreLoader } from "@/app/components/PreLoader";
import { IMAGES } from "@/config/images";
import { useSanity } from "@/lib/useSanity";
import { INSIGHTS_QUERY, CAPABILITY_SLIDES_QUERY, SITE_SETTINGS_QUERY } from "@/lib/queries";
import type { SanityInsight, SanityCapabilitySlide, SanitySiteSettings } from "@/lib/types";

import imgHeader from "@/imports/Desktop1/44363911e71cf9a03eb8eca1d986961f050713d9.png";
import imgLogo from "@/imports/Desktop1/1d148265799be8543f36d6a99d6999ef7e88dcf8.png";
import imgIsro from "@/imports/Desktop1/ab0fb5e0fd25a2388bd783599cc37263eab3e662.png";
import imgHal from "@/imports/Desktop1/b2548de20dc69efb7e8482c34eb45b5441ed2f79.png";
import imgBdl from "@/imports/Desktop1/4320f9e555817370397741e8b575df75a5708b7e.png";
import imgIsro9 from "@/imports/Desktop1/f9af3cf26d1cbc52bed8beed5492b00f5fa75182.png";
import imgGradient from "@/imports/Desktop1/9afe6b08154c56e0015b47657502065fde197518.png";
import imgHowWeBuild from "@/imports/Desktop1/aa1fb16ca114e1d2a4029b5fb4578aa416c99ce0.png";
import svgPaths from "@/imports/Desktop1/svg-mzctct3m79";

import adaniLogo from "@/imports/Desktop1/adani-logo.svg";
import belLogo from "@/imports/Desktop1/bharat-electronics-logo.svg";
import lntLogo from "@/imports/Desktop1/lnt-logo.svg";

import AboutPage from "@/app/pages/AboutPage";
import ProgrammesPage from "@/app/pages/ProgrammesPage";
import ContactPage from "@/app/pages/ContactPage";
import NewsroomPage from "@/app/pages/NewsroomPage";
import CareersPage from "@/app/pages/CareersPage";
import WhatWeBuildPage from "@/app/pages/WhatWeBuildPage";
import HowWeBuildPage from "@/app/pages/HowWeBuildPage";
import { VerificationProofStrip } from "@/app/components/VerificationProofStrip";
import { ProductsPage } from "@/app/pages/ProductsPage";
import { FactoryVideoPanel } from "@/app/components/FactoryVideoPanel";

// Lazy-load the Three.js viewer so it never blocks the initial paint
const ProductShowcase3D = lazy(() =>
  import("@/app/components/ProductShowcase3D").then(m => ({ default: m.ProductShowcase3D }))
);
// import { CompletedProjectsGrid } from "@/app/components/CompletedProjectsGrid";

type Page = "home" | "about" | "what-we-build" | "how-we-build" | "programmes" | "newsroom" | "contact" | "careers" | "products";

// Nav items: [label, page | null for scroll-to-section, sectionId?]
type NavItem = { label: string; page?: Page; section?: string };
const NAV_ITEMS: NavItem[] = [
  { label: "CAPABILITIES", page: "what-we-build" as Page },
  { label: "INFRASTRUCTURE", page: "how-we-build" as Page },
  { label: "ABOUT", page: "about" as Page },
  { label: "CONNECT", page: "contact" as Page },
];

const FALLBACK_CAPABILITIES_TICKER = [
  "AEROSTRUCTURES",
  "PRECISION MACHINING",
  "SPECIAL-PROCESS WELDING",
  "SYSTEM ASSEMBLY",
  "NDT & TESTING",
  "SURFACE TREATMENT",
  "DEFENCE PROGRAMMES",
];

const CATEGORY_DATA = [
  {
    label: "Aerostructures",
    image: IMAGES.home.capabilityGrid.aerostructures,
    desc: "Fuselage panels, wing ribs, bulkheads and fully integrated structural assemblies — built to print and delivered flight-ready.",
  },
  {
    label: "Precision Components",
    image: IMAGES.home.capabilityGrid.precisionComponents,
    desc: "Complex geometries in titanium, aluminium and exotic alloys, held to ±5µm across the full envelope — ideal for flight-critical hardware.",
  },
  {
    label: "Welded Structures",
    image: IMAGES.home.capabilityGrid.weldedStructures,
    desc: "TIG and electron-beam welding by certified operators, NADCAP accredited for special processes on titanium and high-strength alloys.",
  },
  {
    label: "Integrated Assemblies",
    image: IMAGES.home.capabilityGrid.integratedAssemblies,
    desc: "Full mechanical integration with wiring harness routing, hydraulic lines, and functional test before shipment — system-ready, not just fabricated.",
  },
  {
    label: "Defence Systems",
    image: IMAGES.home.capabilityGrid.defenceSystems,
    desc: "Structural and mechanical subsystems for ground, naval and airborne defence programmes, qualified to DRDO and MoD standards.",
  },
];

const FALLBACK_INSIGHTS: SanityInsight[] = [
  { _id: "i1", date: "JUN 2026", title: "The economics of vertical integration in aerostructures", desc: "Why owning the full process chain de-risks delivery for tier-1 programmes." },
  { _id: "i2", date: "MAY 2026", title: "Inside our Class-10K assembly & integration halls",        desc: "A look at the controlled environments where flight hardware comes together." },
  { _id: "i3", date: "APR 2026", title: "How we hold ±5µm across a 1.2m envelope",                 desc: "Thermal control, fixturing and metrology behind repeatable precision." },
  { _id: "i4", date: "MAR 2026", title: "NADCAP welding: what first-article really proves",         desc: "The accreditation discipline that keeps special processes flight-safe." },
];

// HAL logo rendered from SVG path data
function HalLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 176.966 114.278"
    >
      <path d={svgPaths.p2d383800} fill="white" />
      <path d={svgPaths.p2bbf3a00} fill="#2C3F7E" />
      <path d={svgPaths.p24003180} fill="white" />
      <path clipRule="evenodd" d={svgPaths.p36abf280} fill="#2C3F7E" fillRule="evenodd" />
    </svg>
  );
}



// ─── Nav ──────────────────────────────────────────────────────────────────────

function NavBar({ onNavigate, currentPage }: { onNavigate: (page: Page, section?: string) => void; currentPage: Page }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (targetPage: Page) => {
    setOpen(false);
    onNavigate(targetPage);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#050505]/90 backdrop-blur-md border-b border-white/[0.04]" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 sm:px-10 lg:px-20 h-20 max-w-[1440px] mx-auto">
        {/* Logo */}
        <button onClick={() => handleNav("home")} aria-label="SVAPL — go to homepage" className="relative group focus:outline-none">
          <ImageWithFallback
            src={imgLogo}
            alt="SVAPL"
            className="h-14 lg:h-16 w-auto object-contain [filter:brightness(0)_invert(1)] transition-transform duration-500 group-hover:scale-[1.03]"
          />
          {/* Blueprint subtle corner indicators */}
          <div className="absolute -top-1.5 -left-1.5 w-1.5 h-1.5 border-t border-l border-blueprint/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute -bottom-1.5 -right-1.5 w-1.5 h-1.5 border-b border-r border-blueprint/30 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        {/* Minimal Navigation Links separated by thin slashes */}
        <div className="hidden md:flex items-center">
          {NAV_ITEMS.map((item, idx) => {
            const active = currentPage === item.page;
            return (
              <div key={item.label} className="flex items-center">
                {idx > 0 && <span className="text-white/10 font-tech text-xs mx-4 select-none">/</span>}
                <button
                  onClick={() => handleNav(item.page!)}
                  className={`font-tech text-[12px] tracking-[0.22em] font-medium transition-all duration-300 relative py-1 focus:outline-none ${
                    active ? "text-blueprint" : "text-blueprint-dim hover:text-[#FFFFFF]"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-blueprint shadow-[0_0_6px_#ff7700]" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Mobile menu trigger */}
        <button
          className="md:hidden text-blueprint-dim hover:text-white p-1 transition-colors focus:outline-none"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav panel */}
      {open && (
        <div className="md:hidden bg-[#050505] border-b border-white/[0.05] px-6 py-6 flex flex-col gap-4">
          {NAV_ITEMS.map((item) => {
            const active = currentPage === item.page;
            return (
              <button
                key={item.label}
                onClick={() => handleNav(item.page!)}
                className={`text-left font-tech text-[12px] tracking-[0.2em] uppercase transition-colors py-2 focus:outline-none ${
                  active ? "text-blueprint" : "text-blueprint-dim hover:text-white"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────────

function HeroSection() {
  const [stats, setStats] = useState({
    lat: 17.3850,
    lng: 78.4867,
    clock: "10:10:34",
    calib: 0.9998,
  });

  const [hoveredWord, setHoveredWord] = useState<"precision" | "aerospace" | "manufacturing" | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        lat: 17.3850 + (Math.random() - 0.5) * 0.0003,
        lng: 78.4867 + (Math.random() - 0.5) * 0.0003,
        clock: new Date().toLocaleTimeString(),
        calib: 0.9995 + Math.random() * 0.0009,
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const lines = ["PRECISION", "AEROSPACE", "MANUFACTURING."];
  const hoverKeys: ("precision" | "aerospace" | "manufacturing")[] = ["precision", "aerospace", "manufacturing"];

  const HOVER_IMAGES = {
    precision: {
      src: IMAGES.home.hero.precision,
      label: "TITANIUM ROTOR IMPELLER // 5-AXIS MILLING",
      coords: "X: 384.29 // Y: 104.58 // Z: -12.39"
    },
    aerospace: {
      src: IMAGES.home.hero.aerospace,
      label: "ROCKET MOTOR CASE INTEGRATION",
      coords: "ALT: 120KM // ORBITAL DEPLOYMENT"
    },
    manufacturing: {
      src: IMAGES.home.hero.manufacturing,
      label: "CNC HEAVY MULTI-AXIS MILLING STATION",
      coords: "FEED: 1200MM/MIN // SPINDLE: 18K RPM"
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const lineVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  const microVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.9,
        duration: 1.0,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  const turbineVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.5,
        duration: 1.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section className="relative min-h-screen w-full bg-[#050505] bp-grid overflow-hidden flex items-center pt-20">
      {/* Blueprint background lines */}
      <div className="absolute left-6 md:left-10 top-0 bottom-0 w-[1px] bg-blueprint/5 pointer-events-none" />
      <div className="absolute right-6 md:right-10 top-0 bottom-0 w-[1px] bg-blueprint/5 pointer-events-none" />
      <div className="absolute left-0 right-0 top-20 h-[1px] bg-blueprint/5 pointer-events-none" />

      {/* Top left technical corner */}
      <div className="absolute top-24 left-6 md:left-10 w-4 h-4 border-t border-l border-blueprint/30 pointer-events-none" />
      <div className="absolute top-24 left-6 md:left-10 w-1 h-1 -translate-x-1/2 -translate-y-1/2 bg-blueprint/50 rounded-full" />

      {/* Bottom right technical corner */}
      <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 w-4 h-4 border-b border-r border-blueprint/30 pointer-events-none" />
      <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 w-1 h-1 translate-x-1/2 translate-y-1/2 bg-blueprint/50 rounded-full" />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20 py-12 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 items-center">
        {/* Left Column: Massive Header */}
        <div className="col-span-12 md:col-span-7 flex flex-col justify-center">
          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="font-sans text-[36px] sm:text-[52px] md:text-[60px] lg:text-[72px] xl:text-[84px] leading-[0.9] tracking-tighter text-white select-none flex flex-col"
          >
            {lines.map((line, idx) => {
              const hoverKey = hoverKeys[idx];
              return (
                <span
                  key={idx}
                  className="overflow-hidden block py-1 cursor-pointer"
                  onMouseEnter={() => setHoveredWord(hoverKey)}
                  onMouseLeave={() => setHoveredWord(null)}
                >
                  <motion.span
                    variants={lineVariants}
                    className={`block font-light transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      hoveredWord && hoveredWord !== hoverKey
                        ? "text-white/20 scale-[0.98] blur-[1px]"
                        : hoveredWord === hoverKey
                        ? "text-blueprint font-medium drop-shadow-[0_0_12px_rgba(255,119,0,0.25)]"
                        : "text-white"
                    }`}
                  >
                    {line}
                  </motion.span>
                </span>
              );
            })}
          </motion.h1>

          {/* Monospace Sub-text */}
          <motion.div
            variants={microVariants}
            initial="hidden"
            animate="visible"
            className="font-tech text-[11px] lg:text-[12px] tracking-[0.25em] text-blueprint mt-8 flex items-center gap-3 select-none"
          >
            <span className="w-1.5 h-1.5 bg-blueprint rounded-full animate-pulse shadow-[0_0_8px_#ff7700]" />
            <span>PRECISION FROM EARTH TO ORBIT</span>
          </motion.div>
        </div>

        {/* Right Column: 3D Turbine Canvas & Real-world Photo overlay stack */}
        <div className="col-span-12 md:col-span-5 flex items-center justify-center">
          <motion.div
            variants={turbineVariants}
            initial="hidden"
            animate="visible"
            className="relative w-full aspect-square max-w-[450px] border border-white/[0.06] bg-[#0d0f12]/40 p-2 overflow-hidden"
          >
            {/* Blueprint corner tags */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-blueprint/30 pointer-events-none" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-blueprint/30 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-blueprint/30 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-blueprint/30 pointer-events-none" />

            {/* Rotating 3D wireframe */}
            <div
              className={`w-full h-full transition-all duration-700 ease-in-out ${
                hoveredWord ? "opacity-0 scale-95 blur-sm pointer-events-none" : "opacity-100 scale-100"
              }`}
            >
              <CrewModuleCanvas />
            </div>

            {/* Real component photo overlays */}
            {Object.entries(HOVER_IMAGES).map(([key, data]) => {
              const active = hoveredWord === key;
              return (
                <div
                  key={key}
                  className={`absolute inset-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-end p-5 overflow-hidden ${
                    active ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-105 pointer-events-none"
                  }`}
                >
                  <img
                    src={data.src}
                    alt={data.label}
                    className="absolute inset-0 w-full h-full object-cover grayscale brightness-75 contrast-125 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                  {/* Micro label for the physical part */}
                  <div className="relative z-10 font-tech text-[10px] tracking-wider flex flex-col gap-1 select-none text-left">
                    <span className="text-white font-bold uppercase">{data.label}</span>
                    <span className="text-blueprint text-[9px] uppercase tracking-widest">{data.coords}</span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Bottom-Left Live Telemetry Coordinates Ticker */}
      <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 font-tech text-[10px] sm:text-[11px] text-blueprint-dim tracking-wider select-none z-10">
        <span className="text-blueprint">LAT:</span> {stats.lat.toFixed(4)}° N <span className="mx-2 text-white/5">//</span> 
        <span className="text-blueprint">LNG:</span> {stats.lng.toFixed(4)}° E <span className="mx-2 text-white/5">//</span> 
        <span className="text-blueprint">CALIBRATION:</span> {(stats.calib * 100).toFixed(4)}% <span className="mx-2 text-white/5">//</span> 
        <span className="text-blueprint">UTC:</span> {stats.clock} <span className="mx-2 text-white/5">//</span> 
        <span className="text-blueprint">SYSTEM:</span> ACTIVE
      </div>
    </section>
  );
}

// ─── Capability Ticker ─────────────────────────────────────────────────────────

function CapabilityTicker({ capabilities }: { capabilities: string[] }) {
  const doubled = [...capabilities, ...capabilities, ...capabilities];

  return (
    <div className="bg-[#0a0a0a] overflow-hidden border-t border-b border-white/[0.07]">
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-ticker {
          animation: ticker-scroll 32s linear infinite;
          will-change: transform;
        }
      `}</style>
      <div className="flex animate-ticker whitespace-nowrap py-8">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-sans text-white inline-flex items-center text-xs sm:text-sm tracking-[2.16px]"
          >
            <span className="px-5 sm:px-8">{item}</span>
            <span className="text-white opacity-50 text-base">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Client Logos ──────────────────────────────────────────────────────────────

function ClientLogos() {
  // Each logo keeps its previous sizing; new SVG marks are sized into the same
  // visual band. Right margin (not flex gap) keeps the -50% marquee seamless.
  const logos = [
    // ISRO
    <ImageWithFallback
      key="isro"
      src={imgIsro}
      alt="Indian Space Research Organisation"
      className="h-16 sm:h-20 lg:h-[160px] w-auto object-contain max-w-[200px] lg:max-w-[240px]"
    />,
    // HAL (photo)
    <div key="hal-photo" className="relative h-16 sm:h-20 lg:h-[150px] w-32 sm:w-40 lg:w-[202px] overflow-hidden">
      <ImageWithFallback
        src={imgHal}
        alt="Hindustan Aeronautics Limited"
        className="absolute w-full object-contain"
        style={{ top: "-17.48%", height: "134.96%" }}
      />
    </div>,
    // HAL (SVG logo)
    <HalLogo key="hal-svg" className="h-14 sm:h-[90px] lg:h-[114px] w-auto" />,
    // Bharat Dynamics
    <ImageWithFallback
      key="bdl"
      src={imgBdl}
      alt="Bharat Dynamics Limited"
      className="h-10 sm:h-14 lg:h-[83px] w-auto object-contain"
    />,
    // ISRO variant
    <div key="isro-variant" className="relative h-16 sm:h-20 lg:h-[180px] w-32 sm:w-36 lg:w-[180px] overflow-hidden">
      <ImageWithFallback
        src={imgIsro9}
        alt="ISRO"
        className="absolute object-contain"
        style={{ top: "20.52%", left: "21.5%", width: "59.01%", height: "58.97%" }}
      />
    </div>,
    // L&T (square mark) — matched to HAL/ISRO band
    <img
      key="lnt"
      src={lntLogo}
      alt="Larsen & Toubro"
      className="h-14 sm:h-20 lg:h-[120px] w-auto object-contain"
    />,
    // Adani (wordmark)
    <img
      key="adani"
      src={adaniLogo}
      alt="Adani"
      className="h-12 sm:h-16 lg:h-[80px] w-auto object-contain"
    />,
    // Bharat Electronics (wordmark)
    <img
      key="bel"
      src={belLogo}
      alt="Bharat Electronics Limited"
      className="h-12 sm:h-16 lg:h-[72px] w-auto object-contain"
    />,
  ];

  // Marquee driven manually so hovering can ease the speed down smoothly
  // (changing a framer `duration` mid-loop would jump). Travels 0 → -50%
  // and wraps; the duplicated logo set makes the wrap seamless.
  const BASE_SPEED = 0.0011; // % of track per ms (~45s per loop)
  const SLOW_SPEED = 0.00028; // ~1/4 speed on hover
  const x = useMotionValue(0);
  const xPercent = useTransform(x, (v) => `${v}%`);
  const hovered = useRef(false);
  const speed = useRef(BASE_SPEED);

  useAnimationFrame((_, delta) => {
    const target = hovered.current ? SLOW_SPEED : BASE_SPEED;
    speed.current += (target - speed.current) * 0.08; // ease toward target
    let next = x.get() - speed.current * delta;
    if (next <= -50) next += 50;
    x.set(next);
  });

  return (
    <section className="bg-[#0a0a0a] py-8 lg:py-6 overflow-hidden">
      <div className="relative">
        {/* Edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-24 lg:w-40 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-24 lg:w-40 bg-gradient-to-l from-[#0a0a0a] to-transparent" />

        <motion.div
          className="flex w-max items-center py-6"
          style={{ x: xPercent }}
          onMouseEnter={() => (hovered.current = true)}
          onMouseLeave={() => (hovered.current = false)}
        >
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={`logo-${i < logos.length ? "a" : "b"}-${i % logos.length}`}
              className="shrink-0 flex items-center justify-center mr-12 sm:mr-16 lg:mr-24 transition-transform duration-300 ease-out hover:scale-110 hover:z-20"
              aria-hidden={i >= logos.length}
            >
              {logo}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── What We Build ─────────────────────────────────────────────────────────────

function WhatWeBuild() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Translate vertical scroll (0 to 1) to horizontal translation (0% to -66.66%)
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  const FALLBACK_SLIDES: SanityCapabilitySlide[] = [
    { _id: "cs1", id: "01", order: 1, code: "01", title: "UPTO 6-AXIS CNC MILLING",          image: IMAGES.home.capabilityCards.cncMilling,         imageAlt: "Close-up of high-precision multi-axis milled aerospace titanium manifold showcasing sub-micron edge tolerances.", specs: [{ key: "MATERIALS", value: "TITANIUM, INCONEL 718, M250, 15CDV6" }, { key: "ACCURACY", value: "< 0.006MM (6 MICRONS)" }, { key: "VOLUMETRIC CAPACITY", value: "6000MM X 3500MM X 1400MM" }, { key: "SPINDLE SPEED", value: "24,000 RPM / HIGH-TORQUE" }, { key: "CALIBRATION", value: "3D CMM, 3D ARM" }] },
    { _id: "cs2", id: "02", order: 2, code: "02", title: "PRECISION TURNING",                image: IMAGES.home.capabilityCards.precisionTurning,    imageAlt: "Aerospace cylindrical rotor shaft being turned to tight tolerances under high-contrast lighting.",              specs: [{ key: "MATERIALS", value: "TITANIUM, INCONEL 718, M250, 15CDV6" }, { key: "ACCURACY", value: "< 0.003MM (3 MICRONS)" }, { key: "SWING ENVELOPE", value: "Ø42000MM X 2500MM LENGTH" }, { key: "SURFACE FINISH", value: "RA 0.2 MICRONS" }, { key: "INSPECTION", value: "UNIMASTER & LASER SCANNING" }] },
    { _id: "cs3", id: "03", order: 3, code: "03", title: "AEROSPACE STRUCTURAL ASSEMBLY",    image: IMAGES.home.capabilityCards.structuralAssembly, imageAlt: "Cleanroom assembly of flight-critical structural brackets and aerostructure bulkheads.",                          specs: [{ key: "COMPATIBILITY", value: "FLIGHT-CRITICAL AEROSTRUCTURES" }, { key: "CERTIFICATION", value: "AS9100D COMPLIANT" }, { key: "LOAD TOLERANCE", value: "450KN TESTING RATING" }, { key: "HANDLING CAPACITY", value: "Ø42000MM X 4M LENGTH" }, { key: "ENVIRONMENTS", value: "CLASS-10K CLEAN ROOM" }, { key: "NDT METHODS", value: "ULTRASONIC, DYE PENETRANT, CONDUCTIVITY" }] },
    { _id: "cs4", id: "04", order: 4, code: "04", title: "WELDING & JOINING",                image: IMAGES.home.capabilityCards.weldingJoining,     imageAlt: "Certified welder performing TIG welding on flight-critical aerostructure components in a controlled environment.", specs: [{ key: "COMPATIBILITY", value: "AEROSPACE & DEFENCE MOTOR CASING" }, { key: "CERTIFICATION", value: "AUTHORIZED BY ISRO & DRDO" }, { key: "ENVIRONMENTS", value: "ISO 8 CLEAN ROOM" }, { key: "NDT METHODS", value: "XRAY, ULTRASONIC, DYE PENETRANT, CONDUCTIVITY" }] },
  ];
  const { data: slidesData } = useSanity<SanityCapabilitySlide[]>(CAPABILITY_SLIDES_QUERY);
  const items = slidesData?.length ? slidesData : FALLBACK_SLIDES;

  return (
    <section id="what-we-build" ref={targetRef} className="relative h-[400vh] bg-[#050505] overflow-visible">
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center pt-20">
        


        {/* Hairline structural frame */}
        <div className="absolute left-6 md:left-10 top-0 bottom-0 w-[1px] bg-white/[0.03] pointer-events-none" />
        <div className="absolute right-6 md:right-10 top-0 bottom-0 w-[1px] bg-white/[0.03] pointer-events-none" />
        <div className="absolute left-0 right-0 top-20 h-[1px] bg-white/[0.03] pointer-events-none" />
        <div className="absolute left-0 right-0 bottom-20 h-[1px] bg-white/[0.03] pointer-events-none" />

        {/* Slide track */}
        <motion.div style={{ x }} className="flex h-[80vh] w-[400vw]">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative w-screen h-100vh flex items-center justify-center select-none overflow-show"
            >
              {/* Massive background number outline */}
              <div className="absolute left-10 md:left-24 top-1/2 -translate-y-1/2 font-sans font-black text-[22vw] text-white/[0.015] leading-none tracking-tighter select-none pointer-events-none font-bold">
                {item.id}
              </div>

              {/* Grid content structure */}
              <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-[44px]">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center w-full relative z-10">
                {/* Title and image block */}
                <div className="col-span-12 md:col-span-8 flex flex-col gap-6 md:gap-8">
                  <div className="flex items-center gap-4">
                    <span className="font-tech text-xs tracking-wider text-blueprint font-semibold">{item.id} // CAPABILITY</span>
                    <div className="h-[1px] w-12 bg-blueprint/30" />
                    <h3 className="font-sans font-bold text-xl sm:text-2xl tracking-tight text-white uppercase">{item.title}</h3>
                  </div>

                  {/* Isolated image container */}
                  <div className="relative aspect-[16/9] min-h-[40vh] w-full rounded-sm border border-white/[0.05] bg-[#0D0F12] overflow-hidden group">
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      className="w-full h-full object-cover grayscale brightness-90 contrast-110 group-hover:scale-[1.02] group-hover:grayscale-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Bounding box corners indicator */}
                    <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-blueprint/40" />
                    <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-blueprint/40" />
                    <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-blueprint/40" />
                    <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-blueprint/40" />
                  </div>
                </div>

                {/* Technical micro-sidebar on the right */}
                <div className="col-span-12 md:col-span-4 flex flex-col justify-center border-l border-blueprint/10 pl-6 md:pl-10 h-full">
                  <div className="font-tech text-[10px] text-blueprint tracking-[0.2em] font-bold mb-4 uppercase">
                    METROLOGY & PRODUCTION SPECS
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    {item.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="flex flex-col border-b border-white/[0.03] pb-2">
                        <span className="font-tech text-[9px] tracking-wider text-blueprint-dim uppercase">{spec.key}</span>
                        <span className="font-tech text-xs tracking-widest text-white font-medium uppercase mt-0.5">{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Micro digital status indicator */}
                  <div className="mt-8 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-verified animate-pulse" />
                    <span className="font-tech text-[9px] tracking-widest text-verified uppercase">VERIFIED SYSTEM ACCURACY</span>
                  </div>
                </div>
              </div>
              </div>{/* end max-w-[1440px] wrapper */}
            </div>
          ))}
        </motion.div>
        
      </div>
    </section>
  );
}

// ─── How We Build ──────────────────────────────────────────────────────────────

function HowWeBuild() {
  return (
    <section id="how-we-build" className="bg-[#0a0a0a] py-16 sm:py-20 lg:py-[120px]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-[44px]">

        {/* Section header */}
        <div className="mb-10 lg:mb-[54px]">
          <p className="font-sans text-[#f70] text-xs font-bold tracking-[2.64px] uppercase mb-4">
            HOW WE BUILD
          </p>
          <h2 className="font-sans font-bold text-[#eaf2fb] text-3xl sm:text-4xl lg:text-[46px] leading-tight tracking-[-1.15px]">
            Hardware that has to work
            <br />
            the first time.
          </h2>
        </div>

        {/*
          Mosaic layout — 2 columns, complementary row splits:
          LEFT  col: [feature photo — 62%] + [2 text cards — 38%]
          RIGHT col: [dark text card — 38%] + [CNC photo — 62%]
        */}
        <div className="bg-[#090909] border border-white/20 overflow-hidden flex flex-col lg:flex-row lg:h-[720px] xl:h-[780px]">

          {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
          <div className="flex flex-col lg:flex-[55] border-b lg:border-b-0 lg:border-r border-white/20">

            {/* Feature photo with text overlay */}
            <div className="relative flex-[5] min-h-[300px] lg:min-h-0 overflow-hidden">
              <ImageWithFallback
                src={imgHowWeBuild}
                alt="Aerospace manufacturing team"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Top shadow for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-transparent" />
              <div className="absolute top-8 left-8 right-8 z-10">
                <h3 className="font-sans font-bold text-[#eaf2fb] text-[22px] sm:text-[28px] lg:text-[28px] xl:text-[32px] leading-[1.25] tracking-[-0.5px]">
                  Proven processes for<br />
                  flight &amp; defence,<br />
                  engineered to clear every<br />
                  inspection.
                </h3>
              </div>
            </div>

            {/* Bottom row — 2 text cards */}
            <div className="flex flex-row flex-[3] border-t border-white/20 divide-x divide-white/20">
              {/* Special-Process Welding */}
              <div className="flex-1 p-6 lg:p-7 flex flex-col justify-end min-h-[160px]">
                <h4 className="font-sans font-bold text-white text-[16px] lg:text-[18px] mb-2 leading-snug">
                  Special-Process Welding
                </h4>
                <p className="font-body text-[rgba(234,242,251,0.85)] text-[13px] leading-[1.5]">
                  TIG and electron-beam welding by certified operators, NADCAP accredited
                  for special processes.
                </p>
              </div>
              {/* Sheet-Metal Fabrication */}
              <div className="flex-1 p-6 lg:p-7 flex flex-col justify-end min-h-[160px]">
                <h4 className="font-sans font-bold text-white text-[16px] lg:text-[18px] mb-2 leading-snug">
                  Sheet-Metal Fabrication
                </h4>
                <p className="font-body text-[rgba(234,242,251,0.85)] text-[13px] leading-[1.5]">
                  Forming, rolling and large-format fabrication of structural assemblies
                  up to 6 metres.
                </p>
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN ────────────────────────────────────────────── */}
          <div className="flex flex-col lg:flex-[45]">

            {/* Dark text card — 5-Axis */}
            <div className="flex-[3] p-6 lg:p-8 flex flex-col justify-start border-b border-white/20">
              <h4 className="font-sans font-bold text-white text-[18px] lg:text-[20px] xl:text-[22px] mb-3 leading-snug tracking-[-0.2px]">
                5-Axis Precision Machining
              </h4>
              <p className="font-body text-[rgba(234,242,251,0.88)] text-[13px] lg:text-sm leading-relaxed max-w-[340px]">
                Complex geometries in titanium, aluminium and exotic alloys, held
                to ±5µm across the full envelope — ideal for flight-critical hardware.
              </p>
            </div>

            {/* CNC photo with NDT & Testing overlay */}
            <div className="relative flex-[5] min-h-[280px] lg:min-h-0 overflow-hidden">
              <ImageWithFallback
                src={IMAGES.home.howWeBuild.ndtTesting}
                alt="5-axis CNC precision machining"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Bottom gradient for text */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/75" />
              <div className="absolute bottom-7 left-7 right-7 z-10 text-left">
                <h4 className="font-sans font-bold text-white text-[16px] lg:text-[18px] mb-2 leading-snug">
                  NDT &amp; Testing
                </h4>
                <p className="font-body text-[rgba(234,242,251,0.9)] text-[13px] leading-[1.5]">
                  Non-destructive testing, CMM metrology and full dimensional
                  verification on every shipment.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

// ─── News / Headlines ──────────────────────────────────────────────────────────

const PRESS_IMAGES = [
  { url: IMAGES.home.news.aerostructureDelivery, caption: "AEROSTRUCTURE DELIVERY — ISRO" },
  { url: IMAGES.home.news.precisionFacility,     caption: "PRECISION MACHINING FACILITY" },
  { url: IMAGES.home.news.rocketMotorWeld,       caption: "ROCKET MOTOR CASING WELD" },
  { url: IMAGES.home.news.flightHardware,        caption: "FLIGHT HARDWARE INSPECTION" },
  { url: IMAGES.home.news.integratedSystem,      caption: "INTEGRATED SYSTEM DELIVERY" },
];

function NewsSection() {
  // Triplicate so the -33.333% loop is seamless at any viewport
  const slides = [...PRESS_IMAGES, ...PRESS_IMAGES, ...PRESS_IMAGES];

  return (
    <section className="bg-[#0a0a0a] border-t border-b border-white/[0.06] py-14 sm:py-18 lg:py-20 overflow-hidden">
      <style>{`
        @keyframes press-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-press-ticker {
          animation: press-ticker 28s linear infinite;
          will-change: transform;
        }
        .animate-press-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-[44px] mb-10">
        <p className="font-tech text-blueprint text-[10px] tracking-[0.25em] uppercase mb-3">
          PRESS & MEDIA // COVERAGE
        </p>
        <h2 className="font-sans font-bold text-white text-2xl lg:text-[32px] tracking-tight uppercase">
          IN THE FIELD.
        </h2>
      </div>

      {/* Edge fade masks */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

        <div className="flex animate-press-ticker gap-4" style={{ width: "max-content" }}>
          {slides.map((img, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 w-[480px] h-[320px] overflow-hidden border border-white/[0.06] group"
            >
              <img
                src={img.url}
                alt={img.caption}
                className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-500"
                loading="lazy"
              />
              {/* Corner brackets */}
              <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t border-l border-blueprint/40 pointer-events-none" />
              <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t border-r border-blueprint/40 pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 border-b border-l border-blueprint/40 pointer-events-none" />
              <div className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b border-r border-blueprint/40 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Insights ──────────────────────────────────────────────────────────────────

function InsightsSection() {
  const { data: insightsData } = useSanity<SanityInsight[]>(INSIGHTS_QUERY);
  const INSIGHTS = insightsData?.length ? insightsData : FALLBACK_INSIGHTS;

  return (
    <section className="bg-[#0a0a0a] py-16 sm:py-20 lg:py-[110px]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-[44px]">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 lg:mb-[38px]">
          <h2 className="font-sans font-bold text-[#eaf2fb] text-3xl sm:text-4xl lg:text-[42px] leading-tight tracking-[-1.05px] mb-4">
            Learn <span className="text-[#f70]">More</span>
            <br />
            From SVAPL
          </h2>
          <p className="font-body text-[#a6a6a6] text-base leading-relaxed max-w-md mb-5">
            Insights and updates from our engineering and programme teams on
            manufacturing for flight and defence.
          </p>
          <button className="bg-gradient-to-b from-white from-[21.5%] to-[#f70] to-[201%] text-black font-sans font-bold text-base px-12 py-3 rounded-[4px] hover:opacity-90 transition-opacity">
            Insights
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-10">
          {INSIGHTS.map((item, i) => (
            <article
              key={item._id}
              className={`rounded-[14px] p-[26px] flex flex-col gap-[9px] bg-white/[0.025] border border-white/[0.08] ${
                i > 0 ? "border-l border-white/10" : ""
              }`}
            >
              <p className="font-sans text-[#a6a6a6] text-xs tracking-[1.44px]">
                {item.date}
              </p>
              <h3 className="font-sans font-bold text-white text-[18px] leading-[1.25] pt-1">
                {item.title}
              </h3>
              <p className="font-body text-[#a6a6a6] text-[14px] leading-[1.55]">
                {item.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────

function Footer({ onNavigate }: { onNavigate: (page: Page, section?: string) => void }) {
  const caps: [string, Page?, string?][] = [
    ["Aerostructures", "home", "what-we-build"],
    ["Precision Machining", "home", "what-we-build"],
    ["Welding", "home", "how-we-build"],
    ["Assembly & Testing", "home", "how-we-build"],
  ];
  const company: [string, Page][] = [
    ["About SVAPL", "about"],
    ["Programmes", "programmes"],
    ["Newsroom", "newsroom"],
    ["Careers", "careers"],
  ];
  const contactInfo = [
    { label: "contracts@svapl.in", href: "mailto:contracts@svapl.in" },
    { label: "+91-40-23026683", href: "tel:+914023026683" },
    { label: "Hyderabad, India", href: undefined },
  ];

  return (
    <footer className="bg-[#0a0a0a]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-[44px] pt-16 sm:pt-20 lg:pt-[90px] pb-10">
        {/* Top: brand + CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 pb-12 sm:pb-16 lg:pb-[70px]">
          <div>
            <p className="font-sans font-bold text-white text-[36px] lg:text-[40px] tracking-[1.6px] leading-none mb-4">
              SVAPL
            </p>
            <p className="font-body text-blueprint-dim text-lg lg:text-xl leading-[1.4] max-w-[400px]">
              Mission-critical manufacturing for aerospace &amp; defence.
            </p>
          </div>
          <button
            onClick={() => onNavigate("contact")}
            className="bg-white text-black font-body font-semibold text-sm lg:text-[15px] px-6 py-4 rounded-[8px] hover:bg-[#f70] hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Become a Supplier Partner
          </button>
        </div>

        {/* Nav links grid */}
        <div className="relative border-t border-b border-white/[0.13] py-10 sm:py-12 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10">
          {/* Capabilities */}
          <div>
            <p className="font-sans text-white text-xs tracking-[1.92px] uppercase mb-5">Capabilities</p>
            <ul className="flex flex-col gap-3">
              {caps.map(([label, page, section]) => (
                <li key={label}>
                  <button
                    onClick={() => onNavigate(page || "home", section)}
                    className="font-body text-blueprint-dim text-[15px] leading-normal hover:text-white transition-colors text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="font-sans text-white text-xs tracking-[1.92px] uppercase mb-5">Company</p>
            <ul className="flex flex-col gap-3">
              {company.map(([label, page]) => (
                <li key={label}>
                  <button
                    onClick={() => onNavigate(page)}
                    className="font-body text-blueprint-dim text-[15px] leading-normal hover:text-white transition-colors text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Programmes */}
          <div>
            <p className="font-sans text-white text-xs tracking-[1.92px] uppercase mb-5">Programmes</p>
            <ul className="flex flex-col gap-3">
              {["ISRO", "DRDO", "HAL", "All Programmes"].map((l) => (
                <li key={l}>
                  <button
                    onClick={() => onNavigate("programmes")}
                    className="font-body text-blueprint-dim text-[15px] leading-normal hover:text-white transition-colors text-left"
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-sans text-white text-xs tracking-[1.92px] uppercase mb-5">Contact</p>
            <ul className="flex flex-col gap-3">
              {contactInfo.map(({ label, href }) => (
                <li key={label}>
                  {href ? (
                    <a href={href} className="font-body text-blueprint-dim text-[15px] leading-normal hover:text-white transition-colors">
                      {label}
                    </a>
                  ) : (
                    <span className="font-body text-blueprint-dim text-[15px] leading-normal">{label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 gap-4">
          <p className="font-sans text-white text-xs tracking-[0.48px]">
            © 2026 SRI VENKATESWARA AEROSPACE PVT. LTD.
          </p>
          <div className="flex gap-6">
              <a
                href="mailto:contracts@svapl.in?subject=Terms%20%26%20Privacy%20Enquiry"
                className="font-body text-white text-[13px] hover:text-[#f70] transition-colors"
              >
                Terms
              </a>
              <a
                href="mailto:contracts@svapl.in?subject=Privacy%20Enquiry"
                className="font-body text-white text-[13px] hover:text-[#f70] transition-colors"
              >
                Privacy
              </a>
              <a
                href="https://www.linkedin.com/company/svapl"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-white text-[13px] hover:text-[#f70] transition-colors"
              >
                Follow Us
              </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Home page bundle ─────────────────────────────────────────────────────────

function HomePage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { data: settings } = useSanity<SanitySiteSettings>(SITE_SETTINGS_QUERY);
  const capabilitiesTicker = settings?.capabilitiesTicker?.length
    ? settings.capabilitiesTicker
    : FALLBACK_CAPABILITIES_TICKER;

  return (
    <>
      <HeroSection />
      <CapabilityTicker capabilities={capabilitiesTicker} />
      <ClientLogos />
      <VerificationProofStrip />
      <WhatWeBuild />
      <Suspense fallback={<div className="h-screen bg-[#050505]" />}>
        <ProductShowcase3D onViewAll={() => onNavigate("products")} />
      </Suspense>
      <FactoryVideoPanel />
      <HowWeBuild />
      {/* <CompletedProjectsGrid /> */}
      <NewsSection />
      <InsightsSection />
    </>
  );
}

// ─── Error Boundary ────────────────────────────────────────────────────────────

class PageErrorBoundary extends Component<{ children: ReactNode }, { crashed: boolean }> {
  state = { crashed: false };
  static getDerivedStateFromError() { return { crashed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface to console only — no user data leaked
    console.error("[SVAPL] Page render error:", error.message, info.componentStack?.slice(0, 200));
  }
  render() {
    if (this.state.crashed) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-[#050505]">
          <div className="font-tech text-[9px] text-blueprint tracking-[0.25em] uppercase">SYS_ERR // PAGE LOAD FAILED</div>
          <button
            onClick={() => this.setState({ crashed: false })}
            className="font-tech text-[9px] tracking-widest text-blueprint-dim uppercase border border-white/[0.08] px-5 py-2 hover:border-blueprint/30 hover:text-white transition-all"
          >
            RETRY
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Root ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [preloaderDone, setPreloaderDone] = useState(false);

  const PAGE_TITLES: Record<Page, string> = {
    home:           "SVAPL — Precision Aerospace & Defence Manufacturing",
    about:          "About Us | SVAPL",
    "what-we-build":"Capabilities | SVAPL",
    "how-we-build": "Infrastructure | SVAPL",
    programmes:     "Programmes | SVAPL",
    newsroom:       "Newsroom | SVAPL",
    contact:        "Connect | SVAPL",
    careers:        "Careers | SVAPL",
    products:       "Products | SVAPL",
  };

  useEffect(() => {
    document.title = PAGE_TITLES[page];
  }, [page]);

  const navigate = (target: Page, sectionId?: string) => {
    setPage(target);
    if (sectionId) {
      // Small timeout lets React render the home page before scrolling
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    } else {
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Fullscreen preloader — renders above everything until assets are ready */}
      {!preloaderDone && <PreLoader onComplete={() => setPreloaderDone(true)} />}

      {/* Site renders beneath the preloader so Three.js can init during load */}
      <NavBar onNavigate={navigate} currentPage={page} />
      <PageErrorBoundary>
        {page === "home"          && <HomePage onNavigate={navigate} />}
        {page === "products"      && <ProductsPage onBack={() => navigate("home")} />}
        {page === "about"         && <AboutPage />}
        {page === "what-we-build" && <WhatWeBuildPage />}
        {page === "how-we-build"  && <HowWeBuildPage />}
        {page === "programmes"    && <ProgrammesPage />}
        {page === "newsroom"      && <NewsroomPage />}
        {page === "contact"       && <ContactPage />}
        {page === "careers"       && <CareersPage />}
      </PageErrorBoundary>
      <Footer onNavigate={navigate} />
    </div>
  );
}
