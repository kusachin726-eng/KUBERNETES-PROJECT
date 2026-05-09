


"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Admin } from "@/lib/data/admin";
import { Pencil, Trash2, ArrowUp } from "lucide-react";
import { can } from "@/lib/permissions/can";
import { PermissionMap } from "@/lib/permissions/types";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useRouter, useSearchParams } from "next/navigation";

export const adminColumns = (
  onEdit: (admin: Admin) => void,
  onDelete: (admin: Admin) => void,
  permissions: PermissionMap
): ColumnDef<Admin>[] => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const canEdit = can(permissions, "role_and_permission", "edit");
  const canDelete = can(permissions, "role_and_permission", "delete");

  const sortOrder = searchParams.get("sortOrder") ?? "desc";
  const isAsc = sortOrder === "asc";

  const columns: ColumnDef<Admin>[] = [
    {
      accessorKey: "profile",
      header: "Profile",
      meta: { width: "25%" },
      cell: ({ row }) => {
        const admin = row.original;

        return (
          <div className="flex flex-col">
            <span className="font-medium">{admin.name || "N/A"}</span>
            <span className="text-sm text-gray-500">
              {admin.email || "N/A"}
            </span>
            <span className="text-sm text-gray-400">
              {admin.mobile_number || "N/A"}
            </span>
          </div>
        );
      },
    },

    // {
    //   header: "Status",
    //   meta: { width: "15%" },
    //   cell: ({ row }) => {
    //     const isActive = row.original.isActive === true;
    //     return (
    //       <div
    //         className={`inline-flex rounded px-2 py-1 text-[10px] font-medium ${
    //           isActive
    //             ? "bg-green-100 text-green-700"
    //             : "bg-red-100 text-red-700"
    //         }`}
    //       >
    //         {isActive ? "Active" : "Inactive"}
    //       </div>
    //     );
    //   },
    // },
    {
  accessorKey: "isActive",
  meta: { width: "15%" },
  header: () => {
    const isActiveParam = searchParams.get("isActive") ?? "true";
    const isActive = isActiveParam === "true";

    return (
      <div
        className="flex items-center justify-center gap-1 cursor-pointer select-none"
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString());

          // 🔁 TOGGLE STATUS FILTER
          params.set("isActive", isActive ? "false" : "true");

          // 🔥 RESET PAGE (important)
          params.set("page", "1");

          router.push(`?${params.toString()}`);
        }}
      >
        <span>Status</span>
        <ArrowUp
          size={14}
          className={`transition-transform duration-200 ${
            isActive ? "rotate-0" : "rotate-180"
          }`}
        />
      </div>
    );
  },
  cell: ({ row }) => {
    const active = row.original.isActive;

    return (
      <div
        className={`inline-flex rounded px-2 py-1 text-[10px] font-medium ${
          active
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {active ? "Active" : "Inactive"}
      </div>
    );
  },
},


    // ✅ CREATED AT WITH SINGLE ARROW
    {
      accessorKey: "createdAt",
      meta: { width: "20%" },
      header: () => (
        <div
          className="flex items-center justify-center gap-1 cursor-pointer select-none"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());

            params.set("sortOrder", isAsc ? "desc" : "asc");
            // 🔥 DO NOT TOUCH PAGE
            router.push(`?${params.toString()}`);
          }}
        >
          <span>Created At</span>
          <ArrowUp
            size={14}
            className={`transition-transform duration-200 ${
              isAsc ? "rotate-0" : "rotate-180"
            }`}
          />
        </div>
      ),
      cell: ({ row }) => {
        const d = new Date(row.original.createdAt);
        return `${d
          .getDate()
          .toString()
          .padStart(2, "0")}/${(d.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${d.getFullYear()}`;
      },
    },
  ];

  // ✅ ACTIONS
  if (canEdit || canDelete) {
    columns.push({
      header: "Actions",
      meta: { width: "20%", align: "center" as const },
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          {canEdit && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onEdit(row.original)}
                  className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-blue-200 text-blue-600 hover:bg-blue-50 cursor-pointer"
                >
                  <Pencil size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Edit Admin</TooltipContent>
            </Tooltip>
          )}

          {canDelete && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onDelete(row.original)}
                  className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Delete Admin</TooltipContent>
            </Tooltip>
          )}
        </div>
      ),
    });
  }

  return columns;
};
