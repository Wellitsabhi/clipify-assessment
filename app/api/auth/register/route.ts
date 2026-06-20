import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { setAuthCookie, signToken } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { readJson, requireEmail, requireString, ValidationError } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await readJson(req);
    const email = requireEmail(body.email);
    const password = requireString(body.password, "password", { min: 8, max: 200, trim: false });
    const name = requireString(body.name, "name", { min: 1, max: 100 });

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: { email, password: passwordHash, name },
    });

    const token = signToken({ userId: user.id, email: user.email });
    const res = NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.name, plan: user.plan } },
      { status: 201 }
    );
    return setAuthCookie(res, token);
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    // Unique constraint violation → email already registered.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }
    console.error("[auth/register]", err);
    return NextResponse.json({ error: "Could not create account." }, { status: 500 });
  }
}
