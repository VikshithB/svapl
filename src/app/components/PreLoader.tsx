import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import imgLogo    from "@/imports/Desktop1/1d148265799be8543f36d6a99d6999ef7e88dcf8.png";
import imgHeader  from "@/imports/Desktop1/44363911e71cf9a03eb8eca1d986961f050713d9.png";
import imgGradient from "@/imports/Desktop1/9afe6b08154c56e0015b47657502065fde197518.png";
import imgIsro    from "@/imports/Desktop1/ab0fb5e0fd25a2388bd783599cc37263eab3e662.png";
import imgHal     from "@/imports/Desktop1/b2548de20dc69efb7e8482c34eb45b5441ed2f79.png";
import imgHowWe   from "@/imports/Desktop1/aa1fb16ca114e1d2a4029b5fb4578aa416c99ce0.png";

// All critical above-fold assets to warm up before revealing the site
const CRITICAL_ASSETS = [imgHeader, imgGradient, imgIsro, imgHal, imgHowWe, imgLogo];

const STAGES = [
  "PRELOADING ASSETS",
  "INITIALISING RENDERER",
  "CALIBRATING SYSTEMS",
  "LAUNCH READY",
] as const;

function RocketSVG({ boost }: { boost: boolean }) {
  return (
    <svg
      width="52"
      height="26"
      viewBox="0 0 52 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-200 ${boost ? "scale-x-110" : ""}`}
    >
      {/* Exhaust flame — glows on boost */}
      <path
        d="M9 11L0 13L9 15Z"
        fill="#ff7700"
        opacity={boost ? 0.9 : 0.35}
        className="transition-opacity duration-150"
      />
      <path
        d="M9 11.5L3 13L9 14.5Z"
        fill="#ffcc00"
        opacity={boost ? 0.8 : 0.2}
        className="transition-opacity duration-150"
      />

      {/* Upper fin */}
      <path d="M9 4L16 5L9 0Z" fill="#cc4400" />
      {/* Lower fin */}
      <path d="M9 22L16 21L9 26Z" fill="#cc4400" />

      {/* Main body */}
      <path d="M9 5H34L52 13L34 21H9V5Z" fill="#ff7700" />

      {/* Nose cone highlight */}
      <path d="M40 9L52 13L40 17Z" fill="#ffaa44" />

      {/* Body strake line */}
      <line x1="9" y1="13" x2="38" y2="13" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5" />

      {/* Porthole */}
      <circle cx="23" cy="13" r="3.2" fill="#050505" />
      <circle cx="23" cy="13" r="3.2" stroke="#ffaa44" strokeWidth="0.6" fill="none" />

      {/* Heat shield line */}
      <path d="M34 7L34 19" stroke="rgba(255,100,0,0.4)" strokeWidth="0.8" />
    </svg>
  );
}

