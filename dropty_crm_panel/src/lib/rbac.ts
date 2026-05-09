import type { UserRole } from "@/lib/roles";

export function hasRole(role: UserRole, allowed: readonly UserRole[]) {
  return allowed.includes(role);
}
