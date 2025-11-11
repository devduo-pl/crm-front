import { fetchApiProxy as fetchApi } from "@/lib/api-client-proxy";
import type {
  Permission,
  PermissionCreateData,
  PermissionUpdateData,
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
    return fetchApi<void>(`/roles/${roleId}/permissions/${permissionId}`, {
      method: "POST",
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
   * This makes multiple POST requests to assign each permission individually
   */
  updateRolePermissions: async (
    roleId: number,
    permissionIds: number[]
  ): Promise<void> => {
    // First, get current permissions to determine what to remove
    const currentPermissions = await permissionsService.getRolePermissions(
      roleId
    );
    const currentPermissionIds = currentPermissions.map((p) => p.id);

    // Remove permissions that are no longer selected
    const permissionsToRemove = currentPermissionIds.filter(
      (id) => !permissionIds.includes(id)
    );
    for (const permissionId of permissionsToRemove) {
      await permissionsService.removePermissionFromRole(roleId, permissionId);
    }

    // Add new permissions
    const permissionsToAdd = permissionIds.filter(
      (id) => !currentPermissionIds.includes(id)
    );
    for (const permissionId of permissionsToAdd) {
      try {
        await permissionsService.assignPermissionToRole(roleId, permissionId);
      } catch (err) {
        // Ignore 400 errors (permission already exists)
        if (err instanceof Error && !err.message.includes("400")) {
          throw err;
        }
      }
    }
  },
};
