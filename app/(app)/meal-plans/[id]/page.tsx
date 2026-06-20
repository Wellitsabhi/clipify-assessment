"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button, Card, PageLoader, Spinner } from "@/app/components/ui";
import { GooeyDropdown } from "@/app/components/GooeyDropdown";
import { ArrowLeftIcon, PlusIcon } from "@/app/components/icons";
import { MealTypeAnim } from "@/app/components/AnimatedIcons";
import { staggerContainer, staggerItem } from "@/app/components/motion";
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
      await api(`/api/meal-plans/${id}`, { method: "POST", body: { day, mealType, recipeId } });
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

  const totalMeals = plan.recipes.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/meal-plans"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon size={15} /> Meal plans
      </Link>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground">
        {plan.name}
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        {new Date(plan.startDate).toLocaleDateString()} – {new Date(plan.endDate).toLocaleDateString()}
        {" · "}
        {totalMeals} {totalMeals === 1 ? "meal" : "meals"} planned
      </p>

      <Card className="mt-6 p-5">
        <h2 className="text-sm font-semibold text-foreground">Add a meal</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_2fr_auto] sm:items-end">
          <Field label="Day">
            <GooeyDropdown
              ariaLabel="Day"
              value={day}
              onChange={setDay}
              options={DAYS.map((d) => ({ value: d, label: cap(d) }))}
            />
          </Field>
          <Field label="Meal">
            <GooeyDropdown
              ariaLabel="Meal"
              value={mealType}
              onChange={setMealType}
              options={MEAL_TYPES.map((m) => ({ value: m, label: cap(m) }))}
            />
          </Field>
          <Field label="Recipe">
            <GooeyDropdown
              ariaLabel="Recipe"
              value={recipeId}
              onChange={setRecipeId}
              options={recipes.map((r) => ({ value: r.id, label: r.title }))}
            />
          </Field>
          <Button onClick={handleAdd} disabled={adding || !recipeId}>
            {adding ? <Spinner /> : <><PlusIcon size={16} /> Add</>}
          </Button>
        </div>
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      </Card>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7"
      >
        {DAYS.map((d) => (
          <motion.div key={d} variants={staggerItem}>
            <Card className="flex min-h-52 flex-col p-3">
              <h3 className="mb-3 text-sm font-semibold text-foreground">{cap(d)}</h3>
              <div className="space-y-3">
                {MEAL_TYPES.map((meal) => {
                  const items = plan.recipes.filter((r) => r.day === d && r.mealType === meal);
                  return (
                    <div key={meal}>
                      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-subtle">
                        <MealTypeAnim type={meal} size={15} /> {cap(meal)}
                      </p>
                      {items.length === 0 ? (
                        <p className="mt-1 text-xs text-(--border-strong)">—</p>
                      ) : (
                        items.map((item) => (
                          <div
                            key={item.id}
                            className="group mt-1 flex items-center justify-between gap-1 rounded-md bg-accent-soft px-2 py-1 transition-colors hover:bg-accent/10"
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
                              aria-label={`Remove ${item.recipe.title}`}
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
          </motion.div>
        ))}
      </motion.div>
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
      <h1 className="font-display text-2xl font-semibold text-foreground">
        Couldn&apos;t load this plan
      </h1>
      <p className="mt-2 text-sm text-muted">{message}</p>
      <Link href="/meal-plans" className="mt-4 inline-block text-sm text-accent-hover hover:underline">
        ← Back to meal plans
      </Link>
    </div>
  );
}
