/* ============================================================
   src/data/skills.js
   ------------------------------------------------------------
   Technical index. Grouped by category.

   Every technology name matches the strings used in
   src/data/projects.js so that getProjectsUsingTech() can
   resolve associations by exact string equality.
   ============================================================ */

export const SKILLS = [
  {
    id: "languages",
    number: "01",
    label: "Languages",
    items: ["C#", "JavaScript", "Python", "PHP"],
  },
  {
    id: "backend",
    number: "02",
    label: "Backend",
    items: ["ASP.NET MVC", "ASP.NET Identity", "RESTful APIs", "Laravel"],
  },
  {
    id: "frontend",
    number: "03",
    label: "Frontend",
    items: [
      "HTML5",
      "CSS3",
      "Bootstrap",
      "JavaScript",
      "jQuery",
      "AJAX",
      "React",
    ],
  },
  {
    id: "database",
    number: "04",
    label: "Database",
    items: ["SQL Server", "MySQL", "Entity Framework 6", "LINQ"],
  },
  {
    id: "tools",
    number: "05",
    label: "Tools",
    items: ["Git", "Visual Studio", "IIS", "SQL Server Management Studio"],
  },
  {
    id: "concepts",
    number: "06",
    label: "Concepts",
    items: [
      "Authentication",
      "RBAC",
      "Database Design",
      "API Development",
      "Production Deployment",
      "Agile Methodologies",
    ],
  },
];

export const SKILLS_TOTAL = SKILLS.length;

export default SKILLS;