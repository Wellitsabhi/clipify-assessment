import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/apiAuth";
import { readJson, requireString, ValidationError } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const auth = requireSession(req);
  if (auth instanceof NextResponse) return auth;

  const mealPlans = await prisma.mealPlan.findMany({
    where: { userId: auth.userId },
    include: { recipes: { include: { recipe: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ mealPlans });
}

function parseDate(value: unknown, field: string): Date {
  const d = new Date(typeof value === "string" || typeof value === "number" ? value : NaN);
  if (Number.isNaN(d.getTime())) {
    throw new ValidationError(`"${field}" must be a valid date.`);
  }
  return d;
}

export async function POST(req: NextRequest) {
  const auth = requireSession(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await readJson(req);
    const name = requireString(body.name, "name", { max: 120 });
    const startDate = parseDate(body.startDate, "startDate");
    const endDate = parseDate(body.endDate, "endDate");
    if (endDate < startDate) {
      throw new ValidationError("endDate must be on or after startDate.");
    }

    const mealPlan = await prisma.mealPlan.create({
      data: { name, startDate, endDate, userId: auth.userId },
      include: { recipes: { include: { recipe: true } } },
    });

    return NextResponse.json({ mealPlan }, { status: 201 });
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[meal-plans:POST]", err);
    return NextResponse.json({ error: "Could not create meal plan." }, { status: 500 });
  }
}
