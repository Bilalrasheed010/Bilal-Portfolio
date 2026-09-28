/* ============================================================
   src/data/socials.js
   ------------------------------------------------------------
   Shared social link list. Consumed by Hero (and later Footer
   and Contact). `icon` keys map to entries in Icons.jsx.
   ============================================================ */

import { PROFILE } from "./profile.js";

export const SOCIALS = [
  {
    id: "github",
    label: "GitHub",
    href: PROFILE.github,
    external: true,
    ariaLabel: "GitHub profile",
    icon: "github",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: PROFILE.linkedin,
    external: true,
    ariaLabel: "LinkedIn profile",
    icon: "linkedin",
  },
  {
    id: "email",
    label: "Email",
    href: `mailto:${PROFILE.email}`,
    external: false,
    ariaLabel: "Send an email",
    icon: "mail",
  },
];

export default SOCIALS;