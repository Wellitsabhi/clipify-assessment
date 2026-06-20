"use client";

import ChefLogo from "@/app/components/ChefLogo";
import { Button, Input, Label, Spinner } from "@/app/components/ui";
import { ShaderBackground } from "@/app/components/ShaderBackground";
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

const FLOATING = [
  { e: "🥑", top: "16%", left: "12%", d: 0 },
  { e: "🍅", top: "30%", left: "78%", d: 0.6 },
  { e: "🥕", top: "62%", left: "18%", d: 1.1 },
  { e: "🌿", top: "72%", left: "70%", d: 0.3 },
  { e: "🍋", top: "44%", left: "46%", d: 0.9 },
];

const NUDGES = [
  "AI recipes in seconds",
  "Plan a whole week visually",
  "Your catalog, beautifully organized",
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
      {/* Left: poppy hero with shader + floating food */}
      <section className="relative hidden overflow-hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:p-12">
        <ShaderBackground />
        {FLOATING.map((f) => (
          <motion.span
            key={f.e}
            className="pointer-events-none absolute text-4xl drop-shadow-sm select-none"
            style={{ top: f.top, left: f.left }}
            animate={{ y: [0, -14, 0], rotate: [-4, 4, -4] }}
            transition={{ duration: 6 + f.d * 2, repeat: Infinity, ease: "easeInOut", delay: f.d }}
            aria-hidden
          >
            {f.e}
          </motion.span>
        ))}

        <div className="relative z-10">
          <Link href="/landing" className="inline-flex items-center gap-2.5">
            <ChefLogo size={36} href={null} />
            <span className="font-display text-lg font-semibold text-foreground">MealPlan Pro</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <FadeIn>
            <h2 className="font-display text-4xl font-semibold leading-tight text-foreground">
              Cook with a little
              <span className="text-accent"> joy</span>, plan with zero stress.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <ul className="mt-7 space-y-2.5">
              {NUDGES.map((n) => (
                <li key={n} className="flex items-center gap-2.5 text-sm text-muted">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] text-white">
                    ✓
                  </span>
                  {n}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>

        {/* Clipify easter egg — a quiet personal touch */}
        <p className="relative z-10 text-xs text-subtle">
          Crafted with care · a{" "}
          <span className="font-display italic text-accent-hover">Clipify</span> kitchen joint
        </p>
      </section>

      {/* Right: form */}
      <section className="relative flex flex-1 items-center justify-center bg-surface px-4 py-12">
        <div className="w-full max-w-sm">
          <FadeIn>
            <div className="mb-8 lg:hidden">
              <ChefLogo size={44} href="/landing" />
            </div>
            <p className="text-sm font-medium text-accent">{eyebrow}</p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mt-2 text-sm text-muted">{subtitle}</p>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="mt-8">{children}</div>
          </FadeIn>

          <p className="mt-6 text-center text-sm text-muted">{footer}</p>
        </div>
      </section>
    </main>
  );
}
