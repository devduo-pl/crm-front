export interface Role {
  id: number;
  name: string;
  description: string;
  permissions?: string[]; // Array of permission keys
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UserRole {
  userId: number;
  roleId: number;
}

export interface RoleCreateData {
  name: string;
  description: string;
}

export interface RoleUpdateData {
  name?: string;
  description?: string;
}

export interface AssignRoleRequest {
  roleId: number;
}

export interface ChangeUserRoleRequest {
  roleId: number;
}

export interface UpdateUserRolesRequest {
  roleIds: number[];
} 