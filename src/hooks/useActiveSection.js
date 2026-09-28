/* ============================================================
   src/hooks/useActiveSection.js
   ------------------------------------------------------------
   Returns the id of the section currently occupying the middle
   band of the viewport. Uses IntersectionObserver — no scroll
   listeners, no rAF loops.

   The observed ids are held in a ref so the effect can mount
   once even if the caller passes a new array each render.
   ============================================================ */

import { useEffect, useRef, useState } from "react";

export default function useActiveSection(sectionIds = []) {
  const [active, setActive] = useState(sectionIds[0] ?? "");
  const idsRef = useRef(sectionIds);
  idsRef.current = sectionIds;

  useEffect(() => {
    const ids = idsRef.current;
    if (!ids.length) return undefined;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        let best = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (!best || entry.intersectionRatio > best.intersectionRatio) {
            best = entry;
          }
        }
        if (best?.target?.id) setActive(best.target.id);
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return active;
}