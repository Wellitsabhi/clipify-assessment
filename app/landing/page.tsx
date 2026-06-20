"use client";

import Link from "next/link";
import { motion } from "motion/react";
import ChefLogo from "@/app/components/ChefLogo";
import { ShaderBackground } from "@/app/components/ShaderBackground";
import { SparkleIcon } from "@/app/components/icons";
import { FadeIn, staggerContainer, staggerItem } from "@/app/components/motion";

const FEATURES = [
  {
    icon: "🤖",
    title: "AI Recipe Bot",
    body: "Tell Chef Ferraro what you're craving — high-protein, vegan, 20 minutes — and get a complete recipe added to your catalog, photo and all.",
  },
  {
    icon: "📚",
    title: "Your recipe catalog",
    body: "A clean, searchable library of everything you cook. Filter by cuisine and dietary tags, and open any recipe for ingredients and timing.",
  },
  {
    icon: "🗓️",
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
      {/* Nav */}
      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <ChefLogo size={34} href={null} />
          <span className="font-display font-semibold tracking-tight">MealPlan Pro</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-muted hover:text-foreground">
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white shadow-(--shadow-sm) transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-(--shadow-md)"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero with shader backdrop */}
      <section className="relative overflow-hidden">
        <ShaderBackground className="opacity-90" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 pb-20 pt-14 text-center sm:pt-20">
          <FadeIn>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/80 px-3 py-1 text-xs font-medium text-accent-hover backdrop-blur-sm">
              <SparkleIcon size={13} /> Powered by AI · Built for home cooks
            </span>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
              Plan your week of
              <span className="text-accent"> meals</span> in minutes.
            </h1>
          </FadeIn>
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
                className="w-full rounded-lg border border-(--border-strong) bg-surface/80 px-6 py-3.5 text-base font-medium text-foreground backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface sm:w-auto"
              >
                Sign in
              </Link>
            </div>
          </FadeIn>
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
              <div className="text-3xl">
                {f.icon}
              </div>
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

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-accent px-8 py-14 text-center text-white shadow-(--shadow-lg)">
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <ShaderBackground />
          </div>
          <div className="relative z-10">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to take dinner off your plate?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-emerald-50">
              Create your free account and plan your first week today.
            </p>
            <Link
              href="/register"
              className="mt-7 inline-block rounded-lg bg-white px-6 py-3.5 font-medium text-accent-hover transition-transform duration-200 hover:-translate-y-0.5 hover:bg-emerald-50"
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
