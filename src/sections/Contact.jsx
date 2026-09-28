import { useEffect, useRef } from "react";
import { PROFILE } from "../data/profile.js";
import {
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  WhatsAppIcon,
} from "../components/Icons.jsx";
import ContactTopology from "../components/three/ContactTopology.jsx";
import "./Contact.css";

/* ============================================================
   Contact
   File: src/sections/Contact.jsx
   ------------------------------------------------------------
   Closing scene. Editorial composition echoing the Hero.

   Channels are presented as a row of icon tiles — minimal,
   consistent with the design system's 44–56px bordered
   squares used elsewhere. Every tile is a link with a
   descriptive aria-label.

   A dimmed, slowed version of the Hero topology returns as a
   bookend. It sits behind the content, non-interactive.
   ============================================================ */

const CHANNELS = [
  {
    id: "email",
    label: "Email",
    href: `mailto:${PROFILE.email}`,
    external: false,
    Icon: MailIcon,
    accent: true,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: "https://wa.me/923133760797",
    external: true,
    Icon: WhatsAppIcon,
    accent: false,
  },
  {
    id: "github",
    label: "GitHub",
    href: PROFILE.github,
    external: true,
    Icon: GitHubIcon,
    accent: false,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: PROFILE.linkedin,
    external: true,
    Icon: LinkedInIcon,
    accent: false,
  },
];

export default function Contact() {
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

  const channelCount = String(CHANNELS.length).padStart(2, "0");

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="contact"
      aria-labelledby="contact-title"
    >
      <ContactTopology />

      <div className="container">
        {/* ---------- Meta row ---------- */}
        <p className="contact__meta">
          <span>Contact</span>
          <span className="contact__meta-status">
            <span
              className="contact__meta-dot"
              aria-hidden="true"
            />
            <span>
              {PROFILE.location} &middot; Available for work
            </span>
          </span>
        </p>

        {/* ---------- Lead: title + intro ---------- */}
        <div className="contact__lead">
          <h2 id="contact-title" className="contact__title">
            <span className="contact__title-line">
              Let&rsquo;s build
            </span>
            <span className="contact__title-line">something</span>
            <span className="contact__title-line">
              meaningful
              <span
                className="contact__period"
                aria-hidden="true"
              />
            </span>
          </h2>

          <p className="contact__intro">
            Have a project, an opportunity, or just want to say
            hello? The fastest way to reach me is email &mdash; or
            message me on WhatsApp.
          </p>
        </div>

        {/* ---------- Channels ---------- */}
        <div className="contact__channels">
          <header className="contact__channels-head">
            <span className="contact__channels-label">
              Start a conversation
            </span>
            <span className="contact__channels-count">
              {channelCount} Channels
            </span>
          </header>

          <ul className="contact__channels-list">
            {CHANNELS.map((channel) => {
              const { Icon } = channel;
              return (
                <li
                  key={channel.id}
                  className={`contact__channel${
                    channel.accent
                      ? " contact__channel--accent"
                      : ""
                  }`}
                >
                  <a
                    href={channel.href}
                    target={
                      channel.external ? "_blank" : undefined
                    }
                    rel={
                      channel.external
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="contact__channel-link"
                    aria-label={`${channel.label} — ${PROFILE.name}`}
                  >
                    <span
                      className="contact__channel-tile"
                      aria-hidden="true"
                    >
                      <Icon size={20} />
                    </span>
                    <span className="contact__channel-label">
                      {channel.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ---------- Footnote ---------- */}
        <p className="contact__footnote">
          {PROFILE.name} &middot; Built with React + Vite
        </p>
      </div>
    </section>
  );
}