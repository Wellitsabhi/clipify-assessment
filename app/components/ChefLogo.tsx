import Link from "next/link";

type ChefLogoProps = {
  size?: number;
  className?: string;
  href?: string | null;
  /** kept for API compatibility with prior callers */
  priority?: boolean;
};

/**
 * Crisp inline SVG mark — a chef's toque inside a rounded square.
 * Replaces the previous 1.7MB PNG for performance and visual consistency.
 */
export default function ChefLogo({ size = 36, className = "", href = "/" }: ChefLogoProps) {
  const mark = (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[28%] bg-[var(--accent)] text-white ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        width={size * 0.62}
        height={size * 0.62}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 13.5C5.34 13.5 4 12.16 4 10.5c0-1.5 1.1-2.74 2.54-2.96A3.5 3.5 0 0 1 13 6.06 3.5 3.5 0 0 1 19.46 7.5C20.9 7.72 22 8.96 22 10.5c0 1.66-1.34 3-3 3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(-1 0)"
        />
        <path
          d="M7 13.5h10v4.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 18z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          transform="translate(-1 0)"
        />
      </svg>
    </span>
  );

  if (href === null) return mark;
  return (
    <Link href={href} className="inline-flex shrink-0" aria-label="MealPlan Pro home">
      {mark}
    </Link>
  );
}
