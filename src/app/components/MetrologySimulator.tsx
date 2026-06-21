import { useEffect, useRef, useState } from "react";

interface Point2D {
  x: number;
  y: number;
  label: string;
}

// Normalized coordinate shape (relative to a 400x400 design canvas)
const BLUEPRINT_POINTS: Point2D[] = [
  { x: 100, y: 80, label: "P01_UPPER_FLANGE_OD" },
  { x: 150, y: 80, label: "P02_UPPER_FLANGE_ID" },
  { x: 150, y: 140, label: "P03_NECK_CYLINDER" },
  { x: 260, y: 220, label: "P04_CONE_TRANSITION" },
  { x: 260, y: 290, label: "P05_BASE_CYLINDER" },
  { x: 300, y: 290, label: "P06_LOWER_FLANGE_OD" },
  { x: 300, y: 320, label: "P07_LOWER_FLANGE_BASE" },
  { x: 100, y: 320, label: "P08_INTERNAL_BORE" },
  { x: 100, y: 200, label: "P09_THROAT_BORE" },
  { x: 80, y: 140, label: "P10_SHELL_INTERCEPT" },
];

export function MetrologySimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [telemetry, setTelemetry] = useState({
    node: "SYS_INITIALIZING",
    x: 0,
    y: 0,
    dev: 0.000,
    status: "STANDBY",
  });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleMotionChange);
    return () => mediaQuery.removeEventListener("change", handleMotionChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Handle resizing to container
    const resize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.width; // Keep it square
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize);

    // Simulation variables
    let currentIdx = 0;
    let targetIdx = 1;
    let progress = 0; // 0 to 1 between current and target
    let pauseCounter = 0;
    const speed = 0.02; // Interpolation step rate

    // Telemetry and feedback ripples
    let ripples: { x: number; y: number; size: number; alpha: number }[] = [];

    // Scale coordinates from normalized 400x400 space to canvas layout space (padding 40px)
    const getCanvasCoords = (pt: Point2D) => {
      const padding = 50;
      const scaleX = (width - padding * 2) / 400;
      const scaleY = (height - padding * 2) / 400;
      return {
        x: padding + pt.x * scaleX,
        y: padding + pt.y * scaleY,
      };
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw grid background
      ctx.strokeStyle = "rgba(255, 119, 0, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Symmetrical blueprint outline center reference line
      const midX = width / 2;
      ctx.strokeStyle = "rgba(142, 149, 165, 0.15)";
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(midX, 20);
      ctx.lineTo(midX, height - 20);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Draw Blueprint Outline Shape (Left side original, right side mirrored)
      const renderPartSide = (isMirrored: boolean) => {
        ctx.beginPath();
        BLUEPRINT_POINTS.forEach((pt, index) => {
          const coords = getCanvasCoords(pt);
          const drawX = isMirrored ? midX + (midX - coords.x) : coords.x;
          if (index === 0) {
            ctx.moveTo(drawX, coords.y);
          } else {
            ctx.lineTo(drawX, coords.y);
          }
        });
        ctx.closePath();
        ctx.strokeStyle = "rgba(142, 149, 165, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Fill with a very subtle blueprint gradient tint
        ctx.fillStyle = "rgba(255, 119, 0, 0.005)";
        ctx.fill();
      };

      renderPartSide(false); // Left profile
      renderPartSide(true);  // Symmetrical right profile

      // Draw all nodes as faint titanium crosshairs
      BLUEPRINT_POINTS.forEach((pt) => {
        const coords = getCanvasCoords(pt);
        const drawNodesSymmetrically = (xPos: number) => {
          ctx.strokeStyle = "rgba(142, 149, 165, 0.25)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(xPos - 5, coords.y);
          ctx.lineTo(xPos + 5, coords.y);
          ctx.moveTo(xPos, coords.y - 5);
          ctx.lineTo(xPos, coords.y + 5);
          ctx.stroke();

          // Tiny center dot
          ctx.fillStyle = "rgba(142, 149, 165, 0.5)";
          ctx.beginPath();
          ctx.arc(xPos, coords.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        };

        drawNodesSymmetrically(coords.x);
        drawNodesSymmetrically(midX + (midX - coords.x));
      });

      // 3. Interpolate Probe Position
      const p1 = getCanvasCoords(BLUEPRINT_POINTS[currentIdx]);
      const p2 = getCanvasCoords(BLUEPRINT_POINTS[targetIdx]);
      
      let probeX = p1.x;
      let probeY = p1.y;

      if (prefersReducedMotion) {
        // Just hover on the target point statically
        probeX = p2.x;
        probeY = p2.y;
      } else {
        if (pauseCounter > 0) {
          pauseCounter--;
          probeX = p1.x;
          probeY = p1.y;
        } else {
          progress += speed;
          if (progress >= 1) {
            // Hit! Trigger node touch
            progress = 0;
            currentIdx = targetIdx;
            targetIdx = (targetIdx + 1) % BLUEPRINT_POINTS.length;
            pauseCounter = 25; // Hold probe at point for 25 frames
            
            // Trigger feedback ripple
            ripples.push({ x: p2.x, y: p2.y, size: 2, alpha: 1 });

            // Generate slight deviation metric for realism (< 0.003mm deviation)
            const simulatedDev = +(Math.random() * 0.004).toFixed(4);

            setTelemetry({
              node: BLUEPRINT_POINTS[currentIdx].label,
              x: Math.round(BLUEPRINT_POINTS[currentIdx].x * 1.45),
              y: Math.round(BLUEPRINT_POINTS[currentIdx].y * 1.45),
              dev: simulatedDev,
              status: simulatedDev < 0.003 ? "CONFORMING" : "VERIFIED",
            });
          }

          // Cosine interpolation for organic ease-in/ease-out speed feel
          const t = (1 - Math.cos(progress * Math.PI)) / 2;
          probeX = p1.x + (p2.x - p1.x) * t;
          probeY = p1.y + (p2.y - p1.y) * t;
        }
      }

      // 4. Render ripples
      if (!prefersReducedMotion) {
        ripples.forEach((r, idx) => {
          r.size += 1.5;
          r.alpha -= 0.04;
          if (r.alpha <= 0) {
            ripples.splice(idx, 1);
            return;
          }
          ctx.strokeStyle = `rgba(255, 119, 0, ${r.alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.size, 0, Math.PI * 2);
          ctx.stroke();

          // Symmetrical ripple
          const symX = midX + (midX - r.x);
          ctx.beginPath();
          ctx.arc(symX, r.y, r.size, 0, Math.PI * 2);
          ctx.stroke();
        });
      }

      // 5. Draw metrology laser crosshairs tracking the probe
      ctx.strokeStyle = "rgba(255, 119, 0, 0.07)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      // Horizontal
      ctx.moveTo(20, probeY);
      ctx.lineTo(width - 20, probeY);
      // Vertical
      ctx.moveTo(probeX, 20);
      ctx.lineTo(probeX, height - 20);
      ctx.stroke();

      // Symmetrical crosshairs
      const symProbeX = midX + (midX - probeX);
      ctx.beginPath();
      ctx.moveTo(symProbeX, 20);
      ctx.lineTo(symProbeX, height - 20);
      ctx.stroke();

      // 6. Draw stylus arm & measurement probe
      // Draw Probe Head Stylus
      ctx.strokeStyle = "#ff7700";
      ctx.lineWidth = 1.5;
      
      // Stem line coming from top-left or relative top center
      ctx.beginPath();
      ctx.moveTo(midX, 20);
      ctx.lineTo(probeX, probeY);
      ctx.stroke();

      // Symmetrical stem line
      ctx.beginPath();
      ctx.moveTo(midX, 20);
      ctx.lineTo(symProbeX, probeY);
      ctx.stroke();

      // Probe Ruby Ball (Orange glowing tip)
      ctx.fillStyle = "#ff7700";
      ctx.beginPath();
      ctx.arc(probeX, probeY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Symmetrical probe Ruby Ball
      ctx.fillStyle = "#ff7700";
      ctx.beginPath();
      ctx.arc(symProbeX, probeY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Highlight active node if paused
      if (pauseCounter > 0 || prefersReducedMotion) {
        ctx.fillStyle = "#ff7700";
        ctx.beginPath();
        ctx.arc(probeX, probeY, 7, 0, Math.PI * 2);
        ctx.fill();

        // Label on canvas
        ctx.fillStyle = "#FFFFFF";
        ctx.font = 'bold 8px "IBM Plex Mono", monospace';
        ctx.fillText(
          `ACTIVE: ${BLUEPRINT_POINTS[currentIdx].label}`,
          probeX + 10,
          probeY - 8
        );
      }

      // 7. Corner blueprint brackets & markings
      ctx.strokeStyle = "rgba(142, 149, 165, 0.3)";
      ctx.lineWidth = 1;
      const corner = 15;
      
      // Top-left
      ctx.beginPath();
      ctx.moveTo(20, 20 + corner); ctx.lineTo(20, 20); ctx.lineTo(20 + corner, 20);
      ctx.stroke();
      // Top-right
      ctx.beginPath();
      ctx.moveTo(width - 20 - corner, 20); ctx.lineTo(width - 20, 20); ctx.lineTo(width - 20, 20 + corner);
      ctx.stroke();
      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(20, height - 20 - corner); ctx.lineTo(20, height - 20); ctx.lineTo(20 + corner, height - 20);
      ctx.stroke();
      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(width - 20 - corner, height - 20); ctx.lineTo(width - 20, height - 20); ctx.lineTo(width - 20, height - 20 - corner);
      ctx.stroke();

      // Scale indicator ticks
      ctx.fillStyle = "rgba(142, 149, 165, 0.4)";
      ctx.font = '8px "IBM Plex Mono", monospace';
      ctx.fillText("SCALE: 1:1.0", 25, height - 25);
      ctx.fillText("UNIT: MILLIMETERS (MM)", width - 130, height - 25);

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    if (prefersReducedMotion) {
      render();
    } else {
      render();
    }

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative w-full border border-white/[0.08] bg-[#0D0F12]/30 aspect-square select-none overflow-hidden"
    >
      <div className="absolute top-3 left-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-blueprint animate-ping" />
        <span className="font-tech text-[9px] text-blueprint tracking-widest uppercase font-bold">
          METROLOGY LOG: ONLINE
        </span>
      </div>

      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* Embedded Live telemetry overlay block */}
      <div className="absolute bottom-5 left-5 right-5 border border-white/[0.06] bg-[#050505]/95 p-3.5 flex flex-col gap-1.5 font-tech text-[10px] tracking-wider text-blueprint-dim">
        <div className="flex justify-between border-b border-white/[0.04] pb-1.5 mb-0.5">
          <span className="text-white font-bold uppercase tracking-widest">
            {telemetry.node}
          </span>
          <span className={`font-bold ${telemetry.status === "CONFORMING" ? "text-verified" : "text-blueprint"}`}>
            {telemetry.status}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-[9px]">
          <div>
            <span className="block text-white/40">COORD_X</span>
            <span className="text-white font-medium">{telemetry.x.toFixed(3)} mm</span>
          </div>
          <div>
            <span className="block text-white/40">COORD_Y</span>
            <span className="text-white font-medium">{telemetry.y.toFixed(3)} mm</span>
          </div>
          <div>
            <span className="block text-white/40">DEV_Z</span>
            <span className="text-blueprint font-bold">+{telemetry.dev.toFixed(4)} mm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
