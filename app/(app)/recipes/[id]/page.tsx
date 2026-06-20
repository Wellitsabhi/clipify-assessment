"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Badge, Card, PageLoader } from "@/app/components/ui";
import { api } from "@/app/lib/api";
import type { Recipe } from "@/app/lib/types";

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api<{ recipe: Recipe }>(`/api/recipes/${id}`)
      .then((data) => setRecipe(data.recipe))
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Recipe not found</h1>
        <Link href="/recipes" className="mt-4 inline-block text-sm text-accent-hover hover:underline">
          ← Back to recipes
        </Link>
      </div>
    );
  }

  if (!recipe) return <PageLoader />;

  const tags = (recipe.dietaryTags ?? "").split(",").map((t) => t.trim()).filter(Boolean);
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link href="/recipes" className="text-sm text-muted hover:text-foreground">
        ← Recipes
      </Link>

      <div className="mt-4 overflow-hidden rounded-(--radius-card) border border-border">
        <img src={recipe.imageUrl} alt={recipe.title} className="h-72 w-full object-cover sm:h-96" />
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap items-center gap-2">
          {recipe.cuisine && <Badge>{recipe.cuisine}</Badge>}
          {tags.map((t) => (
            <Badge key={t} tone="accent">
              {t}
            </Badge>
          ))}
        </div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">{recipe.title}</h1>
        <p className="mt-3 text-lg leading-relaxed text-muted">{recipe.description}</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Prep time" value={`${recipe.prepTime} min`} />
        <Stat label="Cook time" value={`${recipe.cookTime} min`} />
        <Stat label="Total time" value={`${totalTime} min`} />
        <Stat label="Servings" value={String(recipe.servings)} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-foreground">Ingredients</h2>
          <ul className="mt-4 divide-y divide-border rounded-(--radius-card) border border-border bg-surface">
            {recipe.ingredients.map((ing) => (
              <li
                key={ing.id ?? ing.name}
                className="flex items-baseline justify-between px-4 py-3 text-sm"
              >
                <span className="text-foreground">{ing.name}</span>
                <span className="text-muted">
                  {ing.amount} {ing.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <aside>
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-foreground">Nutrition</h3>
            <p className="mt-2 text-3xl font-semibold text-accent-hover">
              {recipe.calories != null ? recipe.calories : "—"}
              <span className="ml-1 text-sm font-normal text-muted">cal / serving</span>
            </p>
            {recipe.user?.name && (
              <p className="mt-4 border-t border-border pt-4 text-xs text-subtle">
                Added by {recipe.user.name}
              </p>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-subtle">{label}</p>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </Card>
  );
}
