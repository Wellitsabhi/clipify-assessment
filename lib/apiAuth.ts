import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, type SessionPayload } from "@/lib/auth";

/**
 * Resolve the session from a request, or return a 401 response to short-circuit.
 *
 *   const auth = requireSession(req);
 *   if (auth instanceof NextResponse) return auth;
 *   // auth.userId is now available
 */
export function requireSession(req: NextRequest): SessionPayload | NextResponse {
  const session = getUserFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  return session;
}
