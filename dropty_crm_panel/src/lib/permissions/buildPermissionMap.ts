import { PermissionMap } from "./types";

export function buildPermissionMap(permissions: any[]): PermissionMap {
  const map: PermissionMap = {};

  for (const p of permissions) {
    const feature = p.feature?.title?.toLowerCase();
    if (!feature) continue;

    map[feature] = {
      view: !!p.canView,
      create: !!p.canCreate,
      edit: !!p.canEdit,
      delete: !!p.canDelete,
    };
  }

  return map;
}
