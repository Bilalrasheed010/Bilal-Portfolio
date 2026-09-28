/* ============================================================
   src/data/experience.js
   ------------------------------------------------------------
   Professional experience. Real entries only — no invented
   roles, dates, metrics, or employers.

   Each entry structure:
     id            unique key
     period        display period, e.g. "2024 — Present"
     startYear     used for sorting / markers
     role          job title
     company       organization name
     location      city, country
     status        "current" | "past"
     summary       one-line context for the role
     achievements  array of short impact statements
     pipeline      optional array of stages describing what the
                   role actually touches end-to-end
   ============================================================ */

export const EXPERIENCE = [
  {
    id: "icma",
    period: "2024 — Present",
    startYear: "2024",
    role: "Web Developer",
    company: "ICMA International",
    location: "Karachi, Pakistan",
    status: "current",
    summary:
      "Building and maintaining internal portals for students, HR, and examination workflows — end-to-end, from frontend to production deployment.",
    achievements: [
      "Developed and maintained internal portals for students, HR, and exams",
      "Built backend services and RESTful APIs",
      "Created responsive frontend interfaces",
      "Implemented role-based access control using ASP.NET Identity",
      "Optimized database queries and indexes — reduced page load times by 50%",
      "Led chatbot automation integration — reduced helpdesk tickets by 25%",
      "Deployed applications to IIS and handled post-deployment monitoring",
      "Documented APIs and workflows",
    ],
    pipeline: [
      "Frontend",
      "ASP.NET MVC",
      "Business Logic",
      "SQL Server",
      "IIS",
      "Production",
    ],
  },
];

export const EXPERIENCE_TOTAL = EXPERIENCE.length;

export default EXPERIENCE;