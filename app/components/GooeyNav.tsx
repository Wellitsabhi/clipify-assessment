"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

export interface GooeyNavItem {
  label: string;
  href: string;
}

/**
 * Nav with a single pill that slides between items (motion layoutId) — no
 * particle burst. Active derived from pathname.
 */
export function GooeyNav({ items }: { items: GooeyNavItem[] }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <ul className="flex items-center gap-1">
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <li key={item.href} className="relative">
            <Link
              href={item.href}
              className={`relative block rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ${
                active ? "text-white" : "text-muted hover:text-foreground"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
