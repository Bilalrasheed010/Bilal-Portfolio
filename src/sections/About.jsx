import { useEffect, useRef } from "react";
import "./About.css";

/* ============================================================
   About
   File: src/sections/About.jsx
   ------------------------------------------------------------
   Editorial spread. Large pull quote, narrow narrative column,
   three strengths separated by hairlines.

   Reveal animations are triggered once when the section enters
   the viewport — the IntersectionObserver adds `.is-in-view`,
   and CSS handles the choreography.
   ============================================================ */

const STRENGTHS = [
  {
    index: "01",
    title: "Systems Thinking",
    detail: ["Architecture", "Data modeling", "Integration"],
  },
  {
    index: "02",
    title: "Production-First",
    detail: ["Authentication", "RBAC", "Deployment"],
  },
  {
    index: "03",
    title: "Full-Stack Delivery",
    detail: ["ASP.NET MVC", "React", "SQL Server"],
  },
];

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    /* No IntersectionObserver — reveal immediately. */
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
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about"
      aria-labelledby="about-title"
    >
      <div className="container">
        <p className="about__meta">
          <span>About</span>
          <span className="about__meta-loc">Karachi, Pakistan</span>
        </p>

        <div className="about__grid">
          <h2 id="about-title" className="about__quote">
            <span className="about__quote-line">I build software</span>
            <span className="about__quote-line">that has to work</span>
            <span className="about__quote-line">
              in the real world
              <span className="about__quote-period" aria-hidden="true" />
            </span>
          </h2>

          <div className="about__narrative">
            <p>
              I&rsquo;m a full-stack developer based in Karachi. My work sits
              at the intersection of .NET backends and React frontends —
              building internal portals, examination systems, and REST APIs
              that run in production.
            </p>
            <p>
              I care about the parts that don&rsquo;t photograph well:
              role-based access, query performance, deployment, and
              long-term maintainability.
            </p>
          </div>
        </div>

        <div className="about__strengths">
          {STRENGTHS.map((item) => (
            <article key={item.index} className="about__strength">
              <span className="about__strength-index">{item.index}</span>
              <h3 className="about__strength-title">{item.title}</h3>
              <ul className="about__strength-detail">
                {item.detail.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}