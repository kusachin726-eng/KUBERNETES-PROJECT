
"use client";
import { useState, useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmModal from "@/components/ui/confirmationmodal";
import type { CityUI } from "@/lib/api/cities";
import { can } from "@/lib/permissions/can";
import { PermissionMap } from "@/lib/permissions/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";


function PincodeCell({ pincodes }: { pincodes: string[] }) {
  const [expanded, setExpanded] = useState(false);

  if (!Array.isArray(pincodes) || pincodes.length === 0) {
    return <span className="text-muted-foreground">-</span>;
  }

  const visibleCount = 2;
  const visiblePins = pincodes.slice(0, visibleCount);
  const remainingPins = pincodes.slice(visibleCount);

  return (
    <div className="w-[220px] flex flex-col gap-1">
      <div className="flex flex-wrap items-center gap-1 justify-center">
        {visiblePins.map((pin) => (
          <span
            key={pin}
            className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary/80 border border-primary/20"
          >
            {pin}
          </span>
        ))}

        {expanded &&
          remainingPins.map((pin) => (
            <span
              key={pin}
              className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary/80 border border-primary/20"
            >
              {pin}
            </span>
          ))}

        {remainingPins.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
            className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/20 border border-primary/30"
          >
            {expanded ? "Show less" : `+${remainingPins.length}`}
          </button>
        )}
      </div>
    </div>
  );
}


function ActionCell({
  city,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
}: {
  city: CityUI;
  canEdit: boolean;
  canDelete: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-2 ml-1 justify-center">
      {canEdit && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onEdit(city.id)}
              className="flex h-8 w-8 items-center justify-center cursor-pointer rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
            >
              <Pencil size={14} />
            </button>
          </TooltipTrigger>

          <TooltipContent>
            <span>Edit City</span>
          </TooltipContent>
        </Tooltip>
      )}

      {canDelete && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setOpen(true)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </TooltipTrigger>

            <TooltipContent>
              <span>Delete City</span>
            </TooltipContent>
          </Tooltip>

          <ConfirmModal
            open={open}
            onOpenChange={setOpen}
            title="Delete City"
            description="Are you sure you want to delete this city?"
            confirmText="Delete"
            onConfirm={() => {
              setOpen(false);
              onDelete(city.id);
            }}
          />
        </>
      )}
    </div>
  );
}

/* ================= TABLE ================= */

interface CitiesTableProps {
  cities: CityUI[];
  onDelete: (cityId: string) => void;
  onEdit: (cityId: string) => void;
  permissions: PermissionMap;

  total: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function CitiesTable({
  cities,
  onDelete,
  onEdit,
  permissions,
  total,
  currentPage,
  totalPages,
  onPageChange,
}: CitiesTableProps) {
  const canEdit = can(permissions, "manage_cities", "edit");
  const canDelete = can(permissions, "manage_cities", "delete");

  const columns = useMemo<ColumnDef<CityUI>[]>(() => {
    const cols: ColumnDef<CityUI>[] = [
      {
        accessorKey: "city",
        header: "CITY",
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-primary/60">📍</span>
            <span className="text-sm font-semibold text-zinc-900">
              {row.original.city}
            </span>
          </div>
        ),
      },
      {
        header: "STATE",
        cell: ({ row }) => {
          const { state, stateCode } = row.original;
          return (
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-medium text-zinc-900">
                {state}
              </span>
              {stateCode && (
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                  {stateCode}
                </span>
              )}
            </div>
          );
        },
      },
      {
        header: "PINCODE",
        meta: { width: "200px" },
        cell: ({ row }) => (
          <div className="flex justify-center items-center">
            <PincodeCell pincodes={row.original.pincode ?? []} />
          </div>
        ),
      },
      {
        header: "STATUS",
        cell: ({ row }) => {
          const isActive = row.original.status === "active";
          return (
            <div className="flex justify-center">
              <div
                className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold border ${
                  isActive
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-red-100 text-red-800 border-red-200"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </div>
            </div>
          );
        },
      },
    ];

    if (canEdit || canDelete) {
      cols.push({
        header: "Actions",
        meta: { width: "150px" },
        cell: ({ row }) => (
          <ActionCell
            city={row.original}
            canEdit={canEdit}
            canDelete={canDelete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ),
      });
    }

    return cols;
  }, [canEdit, canDelete, onDelete, onEdit]);

  return (
    <div
      className="
        w-full
        text-xs

        [&_table]:w-full
        [&_table]:table-fixed
        [&_table]:border-separate
        [&_table]:border-spacing-y-2

        [&_thead]:sticky
        [&_thead]:top-0
        [&_thead]:z-10
        [&_thead]:bg-white

        [&_th]:text-center
        [&_th]:px-2
        [&_th]:py-2
        [&_th]:text-xs
        [&_th]:font-bold
        [&_th]:text-primary/70
        [&_th]:uppercase
        [&_th]:tracking-wider
        [&_th]:bg-primary/5
        [&_th]:border-b-2
        [&_th]:border-primary/20

        [&_tbody_tr]:bg-white
        [&_tbody_tr]:border
        [&_tbody_tr]:border-zinc-200
        [&_tbody_tr]:rounded-lg
        [&_tbody_tr]:shadow-sm
        [&_tbody_tr]:transition-all
        [&_tbody_tr]:duration-200

        [&_tbody_tr:hover]:shadow-md
        [&_tbody_tr:hover]:border-primary/40
        [&_tbody_tr:hover]:bg-primary/5

        [&_tbody_td]:px-2
        [&_tbody_td]:py-2
        [&_tbody_td]:text-center
        [&_tbody_td]:align-middle
        [&_tbody_td]:text-xs

        [&_tbody_tr_td:first-child]:rounded-l-lg
        [&_tbody_tr_td:last-child]:rounded-r-lg
      "
    >
      <DataTable
        columns={columns}
        data={[...cities]}
        searchPlaceholder="Search city..."

        /* 🔹 Pagination (ONLY ADDITION) */
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
