"use server";

import { cookies } from "next/headers";
import { fetchApiServer } from "@/lib/api-server";
import type { LoginResponse, RegisterUserData } from "@/services/auth/types";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string" && error.length > 0) {
    return error;
  }

  return fallback;
};

/**
 * Server Action for login
 * Can be called from Client Components without API routes
 */
export async function loginAction(
  email: string,
  password: string,
  rememberMe: boolean
) {
  try {
    const response = await fetchApiServer<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, rememberMe }),
    });

    // Cookies are automatically set by fetchApiServer
    return {
      success: true,
      user: response.user,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error, "Login failed"),
    };
  }
}

/**
 * Server Action for logout
 */
export async function logoutAction() {
  try {
    await fetchApiServer("/auth/logout", {
      method: "POST",
    });

    // Clear cookies
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    return { success: true };
  } catch (error: unknown) {
    // Clear cookies even if server request fails
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    return {
      success: false,
      error: getErrorMessage(error, "Logout failed"),
    };
  }
}

/**
 * Server Action for registration
 */
export async function registerAction(userData: RegisterUserData) {
  try {
    const response = await fetchApiServer<LoginResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    return {
      success: true,
      user: response.user,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error, "Registration failed"),
    };
  }
}

/**
 * Server Action for password recovery request
 */
export async function forgotPasswordAction(email: string) {
  try {
    await fetchApiServer("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    return {
      success: true,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to send reset email"),
    };
  }
}

/**
 * Server Action for password reset
 */
export async function resetPasswordAction(token: string, password: string) {
  try {
    await fetchApiServer("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });

    return {
      success: true,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to reset password"),
    };
  }
}

/**
 * Get current user from Server Component or Server Action
 */
export async function getCurrentUser() {
  try {
    const response = await fetchApiServer<LoginResponse>("/auth/profile");
    return response.user;
  } catch {
    return null;
  }
}
