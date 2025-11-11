import { fetchApiProxy as fetchApi } from "@/lib/api-client-proxy";
import type {
  Permission,
  PermissionCreateData,
  PermissionUpdateData,
  UpdateRolePermissionsRequest,
} from "./types";

export const permissionsService = {
  /**
   * Get all permissions
   */
  getPermissions: async (): Promise<Permission[]> => {
    return fetchApi<Permission[]>("/permissions");
  },

  /**
   * Get permission by ID
   */
  getPermission: async (id: number): Promise<Permission> => {
    return fetchApi<Permission>(`/permissions/${id}`);
  },

  /**
   * Create a new permission
   */
  createPermission: async (data: PermissionCreateData): Promise<Permission> => {
    return fetchApi<Permission>("/permissions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update permission
   */
  updatePermission: async (
    id: number,
    data: PermissionUpdateData
  ): Promise<Permission> => {
    return fetchApi<Permission>(`/permissions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete permission
   */
  deletePermission: async (id: number): Promise<void> => {
    return fetchApi<void>(`/permissions/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Get permissions for a specific role
   */
  getRolePermissions: async (roleId: number): Promise<Permission[]> => {
    return fetchApi<Permission[]>(`/roles/${roleId}/permissions`);
  },

  /**
   * Assign permission to role
   */
  assignPermissionToRole: async (
    roleId: number,
    permissionId: number
  ): Promise<void> => {
    return fetchApi<void>(`/roles/${roleId}/permissions`, {
      method: "POST",
      body: JSON.stringify({ permissionId }),
    });
  },

  /**
   * Remove permission from role
   */
  removePermissionFromRole: async (
    roleId: number,
    permissionId: number
  ): Promise<void> => {
    return fetchApi<void>(`/roles/${roleId}/permissions/${permissionId}`, {
      method: "DELETE",
    });
  },

  /**
   * Update role permissions (replace all)
   */
  updateRolePermissions: async (
    roleId: number,
    permissionIds: number[]
  ): Promise<void> => {
    return fetchApi<void>(`/roles/${roleId}/permissions`, {
      method: "PUT",
      body: JSON.stringify({ permissionIds } as UpdateRolePermissionsRequest),
    });
  },
};
