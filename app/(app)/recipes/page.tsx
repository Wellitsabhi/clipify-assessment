"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Label,
  RecipeGridSkeleton,
  Spinner,
} from "@/app/components/ui";
import {
  ArrowLeftIcon,
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
import { TiltCard } from "@/app/components/TiltCard";
import { useConfirm } from "@/app/components/ConfirmProvider";
import { toast } from "sonner";
import { api } from "@/app/lib/api";
import { useUser } from "@/app/lib/useUser";
import type { Recipe } from "@/app/lib/types";

export default function RecipesPage() {
  const { user } = useUser();
  const confirm = useConfirm();
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState("");

  const [expanded, setExpanded] = useState<Recipe | null>(null);
  const closeExpanded = useCallback(() => setExpanded(null), []);

  const PER_PAGE = 9;

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

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, pageCount);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  // Reset to page 1 whenever the search changes.
  useEffect(() => {
    setPage(1);
  }, [query]);

  async function handleDelete(id: string) {
    const recipe = recipes?.find((r) => r.id === id);
    const ok = await confirm({
      title: "Delete this recipe?",
      description: `"${recipe?.title ?? "This recipe"}" will be permanently removed from your catalog.`,
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    const prev = recipes;
    setRecipes((rs) => rs?.filter((r) => r.id !== id) ?? null);
    try {
      await api(`/api/recipes/${id}`, { method: "DELETE" });
      toast.success("Recipe deleted");
    } catch (e) {
      setRecipes(prev ?? null);
      toast.error((e as Error).message);
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
        className="group mb-7 flex items-center gap-3 rounded-(--radius-card) border border-(--border-strong) bg-(--citrus-soft) px-4 py-3 transition-colors duration-200 hover:bg-(--citrus)/10"
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
        <RecipeGridSkeleton />
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
        <>
          <motion.div
            key={safePage}
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {paged.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                canDelete={recipe.userId === user?.id}
                onDelete={handleDelete}
                onExpand={() => setExpanded(recipe)}
              />
            ))}
          </motion.div>
          <Pager page={safePage} pageCount={pageCount} onChange={setPage} />
        </>
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

      <ExpandedRecipe recipe={expanded} onClose={closeExpanded} />
    </div>
  );
}

function Pager({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (p: number) => void;
}) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <nav className="mt-12 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-(--border-strong) text-muted transition-colors hover:bg-surface-2 disabled:opacity-40 disabled:hover:bg-transparent"
      >
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition-colors ${
            p === page
              ? "bg-accent text-white shadow-(--shadow-sm)"
              : "border border-(--border-strong) text-muted hover:bg-surface-2"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === pageCount}
        aria-label="Next page"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-(--border-strong) text-muted transition-colors hover:bg-surface-2 disabled:opacity-40 disabled:hover:bg-transparent"
      >
        ›
      </button>
    </nav>
  );
}

