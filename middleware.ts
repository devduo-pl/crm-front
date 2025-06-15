import { NextRequest, NextResponse } from "next/server";
import { isTokenExpired } from "./lib/auth";

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/signup",
  "/password-recovery",
  "/verify-account",
  "/login",
];

// Protected routes that require authentication
const PROTECTED_ROUTES = ["/dashboard"];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

function isPublicRoute(pathname: string): boolean {
  // Exact match for root, or check if it matches any public route exactly or starts with it
  // but make sure it's not a protected route first
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

  // Check if user is authenticated
  const isAuthenticated = accessToken && !isTokenExpired(accessToken);

  // Debug logging in development
  if (process.env.NODE_ENV === "development") {
    console.log("🔧 Middleware Debug:", {
      pathname,
      isAuthenticated,
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      isProtected: isProtectedRoute(pathname),
      isPublic: isPublicRoute(pathname),
    });
  }

  // If user is authenticated and on an auth-related public route, redirect to dashboard
  if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is not authenticated and trying to access protected route
  if (!isAuthenticated && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If token is expired but we have a refresh token, add a header to trigger refresh
  if (
    accessToken &&
    isTokenExpired(accessToken) &&
    refreshToken &&
    !isPublicRoute(pathname)
  ) {
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
