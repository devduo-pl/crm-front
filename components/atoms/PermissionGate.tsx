"use client";

import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";

interface PermissionGateProps {
  /**
   * Single permission key required to view the content
   */
  permission?: string;

  /**
   * Array of permission keys - user must have ANY of these permissions
   */
  anyPermissions?: string[];

  /**
   * Array of permission keys - user must have ALL of these permissions
   */
  allPermissions?: string[];

  /**
   * Single role required to view the content
   */
  role?: string;

  /**
   * Array of roles - user must have ANY of these roles
   */
  anyRoles?: string[];

  /**
   * Array of roles - user must have ALL of these roles
   */
  allRoles?: string[];

  /**
   * Content to render if user doesn't have permission
   */
  fallback?: ReactNode;

  /**
   * Children to render if user has permission
   */
  children: ReactNode;
}

/**
 * Component to conditionally render content based on user permissions or roles
 *
 * @example
 * ```tsx
 * <PermissionGate permission="manage_roles">
 *   <Link href="/roles">Manage Roles</Link>
 * </PermissionGate>
 * ```
 *
 * @example
 * ```tsx
 * <PermissionGate anyPermissions={["view_users", "manage_users"]}>
 *   <UsersTable />
 * </PermissionGate>
 * ```
 */
export function PermissionGate({
  permission,
  anyPermissions,
  allPermissions,
  role,
  anyRoles,
  allRoles,
  fallback = null,
  children,
}: PermissionGateProps) {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    user,
  } = useAuth();

  // If no user is logged in, don't show anything
  if (!user) {
    return <>{fallback}</>;
  }

  // Check if user has full navigation access (master permission)
  const hasFullNavAccess = hasPermission("full_nav_access");
  
  // If user has full_nav_access, bypass all permission checks
  if (hasFullNavAccess) {
    return <>{children}</>;
  }

  // Check single permission
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // Check any permissions
  if (anyPermissions && !hasAnyPermission(anyPermissions)) {
    return <>{fallback}</>;
  }

  // Check all permissions
  if (allPermissions && !hasAllPermissions(allPermissions)) {
    return <>{fallback}</>;
  }

  // Check single role
  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  // Check any roles
  if (anyRoles && !hasAnyRole(anyRoles)) {
    return <>{fallback}</>;
  }

  // Check all roles
  if (allRoles && !hasAllRoles(allRoles)) {
    return <>{fallback}</>;
  }

  // User has required permissions/roles, render children
  return <>{children}</>;
}

