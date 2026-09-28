import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ============================================================
   LatticeCanvas
   File: src/components/three/LatticeCanvas.jsx
   ------------------------------------------------------------
   A computational lattice: a 3D grid of points connected by
   thin lines, positioned behind the hero name.

   Orientation:
     • starts in 3/4 view so depth is visible immediately
     • ambient rotation drifts slowly through other angles
     • pointer parallax tilts it toward the cursor

   Performance:
     • DPR capped at 1.5
     • geometry built once via useMemo
     • pointer read from a ref (no React re-renders)
     • rendering paused when the hero is out of view
   ============================================================ */

const GRID = { x: 8, y: 6, z: 4 };
const SPACING = 0.55;
const LINE_THRESHOLD = SPACING * 1.15;

function buildLattice() {
  const { x: gx, y: gy, z: gz } = GRID;
  const ox = (gx - 1) / 2;
  const oy = (gy - 1) / 2;
  const oz = (gz - 1) / 2;
  const jitter = 0.05;

  const pts = [];
  for (let x = 0; x < gx; x++) {
    for (let y = 0; y < gy; y++) {
      for (let z = 0; z < gz; z++) {
        pts.push({
          x: (x - ox) * SPACING + (Math.random() - 0.5) * jitter,
          y: (y - oy) * SPACING + (Math.random() - 0.5) * jitter,
          z: (z - oz) * SPACING + (Math.random() - 0.5) * jitter,
        });
      }
    }
  }

  const count = pts.length;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const baseColor = new THREE.Color("#EAEAEE");
  const accentColor = new THREE.Color("#A07BFF");

  const accentTotal = Math.max(6, Math.floor(count * 0.08));
  const accentSet = new Set();
  while (accentSet.size < accentTotal) {
    accentSet.add(Math.floor(Math.random() * count));
  }

  for (let i = 0; i < count; i++) {
    positions[i * 3] = pts[i].x;
    positions[i * 3 + 1] = pts[i].y;
    positions[i * 3 + 2] = pts[i].z;

    const c = accentSet.has(i) ? accentColor : baseColor;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const segments = [];
  const thr2 = LINE_THRESHOLD * LINE_THRESHOLD;

  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      const dz = pts[i].z - pts[j].z;
      if (dx * dx + dy * dy + dz * dz < thr2) {
        segments.push(
          pts[i].x, pts[i].y, pts[i].z,
          pts[j].x, pts[j].y, pts[j].z
        );
      }
    }
  }

  return {
    positions,
    colors,
    linePositions: new Float32Array(segments),
  };
}

function LatticeScene({ reduced, paused }) {
  const groupRef = useRef(null);
  const innerRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  const { positions, colors, linePositions } = useMemo(buildLattice, []);

  /* Global pointer tracking — canvas has pointer-events: none */
  useEffect(() => {
    const onMove = (event) => {
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state, delta) => {
    const group = groupRef.current;
    const inner = innerRef.current;
    if (!group || !inner) return;
    if (paused) return;

    const t = state.clock.getElapsedTime();

    if (!reduced) {
      inner.rotation.y += delta * 0.030;
      inner.rotation.x += delta * 0.008;

      const breathe = 1 + Math.sin(t * 0.4) * 0.02;
      inner.scale.setScalar(breathe);
    }

    const strength = reduced ? 0 : 0.16;
    const targetY = pointerRef.current.x * strength;
    const targetX = -pointerRef.current.y * strength * 0.5;

    group.rotation.y += (targetY - group.rotation.y) * 0.04;
    group.rotation.x += (targetX - group.rotation.x) * 0.04;

    group.position.y = reduced ? 0 : Math.sin(t * 0.22) * 0.05;
  });

  return (
    <group ref={groupRef} position={[-2.0, 0, 0.1]} scale={0.9}>
      <group ref={innerRef} rotation={[0.28, 0.55, 0.05]}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[colors, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.026}
            vertexColors
            transparent
            opacity={0.55}
            sizeAttenuation
            depthWrite={false}
          />
        </points>

        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[linePositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#8B5CF6"
            transparent
            opacity={0.12}
            depthWrite={false}
          />
        </lineSegments>
      </group>
    </group>
  );
}

export default function LatticeCanvas({ reduced = false }) {
  const wrapperRef = useRef(null);
  const [paused, setPaused] = useState(false);

  /* Pause the scene when the hero is out of the viewport. */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setPaused(!entry.isIntersecting);
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: "absolute", inset: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ position: "absolute", inset: 0 }}
      >
        <LatticeScene reduced={reduced} paused={paused} />
      </Canvas>
    </div>
  );
}