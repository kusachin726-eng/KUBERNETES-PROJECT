"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import type { Hub } from "@/lib/data/hubs";

const columns: ColumnDef<Hub>[] = [
  { accessorKey: "state", header: "State" },
  { accessorKey: "city", header: "City" },
  { accessorKey: "address", header: "Address" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const color =
        status === "active"
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200"
          : status === "inactive"
            ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-200"
            : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200";

      return (
        <span className={`rounded-full px-2 py-0.5 text-xs ${color}`}>
          {status}
        </span>
      );
    },
  },
  { accessorKey: "actions", header: "Actions" },
];

export function HubsTable({ hubs }: { hubs: Hub[] }) {
  return (
    <DataTable
      columns={columns}
      data={hubs}
      searchPlaceholder="Search hubs…"
    />
  );
}
