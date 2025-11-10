"use server";

import { revalidatePath } from "next/cache";
import { fetchApiServer, fetchApiServerDelete, buildQueryString } from "@/lib/api-server";
import type {
  User,
  UserCreateData,
  UserUpdateData,
  UsersQueryParams,
  PaginatedResponse,
} from "@/types/user";

/**
 * Get all users with filtering and pagination
 * Use in Server Components for initial data
 */
export async function getUsersAction(params: UsersQueryParams = {}) {
  try {
    const queryString = buildQueryString(
      params as Record<string, string | number | boolean | undefined>
    );
    const data = await fetchApiServer<PaginatedResponse<User>>(
      `/users${queryString}`
    );
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch users",
      data: null,
    };
  }
}

/**
 * Get user by ID
 */
export async function getUserAction(id: number) {
  try {
    const data = await fetchApiServer<User>(`/users/${id}`);
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch user",
      data: null,
    };
  }
}

/**
 * Create a new user
 */
export async function createUserAction(userData: UserCreateData) {
  try {
    const data = await fetchApiServer<User>("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    // Revalidate the users page to show the new user
    revalidatePath("/[locale]/(dashboard)/users");

    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to create user",
      data: null,
    };
  }
}

/**
 * Update user
 */
export async function updateUserAction(id: number, userData: UserUpdateData) {
  try {
    const data = await fetchApiServer<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });

    // Revalidate the users page and the user detail page
    revalidatePath("/[locale]/(dashboard)/users");
    revalidatePath(`/[locale]/(dashboard)/users/${id}`);

    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update user",
      data: null,
    };
  }
}

/**
 * Ban a user
 */
export async function banUserAction(id: number) {
  try {
    await fetchApiServer<void>(`/users/${id}/ban`, {
      method: "PUT",
    });

    revalidatePath("/[locale]/(dashboard)/users");

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to ban user",
    };
  }
}

/**
 * Unban a user
 */
export async function unbanUserAction(id: number) {
  try {
    await fetchApiServer<void>(`/users/${id}/unban`, {
      method: "PUT",
    });

    revalidatePath("/[locale]/(dashboard)/users");

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to unban user",
    };
  }
}

