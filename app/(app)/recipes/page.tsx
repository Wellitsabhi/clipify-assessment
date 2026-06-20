"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  IconButton,
  Input,
  Label,
  PageLoader,
  Spinner,
} from "@/app/components/ui";
import {
  ClockIcon,
  FlameIcon,
  PlusIcon,
  SearchIcon,
  SparkleIcon,
  TrashIcon,
  UsersIcon,
} from "@/app/components/icons";
import { staggerContainer, staggerItem } from "@/app/components/motion";
import { RecipeImage } from "@/app/components/RecipeImage";
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
    setRecipes((rs) => rs?.filter((r) => r.id !== id) ?? null);
    try {
      await api(`/api/recipes/${id}`, { method: "DELETE" });
    } catch (e) {
      setRecipes(prev ?? null);
      alert((e as Error).message);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            Recipes
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Browse your catalog and grow it with Chef Ferraro.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <PlusIcon size={16} /> New recipe
        </Button>
      </div>

      {/* Nudge: gentle prompt toward the AI feature */}
      <Link
        href="/chat"
        className="group mb-7 flex items-center gap-3 rounded-(--radius-card) border border-(--border-strong) bg-(--citrus-soft) px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-(--shadow-sm)"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-citrus/15 text-citrus">
          <SparkleIcon size={16} />
        </span>
        <span className="flex-1 text-sm text-foreground">
          <span className="font-medium">Out of ideas?</span>{" "}
          <span className="text-muted">Ask Chef Ferraro to invent a recipe for you.</span>
        </span>
        <span className="text-citrus opacity-0 transition-opacity group-hover:opacity-100">→</span>
      </Link>

      <div className="relative mb-8 max-w-md">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle">
          <SearchIcon size={16} />
        </span>
        <Input
          placeholder="Search by name, cuisine, or dietary tag…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search recipes"
          className="pl-9"
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
              <Button onClick={() => setShowCreate(true)}>
                <PlusIcon size={16} /> New recipe
              </Button>
            )
          }
        />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              canDelete={recipe.userId === user?.id}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
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
    <motion.div variants={staggerItem}>
      <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 ease-(--ease-out-soft) hover:-translate-y-1 hover:border-(--border-strong) hover:shadow-(--shadow-lg)">
        <Link href={`/recipes/${recipe.id}`} className="relative block overflow-hidden">
          <RecipeImage
            src={recipe.imageUrl}
            title={recipe.title}
            className="h-44 w-full object-cover transition-transform duration-500 ease-(--ease-out-soft) group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {recipe.cuisine && (
            <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm">
              {recipe.cuisine}
            </span>
          )}
        </Link>
        <div className="flex flex-1 flex-col p-5">
          <Link href={`/recipes/${recipe.id}`}>
            <h3 className="font-medium leading-snug text-foreground transition-colors group-hover:text-accent-hover">
              {recipe.title}
            </h3>
          </Link>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{recipe.description}</p>

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Badge key={tag} tone="accent">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center gap-3.5 text-xs text-subtle">
            <span className="inline-flex items-center gap-1">
              <ClockIcon size={13} /> {recipe.prepTime + recipe.cookTime}m
            </span>
            <span className="inline-flex items-center gap-1">
              <UsersIcon size={13} /> {recipe.servings}
            </span>
            {recipe.calories != null && (
              <span className="inline-flex items-center gap-1">
                <FlameIcon size={13} /> {recipe.calories}
              </span>
            )}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <Link
              href={`/recipes/${recipe.id}`}
              className="text-sm font-medium text-accent-hover transition-transform duration-200 hover:translate-x-0.5"
            >
              View recipe →
            </Link>
            {canDelete && (
              <IconButton label="Delete recipe" tone="danger" onClick={() => onDelete(recipe.id)}>
                <TrashIcon size={16} />
              </IconButton>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
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
    <Modal onClose={onClose} title="New recipe" subtitle="Add a recipe to your catalog. You can edit details later.">
      <form onSubmit={handleSubmit} className="space-y-4">
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
    </Modal>
  );
}

/* Shared animated modal. */
export function Modal({
  onClose,
  title,
  subtitle,
  children,
}: {
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-sm"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <Card className="p-6 shadow-(--shadow-lg)">
          <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          <div className="mt-5">{children}</div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
