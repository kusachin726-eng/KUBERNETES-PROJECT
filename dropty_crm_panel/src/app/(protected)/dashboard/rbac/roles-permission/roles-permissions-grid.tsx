"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { Eye, Pencil, Trash2, Shield, Check, X } from "lucide-react";
import { updateRolePermissionWithApi } from "@/lib/api/role-permission";
import { updateRolePermissionsAction } from "./actions";
import { toast } from "sonner";
import ConfirmModal from "@/components/ui/confirmationmodal";
import { deleteRoleAction } from "./actions"; // ← your delete role action
import { cn } from "@/lib/utils";
import AddEditRoleModal from "../roles-permission/addEditRoleModal";
import { PermissionMap } from "@/lib/permissions/types";
import { can } from "@/lib/permissions/can";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";


/* ================= TYPES ================= */

export type PermissionAction = "view" | "add" | "modify" | "delete";

export type PermissionRow = {
  featureId: any;
  module: string;
  permissions: Record<PermissionAction, boolean>;
};

export type Role = {
  roleId: any;
  title: string;
  permissions: PermissionRow[];
};

// interface RolesPermissionsGridProps {
//   roles: Role[];
//   onSave?: (role: Role) => void;
// }
// interface RolesPermissionsGridProps {
//   roles: Role[];
//   setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
// }
interface RolesPermissionsGridProps {
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  permissions: PermissionMap;
}

/* ================= COMPONENT ================= */

