import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/apiAuth";
import {
  optionalString,
  readJson,
  requireString,
  toInt,
  ValidationError,
} from "@/lib/validation";

// Shared recipe catalog. Browsing requires a session (the catalog lives behind
// the authenticated app shell) but is not scoped to the caller.
export async function GET(req: NextRequest) {
  const auth = requireSession(req);
  if (auth instanceof NextResponse) return auth;

  const recipes = await prisma.recipe.findMany({
    include: {
      ingredients: true,
      user: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ recipes });
}

interface IngredientInput {
  name: string;
  amount: string;
  unit: string;
}

function parseIngredients(value: unknown): IngredientInput[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((i): i is Record<string, unknown> => i != null && typeof i === "object")
    .map((i) => ({
      name: optionalString(i.name) ?? "",
      amount: String(i.amount ?? "").slice(0, 100),
      unit: optionalString(i.unit) ?? "",
    }))
    .filter((i) => i.name.length > 0);
}

export async function POST(req: NextRequest) {
  const auth = requireSession(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await readJson(req);
    const title = requireString(body.title, "title", { max: 200 });
    const description = optionalString(body.description, 2000) ?? "";

    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        imageUrl: optionalString(body.imageUrl) ?? "/images/recipes/classic-pancakes.jpg",
        prepTime: toInt(body.prepTime),
        cookTime: toInt(body.cookTime),
        servings: Math.max(1, toInt(body.servings, 1)),
        calories: body.calories == null ? null : toInt(body.calories) || null,
        cuisine: optionalString(body.cuisine, 100),
        dietaryTags: optionalString(body.dietaryTags, 200),
        userId: auth.userId,
        ingredients: { create: parseIngredients(body.ingredients) },
      },
      include: { ingredients: true },
    });

    return NextResponse.json({ recipe }, { status: 201 });
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[recipes:POST]", err);
    return NextResponse.json({ error: "Could not create recipe." }, { status: 500 });
  }
}