export function PreLoader({ onComplete }: { onComplete: () => void }) {
  const [show,       setShow]       = useState(true);
  const [progress,   setProgress]   = useState(0);
  const [displayNum, setDisplayNum] = useState(0);
  const [stageIdx,   setStageIdx]   = useState(0);
  const [boost,      setBoost]      = useState(false);

  const prefersReduced = typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    // Skip preloader on subsequent soft navigations (sessionStorage flag)
    if (sessionStorage.getItem("svapl_preloaded")) {
      onComplete();
      return;
    }

    if (prefersReduced) {
      sessionStorage.setItem("svapl_preloaded", "1");
      onComplete();
      return;
    }

    // ── Phase 1: preload critical images (0 → 55%) ──────────────────────
    let loaded = 0;
    const increment = 55 / CRITICAL_ASSETS.length;
    CRITICAL_ASSETS.forEach(src => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        setProgress(p => Math.max(p, Math.round(increment * loaded)));
      };
      img.src = src;
    });

    // ── Phase 2: time-based stages ──────────────────────────────────────
    const t1 = setTimeout(() => {
      setStageIdx(1);
      setProgress(p => Math.max(p, 60));
    }, 1600);

    const t2 = setTimeout(() => {
      setStageIdx(2);
      setProgress(p => Math.max(p, 80));
    }, 2600);

    const t3 = setTimeout(() => {
      setStageIdx(3);
      setBoost(true);
      setProgress(100);
    }, 3300);

    // ── Phase 3: exit ────────────────────────────────────────────────────
    const t4 = setTimeout(() => {
      setShow(false);
    }, 4100);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Smooth display counter — eases toward real progress
  useEffect(() => {
    const id = setInterval(() => {
      setDisplayNum(n => {
        if (n >= Math.floor(progress)) return Math.floor(progress);
        const step = Math.max(1, Math.ceil((progress - n) * 0.12));
        return Math.min(n + step, Math.floor(progress));
      });
    }, 16);
    return () => clearInterval(id);
  }, [progress]);

  const clampedPct = Math.min(displayNum, 99.5); // rocket never fully exits track

  return (
    <AnimatePresence onExitComplete={() => {
      sessionStorage.setItem("svapl_preloaded", "1");
      onComplete();
    }}>
      {show && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col overflow-hidden select-none"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] as [number,number,number,number] }}
        >
          {/* Blueprint grid */}
          <div className="absolute inset-0 bp-grid opacity-20 pointer-events-none" />

          {/* Engineering corner marks */}
          <div className="absolute top-6 left-6  w-4 h-4 border-t border-l border-blueprint/40" />
          <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-blueprint/40" />
          <div className="absolute bottom-6 left-6  w-4 h-4 border-b border-l border-blueprint/40" />
          <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-blueprint/40" />

          {/* ── Top bar ──────────────────────────────────────────────── */}
          <div className="flex items-start justify-between px-8 sm:px-14 pt-10">
            <div className="flex flex-col gap-1">
              <img
                src={imgLogo}
                alt="SVAPL"
                className="h-10 sm:h-12 w-auto object-contain [filter:brightness(0)_invert(1)]"
              />
              <div className="font-tech text-[9px] tracking-[0.28em] text-blueprint-dim mt-1">
                SRI VENKATESWARA AEROSPACE PVT. LTD.
              </div>
            </div>

            {/* Giant percentage counter */}
            <div className="text-right">
              <div
                className="font-sans font-black leading-none tabular-nums text-white"
                style={{ fontSize: "clamp(64px, 10vw, 120px)" }}
              >
                {String(displayNum).padStart(3, "0")}
                <span className="text-blueprint" style={{ fontSize: "0.45em" }}>%</span>
              </div>
            </div>
          </div>

          {/* ── Divider ──────────────────────────────────────────────── */}
          <div className="mx-8 sm:mx-14 mt-4 h-[1px] bg-white/[0.06]" />

          {/* ── Status text ──────────────────────────────────────────── */}
          <div className="px-8 sm:px-14 mt-6">
            <motion.div
              key={stageIdx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-tech text-[10px] sm:text-[11px] tracking-[0.3em] text-blueprint"
            >
              {STAGES[stageIdx]}
            </motion.div>

            {/* Sub-label */}
            <div className="font-tech text-[8px] tracking-[0.2em] text-white/20 mt-2">
              SEQUENCE {String(displayNum).padStart(3, "0")} / 100 — AS9100D CERTIFIED
            </div>
          </div>

          {/* ── Spacer ───────────────────────────────────────────────── */}
          <div className="flex-1" />

          {/* ── Rocket track ─────────────────────────────────────────── */}
          <div className="px-8 sm:px-14 pb-14">
            {/* Track container */}
            <div className="relative w-full">
              {/* Track baseline */}
              <div className="relative h-[1px] bg-white/10 w-full">
                {/* Orange fill */}
                <motion.div
                  className="absolute left-0 top-0 h-full bg-blueprint origin-left"
                  style={{ width: `${clampedPct}%` }}
                />

                {/* Blueprint tick marks */}
                {[0, 25, 50, 75, 100].map(t => (
                  <div
                    key={t}
                    className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
                    style={{ left: `${t}%` }}
                  >
                    <div className="h-2 w-[1px] bg-white/20 -mt-2" />
                  </div>
                ))}
              </div>

              {/* Rocket — rides 8px above the track */}
              <motion.div
                className="absolute -top-[22px]"
                style={{ left: `${clampedPct}%` }}
              >
                <div className="-translate-x-1/2">
                  <RocketSVG boost={boost} />
                </div>
              </motion.div>
            </div>

            {/* Track labels */}
            <div className="flex justify-between mt-3">
              <span className="font-tech text-[9px] tracking-widest text-white/25">000</span>
              <span className="font-tech text-[9px] tracking-widest text-blueprint">
                {String(displayNum).padStart(3, "0")}
              </span>
              <span className="font-tech text-[9px] tracking-widest text-white/25">100</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
