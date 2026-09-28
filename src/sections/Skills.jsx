import { useEffect, useMemo, useRef, useState } from "react";
import { SKILLS, SKILLS_TOTAL } from "../data/skills.js";
import { getProjectsUsingTech } from "../data/projects.js";
import "./Skills.css";

/* ============================================================
   Skills
   File: src/sections/Skills.jsx
   ------------------------------------------------------------
   Editorial technical index. Category rows separated by
   hairlines. Numbers on the left, category names on the
   right, technologies flowing as mono text.

   Hover / focus / tap on any technology:
     • updates the context strip showing which real projects
       use it (sourced from src/data/projects.js)
     • tints the parent category's number and label to accent
       — visually connects the tech to its category.
   ============================================================ */

export default function Skills() {
  const sectionRef = useRef(null);
  const [activeTech, setActiveTech] = useState(null);

  /* ---------- Reveal once when the section enters the viewport ---------- */
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
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* ---------- Projects using the active technology ---------- */
  const activeProjects = useMemo(
    () => (activeTech ? getProjectsUsingTech(activeTech) : []),
    [activeTech]
  );

  /* ---------- Category that contains the active technology ---------- */
  const activeCategoryId = useMemo(() => {
    if (!activeTech) return null;
    for (const category of SKILLS) {
      if (category.items.includes(activeTech)) return category.id;
    }
    return null;
  }, [activeTech]);

  const totalPadded = String(SKILLS_TOTAL).padStart(2, "0");

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="skills"
      aria-labelledby="skills-title"
    >
      <div className="container">
        {/* ---------- Meta row ---------- */}
        <p className="skills__meta">
          <span>Skills</span>
          <span className="skills__meta-index">
            Index / {totalPadded}
          </span>
        </p>

        {/* ---------- Intro ---------- */}
        <p id="skills-title" className="skills__intro">
          A working index of the technologies I use to build and ship
          production web applications.
        </p>

        {/* ---------- Categories ---------- */}
        <ul className="skills__list">
          {SKILLS.map((category) => {
            const isCategoryActive = activeCategoryId === category.id;
            return (
              <li
                key={category.id}
                className={`skills__category${
                  isCategoryActive ? " is-active" : ""
                }`}
              >
                <header className="skills__category-head">
                  <span className="skills__category-number">
                    {category.number} / {totalPadded}
                  </span>
                  <h3 className="skills__category-label">
                    {category.label}
                  </h3>
                </header>

                <div
                  className="skills__category-rule"
                  aria-hidden="true"
                />

                <ul className="skills__techs">
                  {category.items.map((tech) => {
                    const isActive = activeTech === tech;
                    return (
                      <li
                        key={`${category.id}-${tech}`}
                        className="skills__tech-item"
                      >
                        <button
                          type="button"
                          className={`skills__tech${
                            isActive ? " is-active" : ""
                          }`}
                          onMouseEnter={() => setActiveTech(tech)}
                          onMouseLeave={() => setActiveTech(null)}
                          onFocus={() => setActiveTech(tech)}
                          onBlur={() => setActiveTech(null)}
                          aria-describedby="skills-context"
                        >
                          {tech}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>

        {/* ---------- Context strip ---------- */}
        <div
          id="skills-context"
          className="skills__context"
          aria-live="polite"
        >
          {activeTech ? (
            <span className="skills__context-line">
              <span className="skills__context-tech">{activeTech}</span>
              {activeProjects.length > 0 ? (
                <>
                  <span
                    className="skills__context-sep"
                    aria-hidden="true"
                  >
                    {" — "}
                  </span>
                  <span className="skills__context-label">Used in </span>
                  <span className="skills__context-projects">
                    {activeProjects.map((project, index) => (
                      <span key={project.id}>
                        {index > 0 && ", "}
                        {project.title}
                      </span>
                    ))}
                  </span>
                </>
              ) : (
                <>
                  <span
                    className="skills__context-sep"
                    aria-hidden="true"
                  >
                    {" — "}
                  </span>
                  <span className="skills__context-empty">
                    Not yet applied in a shipped project
                  </span>
                </>
              )}
            </span>
          ) : (
            <span className="skills__context-hint">
              Select a technology to see where it&rsquo;s used.
            </span>
          )}
        </div>
      </div>
    </section>
  );
}