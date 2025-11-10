import { cookies } from "next/headers";
import { API_CONFIG } from "./config";

const BASE_URL = API_CONFIG.BASE_URL;

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Server-side API client for use in Server Components and Server Actions
 * Automatically includes cookies from the request
 */
export async function fetchApiServer<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  console.log("[Server API] Fetching:", url);

  // Get cookies from the request
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  // Prepare headers
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Add cookies to request if they exist
  let cookieHeader = "";
  if (accessToken) {
    cookieHeader = `access_token=${accessToken}`;
  }
  if (refreshToken) {
    cookieHeader += `${cookieHeader ? "; " : ""}refresh_token=${refreshToken}`;
  }
  if (cookieHeader) {
    headers["Cookie"] = cookieHeader;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
      // Don't cache by default for server components
      cache: options.cache || "no-store",
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "An error occurred" }));
      throw new ApiError(
        response.status,
        error.message || "An error occurred",
        error
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("[Server API] Error:", error);
    throw new ApiError(500, "Failed to fetch from server", error);
  }
}

/**
 * Server-side DELETE request
 */
export async function fetchApiServerDelete(
  endpoint: string,
  options: RequestInit = {}
): Promise<void> {
  await fetchApiServer<void>(endpoint, {
    ...options,
    method: "DELETE",
  });
}

export function buildQueryString(
  params: Record<string, string | number | boolean | null | undefined>
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

