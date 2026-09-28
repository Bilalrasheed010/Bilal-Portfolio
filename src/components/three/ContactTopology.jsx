import { Suspense, lazy } from "react";
import useIsMobile from "../../hooks/useIsMobile.js";
import useReducedMotion from "../../hooks/useReducedMotion.js";
import "./ContactTopology.css";

/* ============================================================
   ContactTopology
   File: src/components/three/ContactTopology.jsx
   ------------------------------------------------------------
   The bookend — a slowed, dimmed version of the topology map
   returning behind the Contact section. Same data, different
   perspective. Non-interactive.

   On mobile and reduced motion, it renders nothing — the
   contact section stands on its own.
   ============================================================ */

const TopologyCanvas = lazy(() =>
  import("./TopologyCanvas.jsx")
);

export default function ContactTopology() {
  const isMobile = useIsMobile(900);
  const reduced = useReducedMotion();

  /* The bookend only exists when the desktop canvas is usable.
     On mobile or reduced motion, we skip it entirely — it's
     decorative, not load-bearing. */
  if (isMobile || reduced) return null;

  return (
    <div className="contact-topology" aria-hidden="true">
      <Suspense fallback={null}>
        <TopologyCanvas variant="bookend" reduced={false} />
      </Suspense>
    </div>
  );
}