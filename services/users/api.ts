import { fetchApiProxy as fetchApi, buildQueryString } from "@/lib/api-client-proxy";
import type {
  User,
  UserCreateData,
  UserUpdateData,
  UsersQueryParams,
  PaginatedResponse,
} from "./types";

export const usersService = {
  /**
   * Get all users with filtering and pagination
   */
  getUsers: async (
    params: UsersQueryParams = {}
  ): Promise<PaginatedResponse<User>> => {
    const queryString = buildQueryString(
      params as Record<string, string | number | boolean | undefined>
    );
    return fetchApi<PaginatedResponse<User>>(`/users${queryString}`);
  },

  /**
   * Get user by ID
   */
  getUser: async (id: number): Promise<User> => {
    return fetchApi<User>(`/users/${id}`);
  },

  /**
   * Create a new user
   */
  createUser: async (data: UserCreateData): Promise<User> => {
    return fetchApi<User>("/auth/create-account", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update user profile
   */
  updateUser: async (id: number, data: UserUpdateData): Promise<User> => {
    return fetchApi<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Ban a user
   */
  banUser: async (id: number): Promise<void> => {
    return fetchApi<void>(`/users/${id}/ban`, {
      method: "PUT",
    });
  },

  /**
   * Unban a user
   */
  unbanUser: async (id: number): Promise<void> => {
    return fetchApi<void>(`/users/${id}/unban`, {
      method: "PUT",
    });
  },
};
