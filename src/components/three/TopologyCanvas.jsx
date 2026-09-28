import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SKILLS } from "../../data/skills.js";
import { PROJECTS, getProjectsUsingTech } from "../../data/projects.js";
import "./TopologyCanvas.css";

/* ============================================================
   TopologyCanvas
   File: src/components/three/TopologyCanvas.jsx
   ------------------------------------------------------------
   Interactive technology topology.

   Variants:
     • "hero"    — full-speed interactive map with a floating
                   tooltip on node hover. The tooltip names the
                   technology and lists real projects that use it.
     • "bookend" — slow, dim, non-interactive mirror behind the
                   Contact section.

   Performance:
     • IntersectionObserver pauses the frame loop whenever the
       canvas scrolls out of view — Hero and Contact never run
       simultaneously.
     • One draw call per mesh — nodes, base lines, highlight
       lines. Never more.
   ============================================================ */

const CATEGORY_ANCHORS = [
  { x: 1.10, y: 0.55, z: 0.30 },    // 01 Languages
  { x: 0.30, y: 1.15, z: 0.95 },    // 02 Backend
  { x: -1.10, y: 0.40, z: 0.75 },   // 03 Frontend
  { x: -1.30, y: -0.65, z: -0.20 }, // 04 Database
  { x: 0.20, y: -1.20, z: -0.60 },  // 05 Tools
  { x: 1.20, y: -0.35, z: -0.95 },  // 06 Concepts
];

const VARIANTS = {
  hero: {
    initialZ: 0,
    rotationSpeedY: 0.06,
    rotX1: { freq: 0.16, amp: 0.05 },
    rotX2: { freq: 0.05, amp: 0.03 },
    rotZ: { freq: 0.13, amp: 0.03 },
    pointerStrength: 0.14,
    hoverEnabled: true,
    pointsOpacity: 0.9,
    linesOpacity: 0.14,
    position: [1.45, 0, 0],
    scale: 1.28,
    cameraPos: [0, 0, 7],
    cameraFov: 50,
  },
  bookend: {
    initialZ: Math.PI / 3.5,
    rotationSpeedY: 0.015,
    rotX1: { freq: 0.08, amp: 0.022 },
    rotX2: { freq: 0.03, amp: 0.012 },
    rotZ: { freq: 0.06, amp: 0.012 },
    pointerStrength: 0.035,
    hoverEnabled: false,
    pointsOpacity: 0.32,
    linesOpacity: 0.08,
    position: [0.7, 0.2, -0.8],
    scale: 1.75,
    cameraPos: [0, 0, 9],
    cameraFov: 58,
  },
};

function buildTopology() {
  const nodes = [];
  const techIndex = new Map();

  SKILLS.forEach((category, ci) => {
    const anchor = CATEGORY_ANCHORS[ci % CATEGORY_ANCHORS.length];
    const count = category.items.length;
    const clusterRadius = 0.30 + count * 0.032;

    category.items.forEach((name, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const x =
        anchor.x + Math.sin(phi) * Math.cos(theta) * clusterRadius;
      const y =
        anchor.y + Math.sin(phi) * Math.sin(theta) * clusterRadius;
      const z = anchor.z + Math.cos(phi) * clusterRadius;

      techIndex.set(name, nodes.length);
      nodes.push({ name, category: ci, x, y, z });
    });
  });

  const edgeMap = new Map();
  const nodeNeighbors = new Map();

  PROJECTS.forEach((project) => {
    const known = project.stack.filter((t) => techIndex.has(t));
    for (let i = 0; i < known.length; i += 1) {
      for (let j = i + 1; j < known.length; j += 1) {
        const a = techIndex.get(known[i]);
        const b = techIndex.get(known[j]);
        const key = a < b ? `${a}-${b}` : `${b}-${a}`;
        edgeMap.set(key, (edgeMap.get(key) || 0) + 1);
      }
    }
  });

  const edges = [];
  edgeMap.forEach((weight, key) => {
    const [a, b] = key.split("-").map(Number);
    edges.push({ a, b, weight });

    if (!nodeNeighbors.has(a)) nodeNeighbors.set(a, new Set());
    if (!nodeNeighbors.has(b)) nodeNeighbors.set(b, new Set());
    nodeNeighbors.get(a).add(b);
    nodeNeighbors.get(b).add(a);
  });

  return { nodes, edges, nodeNeighbors };
}

