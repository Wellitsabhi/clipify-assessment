"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button, Card, Skeleton, Spinner } from "@/app/components/ui";
import { CheckIcon } from "@/app/components/icons";
import { Aurora } from "@/app/components/Aurora";
import { StarBorder } from "@/app/components/StarBorder";
import { useConfirm } from "@/app/components/ConfirmProvider";
import { api } from "@/app/lib/api";
import { useUser } from "@/app/lib/useUser";

const PRO_PRICE = "$9.99/mo";

const PRO_FEATURES = [
  "Unlimited AI-generated recipes",
  "AI recipe photography",
  "Unlimited meal plans",
  "Priority support",
];

export default function SettingsPage() {
  const { user, loading, setUser } = useUser();
  const confirm = useConfirm();
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  async function handleUpgrade() {
    setWorking(true);
    setError("");
    try {
      const data = await api<{ url: string }>("/api/stripe/checkout", { method: "POST" });
      window.location.href = data.url;
    } catch (e) {
      setError((e as Error).message);
      setWorking(false);
    }
  }

  async function handleCancel() {
    const ok = await confirm({
      title: "Cancel your Pro subscription?",
      description: "You'll keep Pro access until the end of the current billing period.",
      confirmLabel: "Cancel subscription",
      cancelLabel: "Keep Pro",
      tone: "danger",
    });
    if (!ok) return;
    setWorking(true);
    setError("");
    try {
      await api("/api/stripe/cancel", { method: "POST" });
      setUser(user ? { ...user, plan: "free" } : user);
      toast.success("Subscription cancelled");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setWorking(false);
    }
  }

  if (loading || !user)
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-10 sm:px-6">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-32 w-full rounded-(--radius-card)" />
        <Skeleton className="h-48 w-full rounded-(--radius-card)" />
      </div>
    );
  const isPro = user.plan === "pro";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">Settings</h1>
      <p className="mt-1.5 text-sm text-muted">Manage your account and subscription.</p>

      {error && <p className="mt-6 text-sm text-danger">{error}</p>}

      {/* Profile */}
      <Card className="mt-8 p-6">
        <h2 className="text-sm font-semibold text-foreground">Profile</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Name</dt>
            <dd className="font-medium text-foreground">{user.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Email</dt>
            <dd className="font-medium text-foreground">{user.email}</dd>
          </div>
        </dl>
      </Card>

      {/* Subscription — bold dark-green panel */}
      <div className="bg-forest relative mt-6 overflow-hidden rounded-(--radius-card) text-white shadow-(--shadow-lg)">
        <Aurora className="opacity-40" colors={["#34d399", "#15803d", "#86efac"]} />
        <div className="bg-dots bg-dots-fade pointer-events-none absolute inset-0 opacity-20 text-[rgba(255,255,255,0.4)]" aria-hidden />
        <div className="relative z-10 p-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold">
                {isPro ? "MealPlan Pro" : "Upgrade to Pro"}
              </h2>
              <p className="mt-1 text-sm text-emerald-100/80">
                {isPro ? "You're on the Pro plan." : "Everything you need to cook smarter."}
              </p>
            </div>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              {isPro ? "Pro" : "Free"}
            </span>
          </div>

          {isPro ? (
            <button
              onClick={handleCancel}
              disabled={working}
              className="press mt-6 inline-flex items-center justify-center rounded-lg border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/15 disabled:opacity-50"
            >
              {working ? <Spinner /> : "Cancel subscription"}
            </button>
          ) : (
            <div className="mt-5">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-semibold">{PRO_PRICE}</span>
                <span className="text-sm text-emerald-100/70">billed monthly · cancel anytime</span>
              </div>
              <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-emerald-50">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-(--accent-ring)">
                      <CheckIcon size={13} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <StarBorder
                as="button"
                onClick={handleUpgrade}
                disabled={working}
                color="#86efac"
                className="press mt-6"
                innerClassName="bg-white text-accent-hover font-semibold text-sm px-6 py-3"
              >
                {working ? <Spinner /> : "Upgrade to Pro"}
              </StarBorder>
            </div>
          )}
        </div>
      </div>

      {/* Danger zone — neutral styling, no alarmist red text */}
      <Card className="mt-6 p-6">
        <h2 className="text-sm font-semibold text-foreground">Danger zone</h2>
        <p className="mt-1 text-sm text-muted">
          Deleting your account is permanent and removes all your recipes and plans.
        </p>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => toast("Account deletion isn't enabled in this demo.")}
        >
          Delete account
        </Button>
      </Card>
    </div>
  );
}
