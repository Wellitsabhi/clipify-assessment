"use client";

import { useState } from "react";

// The seed fallback used for recipes without a real/generated photo.
const FALLBACK = "/images/recipes/classic-pancakes.jpg";

// Refined, food-magazine gradient pairs (muted, editorial — not candy). Chosen
// deterministically per recipe so the same dish always gets the same tile.
const GRADIENTS = [
  ["#e7f0e3", "#bcd4b0"], // sage
  ["#f3ead8", "#dcc79b"], // wheat
  ["#f0e2d4", "#d8b594"], // terracotta
  ["#e6ece6", "#b9cabc"], // herb gray
  ["#eef0d9", "#cdd49a"], // olive
  ["#e4ece9", "#aec7be"], // eucalyptus
  ["#efe6ea", "#d2b8c4"], // dusty rose
];

function pick(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

/**
 * Renders a recipe image. When there's no real photo (the seed pancake
 * placeholder) or the image fails to load, it falls back to a deterministic,
 * editorial gradient tile with the dish NAME set in display type — no emoji,
 * no mismatched stock photo. Title is shown only here (not also below).
 */
export function RecipeImage({
  src,
  title,
  className = "",
  nameClassName = "text-2xl",
}: {
  src: string;
  title: string;
  className?: string;
  nameClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  const isPlaceholder = !src || src === FALLBACK || failed;

  if (isPlaceholder) {
    const [from, to] = pick(title);
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden p-5 ${className}`}
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
        role="img"
        aria-label={title}
      >
        <span
          className={`font-display text-center leading-[1.05] font-semibold tracking-tight text-foreground/85 ${nameClassName}`}
        >
          {title}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={title}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
