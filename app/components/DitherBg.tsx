"use client";

/**
 * Dither background (reactbits-inspired, CSS-only). An ordered Bayer-style dot
 * matrix in the accent color, faded with a mask. Pure CSS so it's cheap and
 * always renders (no WebGL). Layer it over a solid/aurora bg for retro-digital
 * texture without a section separator.
 */
export function DitherBg({
  className = "",
  color = "rgba(21,128,61,0.16)",
  size = 3,
}: {
  className?: string;
  color?: string;
  size?: number;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden
      style={{
        backgroundImage: `radial-gradient(${color} 1px, transparent 1px), radial-gradient(${color} 1px, transparent 1px)`,
        backgroundSize: `${size * 2}px ${size * 2}px`,
        backgroundPosition: `0 0, ${size}px ${size}px`,
      }}
    />
  );
}
