import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Vite ?url imports — files copied to dist as-is, loaded at runtime
import modelUrl from "@/imports/lvm3/base.obj?url";
import diffuseUrl from "@/imports/lvm3/texture_diffuse.png?url";
import normalUrl from "@/imports/lvm3/texture_normal.png?url";
import roughnessUrl from "@/imports/lvm3/texture_roughness.png?url";
import metallicUrl from "@/imports/lvm3/texture_metallic.png?url";

export function LVM3ModelViewer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let rafId: number;
    let disposed = false;
    let renderer: THREE.WebGLRenderer | null = null;

    const w = mount.clientWidth || 400;
    const h = mount.clientHeight || 400;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.01, 1000);
    camera.position.set(0, 1.5, 5.5);

    // Studio lighting — RoomEnvironment provides soft wrap-around IBL
    // that reads PBR metalness/roughness maps correctly
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // Key light: large soft box upper-left-front (warm neutral)
    const key = new THREE.DirectionalLight(0xfff5e8, 3.5);
    key.position.set(-3, 6, 5);
    scene.add(key);

    // Fill light: opposite side, cooler, about 1/3 key intensity
    const fillL = new THREE.DirectionalLight(0xd0e8ff, 1.1);
    fillL.position.set(5, 2, 3);
    scene.add(fillL);

    // Rim / hair light: behind-above, separates model from background
    const rimL = new THREE.DirectionalLight(0xffffff, 1.8);
    rimL.position.set(0, 8, -6);
    scene.add(rimL);

    // Ground bounce: faint warm uplight simulates studio floor reflection
    const bounce = new THREE.DirectionalLight(0xffe8c0, 0.3);
    bounce.position.set(0, -4, 2);
    scene.add(bounce);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;
    controls.enableZoom = true;
    controls.minDistance = 1.5;
    controls.maxDistance = 18;
    controls.target.set(0, 0, 0);

    // Pause auto-rotate while user interacts
    renderer.domElement.addEventListener("pointerdown", () => { controls.autoRotate = false; });
    renderer.domElement.addEventListener("pointerup",   () => { controls.autoRotate = true; });

    const tl = new THREE.TextureLoader();

    Promise.all([
      tl.loadAsync(diffuseUrl),
      tl.loadAsync(normalUrl),
      tl.loadAsync(roughnessUrl),
      tl.loadAsync(metallicUrl),
    ]).then(([diffuse, normal, roughness, metallic]) => {
      diffuse.colorSpace = THREE.SRGBColorSpace;
      roughness.colorSpace = THREE.NoColorSpace;
      metallic.colorSpace  = THREE.NoColorSpace;
      normal.colorSpace    = THREE.NoColorSpace;

      const mat = new THREE.MeshStandardMaterial({
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

          // Center and fit to a fixed world-unit size
          const box  = new THREE.Box3().setFromObject(obj);
          const center = box.getCenter(new THREE.Vector3());
          const size   = box.getSize(new THREE.Vector3());
          const scale  = 3.2 / Math.max(size.x, size.y, size.z);

          obj.scale.setScalar(scale);
          obj.position.copy(center.negate().multiplyScalar(scale));

          obj.traverse((c) => {
            if ((c as THREE.Mesh).isMesh) (c as THREE.Mesh).material = mat;
          });

          scene.add(obj);
          setDone(true);
        },
        (ev) => {
          if (ev.total > 0) setPct(Math.round((ev.loaded / ev.total) * 100));
        },
        () => setErr(true),
      );
    }).catch(() => setErr(true));

    // Resize observer keeps aspect correct on layout changes
    const ro = new ResizeObserver(() => {
      if (!renderer || !mount) return;
      const rw = mount.clientWidth;
      const rh = mount.clientHeight;
      renderer.setSize(rw, rh);
      camera.aspect = rw / rh;
      camera.updateProjectionMatrix();
    });
    ro.observe(mount);

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      controls.update();
      renderer!.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      controls.dispose();
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
      {/* Blueprint corner brackets */}
      <div className="absolute top-2.5 left-2.5  w-2.5 h-2.5 border-t border-l border-blueprint/40 pointer-events-none z-10" />
      <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t border-r border-blueprint/40 pointer-events-none z-10" />
      <div className="absolute bottom-2.5 left-2.5  w-2.5 h-2.5 border-b border-l border-blueprint/40 pointer-events-none z-10" />
      <div className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b border-r border-blueprint/40 pointer-events-none z-10" />

      {/* HUD labels (only once loaded) */}
      {done && (
        <>
          <div className="absolute top-3.5 left-3.5 bg-black/70 border border-white/[0.06] px-2 py-0.5 font-tech text-[8px] text-blueprint tracking-wider z-10 pointer-events-none">
            SYS: LIVE 3D // DRAG TO ROTATE
          </div>
          <div className="absolute bottom-3.5 right-3.5 bg-black/70 border border-white/[0.06] px-2 py-0.5 font-tech text-[8px] text-blueprint-dim tracking-wider z-10 pointer-events-none">
            LVM3 CORE BASE SHROUD
          </div>
        </>
      )}

      {/* Loading overlay */}
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
            {/* Animated shimmer on the bar */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
          <div className="font-tech text-[8px] text-blueprint-dim tracking-[0.2em]">{pct}%</div>
        </div>
      )}

      {/* Error state */}
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
