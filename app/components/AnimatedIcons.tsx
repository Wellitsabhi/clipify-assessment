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

/* ---- Crafted feature/marketing icons (replace emoji) ---- */

function FeatureFrame({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft ring-1 ring-accent/15">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {children}
      </svg>
    </span>
  );
}

/** AI chat — speech bubble with a spark. */
export function AIChatIcon() {
  return (
    <FeatureFrame>
      <path d="M4 5h16v10H9l-4 4v-4H4z" />
      <path d="M14.5 8.2l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" fill="#15803d" stroke="none" />
    </FeatureFrame>
  );
}

/** Catalog — open book. */
export function CatalogIcon() {
  return (
    <FeatureFrame>
      <path d="M12 6c-1.5-1.2-3.5-1.5-6-1v12c2.5-.5 4.5-.2 6 1m0-12c1.5-1.2 3.5-1.5 6-1v12c-2.5-.5-4.5-.2-6 1m0-12v12" />
    </FeatureFrame>
  );
}

/** Plan — week calendar. */
export function CalendarWeekIcon() {
  return (
    <FeatureFrame>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 9h16M8 3v3M16 3v3M8 13h2M14 13h2M8 16.5h2M14 16.5h2" />
    </FeatureFrame>
  );
}

/** Idea — lightbulb (for the nudge banner). */
export function IdeaIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.3 1 2.1V16h6v-.4c0-.8.4-1.5 1-2.1A6 6 0 0 0 12 3Z" />
    </svg>
  );
}
