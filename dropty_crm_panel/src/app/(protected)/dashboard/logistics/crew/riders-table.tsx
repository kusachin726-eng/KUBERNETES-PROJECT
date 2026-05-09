"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2, ArrowUp } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import ConfirmModal from "@/components/ui/confirmationmodal";
import ViewDetailsModal from "@/components/ui/viewDetailsModal";
import { can } from "@/lib/permissions/can";
import { PermissionMap } from "@/lib/permissions/types";
import {
  deleteRiderAction,
  fetchSingleRiderAction,
  updateRiderStatusAction,
} from "./actions";

import type { Rider } from "@/lib/data/rider";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* =====================
   FILTERS
===================== */
const RiderFilters = dynamic(() => import("./ridersfilter"), {
  ssr: false,
});

/* =====================
   PROPS
===================== */
interface RidersTableProps {
  riders: Rider[];
    total: number;            
  currentPage: number;
  totalPages: number;
  status: string;
  onPageChange: (page: number) => void;
  onEdit: (rider: Rider) => void;
  isActive: boolean;
  permissions: PermissionMap;
}
// interface RidersTableProps {
//   riders: Rider[];
//   currentPage: number;
//   totalPages: number;
//   isActive: boolean;        // ✅ NEW
//   onPageChange: (page: number) => void;
//   onEdit: (rider: Rider) => void;
//   permissions: PermissionMap;
// }

