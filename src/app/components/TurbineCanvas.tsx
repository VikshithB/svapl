import { useEffect, useRef } from "react";

export function TurbineCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotYRef = useRef<HTMLSpanElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const rotationRef = useRef({ x: 0.5, y: 0.8, z: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    // Resize handler
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

    // Mouse interactive tracker
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current.targetX = x * 1.5;
      mouseRef.current.targetY = y * 1.5;
    };

    window.addEventListener("mousemove", onMouseMove);

    // Generate 3D Turbine Geometry
    interface Point3D {
      x: number;
      y: number;
      z: number;
      type?: string;
    }
    const vertices: Point3D[] = [];
    const edges: [number, number][] = [];

    // Helper: Add circle vertices and return the indices
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

    // Helper: Connect two circles of same size
    const connectCircles = (start1: number, start2: number, segments: number) => {
      for (let i = 0; i < segments; i++) {
        // Round circle connections
        edges.push([start1 + i, start1 + ((i + 1) % segments)]);
        edges.push([start2 + i, start2 + ((i + 1) % segments)]);
        // Longitudinal connections
        edges.push([start1 + i, start2 + i]);
      }
    };

    // 1. Central Axle/Shaft
    const shaft1 = addCircle(12, -140, 8, "axle");
    const shaft2 = addCircle(12, 140, 8, "axle");
    connectCircles(shaft1, shaft2, 8);

    // 2. Hub (inner ring)
    const hub1 = addCircle(35, -50, 16, "hub");
    const hub2 = addCircle(35, 50, 16, "hub");
    connectCircles(hub1, hub2, 16);

    // 3. Shroud (outer ring)
    const shroud1 = addCircle(110, -25, 32, "shroud");
    const shroud2 = addCircle(110, 25, 32, "shroud");
    connectCircles(shroud1, shroud2, 32);

    // 4. Turbine Blades (16 blades)
    const bladeCount = 16;
    for (let b = 0; b < bladeCount; b++) {
      const baseAngle = (b / bladeCount) * Math.PI * 2;

      // Each blade is a set of lines from Hub to Shroud
      // Let's create points along the span of the blade
      const spanSteps = 5;
      const bladeIndices: number[] = [];

      for (let s = 0; s < spanSteps; s++) {
        const t = s / (spanSteps - 1);
        const radius = 35 + t * (110 - 35);
        // Add twist (angle change) and pitch (z change)
        const angle = baseAngle + t * 0.35;
        const z = -35 * (1 - t) + 15 * t;

        // Front edge of blade
        const idxFront = vertices.length;
        vertices.push({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          z: z - 4 * (1 - t),
          type: "blade",
        });
        bladeIndices.push(idxFront);

        // Connect along the span
        if (s > 0) {
          edges.push([bladeIndices[s - 1], idxFront]);
        }
      }

      // Also connect the blade root to the hub, and tip to the shroud
      const hubIdx = hub1 + Math.round((baseAngle / (Math.PI * 2)) * 16) % 16;
      edges.push([hubIdx, bladeIndices[0]]);
      
      const shroudIdx = shroud1 + Math.round(((baseAngle + 0.35) / (Math.PI * 2)) * 32) % 32;
      edges.push([shroudIdx, bladeIndices[spanSteps - 1]]);
    }

    // 5. Outer Mounting Bracket Ears (4 ears on the shroud)
    const bracketCount = 4;
    for (let br = 0; br < bracketCount; br++) {
      const angle = (br / bracketCount) * Math.PI * 2;
      const zOffset = 0;
      
      // Points for a bracket ear projecting outward
      const bIdxStart = vertices.length;
      
      // Corner points of ear
      vertices.push({
        x: Math.cos(angle - 0.12) * 110,
        y: Math.sin(angle - 0.12) * 110,
        z: zOffset,
        type: "bracket",
      });
      vertices.push({
        x: Math.cos(angle - 0.08) * 135,
        y: Math.sin(angle - 0.08) * 135,
        z: zOffset - 5,
        type: "bracket",
      });
      vertices.push({
        x: Math.cos(angle + 0.08) * 135,
        y: Math.sin(angle + 0.08) * 135,
        z: zOffset - 5,
        type: "bracket",
      });
      vertices.push({
        x: Math.cos(angle + 0.12) * 110,
        y: Math.sin(angle + 0.12) * 110,
        z: zOffset,
        type: "bracket",
      });

      // Connect bracket outline
      edges.push([bIdxStart, bIdxStart + 1]);
      edges.push([bIdxStart + 1, bIdxStart + 2]);
      edges.push([bIdxStart + 2, bIdxStart + 3]);

      // Draw a mounting hole inside the bracket
      const holeStart = vertices.length;
      const holeRadius = 5;
      const holeCenterX = Math.cos(angle) * 126;
      const holeCenterY = Math.sin(angle) * 126;
      const holeSegments = 8;
      
      for (let h = 0; h < holeSegments; h++) {
        const hTheta = (h / holeSegments) * Math.PI * 2;
        vertices.push({
          x: holeCenterX + Math.cos(hTheta) * holeRadius,
          y: holeCenterY + Math.sin(hTheta) * holeRadius,
          z: zOffset - 2,
          type: "hole",
        });
      }
      for (let h = 0; h < holeSegments; h++) {
        edges.push([holeStart + h, holeStart + ((h + 1) % holeSegments)]);
      }
    }

    // Render loop
    const render = () => {
      // Clear with background color or transparent
      ctx.clearRect(0, 0, width, height);

      // Smoothly interpolate mouse tilt offset
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Slow rotation over time
      rotationRef.current.y += 0.003;
      rotationRef.current.x = 0.4 + mouse.y * 0.4;
      rotationRef.current.y += mouse.x * 0.02;

      const rx = rotationRef.current.x;
      const ry = rotationRef.current.y;
      const rz = rotationRef.current.z;

      if (rotYRef.current) {
        rotYRef.current.textContent = `ROT-Y: ${ry.toFixed(3)}RAD`;
      }

      const cx = Math.cos(rx), sx = Math.sin(rx);
      const cy = Math.cos(ry), sy = Math.sin(ry);
      const cz = Math.cos(rz), sz = Math.sin(rz);

      const centerX = width / 2;
      const centerY = height / 2;
      const distance = 300; // Perspective focal depth
      
      // Project all vertices
      interface ProjectedPoint {
        px: number;
        py: number;
        zDepth: number;
        type?: string;
      }
      const projected: ProjectedPoint[] = [];

      for (let i = 0; i < vertices.length; i++) {
        const p = vertices[i];
        
        // 3D Rotations
        // X-axis
        let y1 = p.y * cx - p.z * sx;
        let z1 = p.y * sx + p.z * cx;
        
        // Y-axis
        let x2 = p.x * cy + z1 * sy;
        let z2 = -p.x * sy + z1 * cy;
        
        // Z-axis
        let x3 = x2 * cz - y1 * sz;
        let y3 = x2 * sz + y1 * cz;

        // Perspective scaling
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

      // Draw Grid / Tech Lines in Background
      ctx.strokeStyle = "rgba(255, 119, 0, 0.04)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Bounding circle
      ctx.arc(centerX, centerY, 160, 0, Math.PI * 2);
      ctx.stroke();

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX - 180, centerY);
      ctx.lineTo(centerX - 165, centerY);
      ctx.moveTo(centerX + 165, centerY);
      ctx.lineTo(centerX + 180, centerY);
      ctx.moveTo(centerX, centerY - 180);
      ctx.lineTo(centerX, centerY - 165);
      ctx.moveTo(centerX, centerY + 165);
      ctx.lineTo(centerX, centerY + 180);
      ctx.stroke();

      // Small tick marks
      ctx.font = "9px monospace";
      ctx.fillStyle = "rgba(255, 119, 0, 0.3)";

      // Draw Edges
      // Sort edges or adjust opacity by depth to simulate 3D visibility
      for (let i = 0; i < edges.length; i++) {
        const [idxA, idxB] = edges[i];
        const pA = projected[idxA];
        const pB = projected[idxB];

        // Skip points outside viewport
        if (!pA || !pB) continue;

        // Average z depth of the edge
        const avgDepth = (pA.zDepth + pB.zDepth) / 2;
        
        // Depth mapping: closer = brighter cyan, farther = dimmer cyan/grey
        // avgDepth runs from approx -150 to +150
        const normalizedDepth = (avgDepth + 150) / 300; // 0 (closest) to 1 (farthest)
        const alpha = Math.max(0.06, 0.95 - normalizedDepth * 0.85);

        let strokeColor = `rgba(255, 119, 0, ${alpha})`;
        let lineWidth = 1;

        if (pA.type === "axle" || pB.type === "axle") {
          strokeColor = `rgba(69, 162, 158, ${alpha * 0.7})`; // Silver-green for shaft
          lineWidth = 0.75;
        } else if (pA.type === "hole") {
          strokeColor = `rgba(255, 119, 0, ${alpha * 1.2})`;
          lineWidth = 1.25;
        }

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        
        ctx.beginPath();
        ctx.moveTo(pA.px, pA.py);
        ctx.lineTo(pB.px, pB.py);
        ctx.stroke();

        // Holographic double lines / glow for outer profiles
        if (pA.type === "shroud" && alpha > 0.6) {
          ctx.strokeStyle = `rgba(255, 119, 0, ${alpha * 0.15})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(pA.px, pA.py);
          ctx.lineTo(pB.px, pB.py);
          ctx.stroke();
        }
      }

      // Draw tiny rotating status text block next to center
      ctx.fillStyle = "rgba(142, 149, 165, 0.4)";
      ctx.font = "9px monospace";
      ctx.fillText("MODEL: TURBINE_BRACKET_V3", centerX - 70, height - 20);
      ctx.fillStyle = "rgba(255, 119, 0, 0.7)";
      ctx.fillRect(centerX + 65, height - 27, 4, 4);

      animationId = requestAnimationFrame(render);
    };

    render();

    // Clean up
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center overflow-hidden">
      {/* Absolute technical labels / crosshairs overlay */}
      <div className="absolute top-8 right-8 font-tech text-[10px] tracking-wider text-blueprint-dim select-none pointer-events-none flex flex-col gap-1 text-right">
        <span>DRAWING REF: SV-AX2-9</span>
        <span>SCALE: 1:1.5</span>
        <span className="text-blueprint">STATUS: LOCKED // INERTIA</span>
        <span>R-MAX: 145MM</span>
      </div>

      <div className="absolute bottom-8 left-8 font-tech text-[10px] tracking-wider text-blueprint-dim select-none pointer-events-none flex flex-col gap-1">
        <span>GRID SYSTEM // UTM-X</span>
        <span>SYS.CALIBRATION // NORMAL</span>
        <span ref={rotYRef} className="text-blueprint">ROT-Y: 0.000RAD</span>
      </div>

      <canvas ref={canvasRef} className="w-full h-full max-w-[500px] max-h-[500px] aspect-square block cursor-grab active:cursor-grabbing" />
    </div>
  );
}
