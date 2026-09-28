/* ============================================================
   src/hooks/useIsMobile.js
   ------------------------------------------------------------
   matchMedia-based breakpoint hook. Returns true when the
   viewport is at or below the given pixel breakpoint.
   Default breakpoint matches the site's tablet cutoff (860px).
   ============================================================ */

import { useEffect, useState } from "react";

export default function useIsMobile(breakpoint = 860) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= breakpoint;
  });

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (event) => setIsMobile(event.matches);

    setIsMobile(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}