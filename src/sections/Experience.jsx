import { useEffect, useRef } from "react";
import { EXPERIENCE, EXPERIENCE_TOTAL } from "../data/experience.js";
import "./Experience.css";

/* ============================================================
   Experience
   File: src/sections/Experience.jsx
   ------------------------------------------------------------
   Editorial timeline. Rows separated by hairlines. Year on the
   left, role + company on the right. Achievements as mono list
   items. Pipeline strip at the bottom of each entry showing
   the end-to-end flow of the role.
   ============================================================ */

export default function Experience() {
  const sectionRef = useRef(null);

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

  const totalPadded = String(EXPERIENCE_TOTAL).padStart(2, "0");

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="experience"
      aria-labelledby="experience-title"
    >
      <div className="container">
        {/* ---------- Meta row ---------- */}
        <p className="experience__meta">
          <span>Experience</span>
          <span className="experience__meta-count">
            {totalPadded} Role{EXPERIENCE_TOTAL === 1 ? "" : "s"}
          </span>
        </p>

        {/* ---------- Intro ---------- */}
        <p id="experience-title" className="experience__intro">
          Where I&rsquo;ve shipped production software — the roles,
          the systems, and the parts of the work that had to hold
          up in the real world.
        </p>

        {/* ---------- Timeline ---------- */}
        <ul className="experience__list">
          {EXPERIENCE.map((entry, index) => (
            <li key={entry.id} className="experience__entry">
              {/* Left column — period */}
              <div className="experience__period">
                <span className="experience__period-year">
                  {entry.startYear}
                </span>
                <span className="experience__period-range">
                  {entry.period}
                </span>
                {entry.status === "current" && (
                  <span className="experience__status">
                    <span
                      className="experience__status-dot"
                      aria-hidden="true"
                    />
                    Current
                  </span>
                )}
              </div>

              {/* Right column — role, company, content */}
              <div className="experience__body">
                <header className="experience__head">
                  <h3 className="experience__role">{entry.role}</h3>
                  <p className="experience__company">
                    {entry.company}
                    <span
                      className="experience__company-sep"
                      aria-hidden="true"
                    >
                      {" — "}
                    </span>
                    <span className="experience__location">
                      {entry.location}
                    </span>
                  </p>
                </header>

                <p className="experience__summary">{entry.summary}</p>

                <ul className="experience__achievements">
                  {entry.achievements.map((line) => (
                    <li
                      key={`${entry.id}-${line}`}
                      className="experience__achievement"
                    >
                      <span
                        className="experience__achievement-mark"
                        aria-hidden="true"
                      />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>

                {entry.pipeline && entry.pipeline.length > 0 && (
                  <div className="experience__pipeline">
                    <span className="experience__pipeline-label">
                      Flow
                    </span>
                    <ul className="experience__pipeline-list">
                      {entry.pipeline.map((stage, stageIndex) => (
                        <li
                          key={`${entry.id}-${stage}`}
                          className="experience__pipeline-stage"
                        >
                          <span className="experience__pipeline-name">
                            {stage}
                          </span>
                          {stageIndex < entry.pipeline.length - 1 && (
                            <span
                              className="experience__pipeline-arrow"
                              aria-hidden="true"
                            >
                              →
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Index marker */}
              <span
                className="experience__index"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}