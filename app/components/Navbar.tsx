"use client";

import ChefLogo from "@/app/components/ChefLogo";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import { Badge, IconButton, Spinner } from "@/app/components/ui";
import { LogoutIcon } from "@/app/components/icons";
import { useUser } from "@/app/lib/useUser";
import { EASE_OUT_SOFT } from "@/app/components/motion";

const LINKS = [
  { href: "/recipes", label: "Recipes" },
  { href: "/chat", label: "Chef Ferraro" },
  { href: "/meal-plans", label: "Meal Plans" },
  { href: "/settings", label: "Settings" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
    }
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-surface/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-5">
          <Link href="/recipes" className="group flex items-center gap-2.5">
            <span className="transition-transform duration-300 ease-(--ease-spring) group-hover:rotate-[-8deg] group-hover:scale-105">
              <ChefLogo size={32} href={null} />
            </span>
            <span className="font-display text-[17px] font-semibold tracking-tight text-foreground">
              MealPlan&nbsp;Pro
            </span>
          </Link>

          {/* Desktop nav with sliding active pill + hover follow */}
          <div
            className="relative hidden items-center md:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHovered(link.href)}
                  className="relative px-3.5 py-2 text-sm font-medium"
                >
                  {/* hover highlight */}
                  {hovered === link.href && !active && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-lg bg-black/5"
                      transition={{ duration: 0.25, ease: EASE_OUT_SOFT }}
                    />
                  )}
                  {/* active pill */}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-accent-soft ring-1 ring-accent/15"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span
                    className={`relative z-10 transition-colors ${
                      active
                        ? "text-accent-hover"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user && <UserChip name={user.name || user.email} plan={user.plan} />}
          {loggingOut ? (
            <span className="inline-flex h-9 w-9 items-center justify-center text-subtle">
              <Spinner />
            </span>
          ) : (
            <IconButton label="Log out" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          )}
        </div>
      </nav>

      {/* Mobile nav */}
      <div className="flex items-center gap-1 overflow-x-auto border-t border-border px-3 py-2 md:hidden">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive(link.href) ? "bg-accent-soft text-accent-hover" : "text-muted"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}

function UserChip({ name, plan }: { name: string; plan: string }) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="hidden items-center gap-2.5 sm:flex">
      {plan === "pro" && <Badge tone="accent">Pro</Badge>}
      <span className="max-w-35 truncate text-sm text-muted">{name}</span>
      {/* Playful avatar: gradient chip with a gentle idle bob */}
      <motion.span
        className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-accent to-citrus text-[11px] font-semibold text-white shadow-(--shadow-sm)"
        animate={{ y: [0, -1.5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.08, rotate: -4 }}
      >
        {initials || "🍳"}
      </motion.span>
    </div>
  );
}
