"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { SettingRow } from "./setting-client";

function formatLabel(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

function formatMetaValue(key: string, value: number) {
  const k = key.toLowerCase();
  if (k.includes("percent") || k.includes("gst")) return `${value} %`;
  if (k.includes("km") || k.includes("distance")) return `${value} km`;
  return `₹ ${value}`;
}

interface Props {
  settings: SettingRow[];
  currentPage: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  onEdit: (id: string) => void;
}

export function SettingsTable({
  settings,
  currentPage,
  totalPages,
  total,
  onPageChange,
  onEdit,
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const ValueBadge = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex rounded-lg border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
      {children}
    </span>
  );

  const MetaRow = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between gap-4 px-4 py-1.5">
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <div>{value}</div>
    </div>
  );

  const columns = useMemo<ColumnDef<SettingRow>[]>(
    () => [
      {
        header: "TITLE",
        cell: ({ row }) => (
          <span className="font-bold text-zinc-900 text-base">
            {row.original.title}
          </span>
        ),
      },
      {
        header: "SLUG",
        cell: ({ row }) => (
          <span className="text-sm text-zinc-600 font-medium">
            {row.original.slug}
          </span>
        ),
      },
      {
        header: "METADATA",
        meta: { width: "450px" },
        cell: ({ row }) => {
          const entries = Object.entries(row.original.metadata ?? {});
          const isExpanded = expandedId === row.original.id;
          const visible = isExpanded ? entries : entries.slice(0, 3);

          return (
            <div
              className="cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : row.original.id)}
            >
              {visible.map(([key, value]) => (
                <MetaRow
                  key={key}
                  label={formatLabel(key)}
                  value={<ValueBadge>{formatMetaValue(key, value)}</ValueBadge>}
                />
              ))}

              {entries.length > 3 && !isExpanded && (
                <div className="px-4 pt-1 text-xs text-primary font-semibold">
                  + {entries.length - 3} more
                </div>
              )}
            </div>
          );
        },
      },
      {
        header: "ACTIONS",
        cell: ({ row }) => (
          <div className="flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onEdit(row.original.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Pencil size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Edit Setting</TooltipContent>
            </Tooltip>
          </div>
        ),
      },
    ],
    [expandedId, onEdit],
  );

  return (
    <div className="table-card mx-auto max-w-7xl">
      <DataTable
        columns={columns}
        data={settings}
        total={total} // ✅ LEFT SIDE COUNT
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
