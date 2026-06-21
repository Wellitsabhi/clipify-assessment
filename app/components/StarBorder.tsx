"use client";

import type { ElementType, ReactNode } from "react";

/**
 * StarBorder (reactbits, adapted): an animated glow that travels around the
 * border. Use to make a CTA pop. `color` is the glow color.
 */
export function StarBorder({
  as,
  className = "",
  color = "#86efac",
  speed = "5s",
  children,
  innerClassName = "",
  ...rest
}: {
  as?: ElementType;
  className?: string;
  color?: string;
  speed?: string;
  children: ReactNode;
  innerClassName?: string;
  [key: string]: unknown;
}) {
  const Comp = (as ?? "button") as ElementType;
  return (
    <Comp className={`star-border ${className}`} {...rest}>
      <div
        className="sb-bottom"
        style={{ background: `radial-gradient(circle, ${color}, transparent 10%)`, animationDuration: speed }}
      />
      <div
        className="sb-top"
        style={{ background: `radial-gradient(circle, ${color}, transparent 10%)`, animationDuration: speed }}
      />
      <div className={`sb-inner ${innerClassName}`}>{children}</div>
    </Comp>
  );
}
