"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";

/**
 * Subtle 3D pointer-tilt card (Aceternity-style). Tracks the cursor and tilts
 * on a perspective, with a soft light glare that follows the pointer. Disabled
 * for touch / reduced-motion via CSS (the transform simply stays at rest).
 */
export function TiltCard({
  children,
  className,
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glare = useMotionTemplate`radial-gradient(180px circle at ${gx}% ${gy}%, rgba(255,255,255,0.18), transparent 60%)`;

  function onMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set((0.5 - py) * max * 2);
    gx.set(px * 100);
    gy.set(py * 100);
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={`relative [transform-style:preserve-3d] ${className ?? ""}`}
    >
      {children}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 rounded-(--radius-card) opacity-0 transition-opacity duration-200 [transform:translateZ(1px)] group-hover:opacity-100"
        style={{ background: glare }}
        aria-hidden
      />
    </motion.div>
  );
}