export default function RolesPermissionsGrid({
  roles,
  setRoles,
  // onSave,
  permissions,
}: RolesPermissionsGridProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [editRoleOpen, setEditRoleOpen] = useState(false);
  const canEdit = can(permissions, "role_and_permission", "edit");
  const canDelete = can(permissions, "role_and_permission", "delete");

  // show more / less per role
  const [expandedRoles, setExpandedRoles] = useState<Record<string, boolean>>(
    {},
  );

  // const togglePermission = (rowIndex: number, action: PermissionAction) => {
  //   if (!selectedRole || mode === "view") return;

  //   const updated = selectedRole.permissions.map((row, i) =>
  //     i === rowIndex
  //       ? {
  //           ...row,
  //           permissions: {
  //             ...row.permissions,
  //             [action]: !row.permissions[action],
  //           },
  //         }
  //       : row,
  //   );

  //   setSelectedRole({ ...selectedRole, permissions: updated });
  // };

  const togglePermission = (rowIndex: number, action: PermissionAction) => {
    if (!selectedRole || mode === "view") return;

    const updated = selectedRole.permissions.map((row, i) => {
      if (i !== rowIndex) return row;

      const newPermissions = { ...row.permissions };

      // Toggle current action
      const newValue = !newPermissions[action];
      newPermissions[action] = newValue;

      // ✅ If VIEW is unchecked → remove all permissions
      if (action === "view" && !newValue) {
        newPermissions.add = false;
        newPermissions.modify = false;
        newPermissions.delete = false;
      }

      // ✅ If any of add/modify/delete is checked → ensure view is checked
      if (
        (action === "add" ||
          action === "modify" ||
          action === "delete") &&
        newValue
      ) {
        newPermissions.view = true;
      }

      return {
        ...row,
        permissions: newPermissions,
      };
    });

    setSelectedRole({ ...selectedRole, permissions: updated });
  };


  const toggleExpand = (roleTitle: string) => {
    setExpandedRoles((prev) => ({
      ...prev,
      [roleTitle]: !prev[roleTitle],
    }));
  };
  /* ===== Permission helpers (LOGIC ONLY) ===== */

  // actual granted permissions count
  const getPermissionCount = (permissions: PermissionRow[]) => {
    return permissions.reduce((count, row) => {
      const hasAnyPermission = Object.values(row.permissions).some(Boolean);
      return count + (hasAnyPermission ? 1 : 0);
    }, 0);
  };

  // sirf wahi modules jisme koi bhi permission true ho
  const getPermittedModules = (permissions: PermissionRow[]) => {
    return permissions.filter((p) =>
      Object.values(p.permissions).some(Boolean),
    );
  };

  const getPermissionLabel = (permissions: PermissionRow["permissions"]) => {
    const order: PermissionAction[] = ["view", "add", "modify", "delete"];

    const map: Record<PermissionAction, string> = {
      view: "V",
      add: "C",
      modify: "M",
      delete: "D",
    };

    return order
      .filter((key) => permissions[key])
      .map((key) => map[key])
      .join(" ");
  };

  return (
    <>
      {/* ================= ROLES GRID ================= */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {roles.map((role) => {
          const isExpanded = expandedRoles[role.title];

          const permittedModules = getPermittedModules(role.permissions);

          const visiblePermissions = isExpanded
            ? permittedModules
            : permittedModules.slice(0, 4);

          const totalPermissions = getPermissionCount(role.permissions);

          const remainingCount = Math.max(permittedModules.length - 4, 0);

          return (
            <div
              key={role.title}
              className="group flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-3 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div>
                {/* ===== Header: Role name + icons ===== */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-primary/10 text-primary dark:bg-primary/20">
                      <Shield size={16} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                        {role.title}
                      </h3>
                      <p className="text-xs font-medium text-zinc-500">
                        {totalPermissions} Permissions
                      </p>
                    </div>
                  </div>

                  {/* <div className="flex gap-2"> */}
                  {/* {(canEdit || canDelete) && (
                    <div className="flex gap-2">
                    
                      {canEdit && (
                        <button
                          title="Edit role"
                          onClick={() => {
                            setSelectedRole(role);
                            setEditRoleOpen(true); // ✅ opens role modal
                          }}
                          className="flex h-6 w-6 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                        >
                          <Pencil size={12} />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          // onClick={() => setOpen(true)}
                          onClick={() => {
                            setRoleToDelete(role);
                            setDeleteOpen(true);
                          }}
                          className="
                        flex h-6 w-6 items-center justify-center
                        rounded-md border border-red-200
                        text-red-600
                        hover:bg-red-50 hover:border-red-400
                        transition
                      "
                          title="Delete Role"
                        >
                          <Trash2 size={12} className="cursor-pointer" />
                        </button>
                      )}
                    </div>
                  )} */}
                  {(canEdit || canDelete) && (
  <div className="flex gap-2">
    {/* Edit */}
    {canEdit && (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
         
            onClick={() => {
              setSelectedRole(role);
              setEditRoleOpen(true); // ✅ opens role modal
            }}
            className="flex h-6 w-6  cursor-pointer items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
          >
            <Pencil size={12} />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <span>Edit Role</span>
        </TooltipContent>
      </Tooltip>
    )}

    {canDelete && (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => {
              setRoleToDelete(role);
              setDeleteOpen(true);
            }}
            className="
              flex h-6 w-6 items-center justify-center cursor-pointer
              rounded-md border border-red-200
              text-red-600
              hover:bg-red-50 hover:border-red-400
              transition
            "
          
          >
            <Trash2 size={12} className="cursor-pointer" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <span>Delete Role</span>
        </TooltipContent>
      </Tooltip>
    )}
  </div>
)}

                </div>

                {/* ===== Bullet permissions ===== */}
                <div className="mb-4 space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Access To:
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {visiblePermissions.map((p) => {
                      const label = getPermissionLabel(p.permissions);

                      return (
                        <div
                          key={p.module}
                          className="flex items-center gap-2 rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          <span className="capitalize">{p.module}</span>

                          {label && (
                            <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                              {label}
                            </span>
                          )}
                        </div>
                      );
                    })}

                    {/* +more */}
                    {remainingCount > 0 && !isExpanded && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(role.title)}
                        className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition"
                      >
                        +{remainingCount} more
                      </button>
                    )}

                    {/* Show less */}
                    {isExpanded && permittedModules.length > 4 && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(role.title)}
                        className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition"
                      >
                        Show less
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ===== Show more / less ===== */}
              {/* {totalPermissions > 4 && ( */}
              <div className="mt-3 flex items-center justify-between">
                {/* View All Permissions */}
                <button
                  onClick={() => {
                    setSelectedRole(role);
                    setMode("view");
                    setOpen(true);
                  }}
                  className="w-fit rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary/10 hover:border-primary/40"
                >
                  View All Permissions
                </button>

                {/* Edit button */}
                {canEdit && (
                  <button
                    title="Edit Permissions"
                    onClick={() => {
                      setSelectedRole(role);
                      setMode("edit");
                      setOpen(true);
                    }}
                    className="flex w-fit rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary/10 hover:border-primary/40"
                  >
                    Edit Permissions
                    {/* <Pencil size={12} /> */}
                  </button>
                )}
              </div>
              {/* )} */}
            </div>
          );
        })}
      </div>

      {/* ================= MODAL ================= */}
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setMode("view");
        }}
        title={`${mode === "edit" ? "Edit" : "View"} Role: ${selectedRole?.title}`}
        showEdit={mode === "view"}
        onEdit={() => setMode("edit")}
        maxWidth="max-w-5xl"
      >
        {selectedRole && (
          <div className="space-y-6">
            <div className="rounded-lg border border-zinc-200 overflow-hidden dark:border-zinc-800 max-h-[55vh] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 border-b border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium text-zinc-500">
                      Feature Module
                    </th>
                    <th className="py-3 px-4 text-center font-medium text-zinc-500">
                      View
                    </th>
                    <th className="py-3 px-4 text-center font-medium text-zinc-500">
                      Create
                    </th>
                    <th className="py-3 px-4 text-center font-medium text-zinc-500">
                      Modify
                    </th>
                    <th className="py-3 px-4 text-center font-medium text-zinc-500">
                      Delete
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/10">
                  {selectedRole.permissions.map((row, rowIndex) => (
                    <tr
                      key={row.module}
                      className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30"
                    >
                      <td className="py-3 px-4 font-medium text-zinc-900 dark:text-zinc-100 capitalize">
                        {row.module}
                      </td>

                      {(
                        [
                          "view",
                          "add",
                          "modify",
                          "delete",
                        ] as PermissionAction[]
                      ).map((action) => (
                        <td key={action} className="py-3 px-4 text-center">
                          <label className="relative inline-flex items-center justify-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={row.permissions[action]}
                              disabled={mode === "view"}
                              onChange={() =>
                                togglePermission(rowIndex, action)
                              }
                              className={cn(
                                "peer h-5 w-5 appearance-none rounded border border-zinc-300 bg-white transition-all checked:border-primary checked:bg-primary disabled:cursor-not-allowed disabled:checked:opacity-70 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900",
                                !row.permissions[action] &&
                                  "disabled:bg-zinc-100",
                              )}
                            />
                            {/* Custom Check Icon */}
                            <Check
                              size={12}
                              strokeWidth={3}
                              className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-primary-foreground transition-opacity"
                            />
                          </label>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {mode === "edit" ? (
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={() => setMode("view")}>
                  Cancel
                </Button>

                <Button
                  onClick={async () => {
                    if (!selectedRole) return;
                    const payload = {
                      roleId: selectedRole.roleId,
                      permissionData: selectedRole.permissions.map((p) => ({
                        featureId: p.featureId,
                        canView: p.permissions.view,
                        canCreate: p.permissions.add,
                        canEdit: p.permissions.modify,
                        canDelete: p.permissions.delete,
                      })),
                    };

                    const res = await updateRolePermissionsAction(payload);
                    if (res.success) {
                      toast.success(res.message);
                      // ✅ update UI instantly
                      setRoles((prev) =>
                        prev.map((r) =>
                          r.roleId === selectedRole.roleId ? selectedRole : r,
                        ),
                      );
                    } else {
                      toast.error("Update failed");
                    }
                    setOpen(false);
                    setMode("view");
                  }}
                >
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="flex justify-end pt-2">
                <Button variant="secondary" onClick={() => setOpen(false)}>
                  Close
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Role"
        description="Are you sure you want to delete this role?"
        confirmText="Delete"
        onConfirm={async () => {
          if (!roleToDelete) return;

          const res = await deleteRoleAction({
            roleId: roleToDelete.roleId, // 👈 goes in URL
            title: roleToDelete.title, // 👈 body
            isActive: true,
          });

          if (res.success) {
            toast.error(res.message || "Role deleted successfully"); // 🔴 red toast

            setRoles((prev) =>
              prev.filter((r) => r.roleId !== roleToDelete.roleId),
            );
          } else {
            toast.error("Failed to delete role");
          }

          setDeleteOpen(false);
          setRoleToDelete(null);
        }}
      />
      {selectedRole && (
        <AddEditRoleModal
          open={editRoleOpen}
          onOpenChange={setEditRoleOpen}
          mode="edit"
          role={{
            roleId: selectedRole.roleId,
            title: selectedRole.title,
          }}
          onSuccess={() => {
            setRoles((prev) =>
              prev.map((r) =>
                r.roleId === selectedRole.roleId
                  ? { ...r, title: selectedRole.title }
                  : r,
              ),
            );
          }}
        />
      )}
    </>
  );
}
