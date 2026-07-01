import { useEffect, useRef, useState } from "react";
import { LVM3ModelViewer } from "./LVM3ModelViewer";
import { StabilizerFinModelViewer } from "./StabilizerFinModelViewer";
import { NoseCapModelViewer } from "./NoseCapModelViewer";

interface Point3D {
  x: number;
  y: number;
  z: number;
  type?: string;
}

interface Point2D {
  px: number;
  py: number;
  zDepth: number;
  type?: string;
}

interface ProductCanvas3DProps {
  modelName: "shroud" | "fin" | "nosecap" | "canister";
}

export function ProductCanvas3D({ modelName }: ProductCanvas3DProps) {
  if (modelName === "shroud")   return <LVM3ModelViewer />;
  if (modelName === "fin")      return <StabilizerFinModelViewer />;
  if (modelName === "nosecap")  return <NoseCapModelViewer />;
  return <WireframeCanvas modelName={modelName} />;
}

function WireframeCanvas({ modelName }: ProductCanvas3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0 });
  const rotationRef = useRef({ x: 0.5, y: 0.8, z: 0 });
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  // Handle drag to rotate
  const onMouseDown = (e: React.MouseEvent) => {
    dragRef.current.isDragging = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setCoords({ x, y });

    if (dragRef.current.isDragging) {
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      rotationRef.current.y += deltaX * 0.01;
      rotationRef.current.x += deltaY * 0.01;
      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;
    }
  };

  const onMouseUp = () => {
    dragRef.current.isDragging = false;
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      dragRef.current.isDragging = false;
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // ─── GEOMETRY GENERATOR ───
    const getGeometry = (model: string) => {
      const vertices: Point3D[] = [];
      const edges: [number, number][] = [];

      const addCircle = (r: number, z: number, segments: number, type?: string) => {
        const startIndex = vertices.length;
        for (let i = 0; i < segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          vertices.push({
            x: Math.cos(theta) * r,
            y: Math.sin(theta) * r,
            z,
            type,
          });
        }
        return startIndex;
      };

      const connectCircles = (start1: number, start2: number, segments: number) => {
        for (let i = 0; i < segments; i++) {
          edges.push([start1 + i, start1 + ((i + 1) % segments)]);
          edges.push([start2 + i, start2 + ((i + 1) % segments)]);
          edges.push([start1 + i, start2 + i]);
        }
      };

      if (model === "shroud") {
        // LVM3 Core Base Shroud — tapered cylinder (Ø4200mm, H3300mm) with
        // isogrid panel stiffening, top & bottom attachment flanges.
        const seg = 18;
        const zLevels = [-44, -30, -16, 0, 16, 30, 44];
        const radii   = [ 66,  63,  61, 58, 56, 54, 52]; // slight taper bottom→top

        const rings: number[] = [];
        for (let ri = 0; ri < zLevels.length; ri++) {
          rings.push(addCircle(radii[ri], zLevels[ri], seg, "skin"));
        }

        // Circumferential rings
        for (let ri = 0; ri < rings.length; ri++) {
          for (let i = 0; i < seg; i++)
            edges.push([rings[ri] + i, rings[ri] + ((i + 1) % seg)]);
        }

        // Vertical longerons every 3 segments (6 total)
        for (let i = 0; i < seg; i += 3) {
          for (let ri = 0; ri < rings.length - 1; ri++)
            edges.push([rings[ri] + i, rings[ri + 1] + i]);
        }

        // Isogrid diagonals — forward & back between consecutive rings
        for (let ri = 0; ri < rings.length - 1; ri++) {
          for (let i = 0; i < seg; i++) {
            edges.push([rings[ri] + i, rings[ri + 1] + ((i + 1) % seg)]);
            if (i % 2 === 0)
              edges.push([rings[ri] + i, rings[ri + 1] + ((i + seg - 1) % seg)]);
          }
        }

        // Bottom attachment flange (wider lip)
        const botFlange = addCircle(78, -44, seg, "flange");
        for (let i = 0; i < seg; i++) {
          edges.push([botFlange + i, botFlange + ((i + 1) % seg)]);
          if (i % 3 === 0) edges.push([botFlange + i, rings[0] + i]);
        }

        // Top attachment flange
        const topFlange = addCircle(60, 44, seg, "flange");
        for (let i = 0; i < seg; i++) {
          edges.push([topFlange + i, topFlange + ((i + 1) % seg)]);
          if (i % 3 === 0) edges.push([topFlange + i, rings[rings.length - 1] + i]);
        }

      } else if (model === "fin") {
        // Stabilizer Fin Assembly — swept trapezoidal fin (H500, L800mm).
        // Spans in Y; chord in X; thickness ±Z.
        // Root (y=-42): chord x∈[-44,38]. Tip (y=44): chord x∈[-8,22], swept LE.
        const th = 7; // half-thickness

        // Root & tip section corners
        const rootPts = [
          { x: -44, y: -42, z: -th }, { x: 38, y: -42, z: -th },
          { x: 38, y: -42, z:  th }, { x: -44, y: -42, z:  th },
        ];
        const tipPts = [
          { x: -8, y: 44, z: -th }, { x: 22, y: 44, z: -th },
          { x: 22, y: 44, z:  th }, { x:  -8, y: 44, z:  th },
        ];
        const rootStart = vertices.length;
        rootPts.forEach(p => vertices.push({ ...p, type: "fin_skin" }));
        const tipStart = vertices.length;
        tipPts.forEach(p => vertices.push({ ...p, type: "fin_skin" }));

        for (let i = 0; i < 4; i++) {
          edges.push([rootStart + i, rootStart + (i + 1) % 4]);
          edges.push([tipStart + i, tipStart + (i + 1) % 4]);
          edges.push([rootStart + i, tipStart + i]);
        }

        // 4 internal spars running spanwise
        const sparXFracs = [0.08, 0.32, 0.58, 0.84];
        for (const frac of sparXFracs) {
          const rx = -44 + frac * 82;
          const tx = -8  + frac * 30;
          const s0 = vertices.length;
          vertices.push({ x: rx, y: -42, z: -th + 1, type: "spar" });
          vertices.push({ x: rx, y: -42, z:  th - 1, type: "spar" });
          vertices.push({ x: tx, y:  44, z: -th + 1, type: "spar" });
          vertices.push({ x: tx, y:  44, z:  th - 1, type: "spar" });
          edges.push([s0, s0+2], [s0+1, s0+3], [s0, s0+1], [s0+2, s0+3]);
        }

        // 3 internal ribs at span fractions
        for (const yFrac of [0.25, 0.55, 0.80]) {
          const ry = -42 + yFrac * 86;
          const le = -44 + yFrac * 36;
          const te =  38 - yFrac * 16;
          const r0 = vertices.length;
          [
            { x: le, y: ry, z: -th }, { x: te, y: ry, z: -th },
            { x: te, y: ry, z:  th }, { x: le, y: ry, z:  th },
          ].forEach(p => vertices.push({ ...p, type: "rib" }));
          for (let i = 0; i < 4; i++) edges.push([r0 + i, r0 + (i + 1) % 4]);
        }

        // Root mounting lugs (3 tabs below the root chord)
        for (const lx of [-28, -2, 22]) {
          const l0 = vertices.length;
          [
            { x: lx-5, y:-42, z:-12 }, { x: lx+5, y:-42, z:-12 },
            { x: lx+5, y:-58, z:-12 }, { x: lx-5, y:-58, z:-12 },
            { x: lx-5, y:-42, z: 12 }, { x: lx+5, y:-42, z: 12 },
            { x: lx+5, y:-58, z: 12 }, { x: lx-5, y:-58, z: 12 },
          ].forEach(p => vertices.push({ ...p, type: "lug" }));
          edges.push(
            [l0,l0+1],[l0+1,l0+2],[l0+2,l0+3],[l0+3,l0],
            [l0+4,l0+5],[l0+5,l0+6],[l0+6,l0+7],[l0+7,l0+4],
            [l0,l0+4],[l0+1,l0+5],[l0+2,l0+6],[l0+3,l0+7],
          );
        }

      } else if (model === "canister") {
        // Metal Canister — extremely elongated cylinder (Ø1300, L9000mm → ~7:1).
        // Body rings, 4 longerons, domed end caps, stiffening collars, external lugs.
        const seg = 12;
        const R = 18;
        const L = 150;
        const nRings = 10;

        const rings: number[] = [];
        for (let ri = 0; ri < nRings; ri++) {
          const z = -L/2 + ri * (L / (nRings - 1));
          const ring = addCircle(R, z, seg, "body");
          rings.push(ring);
          for (let i = 0; i < seg; i++)
            edges.push([ring+i, ring+((i+1)%seg)]);
        }

        // 4 longerons (at 0°, 90°, 180°, 270°)
        for (const pos of [0, 3, 6, 9]) {
          for (let ri = 0; ri < nRings - 1; ri++)
            edges.push([rings[ri]+pos, rings[ri+1]+pos]);
        }

        // Domed end caps — 3 shrinking rings each side
        const capSteps = [0.82, 0.50, 0.22];
        let prevL = rings[0], prevR = rings[nRings-1];
        capSteps.forEach((frac, ci) => {
          const dz = 6 + ci * 4;
          const cL = addCircle(R * frac, -L/2 - dz, seg, "dome");
          const cR = addCircle(R * frac,  L/2 + dz, seg, "dome");
          for (let i = 0; i < seg; i++) {
            edges.push([cL+i, cL+((i+1)%seg)], [prevL+i, cL+i]);
            edges.push([cR+i, cR+((i+1)%seg)], [prevR+i, cR+i]);
          }
          prevL = cL; prevR = cR;
        });

        // Stiffening collars near each end
        const collar1 = addCircle(R + 5, -L/2 + 12, seg, "flange");
        const collar2 = addCircle(R + 5,  L/2 - 12, seg, "flange");
        for (let i = 0; i < seg; i++) {
          edges.push([collar1+i, collar1+((i+1)%seg)]);
          edges.push([collar2+i, collar2+((i+1)%seg)]);
        }

        // 3 external attachment lugs distributed along the length
        for (let l = 0; l < 3; l++) {
          const lz = -40 + l * 40;
          const ang = (l / 3) * Math.PI * 2;
          const lx = Math.cos(ang) * (R + 7);
          const ly = Math.sin(ang) * (R + 7);
          const l0 = vertices.length;
          vertices.push({ x: lx, y: ly, z: lz - 5, type: "lug" });
          vertices.push({ x: lx, y: ly, z: lz + 5, type: "lug" });
          const nearRing = rings[Math.round(l * (nRings-1) / 2)];
          const nearSeg = Math.round((ang / (Math.PI * 2)) * seg) % seg;
          edges.push([l0, l0+1], [l0, nearRing + nearSeg], [l0+1, nearRing + nearSeg]);
        }
      }

      return { vertices, edges };
    };

    const geom = getGeometry(modelName);
    const vertices = geom.vertices;
    const edges = geom.edges;

    // Pause when scrolled out of view
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    io.observe(canvas);

    // 30fps cap
    let lastTime = 0;
    const FRAME_MS = 1000 / 30;

    const render = (now: number) => {
      animationId = requestAnimationFrame(render);
      if (!visible || now - lastTime < FRAME_MS) return;
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Auto rotation when not dragging
      if (!dragRef.current.isDragging) {
        rotationRef.current.y += 0.004;
      }

      const rx = rotationRef.current.x;
      const ry = rotationRef.current.y;
      const rz = rotationRef.current.z;

      const cx = Math.cos(rx), sx = Math.sin(rx);
      const cy = Math.cos(ry), sy = Math.sin(ry);
      const cz = Math.cos(rz), sz = Math.sin(rz);

      const centerX = width / 2;
      const centerY = height / 2;
      const distance = 260; // Perspective focal depth
      
      const projected: Point2D[] = [];

      for (let i = 0; i < vertices.length; i++) {
        const p = vertices[i];
        
        // 3D rotations
        let y1 = p.y * cx - p.z * sx;
        let z1 = p.y * sx + p.z * cx;
        
        let x2 = p.x * cy + z1 * sy;
        let z2 = -p.x * sy + z1 * cy;
        
        let x3 = x2 * cz - y1 * sz;
        let y3 = x2 * sz + y1 * cz;

        const scaleFactor = distance / (distance + z2);
        const px = x3 * scaleFactor + centerX;
        const py = y3 * scaleFactor + centerY;

        projected.push({
          px,
          py,
          zDepth: z2,
          type: p.type,
        });
      }

      // Draw Background Tech Lines
      ctx.strokeStyle = "rgba(255, 119, 0, 0.04)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 150, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX - 170, centerY);
      ctx.lineTo(centerX - 150, centerY);
      ctx.moveTo(centerX + 150, centerY);
      ctx.lineTo(centerX + 170, centerY);
      ctx.moveTo(centerX, centerY - 170);
      ctx.lineTo(centerX, centerY - 150);
      ctx.moveTo(centerX, centerY + 150);
      ctx.lineTo(centerX, centerY + 170);
      ctx.stroke();

      // ── Studio lighting simulation ──────────────────────────────────────────
      // Key light direction in world space (upper-left-front, matching Three.js rig)
      const KLX = -4, KLY = 8, KLZ = 6;
      const klLen = Math.sqrt(KLX*KLX + KLY*KLY + KLZ*KLZ);
      const klNx = KLX/klLen, klNy = KLY/klLen, klNz = KLZ/klLen;

      // Rim light (behind-top)
      const RLX = 1, RLY = 10, RLZ = -8;
      const rlLen = Math.sqrt(RLX*RLX + RLY*RLY + RLZ*RLZ);
      const rlNx = RLX/rlLen, rlNy = RLY/rlLen, rlNz = RLZ/rlLen;

      // Draw Edges
      for (let i = 0; i < edges.length; i++) {
        const [idxA, idxB] = edges[i];
        const pA = projected[idxA];
        const pB = projected[idxB];
        if (!pA || !pB) continue;

        const vA = vertices[idxA];
        const vB = vertices[idxB];

        // Edge midpoint in world space (pre-rotation)
        const mx = (vA.x + vB.x) * 0.5;
        const my = (vA.y + vB.y) * 0.5;
        const mz = (vA.z + vB.z) * 0.5;
        const mLen = Math.sqrt(mx*mx + my*my + mz*mz) || 1;
        // Surface normal approximated as the outward radial direction from centroid
        const nx = mx/mLen, ny = my/mLen, nz = mz/mLen;

        // Rotate the normal the same way we rotated the vertices
        let ny1 = ny * cx - nz * sx;
        let nz1 = ny * sx + nz * cx;
        let nx2 = nx * cy + nz1 * sy;
        let nz2 = -nx * sy + nz1 * cy;
        let nx3 = nx2 * cz - ny1 * sz;
        let ny3 = nx2 * sz + ny1 * cz;

        // Lambert diffuse dot products (clamped to 0)
        const keyDot = Math.max(0, nx3*klNx + ny3*klNy + nz2*klNz);
        const rimDot = Math.max(0, nx3*rlNx + ny3*rlNy + nz2*rlNz);

        // Combined lighting: ambient + key + rim contribution
        const lit = 0.18 + keyDot * 0.65 + rimDot * 0.22;

        const avgDepth = (pA.zDepth + pB.zDepth) / 2;
        const normalizedDepth = (avgDepth + 100) / 200;
        // Depth fade still present but lighter — lighting does most of the work
        const depthFade = Math.max(0.55, 1.0 - normalizedDepth * 0.45);
        const alpha = Math.max(0.07, lit * depthFade);

        let strokeColor = `rgba(255, 119, 0, ${alpha})`;
        let lineWidth = 1;

        const ta = pA.type ?? "";
        const tb = pB.type ?? "";
        if (ta === "flange" || tb === "flange") {
          strokeColor = `rgba(255, 119, 0, ${Math.min(1, alpha * 1.35)})`;
          lineWidth = 1.4;
        } else if (ta === "spar" || tb === "spar" || ta === "hub" || tb === "hub") {
          strokeColor = `rgba(69, 162, 158, ${Math.min(1, alpha * 0.95)})`;
          lineWidth = 1.0;
        } else if (ta === "rib" || tb === "rib") {
          strokeColor = `rgba(69, 162, 158, ${Math.min(1, alpha * 0.75)})`;
          lineWidth = 0.8;
        } else if (ta === "thruster" || tb === "thruster") {
          // Thrusters catch the accent orange rim — brighter when rim-lit
          const thrusterAlpha = Math.max(0.15, 0.18 + keyDot * 0.55 + rimDot * 0.55);
          strokeColor = `rgba(255, 119, 0, ${Math.min(1, thrusterAlpha * depthFade)})`;
          lineWidth = 1.5;
        } else if (ta === "tank" || tb === "tank") {
          strokeColor = `rgba(69, 162, 158, ${Math.min(1, alpha * 0.9)})`;
          lineWidth = 0.9;
        } else if (ta === "spoke" || tb === "spoke") {
          strokeColor = `rgba(255, 119, 0, ${Math.min(1, alpha * 0.7)})`;
          lineWidth = 0.7;
        } else if (ta === "lug" || tb === "lug") {
          strokeColor = `rgba(255, 119, 0, ${Math.min(1, alpha * 1.2)})`;
          lineWidth = 1.2;
        } else if (ta === "dome" || tb === "dome") {
          strokeColor = `rgba(255, 119, 0, ${Math.min(1, alpha * 0.65)})`;
          lineWidth = 0.7;
        }

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(pA.px, pA.py);
        ctx.lineTo(pB.px, pB.py);
        ctx.stroke();
      }

      // Draw tiny calibration stats at the bottom
      ctx.fillStyle = "rgba(142, 149, 165, 0.4)";
      ctx.font = "8px monospace";
      ctx.fillText(`ROT-X: ${rx.toFixed(2)}RAD // ROT-Y: ${ry.toFixed(2)}RAD`, centerX - 90, height - 15);

    };

    requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
      io.disconnect();
    };
  }, [modelName]);

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        dragRef.current.isDragging = false;
      }}
      className="relative w-full aspect-[4/3] bg-[#0d0f12]/30 border border-white/[0.06] rounded-[2px] overflow-hidden group select-none cursor-grab active:cursor-grabbing"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Blueprint details */}
      <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t border-l border-blueprint/40 pointer-events-none" />
      <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t border-r border-blueprint/40 pointer-events-none" />
      <div className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b border-l border-blueprint/40 pointer-events-none" />
      <div className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b border-r border-blueprint/40 pointer-events-none" />

      {/* Interactive cursor grid lines */}
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
            className="absolute font-tech text-[8px] text-blueprint/55 bg-[#050505]/95 border border-white/[0.05] px-1.5 py-0.5 pointer-events-none z-20"
            style={{
              left: `${coords.x + 10}px`,
              top: `${coords.y + 10}px`,
            }}
          >
            METROLOGY_CURSOR: {coords.x}PX // {coords.y}PX
          </div>
        </>
      )}

      {/* HUD status labels */}
      <div className="absolute top-4 left-4 bg-black/60 border border-white/[0.05] px-2 py-0.5 font-tech text-[8px] text-blueprint tracking-wider">
        SYS_LOG: MODEL_PREVIEW_3D
      </div>
      <div className="absolute top-4 right-4 bg-black/60 border border-white/[0.05] px-2 py-0.5 font-tech text-[8px] text-verified tracking-wider animate-pulse">
        RENDERER: DIRECT_CANVAS_OK
      </div>
    </div>
  );
}
