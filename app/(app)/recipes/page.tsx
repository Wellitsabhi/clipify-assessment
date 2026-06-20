"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Badge, Button, Card, EmptyState, Input, Label, PageLoader, Spinner } from "@/app/components/ui";
import { api } from "@/app/lib/api";
import { useUser } from "@/app/lib/useUser";
import type { Recipe } from "@/app/lib/types";

export default function RecipesPage() {
  const { user } = useUser();
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await api<{ recipes: Recipe[] }>("/api/recipes");
      setRecipes(data.recipes);
    } catch (e) {
      setError((e as Error).message);
      setRecipes([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!recipes) return [];
    const q = query.trim().toLowerCase();
    if (!q) return recipes;
    return recipes.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        (r.cuisine ?? "").toLowerCase().includes(q) ||
        (r.dietaryTags ?? "").toLowerCase().includes(q)
    );
  }, [recipes, query]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this recipe? This can't be undone.")) return;
    const prev = recipes;
    setRecipes((rs) => rs?.filter((r) => r.id !== id) ?? null); // optimistic
    try {
      await api(`/api/recipes/${id}`, { method: "DELETE" });
    } catch (e) {
      setRecipes(prev ?? null); // rollback
      alert((e as Error).message);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Recipes</h1>
          <p className="mt-1.5 text-sm text-muted">
            Browse your catalog and build it out with Chef Ferraro.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>+ New recipe</Button>
      </div>

      <div className="mb-8 max-w-md">
        <Input
          placeholder="Search by name, cuisine, or dietary tag…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search recipes"
        />
      </div>

      {error && <p className="mb-6 text-sm text-danger">{error}</p>}

      {recipes === null ? (
        <PageLoader />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🍳"
          title={query ? "No matching recipes" : "No recipes yet"}
          description={
            query
              ? "Try a different search term."
              : "Create your first recipe or ask Chef Ferraro for ideas."
          }
          action={
            !query && (
              <Button onClick={() => setShowCreate(true)}>+ New recipe</Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              canDelete={recipe.userId === user?.id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateRecipeModal
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

function RecipeCard({
  recipe,
  canDelete,
  onDelete,
}: {
  recipe: Recipe;
  canDelete: boolean;
  onDelete: (id: string) => void;
}) {
  const tags = (recipe.dietaryTags ?? "").split(",").map((t) => t.trim()).filter(Boolean);
  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-(--shadow-md)">
      <Link href={`/recipes/${recipe.id}`} className="block">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1 flex items-start justify-between gap-2">
          <Link href={`/recipes/${recipe.id}`}>
            <h3 className="font-semibold leading-snug text-foreground hover:text-accent-hover">
              {recipe.title}
            </h3>
          </Link>
          {recipe.cuisine && <Badge>{recipe.cuisine}</Badge>}
        </div>
        <p className="line-clamp-2 text-sm text-muted">{recipe.description}</p>

        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge key={tag} tone="accent">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-4 text-xs text-subtle">
          <span>Prep {recipe.prepTime}m</span>
          <span>Cook {recipe.cookTime}m</span>
          <span>Serves {recipe.servings}</span>
          {recipe.calories != null && <span>{recipe.calories} cal</span>}
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
          <Link href={`/recipes/${recipe.id}`} className="flex-1">
            <Button variant="secondary" size="sm" className="w-full">
              View recipe
            </Button>
          </Link>
          {canDelete && (
            <Button variant="danger" size="sm" onClick={() => onDelete(recipe.id)}>
              Delete
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function CreateRecipeModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    cuisine: "",
    prepTime: "",
    cookTime: "",
    servings: "2",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api("/api/recipes", {
        method: "POST",
        body: {
          title: form.title,
          description: form.description,
          cuisine: form.cuisine || null,
          prepTime: Number(form.prepTime) || 0,
          cookTime: Number(form.cookTime) || 0,
          servings: Number(form.servings) || 1,
        },
      });
      onCreated();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-lg animate-in p-6"
        // stop backdrop click from closing when interacting with the form
      >
        <div onClick={(e) => e.stopPropagation()}>
          <h2 className="text-lg font-semibold text-foreground">New recipe</h2>
          <p className="mt-1 text-sm text-muted">
            Add a recipe to your catalog. You can edit details later.
          </p>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {error && <p className="text-sm text-danger">{error}</p>}
            <div>
              <Label htmlFor="r-title">Title</Label>
              <Input
                id="r-title"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Lemon herb chicken"
                required
              />
            </div>
            <div>
              <Label htmlFor="r-desc">Description</Label>
              <Input
                id="r-desc"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="A bright weeknight dinner…"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="r-cuisine">Cuisine</Label>
                <Input
                  id="r-cuisine"
                  value={form.cuisine}
                  onChange={(e) => set("cuisine", e.target.value)}
                  placeholder="Italian"
                />
              </div>
              <div>
                <Label htmlFor="r-servings">Servings</Label>
                <Input
                  id="r-servings"
                  type="number"
                  min={1}
                  value={form.servings}
                  onChange={(e) => set("servings", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="r-prep">Prep (min)</Label>
                <Input
                  id="r-prep"
                  type="number"
                  min={0}
                  value={form.prepTime}
                  onChange={(e) => set("prepTime", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="r-cook">Cook (min)</Label>
                <Input
                  id="r-cook"
                  type="number"
                  min={0}
                  value={form.cookTime}
                  onChange={(e) => set("cookTime", e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Spinner /> : "Create recipe"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
