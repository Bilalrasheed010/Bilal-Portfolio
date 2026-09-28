import { useEffect, useRef } from "react";
import "./ReadingProgress.css";

/* ============================================================
   ReadingProgress
   File: src/components/ReadingProgress.jsx
   ------------------------------------------------------------
   A thin horizontal bar pinned to the top of the viewport that
   fills from left to right in proportion to scroll progress.

   Uses a single CSS custom property updated via rAF, so no
   React re-renders on scroll.
   ============================================================ */

export default function ReadingProgress() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let rafId = null;

    const update = () => {
      rafId = null;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        docHeight > 0 ? Math.min(1, window.scrollY / docHeight) : 0;
      el.style.setProperty("--p", progress.toFixed(4));
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="reading-progress"
      aria-hidden="true"
    />
  );
}