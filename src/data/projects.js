/* ============================================================
   src/data/projects.js
   ------------------------------------------------------------
   Single source of truth for every real project.

   Consumed by:
     • src/sections/Skills.jsx  — to derive "used in" context
     • src/sections/Projects.jsx — to render the showcase
     • Any future section that references projects.

   Rules:
     • Only real projects, technologies, and associations.
     • If a technology appears in project.stack, that project
       genuinely uses it.
     • If a technology is NOT in any project.stack, the Skills
       section simply shows no "used in" context for it.
   ============================================================ */

export const PROJECTS = [
  /* ----------------------------------------------------------
     01 — EduPrep
     Flagship. Live on the web.
     ---------------------------------------------------------- */
  {
    id: "eduprep",
    number: "01",
    title: "EduPrep",
    tagline: "Online Examination & Learning Management System",
    role: "Full-Stack Developer",
    period: "2024",
    year: "2024",
    status: "Live",
    featured: true,
    stack: [
      "ASP.NET MVC",
      "C#",
      "Entity Framework 6",
      "SQL Server",
      "ASP.NET Identity",
      "RBAC",
      "Authentication",
      "Bootstrap",
      "jQuery",
      "AJAX",
      "HTML5",
      "CSS3",
      "IIS",
      "Production Deployment",
    ],
    summary:
      "A production examination platform serving four roles — Super Admin, Admin, Teacher, and Student. Built end to end: categorized question bank, timed exams with palette navigation, auto-save, auto-submit, and automated grading.",
    highlights: [
      "Four-role RBAC system with ASP.NET Identity and BCrypt password hashing",
      "Timed exams with question palette navigation, auto-save, and auto-submit",
      "Automated grading, result generation, and leaderboards",
      "Enrollment and subscription workflow with payment proof verification",
      "Bulk SQL Server data migration and IIS production deployment",
    ],
    links: {
      live: "https://eduprep.somee.com",
      source: "https://github.com/Bilalrasheed010/EduPrep",
    },
  },

  /* ----------------------------------------------------------
     02 — Chatbot Automation System
     ---------------------------------------------------------- */
  {
    id: "chatbot",
    number: "02",
    title: "Chatbot Automation System",
    tagline: "Context-aware automated response system",
    role: "Full-Stack Developer",
    period: "Dec 2024 – Feb 2025",
    year: "2024",
    status: "Shipped",
    featured: true,
    stack: [
      "ASP.NET MVC",
      "C#",
      "SQL Server",
      "RESTful APIs",
      "Authentication",
      "HTML5",
      "CSS3",
    ],
    summary:
      "An intelligent chatbot that generates context-aware responses by querying a dynamic database backend. Integrated into an internal helpdesk workflow to reduce manual ticket handling.",
    highlights: [
      "Dynamic database-driven responses rather than static reply trees",
      "Reduced helpdesk ticket volume by 25%",
    ],
    links: {},
  },

  /* ----------------------------------------------------------
     03 — Learning Management System (ICMA internal)
     ---------------------------------------------------------- */
  {
    id: "icma-lms",
    number: "03",
    title: "Learning Management System",
    tagline: "Multi-role portal for course delivery",
    role: "Full-Stack Developer",
    period: "Aug 2024 – Sep 2024",
    year: "2024",
    status: "Shipped",
    featured: false,
    stack: [
      "ASP.NET MVC",
      "C#",
      "SQL Server",
      "Bootstrap",
      "jQuery",
      "Authentication",
      "HTML5",
      "CSS3",
    ],
    summary:
      "An internal learning management system serving administrators, teachers, and students. Course management, secure login, and role-specific dashboards.",
    highlights: [
      "Admin, teacher, and student dashboards",
      "Course management and secure authentication",
    ],
    links: {},
  },

  /* ----------------------------------------------------------
     04 — Face Detection System
     ---------------------------------------------------------- */
  {
    id: "face-detection",
    number: "04",
    title: "Face Detection System",
    tagline: "Real-time computer vision demo",
    role: "Developer",
    period: "Jul 2024 – Sep 2024",
    year: "2024",
    status: "Archived",
    featured: false,
    stack: ["Python"],
    summary:
      "A real-time face detection system built with Python and OpenCV. Draws bounding boxes on a live webcam feed and reports detection coordinates and status.",
    highlights: [
      "Real-time webcam capture with Haar Cascade detection",
      "Bounding box overlay with coordinate and status readout",
    ],
    links: {},
  },

  /* ----------------------------------------------------------
     05 — Advanced LMS (Final Year Project)
     ---------------------------------------------------------- */
  {
    id: "fyp-lms",
    number: "05",
    title: "Advanced LMS",
    tagline: "Final year project — Laravel learning platform",
    role: "Full-Stack Developer",
    period: "Nov 2023 – Feb 2024",
    year: "2023",
    status: "Archived",
    featured: false,
    stack: [
      "PHP",
      "Laravel",
      "Bootstrap",
      "JavaScript",
      "HTML5",
      "CSS3",
    ],
    summary:
      "A learning management platform built with PHP Laravel as a final year project. Quizzes, student progress tracking, content uploads, and admin controls.",
    highlights: [
      "Quizzes and student progress tracking",
      "Content uploads and admin controls",
      "Responsive architecture with Bootstrap",
    ],
    links: {},
  },

  /* ----------------------------------------------------------
     06 — Bilal Portfolio
     This site.
     ---------------------------------------------------------- */
  {
    id: "portfolio",
    number: "06",
    title: "Bilal Portfolio",
    tagline: "This site — React, Vite, Three.js",
    role: "Designer & Developer",
    period: "2025",
    year: "2025",
    status: "Live",
    featured: false,
    stack: [
      "React",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Git",
    ],
    summary:
      "A custom editorial portfolio built with React and Vite. Features a WebGL lattice scene, GSAP scroll choreography, and a custom design system.",
    highlights: [],
    links: {
      source: "https://github.com/Bilalrasheed010",
    },
  },
];

/* ------------------------------------------------------------
   Helper — returns every project whose stack includes a
   given technology. Matching is case-sensitive; technology
   names must match the strings in project.stack exactly.
   ------------------------------------------------------------ */
export function getProjectsUsingTech(techName) {
  if (!techName) return [];
  return PROJECTS.filter((project) =>
    Array.isArray(project.stack) && project.stack.includes(techName)
  );
}

/* ------------------------------------------------------------
   Convenience — returns the featured projects only.
   ------------------------------------------------------------ */
export function getFeaturedProjects() {
  return PROJECTS.filter((project) => project.featured === true);
}

export default PROJECTS;