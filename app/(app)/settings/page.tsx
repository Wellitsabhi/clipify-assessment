"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button, Card, Skeleton, Spinner } from "@/app/components/ui";
import { CheckIcon } from "@/app/components/icons";
import { Sparkles } from "lucide-react";
import { Aurora } from "@/app/components/Aurora";
import { StarBorder } from "@/app/components/StarBorder";
import { DitherAvatar } from "@/app/components/DitherAvatar";
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
      <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground">Settings</h1>
      <p className="mt-1.5 text-muted">Manage your account and subscription.</p>

      {error && <p className="mt-6 text-sm text-danger">{error}</p>}

      {/* Profile */}
      <Card className="mt-8 p-6">
        <div className="flex items-center gap-4">
          <DitherAvatar name={user.name || user.email} size={52} />
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-semibold text-foreground">{user.name}</p>
            <p className="truncate text-sm text-muted">{user.email}</p>
          </div>
          <span
            className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              isPro ? "bg-accent-soft text-accent-hover" : "bg-stone-100 text-stone-600"
            }`}
          >
            {isPro ? "Pro" : "Free"}
          </span>
        </div>
      </Card>

      {/* Subscription — blackish ink panel */}
      <div className="bg-ink relative mt-6 overflow-hidden rounded-2xl text-white shadow-(--shadow-lg)">
        <Aurora className="opacity-25" colors={["#34d399", "#15803d", "#0a3a23"]} />
        <div className="bg-dots bg-dots-fade pointer-events-none absolute inset-0 opacity-15 text-[rgba(255,255,255,0.35)]" aria-hidden />
        <div className="relative z-10 p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-(--accent-ring)">
                <Sparkles size={12} strokeWidth={2.5} /> {isPro ? "Active" : "Premium"}
              </span>
              <h2 className="mt-3 font-display text-2xl font-semibold">
                {isPro ? "You're on MealPlan Pro" : "Upgrade to Pro"}
              </h2>
              <p className="mt-1 text-sm text-white/60">
                {isPro ? "Thanks for cooking with us." : "Everything you need to cook smarter."}
              </p>
            </div>
          </div>

          {isPro ? (
            <button
              onClick={handleCancel}
              disabled={working}
              className="press mt-6 inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/15 disabled:opacity-50"
            >
              {working ? <Spinner /> : "Cancel subscription"}
            </button>
          ) : (
            <div className="mt-6">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-semibold">{PRO_PRICE}</span>
                <span className="text-sm text-white/50">billed monthly · cancel anytime</span>
              </div>
              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/85">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                      <CheckIcon size={12} />
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
                speed="4s"
                className="press mt-7"
                innerClassName="bg-white text-[#0a0c0d] font-semibold text-sm px-7 py-3.5"
              >
                {working ? <Spinner /> : "Upgrade to Pro"}
              </StarBorder>
            </div>
          )}
        </div>
      </div>

      {/* Danger zone */}
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
