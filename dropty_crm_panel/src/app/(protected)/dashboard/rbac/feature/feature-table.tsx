"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AddEditFeatureModal from "./add-edit-feature-modal";
import { deleteFeatureAction } from "./actions";
import ConfirmModal from "@/components/ui/confirmationmodal";
import { can } from "@/lib/permissions/can";
import { PermissionMap } from "@/lib/permissions/types";
import { ArrowUp } from "lucide-react";
import { useSearchParams } from "next/navigation";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


/* =====================
   TYPES
===================== */
type Feature = {
  id: number;
  title: string;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  permissions: PermissionMap;
};

const PAGE_SIZE = 10;

/* =====================
   DATE FORMATTER
===================== */
const formatDate = (value: string | Date) => {
  if (!value) return "-";
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("en-GB");
};

/* =====================
   COMPONENT
===================== */
export function FeatureTable({
  features,
  currentPage,
  totalPages,
  total,  
  permissions,
}: {
  features: Feature[];
  currentPage: number;
  totalPages: number;
   total: number;
  permissions: PermissionMap;
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState<Feature | null>(null);
  const canEdit = can(permissions, "role_and_permission", "edit");
  const canDelete = can(permissions, "role_and_permission", "delete");

  const columns: ColumnDef<Feature>[] = [
    // {
    //   header: "S.No",
    //   meta: { width: "5%", align: "center" as const },
    //   cell: ({ row }) => (currentPage - 1) * PAGE_SIZE + row.index + 1,
    // },
    {
      accessorKey: "title",
      header: "Feature Name",
      meta: { width: "19%", align: "center" as const },
    },
    // {
    //   accessorKey: "isActive",
    //   header: "Status",
    //   meta: { width: "18%", align: "center" as const },
    //   cell: ({ row }) => (
    //     <span
    //       className={row.original.isActive ? "text-green-600" : "text-red-600"}
    //     >
    //       {row.original.isActive ? "Active" : "Inactive"}
    //     </span>
    //   ),
    // },
//     {
//   header: "Status",
//   accessorKey: "isActive",
//   enableSorting: true,
//   cell: ({ row }) => {
//     const isActive = row.original.isActive;

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
  meta: { width: "15%", align: "center" as const },
  header: () => {
    const searchParams = useSearchParams();
    const isActiveParam = searchParams.get("isActive") ?? "true";
    const isActive = isActiveParam === "true";

    return (
      <div
        className="flex items-center justify-center gap-1 cursor-pointer select-none"
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString());

          // 🔁 toggle isActive
          params.set("isActive", isActive ? "false" : "true");

          // 🔥 reset page
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


    // {
    //   accessorKey: "createdAt",
    //   header: "Created At",
    //   meta: { width: "20%", align: "center" as const },
    //   cell: ({ row }) => formatDate(row.original.createdAt),
    // },
    {
  accessorKey: "createdAt",
  meta: { width: "20%", align: "center" as const },
  header: () => {
    const searchParams = useSearchParams();
    const sortOrder = searchParams.get("sortOrder") ?? "desc";
    const isAsc = sortOrder === "asc";

    return (
      <div
        className="flex items-center justify-center gap-1 cursor-pointer select-none"
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString());

          params.set("sortOrder", isAsc ? "desc" : "asc");
          // ✅ DO NOT reset page
          router.push(`?${params.toString()}`);
        }}
      >
        <span>Created At</span>
        <ArrowUp
          size={14}
          className={`transition-transform ${
            isAsc ? "rotate-0" : "rotate-180"
          }`}
        />
      </div>
    );
  },
  cell: ({ row }) => formatDate(row.original.createdAt),
},

    {
      accessorKey: "updatedAt",
      header: "Updated At",
      meta: { width: "16%", align: "center" as const },
      cell: ({ row }) => formatDate(row.original.updatedAt),
    },
  ];

  // ✅ Add Actions column only if permission exists
  if (canEdit || canDelete) {
    columns.push({
      header: "Actions",
      meta: { width: "12%", align: "center" as const },
      // cell: ({ row }) => (
      //   <div className="flex w-full items-center justify-center gap-2">
      //     {canEdit && (
      //       <button
      //         onClick={() => {
      //           setSelectedFeature(row.original);
      //           setOpen(true);
      //         }}
      //         className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-blue-200 text-blue-600 hover:bg-blue-50"
      //         title="Edit"
      //       >
      //         <Pencil size={14} />
      //       </button>
      //     )}

      //     {canDelete && (
      //       <button
      //         onClick={() => {
      //           setFeatureToDelete(row.original);
      //           setDeleteOpen(true);
      //         }}
      //         className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-red-200 text-red-600 hover:bg-red-50"
      //         title="Delete"
      //       >
      //         <Trash2 size={14} />
      //       </button>
      //     )}
      //   </div>
      // ),
      cell: ({ row }) => (
  <TooltipProvider>
    <div className="flex w-full items-center justify-center gap-2">

      {canEdit && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                setSelectedFeature(row.original);
                setOpen(true);
              }}
              className="flex h-8 w-8 items-center cursor-pointer justify-center rounded-[8px] border border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Pencil size={14} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Edit Feature</span>
          </TooltipContent>
        </Tooltip>
      )}

      {canDelete && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                setFeatureToDelete(row.original);
                setDeleteOpen(true);
              }}
              className="flex h-8 w-8 items-center  cursor-pointer justify-center rounded-[8px] border border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Delete Feature</span>
          </TooltipContent>
        </Tooltip>
      )}

    </div>
  </TooltipProvider>
),

    });
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={features}
        currentPage={currentPage}
        totalPages={totalPages}
         total={total}
        onPageChange={(page) => {
  const params = new URLSearchParams(window.location.search);
  params.set("page", String(page));
  router.push(`?${params.toString()}`);
}}

      />

      {selectedFeature && (
        <AddEditFeatureModal
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) setSelectedFeature(null);
          }}
          mode="edit"
          featureId={selectedFeature.id}
          initialValues={{
            title: selectedFeature.title,
            isActive: selectedFeature.isActive,
          }}
        />
      )}

      <ConfirmModal
        open={deleteOpen}
        onOpenChange={(v) => {
          setDeleteOpen(v);
          if (!v) setFeatureToDelete(null); 
        }}
        title="Delete Feature"
        description={`Are you sure you want to delete "${featureToDelete?.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={async () => {
          if (!featureToDelete) return;

          const res = await deleteFeatureAction(featureToDelete.id);
          

          if (!res.success) {
            toast.error(res.message || "Failed to delete feature");
            return;
          }

          toast.error("Feature deleted successfully");
          setDeleteOpen(false);
          setFeatureToDelete(null);
          router.refresh();
        }}
      />
    </>
  );
}
