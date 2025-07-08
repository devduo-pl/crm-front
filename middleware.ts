import { NextRequest, NextResponse } from "next/server";
import { isTokenExpired } from "./lib/auth";
import createIntlMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n";

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

// Create the intl middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for certain paths to avoid issues
  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Handle i18n routing first
  const intlResponse = intlMiddleware(request);

  // Extract locale from pathname for auth checks
  const pathnameWithoutLocale =
    pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";

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
  if (
    isAuthenticated &&
    (pathnameWithoutLocale === "/" ||
      pathnameWithoutLocale === "/login" ||
      pathnameWithoutLocale === "/signup")
  ) {
    const url = new URL("/dashboard", request.url);
    // Preserve the locale in the redirect
    const locale = pathname.match(/^\/([a-z]{2})\//)?.[1];
    if (locale && locale !== defaultLocale) {
      url.pathname = `/${locale}/dashboard`;
    }
    return NextResponse.redirect(url);
  }

  // If user is not authenticated and trying to access protected route, redirect to login
  if (!isAuthenticated && isProtectedRoute(pathnameWithoutLocale)) {
    const url = new URL("/login", request.url);
    // Preserve the locale in the redirect
    const locale = pathname.match(/^\/([a-z]{2})\//)?.[1];
    if (locale && locale !== defaultLocale) {
      url.pathname = `/${locale}/login`;
    }
    return NextResponse.redirect(url);
  }

  // If token is expired but we have a refresh token, add a header to trigger refresh
  if (
    accessToken &&
    tokenExpired &&
    refreshToken &&
    !isPublicRoute(pathnameWithoutLocale)
  ) {
    const response = intlResponse || NextResponse.next();
    response.headers.set("x-token-expired", "true");
    return response;
  }

  return intlResponse;
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
