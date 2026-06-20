"use client";

import { motion } from "motion/react";
import { EASE_OUT } from "@/app/components/motion";

/**
 * BlurText (reactbits-inspired): reveals text word-by-word with a blur→sharp
 * transition. Great for headlines and first impressions. Respects reduced motion
 * via motion's global settings.
 */
export function BlurText({
  text,
  className = "",
  delay = 0,
  stagger = 0.04,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "span" | "h1" | "h2" | "p";
}) {
  const words = text.split(" ");
  const MotionTag = motion[Tag];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          variants={{
            hidden: { opacity: 0, filter: "blur(8px)", y: 6 },
            show: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
          }}
          aria-hidden
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </MotionTag>
  );
}
