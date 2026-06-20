"use client";

import ChefLogo from "@/app/components/ChefLogo";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Badge, Button, Spinner } from "@/app/components/ui";
import { useUser } from "@/app/lib/useUser";

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

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
    }
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/recipes" className="flex items-center gap-2.5">
            <ChefLogo size={32} href={null} />
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
              MealPlan&nbsp;Pro
            </span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-accent-soft text-accent-hover"
                    : "text-muted hover:bg-black/4 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden items-center gap-2 sm:flex">
              {user.plan === "pro" && <Badge tone="accent">Pro</Badge>}
              <span className="max-w-35 truncate text-sm text-muted">
                {user.name || user.email}
              </span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? <Spinner /> : "Log out"}
          </Button>
        </div>
      </nav>

      {/* Mobile nav */}
      <div className="flex items-center gap-1 overflow-x-auto border-t border-border px-3 py-2 md:hidden">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${
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
