"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, PageLoader, Select, Spinner } from "@/app/components/ui";
import { api } from "@/app/lib/api";
import type { MealPlan, Recipe } from "@/app/lib/types";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const MEAL_TYPES = ["breakfast", "lunch", "dinner"];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function MealPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [day, setDay] = useState("monday");
  const [mealType, setMealType] = useState("breakfast");
  const [recipeId, setRecipeId] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const loadPlan = useCallback(async () => {
    const data = await api<{ mealPlan: MealPlan }>(`/api/meal-plans/${id}`);
    setPlan(data.mealPlan);
  }, [id]);

  useEffect(() => {
    loadPlan().catch((e) => setError((e as Error).message));
    api<{ recipes: Recipe[] }>("/api/recipes").then((data) => {
      setRecipes(data.recipes);
      if (data.recipes.length) setRecipeId(data.recipes[0].id);
    });
  }, [id, loadPlan]);

  async function handleAdd() {
    if (!recipeId) return;
    setAdding(true);
    setError("");
    try {
      await api(`/api/meal-plans/${id}`, {
        method: "POST",
        body: { day, mealType, recipeId },
      });
      await loadPlan();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(entryId: string) {
    const prev = plan;
    setPlan((p) => (p ? { ...p, recipes: p.recipes.filter((r) => r.id !== entryId) } : p));
    try {
      await api(`/api/meal-plans/${id}?entryId=${entryId}`, { method: "DELETE" });
    } catch (e) {
      setPlan(prev);
      setError((e as Error).message);
    }
  }

  if (!plan) return error ? <ErrorState message={error} /> : <PageLoader />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link href="/meal-plans" className="text-sm text-muted hover:text-foreground">
        ← Meal plans
      </Link>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{plan.name}</h1>
      <p className="mt-1.5 text-sm text-muted">
        {new Date(plan.startDate).toLocaleDateString()} – {new Date(plan.endDate).toLocaleDateString()}
      </p>

      <Card className="mt-6 p-5">
        <h2 className="text-sm font-semibold text-foreground">Add a meal</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_2fr_auto] sm:items-end">
          <Field label="Day">
            <Select value={day} onChange={(e) => setDay(e.target.value)}>
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {cap(d)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Meal">
            <Select value={mealType} onChange={(e) => setMealType(e.target.value)}>
              {MEAL_TYPES.map((m) => (
                <option key={m} value={m}>
                  {cap(m)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Recipe">
            <Select value={recipeId} onChange={(e) => setRecipeId(e.target.value)}>
              {recipes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </Select>
          </Field>
          <Button onClick={handleAdd} disabled={adding || !recipeId}>
            {adding ? <Spinner /> : "Add"}
          </Button>
        </div>
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      </Card>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {DAYS.map((d) => (
          <Card key={d} className="flex min-h-50 flex-col p-3">
            <h3 className="mb-2 text-sm font-semibold text-foreground">{cap(d)}</h3>
            <div className="space-y-3">
              {MEAL_TYPES.map((meal) => {
                const items = plan.recipes.filter((r) => r.day === d && r.mealType === meal);
                return (
                  <div key={meal}>
                    <p className="text-xs uppercase tracking-wide text-subtle">{cap(meal)}</p>
                    {items.length === 0 ? (
                      <p className="mt-0.5 text-xs text-(--border-strong)">—</p>
                    ) : (
                      items.map((item) => (
                        <div
                          key={item.id}
                          className="group mt-1 flex items-center justify-between gap-1 rounded-md bg-accent-soft px-2 py-1"
                        >
                          <Link
                            href={`/recipes/${item.recipe.id}`}
                            className="truncate text-xs font-medium text-accent-hover hover:underline"
                          >
                            {item.recipe.title}
                          </Link>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="text-xs text-subtle opacity-0 transition-opacity hover:text-danger group-hover:opacity-100"
                            aria-label="Remove meal"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      {children}
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Couldn&apos;t load this plan</h1>
      <p className="mt-2 text-sm text-muted">{message}</p>
      <Link href="/meal-plans" className="mt-4 inline-block text-sm text-accent-hover hover:underline">
        ← Back to meal plans
      </Link>
    </div>
  );
}
