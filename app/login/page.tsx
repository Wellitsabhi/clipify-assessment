"use client";

import ChefLogo from "@/app/components/ChefLogo";
import { Button, Input, Label, Spinner } from "@/app/components/ui";
import { Aurora } from "@/app/components/Aurora";
import { BlurText } from "@/app/components/BlurText";
import { GlassSurface } from "@/app/components/GlassSurface";
import { AIChatIcon, CalendarWeekIcon, CatalogIcon } from "@/app/components/AnimatedIcons";
import { FadeIn } from "@/app/components/motion";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Login failed. Please try again.");
        return;
      }
      router.replace("/recipes");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Welcome back, chef"
      title="Let's get cooking"
      subtitle="Sign in and pick up right where your week left off."
      footer={
        <>
          New to the kitchen?{" "}
          <Link href="/register" className="font-medium text-accent-hover hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-(--danger)/20 bg-(--danger-soft) px-3.5 py-2.5 text-sm text-danger"
          >
            {error}
          </motion.div>
        )}
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? <Spinner /> : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared shell for login + register                                          */
/* -------------------------------------------------------------------------- */

const HIGHLIGHTS = [
  { Icon: AIChatIcon, label: "AI recipes in seconds", sub: "Describe a craving, get a full recipe." },
  { Icon: CatalogIcon, label: "A catalog you'll love", sub: "Searchable, tagged, beautifully kept." },
  { Icon: CalendarWeekIcon, label: "Plan the whole week", sub: "Breakfast to dinner, sorted." },
];

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen flex-col lg:flex-row">
      {/* Left: deep-green aurora hero */}
      <section className="bg-forest relative hidden overflow-hidden text-mint lg:flex lg:w-[55%] lg:flex-col lg:justify-between lg:p-14">
        <Aurora className="opacity-70" colors={["#34d399", "#15803d", "#86efac"]} />
        <div className="bg-dots bg-dots-fade pointer-events-none absolute inset-0 opacity-30 text-[rgba(255,255,255,0.35)]" aria-hidden />

        <div className="relative z-10">
          <Link href="/landing" className="inline-flex items-center gap-2.5">
            <ChefLogo size={36} href={null} />
            <span className="font-display text-lg font-semibold text-white">MealPlan Pro</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="font-display text-[2.75rem] font-semibold leading-[1.05] text-white">
            <BlurText text="Cook with a little joy," as="span" className="block" />
            <BlurText text="plan with zero stress." as="span" className="block text-(--accent-ring)" delay={0.35} />
          </h2>
          <FadeIn delay={0.5}>
            <ul className="mt-9 space-y-3.5">
              {HIGHLIGHTS.map((h) => (
                <li key={h.label} className="flex items-center gap-3.5">
                  <span className="shrink-0">
                    <h.Icon tone="dark" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-white">{h.label}</span>
                    <span className="block text-xs text-emerald-100/70">{h.sub}</span>
                  </span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>

        <p className="relative z-10 text-xs text-emerald-100/60">
          Crafted with care · a{" "}
          <span className="font-display italic text-(--accent-ring)">Clipify</span> kitchen joint
        </p>
      </section>

      {/* Right: glass form card */}
      <section className="bg-garden relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12">
        <Aurora className="opacity-25 lg:hidden" />
        <FadeIn className="relative z-10 w-full max-w-sm">
          <GlassSurface className="p-7 sm:p-8">
            <div className="mb-7">
              <div className="mb-6 lg:hidden">
                <ChefLogo size={44} href="/landing" />
              </div>
              <p className="text-sm font-medium text-accent">{eyebrow}</p>
              <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground">
                {title}
              </h1>
              <p className="mt-2 text-sm text-muted">{subtitle}</p>
            </div>

            {children}

            <p className="mt-6 text-center text-sm text-muted">{footer}</p>
          </GlassSurface>
        </FadeIn>
      </section>
    </main>
  );
}
