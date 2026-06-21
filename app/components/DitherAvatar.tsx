"use client";

/**
 * Dithered avatar tile — initials over a green ordered-dither (Bayer) pixel
 * pattern instead of a smooth gradient. Deterministic shade per name.
 */
export function DitherAvatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials =
    name
      .split(/\s+/)
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "🍳";

  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-black/10"
      style={{ width: size, height: size, background: "var(--pine)" }}
      title={name}
    >
      {/* Bayer-ish dither: two offset dot grids in lighter greens. */}
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 38%, transparent 39%), radial-gradient(currentColor 38%, transparent 39%)",
          backgroundSize: "4px 4px",
          backgroundPosition: "0 0, 2px 2px",
          color: "rgba(134,239,172,0.55)",
        }}
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(currentColor 30%, transparent 31%)",
          backgroundSize: "6px 6px",
          backgroundPosition: "1px 3px",
          color: "rgba(16,185,129,0.4)",
        }}
        aria-hidden
      />
      <span
        className="relative font-semibold text-white drop-shadow-sm"
        style={{ fontSize: Math.max(10, size * 0.36) }}
      >
        {initials}
      </span>
    </span>
  );
}
