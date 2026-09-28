import { useEffect, useRef, useState } from "react";
import useReducedMotion from "../hooks/useReducedMotion.js";
import useActiveSection from "../hooks/useActiveSection.js";
import "./ScrollSpine.css";

/* ============================================================
   ScrollSpine
   File: src/components/ScrollSpine.jsx
   ------------------------------------------------------------
   A fixed vertical hairline on the left edge of the viewport.
   A small violet dot travels down the line, tracking overall
   scroll progress. Small tick marks at each section's midpoint
   glow when that section is active.

   Hidden under reduced motion — the dot would be a moving
   element the user did not ask for.

   Tick positions are computed from real section offsets after
   mount and recomputed on resize / late layout shift.
   ============================================================ */

const SECTION_IDS = [
  "home",
  "about",
  "skills",
  "experience",
  "projects",
  "education",
  "contact",
];

export default function ScrollSpine() {
  const reduced = useReducedMotion();
  const activeSection = useActiveSection(SECTION_IDS);

  const wrapperRef = useRef(null);
  const [ticks, setTicks] = useState([]);

  /* ---------- Compute tick positions from real layout ---------- */
  useEffect(() => {
    if (reduced) return undefined;

    const computeTicks = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const next = SECTION_IDS.map((id) => {
        const el = document.getElementById(id);
        if (!el) return { id, position: 0 };
        const center = el.offsetTop + el.offsetHeight / 2;
        const position = Math.min(
          1,
          Math.max(0, center / docHeight)
        );
        return { id, position };
      });

      setTicks(next);
    };

    computeTicks();

    window.addEventListener("resize", computeTicks, { passive: true });

    /* Recompute once after the first paint settles — fonts may
       shift layout, and lazy 3D chunks change section heights. */
    const t1 = window.setTimeout(computeTicks, 600);
    const t2 = window.setTimeout(computeTicks, 2000);

    return () => {
      window.removeEventListener("resize", computeTicks);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [reduced]);

  /* ---------- Track scroll progress into a CSS variable ---------- */
  useEffect(() => {
    if (reduced) return undefined;

    const el = wrapperRef.current;
    if (!el) return undefined;

    let rafId = null;

    const update = () => {
      rafId = null;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        docHeight > 0 ? Math.min(1, window.scrollY / docHeight) : 0;
      el.style.setProperty("--progress", progress.toFixed(4));
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
  }, [reduced]);

  if (reduced) return null;

  return (
    <aside className="scroll-spine" ref={wrapperRef} aria-hidden="true">
      <span className="scroll-spine__line" />

      {ticks.map((tick) => (
        <span
          key={tick.id}
          className={`scroll-spine__tick${
            activeSection === tick.id ? " is-active" : ""
          }`}
          style={{ top: `${tick.position * 100}%` }}
        />
      ))}

      <span className="scroll-spine__dot" />
    </aside>
  );
}