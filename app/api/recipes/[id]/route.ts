import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/apiAuth";
import { optionalString, readJson, requireString, toInt, ValidationError } from "@/lib/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireSession(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      ingredients: true,
      // Do not expose the owner's email to other users.
      user: { select: { name: true } },
    },
  });

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  return NextResponse.json({ recipe });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireSession(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const existing = await prisma.recipe.findUnique({ where: { id }, select: { userId: true } });
  if (!existing) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }
  if (existing.userId !== auth.userId) {
    return NextResponse.json({ error: "You don't have access to this recipe." }, { status: 403 });
  }

  try {
    const body = await readJson(req);
    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        title: requireString(body.title, "title", { max: 200 }),
        description: optionalString(body.description, 2000) ?? "",
        prepTime: toInt(body.prepTime),
        cookTime: toInt(body.cookTime),
        servings: Math.max(1, toInt(body.servings, 1)),
        calories: body.calories == null ? null : toInt(body.calories) || null,
        cuisine: optionalString(body.cuisine, 100),
        dietaryTags: optionalString(body.dietaryTags, 200),
      },
    });
    return NextResponse.json({ recipe });
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[recipes/[id]:PUT]", err);
    return NextResponse.json({ error: "Could not update recipe." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireSession(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const existing = await prisma.recipe.findUnique({ where: { id }, select: { userId: true } });
  if (!existing) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }
  if (existing.userId !== auth.userId) {
    return NextResponse.json({ error: "You don't have access to this recipe." }, { status: 403 });
  }

  // Remove dependent rows then the recipe itself, atomically.
  await prisma.$transaction([
    prisma.ingredient.deleteMany({ where: { recipeId: id } }),
    prisma.mealPlanRecipe.deleteMany({ where: { recipeId: id } }),
    prisma.recipe.delete({ where: { id } }),
  ]);

  return NextResponse.json({ success: true });
}
