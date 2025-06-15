import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  exp: number;
  iat: number;
  sub: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

/**
 * Check if a JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    // Add a 30-second buffer to account for network delays
    return decoded.exp < currentTime + 30;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
}

/**
 * Get token expiration time
 */
export function getTokenExpiration(token: string): Date | null {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return new Date(decoded.exp * 1000);
  } catch {
    return null;
  }
}

/**
 * Validate if token structure is valid
 */
export function isValidTokenStructure(token: string): boolean {
  try {
    const decoded = jwtDecode(token);
    return decoded && typeof decoded === "object";
  } catch {
    return false;
  }
}

/**
 * Check if user is authenticated based on tokens
 */
export function isAuthenticated(
  accessToken?: string,
  refreshToken?: string
): boolean {
  if (!accessToken) return false;

  // If access token is valid and not expired
  if (isValidTokenStructure(accessToken) && !isTokenExpired(accessToken)) {
    return true;
  }

  // If access token is expired but we have a refresh token, consider it authenticated
  // (the app should handle token refresh)
  if (
    refreshToken &&
    isValidTokenStructure(refreshToken) &&
    !isTokenExpired(refreshToken)
  ) {
    return true;
  }

  return false;
}

/**
 * Extract user info from token
 */
export function getUserFromToken(token: string): DecodedToken | null {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return {
      id: decoded.sub,
      ...decoded,
    };
  } catch {
    return null;
  }
}
