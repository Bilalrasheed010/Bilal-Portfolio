import { useEffect, useMemo, useRef } from "react";
import {
  EDUCATION,
  EDUCATION_TOTAL,
  CERTIFICATIONS,
  CERTIFICATIONS_TOTAL,
} from "../data/education.js";
import "./Education.css";

/* ============================================================
   Education
   File: src/sections/Education.jsx
   ------------------------------------------------------------
   Editorial academic record + certification index.

   Structure:
     • Meta row
     • Intro
     • Chapter 01 — Academic
         timeline spine, glowing year, degree entry
     • Chapter 02 — Certifications
         issuer monograms, running cert indices
   ============================================================ */

export default function Education() {
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

  /* ---------- Assign a running index to every certification ---------- */
  const certGroups = useMemo(() => {
    let running = 0;
    return CERTIFICATIONS.map((group) => ({
      ...group,
      items: group.items.map((title) => {
        running += 1;
        return {
          title,
          index: String(running).padStart(2, "0"),
        };
      }),
    }));
  }, []);

  const degreeCount = String(EDUCATION_TOTAL).padStart(2, "0");
  const certCount = String(CERTIFICATIONS_TOTAL).padStart(2, "0");

  return (
    <section
      id="education"
      ref={sectionRef}
      className="education"
      aria-labelledby="education-title"
    >
      <div className="container">
        {/* ---------- Meta row ---------- */}
        <p className="education__meta">
          <span>Education</span>
          <span className="education__meta-count">
            {degreeCount} Degree · {certCount} Certifications
          </span>
        </p>

        {/* ---------- Intro ---------- */}
        <p id="education-title" className="education__intro">
          A computer science foundation, then a stack of
          certifications in the tools and methods I use day to day.
        </p>

        {/* ============================================
            Chapter 01 — Academic
            ============================================ */}
        <div className="education__chapter">
          <header className="education__chapter-head">
            <span className="education__chapter-label">Academic</span>
            <span className="education__chapter-index">
              {degreeCount}
            </span>
          </header>

          <ul className="education__list">
            {EDUCATION.map((entry) => (
              <li key={entry.id} className="education__entry">
                <div className="education__period">
                  <span
                    className="education__timeline"
                    aria-hidden="true"
                  >
                    <span className="education__timeline-spine" />
                    <span className="education__timeline-node" />
                  </span>

                  <div className="education__period-body">
                    <span className="education__period-year">
                      {entry.startYear}
                    </span>
                    <span className="education__period-range">
                      {entry.period}
                    </span>
                    {entry.status && (
                      <span className="education__status">
                        <span
                          className="education__status-dot"
                          aria-hidden="true"
                        />
                        {entry.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="education__body">
                  <h3 className="education__degree">
                    {entry.degree}
                  </h3>
                  <p className="education__institution">
                    {entry.institution}
                    <span
                      className="education__institution-sep"
                      aria-hidden="true"
                    >
                      {" — "}
                    </span>
                    <span className="education__location">
                      {entry.location}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ============================================
            Chapter 02 — Certifications
            ============================================ */}
        <div className="education__chapter education__chapter--certs">
          <header className="education__chapter-head">
            <span className="education__chapter-label">
              Certifications
            </span>
            <span className="education__chapter-index">
              {certCount}
            </span>
          </header>

          <ul className="education__certs">
            {certGroups.map((group) => {
              const monogram = group.issuer.charAt(0).toUpperCase();
              const groupCount = String(group.items.length).padStart(
                2,
                "0"
              );

              return (
                <li key={group.id} className="education__cert-group">
                  <div className="education__cert-issuer">
                    <span
                      className="education__cert-monogram"
                      aria-hidden="true"
                    >
                      {monogram}
                    </span>
                    <div className="education__cert-issuer-text">
                      <span className="education__cert-issuer-name">
                        {group.issuer}
                      </span>
                      {group.source && (
                        <span className="education__cert-issuer-source">
                          {group.source}
                        </span>
                      )}
                    </div>
                    <span className="education__cert-count">
                      {groupCount}
                    </span>
                  </div>

                  <ul className="education__cert-items">
                    {group.items.map((item) => (
                      <li
                        key={`${group.id}-${item.title}`}
                        className="education__cert-item"
                      >
                        <span className="education__cert-item-index">
                          {item.index}
                        </span>
                        <span
                          className="education__cert-item-mark"
                          aria-hidden="true"
                        />
                        <span className="education__cert-item-title">
                          {item.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}