"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/ui/confirmationmodal";
// import { RateCardUI } from "./ratecard-client";
       // import type { RateCardUI } from "./ratecard-client";
export interface RateCardUI {
  id: string;
  distanceFrom: number;
  distanceTo: number;
  standardPrice: number;
  expressPrice: number;
}

interface Props {
  rateCards: RateCardUI[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function RateCardTable({ rateCards, onEdit, onDelete }: Props) {
  const columns = useMemo<ColumnDef<RateCardUI>[]>(() => {
    return [
      {
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      },
      {
        header: "Distance From (km)",
        cell: ({ row }) => (
          <span className="text-sm font-medium text-zinc-600">
            {row.original.distanceFrom}
          </span>
        ),
      },
      {
        header: "Distance To (km)",
        cell: ({ row }) => (
          <span className="text-sm font-medium text-zinc-600">
            {row.original.distanceTo}
          </span>
        ),
      },
      {
        header: "Standard Price",
        cell: ({ row }) => (
          <span className="text-sm font-semibold">
            {row.original.standardPrice.toFixed(2)}
          </span>
        ),
      },
      {
        header: "Express Price",
        cell: ({ row }) => (
          <span className="text-sm font-semibold">
            {row.original.expressPrice.toFixed(2)}
          </span>
        ),
      },
      {
        header: "Actions",
        meta: { width: "150px" },
        cell: ({ row }) => {
          const [open, setOpen] = useState(false);
          const rate = row.original;

          return (
            <>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => onEdit(rate.id)}>
                  <Pencil className="h-4 w-4 text-cyan-600" />
                </Button>

                <Button variant="ghost" onClick={() => setOpen(true)}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>

              <ConfirmModal
                open={open}
                onOpenChange={setOpen}
                title="Delete Rate Card"
                description="Are you sure you want to delete this rate card?"
                confirmText="Delete"
                onConfirm={() => {
                  setOpen(false);
                  onDelete(rate.id);
                }}
              />
            </>
          );
        },
      },
    ];
  }, [onEdit, onDelete]);

  return (
    <DataTable
      columns={columns}
      data={rateCards}
      searchPlaceholder="Search distance..."
    />
  );
}