import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

import imgHeader from "@/imports/Desktop1/44363911e71cf9a03eb8eca1d986961f050713d9.png";
import imgLogo from "@/imports/Desktop1/1d148265799be8543f36d6a99d6999ef7e88dcf8.png";
import imgIsro from "@/imports/Desktop1/ab0fb5e0fd25a2388bd783599cc37263eab3e662.png";
import imgHal from "@/imports/Desktop1/b2548de20dc69efb7e8482c34eb45b5441ed2f79.png";
import imgBdl from "@/imports/Desktop1/4320f9e555817370397741e8b575df75a5708b7e.png";
import imgIsro9 from "@/imports/Desktop1/f9af3cf26d1cbc52bed8beed5492b00f5fa75182.png";
import imgGradient from "@/imports/Desktop1/9afe6b08154c56e0015b47657502065fde197518.png";
import imgHowWeBuild from "@/imports/Desktop1/aa1fb16ca114e1d2a4029b5fb4578aa416c99ce0.png";
import svgPaths from "@/imports/Desktop1/svg-mzctct3m79";

import AboutPage from "@/app/pages/AboutPage";
import ProgrammesPage from "@/app/pages/ProgrammesPage";
import ContactPage from "@/app/pages/ContactPage";
import NewsroomPage from "@/app/pages/NewsroomPage";
import CareersPage from "@/app/pages/CareersPage";
import WhatWeBuildPage from "@/app/pages/WhatWeBuildPage";
import HowWeBuildPage from "@/app/pages/HowWeBuildPage";

type Page = "home" | "about" | "what-we-build" | "how-we-build" | "programmes" | "newsroom" | "contact" | "careers";

// Nav items: [label, page | null for scroll-to-section, sectionId?]
type NavItem = { label: string; page?: Page; section?: string };
const NAV_ITEMS: NavItem[] = [
  { label: "About", page: "about" },
  { label: "What We Build", page: "what-we-build" as Page },
  { label: "How We Build", page: "how-we-build" as Page },
  { label: "Programmes", page: "programmes" },
  { label: "Newsroom", page: "newsroom" },
  { label: "Contact", page: "contact" },
];

const CAPABILITIES = [
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
    image: "https://images.unsplash.com/photo-1674897537555-dd6fbf72b4eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    desc: "Fuselage panels, wing ribs, bulkheads and fully integrated structural assemblies — built to print and delivered flight-ready.",
  },
  {
    label: "Precision Components",
    image: "https://images.unsplash.com/photo-1740209475472-aa7d280f7452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    desc: "Complex geometries in titanium, aluminium and exotic alloys, held to ±5µm across the full envelope — ideal for flight-critical hardware.",
  },
  {
    label: "Welded Structures",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    desc: "TIG and electron-beam welding by certified operators, NADCAP accredited for special processes on titanium and high-strength alloys.",
  },
  {
    label: "Integrated Assemblies",
    image: "https://images.unsplash.com/photo-1585347890782-6e1ddd365053?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    desc: "Full mechanical integration with wiring harness routing, hydraulic lines, and functional test before shipment — system-ready, not just fabricated.",
  },
  {
    label: "Defence Systems",
    image: "https://images.unsplash.com/photo-1515272751348-25380c6c1f9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    desc: "Structural and mechanical subsystems for ground, naval and airborne defence programmes, qualified to DRDO and MoD standards.",
  },
];

