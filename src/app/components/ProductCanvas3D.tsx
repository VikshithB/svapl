import { useEffect, useRef, useState } from "react";

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
  modelName: "impeller" | "casing" | "nozzle" | "bracket";
}

export function ProductCanvas3D({ modelName }: ProductCanvas3DProps) {
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

      if (model === "impeller") {
        // 1. Core axle hub
        const hub1 = addCircle(20, -50, 12, "axle");
        const hub2 = addCircle(20, 50, 12, "axle");
        connectCircles(hub1, hub2, 12);

        // 2. Base flange disk
        const base1 = addCircle(85, -20, 24, "shroud");
        const base2 = addCircle(85, -10, 24, "shroud");
        connectCircles(base1, base2, 24);

        // 3. Twisted Blades
        const bladeCount = 12;
        const spanSteps = 6;
        for (let b = 0; b < bladeCount; b++) {
          const baseAngle = (b / bladeCount) * Math.PI * 2;
          const bladeIndices: number[] = [];

          for (let s = 0; s < spanSteps; s++) {
            const t = s / (spanSteps - 1);
            const r = 20 + t * (85 - 20);
            const angle = baseAngle + t * 0.45; // Twist factor
            const z = -20 * (1 - t) + 30 * t;    // Slope height

            const idx = vertices.length;
            vertices.push({
              x: Math.cos(angle) * r,
              y: Math.sin(angle) * r,
              z,
              type: "blade",
            });
            bladeIndices.push(idx);

            if (s > 0) {
              edges.push([bladeIndices[s - 1], idx]);
            }
          }
          // Connect root of blade to hub
          const hubIdx = hub1 + Math.round((baseAngle / (Math.PI * 2)) * 12) % 12;
          edges.push([hubIdx, bladeIndices[0]]);
        }
      } else if (model === "casing") {
        // Rocket Motor Case Cylinder
        const segments = 16;
        const ringCount = 8;
        const ringSpacing = 24;
        const ringIndices: number[] = [];

        // Cylinder rings
        for (let r = 0; r < ringCount; r++) {
          const z = -84 + r * ringSpacing;
          const idx = addCircle(42, z, segments, "casing_body");
          ringIndices.push(idx);
        }

        // Connect cylinder longitudinal lines
        for (let r = 0; r < ringCount - 1; r++) {
          const start1 = ringIndices[r];
          const start2 = ringIndices[r + 1];
          for (let i = 0; i < segments; i++) {
            edges.push([start1 + i, start1 + ((i + 1) % segments)]);
            edges.push([start1 + i, start2 + i]);
          }
        }
        // Last ring circle connection
        const lastStart = ringIndices[ringCount - 1];
        for (let i = 0; i < segments; i++) {
          edges.push([lastStart + i, lastStart + ((i + 1) % segments)]);
        }

        // Domed end caps (Hemispherical outlines)
        const capSteps = 3;
        const capRad = 42;
        
        // Left Cap (z < -84)
        let prevLeftCircle = ringIndices[0];
        for (let c = 1; c <= capSteps; c++) {
          const t = c / capSteps; // 0 to 1
          const z = -84 - Math.sin(t * Math.PI / 2) * 20;
          const r = Math.cos(t * Math.PI / 2) * capRad;
          
          if (r > 2) {
            const nextLeft = addCircle(r, z, segments, "dome");
            for (let i = 0; i < segments; i++) {
              edges.push([nextLeft + i, nextLeft + ((i + 1) % segments)]);
              edges.push([prevLeftCircle + i, nextLeft + i]);
            }
            prevLeftCircle = nextLeft;
          }
        }

        // Right Cap (z > 84)
        let prevRightCircle = ringIndices[ringCount - 1];
        for (let c = 1; c <= capSteps; c++) {
          const t = c / capSteps;
          const z = 84 + Math.sin(t * Math.PI / 2) * 20;
          const r = Math.cos(t * Math.PI / 2) * capRad;
          
          if (r > 2) {
            const nextRight = addCircle(r, z, segments, "dome");
            for (let i = 0; i < segments; i++) {
              edges.push([nextRight + i, nextRight + ((i + 1) % segments)]);
              edges.push([prevRightCircle + i, nextRight + i]);
            }
            prevRightCircle = nextRight;
          }
        }

        // Reinforcing Flanges
        const flange1 = addCircle(52, -50, segments, "flange");
        const flange2 = addCircle(52, 50, segments, "flange");
        for (let i = 0; i < segments; i++) {
          edges.push([flange1 + i, flange1 + ((i + 1) % segments)]);
          edges.push([flange2 + i, flange2 + ((i + 1) % segments)]);
        }
      } else if (model === "nozzle") {
        // Cryogenic Nozzle - Converging / Diverging shape
        const segments = 16;
        const steps = 12;
        const ringIndices: number[] = [];

        for (let s = 0; s < steps; s++) {
          const t = s / (steps - 1); // 0 to 1
          const z = -80 + t * 160;    // -80 to +80
          
          // Nozzle radius equation (throat at z = -20)
          // Combustor entrance is wide, narrows down to throat, expands widely at exit
          const zNorm = (z + 20) / 80; // throat at z=-20 -> zNorm = 0
          let r = 24 + zNorm * zNorm * 38;
          if (z < -20) {
            // Converging side (steeper curve)
            r = 24 + Math.pow((z + 20) / 60, 2) * 32;
          }
          
          const idx = addCircle(r, z, segments, "nozzle_contour");
          ringIndices.push(idx);
        }

        // Connect contour rings
        for (let s = 0; s < steps - 1; s++) {
          const start1 = ringIndices[s];
          const start2 = ringIndices[s + 1];
          for (let i = 0; i < segments; i++) {
            edges.push([start1 + i, start1 + ((i + 1) % segments)]);
            edges.push([start1 + i, start2 + i]);
          }
        }
        const lastStart = ringIndices[steps - 1];
        for (let i = 0; i < segments; i++) {
          edges.push([lastStart + i, lastStart + ((i + 1) % segments)]);
        }

        // Coolant pipes wraps (spiral helical tubes around throat)
        const helixCoils = 4;
        const helixPoints = 48;
        const helixIndices: number[] = [];
        for (let h = 0; h < helixPoints; h++) {
          const t = h / (helixPoints - 1);
          const z = -45 + t * 75; // coil region
          const theta = t * Math.PI * 2 * helixCoils;
          
          const zNorm = (z + 20) / 80;
          const r = (24 + zNorm * zNorm * 38) + 2.5; // Slightly offset outside contour

          const idx = vertices.length;
          vertices.push({
            x: Math.cos(theta) * r,
            y: Math.sin(theta) * r,
            z,
            type: "helix",
          });
          helixIndices.push(idx);
          if (h > 0) {
            edges.push([helixIndices[h - 1], idx]);
          }
        }
      } else if (model === "bracket") {
        // Machined Aerostructure Bracket base + upright structure
        // Base plate corners
        const baseStart = vertices.length;
        // z = -30 to 30, x = -60 to 60, y = 15 to 30
        const pts = [
          { x: -60, y: 15, z: -30 }, { x: 60, y: 15, z: -30 },
          { x: 60, y: 15, z: 30 }, { x: -60, y: 15, z: 30 },
          { x: -60, y: 30, z: -30 }, { x: 60, y: 30, z: -30 },
          { x: 60, y: 30, z: 30 }, { x: -60, y: 30, z: 30 }
        ];
        pts.forEach(p => vertices.push({ ...p, type: "base_plate" }));

        // Plate edges
        edges.push([baseStart, baseStart + 1], [baseStart + 1, baseStart + 2], [baseStart + 2, baseStart + 3], [baseStart + 3, baseStart]);
        edges.push([baseStart + 4, baseStart + 5], [baseStart + 5, baseStart + 6], [baseStart + 6, baseStart + 7], [baseStart + 7, baseStart + 4]);
        edges.push([baseStart, baseStart + 4], [baseStart + 1, baseStart + 5], [baseStart + 2, baseStart + 6], [baseStart + 3, baseStart + 7]);

        // Upright ribs (triangle bracket ear in the center)
        const earStart = vertices.length;
        const earPts = [
          { x: -16, y: 15, z: -15 }, { x: 16, y: 15, z: -15 },
          { x: 16, y: 15, z: 15 }, { x: -16, y: 15, z: 15 },
          { x: -16, y: -45, z: -15 }, { x: 16, y: -45, z: -15 },
          { x: 16, y: -45, z: 15 }, { x: -16, y: -45, z: 15 }
        ];
        earPts.forEach(p => vertices.push({ ...p, type: "upright" }));
        edges.push([earStart, earStart + 1], [earStart + 1, earStart + 2], [earStart + 2, earStart + 3], [earStart + 3, earStart]);
        edges.push([earStart + 4, earStart + 5], [earStart + 5, earStart + 6], [earStart + 6, earStart + 7], [earStart + 7, earStart + 4]);
        edges.push([earStart, earStart + 4], [earStart + 1, earStart + 5], [earStart + 2, earStart + 6], [earStart + 3, earStart + 7]);

        // Circular mounting hole inside the upright ear (extruded along z-axis from -15 to 15)
        const holeSegments = 8;
        const holeY = -15;
        const holeRadius = 10;
        
        const holeIdx1 = addCircle(holeRadius, -15, holeSegments, "hole_contour");
        // Re-map vertices positions for standard coordinate alignment
        for (let i = 0; i < holeSegments; i++) {
          const idx = holeIdx1 + i;
          const theta = (i / holeSegments) * Math.PI * 2;
          vertices[idx].x = Math.cos(theta) * holeRadius;
          vertices[idx].y = holeY + Math.sin(theta) * holeRadius;
          vertices[idx].z = -15.1;
        }

        const holeIdx2 = addCircle(holeRadius, 15, holeSegments, "hole_contour");
        for (let i = 0; i < holeSegments; i++) {
          const idx = holeIdx2 + i;
          const theta = (i / holeSegments) * Math.PI * 2;
          vertices[idx].x = Math.cos(theta) * holeRadius;
          vertices[idx].y = holeY + Math.sin(theta) * holeRadius;
          vertices[idx].z = 15.1;
        }

        // Connect hole circles
        for (let i = 0; i < holeSegments; i++) {
          edges.push([holeIdx1 + i, holeIdx1 + ((i + 1) % holeSegments)]);
          edges.push([holeIdx2 + i, holeIdx2 + ((i + 1) % holeSegments)]);
          edges.push([holeIdx1 + i, holeIdx2 + i]);
        }
      }

      return { vertices, edges };
    };

    const geom = getGeometry(modelName);
    const vertices = geom.vertices;
    const edges = geom.edges;

    const render = () => {
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

      // Draw Edges
      for (let i = 0; i < edges.length; i++) {
        const [idxA, idxB] = edges[i];
        const pA = projected[idxA];
        const pB = projected[idxB];

        if (!pA || !pB) continue;

        const avgDepth = (pA.zDepth + pB.zDepth) / 2;
        const normalizedDepth = (avgDepth + 100) / 200; // 0 to 1
        const alpha = Math.max(0.08, 0.90 - normalizedDepth * 0.82);

        let strokeColor = `rgba(255, 119, 0, ${alpha})`;
        let lineWidth = 1;

        // Custom styling by node type
        if (pA.type === "axle" || pB.type === "axle") {
          strokeColor = `rgba(69, 162, 158, ${alpha * 0.8})`; // Silver-green for shaft core
          lineWidth = 0.8;
        } else if (pA.type === "helix") {
          strokeColor = `rgba(69, 162, 158, ${alpha * 0.95})`; // Coolant pipes
          lineWidth = 1.0;
        } else if (pA.type === "hole_contour") {
          strokeColor = `rgba(255, 119, 0, ${alpha * 1.3})`;
          lineWidth = 1.25;
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

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
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
