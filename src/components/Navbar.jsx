import { useEffect, useRef, useState } from "react";
import useIsMobile from "../hooks/useIsMobile.js";
import useActiveSection from "../hooks/useActiveSection.js";
import BrandMark from "./BrandMark.jsx";
import { PROFILE } from "../data/profile.js";
import "./Navbar.css";

/* ============================================================
   Navbar
   File: src/components/Navbar.jsx
   ------------------------------------------------------------
   Editorial navbar.
     • Mono uppercase links, no pills, no glass glow.
     • Active link marked by a 1px accent rule that slides.
     • Active link also reveals a tiny chapter subtitle beneath
       it (e.g. "05 / Case Studies").
     • On scroll: subtle surface + hairline appear.
   ============================================================ */

const NAV_LINKS = [
  {
    id: "home",
    label: "Home",
    index: "01",
    chapter: "Introduction",
    href: "#home",
  },
  {
    id: "about",
    label: "About",
    index: "02",
    chapter: "Profile",
    href: "#about",
  },
  {
    id: "skills",
    label: "Skills",
    index: "03",
    chapter: "Stack",
    href: "#skills",
  },
  {
    id: "experience",
    label: "Experience",
    index: "04",
    chapter: "Career",
    href: "#experience",
  },
  {
    id: "projects",
    label: "Projects",
    index: "05",
    chapter: "Case Studies",
    href: "#projects",
  },
  {
    id: "education",
    label: "Education",
    index: "06",
    chapter: "Background",
    href: "#education",
  },
  {
    id: "contact",
    label: "Contact",
    index: "07",
    chapter: "Get in touch",
    href: "#contact",
  },
];

const SECTION_IDS = NAV_LINKS.map((link) => link.id);

export default function Navbar() {
  const isMobile = useIsMobile(860);
  const activeSection = useActiveSection(SECTION_IDS);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const linksRef = useRef(null);
  const linkRefs = useRef(new Map());
  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
    ready: false,
  });

  useEffect(() => {
    let rafId = null;

    const update = () => {
      rafId = null;
      setScrolled((prev) => {
        const next = window.scrollY > 16;
        return prev === next ? prev : next;
      });
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (!isMobile && menuOpen) setMenuOpen(false);
  }, [isMobile, menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (isMobile) {
      setIndicator((prev) =>
        prev.ready ? { ...prev, ready: false } : prev
      );
      return;
    }
    const wrapper = linksRef.current;
    const link = linkRefs.current.get(activeSection);
    if (!wrapper || !link) return;

    const wRect = wrapper.getBoundingClientRect();
    const lRect = link.getBoundingClientRect();

    setIndicator({
      left: lRect.left - wRect.left,
      width: lRect.width,
      ready: true,
    });
  }, [activeSection, isMobile]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`navbar${scrolled ? " is-scrolled" : ""}${
        menuOpen ? " is-open" : ""
      }`}
    >
      <div className="container navbar__inner">
        <a
          href="#home"
          onClick={closeMenu}
          className="navbar__brand"
          aria-label={`${PROFILE.name} — Home`}
        >
          <BrandMark size={26} />
          <span className="navbar__brand-name">{PROFILE.name}</span>
        </a>

        {!isMobile && (
          <nav
            className="navbar__links"
            ref={linksRef}
            aria-label="Primary"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                ref={(el) => {
                  if (el) linkRefs.current.set(link.id, el);
                  else linkRefs.current.delete(link.id);
                }}
                href={link.href}
                className={`navbar__link${
                  activeSection === link.id ? " is-active" : ""
                }`}
              >
                <span className="navbar__link-label">
                  {link.label}
                </span>
                <span
                  className="navbar__link-chapter"
                  aria-hidden="true"
                >
                  {link.index} / {link.chapter}
                </span>
              </a>
            ))}
            <span
              className="navbar__indicator"
              aria-hidden="true"
              style={{
                transform: `translateX(${indicator.left}px)`,
                width: `${indicator.width}px`,
                opacity: indicator.ready ? 1 : 0,
              }}
            />
          </nav>
        )}

        <div className="navbar__actions">
          {!isMobile && (
            <a
              href={PROFILE.resume}
              download
              className="navbar__resume"
            >
              <span>Resume</span>
              <span className="navbar__resume-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          )}

          {isMobile && (
            <button
              type="button"
              className="navbar__toggle"
              aria-label={
                menuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="navbar__toggle-icon" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          )}
        </div>
      </div>

      {isMobile && menuOpen && (
        <div
          id="mobile-menu"
          className="navbar__drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="container navbar__drawer-inner">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={closeMenu}
                className={`navbar__drawer-link${
                  activeSection === link.id ? " is-active" : ""
                }`}
              >
                <span className="navbar__drawer-index">
                  {link.index}
                </span>
                <span className="navbar__drawer-label">
                  {link.label}
                </span>
                <span
                  className="navbar__drawer-arrow"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </a>
            ))}

            <a
              href={PROFILE.resume}
              download
              onClick={closeMenu}
              className="navbar__drawer-resume"
            >
              <span>Download Resume</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}