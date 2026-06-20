"use client";

import { SunriseIcon, SunIcon, MoonIcon } from "@/app/components/icons";

/**
 * Meal-type glyph with a time-of-day association: breakfast = sunrise,
 * lunch = sun, dinner = moon. Each tints to a warm/cool hue and does a gentle
 * idle motion via custom CSS easing (defined inline per type).
 */
const MAP = {
  breakfast: { Icon: SunriseIcon, color: "#ea8c1b", anim: "meal-rise" },
  lunch: { Icon: SunIcon, color: "#eab308", anim: "meal-spin" },
  dinner: { Icon: MoonIcon, color: "#6366f1", anim: "meal-tilt" },
} as const;

export function MealIcon({
  type,
  size = 14,
  animated = true,
}: {
  type: string;
  size?: number;
  animated?: boolean;
}) {
  const entry = MAP[type as keyof typeof MAP];
  if (!entry) return null;
  const { Icon, color, anim } = entry;
  return (
    <span
      className={animated ? `meal-glyph ${anim}` : undefined}
      style={{ color, display: "inline-flex" }}
      aria-hidden
    >
      <Icon size={size} />
    </span>
  );
}
