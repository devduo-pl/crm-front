import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

/**
 * Universal API proxy route
 * Forwards all requests to the backend with cookies
 * Handles: GET, POST, PUT, DELETE, PATCH
 */
async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Await params in Next.js 15+
    const resolvedParams = await params;
    const path = resolvedParams.path?.join("/") || "";
    const url = `${BACKEND_URL}/${path}`;
    
    // Get cookies from request
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;

    // Prepare headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Add cookies to backend request if they exist
    if (accessToken) {
      headers["Cookie"] = `access_token=${accessToken}${
        refreshToken ? `; refresh_token=${refreshToken}` : ""
      }`;
    }

    // Get request body if it exists
    let body: string | undefined;
    if (request.method !== "GET" && request.method !== "HEAD") {
      try {
        body = await request.text();
      } catch {
        body = undefined;
      }
    }

    // Forward request to backend
    const backendResponse = await fetch(url, {
      method: request.method,
      headers,
      body,
      credentials: "include",
    });

    // Get response data
    const data = await backendResponse.text();
    
    // Create response
    const response = new NextResponse(data, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Forward all Set-Cookie headers from backend to client
    // Note: The backend may send multiple Set-Cookie headers (access_token, refresh_token)
    // We need to get them using the raw headers API
    const setCookieHeaders = backendResponse.headers.getSetCookie?.() || [];
    
    if (setCookieHeaders.length > 0) {
      // Append each Set-Cookie header separately
      setCookieHeaders.forEach((cookie) => {
        response.headers.append("Set-Cookie", cookie);
      });
    } else {
      // Fallback for older Node versions that don't have getSetCookie
      const setCookieHeader = backendResponse.headers.get("set-cookie");
      if (setCookieHeader) {
        response.headers.set("Set-Cookie", setCookieHeader);
      }
    }

    return response;
  } catch (error) {
    console.error("[API Proxy] Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;

