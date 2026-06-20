"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button, Card, EmptyState, Input, Label, PageLoader, Spinner } from "@/app/components/ui";
import { Modal } from "@/app/(app)/recipes/page";
import { PlusIcon } from "@/app/components/icons";
import { staggerContainer, staggerItem } from "@/app/components/motion";
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
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            Meal plans
          </h1>
          <p className="mt-1.5 text-sm text-muted">Organize your week, one meal at a time.</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <PlusIcon size={16} /> New plan
        </Button>
      </div>

      {plans === null ? (
        <PageLoader />
      ) : plans.length === 0 ? (
        <EmptyState
          icon="🗓️"
          title="No meal plans yet"
          description="Create a weekly plan and fill it with recipes from your catalog."
          action={
            <Button onClick={() => setShowCreate(true)}>
              <PlusIcon size={16} /> New plan
            </Button>
          }
        />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {plans.map((plan) => (
            <motion.div key={plan.id} variants={staggerItem}>
              <Link href={`/meal-plans/${plan.id}`}>
                <Card className="group h-full p-6 transition-all duration-300 ease-(--ease-out-soft) hover:-translate-y-1 hover:shadow-(--shadow-md)">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-foreground transition-colors group-hover:text-accent-hover">
                      {plan.name}
                    </h2>
                    <span className="text-subtle opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100">
                      →
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {formatRange(plan.startDate, plan.endDate)}
                  </p>
                  <div className="mt-5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full rounded-full bg-accent transition-all duration-500"
                        style={{ width: `${Math.min(100, (plan.recipes.length / 21) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-subtle">
                      {plan.recipes.length}/21
                    </span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
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
    <Modal onClose={onClose} title="New meal plan" subtitle="Pick a week and start adding recipes.">
      <form onSubmit={handleSubmit} className="space-y-4">
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
    </Modal>
  );
}
