import { useEffect, useRef, useState } from "react";
import videoSrc from "@/imports/svapl_preview.mp4";

export function FactoryVideoPanel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(err => console.log(err));
    }
    setPlaying(!playing);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log("Autoplay was blocked or failed:", err);
      });
    }
  }, []);

  return (
    <section className="bg-[#050505] border-b border-white/[0.06] py-20 lg:py-28 relative overflow-hidden">
      {/* Vertical side lines */}
      <div className="absolute left-6 md:left-10 top-0 bottom-0 w-[1px] bg-white/[0.025] pointer-events-none" />
      <div className="absolute right-6 md:right-10 top-0 bottom-0 w-[1px] bg-white/[0.025] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-[44px]">
        {/* Section header */}
        <div className="mb-14 lg:mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
          <div>
            <p className="font-tech text-blueprint text-[10px] tracking-[0.25em] uppercase mb-4">
              MANUFACTURING OPERATIONS // LIVE PLANT FOOTAGE
            </p>
            <h2 className="font-sans font-bold text-white text-3xl lg:text-[42px] leading-tight tracking-[-1px] uppercase">
              SEE THE FLOOR.<br />TRUST THE PROCESS.
            </h2>
          </div>
          <div className="lg:text-right">
            <p className="font-tech text-xs text-blueprint-dim tracking-wider uppercase leading-relaxed max-w-xl lg:ml-auto">
              INSIDE OUR 1,20,000 SQ.FT PLANT NETWORK IN HYDERABAD — WHERE MARAGING STEEL BILLETS BECOME FLIGHT-QUALIFIED MISSION HARDWARE FOR INDIA'S LAUNCH VEHICLES AND STRATEGIC MISSILE SYSTEMS.
            </p>
          </div>
        </div>

        {/* Terminal-style video player */}
        <div className="relative border border-white/[0.08] bg-[#0a0a0a] rounded-[2px] overflow-hidden">
          {/* Terminal top bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-[#0d0f12]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>
              <span className="font-tech text-[10px] tracking-widest text-blueprint-dim uppercase ml-2">
                SVAPL PLANT FEED // UNIT-II SHOP FLOOR // REAL-TIME CAPTURE
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_4px_#ef4444]" />
                <span className="font-tech text-[9px] tracking-wider text-red-400 uppercase">LIVE</span>
              </span>
              <span className="font-tech text-[9px] tracking-wider text-blueprint-dim uppercase hidden sm:block">
                CALIBRATION: ACTIVE
              </span>
            </div>
          </div>

          {/* Video area */}
          <div className="relative aspect-video bg-[#080808] group">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover brightness-75 contrast-110"
            >
              {/* Real SVAPL plant footage */}
              <source
                src={videoSrc}
                type="video/mp4"
              />
            </video>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />

            {/* Blueprint scan-line animation */}
            <div
              className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
              style={{
                background: "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(255,255,255,0.4) 3px, rgba(255,255,255,0.4) 4px)",
              }}
            />

            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-blueprint/60 pointer-events-none z-20" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-blueprint/60 pointer-events-none z-20" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-blueprint/60 pointer-events-none z-20" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-blueprint/60 pointer-events-none z-20" />

            {/* HUD Telemetry overlays */}
            <div className="absolute top-6 left-6 flex flex-col gap-1 z-20 pointer-events-none">
              <div className="bg-black/70 border border-white/[0.08] px-3 py-1.5 font-tech text-[9px] tracking-wider text-blueprint">
                SYS_CAM_01 // SHOP_FLOOR_VIEW // UNIT_II
              </div>
            </div>

            {/* Bottom right technical data */}
            <div className="absolute bottom-6 right-6 flex flex-col items-end gap-1.5 z-20 pointer-events-none">
              <div className="bg-black/70 border border-white/[0.08] px-3 py-1 font-tech text-[9px] text-blueprint-dim tracking-wider">
                FACILITY: UNIT-II // MAHESHWARAM, HYD
              </div>
              <div className="bg-black/70 border border-white/[0.08] px-3 py-1 font-tech text-[9px] text-verified tracking-wider">
                ACTIVE MACHINE COUNT: 18 // STATUS: OPERATIONAL
              </div>
            </div>

            {/* Play/Mute control buttons */}
            <div className="absolute bottom-6 left-6 flex items-center gap-3 z-20">
              <button
                onClick={togglePlay}
                className="w-9 h-9 flex items-center justify-center bg-black/70 border border-white/[0.1] hover:border-blueprint/40 hover:bg-[#0d0f12] transition-all duration-300 focus:outline-none group"
                aria-label={playing ? "Pause video" : "Play video"}
              >
                {playing ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="2" y="1" width="3" height="10" rx="0.5" fill="#8E95A5" />
                    <rect x="7" y="1" width="3" height="10" rx="0.5" fill="#8E95A5" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 1.5L10.5 6L2.5 10.5V1.5Z" fill="#8E95A5" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setMuted(!muted)}
                className="w-9 h-9 flex items-center justify-center bg-black/70 border border-white/[0.1] hover:border-blueprint/40 hover:bg-[#0d0f12] transition-all duration-300 focus:outline-none"
                aria-label={muted ? "Unmute video" : "Mute video"}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  {muted ? (
                    <>
                      <path d="M7 2L3.5 5H1v4h2.5L7 12V2Z" fill="#8E95A5" />
                      <line x1="9" y1="5" x2="13" y2="9" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="13" y1="5" x2="9" y2="9" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      <path d="M7 2L3.5 5H1v4h2.5L7 12V2Z" fill="#ff7700" />
                      <path d="M9.5 4.5C10.5 5.3 11 6.1 11 7C11 7.9 10.5 8.7 9.5 9.5" stroke="#ff7700" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                    </>
                  )}
                </svg>
              </button>
              <span className="font-tech text-[9px] text-blueprint-dim tracking-wider uppercase">
                {playing ? "STREAMING" : "PAUSED"}
              </span>
            </div>
          </div>

          {/* Bottom telemetry bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/[0.06] border-t border-white/[0.06] bg-[#0a0a0a]">
            {[
              { label: "ACTIVE MACHINES", val: "18 UNITS" },
              { label: "SHOP TEMP", val: "22°C CONTROLLED" },
              { label: "CLEANROOM CLASS", val: "ISO CLASS 7" },
              { label: "SHIFT STATUS", val: "3-SHIFT / 24H OPS" },
            ].map((m) => (
              <div key={m.label} className="px-5 py-4 flex flex-col gap-1">
                <span className="font-tech text-[8px] tracking-widest text-blueprint-dim uppercase">
                  {m.label}
                </span>
                <span className="font-tech text-[11px] tracking-wider text-white font-semibold uppercase">
                  {m.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
