import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../utils/gsap.js";
import useReducedMotion from "../hooks/useReducedMotion.js";
import { PROJECTS } from "../data/projects.js";
import "./Projects.css";

/* ============================================================
   Projects
   File: src/sections/Projects.jsx
   ------------------------------------------------------------
   Interactive architecture atlas.

   Layout:
     • Left column   — project selector (tablist)
     • Right column  — active project's 4-stage flow:
         Project → Stack → Features → Role / Impact

   Motion:
     • On first scroll into the section, a GSAP timeline builds
       the four stages in sequence, with connectors drawing
       between them.
     • Switching projects replays the same build animation.
     • Reduced motion renders everything immediately.

   Data source: src/data/projects.js — single source of truth.
   ============================================================ */

const STATUS_SLUG = (value) =>
  value.toLowerCase().replace(/\s+/g, "-");

export default function Projects() {
  const sectionRef = useRef(null);
  const revealedRef = useRef(false);

  const reduced = useReducedMotion();
  const [activeId, setActiveId] = useState(PROJECTS[0]?.id ?? "");
  const active = PROJECTS.find((p) => p.id === activeId) ?? PROJECTS[0];

  /* ---------- Reveal (meta, intro, selector) on scroll ---------- */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in-view");
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in-view");
            observer.disconnect();
            return;
          }
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -4% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* ---------- Build timeline for the 4-stage flow ---------- */
  useGSAP(
    () => {
      const stages = gsap.utils.toArray(".projects__stage");
      const connectors = gsap.utils.toArray(".projects__connector");

      if (!stages.length) return undefined;

      /* Reduced motion — show everything, no animation. */
      if (reduced) {
        gsap.set([...stages, ...connectors], {
          opacity: 1,
          y: 0,
          scaleX: 1,
          clearProps: "transform",
        });
        return undefined;
      }

      /* Initial hidden state */
      gsap.set(stages, { opacity: 0, y: 24 });
      gsap.set(connectors, {
        scaleX: 0,
        transformOrigin: "left center",
      });

      /* Build sequence */
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        paused: true,
      });

      tl.to(stages[0], { opacity: 1, y: 0, duration: 0.75 })
        .to(
          connectors[0],
          { scaleX: 1, duration: 0.55 },
          "-=0.35"
        )
        .to(
          stages[1],
          { opacity: 1, y: 0, duration: 0.75 },
          "-=0.30"
        )
        .to(
          connectors[1],
          { scaleX: 1, duration: 0.55 },
          "-=0.35"
        )
        .to(
          stages[2],
          { opacity: 1, y: 0, duration: 0.75 },
          "-=0.30"
        )
        .to(
          connectors[2],
          { scaleX: 1, duration: 0.55 },
          "-=0.35"
        )
        .to(
          stages[3],
          { opacity: 1, y: 0, duration: 0.75 },
          "-=0.30"
        );

      /* First-time reveal is scroll-driven; later replays are immediate */
      if (revealedRef.current) {
        tl.play();
      } else {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 55%",
          once: true,
          onEnter: () => {
            revealedRef.current = true;
            tl.play();
          },
        });
      }

      return () => {
        tl.kill();
      };
    },
    { scope: sectionRef, dependencies: [active?.id, reduced] }
  );

  if (!active) return null;

  const total = String(PROJECTS.length).padStart(2, "0");
  const statusSlug = STATUS_SLUG(active.status);

  const topStack = active.stack.slice(0, 4);
  const extraStack = Math.max(0, active.stack.length - topStack.length);
  const features = active.highlights.slice(0, 3);

  const handleSelect = (id) => {
    if (id === activeId) return;
    setActiveId(id);
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="projects"
      aria-labelledby="projects-title"
    >
      <div className="container">
        {/* ---------- Meta row ---------- */}
        <p className="projects__meta">
          <span>Selected Work</span>
          <span className="projects__meta-count">
            {total} Projects
          </span>
        </p>

        {/* ---------- Intro ---------- */}
        <p id="projects-title" className="projects__intro">
          Real systems I&rsquo;ve designed and shipped &mdash; shown
          as architecture: project, stack, features, and outcome.
        </p>

        <div className="projects__atlas">
          {/* ============================================
              LEFT — Project selector
              ============================================ */}
          <nav
            className="projects__list"
            aria-label="Projects"
            role="tablist"
          >
            {PROJECTS.map((project) => {
              const isActive = project.id === activeId;
              const slug = STATUS_SLUG(project.status);
              return (
                <button
                  key={project.id}
                  type="button"
                  role="tab"
                  id={`projects-tab-${project.id}`}
                  aria-selected={isActive}
                  aria-controls="projects-panel"
                  tabIndex={isActive ? 0 : -1}
                  className={`projects__tab${
                    isActive ? " is-active" : ""
                  }`}
                  onClick={() => handleSelect(project.id)}
                >
                  <span className="projects__tab-number">
                    {project.number}
                  </span>
                  <span className="projects__tab-title">
                    {project.title}
                  </span>
                  <span className="projects__tab-status">
                    <span
                      className={`projects__tab-dot projects__tab-dot--${slug}`}
                      aria-hidden="true"
                    />
                    <span>{project.status}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* ============================================
              RIGHT — Architecture flow
              ============================================ */}
          <div
            id="projects-panel"
            className="projects__flow-wrap"
            role="tabpanel"
            aria-labelledby={`projects-tab-${active.id}`}
          >
            <div className="projects__flow-stage" key={active.id}>
              {/* ---------- 01 — Project ---------- */}
              <article className="projects__stage">
                <header className="projects__stage-head">
                  <span
                    className="projects__stage-marker"
                    aria-hidden="true"
                  />
                  <span className="projects__stage-index">01</span>
                  <span className="projects__stage-label">Project</span>
                </header>
                <div className="projects__stage-body">
                  <h3 className="projects__stage-title">
                    {active.title}
                  </h3>
                  <p className="projects__stage-tagline">
                    {active.tagline}
                  </p>
                </div>
              </article>

              <div
                className="projects__connector"
                aria-hidden="true"
              />

              {/* ---------- 02 — Stack ---------- */}
              <article className="projects__stage">
                <header className="projects__stage-head">
                  <span
                    className="projects__stage-marker"
                    aria-hidden="true"
                  />
                  <span className="projects__stage-index">02</span>
                  <span className="projects__stage-label">Stack</span>
                </header>
                <div className="projects__stage-body">
                  <p className="projects__stack-text">
                    {topStack.join(" · ")}
                    {extraStack > 0 && (
                      <>
                        {" · "}
                        <span className="projects__stack-more">
                          +{extraStack}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </article>

              <div
                className="projects__connector"
                aria-hidden="true"
              />

              {/* ---------- 03 — Features ---------- */}
              <article className="projects__stage">
                <header className="projects__stage-head">
                  <span
                    className="projects__stage-marker"
                    aria-hidden="true"
                  />
                  <span className="projects__stage-index">03</span>
                  <span className="projects__stage-label">Features</span>
                </header>
                <div className="projects__stage-body">
                  <ul className="projects__features">
                    {features.map((line) => (
                      <li
                        key={`${active.id}-${line}`}
                        className="projects__feature"
                      >
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>

              <div
                className="projects__connector"
                aria-hidden="true"
              />

              {/* ---------- 04 — Role / Impact ---------- */}
              <article className="projects__stage">
                <header className="projects__stage-head">
                  <span
                    className="projects__stage-marker"
                    aria-hidden="true"
                  />
                  <span className="projects__stage-index">04</span>
                  <span className="projects__stage-label">
                    Role / Impact
                  </span>
                </header>
                <div className="projects__stage-body">
                  <p className="projects__role">{active.role}</p>
                  <p className="projects__period">{active.period}</p>
                  <p className="projects__status-line">
                    <span
                      className={`projects__status-dot projects__status-dot--${statusSlug}`}
                      aria-hidden="true"
                    />
                    <span>{active.status}</span>
                  </p>
                </div>
              </article>
            </div>

            {/* ---------- Links ---------- */}
            {(active.links?.live || active.links?.source) && (
              <div
                className="projects__links"
                key={`links-${active.id}`}
              >
                {active.links.live && (
                  <a
                    href={active.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="projects__link projects__link--primary"
                  >
                    <span>View Live</span>
                    <span
                      className="projects__link-arrow"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </a>
                )}
                {active.links.source && (
                  <a
                    href={active.links.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="projects__link"
                  >
                    <span>Source</span>
                    <span
                      className="projects__link-arrow"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}