import { useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../utils/gsap.js";
import useReducedMotion from "../hooks/useReducedMotion.js";
import { PROFILE } from "../data/profile.js";
import HeroTopology from "./three/HeroTopology.jsx";
import "./Hero.css";

/* ============================================================
   Hero — Muhammad Bilal
   File: src/components/Hero.jsx
   ------------------------------------------------------------
   Editorial composition. The name is the design.
   An interactive technology topology sits behind the type.

   Motion:
     • Entrance — GSAP timeline on mount. On first visit, a
       delay matches the BootSequence duration so the entrance
       is not hidden behind the boot overlay.
     • Scroll — ScrollTrigger scrub timeline on hero exit.
     • Ambient — CSS keyframes on inner spans GSAP does not
       touch, so nothing conflicts.
     • Reduced motion — everything renders static.
   ============================================================ */

export default function Hero() {
  const heroRef = useRef(null);
  const reduced = useReducedMotion();

  /* Delay the entrance to match BootSequence on first visit
     so the composition appears after the overlay fades. */
  const bootDelay = useMemo(() => {
    if (typeof window === "undefined") return 0;
    try {
      return sessionStorage.getItem("portfolio.booted") ? 0 : 1.6;
    } catch {
      return 0;
    }
  }, []);

  useGSAP(
    () => {
      if (reduced) {
        gsap.set(
          [
            ".hero__meta",
            ".hero__name-line",
            ".hero__period",
            ".hero__role",
            ".hero__statement",
            ".hero__action",
            ".hero__scroll",
            ".hero__guide",
            ".hero-topology",
          ],
          { clearProps: "all", opacity: 1 }
        );
        return;
      }

      gsap.set(".hero__meta", { y: 14, opacity: 0 });
      gsap.set(".hero__name-line", { y: 48, opacity: 0 });
      gsap.set(".hero__period", {
        scale: 0,
        opacity: 0,
        transformOrigin: "center center",
      });
      gsap.set(".hero__role", { y: 12, opacity: 0 });
      gsap.set(".hero__statement", { y: 12, opacity: 0 });
      gsap.set(".hero__action", { y: 14, opacity: 0 });
      gsap.set(".hero__scroll", { y: 12, opacity: 0 });
      gsap.set(".hero__guide", {
        scaleY: 0,
        opacity: 0,
        transformOrigin: "top center",
      });
      gsap.set(".hero-topology", { opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        delay: bootDelay,
      });

      tl
        .to(".hero__meta", { y: 0, opacity: 1, duration: 0.65 })
        .to(
          ".hero__guide",
          { scaleY: 1, opacity: 1, duration: 1.15 },
          "-=0.40"
        )
        .to(
          ".hero__name-line",
          { y: 0, opacity: 1, duration: 1.15, stagger: 0.14 },
          "-=0.85"
        )
        .to(
          ".hero__period",
          {
            scale: 1,
            opacity: 1,
            duration: 0.55,
            ease: "back.out(2.2)",
          },
          "-=0.45"
        )
        .to(
          ".hero__role",
          { y: 0, opacity: 1, duration: 0.65 },
          "-=0.35"
        )
        .to(
          ".hero__statement",
          { y: 0, opacity: 1, duration: 0.65 },
          "-=0.55"
        )
        .to(
          ".hero__action",
          { y: 0, opacity: 1, duration: 0.65, stagger: 0.08 },
          "-=0.50"
        )
        .to(
          ".hero__scroll",
          { y: 0, opacity: 1, duration: 0.65 },
          "-=0.40"
        )
        .to(
          ".hero-topology",
          { opacity: 1, duration: 1.6 },
          "-=1.30"
        );

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      scrollTl
        .to(".hero__meta", { y: -20, opacity: 0 }, 0)
        .to(
          ".hero__name",
          { y: -70, scale: 0.955, transformOrigin: "left top" },
          0
        )
        .to(".hero__brief", { y: -32, opacity: 0.2 }, 0)
        .to(".hero__actions", { y: -22, opacity: 0 }, 0)
        .to(".hero__scroll", { y: -10, opacity: 0 }, 0)
        .to(".hero__guide", { opacity: 0 }, 0)
        .to(".hero-topology", { y: -50, scale: 1.08 }, 0);
    },
    { scope: heroRef, dependencies: [reduced] }
  );

  return (
    <section
      id="home"
      ref={heroRef}
      className="hero"
      aria-labelledby="hero-title"
    >
      <HeroTopology />

      <div className="hero__inner">
        <p className="hero__meta">
          <span>{PROFILE.location}</span>
          <span className="hero__meta-sep" aria-hidden="true">
            ·
          </span>
          <span className="hero__meta-status">
            <span className="hero__meta-dot" aria-hidden="true" />
            <span>Available for work</span>
          </span>
        </p>

        <div className="hero__grid">
          <span className="hero__guide" aria-hidden="true" />

          <h1 id="hero-title" className="hero__name">
            <span className="hero__name-line">
              <span className="hero__name-breath">Muhammad</span>
            </span>
            <span className="hero__name-line">
              <span className="hero__name-breath">
                Bilal
                <span className="hero__period" aria-hidden="true" />
              </span>
            </span>
          </h1>

          <div className="hero__brief">
            <p className="hero__role">{PROFILE.role}</p>
            <p className="hero__statement">{PROFILE.intro}</p>
          </div>

          <div className="hero__actions">
            <a
              href="#projects"
              className="hero__action hero__action--primary"
              aria-label="View selected work"
            >
              <span>View Work</span>
              <span className="hero__action-arrow" aria-hidden="true">
                →
              </span>
            </a>
            <a
              href="#contact"
              className="hero__action"
              aria-label="Get in touch"
            >
              <span>Get in Touch</span>
              <span className="hero__action-arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>

          <div className="hero__scroll" aria-hidden="true">
            <span className="hero__scroll-label">Scroll</span>
            <span className="hero__scroll-line" />
          </div>
        </div>
      </div>
    </section>
  );
}