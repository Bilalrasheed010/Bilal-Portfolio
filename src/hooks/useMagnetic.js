/* ============================================================
   src/hooks/useMagnetic.js
   ------------------------------------------------------------
   Returns a ref that, when attached to an element, makes it
   pull toward the cursor while hovered and spring back when
   the cursor leaves.

   strength  → how strongly the element follows the cursor
   maxOffset → maximum translation in pixels

   Respects prefers-reduced-motion internally.
   ============================================================ */

import { useCallback, useEffect, useRef } from "react";
import useReducedMotion from "./useReducedMotion.js";

export default function useMagnetic(strength = 0.35, maxOffset = 12) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const handleMove = useCallback(
    (event) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = (event.clientX - cx) * strength;
      const dy = (event.clientY - cy) * strength;

      const clampedX = Math.max(-maxOffset, Math.min(maxOffset, dx));
      const clampedY = Math.max(-maxOffset, Math.min(maxOffset, dy));

      el.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0)`;
    },
    [strength, maxOffset]
  );

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate3d(0, 0, 0)";
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return undefined;

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      el.style.transform = "";
    };
  }, [handleMove, handleLeave, reduced]);

  return ref;
}