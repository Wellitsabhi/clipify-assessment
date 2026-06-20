"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { EASE_OUT_SOFT } from "@/app/components/motion";

/**
 * A single, smooth enter transition per route. We intentionally do NOT use
 * AnimatePresence `mode="wait"` here — waiting for the old page to exit before
 * the new one enters creates a visible flash/double-render. Instead we key a
 * single motion.div on the pathname so React swaps content and the new page
 * fades up once. Pages should not add their own page-level entrance animation.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34, ease: EASE_OUT_SOFT }}
    >
      {children}
    </motion.div>
  );
}
