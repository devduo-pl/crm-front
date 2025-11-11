export interface Permission {
  id: number;
  name: string; // Backend uses 'name' as the unique identifier (permission key)
  description: string;
  createdAt: string;
  updatedAt: string;
  // Computed property for compatibility
  key?: string; // This will be the same as 'name'
}

export interface PermissionCreateData {
  name: string; // This is the permission key (e.g., 'view_users')
  description: string;
}

export interface PermissionUpdateData {
  name?: string;
  description?: string;
}

export interface RolePermission {
  roleId: number;
  permissionId: number;
}

export interface AssignPermissionToRoleRequest {
  permissionId: number;
}

export interface UpdateRolePermissionsRequest {
  permissionIds: number[];
}

