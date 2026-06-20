"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, EmptyState, Input, Label, PageLoader, Spinner } from "@/app/components/ui";
import { api } from "@/app/lib/api";
import type { MealPlan } from "@/app/lib/types";

function formatRange(start: string, end: string) {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${new Date(start).toLocaleDateString(undefined, opts)} – ${new Date(
    end
  ).toLocaleDateString(undefined, opts)}`;
}

export default function MealPlansPage() {
  const [plans, setPlans] = useState<MealPlan[] | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api<{ mealPlans: MealPlan[] }>("/api/meal-plans");
      setPlans(data.mealPlans ?? []);
    } catch {
      setPlans([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Meal plans</h1>
          <p className="mt-1.5 text-sm text-muted">Organize your week, one meal at a time.</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>+ New plan</Button>
      </div>

      {plans === null ? (
        <PageLoader />
      ) : plans.length === 0 ? (
        <EmptyState
          icon="🗓️"
          title="No meal plans yet"
          description="Create a weekly plan and fill it with recipes from your catalog."
          action={<Button onClick={() => setShowCreate(true)}>+ New plan</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <Link key={plan.id} href={`/meal-plans/${plan.id}`}>
              <Card className="h-full p-6 transition-shadow hover:shadow-(--shadow-md)">
                <h2 className="text-lg font-semibold text-foreground">{plan.name}</h2>
                <p className="mt-1 text-sm text-muted">
                  {formatRange(plan.startDate, plan.endDate)}
                </p>
                <p className="mt-4 text-sm text-subtle">
                  {plan.recipes.length} {plan.recipes.length === 1 ? "meal" : "meals"} planned
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {showCreate && (
        <CreatePlanModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function CreatePlanModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  // Default to the upcoming Monday–Sunday week.
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const iso = (d: Date) => d.toISOString().slice(0, 10);

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(iso(monday));
  const [endDate, setEndDate] = useState(iso(sunday));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api("/api/meal-plans", { method: "POST", body: { name, startDate, endDate } });
      onCreated();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <Card className="w-full max-w-md animate-in p-6">
        <div onClick={(e) => e.stopPropagation()}>
          <h2 className="text-lg font-semibold text-foreground">New meal plan</h2>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {error && <p className="text-sm text-danger">{error}</p>}
            <div>
              <Label htmlFor="p-name">Name</Label>
              <Input
                id="p-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Healthy week"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="p-start">Start</Label>
                <Input
                  id="p-start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="p-end">End</Label>
                <Input
                  id="p-end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Spinner /> : "Create plan"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
