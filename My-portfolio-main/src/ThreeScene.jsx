import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Scroll-driven Three.js scene.
 * The canvas is position:fixed so the cube is always visible.
 * Scroll position drives lerp between per-section keyframes.
 */

// ── Palette — electric blue-cyan + rich violet ───────────────────────────────
const CYAN   = 0x00d4ff;   // electric blue-cyan  (replaces garish green)
const PURPLE = 0x7b2ff7;   // rich violet         (replaces flat blue)
const DARK   = 0x06091a;   // deep midnight navy  (body base)

// ── Per-section keyframes ───────────────────────────────────────────────────────────────
// Sections: 0=Hero, 1=Card1, 2=Card2, 3=Card3, 4=Card4, 5=Contact
// px values are for DESKTOP; getMobileScale() adjusts them at runtime
const KEYFRAMES = [
  { px:  0.0, py:  0.0, pz: 0,  rx: 0,    ry: 0,    rz: 0,    scale: 1.6  }, // Hero
  { px:  2.8, py:  0.2, pz: 0,  rx: 0.4,  ry: 1.2,  rz: 0.2,  scale: 0.95 }, // Card 1
  { px: -2.8, py: -0.2, pz: 0,  rx:-0.3,  ry: 2.6,  rz:-0.3,  scale: 0.95 }, // Card 2
  { px:  2.5, py:  0.6, pz: 0,  rx: 0.8,  ry: 3.9,  rz: 0.4,  scale: 0.85 }, // Card 3
  { px: -2.5, py: -0.6, pz: 0,  rx:-0.6,  ry: 5.2,  rz:-0.5,  scale: 0.85 }, // Card 4
  { px:  0.0, py: -3.5, pz:-1,  rx: 2.0,  ry: 6.5,  rz: 1.0,  scale: 0.35 }, // Contact
];

// On mobile the camera frustum is narrower so ±2.8 units goes off-screen.
// Scale px values down proportionally based on viewport width.
function getMobilePxScale() {
  const w = window.innerWidth;
  if (w >= 900) return 1.0;          // desktop  — full offset
  if (w >= 600) return 0.65;         // tablet   — moderate offset
  return 0.40;                       // phone    — cube barely leaves centre
}

// On mobile, cube sits above/below the card rather than beside it
function isMobile() { return window.innerWidth < 900; }

function lerp(a, b, t) { return a + (b - a) * t; }

function lerpKeyframe(kA, kB, t) {
  return {
    px:    lerp(kA.px,    kB.px,    t),
    py:    lerp(kA.py,    kB.py,    t),
    pz:    lerp(kA.pz,    kB.pz,    t),
    rx:    lerp(kA.rx,    kB.rx,    t),
    ry:    lerp(kA.ry,    kB.ry,    t),
    rz:    lerp(kA.rz,    kB.rz,    t),
    scale: lerp(kA.scale, kB.scale, t),
  };
}

