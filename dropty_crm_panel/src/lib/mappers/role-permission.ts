import { RolePermission } from "@/lib/data/role-permission";
import { UIRole } from "@/types/ui-role";

export function mapApiRoleToUiRole(
  role: RolePermission
): UIRole {
  return {
    title: role.roleTitle,
    permissions: role.permissions.map((p) => ({
      module: p.featureTitle,
      permissions: {
        view: p.canView,
        add: p.canCreate,
        modify: p.canUpdate,
        delete: p.canDelete,
      },
    })),
  };
}

// mappers/role-permission.ts
// import { RolePermission } from "@/lib/data/role-permission";

// export function mapApiRoleToUiRole(
//   role: RolePermission
// ): UIRole {
//   return {
//     roleId: role.roleId,                 // ✅ FIX
//     title: role.roleTitle,
//     permissions: role.permissions.map((p) => ({
//       featureId: p.featureId,            // ✅ FIX
//       module: p.featureTitle,
//       permissions: {
//         view: p.canView,
//         add: p.canCreate,
//         modify: p.canUpdate,
//         delete: p.canDelete,
//       },
//     })),
//   };
// }

