import { fetchApi } from "@/lib/api-client";
import type {
  Role,
  RoleUpdateData,
  AssignRoleRequest,
  UpdateUserRolesRequest,
  ChangeUserRoleRequest,
  RoleCreateData,
} from "./types";

export const rolesService = {
  /**
   * Get all roles
   */
  getRoles: async (): Promise<Role[]> => {
    return fetchApi<Role[]>("/roles");
  },

  /**
   * Get role by ID
   */
  getRole: async (id: number): Promise<Role> => {
    return fetchApi<Role>(`/roles/${id}`);
  },

  /**
   * Create a new role
   */
  createRole: async (data: RoleCreateData): Promise<Role> => {
    return fetchApi<Role>("/roles", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update role
   */
  updateRole: async (id: number, data: RoleUpdateData): Promise<Role> => {
    return fetchApi<Role>(`/roles/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete role
   */
  deleteRole: async (id: number): Promise<void> => {
    return fetchApi<void>(`/roles/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Change user role (replace all existing roles with one role)
   */
  changeUserRole: async (userId: number, roleId: number): Promise<void> => {
    return fetchApi<void>(`/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify({ roleId } as ChangeUserRoleRequest),
    });
  },

  /**
   * Assign role to user
   */
  assignRoleToUser: async (userId: number, roleId: number): Promise<void> => {
    return fetchApi<void>(`/users/${userId}/roles`, {
      method: "POST",
      body: JSON.stringify({ roleId } as AssignRoleRequest),
    });
  },

  /**
   * Remove role from user
   */
  removeRoleFromUser: async (userId: number, roleId: number): Promise<void> => {
    return fetchApi<void>(`/users/${userId}/roles/${roleId}`, {
      method: "DELETE",
    });
  },

  /**
   * Update user roles (replace all roles)
   */
  updateUserRoles: async (userId: number, roleIds: number[]): Promise<void> => {
    return fetchApi<void>(`/users/${userId}/roles`, {
      method: "PUT",
      body: JSON.stringify({ roleIds } as UpdateUserRolesRequest),
    });
  },
}; 