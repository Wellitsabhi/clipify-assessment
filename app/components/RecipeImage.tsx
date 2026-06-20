"use client";

import { useState } from "react";

// The seed fallback used for recipes without a real/generated photo.
const FALLBACK = "/images/recipes/classic-pancakes.jpg";

// Warm, food-friendly gradient pairs; chosen deterministically per recipe so
// the same dish always gets the same placeholder.
const GRADIENTS = [
  ["#dcfce7", "#86efac"],
  ["#fef3c7", "#fcd34d"],
  ["#ffedd5", "#fdba74"],
  ["#fee2e2", "#fca5a5"],
  ["#ecfccb", "#bef264"],
  ["#e0f2fe", "#7dd3fc"],
  ["#fae8ff", "#e9d5ff"],
];

function pick(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

// Map common dish keywords to a representative emoji.
const EMOJI: [RegExp, string][] = [
  [/pancake|toast|waffle|breakfast/i, "🥞"],
  [/salad|greens|caesar|greek/i, "🥗"],
  [/salmon|fish|tuna|cod|tacos?/i, "🐟"],
  [/beef|steak|stew|burger/i, "🥩"],
  [/chicken|tikka|curry/i, "🍗"],
  [/pasta|carbonara|spaghetti|noodle|ramen/i, "🍝"],
  [/soup|broth|ramen|tom yum/i, "🍜"],
  [/cake|chocolate|dessert|parfait|sweet/i, "🍰"],
  [/rice|risotto|bowl/i, "🍚"],
  [/smoothie|juice|drink/i, "🥤"],
  [/veg|stir.?fry|tofu|vegan/i, "🥦"],
  [/sandwich|wrap|caprese/i, "🥪"],
  [/pork|bbq|ribs/i, "🍖"],
  [/egg|avocado/i, "🥑"],
  [/shrimp|prawn|seafood/i, "🦐"],
];

function emojiFor(title: string) {
  for (const [re, e] of EMOJI) if (re.test(title)) return e;
  return "🍽️";
}

/**
 * Renders a recipe image, but falls back to a deterministic appetizing gradient
 * + dish emoji when there's no real photo (the seed pancake placeholder) or the
 * image fails to load — so AI-created recipes never show a mismatched picture.
 */
export function RecipeImage({
  src,
  title,
  className = "",
  emojiClassName = "text-5xl",
}: {
  src: string;
  title: string;
  className?: string;
  emojiClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  const isPlaceholder = !src || src === FALLBACK || failed;

  if (isPlaceholder) {
    const [from, to] = pick(title);
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
        role="img"
        aria-label={title}
      >
        <span className={`${emojiClassName} drop-shadow-sm select-none`} aria-hidden>
          {emojiFor(title)}
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
