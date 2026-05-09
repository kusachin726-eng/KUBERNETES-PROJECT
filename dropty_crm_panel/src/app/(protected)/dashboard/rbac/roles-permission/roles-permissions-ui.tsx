"use client";
import { PageHeader } from "@/components/page-header";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import RolesPermissionsFilters from "./roles-permissions-filters";
import RolesPermissionsGrid from "./roles-permissions-grid";
import AddEditRoleModal from "../roles-permission/addEditRoleModal";
import type { Role } from "./roles-permissions-grid";
import { Plus } from "lucide-react";
import { can } from "@/lib/permissions/can";
import { PermissionMap } from "@/lib/permissions/types";

export default function RolesPermissionsUI({
  rolePermissionData,
  permissions,
}: {
  rolePermissionData: any[];
  permissions: PermissionMap;
}) {
  const mappedRoles: Role[] = useMemo(() => {
    return rolePermissionData.map((role: any) => ({
      roleId: role.roleId,
      title: role.roleTitle,
      permissions: role.permissions.map((p: any) => ({
        featureId: p.featureId,
        module: p.featureTitle,
        permissions: {
          view: p.canView,
          add: p.canCreate,
          modify: p.canEdit ?? p.canUpdate,
          delete: p.canDelete,
        },
      })),
    }));
  }, [rolePermissionData]);

  const [uiRoles, setUiRoles] = useState<Role[]>(mappedRoles);
  const [open, setOpen] = useState(false);
  const canAdd = can(permissions, "role_and_permission", "create");


  return (
    <div className="page-container">
      {/* Header with Title and Add Button */}
      {/* Header with Title and Add Button */}
      <PageHeader
        title="Roles & Permissions"
        action={
          canAdd && (
            <Button variant="add" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" /> Add Role
            </Button>
          )
        }
      />

      {/* ✅ CORRECT MODAL */}
      <AddEditRoleModal
        open={open}
        onOpenChange={setOpen}
        mode="add"
        onSuccess={() => {
          // optional: optimistic update later
        }}
      />

      {/* ✅ TABLE */}
      <RolesPermissionsGrid 
        roles={uiRoles} 
        setRoles={setUiRoles}
        permissions={permissions} 
      />
    </div>
  );
}
