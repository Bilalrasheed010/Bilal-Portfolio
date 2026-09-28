/* ============================================================
   src/hooks/useReducedMotion.js
   ------------------------------------------------------------
   Returns true when the user prefers reduced motion.
   Every animated component should read this before running
   keyframe or timeline animations.
   ============================================================ */

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export default function useReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mql = window.matchMedia(QUERY);
    const handler = (event) => setReduced(event.matches);

    setReduced(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reduced;
}