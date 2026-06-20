"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { EASE_OUT_SOFT } from "@/app/components/motion";

/**
 * Smooth enter/exit transition between routes within the app shell. Keyed on
 * pathname so each page animates in as the previous one fades out.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.32, ease: EASE_OUT_SOFT }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
