"use client";

import { MeshGradient } from "@paper-design/shaders-react";

/**
 * Soft animated mesh-gradient backdrop in the fresh-garden palette. Sits behind
 * content (absolutely positioned, pointer-events none) with a CSS gradient
 * underneath as a fallback before WebGL paints. Very low speed = calm, premium.
 */
export function ShaderBackground({
  className = "",
  speed = 0.18,
}: {
  className?: string;
  speed?: number;
}) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {/* fallback gradient (also covers reduced-motion) */}
      <div className="absolute inset-0 bg-garden" />
      <MeshGradient
        className="absolute inset-0 h-full w-full opacity-70 mix-blend-soft-light motion-reduce:hidden"
        colors={["#eafaf0", "#86efac", "#15803d", "#fdf3e3", "#ea8c1b"]}
        speed={speed}
        distortion={0.8}
        swirl={0.6}
      />
      {/* subtle vignette + grain for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,transparent_55%,rgba(24,36,27,0.06))]" />
    </div>
  );
}
