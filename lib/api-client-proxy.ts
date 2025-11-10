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

/**
 * Make an API call through the Next.js proxy
 * Cookies are automatically included in same-origin requests
 */
export async function fetchApiProxy<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const url = `${PROXY_BASE_URL}/${cleanEndpoint}`;

  console.log("API Call URL (via proxy):", url);

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

  return handleResponse<T>(response);
}

/**
 * DELETE request through proxy
 */
export async function fetchApiProxyDelete(
  endpoint: string,
  options: RequestInit = {}
): Promise<void> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const url = `${PROXY_BASE_URL}/${cleanEndpoint}`;

  console.log("API Call URL (DELETE via proxy):", url);

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