function RecipeCard({
  recipe,
  canDelete,
  onDelete,
  onExpand,
}: {
  recipe: Recipe;
  canDelete: boolean;
  onDelete: (id: string) => void;
  onExpand: () => void;
}) {
  const tags = (recipe.dietaryTags ?? "").split(",").map((t) => t.trim()).filter(Boolean);
  return (
    <motion.div variants={staggerItem} className="h-full">
      <TiltCard className="group h-full">
        <Card className="flex h-full flex-col overflow-hidden transition-[border-color,box-shadow] duration-300 group-hover:border-(--border-strong) group-hover:shadow-(--shadow-lg)">
        <button
          onClick={onExpand}
          className="relative block w-full overflow-hidden text-left"
          aria-label={`Open ${recipe.title}`}
        >
          <motion.div layoutId={`recipe-img-${recipe.id}`}>
            <RecipeImage
              src={recipe.imageUrl}
              title={recipe.title}
              className="h-44 w-full object-cover transition-transform duration-500 ease-(--ease-out-soft) group-hover:scale-[1.06]"
            />
          </motion.div>
          <div className="absolute inset-0 bg-linear-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {recipe.cuisine && (
            <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm">
              {recipe.cuisine}
            </span>
          )}
        </button>
        <div className="flex flex-1 flex-col p-5">
          <button onClick={onExpand} className="text-left">
            <motion.h3
              layoutId={`recipe-title-${recipe.id}`}
              className="font-medium leading-snug text-foreground transition-colors group-hover:text-accent-hover"
            >
              {recipe.title}
            </motion.h3>
          </button>
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
            <button
              onClick={onExpand}
              className="text-sm font-medium text-accent-hover transition-transform duration-200 hover:translate-x-0.5"
            >
              View recipe →
            </button>
            {canDelete && (
              <button
                aria-label="Delete recipe"
                onClick={() => onDelete(recipe.id)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-black/5 hover:text-foreground"
              >
                <TrashIcon size={16} />
              </button>
            )}
          </div>
        </div>
        </Card>
      </TiltCard>
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

/**
 * Aceternity-style expand: the clicked card's image + title share a layoutId
 * with this overlay and morph into an expanded panel. Full recipe data is
 * fetched on open; the URL is updated to /recipes/[id] for refresh/share and
 * restored on close. Click-outside / Escape close it.
 */
function ExpandedRecipe({
  recipe,
  onClose,
}: {
  recipe: Recipe | null;
  onClose: () => void;
}) {
  const [full, setFull] = useState<Recipe | null>(null);

  useEffect(() => {
    if (!recipe) {
      setFull(null);
      return;
    }
    setFull(recipe);
    let active = true;
    // Fetch full detail (ingredients) to fill the expanded view.
    api<{ recipe: Recipe }>(`/api/recipes/${recipe.id}`)
      .then((d) => {
        if (active) setFull(d.recipe);
      })
      .catch(() => {});

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    // Lock background scroll while the overlay is open.
    document.body.style.overflow = "hidden";
    return () => {
      active = false;
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [recipe, onClose]);

  const close = onClose;
  const tags = (full?.dietaryTags ?? "").split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <AnimatePresence>
      {recipe && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8">
          <motion.div
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div className="relative z-10 w-full max-w-2xl">
            <Card className="overflow-hidden shadow-(--shadow-lg)">
              <div className="relative">
                <motion.div layoutId={`recipe-img-${recipe.id}`}>
                  <RecipeImage
                    src={(full ?? recipe).imageUrl}
                    title={recipe.title}
                    className="h-64 w-full object-cover sm:h-80"
                    nameClassName="text-4xl"
                  />
                </motion.div>
                <button
                  onClick={close}
                  aria-label="Close"
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-foreground shadow-(--shadow-sm) backdrop-blur transition-colors hover:bg-surface"
                >
                  <ArrowLeftIcon size={16} />
                </button>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  {full?.cuisine && <Badge>{full.cuisine}</Badge>}
                  {tags.map((t) => (
                    <Badge key={t} tone="accent">
                      {t}
                    </Badge>
                  ))}
                </div>
                <motion.h2
                  layoutId={`recipe-title-${recipe.id}`}
                  className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground"
                >
                  {recipe.title}
                </motion.h2>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                  <p className="mt-3 leading-relaxed text-muted">{(full ?? recipe).description}</p>

                  <div className="mt-6 flex flex-wrap gap-5 text-sm text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <ClockIcon size={15} /> {(full ?? recipe).prepTime + (full ?? recipe).cookTime} min
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <UsersIcon size={15} /> Serves {(full ?? recipe).servings}
                    </span>
                    {(full ?? recipe).calories != null && (
                      <span className="inline-flex items-center gap-1.5">
                        <FlameIcon size={15} /> {(full ?? recipe).calories} cal
                      </span>
                    )}
                  </div>

                  {full?.ingredients && full.ingredients.length > 0 ? (
                    <>
                      <h3 className="mt-7 font-display text-lg font-semibold text-foreground">Ingredients</h3>
                      <ul className="mt-3 divide-y divide-border rounded-xl border border-border">
                        {full.ingredients.map((ing) => (
                          <li key={ing.id ?? ing.name} className="flex items-baseline justify-between px-4 py-2.5 text-sm">
                            <span className="text-foreground">{ing.name}</span>
                            <span className="text-muted">{ing.amount} {ing.unit}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <div className="mt-6 flex justify-center py-4">
                      <Spinner className="text-subtle" />
                    </div>
                  )}

                  <Link
                    href={`/recipes/${recipe.id}`}
                    className="mt-6 inline-block text-sm font-medium text-accent-hover hover:underline"
                  >
                    Open full page →
                  </Link>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
