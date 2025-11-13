import { fetchApiProxy as fetchApi } from "@/lib/api-client-proxy";
import { normalizeUser } from "@/lib/normalizeUser";
import type {
  LoginCredentials,
  LoginResponse,
  RefreshTokenResponse,
  RegisterUserData,
  PasswordRecoveryRequest,
  ResetPasswordRequest,
} from "./types";

export const authService = {
  /**
   * Login with email and password
   * Cookies are set by the server
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await fetchApi<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    const normalizedUser = normalizeUser(response.user);

    return {
      ...response,
      user: normalizedUser ?? response.user,
    };
  },

  /**
   * Logout user
   * Cookies are cleared by the server
   */
  logout: async (): Promise<void> => {
    try {
      await fetchApi("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Server logout failed:", error);
    }
  },

  /**
   * Refresh access token
   * New cookies are set by the server
   */
  refreshToken: async (): Promise<boolean> => {
    try {
      const response = await fetchApi<RefreshTokenResponse>("/auth/refresh", {
        method: "POST",
      });
      console.log("Refresh token response:", response);
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  },

  /**
   * Get current user info
   */
  getCurrentUser: async () => {
    try {
      const response = await fetchApi<LoginResponse>("/auth/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      return normalizeUser(response.user);
    } catch {
      return null;
    }
  },

  /**
   * Register new user
   * Cookies are set by the server
   */
  register: async (userData: RegisterUserData): Promise<LoginResponse> => {
    const response = await fetchApi<LoginResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    const normalizedUser = normalizeUser(response.user);

    return {
      ...response,
      user: normalizedUser ?? response.user,
    };
  },

  /**
   * Request password recovery
   */
  requestPasswordRecovery: async (email: string): Promise<void> => {
    await fetchApi("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email } as PasswordRecoveryRequest),
    });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await fetchApi("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token,
        password: newPassword,
      } as ResetPasswordRequest),
    });
  },

  /**
   * Verify account with token
   */
  verifyAccount: async (token: string): Promise<void> => {
    await fetchApi(`/auth/verify-account?token=${encodeURIComponent(token)}`, {
      method: "POST",
    });
  },
};
