"use client";

import { motion } from "motion/react";

/**
 * Hand-animated SVG icons (Motion-driven) — Lottie-grade feel without external
 * JSON. On-brand, license-clean, and they actually move. Swap in real Lottie
 * later by replacing these components and keeping the same call sites.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

/** Breakfast — a sun cresting the horizon, rays breathing. */
export function SunriseAnim({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <motion.g
        stroke="#ea8c1b"
        strokeWidth="1.6"
        strokeLinecap="round"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M5 8.5 3.8 7.3M19 8.5l1.2-1.2M12 4.5V3" />
      </motion.g>
      <motion.circle
        cx="12"
        cy="13"
        r="3.4"
        fill="#fbbf24"
        animate={{ cy: [14.5, 12.5, 14.5] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <path d="M3 16.5h18M6 19.5h12" stroke="#15803d" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** Lunch — a full sun with slowly rotating rays. */
export function SunAnim({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" fill="#f59e0b" />
      <motion.g
        stroke="#eab308"
        strokeWidth="1.6"
        strokeLinecap="round"
        style={{ originX: "12px", originY: "12px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
      </motion.g>
    </svg>
  );
}

/** Dinner — a crescent moon with a drifting twinkle. */
export function MoonAnim({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <motion.path
        d="M20 13.2A8 8 0 1 1 10.5 4a6.2 6.2 0 0 0 9.5 9.2Z"
        fill="#6366f1"
        animate={{ rotate: [-4, 4, -4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "12px", originY: "12px" }}
      />
      <motion.path
        d="M16 6.5l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5z"
        fill="#c7d2fe"
        animate={{ opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "16px", originY: "8px" }}
      />
    </svg>
  );
}

export function MealTypeAnim({ type, size = 16 }: { type: string; size?: number }) {
  if (type === "breakfast") return <SunriseAnim size={size} />;
  if (type === "lunch") return <SunAnim size={size} />;
  if (type === "dinner") return <MoonAnim size={size} />;
  return null;
}

/**
 * Chef Ferraro mark — a steaming cloche/dome. Steam wisps rise on a loop.
 * Replaces the literal chef-emoji with a crafted, animated brand mark.
 */
export function ChefMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      {/* steam */}
      {[16, 24, 32].map((x, i) => (
        <motion.path
          key={x}
          d={`M${x} 16 q-2 -3 0 -6 q2 -3 0 -6`}
          stroke="#86efac"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          animate={{ opacity: [0, 0.9, 0], y: [2, -4, -8], pathLength: [0.3, 1, 0.6] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        />
      ))}
      {/* cloche dome */}
      <path
        d="M10 34a14 14 0 0 1 28 0Z"
        fill="#15803d"
      />
      <circle cx="24" cy="18" r="2" fill="#bbf7d0" />
      {/* plate */}
      <rect x="7" y="34" width="34" height="3.4" rx="1.7" fill="#166534" />
    </svg>
  );
}
