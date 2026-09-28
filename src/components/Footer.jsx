import { useMemo } from "react";
import BrandMark from "./BrandMark.jsx";
import { PROFILE } from "../data/profile.js";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./Icons.jsx";
import "./Footer.css";

/* ============================================================
   Footer
   File: src/components/Footer.jsx
   ------------------------------------------------------------
   Minimal and quiet. Monogram + name on the left, icon links
   on the right, then a hairline and a metadata row with a
   once-per-session build stamp.
   ============================================================ */

const SESSION_KEY = "portfolio.session";

function useSessionStamp() {
  return useMemo(() => {
    if (typeof window === "undefined") return "";
    try {
      let stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) return stored;

      const now = new Date();
      const y = now.getFullYear();
      const mo = String(now.getMonth() + 1).padStart(2, "0");
      const d = String(now.getDate()).padStart(2, "0");
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      stored = `${y}.${mo}.${d} · ${hh}:${mm}`;
      sessionStorage.setItem(SESSION_KEY, stored);
      return stored;
    } catch {
      return "";
    }
  }, []);
}

export default function Footer() {
  const year = new Date().getFullYear();
  const session = useSessionStamp();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <a
            href="#home"
            className="site-footer__brand"
            aria-label={`${PROFILE.name} — Home`}
          >
            <BrandMark size={22} />
            <span className="site-footer__name">{PROFILE.name}</span>
          </a>

          <nav className="site-footer__socials" aria-label="Social links">
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__social"
              aria-label="GitHub"
            >
              <GitHubIcon size={16} />
            </a>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__social"
              aria-label="LinkedIn"
            >
              <LinkedInIcon size={16} />
            </a>
            <a
              href={`mailto:${PROFILE.email}`}
              className="site-footer__social"
              aria-label="Email"
            >
              <MailIcon size={16} />
            </a>
          </nav>
        </div>

        <div className="site-footer__rule" aria-hidden="true" />

        <div className="site-footer__bottom">
          <span className="site-footer__copyright">
            © {year} {PROFILE.name}
          </span>
          {session && (
            <span className="site-footer__session">
              Session {session}
            </span>
          )}
          <span className="site-footer__meta">
            {PROFILE.location}
          </span>
        </div>
      </div>
    </footer>
  );
}