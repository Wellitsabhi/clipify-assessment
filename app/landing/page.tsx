"use client";

import Link from "next/link";
import { motion } from "motion/react";
import ChefLogo from "@/app/components/ChefLogo";
import { ShaderBackground } from "@/app/components/ShaderBackground";
import { Aurora } from "@/app/components/Aurora";
import { BlurText } from "@/app/components/BlurText";
import { AIChatIcon, CalendarWeekIcon, CatalogIcon, IdeaIcon } from "@/app/components/AnimatedIcons";
import { CountUp } from "@/app/components/CountUp";
import { FadeIn, staggerContainer, staggerItem } from "@/app/components/motion";

const STATS = [
  { value: 20, suffix: "+", label: "Recipes to start" },
  { value: 12, suffix: "", label: "World cuisines" },
  { value: 3, suffix: "×", label: "Meals a day, planned" },
];

const FEATURES = [
  {
    Icon: AIChatIcon,
    title: "AI Recipe Bot",
    body: "Tell Chef Ferraro what you're craving — high-protein, vegan, 20 minutes — and get a complete recipe added to your catalog, photo and all.",
  },
  {
    Icon: CatalogIcon,
    title: "Your recipe catalog",
    body: "A clean, searchable library of everything you cook. Filter by cuisine and dietary tags, and open any recipe for ingredients and timing.",
  },
  {
    Icon: CalendarWeekIcon,
    title: "Weekly meal plans",
    body: "Slot your recipes into a Monday-to-Sunday grid across breakfast, lunch, and dinner — so grocery day finally makes sense.",
  },
];

const STEPS = [
  { n: "1", title: "Add recipes", body: "Start from the catalog or generate new ones with AI." },
  { n: "2", title: "Build a plan", body: "Pick a week and slot recipes into each meal." },
  { n: "3", title: "Cook with ease", body: "Open any day and know exactly what's for dinner." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky solid nav (no glass, per design direction) */}
      <header className="sticky top-0 z-30 border-b border-border bg-background">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <ChefLogo size={32} href={null} />
            <span className="font-display font-semibold tracking-tight">MealPlan Pro</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-muted transition-colors hover:text-foreground">
              Sign in
            </Link>
            <Link
              href="/register"
              className="press rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white shadow-(--shadow-sm) transition-colors duration-150 hover:bg-accent-hover"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero with aurora + shader backdrop */}
      <section className="relative overflow-hidden">
        <Aurora className="opacity-80" />
        <ShaderBackground className="opacity-40" />
        <div className="bg-dots bg-dots-fade pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative z-10 mx-auto max-w-3xl px-6 pb-20 pt-14 text-center sm:pt-20">
          <FadeIn>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-surface/70 px-3 py-1 text-xs font-medium text-accent-hover shadow-(--shadow-sm) backdrop-blur-md">
              <IdeaIcon size={13} /> Powered by AI · Built for home cooks
            </span>
          </FadeIn>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
            <BlurText text="Plan your week of" as="span" className="block" />
            <span className="block">
              <BlurText text="meals" as="span" className="text-accent" delay={0.3} />{" "}
              <BlurText text="in minutes." as="span" delay={0.4} />
            </span>
          </h1>
          <FadeIn delay={0.16}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
              MealPlan Pro turns a recipe catalog and an AI sous-chef into a calm,
              organized week of cooking — no more staring at the fridge at 7pm.
            </p>
          </FadeIn>
          <FadeIn delay={0.24}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="w-full rounded-lg bg-accent px-6 py-3.5 text-base font-medium text-white shadow-(--shadow-md) transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-(--shadow-lg) sm:w-auto"
              >
                Start planning free
              </Link>
              <Link
                href="/login"
                className="w-full rounded-lg border border-(--border-strong) bg-surface/80 px-6 py-3.5 text-base font-medium text-foreground backdrop-blur-sm transition-colors duration-200 hover:bg-surface sm:w-auto"
              >
                Sign in
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats strip with count-up */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-4xl grid-cols-3 divide-x divide-border px-6">
          {STATS.map((s) => (
            <div key={s.label} className="px-4 py-10 text-center">
              <div className="font-display text-4xl font-semibold text-accent sm:text-5xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-2 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={staggerItem}
              className="rounded-(--radius-card) border border-border bg-surface p-6 shadow-(--shadow-sm)"
            >
              <f.Icon />
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it works — textured panel */}
      <section className="relative bg-grain bg-surface-2 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center font-display text-3xl font-semibold tracking-tight">
            How it works
          </h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            {STEPS.map((s) => (
              <motion.div key={s.n} variants={staggerItem} className="text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white shadow-(--shadow-sm)">
                  {s.n}
                </div>
                <h3 className="mt-4 font-display font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{s.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA — deep-forest aurora panel */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="bg-forest relative overflow-hidden rounded-3xl px-8 py-16 text-center text-white shadow-(--shadow-lg)">
          <Aurora className="opacity-60" colors={["#34d399", "#15803d", "#86efac"]} />
          <div className="bg-dots bg-dots-fade pointer-events-none absolute inset-0 opacity-20 text-[rgba(255,255,255,0.4)]" aria-hidden />
          <div className="relative z-10">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to take dinner off your plate?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-emerald-100/80">
              Create your free account and plan your first week today.
            </p>
            <Link
              href="/register"
              className="press mt-8 inline-block rounded-xl bg-white px-6 py-3.5 font-medium text-accent-hover shadow-(--shadow-md) transition-colors duration-150 hover:bg-emerald-50"
            >
              Get started — it&apos;s free
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 text-sm text-subtle sm:flex-row">
          <span>© {new Date().getFullYear()} MealPlan Pro</span>
          <span>
            Made for people who like to eat well · a{" "}
            <span className="font-display italic text-accent-hover">Clipify</span> kitchen joint
          </span>
        </div>
      </footer>
    </div>
  );
}