export default function ThreeScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    // ── Renderer ───────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,          // transparent background — page bg shows through
    });
    // Cap pixel ratio lower on mobile to protect performance
    const maxDPR = window.innerWidth < 768 ? 1.5 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDPR));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // ── Scene & camera ───────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 6);

    // ── Geometry — Octahedron ────────────────────────────────────────────────
    const geoOcta = new THREE.OctahedronGeometry(1.5, 0);

    // Main body — deep midnight with electric-cyan emissive
    const matBody = new THREE.MeshStandardMaterial({
      color:             DARK,
      emissive:          CYAN,
      emissiveIntensity: 0.18,
      metalness:         0.95,
      roughness:         0.08,
      transparent:       true,
      opacity:           0.88,
    });
    const mesh = new THREE.Mesh(geoOcta, matBody);
    mesh.castShadow = true;
    scene.add(mesh);

    // Wireframe edges — electric blue-cyan
    const edges    = new THREE.EdgesGeometry(geoOcta);
    const matWire  = new THREE.LineBasicMaterial({
      color:       CYAN,
      transparent: true,
      opacity:     0.9,
    });
    const wireframe = new THREE.LineSegments(edges, matWire);
    mesh.add(wireframe);

    // Inner glow core — violet sphere for contrast against cyan edges
    const geoCore  = new THREE.SphereGeometry(0.3, 16, 16);
    const matCore  = new THREE.MeshStandardMaterial({
      color:             PURPLE,
      emissive:          PURPLE,
      emissiveIntensity: 2.5,
      transparent:       true,
      opacity:           0.7,
    });
    const core = new THREE.Mesh(geoCore, matCore);
    mesh.add(core);

    // ── Lighting ─────────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambient);

    // Key light: electric cyan from upper-right
    const cyanLight = new THREE.PointLight(CYAN, 7, 14);
    cyanLight.position.set(4, 3, 5);
    scene.add(cyanLight);

    // Fill light: rich violet from lower-left
    const purpleLight = new THREE.PointLight(PURPLE, 6, 14);
    purpleLight.position.set(-4, -3, 4);
    scene.add(purpleLight);

    // Rim light: subtle cyan from behind for depth
    const fillLight = new THREE.PointLight(CYAN, 1.5, 8);
    fillLight.position.set(0, 0, -5);
    scene.add(fillLight);

    // ── Scroll state ─────────────────────────────────────────────────────────
    // Current lerped values (start at Hero keyframe)
    let curPx = 0, curPy = 0, curPz = 0;
    let curRx = 0, curRy = 0, curRz = 0;
    let curScale = 1.6;

    // Auto-spin accumulator (on top of keyframe rotation)
    let autoSpin = 0;

    // ── Animation loop ────────────────────────────────────────────────────────
    let rafId;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // ── Compute scroll progress ───────────────────────────────────────────
      const scrollY    = window.scrollY;
      const viewH      = window.innerHeight;
      // Each section is 100vh; hero + 4 project sections + contact = 6 sections
      const sectionIdx = Math.floor(scrollY / viewH);
      const sectionT   = (scrollY % viewH) / viewH;

      const kA = KEYFRAMES[Math.min(sectionIdx,     KEYFRAMES.length - 1)];
      const kB = KEYFRAMES[Math.min(sectionIdx + 1, KEYFRAMES.length - 1)];

      // Ease-in-out for smoother transitions
      const ease = sectionT < 0.5
        ? 2 * sectionT * sectionT
        : -1 + (4 - 2 * sectionT) * sectionT;

      const target = lerpKeyframe(kA, kB, ease);

      // ── Lerp current values toward target (smooth damping) ─────────────────
      const DAMP = 1 - Math.pow(0.003, delta);

      // Scale px offset for current viewport so cube stays on-screen on mobile
      const pxScale = getMobilePxScale();
      // On mobile, shift cube vertically (above card) instead of horizontally
      const mobile  = isMobile();
      const scaledTarget = {
        ...target,
        px: mobile ? target.px * pxScale : target.px * pxScale,
        py: mobile
          // Move cube UP on odd sections (card-left) and slightly off-centre for even
          ? (target.py + (target.px > 0 ? 1.6 : target.px < 0 ? -1.6 : 0)) * 0.7
          : target.py,
        scale: mobile ? target.scale * 0.7 : target.scale,  // smaller on mobile
      };

      curPx    = lerp(curPx,    scaledTarget.px,    DAMP);
      curPy    = lerp(curPy,    scaledTarget.py,    DAMP);
      curPz    = lerp(curPz,    scaledTarget.pz,    DAMP);
      curRx    = lerp(curRx,    target.rx,          DAMP);
      curRy    = lerp(curRy,    target.ry,          DAMP);
      curRz    = lerp(curRz,    target.rz,          DAMP);
      curScale = lerp(curScale, scaledTarget.scale, DAMP);

      // ── Apply to mesh ──────────────────────────────────────────────────────
      // In hero section (sectionIdx === 0): free auto-spin
      const isHero       = sectionIdx === 0;
      const heroFade     = isHero ? (1 - ease) : 0; // 1 at top, 0 leaving hero
      autoSpin          += delta * (isHero ? 0.4 : 0.12);

      mesh.position.set(curPx, curPy, curPz);
      mesh.rotation.x = curRx + autoSpin * 0.4 * heroFade;
      mesh.rotation.y = curRy + autoSpin       * (isHero ? 1 : 0.3);
      mesh.rotation.z = curRz + autoSpin * 0.2 * heroFade;
      mesh.scale.setScalar(curScale);

      // ── Pulsing glow on lights & core ─────────────────────────────────────
      const t        = clock.getElapsedTime();
      const pulse    = Math.sin(t * 1.6) * 0.5 + 0.5;   // 0–1

      // Core pulses violet → cyan
      matCore.emissiveIntensity = 2.0 + pulse * 1.2;
      // Body emissive breathes gently
      matBody.emissiveIntensity = 0.10 + pulse * 0.14;
      // Lights swell in sync
      cyanLight.intensity   = 6 + pulse * 2.5;
      purpleLight.intensity = 5 + pulse * 2.0;

      // Body emissive slowly oscillates cyan ↔ violet (slower = more elegant)
      const t2 = Math.sin(t * 0.45) * 0.5 + 0.5;
      matBody.emissive.lerpColors(
        new THREE.Color(CYAN),
        new THREE.Color(PURPLE),
        t2
      );

      renderer.render(scene, camera);
    };

    animate();

    // ── Resize handler ────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="three-canvas" />;
}
