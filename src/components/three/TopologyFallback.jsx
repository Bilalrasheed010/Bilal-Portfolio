/* ============================================================
   TopologyFallback
   File: src/components/three/TopologyFallback.jsx
   ------------------------------------------------------------
   Static SVG of the same visual language — dots + connections —
   shown on mobile and while the 3D scene lazy-loads.
   ============================================================ */

const NODES = [
  // central
  [50, 50], [62, 42], [70, 54], [60, 66], [46, 60],
  [38, 48], [42, 34], [54, 32], [66, 34], [74, 48],
  // lower
  [64, 74], [46, 76], [32, 62], [28, 46], [34, 30],
  // upper
  [52, 20], [66, 18], [76, 30], [78, 62],
];

const EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7],
  [7, 8], [8, 9], [9, 2],
  [0, 5], [0, 4], [0, 3], [1, 8], [2, 9],
  [6, 15], [15, 16], [16, 17], [17, 9],
  [10, 3], [10, 11], [11, 4], [11, 12], [12, 5],
  [12, 13], [13, 6], [13, 14], [14, 6],
  [18, 9], [18, 2], [18, 3],
];

export default function TopologyFallback() {
  return (
    <div className="hero-topology__fallback">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <radialGradient id="topologyFade" cx="60%" cy="50%" r="60%">
            <stop offset="0%"   stopColor="#fff" stopOpacity="1" />
            <stop offset="65%"  stopColor="#fff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="topologyMask">
            <rect width="100" height="100" fill="url(#topologyFade)" />
          </mask>
        </defs>

        <g mask="url(#topologyMask)">
          {/* Edges */}
          {EDGES.map(([a, b], i) => (
            <line
              key={`e-${i}`}
              x1={NODES[a][0]}
              y1={NODES[a][1]}
              x2={NODES[b][0]}
              y2={NODES[b][1]}
              stroke="rgba(160, 123, 255, 0.22)"
              strokeWidth="0.18"
            />
          ))}

          {/* Nodes */}
          {NODES.map(([x, y], i) => (
            <circle
              key={`n-${i}`}
              cx={x}
              cy={y}
              r="0.42"
              fill="rgba(234, 234, 238, 0.75)"
            />
          ))}

          {/* Accent nodes */}
          <circle cx="62" cy="42" r="0.55" fill="#A07BFF" />
          <circle cx="42" cy="34" r="0.55" fill="#A07BFF" />
          <circle cx="46" cy="76" r="0.55" fill="#A07BFF" />
        </g>
      </svg>
    </div>
  );
}