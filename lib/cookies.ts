import { AuthTokens } from "./auth";

/**
 * Since cookies are HttpOnly, we can't set them client-side
 * This function is kept for reference but won't be used
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function setAuthTokens(_tokens: AuthTokens): void {
  console.warn("setAuthTokens should be called server-side only");
}

/**
 * Since cookies are HttpOnly, we can't read them client-side
 * This function is kept for reference but won't be used
 */
export function getAuthTokens(): Partial<AuthTokens> {
  console.warn("getAuthTokens should be called server-side only");
  return {};
}

/**
 * Since cookies are HttpOnly, we can't clear them client-side
 * This function is kept for reference but won't be used
 */
export function clearAuthTokens(): void {
  console.warn("clearAuthTokens should be called server-side only");
}
