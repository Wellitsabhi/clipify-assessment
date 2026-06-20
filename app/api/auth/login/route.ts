import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setAuthCookie, signToken } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { readJson, requireEmail, requireString, ValidationError } from "@/lib/validation";

// A generic message for every failure mode so we never reveal whether an
// email exists or leak details about other accounts.
const INVALID_CREDENTIALS = "Invalid email or password.";

export async function POST(req: NextRequest) {
  try {
    const body = await readJson(req);
    const email = requireEmail(body.email);
    const password = requireString(body.password, "password", { trim: false });

    const user = await prisma.user.findUnique({ where: { email } });

    // Always run a hash comparison to keep timing roughly uniform whether or
    // not the user exists, mitigating account-enumeration via response time.
    const stored = user?.password ?? "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv";
    const ok = await verifyPassword(password, stored);

    if (!user || !ok) {
      return NextResponse.json({ error: INVALID_CREDENTIALS }, { status: 401 });
    }

    const token = signToken({ userId: user.id, email: user.email });
    const res = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
    });
    return setAuthCookie(res, token);
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[auth/login]", err);
    return NextResponse.json({ error: "Could not sign in." }, { status: 500 });
  }
}