function TopologyScene({ reduced, paused, variant, onHoverChange }) {
  const cfg = VARIANTS[variant] || VARIANTS.hero;

  const groupRef = useRef(null);
  const innerRef = useRef(null);
  const pointsRef = useRef(null);

  const [hovered, setHovered] = useState(null);

  const { nodes, edges, nodeNeighbors } = useMemo(buildTopology, []);
  const { camera } = useThree();

  const positions = useMemo(() => {
    const arr = new Float32Array(nodes.length * 3);
    nodes.forEach((n, i) => {
      arr[i * 3] = n.x;
      arr[i * 3 + 1] = n.y;
      arr[i * 3 + 2] = n.z;
    });
    return arr;
  }, [nodes]);

  const colors = useMemo(() => {
    const arr = new Float32Array(nodes.length * 3);
    const base = new THREE.Color("#EAEAEE");
    for (let i = 0; i < nodes.length; i += 1) {
      arr[i * 3] = base.r;
      arr[i * 3 + 1] = base.g;
      arr[i * 3 + 2] = base.b;
    }
    return arr;
  }, [nodes]);

  const linePositions = useMemo(() => {
    const arr = new Float32Array(edges.length * 6);
    edges.forEach((e, i) => {
      const a = nodes[e.a];
      const b = nodes[e.b];
      arr[i * 6] = a.x;
      arr[i * 6 + 1] = a.y;
      arr[i * 6 + 2] = a.z;
      arr[i * 6 + 3] = b.x;
      arr[i * 6 + 4] = b.y;
      arr[i * 6 + 5] = b.z;
    });
    return arr;
  }, [nodes, edges]);

  const highlightPositions = useMemo(() => {
    if (!cfg.hoverEnabled || hovered === null) {
      return new Float32Array(0);
    }
    const neighbours = nodeNeighbors.get(hovered);
    if (!neighbours || neighbours.size === 0) return new Float32Array(0);

    const arr = new Float32Array(neighbours.size * 6);
    const a = nodes[hovered];
    let i = 0;
    neighbours.forEach((n) => {
      const b = nodes[n];
      arr[i * 6] = a.x;
      arr[i * 6 + 1] = a.y;
      arr[i * 6 + 2] = a.z;
      arr[i * 6 + 3] = b.x;
      arr[i * 6 + 4] = b.y;
      arr[i * 6 + 5] = b.z;
      i += 1;
    });
    return arr;
  }, [hovered, nodes, nodeNeighbors, cfg.hoverEnabled]);

  /* Update point colours on hover */
  useEffect(() => {
    const points = pointsRef.current;
    if (!points) return;
    const attr = points.geometry.attributes.color;
    if (!attr) return;

    const base = new THREE.Color("#EAEAEE");
    const hoverColor = new THREE.Color("#A07BFF");
    const neighbourColor = new THREE.Color("#7C5CF6");
    const dim = new THREE.Color("#2A2A34");

    const connected =
      hovered !== null ? nodeNeighbors.get(hovered) : null;

    for (let i = 0; i < nodes.length; i += 1) {
      let c;
      if (!cfg.hoverEnabled || hovered === null) c = base;
      else if (i === hovered) c = hoverColor;
      else if (connected && connected.has(i)) c = neighbourColor;
      else c = dim;

      attr.array[i * 3] = c.r;
      attr.array[i * 3 + 1] = c.g;
      attr.array[i * 3 + 2] = c.b;
    }
    attr.needsUpdate = true;
  }, [hovered, nodes, nodeNeighbors, cfg.hoverEnabled]);

  /* Bubble the hovered technology name up to the parent */
  useEffect(() => {
    if (!cfg.hoverEnabled || !onHoverChange) return;
    if (hovered === null) {
      onHoverChange(null);
    } else {
      onHoverChange(nodes[hovered]?.name ?? null);
    }
  }, [hovered, nodes, cfg.hoverEnabled, onHoverChange]);

  /* Pointer tracking */
  const pointerRef = useRef({ x: 0, y: 0 });
  const raycaster = useMemo(() => {
    const r = new THREE.Raycaster();
    r.params.Points.threshold = 0.11;
    return r;
  }, []);

  useEffect(() => {
    if (!cfg.hoverEnabled && cfg.pointerStrength === 0) return undefined;

    const onMove = (event) => {
      pointerRef.current.x =
        (event.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y =
        -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [cfg.hoverEnabled, cfg.pointerStrength]);

  /* Frame loop */
  useFrame((state, delta) => {
    if (paused) return;

    const group = groupRef.current;
    const inner = innerRef.current;
    if (!group || !inner) return;

    const t = state.clock.getElapsedTime();

    if (!reduced) {
      inner.rotation.y += delta * cfg.rotationSpeedY;
      inner.rotation.x =
        Math.sin(t * cfg.rotX1.freq) * cfg.rotX1.amp +
        Math.sin(t * cfg.rotX2.freq) * cfg.rotX2.amp;
      inner.rotation.z =
        cfg.initialZ + Math.cos(t * cfg.rotZ.freq) * cfg.rotZ.amp;
    } else {
      inner.rotation.z = cfg.initialZ;
    }

    const strength = reduced ? 0 : cfg.pointerStrength;
    const targetY = pointerRef.current.x * strength;
    const targetX = -pointerRef.current.y * strength * 0.6;

    group.rotation.y += (targetY - group.rotation.y) * 0.05;
    group.rotation.x += (targetX - group.rotation.x) * 0.05;

    if (!reduced && cfg.hoverEnabled) {
      raycaster.setFromCamera(pointerRef.current, camera);
      const hits = raycaster.intersectObject(pointsRef.current, false);
      const next = hits.length > 0 ? hits[0].index : null;
      if (next !== hovered) setHovered(next);
    }
  });

  return (
    <group ref={groupRef} position={cfg.position} scale={cfg.scale}>
      <group ref={innerRef}>
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
            opacity={cfg.linesOpacity}
            depthWrite={false}
          />
        </lineSegments>

        {cfg.hoverEnabled &&
          hovered !== null &&
          highlightPositions.length > 0 && (
            <lineSegments key={`hl-${hovered}`}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[highlightPositions, 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial
                color="#A07BFF"
                transparent
                opacity={0.75}
                depthWrite={false}
              />
            </lineSegments>
          )}

        <points ref={pointsRef}>
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
            size={0.028}
            vertexColors
            transparent
            opacity={cfg.pointsOpacity}
            sizeAttenuation
            depthWrite={false}
          />
        </points>
      </group>
    </group>
  );
}

export default function TopologyCanvas({
  variant = "hero",
  reduced = false,
}) {
  const wrapperRef = useRef(null);
  const tooltipRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [hoveredTech, setHoveredTech] = useState(null);

  /* Pause rendering when the canvas is off-screen */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

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

  /* Tooltip follows the cursor (hero variant only) */
  useEffect(() => {
    if (variant !== "hero") return undefined;
    if (typeof window === "undefined") return undefined;

    const onMove = (event) => {
      const el = tooltipRef.current;
      if (!el) return;
      el.style.transform = `translate3d(${event.clientX + 18}px, ${
        event.clientY + 18
      }px, 0)`;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [variant]);

  /* Related real projects for the hovered technology */
  const relatedProjects = useMemo(() => {
    if (!hoveredTech) return [];
    return getProjectsUsingTech(hoveredTech);
  }, [hoveredTech]);

  const cfg = VARIANTS[variant] || VARIANTS.hero;

  return (
    <div
      ref={wrapperRef}
      style={{ position: "absolute", inset: 0 }}
    >
      <Canvas
        camera={{ position: cfg.cameraPos, fov: cfg.cameraFov }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ position: "absolute", inset: 0 }}
      >
        <TopologyScene
          reduced={reduced}
          paused={paused}
          variant={variant}
          onHoverChange={setHoveredTech}
        />
      </Canvas>

      {variant === "hero" && (
        <div
          ref={tooltipRef}
          className={`topology-tooltip${
            hoveredTech ? " is-visible" : ""
          }`}
          aria-hidden="true"
        >
          {hoveredTech && (
            <>
              <span className="topology-tooltip__name">
                {hoveredTech}
              </span>
              {relatedProjects.length > 0 ? (
                <>
                  <span className="topology-tooltip__sep">
                    {" · "}
                  </span>
                  <span className="topology-tooltip__projects">
                    {relatedProjects
                      .slice(0, 2)
                      .map((p, i) => (
                        <span key={p.id}>
                          {i > 0 && ", "}
                          {p.title}
                        </span>
                      ))}
                    {relatedProjects.length > 2 &&
                      ` +${relatedProjects.length - 2}`}
                  </span>
                </>
              ) : (
                <>
                  <span className="topology-tooltip__sep">
                    {" · "}
                  </span>
                  <span className="topology-tooltip__empty">
                    not yet shipped
                  </span>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}