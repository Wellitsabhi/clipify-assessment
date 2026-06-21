"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * RotatingText (reactbits-inspired): cycles through phrases, sliding the old one
 * up and the new one in — like app push-notification copy. Pauses on reduced
 * motion (shows the first phrase).
 */
export function RotatingText({
  texts,
  interval = 2600,
  className = "",
}: {
  texts: string[];
  interval?: number;
  className?: string;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((p) => (p + 1) % texts.length), interval);
    return () => clearInterval(id);
  }, [texts.length, interval]);

  return (
    <span className={`relative inline-grid overflow-hidden align-bottom ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={i}
          className="col-start-1 row-start-1 whitespace-nowrap"
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
        >
          {texts[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
