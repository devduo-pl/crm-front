import { NextRequest, NextResponse } from "next/server";
import { isTokenExpired } from "./lib/auth";

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/password-recovery",
  "/verify-account",
];

// Protected routes that require authentication
const PROTECTED_ROUTES = ["/dashboard"];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

function isPublicRoute(pathname: string): boolean {
  if (isProtectedRoute(pathname)) {
    return false;
  }
  return PUBLIC_ROUTES.some((route) => {
    if (route === "/") {
      return pathname === "/";
    }
    return pathname === route || pathname.startsWith(route + "/");
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for certain paths to avoid issues
  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Get tokens from cookies
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // Check if token is expired
  let tokenExpired = false;
  if (accessToken) {
    try {
      tokenExpired = isTokenExpired(accessToken);
    } catch {
      tokenExpired = true; // Treat invalid tokens as expired
    }
  }

  // Check if user is authenticated
  const isAuthenticated = accessToken && !tokenExpired;

  // If user is authenticated and on home page or auth-related routes, redirect to dashboard
  if (isAuthenticated && (pathname === "/" || pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is not authenticated and trying to access protected route, redirect to login
  if (!isAuthenticated && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If token is expired but we have a refresh token, add a header to trigger refresh
  if (accessToken && tokenExpired && refreshToken && !isPublicRoute(pathname)) {
    const response = NextResponse.next();
    response.headers.set("x-token-expired", "true");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
