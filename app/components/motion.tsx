"use client";

import { motion, type Transition, type Variants } from "motion/react";
import type { ReactNode } from "react";

// Shared motion language — Emil's stronger curves. Matches globals.css so JS-
// and CSS-driven motion feel of-a-piece.
export const EASE_OUT: Transition["ease"] = [0.23, 1, 0.32, 1];
export const EASE_IN_OUT: Transition["ease"] = [0.77, 0, 0.175, 1];
export const EASE_OUT_SOFT: Transition["ease"] = EASE_OUT; // back-compat
export const EASE_SPRING: Transition["ease"] = [0.34, 1.56, 0.64, 1];

export const softTransition: Transition = {
  duration: 0.4,
  ease: EASE_OUT,
};

/** Stagger container + child for lists/grids (short delays per Emil: 30-80ms). */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: softTransition },
  // Exit faster than enter (Emil): snappy removal.
  exit: { opacity: 0, y: 6, transition: { duration: 0.18, ease: EASE_OUT } },
};

/** Simple entrance fade-up. */
export function FadeIn({
  children,
  delay = 0,
  className,
  y = 10,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...softTransition, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Per-route entrance transition for page content. */
export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_OUT_SOFT }}
    >
      {children}
    </motion.div>
  );
}
