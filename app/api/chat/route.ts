import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/apiAuth";
import { readJson, requireString, ValidationError } from "@/lib/validation";
import { generateRecipeImage } from "@/lib/nanoBanana";
import { extractRecipe, generateAssistantReply, type ChatTurn } from "@/lib/recipeBot";

// Keep the last N turns as context to bound token usage and cost.
const MAX_HISTORY = 20;

export async function GET(req: NextRequest) {
  const auth = requireSession(req);
  if (auth instanceof NextResponse) return auth;

  const history = await prisma.chatMessage.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: "asc" },
    select: { id: true, role: true, content: true },
  });

  // Return only what the UI needs. The system prompt and model config stay
  // server-side and are never exposed to the client.
  return NextResponse.json({ messages: history });
}

export async function POST(req: NextRequest) {
  const auth = requireSession(req);
  if (auth instanceof NextResponse) return auth;

  let message: string;
  try {
    const body = await readJson(req);
    message = requireString(body.message, "message", { max: 4000 });
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }

  try {
    await prisma.chatMessage.create({
      data: { role: "user", content: message, userId: auth.userId },
    });

    const recent = await prisma.chatMessage.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: "desc" },
      take: MAX_HISTORY,
      select: { role: true, content: true },
    });
    const history: ChatTurn[] = recent
      .reverse()
      .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));

    const assistantMessage = await generateAssistantReply(history);

    await prisma.chatMessage.create({
      data: { role: "assistant", content: assistantMessage, userId: auth.userId },
    });

    // Best-effort: turn the reply into a saved recipe when it contains one.
    let createdRecipe = null;
    const extracted = await extractRecipe(assistantMessage);
    if (extracted) {
      createdRecipe = await prisma.recipe.create({
        data: {
          title: extracted.title,
          description: extracted.description,
          imageUrl: "/images/recipes/classic-pancakes.jpg",
          prepTime: extracted.prepTime,
          cookTime: extracted.cookTime,
          servings: extracted.servings,
          calories: extracted.calories,
          cuisine: extracted.cuisine,
          dietaryTags: extracted.dietaryTags,
          userId: auth.userId,
          ingredients: { create: extracted.ingredients },
        },
        include: { ingredients: true },
      });

      // Image generation is optional; failure must not break recipe creation.
      try {
        const imageUrl = await generateRecipeImage(extracted.imagePrompt);
        await prisma.recipe.update({ where: { id: createdRecipe.id }, data: { imageUrl } });
        createdRecipe.imageUrl = imageUrl;
      } catch (imgErr) {
        console.warn("[chat] recipe image generation failed:", imgErr);
      }
    }

    return NextResponse.json({ message: assistantMessage, recipe: createdRecipe });
  } catch (err) {
    console.error("[chat:POST]", err);
    return NextResponse.json(
      { error: "Chef Ferraro is unavailable right now. Please try again." },
      { status: 502 }
    );
  }
}

export const dynamic = "force-dynamic";