const INSIGHTS = [
  {
    date: "JUN 2026",
    title: "The economics of vertical integration in aerostructures",
    desc: "Why owning the full process chain de-risks delivery for tier-1 programmes.",
  },
  {
    date: "MAY 2026",
    title: "Inside our Class-10K assembly & integration halls",
    desc: "A look at the controlled environments where flight hardware comes together.",
  },
  {
    date: "APR 2026",
    title: "How we hold ±5µm across a 1.2m envelope",
    desc: "Thermal control, fixturing and metrology behind repeatable precision.",
  },
  {
    date: "MAR 2026",
    title: "NADCAP welding: what first-article really proves",
    desc: "The accreditation discipline that keeps special processes flight-safe.",
  },
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

// Economic Times logo
function EtLogo({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 328.381 28.6668">
      <path d={svgPaths.p2e7b3b00} fill="#C7C7C7" />
    </svg>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function NavBar({ onNavigate, currentPage }: { onNavigate: (page: Page, section?: string) => void; currentPage: Page }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  // Hide on scroll-down, reveal on scroll-up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY.current;
      // Always show when near top (< 80px) or scrolling up
      setVisible(!goingDown || y < 80);
      // Past the hero edge → fill with a subtle grey so the bar reads cleanly
      setScrolled(y > 80);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (item: NavItem) => {
    setOpen(false);
    if (item.page) onNavigate(item.page);
    else if (item.section) onNavigate("home", item.section);
  };

  const isActive = (item: NavItem) => item.page ? currentPage === item.page : currentPage === "home";

  return (
    /*
      No backdrop-blur, no background.
      mix-blend-mode:difference on text/icon elements makes them auto-invert
      against any background colour — white on dark, dark on light.
      The "Request Briefing" button is kept outside blend-mode so its
      solid white bg always reads cleanly on dark sections.
    */
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        visible ? "translate-y-0" : "-translate-y-full"
      } ${
        scrolled
          ? "bg-white/[0.04] border-b border-white/[0.06]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-5 sm:px-10 lg:px-20 h-20">

        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
        >
          {/* Logo artwork is black-on-transparent; the site is dark, so render
              the white variant via invert. (brightness(0) → solid black,
              invert(1) → solid white; transparent pixels stay transparent.) */}
          <ImageWithFallback
            src={imgLogo}
            alt="SVAPL"
            className="h-11 lg:h-12 w-auto object-contain [filter:brightness(0)_invert(1)]"
          />
        </button>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-[24px]">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNav(item)}
              /* mix-blend-mode:difference: white text → appears white on dark, black on light */
              className={`[mix-blend-mode:difference] font-['Space_Grotesk',sans-serif] text-sm font-medium transition-colors ${
                isActive(item) ? "text-blueprint" : "text-white hover:text-white/70"
              }`}
            >
              {item.label}
            </button>
          ))}
          {/* Button intentionally has no blend-mode — solid white always works on dark sections */}
          <button
            onClick={() => onNavigate("contact")}
            className="bg-white text-black font-['Archivo',sans-serif] font-semibold text-sm px-5 py-[10px] rounded-[4px] hover:bg-[#f70] hover:text-white transition-colors"
          >
            Request Briefing
          </button>
        </div>

        {/* Mobile hamburger — blends like text */}
        <button
          className="lg:hidden [mix-blend-mode:difference] text-white p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu — solid panel, no blend needed */}
      {open && (
        <div className="lg:hidden bg-black/95 border-t border-white/10 px-5 pb-6 flex flex-col gap-4 pt-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNav(item)}
              className={`text-left font-['Space_Grotesk',sans-serif] text-sm font-medium transition-colors ${
                isActive(item) ? "text-blueprint" : "text-white hover:text-blueprint"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => { setOpen(false); onNavigate("contact"); }}
            className="bg-white text-black font-['Archivo',sans-serif] font-semibold text-sm px-5 py-3 rounded-[4px] self-start hover:bg-[#f70] hover:text-white transition-colors"
          >
            Request Briefing
          </button>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative min-h-[860px] h-screen max-h-[980px] flex items-end">
      <ImageWithFallback
        src={imgHeader}
        alt="SVAPL manufacturing facility"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.05)] via-transparent to-black/85" />

      <div className="relative z-10 w-full px-5 sm:px-10 lg:px-[44px] xl:px-20 pb-16 sm:pb-20 lg:pb-[116px] max-w-[1440px] mx-auto">
        <h1
          className="font-['Space_Grotesk',sans-serif] font-normal text-white text-4xl sm:text-5xl lg:text-[64px] leading-tight lg:leading-[1.1] tracking-[-2px] lg:tracking-[-2.76px] mb-5 lg:mb-6"
          style={{ textShadow: "0px 4px 4px rgba(0,0,0,0.1)" }}
        >
          Fabricate. Assemble. Certify.
        </h1>

        <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6 lg:gap-0 lg:flex-wrap">
          {/* Description */}
          <div className="flex-1 min-w-0 lg:border-l lg:border-white lg:pl-6">
            <p
              className="font-['Space_Grotesk',sans-serif] font-medium text-white text-base lg:text-lg leading-relaxed max-w-xl"
              style={{ textShadow: "0px 4px 4px rgba(0,0,0,0.1)" }}
            >
              Mission-critical manufacturing for the world&apos;s most demanding
              aerospace and defence programmes — advanced fabrication, precision
              machining, welding, assembly and testing, under one certified roof.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-[14px] lg:ml-8 shrink-0">
            <button className="bg-white text-black font-['Space_Grotesk',sans-serif] font-bold text-sm lg:text-base px-6 lg:px-8 py-3 rounded-[4px] hover:bg-[#f70] hover:text-white transition-colors">
              Request Strategic Briefing
            </button>
            <button className="border border-white text-white font-['Space_Grotesk',sans-serif] font-bold text-sm lg:text-base px-6 lg:px-8 py-3 rounded-[4px] hover:bg-white/10 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Capability Ticker ─────────────────────────────────────────────────────────

function CapabilityTicker() {
  const doubled = [...CAPABILITIES, ...CAPABILITIES, ...CAPABILITIES];

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
            className="font-['Space_Grotesk',sans-serif] text-white inline-flex items-center text-xs sm:text-sm tracking-[2.16px]"
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
  return (
    <section className="bg-[#0a0a0a] py-8 lg:py-6">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-12">
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12 xl:gap-16 py-6">
          {/* ISRO */}
          <ImageWithFallback
            src={imgIsro}
            alt="Indian Space Research Organisation"
            className="h-16 sm:h-20 lg:h-[160px] w-auto object-contain max-w-[200px] lg:max-w-[240px]"
          />
          {/* HAL (photo) */}
          <div className="relative h-16 sm:h-20 lg:h-[150px] w-32 sm:w-40 lg:w-[202px] overflow-hidden">
            <ImageWithFallback
              src={imgHal}
              alt="Hindustan Aeronautics Limited"
              className="absolute w-full object-contain"
              style={{ top: "-17.48%", height: "134.96%" }}
            />
          </div>
          {/* HAL (SVG logo) */}
          <HalLogo className="h-14 sm:h-[90px] lg:h-[114px] w-auto" />
          {/* Bharat Dynamics */}
          <ImageWithFallback
            src={imgBdl}
            alt="Bharat Dynamics Limited"
            className="h-10 sm:h-14 lg:h-[83px] w-auto object-contain"
          />
          {/* ISRO variant */}
          <div className="relative h-16 sm:h-20 lg:h-[180px] w-32 sm:w-36 lg:w-[180px] overflow-hidden">
            <ImageWithFallback
              src={imgIsro9}
              alt="ISRO"
              className="absolute object-contain"
              style={{ top: "20.52%", left: "21.5%", width: "59.01%", height: "58.97%" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── What We Build ─────────────────────────────────────────────────────────────

function WhatWeBuild() {
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Scroll-driven active index on desktop
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const scrolledIn = -rect.top;
      const range = el.offsetHeight - window.innerHeight;
      if (range <= 0 || scrolledIn < 0) return;
      const progress = Math.min(1, scrolledIn / range);
      const idx = Math.min(
        CATEGORY_DATA.length - 1,
        Math.floor(progress * CATEGORY_DATA.length)
      );
      setActiveIndex(idx);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToCategory = (i: number) => {
    const el = wrapperRef.current;
    if (!el) return;
    const wrapperTop = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    const target = wrapperTop + (i / CATEGORY_DATA.length) * range;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <section id="what-we-build" className="bg-[#0a0a0a]">
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-up { animation: fadeSlideUp 0.38s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      {/* ── DESKTOP: sticky scroll (md and up) ───────────────────────────── */}
      <div
        ref={wrapperRef}
        className="hidden md:block relative"
        style={{ height: `${CATEGORY_DATA.length * 100}vh` }}
      >
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px] w-full flex flex-col gap-6 lg:gap-8">

            {/* Heading inside sticky area */}
            <div>
              <p className="font-['Space_Grotesk',sans-serif] text-[#f70] text-xs font-bold tracking-[2.64px] uppercase mb-2">
                WHAT WE BUILD
              </p>
              <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-2xl lg:text-[36px] xl:text-[42px] leading-tight tracking-[-1px]">
                Hardware that has to work the first time.
              </h2>
            </div>

            <div className="flex items-center gap-6 lg:gap-10 xl:gap-14">

              {/* Left: category list */}
              <nav className="flex flex-col gap-1 shrink-0 w-[160px] lg:w-[200px] xl:w-[230px]">
                {CATEGORY_DATA.map((cat, i) => (
                  <button
                    key={cat.label}
                    onClick={() => scrollToCategory(i)}
                    className={`text-left font-['Space_Grotesk',sans-serif] font-bold text-base lg:text-xl xl:text-2xl px-3 py-[5px] rounded-[8px] transition-all duration-300 leading-snug ${
                      i === activeIndex
                        ? "text-[#eaf2fb]"
                        : "text-[#333] hover:text-[#666]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </nav>

              {/* Center: crossfading image */}
              <div
                className="relative flex-1 min-w-0 rounded-[8px] border border-[#2f2f2f] overflow-hidden"
                style={{ height: "54vh" }}
              >
                {CATEGORY_DATA.map((cat, i) => (
                  <ImageWithFallback
                    key={cat.label}
                    src={cat.image}
                    alt={cat.label}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
                      i === activeIndex ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
                {/* Subtle vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40 pointer-events-none" />
              </div>

              {/* Right: description + CTA */}
              <div className="shrink-0 w-[200px] lg:w-[240px] xl:w-[270px]">
                {/* key forces re-mount → triggers animation on each change */}
                <div key={activeIndex} className="anim-fade-up flex flex-col gap-5">
                  <p className="font-['Space_Grotesk',sans-serif] text-white text-sm lg:text-[15px] xl:text-base leading-relaxed">
                    {CATEGORY_DATA[activeIndex].desc}
                  </p>
                  <button className="border-[0.5px] border-white/50 text-[#eaf2fb] font-['Archivo',sans-serif] font-semibold text-sm lg:text-base px-6 py-[9px] rounded-[4px] self-start hover:bg-white/10 transition-colors">
                    Explore capability
                  </button>
                </div>
              </div>

            </div>{/* end 3-col row */}
          </div>{/* end max-w container */}
        </div>{/* end sticky */}
      </div>{/* end wrapper */}

      {/* ── MOBILE: tab + stacked layout (below md) ─────────────────────── */}
      <div className="md:hidden pb-16 px-5">
        {/* Heading */}
        <div className="mb-6">
          <p className="font-['Space_Grotesk',sans-serif] text-[#f70] text-xs font-bold tracking-[2.64px] uppercase mb-3">WHAT WE BUILD</p>
          <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-3xl leading-tight tracking-[-1px]">
            Hardware that has to work the first time.
          </h2>
        </div>
        {/* Horizontal scrollable tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-5 -mx-1 px-1">
          {CATEGORY_DATA.map((cat, i) => (
            <button
              key={cat.label}
              onClick={() => setActiveIndex(i)}
              className={`whitespace-nowrap font-['Space_Grotesk',sans-serif] font-bold text-sm px-4 py-2 rounded-[8px] transition-all duration-200 border ${
                i === activeIndex
                  ? "text-[#eaf2fb] border-white/20 bg-white/5"
                  : "text-[#555] border-transparent"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Image */}
        <div className="relative rounded-[8px] border border-[#2f2f2f] overflow-hidden h-[260px] mb-5">
          {CATEGORY_DATA.map((cat, i) => (
            <img
              key={cat.label}
              src={cat.image}
              alt={cat.label}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-400 ${
                i === activeIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 pointer-events-none" />
        </div>

        {/* Description */}
        <div key={activeIndex} className="anim-fade-up">
          <p className="font-['Space_Grotesk',sans-serif] text-white text-sm leading-relaxed mb-4">
            {CATEGORY_DATA[activeIndex].desc}
          </p>
          <button className="border border-white/40 text-[#eaf2fb] font-['Archivo',sans-serif] font-semibold text-sm px-6 py-2 rounded-[4px] hover:bg-white/10 transition-colors">
            Explore capability
          </button>
        </div>
      </div>

    </section>
  );
}

// ─── How We Build ──────────────────────────────────────────────────────────────

function HowWeBuild() {
  return (
    <section id="how-we-build" className="bg-[#0a0a0a] py-16 sm:py-20 lg:py-[120px]">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px]">

        {/* Section header */}
        <div className="mb-10 lg:mb-[54px]">
          <p className="font-['Space_Grotesk',sans-serif] text-[#f70] text-xs font-bold tracking-[2.64px] uppercase mb-4">
            HOW WE BUILD
          </p>
          <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-3xl sm:text-4xl lg:text-[46px] leading-tight tracking-[-1.15px]">
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
                <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-[22px] sm:text-[28px] lg:text-[28px] xl:text-[32px] leading-[1.25] tracking-[-0.5px]">
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
                <h4 className="font-['Space_Grotesk',sans-serif] font-bold text-white text-[16px] lg:text-[18px] mb-2 leading-snug">
                  Special-Process Welding
                </h4>
                <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.68)] text-[13px] leading-[1.5]">
                  TIG and electron-beam welding by certified operators, NADCAP accredited
                  for special processes.
                </p>
              </div>
              {/* Sheet-Metal Fabrication */}
              <div className="flex-1 p-6 lg:p-7 flex flex-col justify-end min-h-[160px]">
                <h4 className="font-['Space_Grotesk',sans-serif] font-bold text-white text-[16px] lg:text-[18px] mb-2 leading-snug">
                  Sheet-Metal Fabrication
                </h4>
                <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.68)] text-[13px] leading-[1.5]">
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
              <h4 className="font-['Space_Grotesk',sans-serif] font-bold text-white text-[18px] lg:text-[20px] xl:text-[22px] mb-3 leading-snug tracking-[-0.2px]">
                5-Axis Precision Machining
              </h4>
              <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.72)] text-[13px] lg:text-sm leading-relaxed max-w-[340px]">
                Complex geometries in titanium, aluminium and exotic alloys, held
                to ±5µm across the full envelope — ideal for flight-critical hardware.
              </p>
            </div>

            {/* CNC photo with NDT & Testing overlay */}
            <div className="relative flex-[5] min-h-[280px] lg:min-h-0 overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1740209475472-aa7d280f7452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="5-axis CNC precision machining"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Bottom gradient for text */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/75" />
              <div className="absolute bottom-7 left-7 right-7 z-10">
                <h4 className="font-['Space_Grotesk',sans-serif] font-bold text-white text-[16px] lg:text-[18px] mb-2 leading-snug">
                  NDT &amp; Testing
                </h4>
                <p className="font-['Archivo',sans-serif] text-[rgba(234,242,251,0.74)] text-[13px] leading-[1.5]">
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

function NewsSection() {
  return (
    <section className="bg-[#232323] py-16 sm:py-20 lg:py-24">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px]">
        <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-white text-2xl sm:text-3xl lg:text-[32px] text-center capitalize tracking-[-0.76px] mb-12 lg:mb-14">
          Leading on frontier headlines
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-4 lg:gap-6 border-t border-b border-white/10 py-6 lg:py-[24px]">
          {[0, 1, 2].map((i) => (
            <EtLogo
              key={i}
              className="h-[28px] w-auto max-w-[280px] sm:max-w-none sm:flex-1"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Insights ──────────────────────────────────────────────────────────────────

function InsightsSection() {
  const [start, setStart] = useState(0);
  const total = INSIGHTS.length;

  const prev = () => setStart((s) => (s - 1 + total) % total);
  const next = () => setStart((s) => (s + 1) % total);

  return (
    <section className="bg-[#0a0a0a] py-16 sm:py-20 lg:py-[110px]">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px]">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 lg:mb-[38px]">
          <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-[#eaf2fb] text-3xl sm:text-4xl lg:text-[42px] leading-tight tracking-[-1.05px] mb-4">
            Learn <span className="text-[#f70]">More</span>
            <br />
            From SVAPL
          </h2>
          <p className="font-['Archivo',sans-serif] text-[#a6a6a6] text-base leading-relaxed max-w-md mb-5">
            Insights and updates from our engineering and programme teams on
            manufacturing for flight and defence.
          </p>
          <button className="bg-gradient-to-b from-white from-[21.5%] to-[#f70] to-[201%] text-black font-['Space_Grotesk',sans-serif] font-bold text-base px-12 py-3 rounded-[4px] hover:opacity-90 transition-opacity">
            Insights
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-10">
          {INSIGHTS.map((item, i) => (
            <article
              key={i}
              className={`rounded-[14px] p-[26px] flex flex-col gap-[9px] bg-white/[0.025] border border-white/[0.08] ${
                i > 0 ? "border-l border-white/10" : ""
              }`}
            >
              <p className="font-['Space_Grotesk',sans-serif] text-[#a6a6a6] text-xs tracking-[1.44px]">
                {item.date}
              </p>
              <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-white text-[18px] leading-[1.25] pt-1">
                {item.title}
              </h3>
              <p className="font-['Archivo',sans-serif] text-[#6e6e6e] text-[14px] leading-[1.55]">
                {item.desc}
              </p>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={prev}
            className="w-[38px] h-[38px] rounded-full border border-white/24 flex items-center justify-center text-white text-lg hover:border-white/60 transition-colors font-['Archivo',sans-serif]"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="w-[38px] h-[38px] rounded-full border border-white/24 flex items-center justify-center text-white text-lg hover:border-white/60 transition-colors font-['Archivo',sans-serif]"
            aria-label="Next"
          >
            ›
          </button>
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
      <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px] pt-16 sm:pt-20 lg:pt-[90px] pb-10">
        {/* Top: brand + CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 pb-12 sm:pb-16 lg:pb-[70px]">
          <div>
            <p className="font-['Space_Grotesk',sans-serif] font-bold text-white text-[36px] lg:text-[40px] tracking-[1.6px] leading-none mb-4">
              SVAPL
            </p>
            <p className="font-['Archivo',sans-serif] text-[#aeaeae] text-lg lg:text-xl leading-[1.4] max-w-[400px]">
              Mission-critical manufacturing for aerospace &amp; defence.
            </p>
          </div>
          <button
            onClick={() => onNavigate("contact")}
            className="bg-white text-black font-['Archivo',sans-serif] font-semibold text-sm lg:text-[15px] px-6 py-4 rounded-[8px] hover:bg-[#f70] hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Become a Supplier Partner
          </button>
        </div>

        {/* Nav links grid */}
        <div className="relative border-t border-b border-white/[0.13] py-10 sm:py-12 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10">
          {/* Capabilities */}
          <div>
            <p className="font-['Space_Grotesk',sans-serif] text-white text-xs tracking-[1.92px] uppercase mb-5">Capabilities</p>
            <ul className="flex flex-col gap-3">
              {caps.map(([label, page, section]) => (
                <li key={label}>
                  <button
                    onClick={() => onNavigate(page || "home", section)}
                    className="font-['Archivo',sans-serif] text-[#aeaeae] text-[15px] leading-normal hover:text-white transition-colors text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="font-['Space_Grotesk',sans-serif] text-white text-xs tracking-[1.92px] uppercase mb-5">Company</p>
            <ul className="flex flex-col gap-3">
              {company.map(([label, page]) => (
                <li key={label}>
                  <button
                    onClick={() => onNavigate(page)}
                    className="font-['Archivo',sans-serif] text-[#aeaeae] text-[15px] leading-normal hover:text-white transition-colors text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Programmes */}
          <div>
            <p className="font-['Space_Grotesk',sans-serif] text-white text-xs tracking-[1.92px] uppercase mb-5">Programmes</p>
            <ul className="flex flex-col gap-3">
              {["ISRO", "DRDO", "HAL", "All Programmes"].map((l) => (
                <li key={l}>
                  <button
                    onClick={() => onNavigate("programmes")}
                    className="font-['Archivo',sans-serif] text-[#aeaeae] text-[15px] leading-normal hover:text-white transition-colors text-left"
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-['Space_Grotesk',sans-serif] text-white text-xs tracking-[1.92px] uppercase mb-5">Contact</p>
            <ul className="flex flex-col gap-3">
              {contactInfo.map(({ label, href }) => (
                <li key={label}>
                  {href ? (
                    <a href={href} className="font-['Archivo',sans-serif] text-[#aeaeae] text-[15px] leading-normal hover:text-white transition-colors">
                      {label}
                    </a>
                  ) : (
                    <span className="font-['Archivo',sans-serif] text-[#aeaeae] text-[15px] leading-normal">{label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 gap-4">
          <p className="font-['Space_Grotesk',sans-serif] text-white text-xs tracking-[0.48px]">
            © 2026 SRI VENKATESWARA AEROSPACE PVT. LTD.
          </p>
          <div className="flex gap-6">
            {["Terms", "Privacy", "Follow Us"].map((l) => (
              <a
                key={l}
                href="#"
                className="font-['Archivo',sans-serif] text-white text-[13px] hover:text-[#f70] transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Home page bundle ─────────────────────────────────────────────────────────

function HomePage() {
  return (
    <>
      <HeroSection />
      <CapabilityTicker />
      <ClientLogos />
      <WhatWeBuild />
      <HowWeBuild />
      <NewsSection />
      <InsightsSection />
    </>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");

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
      <NavBar onNavigate={navigate} currentPage={page} />
      {page === "home"           && <HomePage />}
      {page === "about"          && <AboutPage />}
      {page === "what-we-build"  && <WhatWeBuildPage />}
      {page === "how-we-build"   && <HowWeBuildPage />}
      {page === "programmes"     && <ProgrammesPage />}
      {page === "newsroom"   && <NewsroomPage />}
      {page === "contact"    && <ContactPage />}
      {page === "careers"    && <CareersPage />}
      <Footer onNavigate={navigate} />
    </div>
  );
}
