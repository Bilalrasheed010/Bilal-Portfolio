import { Suspense, lazy } from "react";
import useIsMobile from "../../hooks/useIsMobile.js";
import useReducedMotion from "../../hooks/useReducedMotion.js";
import TopologyFallback from "./TopologyFallback.jsx";
import "./HeroTopology.css";

/* ============================================================
   HeroTopology
   File: src/components/three/HeroTopology.jsx
   ------------------------------------------------------------
   Chooses between the interactive 3D topology (desktop) and a
   static SVG fallback (mobile / tablet). The 3D canvas is
   lazy-loaded so text paints first.
   ============================================================ */

const TopologyCanvas = lazy(() => import("./TopologyCanvas.jsx"));

export default function HeroTopology() {
  const isMobile = useIsMobile(900);
  const reduced = useReducedMotion();

  return (
    <div className="hero-topology" aria-hidden="true">
      {isMobile ? (
        <TopologyFallback />
      ) : (
        <Suspense fallback={<TopologyFallback />}>
          <TopologyCanvas reduced={reduced} />
        </Suspense>
      )}
    </div>
  );
}