import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@/types/user";

/**
 * Server-side function to get the current user from cookies
 * This should be called from Server Components or Server Actions
 */
export async function getCurrentUserServer(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token");

    if (!accessToken) {
      return null;
    }

    // Call your backend API to get user profile
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `access_token=${accessToken.value}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

/**
 * Server-side function to check if user has a specific permission
 */
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user || !user.permissions) return false;
  
  // Check for master permission that grants full access
  if (user.permissions.includes("full_nav_access")) return true;
  
  return user.permissions.includes(permission);
}

/**
 * Server-side function to check if user has any of the provided permissions
 */
export function hasAnyPermission(
  user: User | null,
  permissions: string[]
): boolean {
  if (!user || !user.permissions) return false;
  
  // Check for master permission that grants full access
  if (user.permissions.includes("full_nav_access")) return true;
  
  return permissions.some((permission) =>
    user.permissions!.includes(permission)
  );
}

/**
 * Server-side function to check if user has all of the provided permissions
 */
export function hasAllPermissions(
  user: User | null,
  permissions: string[]
): boolean {
  if (!user || !user.permissions) return false;
  
  // Check for master permission that grants full access
  if (user.permissions.includes("full_nav_access")) return true;
  
  return permissions.every((permission) =>
    user.permissions!.includes(permission)
  );
}

/**
 * Server-side function to require authentication
 * Redirects to login if user is not authenticated
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUserServer();

  if (!user) {
    redirect("/login");
  }

  return user;
}

/**
 * Server-side function to require a specific permission
 * Redirects to unauthorized page if user doesn't have the permission
 */
export async function requirePermission(permission: string): Promise<User> {
  const user = await requireAuth();

  if (!hasPermission(user, permission)) {
    redirect("/unauthorized");
  }

  return user;
}

/**
 * Server-side function to require any of the provided permissions
 * Redirects to unauthorized page if user doesn't have any of the permissions
 */
export async function requireAnyPermission(
  permissions: string[]
): Promise<User> {
  const user = await requireAuth();

  if (!hasAnyPermission(user, permissions)) {
    redirect("/unauthorized");
  }

  return user;
}

/**
 * Server-side function to require all of the provided permissions
 * Redirects to unauthorized page if user doesn't have all of the permissions
 */
export async function requireAllPermissions(
  permissions: string[]
): Promise<User> {
  const user = await requireAuth();

  if (!hasAllPermissions(user, permissions)) {
    redirect("/unauthorized");
  }

  return user;
}

/**
 * Higher-order function to protect a page with permission checks
 * 
 * @example
 * ```tsx
 * export default withPermission("manage_roles", RolesPage);
 * ```
 */
export function withPermission<P extends object>(
  permission: string,
  Component: React.ComponentType<P>
) {
  return async function ProtectedComponent(props: P) {
    await requirePermission(permission);
    return <Component {...props} />;
  };
}

/**
 * Higher-order function to protect a page with any of the provided permissions
 * 
 * @example
 * ```tsx
 * export default withAnyPermission(["view_users", "manage_users"], UsersPage);
 * ```
 */
export function withAnyPermission<P extends object>(
  permissions: string[],
  Component: React.ComponentType<P>
) {
  return async function ProtectedComponent(props: P) {
    await requireAnyPermission(permissions);
    return <Component {...props} />;
  };
}

