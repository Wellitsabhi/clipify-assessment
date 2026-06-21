"use client";

import ChefLogo from "@/app/components/ChefLogo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge, Spinner } from "@/app/components/ui";
import { LogoutIcon } from "@/app/components/icons";
import { GooeyNav } from "@/app/components/GooeyNav";
import { DitherAvatar } from "@/app/components/DitherAvatar";
import { useUser } from "@/app/lib/useUser";

const LINKS = [
  { href: "/recipes", label: "Recipes" },
  { href: "/chat", label: "Chef Ferraro" },
  { href: "/meal-plans", label: "Meal Plans" },
];

export default function Navbar() {
  const router = useRouter();
  const { user } = useUser(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
    }
  }

  return (
    <header className="sticky top-0 z-30 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 rounded-2xl border border-white/50 bg-surface/40 px-3 pr-2 backdrop-blur-2xl backdrop-saturate-150 sm:px-4"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0.06) 45%)",
          boxShadow:
            "inset 0 1px 0 0 rgba(255,255,255,0.75), inset 0 -1px 0 0 rgba(255,255,255,0.12), var(--shadow-md)",
        }}
      >
        <div className="flex items-center gap-5">
          <Link href="/recipes" className="group flex items-center gap-2.5">
            <span className="transition-transform duration-300 ease-(--ease-spring) group-hover:rotate-[-8deg] group-hover:scale-105">
              <ChefLogo size={32} href={null} />
            </span>
            <span className="font-display text-[18px] font-semibold tracking-tight text-foreground">
              MealPlan&nbsp;Pro
            </span>
          </Link>

          <div className="hidden md:block">
            <GooeyNav items={LINKS} />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {user?.plan === "pro" && (
            <div className="hidden sm:block">
              <Badge tone="accent">Pro</Badge>
            </div>
          )}
          {user && (
            <Link href="/settings" aria-label="Account settings" className="press">
              <DitherAvatar name={user.name || user.email} />
            </Link>
          )}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            aria-label="Log out"
            className="press inline-flex h-9 w-9 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-black/5 hover:text-foreground disabled:opacity-50"
          >
            {loggingOut ? <Spinner /> : <LogoutIcon size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      <div
        className="mx-auto mt-2 flex max-w-5xl items-center gap-1.5 overflow-x-auto rounded-xl border border-white/50 bg-surface/45 px-2 py-1.5 backdrop-blur-2xl backdrop-saturate-150 md:hidden"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.45), rgba(255,255,255,0.05) 50%)",
          boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.7), var(--shadow-sm)",
        }}
      >
        {LINKS.map((link) => (
          <MobileLink key={link.href} href={link.href} label={link.label} />
        ))}
      </div>
    </header>
  );
}

function MobileLink({ href, label }: { href: string; label: string }) {
  // Simple highlight on mobile (no gooey effect needed on small screens).
  return (
    <Link
      href={href}
      className="press shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors aria-[current=page]:bg-accent aria-[current=page]:text-white"
    >
      {label}
    </Link>
  );
}
