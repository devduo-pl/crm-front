import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { permissionsService } from "@/services/permissions";
import type {
  Permission,
  PermissionCreateData,
  PermissionUpdateData,
} from "@/services/permissions";

// Query keys
const PERMISSIONS_QUERY_KEY = ["permissions"];
const rolePermissionsQueryKey = (roleId: number) => [
  "roles",
  roleId,
  "permissions",
];

/**
 * Hook to fetch all permissions
 */
export function usePermissions() {
  return useQuery({
    queryKey: PERMISSIONS_QUERY_KEY,
    queryFn: () => permissionsService.getPermissions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single permission by ID
 */
export function usePermission(id: number) {
  return useQuery({
    queryKey: [...PERMISSIONS_QUERY_KEY, id],
    queryFn: () => permissionsService.getPermission(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch permissions for a specific role
 */
export function useRolePermissions(roleId: number) {
  return useQuery({
    queryKey: rolePermissionsQueryKey(roleId),
    queryFn: () => permissionsService.getRolePermissions(roleId),
    enabled: !!roleId,
  });
}

/**
 * Hook to create a new permission
 */
export function useCreatePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PermissionCreateData) =>
      permissionsService.createPermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PERMISSIONS_QUERY_KEY });
    },
  });
}

/**
 * Hook to update a permission
 */
export function useUpdatePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PermissionUpdateData }) =>
      permissionsService.updatePermission(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PERMISSIONS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...PERMISSIONS_QUERY_KEY, variables.id],
      });
    },
  });
}

/**
 * Hook to delete a permission
 */
export function useDeletePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => permissionsService.deletePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PERMISSIONS_QUERY_KEY });
    },
  });
}

/**
 * Hook to assign a permission to a role
 */
export function useAssignPermissionToRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roleId,
      permissionId,
    }: {
      roleId: number;
      permissionId: number;
    }) => permissionsService.assignPermissionToRole(roleId, permissionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: rolePermissionsQueryKey(variables.roleId),
      });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}

/**
 * Hook to remove a permission from a role
 */
export function useRemovePermissionFromRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roleId,
      permissionId,
    }: {
      roleId: number;
      permissionId: number;
    }) => permissionsService.removePermissionFromRole(roleId, permissionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: rolePermissionsQueryKey(variables.roleId),
      });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}

/**
 * Hook to update role permissions (replace all)
 */
export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roleId,
      permissionIds,
    }: {
      roleId: number;
      permissionIds: number[];
    }) => permissionsService.updateRolePermissions(roleId, permissionIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: rolePermissionsQueryKey(variables.roleId),
      });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}

