import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "./utils/gsap.js";
import useReducedMotion from "./hooks/useReducedMotion.js";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnimatedBackground from "./components/AnimatedBackground";
import CustomCursor from "./components/CustomCursor";
import ScrollSpine from "./components/ScrollSpine";
import BootSequence from "./components/BootSequence";
import ReadingProgress from "./components/ReadingProgress";
import About from "./sections/About.jsx";
import Skills from "./sections/Skills.jsx";
import Experience from "./sections/Experience.jsx";
import Projects from "./sections/Projects.jsx";
import Education from "./sections/Education.jsx";
import Contact from "./sections/Contact.jsx";

/* ============================================================
   Bilal Portfolio — Application Shell
   File: src/App.jsx
   ------------------------------------------------------------
   Shell only. Sections live under src/sections/*.

   Global motion:
     • BootSequence — first visit only.
     • Section parallax — every section except Hero.
     • ScrollSpine — fixed dot tracking scroll progress.
     • CustomCursor — desktop only.
     • ReadingProgress — thin bar pinned to the top.
   ============================================================ */

const PARALLAX_SECTION_IDS = [
  "about",
  "skills",
  "experience",
  "projects",
  "education",
  "contact",
];

export default function App() {
  const appRef = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      const sections = PARALLAX_SECTION_IDS.map((id) =>
        document.getElementById(id)
      ).filter(Boolean);

      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0.35, y: 60 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              end: "top 45%",
              scrub: 1,
            },
          }
        );
      });

      const refresh = () => ScrollTrigger.refresh();
      const t1 = window.setTimeout(refresh, 700);
      const t2 = window.setTimeout(refresh, 2400);

      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
      };
    },
    { scope: appRef, dependencies: [reduced] }
  );

  return (
    <div className="app" ref={appRef}>
      <AnimatedBackground />

      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <BootSequence />
      <ReadingProgress />

      <Navbar />
      <ScrollSpine />

      <main id="main" className="app__main">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>

      <Footer />

      <CustomCursor />
    </div>
  );
}