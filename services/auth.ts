import { fetchApi } from "@/lib/api-client";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface RefreshTokenResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

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

    return response;
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
      await fetchApi<RefreshTokenResponse>("/auth/refresh", {
        method: "POST",
      });
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
      const response = await fetchApi<LoginResponse>("/auth/me", {});
      return response.user;
    } catch {
      return null;
    }
  },

  /**
   * Register new user
   * Cookies are set by the server
   */
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<LoginResponse> => {
    const response = await fetchApi<LoginResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    return response;
  },

  /**
   * Request password recovery
   */
  requestPasswordRecovery: async (email: string): Promise<void> => {
    await fetchApi("/auth/password-recovery", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await fetchApi("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password: newPassword }),
    });
  },

  /**
   * Verify account with token
   */
  verifyAccount: async (token: string): Promise<void> => {
    await fetchApi("/auth/verify-account", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  },
};