/* =====================
   COMPONENT
===================== */
export function RidersTable({
  riders,
  total,     
  currentPage,
  totalPages,
  status,
  onPageChange,
  onEdit,
  permissions,
}: RidersTableProps) {
  // export function RidersTable({
  //   riders,
  //   currentPage,
  //   totalPages,
  //   isActive,
  //   onPageChange,
  //   onEdit,
  //   permissions,
  // }: RidersTableProps) {

  const router = useRouter();
  const searchParams = useSearchParams();

  const [localRiders, setLocalRiders] = useState<Rider[]>(riders);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedRiderId, setSelectedRiderId] = useState<number | null>(null);

  const [city, setCity] = useState("all");
  const [statusFilter, setStatusFilter] = useState(status);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const canEdit = can(permissions, "crew", "edit");
  const canDelete = can(permissions, "crew", "delete");

  /* =====================
     SYNC DATA
  ===================== */
  useEffect(() => {
    setLocalRiders(riders);
  }, [riders]);

  /* =====================
     STATUS → URL (RESET PAGE ONLY HERE)
  ===================== */
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (statusFilter !== "all") {
      params.set("status", statusFilter);
    } else {
      params.delete("status");
    }

    router.push(`?${params.toString()}`);
  }, [statusFilter]);

  /* =====================
     COLUMNS
  ===================== */
  const columns: ColumnDef<Rider>[] = [
    {
      id: "profile",
      header: "Profile",
      accessorFn: (row) => `${row.name ?? ""}`.trim(),
      meta: { width: "20%", align: "center" as const },
    },
    // {
    //   header: "Status",
    //   meta: { width: "15%", align: "center" as const },
    //   cell: ({ row }) => {
    //     const isActive = row.original.status === "active";
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
    // {
    //   accessorKey: "status", // ✅ REQUIRED for ColumnDef typing
    //   meta: { width: "15%", align: "center" as const },
    //   header: () => {
    //     const statusParam = searchParams.get("status") ?? "active";
    //     const isActive = statusParam === "active";

    //     return (
    //       <div
    //         className="flex items-center justify-center gap-1 cursor-pointer select-none"
    //         onClick={() => {
    //           const params = new URLSearchParams(searchParams.toString());

    //           // 🔁 toggle status filter
    //           params.set("status", isActive ? "inactive" : "active");

    //           // 🔥 reset page
    //           params.set("page", "1");

    //           router.push(`?${params.toString()}`);
    //         }}
    //       >
    //         <span>Status</span>
    //         <ArrowUp
    //           size={14}
    //           className={`transition-transform duration-200 ${
    //             isActive ? "rotate-0" : "rotate-180"
    //           }`}
    //         />
    //       </div>
    //     );
    //   },
    //   cell: ({ row }) => {
    //     const isActive = row.original.status;

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
  accessorKey: "status",
  meta: { width: "15%", align: "center" as const },

  header: () => {
    // 🔹 SOURCE OF TRUTH = isActive
    const isActiveParam = searchParams.get("isActive") ?? "true";
    const isActive = isActiveParam === "true";

    return (
      <div
        className="flex items-center justify-center gap-1 cursor-pointer select-none"
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString());

          // 🔁 TOGGLE BOOLEAN
          params.set("isActive", isActive ? "false" : "true");

          // ❌ REMOVE status (no longer needed)
          params.delete("status");

          // 🔥 RESET PAGE
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
    const isActive = row.original.status;

    return (
      <div
        className={`inline-flex rounded px-2 py-1 text-[10px] font-medium ${
          isActive
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </div>
    );
  },
},

    {
      accessorKey: "createdAt",
      meta: { width: "20%", align: "center" as const },
      header: () => {
        const sortOrder = searchParams.get("sortOrder") ?? "desc";
        const isAsc = sortOrder === "asc";

        return (
          <div
            className="flex items-center justify-center gap-1 cursor-pointer select-none"
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());

              // 🔁 TOGGLE SORT (NO PAGE RESET)
              params.set("sortOrder", isAsc ? "desc" : "asc");

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
        );
      },
    },
  ];

  /* =====================
     ACTIONS
  ===================== */
  if (canEdit || canDelete) {
    columns.push({
      header: "Actions",
      meta: { width: "15%", align: "center" as const },
      cell: ({ row }) => {
        const rider = row.original;
        const [open, setOpen] = useState(false);

        return (
          <>
            <div className="flex items-center justify-center gap-2">
              {canEdit && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onEdit(rider)}
                      className="flex h-8 w-8 items-center justify-center cursor-pointer rounded-[8px] border border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Pencil size={14} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Edit Crew</TooltipContent>
                </Tooltip>
              )}

              {canDelete && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setOpen(true)}
                        className="flex h-8 w-8 items-center justify-center cursor-pointer rounded-[8px] border border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Delete Crew</TooltipContent>
                  </Tooltip>

                  <ConfirmModal
                    open={open}
                    onOpenChange={setOpen}
                    title="Delete Rider"
                    description="Are you sure you want to delete this rider?"
                    confirmText="Delete"
                    onConfirm={async () => {
                      setOpen(false);
                      const res = await deleteRiderAction(rider.id);

                      if (res.success) {
                        setLocalRiders((prev) =>
                          prev.filter((r) => r.id !== rider.id),
                        );
                        toast.error("Rider deleted successfully");
                      } else {
                        toast.error(res.message || "Delete failed");
                      }
                    }}
                  />
                </>
              )}
            </div>
          </>
        );
      },
    });
  }

  /* =====================
     RENDER
  ===================== */
  return (
    <>
      <DataTable
        columns={columns}
        data={localRiders}
          total={total}             
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("page", String(page));
          router.push(`?${params.toString()}`);
        }}
        onNameClick={(rider) =>
          router.push(`/dashboard/logistics/crew/${rider.id}`)
        }
        searchPlaceholder="Search riders…"
        filters={
          <RiderFilters
            city={city}
            setCity={setCity}
            status={statusFilter}
            setStatus={setStatusFilter}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
          />
        }
      />

      <ViewDetailsModal
        open={viewOpen}
        onOpenChange={setViewOpen}
        title="Rider Details"
        entityId={selectedRiderId}
        fetcher={fetchSingleRiderAction}
        mapData={(rider) => [
          { label: "Name", value: `${rider.firstName} ${rider.lastName}` },
          { label: "Email", value: rider.email || "—" },
          { label: "Mobile", value: rider.mobile_number || "—" },
          {
            label: "Status",
            value: rider.isActive ? "Active" : "Inactive",
            status: rider.isActive ? "active" : "inactive",
            onToggleStatus: async (next: boolean) => {
              await updateRiderStatusAction(rider.id, next);
              setViewOpen(false);
              setTimeout(() => setViewOpen(true), 100);
            },
          },
        ]}
      />
    </>
  );
}
