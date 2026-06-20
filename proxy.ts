import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16 renamed Middleware → Proxy. This is an *optimistic* auth gate:
// it redirects based on the presence of the session cookie so signed-out users
// don't see the app shell, and signed-in users skip the auth screens. Real
// authorization (JWT verification + ownership checks) happens in the API routes.

const AUTH_COOKIE = "token";
const PROTECTED = ["/recipes", "/chat", "/meal-plans", "/settings"];
const AUTH_PAGES = ["/login", "/register"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = Boolean(req.cookies.get(AUTH_COOKIE)?.value);

  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (isProtected && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (AUTH_PAGES.includes(pathname) && hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/recipes";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/recipes/:path*", "/chat/:path*", "/meal-plans/:path*", "/settings/:path*", "/login", "/register"],
};
