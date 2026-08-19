export type AdminRole = "admin" | "manager" | "user";

export const allRoles = ["admin", "manager", "user"] as const satisfies readonly AdminRole[];
export const adminOnlyRoles = ["admin"] as const satisfies readonly AdminRole[];
export const adminAndManagerRoles = ["admin", "manager"] as const satisfies readonly AdminRole[];

export function hasRoleAccess(role: string | null | undefined, allowedRoles: readonly AdminRole[]) {
  return allowedRoles.some((allowedRole) => allowedRole === role);
}
