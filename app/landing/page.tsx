import Link from "next/link";
import ChefLogo from "@/app/components/ChefLogo";

export const metadata = {
  title: "MealPlan Pro — AI meal planning that fits your week",
};

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
    body: "Drag your recipes into a Monday-to-Sunday grid. Plan breakfast, lunch, and dinner so grocery day actually makes sense.",
  },
];

const STEPS = [
  { n: "1", title: "Add recipes", body: "Start from the seeded catalog or generate new ones with AI." },
  { n: "2", title: "Build a plan", body: "Pick a week and slot recipes into each meal." },
  { n: "3", title: "Cook with ease", body: "Open any day and you know exactly what's for dinner." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <ChefLogo size={34} href={null} />
          <span className="font-semibold tracking-tight">MealPlan Pro</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-muted hover:text-foreground">
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-16 text-center sm:pt-24">
        <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-accent-hover">
          Powered by AI · Built for home cooks
        </span>
        <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Plan your week of meals in minutes.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
          MealPlan Pro turns a recipe catalog and an AI sous-chef into a calm,
          organized week of cooking — no more staring at the fridge at 7pm.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="w-full rounded-lg bg-accent px-6 py-3 text-base font-medium text-white transition-colors hover:bg-accent-hover sm:w-auto"
          >
            Start planning free
          </Link>
          <Link
            href="/login"
            className="w-full rounded-lg border border-(--border-strong) bg-surface px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-background sm:w-auto"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-(--radius-card) border border-border bg-surface p-6 shadow-(--shadow-sm)"
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-4xl px-6 py-12">
        <h2 className="text-center text-2xl font-semibold tracking-tight">How it works</h2>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent-hover">
                {s.n}
              </div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-2xl bg-accent px-8 py-12 text-center text-white">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Ready to take dinner off your plate?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-emerald-50">
            Create your free account and plan your first week today.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-medium text-accent-hover transition-colors hover:bg-emerald-50"
          >
            Get started — it&apos;s free
          </Link>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 text-sm text-subtle sm:flex-row">
          <span>© {new Date().getFullYear()} MealPlan Pro</span>
          <span>Made for people who like to eat well.</span>
        </div>
      </footer>
    </div>
  );
}
