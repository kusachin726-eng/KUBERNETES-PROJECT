
"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2, ArrowUp } from "lucide-react";
import { DataTable } from "@/components/data-table";
import type { Customer } from "@/lib/data/customers";
import { can } from "@/lib/permissions/can";
import { PermissionMap } from "@/lib/permissions/types";
import AddEditCustomerModal from "./edit-customer-modal";
import { deleteCustomerAction } from "./actions";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ConfirmModal from "@/components/ui/confirmationmodal";

type Props = {
  customers: Customer[];
    total: number;
  currentPage: number;
  totalPages: number;
  permissions: PermissionMap;
};

const PAGE_SIZE = 10;

export function CustomersTable({
  customers,
  currentPage,
  total,
  totalPages,
  permissions,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const canEdit = can(permissions, "customer", "edit");
  const canDelete = can(permissions, "customer", "delete");

  /* =====================
     MAP DATA FOR TABLE
  ===================== */
  const data = useMemo(() => {
    return customers.map((c) => ({
      ...c,
      profile: {
        id: c.id,
        name: c.name,
        email: c.email,
        mobile_number: c.mobile_number,
        user_type: c.user_type,
        country_code: c.country_code,
      },
    }));
  }, [customers]);

  /* =====================
     STATE
  ===================== */
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] =
    useState<Customer | null>(null);

  /* =====================
     COLUMNS
  ===================== */
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "profile",
      header: "Profile",
      meta: { width: "22%" },
    },
    // {
    //   accessorKey: "isActive",
    //   header: "Status",
    //   enableSorting: false,
    //   meta: { width: "15%" },
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
  meta: { width: "15%" },
  header: () => {
    const isActiveParam = searchParams.get("isActive") ?? "true";
    const isActive = isActiveParam === "true";

    return (
      <div
        className="flex items-center justify-center gap-1 cursor-pointer select-none"
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString());

          // 🔁 TOGGLE isActive
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
    const isActive = row.original.isActive;
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
      meta: { width: "20%" },
      header: () => {
        const sortOrder = searchParams.get("sortOrder") ?? "desc";
        const isAsc = sortOrder === "asc";

        return (
          <div
            className="flex items-center justify-center gap-1 cursor-pointer select-none"
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
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

  if (canEdit || canDelete) {
    columns.push({
      header: "Actions",
      meta: { width: "20%", align: "center" },
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          {canEdit && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    setSelectedCustomer(row.original);
                    setEditOpen(true);
                  }}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[8px] border border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Pencil size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Edit Customer</TooltipContent>
            </Tooltip>
          )}

          {canDelete && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    setCustomerToDelete(row.original);
                    setDeleteOpen(true);
                  }}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[8px] border border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Delete Customer</TooltipContent>
            </Tooltip>
          )}
        </div>
      ),
    });
  }

  return (
    <>
      <DataTable
        columns={columns}
          total={total}
        data={data}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          const params = new URLSearchParams(window.location.search);
          params.set("page", String(page));
          router.push(`?${params.toString()}`);
        }}
        onNameClick={(customer) =>
          router.push(`/dashboard/customers/${customer.id}`)
        }
        showName
      />

      <AddEditCustomerModal
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        customer={selectedCustomer}
      />

      <ConfirmModal
        open={deleteOpen}
        onOpenChange={(v) => {
          setDeleteOpen(v);
          if (!v) setCustomerToDelete(null);
        }}
        title="Delete Customer"
        description={`Are you sure you want to delete "${
          customerToDelete?.name ||
          customerToDelete?.email ||
          customerToDelete?.mobile_number ||
          "this customer"
        }"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={async () => {
          if (!customerToDelete?.id) {
            toast.error("Invalid customer");
            return;
          }

          const res = await deleteCustomerAction(customerToDelete.id);

          if (!res.success) {
            toast.error(res.message || "Failed to delete customer");
            return;
          }

          toast.error("Customer deleted successfully");
          setDeleteOpen(false);
          setCustomerToDelete(null);
          router.refresh();
        }}
      />
    </>
  );
}
