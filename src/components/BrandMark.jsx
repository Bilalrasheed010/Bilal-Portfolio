/* ============================================================
   BrandMark — custom MB monogram
   File: src/components/BrandMark.jsx
   ------------------------------------------------------------
   A geometric ligature. The M and B share a single vertical
   spine — the right leg of the M becomes the back of the B.
   Constructed from straight lines on a grid. No frame, no
   circle, no gradient. Just the mark.
   ============================================================ */

import "./BrandMark.css";

export default function BrandMark({ size = 32, className = "" }) {
  return (
    <svg
      className={`brand-mark ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      {/* M — left stem, apex, right stem (shared with B) */}
      <path
        className="brand-mark__m"
        d="M 5 33 L 5 7 L 13 20 L 21 7 L 21 33"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      {/* B — two outward bumps attached to the shared spine */}
      <path
        className="brand-mark__b"
        d="M 21 7 L 29 7 L 32 10 L 32 16 L 29 20 L 21 20
           M 21 20 L 30 20 L 33 25 L 33 30 L 30 33 L 21 33"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}