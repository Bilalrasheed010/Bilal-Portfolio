/* ============================================================
   LatticeFallback
   File: src/components/three/LatticeFallback.jsx
   ------------------------------------------------------------
   Static SVG shown on mobile and while the 3D canvas loads.
   A dot grid with a radial fade — same visual register as
   the 3D lattice, zero runtime cost.
   ============================================================ */

export default function LatticeFallback() {
  return (
    <div className="hero-lattice__fallback">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <pattern
            id="lattice-dots"
            width="2.4"
            height="2.4"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="1.2"
              cy="1.2"
              r="0.085"
              fill="rgba(255, 255, 255, 0.38)"
            />
          </pattern>
          <radialGradient
            id="lattice-fade"
            cx="50%"
            cy="50%"
            r="58%"
          >
            <stop offset="0%"   stopColor="white" stopOpacity="1" />
            <stop offset="65%"  stopColor="white" stopOpacity="0.32" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="lattice-mask">
            <rect width="100" height="100" fill="url(#lattice-fade)" />
          </mask>
        </defs>
        <rect
          width="100"
          height="100"
          fill="url(#lattice-dots)"
          mask="url(#lattice-mask)"
        />
      </svg>
    </div>
  );
}