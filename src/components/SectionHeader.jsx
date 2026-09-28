import "./SectionHeader.css";

/* ============================================================
   SectionHeader — reusable section heading block
   File: src/components/SectionHeader.jsx
   ============================================================ */

export default function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <header className="section-header">
      {eyebrow && (
        <span className="section-header__eyebrow">{eyebrow}</span>
      )}
      {title && <h2 className="section-header__title">{title}</h2>}
      {subtitle && (
        <p className="section-header__subtitle">{subtitle}</p>
      )}
    </header>
  );
}