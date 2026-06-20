"use client";

import { motion, type Transition, type Variants } from "motion/react";
import type { ReactNode } from "react";

// Shared motion language. Matches the CSS easings in globals.css so JS- and
// CSS-driven motion feel of-a-piece.
export const EASE_OUT_SOFT: Transition["ease"] = [0.22, 1, 0.36, 1];
export const EASE_SPRING: Transition["ease"] = [0.34, 1.56, 0.64, 1];

export const softTransition: Transition = {
  duration: 0.45,
  ease: EASE_OUT_SOFT,
};

/** Stagger container + child for lists/grids. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: softTransition },
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
