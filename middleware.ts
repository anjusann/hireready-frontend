import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/resumes",
  "/ats-analysis",
  "/job-match",
  "/cover-letter",
  "/interview-prep",
  "/applications",
  "/settings",
  "/profile",
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Only redirect to home if trying to access protected route without token
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Do NOT redirect from login/register — let the page handle it
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};