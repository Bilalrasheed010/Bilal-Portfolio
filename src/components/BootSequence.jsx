import { useEffect, useState } from "react";
import useReducedMotion from "../hooks/useReducedMotion.js";
import "./BootSequence.css";

/* ============================================================
   BootSequence
   File: src/components/BootSequence.jsx
   ------------------------------------------------------------
   A short, once-per-session intro that plays before the Hero.

   Phases:
     • boot — the initializing sequence is visible
     • exit — the overlay is fading out
     • done / skip — component renders nothing

   Skipped when:
     • prefers-reduced-motion is set
     • sessionStorage already has the booted flag

   Coordination with Hero:
     While `is-booting` is on <html>, Hero delays its entrance
     timeline so the two sequences do not overlap.
   ============================================================ */

const SESSION_KEY = "portfolio.booted";
const DURATION = 1900;
const EXIT_MS = 700;

export default function BootSequence() {
  const reduced = useReducedMotion();

  const [phase, setPhase] = useState(() => {
    if (typeof window === "undefined") return "skip";
    if (reduced) return "skip";
    if (sessionStorage.getItem(SESSION_KEY)) return "skip";
    return "boot";
  });

  useEffect(() => {
    if (phase !== "boot") return undefined;

    document.documentElement.classList.add("is-booting");

    const t1 = window.setTimeout(() => setPhase("exit"), DURATION);
    const t2 = window.setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setPhase("done");
    }, DURATION + EXIT_MS);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [phase]);

  useEffect(() => {
    if (phase === "exit" || phase === "done") {
      document.documentElement.classList.remove("is-booting");
    }
  }, [phase]);

  useEffect(
    () => () => {
      document.documentElement.classList.remove("is-booting");
    },
    []
  );

  if (phase === "skip" || phase === "done") return null;

  return (
    <div
      className={`boot${phase === "exit" ? " is-exiting" : ""}`}
      aria-hidden="true"
    >
      <div className="boot__content">
        <span className="boot__coord">
          KHI · 24.86°N · 67.00°E
        </span>
        <div className="boot__rule">
          <span className="boot__rule-fill" />
        </div>
        <span className="boot__label">Initializing</span>
      </div>
    </div>
  );
}