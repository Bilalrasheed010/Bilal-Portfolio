/* ============================================================
   src/utils/gsap.js
   ------------------------------------------------------------
   Central GSAP entry point. Registers ScrollTrigger exactly
   once, exports the shared gsap instance so every future
   component uses the same registration.
   ============================================================ */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function registerGsap() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

registerGsap();

export { gsap, ScrollTrigger };
export default gsap;