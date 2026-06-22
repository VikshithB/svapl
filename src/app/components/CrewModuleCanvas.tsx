import { useEffect, useRef } from "react";

export function CrewModuleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotYRef = useRef<HTMLSpanElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const rotationRef = useRef({ x: 0.35, y: 0.6, z: 0 });
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

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

    // Mouse handlers for dragging & hovering
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      mouseRef.current.targetX = x * 1.5;
      mouseRef.current.targetY = y * 1.5;

      if (isDragging.current) {
        const deltaX = e.clientX - previousMousePosition.current.x;
        const deltaY = e.clientY - previousMousePosition.current.y;
        
        rotationRef.current.y += deltaX * 0.012;
        rotationRef.current.x += deltaY * 0.012;
        
        previousMousePosition.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Touch support for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging.current && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.current.y;
        
        rotationRef.current.y += deltaX * 0.012;
        rotationRef.current.x += deltaY * 0.012;
        
        previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onMouseUp);

    // ─── Generate 3D Gaganyaan Crew Module Refined Geometry ───
    interface Point3D {
      x: number;
      y: number;
      z: number;
      type?: string;
    }
    const vertices: Point3D[] = [];
    const edges: [number, number][] = [];

    // Helper: Add horizontal circle vertices
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

    // Helper: Connect two circles with horizontal loops and vertical ribs
    const connectCircles = (start1: number, start2: number, segments: number) => {
      for (let i = 0; i < segments; i++) {
        edges.push([start1 + i, start1 + ((i + 1) % segments)]);
        edges.push([start2 + i, start2 + ((i + 1) % segments)]);
        edges.push([start1 + i, start2 + i]);
      }
    };

    // Helper: Add diagonal cross-braces between rings to represent internal trusses
    const addCrossBracing = (start1: number, start2: number, segments: number, step = 2) => {
      for (let i = 0; i < segments; i += step) {
        // Diagonal links
        edges.push([start1 + i, start2 + ((i + step) % segments)]);
        edges.push([start1 + ((i + step) % segments), start2 + i]);
      }
    };

    // A. Double-Walled Outer & Inner Shells
    const shellSegments = 32; // Higher density for realism
    const levels = [
      { z: -40, rOuter: 60, rInner: 52 },
      { z: -15, rOuter: 74, rInner: 66 },
      { z: 12, rOuter: 88, rInner: 80 },
      { z: 42, rOuter: 102, rInner: 94 },
      { z: 75, rOuter: 116, rInner: 108 }
    ];

    const outerRingStartIndices: number[] = [];
    const innerRingStartIndices: number[] = [];

    // 1. Create outer and inner shell vertices
    levels.forEach((lvl) => {
      outerRingStartIndices.push(addCircle(lvl.rOuter, lvl.z, shellSegments, "outer-shell"));
      innerRingStartIndices.push(addCircle(lvl.rInner, lvl.z, shellSegments, "inner-shell"));
    });

    // 2. Connect outer shell rings (Form outer capsule skin)
    for (let k = 0; k < outerRingStartIndices.length - 1; k++) {
      connectCircles(outerRingStartIndices[k], outerRingStartIndices[k + 1], shellSegments);
      // Add diagonal cross-bracing to the outer shell
      addCrossBracing(outerRingStartIndices[k], outerRingStartIndices[k + 1], shellSegments, 2);
    }

    // 3. Connect inner shell rings (Form structural inner pressure cabin)
    for (let k = 0; k < innerRingStartIndices.length - 1; k++) {
      connectCircles(innerRingStartIndices[k], innerRingStartIndices[k + 1], shellSegments);
    }

    // 4. Connect Outer & Inner Shell (Truss Core Spacer Webbing)
    // Connect outer shell to inner shell with radial spacers & cross braces
    for (let k = 0; k < levels.length; k++) {
      const outerStart = outerRingStartIndices[k];
      const innerStart = innerRingStartIndices[k];
      for (let i = 0; i < shellSegments; i++) {
        // Direct radial links (spacers)
        edges.push([outerStart + i, innerStart + i]);
        
        // Diagonal spacer links (honeycomb truss representation)
        if (i % 2 === 0) {
          edges.push([outerStart + i, innerStart + ((i + 1) % shellSegments)]);
        }
      }
    }

    // Mark major vertical seams
    for (let i = 0; i < shellSegments; i++) {
      if (i % 4 === 0) {
        for (let k = 0; k < levels.length; k++) {
          vertices[outerRingStartIndices[k] + i].type = "outer-seam";
        }
      }
    }

    // B. Convex Bottom Heat Shield (Rounded bottom dome)
    // Add concentric circles curving downward at the base
    const baseOuterIdx = outerRingStartIndices[levels.length - 1]; // level Z = 75, R = 116
    
    // Concentric dome rings
    const dome1Idx = addCircle(80, 83, 16, "heat-shield");
    const dome2Idx = addCircle(40, 87, 8, "heat-shield");
    // Center point of heat shield
    const centerPointIdx = vertices.length;
    vertices.push({ x: 0, y: 0, z: 90, type: "heat-shield" });

    // Connect heat shield rings
    // Outer base (32 segs) to Dome 1 (16 segs)
    for (let i = 0; i < 16; i++) {
      edges.push([dome1Idx + i, dome1Idx + ((i + 1) % 16)]);
      // Connect to outer base (mapping 16 to 32)
      edges.push([dome1Idx + i, baseOuterIdx + i * 2]);
    }
    // Dome 1 (16 segs) to Dome 2 (8 segs)
    for (let i = 0; i < 8; i++) {
      edges.push([dome2Idx + i, dome2Idx + ((i + 1) % 8)]);
      edges.push([dome2Idx + i, dome1Idx + i * 2]);
    }
    // Dome 2 to center point
    for (let i = 0; i < 8; i++) {
      edges.push([dome2Idx + i, centerPointIdx]);
    }

    // C. Internal Equipment Bay Core & Radial Bulkheads
    // Central cylinder (parachute & avionics stack) R = 20, from Z = -40 to Z = 75
    const coreLevels = [-40, -15, 12, 42, 71];
    const coreSegments = 12;
    const coreRingStartIndices: number[] = [];

    coreLevels.forEach((zVal) => {
      coreRingStartIndices.push(addCircle(18, zVal, coreSegments, "internal-core"));
    });

    // Connect core cylinder rings
    for (let k = 0; k < coreRingStartIndices.length - 1; k++) {
      connectCircles(coreRingStartIndices[k], coreRingStartIndices[k + 1], coreSegments);
    }

    // Add internal radial bulkhead braces (Truss spokes connecting core to inner cabin wall)
    for (let k = 0; k < levels.length; k++) {
      const innerStart = innerRingStartIndices[k];
      const coreStart = coreRingStartIndices[k];
      
      // Connect 8 spokes at each level
      for (let j = 0; j < 8; j++) {
        const innerIdx = innerStart + Math.round((j / 8) * shellSegments) % shellSegments;
        const coreIdx = coreStart + Math.round((j / 8) * coreSegments) % coreSegments;
        edges.push([innerIdx, coreIdx]);
      }
    }

    // D. Base Mounting Brackets (Blue Lugs)
    // 8 brackets at base ring
    const bracketCount = 8;
    for (let b = 0; b < bracketCount; b++) {
      const angle = (b / bracketCount) * Math.PI * 2;
      const d = 0.06; // width in rad
      const rInner = 116;
      const rOuter = 126;
      const zTop = 75;
      const zBottom = 83;
      
      const bStart = vertices.length;

      // 8 vertices of box
      vertices.push({ x: Math.cos(angle - d) * rInner, y: Math.sin(angle - d) * rInner, z: zTop, type: "bracket" }); // 0
      vertices.push({ x: Math.cos(angle + d) * rInner, y: Math.sin(angle + d) * rInner, z: zTop, type: "bracket" }); // 1
      vertices.push({ x: Math.cos(angle - d) * rInner, y: Math.sin(angle - d) * rInner, z: zBottom, type: "bracket" }); // 2
      vertices.push({ x: Math.cos(angle + d) * rInner, y: Math.sin(angle + d) * rInner, z: zBottom, type: "bracket" }); // 3
      vertices.push({ x: Math.cos(angle - d) * rOuter, y: Math.sin(angle - d) * rOuter, z: zTop, type: "bracket" }); // 4
      vertices.push({ x: Math.cos(angle + d) * rOuter, y: Math.sin(angle + d) * rOuter, z: zTop, type: "bracket" }); // 5
      vertices.push({ x: Math.cos(angle - d) * rOuter, y: Math.sin(angle - d) * rOuter, z: zBottom, type: "bracket" }); // 6
      vertices.push({ x: Math.cos(angle + d) * rOuter, y: Math.sin(angle + d) * rOuter, z: zBottom, type: "bracket" }); // 7

      // Connect Box Edges
      edges.push([bStart + 0, bStart + 1], [bStart + 1, bStart + 3], [bStart + 3, bStart + 2], [bStart + 2, bStart + 0]);
      edges.push([bStart + 4, bStart + 5], [bStart + 5, bStart + 7], [bStart + 7, bStart + 6], [bStart + 6, bStart + 4]);
      edges.push([bStart + 0, bStart + 4], [bStart + 1, bStart + 5], [bStart + 2, bStart + 6], [bStart + 3, bStart + 7]);

      // Bolt pin
      vertices.push({ x: Math.cos(angle) * rOuter, y: Math.sin(angle) * rOuter, z: (zTop + zBottom) / 2, type: "pin" }); // 8
      vertices.push({ x: Math.cos(angle) * (rOuter + 6), y: Math.sin(angle) * (rOuter + 6), z: (zTop + zBottom) / 2, type: "pin" }); // 9
      edges.push([bStart + 8, bStart + 9]);
    }

    // E. Top Collar (Neck) & Golden Brackets
    // Collar from Z = -40 to Z = -72, R = 44
    const neckTopIdx = addCircle(44, -72, 16, "collar");
    const neckBaseIdx = addCircle(44, -40, 16, "collar");
    connectCircles(neckBaseIdx, neckTopIdx, 16);

    // 4 Golden flaps / support ribs
    const finAngles = [Math.PI/4, 3*Math.PI/4, 5*Math.PI/4, 7*Math.PI/4];
    finAngles.forEach((angle) => {
      const fStart = vertices.length;
      const dOffset = 0.04;
      
      vertices.push({ x: Math.cos(angle - dOffset) * 20, y: Math.sin(angle - dOffset) * 20, z: -40, type: "fin" }); // 0
      vertices.push({ x: Math.cos(angle + dOffset) * 20, y: Math.sin(angle + dOffset) * 20, z: -40, type: "fin" }); // 1
      vertices.push({ x: Math.cos(angle - dOffset) * 44, y: Math.sin(angle - dOffset) * 44, z: -72, type: "fin" }); // 2
      vertices.push({ x: Math.cos(angle + dOffset) * 44, y: Math.sin(angle + dOffset) * 44, z: -72, type: "fin" }); // 3
      vertices.push({ x: Math.cos(angle - dOffset) * 44, y: Math.sin(angle - dOffset) * 44, z: -96, type: "fin" }); // 4
      vertices.push({ x: Math.cos(angle + dOffset) * 44, y: Math.sin(angle + dOffset) * 44, z: -96, type: "fin" }); // 5
      vertices.push({ x: Math.cos(angle - dOffset) * 20, y: Math.sin(angle - dOffset) * 20, z: -96, type: "fin" }); // 6
      vertices.push({ x: Math.cos(angle + dOffset) * 20, y: Math.sin(angle + dOffset) * 20, z: -96, type: "fin" }); // 7

      edges.push([fStart + 0, fStart + 1], [fStart + 2, fStart + 3], [fStart + 4, fStart + 5], [fStart + 6, fStart + 7]);
      edges.push([fStart + 0, fStart + 2], [fStart + 1, fStart + 3]);
      edges.push([fStart + 2, fStart + 4], [fStart + 3, fStart + 5]);
      edges.push([fStart + 4, fStart + 6], [fStart + 5, fStart + 7]);
      edges.push([fStart + 6, fStart + 0], [fStart + 7, fStart + 1]);
      // Truss support inside the golden plate
      edges.push([fStart + 2, fStart + 6], [fStart + 3, fStart + 7]);
    });

    // F. Offset Vent Duct Cylinder (Top right hatch)
    const ventOffset = { x: 13, y: 13 };
    const ventSegments = 8;
    const vBaseStart = vertices.length;
    for (let i = 0; i < ventSegments; i++) {
      const theta = (i / ventSegments) * Math.PI * 2;
      vertices.push({
        x: ventOffset.x + Math.cos(theta) * 7.5,
        y: ventOffset.y + Math.sin(theta) * 7.5,
        z: -72,
        type: "vent",
      });
    }
    const vTopStart = vertices.length;
    for (let i = 0; i < ventSegments; i++) {
      const theta = (i / ventSegments) * Math.PI * 2;
      vertices.push({
        x: ventOffset.x + Math.cos(theta) * 7.5,
        y: ventOffset.y + Math.sin(theta) * 7.5,
        z: -102,
        type: "vent",
      });
    }
    connectCircles(vBaseStart, vTopStart, ventSegments);

    // G. National Pride Details (Indian Flag & ISRO logo panel outlines)
    // 1. Indian Flag Wireframe Outline (Front panel at angle = 0.45 rad / ~25 deg)
    const flagAngle = 0.45;
    const flagWidth = 0.22; 
    const flagR1 = 80; // approximate radius at Z = -10
    const flagR2 = 96; // approximate radius at Z = 25
    
    const flagStartIdx = vertices.length;
    vertices.push({ x: Math.cos(flagAngle - flagWidth) * flagR1, y: Math.sin(flagAngle - flagWidth) * flagR1, z: -10, type: "flag-saffron" });
    vertices.push({ x: Math.cos(flagAngle + flagWidth) * flagR1, y: Math.sin(flagAngle + flagWidth) * flagR1, z: -10, type: "flag-saffron" });
    const flagRM1 = (flagR1 + flagR2) * 0.35;
    vertices.push({ x: Math.cos(flagAngle - flagWidth) * flagRM1, y: Math.sin(flagAngle - flagWidth) * flagRM1, z: 2, type: "flag-white" });
    vertices.push({ x: Math.cos(flagAngle + flagWidth) * flagRM1, y: Math.sin(flagAngle + flagWidth) * flagRM1, z: 2, type: "flag-white" });
    const flagRM2 = (flagR1 + flagR2) * 0.65;
    vertices.push({ x: Math.cos(flagAngle - flagWidth) * flagRM2, y: Math.sin(flagAngle - flagWidth) * flagRM2, z: 14, type: "flag-white" });
    vertices.push({ x: Math.cos(flagAngle + flagWidth) * flagRM2, y: Math.sin(flagAngle + flagWidth) * flagRM2, z: 14, type: "flag-white" });
    vertices.push({ x: Math.cos(flagAngle - flagWidth) * flagR2, y: Math.sin(flagAngle - flagWidth) * flagR2, z: 26, type: "flag-green" });
    vertices.push({ x: Math.cos(flagAngle + flagWidth) * flagR2, y: Math.sin(flagAngle + flagWidth) * flagR2, z: 26, type: "flag-green" });

    edges.push([flagStartIdx + 0, flagStartIdx + 1]);
    edges.push([flagStartIdx + 2, flagStartIdx + 3]);
    edges.push([flagStartIdx + 4, flagStartIdx + 5]);
    edges.push([flagStartIdx + 6, flagStartIdx + 7]);
    edges.push([flagStartIdx + 0, flagStartIdx + 6]);
    edges.push([flagStartIdx + 1, flagStartIdx + 7]);

    // Ashoka Chakra wheel
    const chakraStartIdx = vertices.length;
    const chakraCenterZ = 8;
    const chakraCenterAngle = flagAngle;
    const chakraR = (flagR1 + flagR2) / 2;
    const chakraRadi = 3.5;
    const chakraSegs = 8;
    for (let c = 0; c < chakraSegs; c++) {
      const cTheta = (c / chakraSegs) * Math.PI * 2;
      const offsetX = Math.cos(cTheta) * chakraRadi;
      const offsetZ = Math.sin(cTheta) * chakraRadi;
      const finalAngle = chakraCenterAngle + (offsetX / chakraR);
      vertices.push({
        x: Math.cos(finalAngle) * chakraR,
        y: Math.sin(finalAngle) * chakraR,
        z: chakraCenterZ + offsetZ,
        type: "flag-chakra"
      });
    }
    for (let c = 0; c < chakraSegs; c++) {
      edges.push([chakraStartIdx + c, chakraStartIdx + ((c + 1) % chakraSegs)]);
    }

    // 2. ISRO Arrow Logo Wireframe (Front left panel at angle = -0.45 rad)
    const isroAngle = -0.45;
    const isroStartIdx = vertices.length;
    vertices.push({ x: Math.cos(isroAngle) * 82, y: Math.sin(isroAngle) * 82, z: -5, type: "isro-logo" }); // Spear tip
    vertices.push({ x: Math.cos(isroAngle - 0.05) * 92, y: Math.sin(isroAngle - 0.05) * 92, z: 12, type: "isro-logo" }); // Bottom left
    vertices.push({ x: Math.cos(isroAngle + 0.05) * 92, y: Math.sin(isroAngle + 0.05) * 92, z: 12, type: "isro-logo" }); // Bottom right
    vertices.push({ x: Math.cos(isroAngle) * 89, y: Math.sin(isroAngle) * 89, z: 7, type: "isro-logo" }); // Inner notch
    vertices.push({ x: Math.cos(isroAngle - 0.08) * 87, y: Math.sin(isroAngle - 0.08) * 87, z: 6, type: "isro-logo" }); // Orbit left
    vertices.push({ x: Math.cos(isroAngle + 0.08) * 87, y: Math.sin(isroAngle + 0.08) * 87, z: 3, type: "isro-logo" }); // Orbit right

    edges.push([isroStartIdx + 0, isroStartIdx + 1]);
    edges.push([isroStartIdx + 0, isroStartIdx + 2]);
    edges.push([isroStartIdx + 1, isroStartIdx + 3]);
    edges.push([isroStartIdx + 2, isroStartIdx + 3]);
    edges.push([isroStartIdx + 4, isroStartIdx + 5]);


    // ─── Render Loop ───
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smoothly interpolate mouse tilt offset
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Slow automatic rotation over time if not dragging
      if (!isDragging.current) {
        rotationRef.current.y += 0.0025;
      }
      
      const rx = rotationRef.current.x + mouse.y * 0.15;
      const ry = rotationRef.current.y;
      const rz = rotationRef.current.z;

      if (rotYRef.current) {
        const displayRad = (ry % (Math.PI * 2)).toFixed(3);
        rotYRef.current.textContent = `ROT-Y: ${displayRad}RAD`;
      }

      const cx = Math.cos(rx), sx = Math.sin(rx);
      const cy = Math.cos(ry), sy = Math.sin(ry);
      const cz = Math.cos(rz), sz = Math.sin(rz);

      const centerX = width / 2;
      const centerY = height / 2;
      const distance = 350; 
      
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

      // Draw Grid / Technical blueprint lines in the background
      ctx.strokeStyle = "rgba(255, 119, 0, 0.04)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 175, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX - 200, centerY);
      ctx.lineTo(centerX - 180, centerY);
      ctx.moveTo(centerX + 180, centerY);
      ctx.lineTo(centerX + 200, centerY);
      ctx.moveTo(centerX, centerY - 200);
      ctx.lineTo(centerX, centerY - 180);
      ctx.moveTo(centerX, centerY + 180);
      ctx.lineTo(centerX, centerY + 200);
      ctx.stroke();

      ctx.font = "8px monospace";
      ctx.fillStyle = "rgba(255, 119, 0, 0.25)";
      ctx.fillText("+0.00", centerX - 220, centerY + 3);
      ctx.fillText("SYS.REF", centerX + 185, centerY - 10);

      // Render Edges
      for (let i = 0; i < edges.length; i++) {
        const [idxA, idxB] = edges[i];
        const pA = projected[idxA];
        const pB = projected[idxB];

        if (!pA || !pB) continue;

        const avgDepth = (pA.zDepth + pB.zDepth) / 2;
        const normalizedDepth = (avgDepth + 130) / 260; 
        const alpha = Math.max(0.04, 0.95 - normalizedDepth * 0.85);

        let strokeColor = `rgba(255, 119, 0, ${alpha})`;
        let lineWidth = 1;

        // Visual distinction of layers (Outer skin vs Inner hull vs Internals)
        if (pA.type === "inner-shell" || pB.type === "inner-shell") {
          // Dimmer orange for inner structural cabin
          strokeColor = `rgba(255, 119, 0, ${alpha * 0.4})`;
          lineWidth = 0.7;
        } else if (pA.type === "internal-core" || pB.type === "internal-core") {
          // Steel green / cyan for central equipment core
          strokeColor = `rgba(69, 162, 158, ${alpha * 0.6})`;
          lineWidth = 0.85;
        } else if (pA.type === "heat-shield" || pB.type === "heat-shield") {
          // Copper/reddish orange for bottom heat shield
          strokeColor = `rgba(255, 94, 0, ${alpha * 0.7})`;
          lineWidth = 0.8;
        } else if (pA.type === "collar" || pB.type === "collar") {
          strokeColor = `rgba(79, 195, 247, ${alpha * 0.75})`;
          lineWidth = 0.8;
        } else if (pA.type === "vent" || pB.type === "vent") {
          strokeColor = `rgba(38, 166, 154, ${alpha * 0.7})`;
          lineWidth = 0.75;
        } else if (pA.type === "fin" || pB.type === "fin") {
          strokeColor = `rgba(255, 215, 0, ${alpha * 0.95})`;
          lineWidth = 1.1;
        } else if (pA.type === "bracket" || pB.type === "bracket") {
          strokeColor = `rgba(66, 165, 245, ${alpha * 1.1})`;
          lineWidth = 1.25;
        } else if (pA.type === "pin") {
          strokeColor = `rgba(255, 255, 255, ${alpha})`;
          lineWidth = 1.5;
        } else if (pA.type === "outer-seam" || pB.type === "outer-seam") {
          strokeColor = `rgba(255, 119, 0, ${alpha * 1.35})`;
          lineWidth = 1.35;
        } else if (pA.type?.startsWith("flag-") || pB.type?.startsWith("flag-")) {
          if (pA.type === "flag-saffron" || pB.type === "flag-saffron") {
            strokeColor = `rgba(255, 153, 51, ${alpha * 1.2})`;
          } else if (pA.type === "flag-green" || pB.type === "flag-green") {
            strokeColor = `rgba(18, 136, 37, ${alpha * 1.2})`;
          } else if (pA.type === "flag-white" || pB.type === "flag-white") {
            strokeColor = `rgba(255, 255, 255, ${alpha * 1.1})`;
          } else if (pA.type === "flag-chakra" || pB.type === "flag-chakra") {
            strokeColor = `rgba(66, 133, 244, ${alpha * 1.3})`;
          }
          lineWidth = 1.15;
        } else if (pA.type === "isro-logo" || pB.type === "isro-logo") {
          strokeColor = `rgba(255, 119, 0, ${alpha * 1.4})`;
          lineWidth = 1.5;
        }

        // Space trusses connecting inner to outer shell (faint white spacer links)
        const isSpacerLink = (pA.type === "outer-shell" && pB.type === "inner-shell") || (pA.type === "inner-shell" && pB.type === "outer-shell");
        if (isSpacerLink) {
          strokeColor = `rgba(255, 255, 255, ${alpha * 0.22})`;
          lineWidth = 0.5;
        }

        // Spokes connecting inner shell to central core
        const isCoreSpoke = (pA.type === "inner-shell" && pB.type === "internal-core") || (pA.type === "internal-core" && pB.type === "inner-shell");
        if (isCoreSpoke) {
          strokeColor = `rgba(69, 162, 158, ${alpha * 0.3})`;
          lineWidth = 0.6;
        }

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        
        ctx.beginPath();
        ctx.moveTo(pA.px, pA.py);
        ctx.lineTo(pB.px, pB.py);
        ctx.stroke();

        // Holographic double-line glow effect on outer seams
        if (pA.type === "outer-seam" && alpha > 0.6) {
          ctx.strokeStyle = `rgba(255, 119, 0, ${alpha * 0.15})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(pA.px, pA.py);
          ctx.lineTo(pB.px, pB.py);
          ctx.stroke();
        }
      }

      // Rotate status text next to center
      ctx.fillStyle = "rgba(142, 149, 165, 0.4)";
      ctx.font = "8px monospace";
      ctx.fillText("CAD MODEL: GAGANYAAN_CREW_MODULE_V2", centerX - 85, height - 20);
      
      ctx.fillStyle = "rgba(255, 119, 0, 0.75)";
      ctx.fillRect(centerX + 83, height - 26, 4, 4);

      animationId = requestAnimationFrame(render);
    };

    render();

    // Clean up all events
    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onMouseUp);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center overflow-hidden">
      {/* Blueprint metadata labels — extreme corners, small text */}
      <div className="absolute top-2 right-2 font-tech text-[7px] tracking-wider text-blueprint-dim select-none pointer-events-none flex flex-col gap-0.5 text-right leading-tight">
        <span>MISSION: GAGANYAAN // ORBITAL</span>
        <span>SCALE: 1:12.5 (3D GEODESIC GRID)</span>
        <span className="text-blueprint">STATUS: DYNAMIC MODEL ACTIVE</span>
        <span>STRUCTURE: DOUBLE-WALLED CABIN</span>
      </div>

      <div className="absolute bottom-2 left-2 font-tech text-[7px] tracking-wider text-blueprint-dim select-none pointer-events-none flex flex-col gap-0.5 leading-tight">
        <span>HARDWARE: CRITICAL // CREWED</span>
        <span>SYS.MONITOR // ONLINE</span>
        <span ref={rotYRef} className="text-blueprint">ROT-Y: 0.000RAD</span>
      </div>

      <canvas 
        ref={canvasRef} 
        className="w-full h-full max-w-[500px] max-h-[500px] aspect-square block cursor-grab active:cursor-grabbing" 
      />
    </div>
  );
}
