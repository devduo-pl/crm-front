import type { User } from "@/types/user";

/**
 * Normalize user payloads coming from the API so the frontend
 * can always rely on string-based role and permission arrays.
 */
export function normalizeUser(rawUser: unknown): User | null {
  if (!rawUser || typeof rawUser !== "object") {
    return null;
  }

  const userRecord = rawUser as Record<string, unknown>;

  const normalizedRoles = Array.isArray(userRecord.roles)
    ? (userRecord.roles as unknown[]).reduce<string[]>((acc, role) => {
        if (!role) return acc;

        if (typeof role === "string") {
          acc.push(role);
          return acc;
        }

        if (
          typeof role === "object" &&
          role !== null &&
          "name" in role &&
          typeof (role as { name: unknown }).name === "string"
        ) {
          acc.push((role as { name: string }).name);
          return acc;
        }

        if (
          typeof role === "object" &&
          role !== null &&
          "key" in role &&
          typeof (role as { key: unknown }).key === "string"
        ) {
          acc.push((role as { key: string }).key);
          return acc;
        }

        return acc;
      }, [])
    : [];

  const normalizedPermissions = Array.isArray(userRecord.permissions)
    ? (userRecord.permissions as unknown[]).reduce<string[]>((acc, permission) => {
        if (!permission) return acc;

        if (typeof permission === "string") {
          acc.push(permission);
          return acc;
        }

        if (
          typeof permission === "object" &&
          permission !== null &&
          "name" in permission &&
          typeof (permission as { name: unknown }).name === "string"
        ) {
          acc.push((permission as { name: string }).name);
          return acc;
        }

        if (
          typeof permission === "object" &&
          permission !== null &&
          "key" in permission &&
          typeof (permission as { key: unknown }).key === "string"
        ) {
          acc.push((permission as { key: string }).key);
          return acc;
        }

        return acc;
      }, [])
    : undefined;

  return {
    ...(rawUser as User),
    roles: normalizedRoles,
    permissions: normalizedPermissions,
  };
}

