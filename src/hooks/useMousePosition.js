/* ============================================================
   src/hooks/useMousePosition.js
   ------------------------------------------------------------
   Tracks the mouse position globally, throttled with rAF so
   consumers can freely re-render on every move without
   thrashing. Returns { x, y } in viewport (clientX/Y) pixels.

   Use for: cursor, ambient lighting, parallax, magnetic pull.
   ============================================================ */

import { useEffect, useRef, useState } from "react";

export default function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const latestRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (event) => {
      latestRef.current = { x: event.clientX, y: event.clientY };
      if (rafRef.current !== null) return;

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        setPosition(latestRef.current);
      });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  return position;
}