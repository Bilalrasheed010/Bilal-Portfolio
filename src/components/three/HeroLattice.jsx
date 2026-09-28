import { Suspense, lazy } from "react";
import useIsMobile from "../../hooks/useIsMobile.js";
import useReducedMotion from "../../hooks/useReducedMotion.js";
import LatticeFallback from "./LatticeFallback.jsx";
import "./HeroLattice.css";

/* ============================================================
   HeroLattice
   File: src/components/three/HeroLattice.jsx
   ------------------------------------------------------------
   Chooses between the 3D scene (desktop) and a static SVG
   fallback (mobile / tablet). The 3D canvas is lazy-loaded so
   text paints first.
   ============================================================ */

const LatticeCanvas = lazy(() => import("./LatticeCanvas.jsx"));

export default function HeroLattice() {
  const isMobile = useIsMobile(900);
  const reduced = useReducedMotion();

  return (
    <div className="hero-lattice" aria-hidden="true">
      {isMobile ? (
        <LatticeFallback />
      ) : (
        <Suspense fallback={<LatticeFallback />}>
          <LatticeCanvas reduced={reduced} />
        </Suspense>
      )}
    </div>
  );
}