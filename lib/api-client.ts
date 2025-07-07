import { API_CONFIG } from "./config";

const BASE_URL = API_CONFIG.BASE_URL;

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

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  // Prepare headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  return handleResponse<T>(response);
}

export async function fetchApiDelete(
  endpoint: string,
  options: RequestInit = {}
): Promise<void> {
  const url = `${BASE_URL}${endpoint}`;

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

  // For DELETE operations, we only care about the status
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

  return;
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
