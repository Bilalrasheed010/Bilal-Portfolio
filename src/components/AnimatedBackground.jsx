import { useEffect, useRef } from "react";
import "./AnimatedBackground.css";

/* ============================================================
   AnimatedBackground
   File: src/components/AnimatedBackground.jsx
   ------------------------------------------------------------
   Editorial atmosphere. Deep charcoal base, faint grid, soft
   grain, quiet vignette, and a restrained cursor-reactive pool
   of light.

   No particles. No canvas. No aurora blobs.
   The only JavaScript is one passive mousemove listener that
   writes CSS custom properties for the pool of light.
   ============================================================ */

export default function AnimatedBackground() {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return undefined;

    // Respect reduced motion — no cursor-reactive lighting.
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return undefined;

    // Skip on touch — no cursor.
    const isTouch =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none)").matches;
    if (isTouch) return undefined;

    let rafId = null;
    const latest = { x: 0, y: 0 };

    const apply = () => {
      rafId = null;
      el.style.setProperty("--mx", `${latest.x}px`);
      el.style.setProperty("--my", `${latest.y}px`);
    };

    const handleMove = (event) => {
      latest.x = event.clientX;
      latest.y = event.clientY;
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(apply);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="animated-bg"
      aria-hidden="true"
    >
      <div className="animated-bg__base" />
      <div className="animated-bg__grid" />
      <div className="animated-bg__pool" />
      <div className="animated-bg__noise" />
      <div className="animated-bg__vignette" />
    </div>
  );
}