"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import type { SystemLog } from "./system-log-client";

export default function SystemLogTable({
  logs,
  total,
  currentPage,
  totalPages,
  onPageChange,
}: {
  logs: SystemLog[];
  total: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const columns = useMemo<ColumnDef<SystemLog>[]>(
    () => [
      {
        header: "ID",
        cell: ({ row }) => <span className="text-xs">{row.original.id}</span>,
      },
      {
        header: "User",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="font-semibold">{row.original.userName}</span>
            <span className="text-xs bg-primary/10 px-2 rounded">
              {row.original.userCode}
            </span>
          </div>
        ),
      },
      {
        header: "Action",
        cell: ({ row }) => (
          <span className="text-xs font-semibold">{row.original.action}</span>
        ),
      },
      {
        header: "Model",
        cell: ({ row }) => row.original.table,
      },
      {
        header: "Old → New",
        cell: ({ row }) =>
          row.original.oldNew ? (
            <pre className="text-xs bg-muted p-2 rounded">
              {row.original.oldNew}
            </pre>
          ) : (
            "—"
          ),
      },
      {
        header: "IP",
        cell: ({ row }) => (
          <span className="text-xs font-mono">{row.original.ip}</span>
        ),
      },
      {
        header: "User Agent",
        cell: ({ row }) => (
          <span className="text-xs">{row.original.userAgent}</span>
        ),
      },
      {
        header: "Timestamp",
        cell: ({ row }) => (
          <div className="text-xs">
            {new Date(row.original.createdAt).toLocaleDateString()}
            <div className="text-muted-foreground">
              {new Date(row.original.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={logs}
      total={total}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      searchPlaceholder="Search system logs..."
    />
  );
}
