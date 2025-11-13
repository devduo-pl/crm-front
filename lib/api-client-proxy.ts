/**
 * Client-side API client that uses Next.js API routes as a proxy
 * This avoids CORS issues and keeps the backend URL hidden
 */

// Use Next.js API proxy route instead of direct backend URL
const PROXY_BASE_URL = "/api/proxy";

export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: ApiErrorResponse
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));
    throw new ApiError(
      response.status,
      error.message || "An error occurred",
      error as ApiErrorResponse
    );
  }

  return response.json();
}

// Track if we're currently refreshing to prevent multiple refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Attempt to refresh the access token
 */
async function attemptTokenRefresh(): Promise<boolean> {
  // If already refreshing, wait for the existing refresh to complete
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${PROXY_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Token refresh successful");
        return true;
      }
      
      console.error("Token refresh failed:", response.status);
      return false;
    } catch (error) {
      console.error("Token refresh error:", error);
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Make an API call through the Next.js proxy
 * Cookies are automatically included in same-origin requests
 * Automatically handles 401 errors by refreshing tokens
 */
export async function fetchApiProxy<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const url = `${PROXY_BASE_URL}/${cleanEndpoint}`;

  // Prepare headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Include cookies
  });

  // If we get a 401 and this is not the refresh endpoint itself
  if (response.status === 401 && !endpoint.includes("/auth/refresh") && !endpoint.includes("/auth/login")) {
    console.log("Received 401, attempting token refresh...");
    
    // Attempt to refresh the token
    const refreshSuccess = await attemptTokenRefresh();
    
    if (refreshSuccess) {
      // Retry the original request with the new token
      console.log("Retrying original request after token refresh...");
      const retryResponse = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });
      
      return handleResponse<T>(retryResponse);
    } else {
      // Refresh failed, redirect to login
      console.error("Token refresh failed, redirecting to login...");
      window.location.href = "/login";
      throw new ApiError(401, "Session expired. Please login again.");
    }
  }

  return handleResponse<T>(response);
}

/**
 * DELETE request through proxy
 * Automatically handles 401 errors by refreshing tokens
 */
export async function fetchApiProxyDelete(
  endpoint: string,
  options: RequestInit = {}
): Promise<void> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const url = `${PROXY_BASE_URL}/${cleanEndpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...options,
    method: "DELETE",
    headers,
    credentials: "include",
  });

  // If we get a 401 and this is not the refresh endpoint itself
  if (response.status === 401 && !endpoint.includes("/auth/refresh") && !endpoint.includes("/auth/login")) {
    console.log("Received 401 on DELETE, attempting token refresh...");
    
    // Attempt to refresh the token
    const refreshSuccess = await attemptTokenRefresh();
    
    if (refreshSuccess) {
      // Retry the original request with the new token
      console.log("Retrying DELETE request after token refresh...");
      const retryResponse = await fetch(url, {
        ...options,
        method: "DELETE",
        headers,
        credentials: "include",
      });
      
      if (!retryResponse.ok) {
        const error = await retryResponse
          .json()
          .catch(() => ({ message: "An error occurred" }));
        throw new ApiError(
          retryResponse.status,
          error.message || "An error occurred",
          error as ApiErrorResponse
        );
      }
      return;
    } else {
      // Refresh failed, redirect to login
      console.error("Token refresh failed, redirecting to login...");
      window.location.href = "/login";
      throw new ApiError(401, "Session expired. Please login again.");
    }
  }

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));
    throw new ApiError(
      response.status,
      error.message || "An error occurred",
      error as ApiErrorResponse
    );
  }
}

type QueryParamValue = string | number | boolean | null | undefined;

export function buildQueryString(
  params: Record<string, QueryParamValue>
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
