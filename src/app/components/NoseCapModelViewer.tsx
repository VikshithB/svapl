import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

import modelUrl    from "@/imports/nosecap/base.obj?url";
import diffuseUrl  from "@/imports/nosecap/texture_diffuse.png?url";
import normalUrl   from "@/imports/nosecap/texture_normal.png?url";
import roughnessUrl from "@/imports/nosecap/texture_roughness.png?url";
import metallicUrl from "@/imports/nosecap/texture_metallic.png?url";

export function NoseCapModelViewer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [pct, setPct]   = useState(0);
  const [done, setDone] = useState(false);
  const [err,  setErr]  = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let rafId: number;
    let disposed = false;
    let renderer: THREE.WebGLRenderer | null = null;

    let envTexture: THREE.Texture | null = null;
    let mat: THREE.MeshStandardMaterial | null = null;
    const loadedTextures: THREE.Texture[] = [];

    const w = mount.clientWidth  || 400;
    const h = mount.clientHeight || 400;

    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    renderer.setSize(w, h);
    renderer.outputColorSpace    = THREE.SRGBColorSpace;
    renderer.toneMapping         = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.01, 1000);
    camera.position.set(0, 1.5, 5.5);

    // IBL — soft wrap-around
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    envTexture = pmrem.fromScene(new RoomEnvironment(), 0.6).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = 0.55;
    pmrem.dispose();

    // Key — warm white upper-left-front
    const key = new THREE.DirectionalLight(0xfff6e8, 5.0);
    key.position.set(-4, 8, 6);
    scene.add(key);

    // Fill — cool blue from right
    const fill = new THREE.DirectionalLight(0xc8dcff, 1.6);
    fill.position.set(6, 1, 3);
    scene.add(fill);

    // Rim — bright white behind-top for edge separation
    const rim = new THREE.DirectionalLight(0xffffff, 2.8);
    rim.position.set(1, 10, -8);
    scene.add(rim);

    // Accent — brand orange bounce from below
    const accent = new THREE.DirectionalLight(0xff7700, 0.8);
    accent.position.set(0, -3, 4);
    scene.add(accent);

    // Ambient — prevent pure-black shadows
    const ambient = new THREE.AmbientLight(0x101820, 1.0);
    scene.add(ambient);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping    = true;
    controls.dampingFactor    = 0.06;
    controls.autoRotate       = true;
    controls.autoRotateSpeed  = 0.35;
    controls.enableZoom       = true;
    controls.minDistance      = 1.5;
    controls.maxDistance      = 18;
    controls.target.set(0, 0, 0);

    const onPointerDown = () => { controls.autoRotate = false; };
    const onPointerUp   = () => { controls.autoRotate = true; };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup",   onPointerUp);

    const tl = new THREE.TextureLoader();

    Promise.all([
      tl.loadAsync(diffuseUrl),
      tl.loadAsync(normalUrl),
      tl.loadAsync(roughnessUrl),
      tl.loadAsync(metallicUrl),
    ]).then(([diffuse, normal, roughness, metallic]) => {
      if (disposed) {
        [diffuse, normal, roughness, metallic].forEach(t => t.dispose());
        return;
      }

      diffuse.colorSpace   = THREE.SRGBColorSpace;
      roughness.colorSpace = THREE.NoColorSpace;
      metallic.colorSpace  = THREE.NoColorSpace;
      normal.colorSpace    = THREE.NoColorSpace;

      loadedTextures.push(diffuse, normal, roughness, metallic);

      mat = new THREE.MeshStandardMaterial({
        map:          diffuse,
        normalMap:    normal,
        roughnessMap: roughness,
        metalnessMap: metallic,
        metalness:    1.0,
        roughness:    1.0,
      });

      const loader = new OBJLoader();
      loader.load(
        modelUrl,
        (obj) => {
          if (disposed) return;

          const box    = new THREE.Box3().setFromObject(obj);
          const center = box.getCenter(new THREE.Vector3());
          const size   = box.getSize(new THREE.Vector3());
          const scale  = 3.2 / Math.max(size.x, size.y, size.z);

          obj.scale.setScalar(scale);
          obj.position.copy(center.negate().multiplyScalar(scale));

          obj.traverse((c) => {
            if ((c as THREE.Mesh).isMesh) (c as THREE.Mesh).material = mat!;
          });

          scene.add(obj);
          setDone(true);
        },
        (ev) => {
          if (ev.total > 0) setPct(Math.round((ev.loaded / ev.total) * 100));
        },
        () => { if (!disposed) setErr(true); },
      );
    }).catch(() => { if (!disposed) setErr(true); });

    const ro = new ResizeObserver(() => {
      if (!renderer || !mount) return;
      const rw = mount.clientWidth;
      const rh = mount.clientHeight;
      renderer.setSize(rw, rh);
      camera.aspect = rw / rh;
      camera.updateProjectionMatrix();
    });
    ro.observe(mount);

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    io.observe(mount);

    let lastTime = 0;
    const FRAME_MS = 1000 / 30;

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      if (!visible || now - lastTime < FRAME_MS) return;
      lastTime = now;
      controls.update();
      renderer!.render(scene, camera);
    };
    requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();

      renderer?.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer?.domElement.removeEventListener("pointerup",   onPointerUp);

      controls.dispose();
      loadedTextures.forEach(t => t.dispose());
      mat?.dispose();
      envTexture?.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="relative w-full aspect-square bg-[#050505] border border-white/[0.06] overflow-hidden"
      style={{ cursor: done ? "grab" : "default" }}
    >
      <div className="absolute top-2.5 left-2.5   w-2.5 h-2.5 border-t border-l border-blueprint/40 pointer-events-none z-10" />
      <div className="absolute top-2.5 right-2.5  w-2.5 h-2.5 border-t border-r border-blueprint/40 pointer-events-none z-10" />
      <div className="absolute bottom-2.5 left-2.5  w-2.5 h-2.5 border-b border-l border-blueprint/40 pointer-events-none z-10" />
      <div className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b border-r border-blueprint/40 pointer-events-none z-10" />

      {done && (
        <>
          <div className="absolute top-3.5 left-3.5 bg-black/70 border border-white/[0.06] px-2 py-0.5 font-tech text-[8px] text-blueprint tracking-wider z-10 pointer-events-none">
            SYS: LIVE 3D // DRAG TO ROTATE
          </div>
          <div className="absolute bottom-3.5 right-3.5 bg-black/70 border border-white/[0.06] px-2 py-0.5 font-tech text-[8px] text-blueprint-dim tracking-wider z-10 pointer-events-none">
            NOSE CAP ASSY.
          </div>
        </>
      )}

      {!done && !err && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#050505]/90 z-20 pointer-events-none">
          <div className="font-tech text-[9px] text-blueprint tracking-[0.25em] uppercase">
            LOADING 3D MODEL
          </div>
          <div className="w-44 h-[1px] bg-white/10 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-blueprint transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
          <div className="font-tech text-[8px] text-blueprint-dim tracking-[0.2em]">{pct}%</div>
        </div>
      )}

      {err && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#050505]/90 z-20 pointer-events-none">
          <span className="font-tech text-[9px] text-red-400/70 tracking-widest uppercase">
            MODEL LOAD FAILED
          </span>
        </div>
      )}
    </div>
  );
}
