// import { Crud, PermissionMap } from "./types";

// export function can(
//   permissions: PermissionMap,
//   feature: string,
//   action: Crud = "view"
// ) {
//   return !!permissions[feature.toLowerCase()]?.[action];
// }

// lib/permissions/can.ts
import { PermissionMap } from "./types";

type Action = "view" | "create" | "edit" | "delete";

export function can(
  permissions: PermissionMap | undefined | null,
  feature: string,
  action: Action
) {
  if (!permissions) return false; // 👈 IMPORTANT

  const p = permissions[feature];
  if (!p) return false;

  return p[action] === true;
}

