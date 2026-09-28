import { useEffect, useRef, useState } from "react";
import useReducedMotion from "../hooks/useReducedMotion.js";
import "./CustomCursor.css";

/* ============================================================
   CustomCursor
   File: src/components/CustomCursor.jsx
   ------------------------------------------------------------
   A desktop-only cursor replacement.

   • Dot   — follows the mouse with zero lag.
   • Ring  — follows with a lerp for a soft trailing feel.
   • Both use mix-blend-mode: difference so they stay legible
     over any background.

   States (auto-detected from what's hovered):
     • default — normal
     • link    — over a, button, [role="tab"], [role="button"], summary, label
     • text    — over input, textarea, [contenteditable]
     • project — over [data-cursor="project"] (used later)
     • hidden  — mouse has left the window

   Automatically disabled when:
     • the device has no fine pointer (touch)
     • prefers-reduced-motion is set
   ============================================================ */

const LERP_FACTOR = 0.16;

function usePointerFine() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mq = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );
    setFine(mq.matches);

    const handler = (event) => setFine(event.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return fine;
}

export default function CustomCursor() {
  const reduced = useReducedMotion();
  const hasPointer = usePointerFine();

  const enabled = hasPointer && !reduced;

  const [state, setState] = useState("default");
  const [active, setActive] = useState(false);

  const dotRef = useRef(null);
  const ringRef = useRef(null);

  /* ---------- Toggle `has-custom-cursor` on <html> ---------- */
  useEffect(() => {
    if (!enabled) return undefined;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");
    return () => {
      root.classList.remove("has-custom-cursor");
      root.classList.remove("is-pressing");
    };
  }, [enabled]);

  /* ---------- Position + state tracking ---------- */
  useEffect(() => {
    if (!enabled) return undefined;

    const mouse = { x: -200, y: -200 };
    const ring = { x: -200, y: -200 };
    let rafId = null;
    let activated = false;

    const onMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      if (!activated) {
        activated = true;
        ring.x = mouse.x;
        ring.y = mouse.y;
        setActive(true);
      }
    };

    const onOver = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      if (target.closest('[data-cursor="project"]')) {
        setState("project");
        return;
      }
      if (
        target.closest(
          "input, textarea, [contenteditable], select"
        )
      ) {
        setState("text");
        return;
      }
      if (
        target.closest(
          'a, button, [role="tab"], [role="button"], [role="link"], summary, label'
        )
      ) {
        setState("link");
        return;
      }
      setState("default");
    };

    const onLeaveWindow = () => setState("hidden");
    const onEnterWindow = () => setState("default");

    const onDown = () =>
      document.documentElement.classList.add("is-pressing");
    const onUp = () =>
      document.documentElement.classList.remove("is-pressing");

    const tick = () => {
      ring.x += (mouse.x - ring.x) * LERP_FACTOR;
      ring.y += (mouse.y - ring.y) * LERP_FACTOR;

      const dot = dotRef.current;
      const ringEl = ringRef.current;

      if (dot) {
        dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringEl) {
        ringEl.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeaveWindow);
    document.addEventListener("mouseenter", onEnterWindow);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    rafId = window.requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mouseenter", onEnterWindow);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      className={`cursor${active ? " is-active" : ""}`}
      aria-hidden="true"
    >
      <div
        ref={dotRef}
        className={`cursor__dot cursor__dot--${state}`}
      />
      <div
        ref={ringRef}
        className={`cursor__ring cursor__ring--${state}`}
      />
    </div>
  );
}