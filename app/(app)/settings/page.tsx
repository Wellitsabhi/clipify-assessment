"use client";

import { useState } from "react";
import { Badge, Button, Card, PageLoader, Spinner } from "@/app/components/ui";
import { CheckIcon } from "@/app/components/icons";
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
    if (!confirm("Cancel your Pro subscription? You'll keep access until the end of the period."))
      return;
    setWorking(true);
    setError("");
    try {
      await api("/api/stripe/cancel", { method: "POST" });
      setUser(user ? { ...user, plan: "free" } : user);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setWorking(false);
    }
  }

  if (loading || !user) return <PageLoader />;
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

      {/* Subscription */}
      <Card className="mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Subscription</h2>
            <p className="mt-1 text-sm text-muted">
              {isPro ? "You're on the Pro plan." : "You're on the Free plan."}
            </p>
          </div>
          <Badge tone={isPro ? "accent" : "neutral"}>{isPro ? "Pro" : "Free"}</Badge>
        </div>

        <div className="p-6">
          {isPro ? (
            <Button variant="secondary" onClick={handleCancel} disabled={working}>
              {working ? <Spinner /> : "Cancel subscription"}
            </Button>
          ) : (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-foreground">{PRO_PRICE}</span>
                <span className="text-sm text-muted">billed monthly · cancel anytime</span>
              </div>
              <ul className="mt-4 space-y-2.5">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-soft text-accent">
                      <CheckIcon size={13} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="mt-6" onClick={handleUpgrade} disabled={working}>
                {working ? <Spinner /> : "Upgrade to Pro"}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Danger zone */}
      <Card className="mt-6 border-red-200 p-6">
        <h2 className="text-sm font-semibold text-danger">Danger zone</h2>
        <p className="mt-1 text-sm text-muted">
          Deleting your account is permanent and removes all your recipes and plans.
        </p>
        <Button
          variant="danger"
          className="mt-4"
          onClick={() => alert("Account deletion isn't enabled in this demo.")}
        >
          Delete account
        </Button>
      </Card>
    </div>
  );
}
