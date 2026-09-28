/* ============================================================
   src/data/education.js
   ------------------------------------------------------------
   Academic background + certifications. Real entries only.
   No invented years, issuers, or titles.

   Consumed by:
     • src/sections/Education.jsx
   ============================================================ */

export const EDUCATION = [
  {
    id: "bscs",
    degree: "Bachelor of Science in Computer Science",
    institution: "University of Sindh",
    location: "Jamshoro, Pakistan",
    period: "2020 — 2024",
    startYear: "2020",
    endYear: "2024",
    status: "Completed",
  },
];

/* ------------------------------------------------------------
   Certifications — grouped by issuer.
   Years are omitted because they were not provided; do not
   invent them.
   ------------------------------------------------------------ */
export const CERTIFICATIONS = [
  {
    id: "google",
    issuer: "Google",
    source: "Coursera",
    items: [
      "Advanced Data Analytics",
      "Data Analytics",
      "Cybersecurity",
      "Project Management",
      "UX Design",
      "IT Support",
    ],
  },
  {
    id: "aptech",
    issuer: "Aptech",
    source: "",
    items: ["Pro Python"],
  },
  {
    id: "navttc",
    issuer: "NAVTTC",
    source: "",
    items: ["Web Development"],
  },
];

export const CERTIFICATIONS_TOTAL = CERTIFICATIONS.reduce(
  (sum, group) => sum + group.items.length,
  0
);

export const EDUCATION_TOTAL = EDUCATION.length;

export default EDUCATION;