"use client";

import ChefLogo from "@/app/components/ChefLogo";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import { Badge, Spinner } from "@/app/components/ui";
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
        <div className="flex items-center gap-6">
          <Link href="/recipes" className="group flex items-center gap-2.5">
            <span className="transition-transform duration-300 ease-(--ease-spring) group-hover:rotate-[-8deg] group-hover:scale-105">
              <ChefLogo size={32} href={null} />
            </span>
            <span className="font-display text-[18px] font-semibold tracking-tight text-foreground">
              MealPlan&nbsp;Pro
            </span>
          </Link>

          {/* Desktop nav: gap between items so active/hover pills never touch */}
          <div
            className="relative hidden items-center gap-1 md:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHovered(link.href)}
                  className="relative rounded-lg px-3.5 py-2 text-sm font-medium"
                >
                  {hovered === link.href && !active && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-lg bg-black/4"
                      transition={{ duration: 0.22, ease: EASE_OUT_SOFT }}
                    />
                  )}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-accent-soft ring-1 ring-accent/15"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span
                    className={`relative z-10 transition-colors ${
                      active ? "text-accent-hover" : "text-muted hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user && <UserChip name={user.name || user.email} plan={user.plan} />}
          {/* Icon-only logout — no tooltip (it cropped against the sticky bar) */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            aria-label="Log out"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-black/5 hover:text-foreground disabled:opacity-50"
          >
            {loggingOut ? <Spinner /> : <LogoutIcon size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-t border-border px-3 py-2 md:hidden">
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
    <div className="flex items-center gap-2.5">
      {plan === "pro" && (
        <div className="hidden sm:block">
          <Badge tone="accent">Pro</Badge>
        </div>
      )}
      {/* Avatar is the sole identity — name lives in the tooltip, not duplicated. */}
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-accent to-citrus text-[11px] font-semibold text-white shadow-(--shadow-sm) ring-2 ring-surface"
        title={name}
      >
        {initials || "🍳"}
      </span>
    </div>
  );
}
