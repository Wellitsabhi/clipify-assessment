"use client";

import type { ElementType, ReactNode } from "react";

/**
 * FunkyButton — a standout sticker-style button: chunky, hard offset shadow that
 * collapses on press, slight tilt on hover. Breaks the flat-design rule on
 * purpose while staying on-brand.
 */
export function FunkyButton({
  as,
  children,
  className = "",
  tone = "accent",
  ...rest
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  tone?: "accent" | "citrus";
  [key: string]: unknown;
}) {
  const Comp = (as ?? "button") as ElementType;
  const palette =
    tone === "citrus"
      ? "bg-citrus text-white [--fk-shadow:#9a5a0f] border-[#c2741a]"
      : "bg-accent text-white [--fk-shadow:#0b4f2b] border-accent-hover";
  return (
    <Comp
      className={`group/fk relative inline-flex select-none items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold tracking-tight transition-all duration-150 ease-(--ease-out) [box-shadow:3px_3px_0_0_var(--fk-shadow)] hover:-translate-y-0.5 hover:-rotate-1 hover:[box-shadow:5px_5px_0_0_var(--fk-shadow)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0_0_0_0_var(--fk-shadow)] ${palette} ${className}`}
      {...rest}
    >
      {children}
    </Comp>
  );
}
