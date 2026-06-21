"use client";

import Link from "next/link";
import { motion } from "motion/react";
import ChefLogo from "@/app/components/ChefLogo";
import { Aurora } from "@/app/components/Aurora";
import { DitherBg } from "@/app/components/DitherBg";
import { BlurText } from "@/app/components/BlurText";
import { StarBorder } from "@/app/components/StarBorder";
import { AIChatIcon, CalendarWeekIcon, CatalogIcon } from "@/app/components/AnimatedIcons";
import { CountUp } from "@/app/components/CountUp";
import { staggerContainer, staggerItem } from "@/app/components/motion";

const STATS = [
  { value: 20, suffix: "+", label: "Recipes to start" },
  { value: 12, suffix: "", label: "World cuisines" },
  { value: 3, suffix: "×", label: "Meals a day, planned" },
];

const FEATURES = [
  {
    Icon: AIChatIcon,
    title: "AI Recipe Bot",
    body: "Tell Chef Ferraro what you're craving and get a complete recipe added to your catalog — photo and all.",
  },
  {
    Icon: CatalogIcon,
    title: "Your recipe catalog",
    body: "A searchable library of everything you cook. Filter by cuisine and dietary tags, open any recipe in a tap.",
  },
  {
    Icon: CalendarWeekIcon,
    title: "Weekly meal plans",
    body: "Slot recipes into a Monday-to-Sunday plan across every meal, so grocery day finally makes sense.",
  },
];

const STEPS = [
  { n: "01", title: "Add recipes", body: "Start from the catalog or generate new ones with AI." },
  { n: "02", title: "Build a plan", body: "Pick a week and slot recipes into each meal." },
  { n: "03", title: "Cook with ease", body: "Open any day and know exactly what's for dinner." },
];

export default function LandingPage() {
  return (
    // One continuous canvas — backgrounds flow through; no hard section separators.
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Global flowing backdrop (sits behind everything) */}
      <Aurora className="fixed inset-0 opacity-50" />
      <DitherBg className="fixed inset-0 opacity-60 [mask-image:radial-gradient(80%_80%_at_50%_30%,#000,transparent)]" />

      {/* Solid sticky nav (no glass) */}
      <header className="sticky top-0 z-30 border-b border-transparent">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <ChefLogo size={32} href={null} />
            <span className="font-display font-semibold tracking-tight">MealPlan Pro</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-muted transition-colors hover:text-foreground">
              Sign in
            </Link>
            <StarBorder
              as={Link}
              href="/register"
              color="#34d399"
              className="press"
              innerClassName="bg-accent text-white text-sm font-semibold px-4 py-2"
            >
              Get started
            </StarBorder>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        {/* HERO — full viewport */}
        <section className="mx-auto flex min-h-[calc(100vh-69px)] max-w-4xl flex-col items-center justify-center px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent-soft px-3.5 py-1.5 text-xs font-semibold text-accent-hover"
          >
            ✦ Powered by AI · Built for home cooks
          </motion.span>

          <h1 className="mt-7 font-display text-6xl font-semibold leading-[0.98] tracking-tight sm:text-8xl">
            <BlurText text="Plan your week" as="span" className="block" />
            <span className="block">
              <BlurText text="of" as="span" delay={0.25} />{" "}
              <BlurText text="meals" as="span" className="italic text-accent" delay={0.32} />{" "}
              <BlurText text="in minutes." as="span" delay={0.42} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted"
          >
            MealPlan Pro turns a recipe catalog and an AI sous-chef into a calm,
            organized week of cooking — no more staring at the fridge at 7pm.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <StarBorder
              as={Link}
              href="/register"
              color="#86efac"
              speed="4s"
              className="press w-full sm:w-auto"
              innerClassName="bg-accent text-white text-base font-semibold px-7 py-3.5 w-full"
            >
              Start planning free
            </StarBorder>
            <Link
              href="/login"
              className="press w-full rounded-xl border border-(--border-strong) bg-surface/70 px-7 py-3.5 text-base font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-surface sm:w-auto"
            >
              Sign in
            </Link>
          </motion.div>

          {/* stats — inline, no separator */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-4xl font-semibold text-accent">
                  <CountUp value={s.value} suffix={s.suffix} />
                </div>
                <p className="mt-1 text-sm text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES — same centered layout, no separator */}
        <Section eyebrow="What you get" title="Everything in one calm kitchen">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 gap-5 md:grid-cols-3"
          >
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                variants={staggerItem}
                className="rounded-2xl border border-border bg-surface/70 p-6 backdrop-blur-sm"
              >
                <f.Icon />
                <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </Section>

        {/* HOW IT WORKS — same layout */}
        <Section eyebrow="How it works" title="Three steps to a sorted week">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-3"
          >
            {STEPS.map((s) => (
              <motion.div
                key={s.n}
                variants={staggerItem}
                className="rounded-2xl border border-border bg-surface/70 p-6 text-center backdrop-blur-sm"
              >
                <span className="font-display text-3xl font-semibold text-accent/30">{s.n}</span>
                <h3 className="mt-2 font-display font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{s.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </Section>

        {/* CTA — same centered layout, deeper green via aurora, no hard panel border */}
        <section className="mx-auto max-w-3xl px-6 py-28 text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Ready to take dinner off your plate?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted">
            Create your free account and plan your first week today.
          </p>
          <div className="mt-8 flex justify-center">
            <StarBorder
              as={Link}
              href="/register"
              color="#86efac"
              speed="4s"
              className="press"
              innerClassName="bg-accent text-white text-base font-semibold px-8 py-4"
            >
              Get started — it&apos;s free
            </StarBorder>
          </div>
        </section>

        <footer className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-10 text-sm text-subtle sm:flex-row">
          <span>© {new Date().getFullYear()} MealPlan Pro</span>
          <span>
            Made for people who like to eat well · a{" "}
            <span className="font-display italic text-accent-hover">Clipify</span> kitchen joint
          </span>
        </footer>
      </main>
    </div>
  );
}

/** Uniform section wrapper — same eyebrow + big funky heading + centered body. */
function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="mb-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">{eyebrow}</p>
        <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
