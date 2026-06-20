"use client";

import type { ReactNode } from "react";

/**
 * Glass surface (reactbits-inspired, CSS-only): frosted backdrop blur with a
 * bright top edge and inner highlight for a real "pane of glass" feel. Tuned to
 * the design tokens. Use for floating bars, inputs, cards over imagery.
 */
export function GlassSurface({
  children,
  className = "",
  rounded = "rounded-2xl",
}: {
  children: ReactNode;
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      className={`relative ${rounded} border border-white/40 bg-surface/55 shadow-(--shadow-md) backdrop-blur-xl ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0) 40%)",
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.6), inset 0 -1px 0 0 rgba(255,255,255,0.1), var(--shadow-md)",
      }}
    >
      {children}
    </div>
  );
}
