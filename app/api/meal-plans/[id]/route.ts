import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/apiAuth";
import { readJson, requireString, ValidationError } from "@/lib/validation";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const MEAL_TYPES = ["breakfast", "lunch", "dinner"];

/** Load a meal plan only if it belongs to the caller. */
async function getOwnedPlan(id: string, userId: string) {
  const plan = await prisma.mealPlan.findUnique({ where: { id }, select: { userId: true } });
  if (!plan) return { error: NextResponse.json({ error: "Meal plan not found" }, { status: 404 }) };
  if (plan.userId !== userId) {
    return { error: NextResponse.json({ error: "You don't have access to this meal plan." }, { status: 403 }) };
  }
  return { ok: true as const };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireSession(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const owned = await getOwnedPlan(id, auth.userId);
  if ("error" in owned) return owned.error;

  const mealPlan = await prisma.mealPlan.findUnique({
    where: { id },
    include: { recipes: { include: { recipe: { include: { ingredients: true } } } } },
  });

  return NextResponse.json({ mealPlan });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireSession(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const owned = await getOwnedPlan(id, auth.userId);
  if ("error" in owned) return owned.error;

  try {
    const body = await readJson(req);
    const day = requireString(body.day, "day").toLowerCase();
    const mealType = requireString(body.mealType, "mealType").toLowerCase();
    const recipeId = requireString(body.recipeId, "recipeId");

    if (!DAYS.includes(day)) throw new ValidationError("Invalid day.");
    if (!MEAL_TYPES.includes(mealType)) throw new ValidationError("Invalid meal type.");

    // Use the recipe the client actually selected (previously this ignored the
    // payload and always grabbed the first recipe in the entire database).
    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId }, select: { id: true } });
    if (!recipe) throw new ValidationError("Selected recipe does not exist.");

    const mealPlanRecipe = await prisma.mealPlanRecipe.create({
      data: { day, mealType, recipeId: recipe.id, mealPlanId: id },
      include: { recipe: true },
    });

    return NextResponse.json({ mealPlanRecipe }, { status: 201 });
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[meal-plans/[id]:POST]", err);
    return NextResponse.json({ error: "Could not add recipe to meal plan." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireSession(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const owned = await getOwnedPlan(id, auth.userId);
  if ("error" in owned) return owned.error;

  const entryId = req.nextUrl.searchParams.get("entryId");
  if (entryId) {
    // Remove a single recipe slot from this plan.
    await prisma.mealPlanRecipe.deleteMany({ where: { id: entryId, mealPlanId: id } });
    return NextResponse.json({ success: true });
  }

  // Delete the whole plan and its slots.
  await prisma.$transaction([
    prisma.mealPlanRecipe.deleteMany({ where: { mealPlanId: id } }),
    prisma.mealPlan.delete({ where: { id } }),
  ]);
  return NextResponse.json({ success: true });
}
