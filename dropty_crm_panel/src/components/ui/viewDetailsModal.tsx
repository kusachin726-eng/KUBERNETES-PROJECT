
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { DetailRow } from "./ViewDetailDesign"; // ← update this import path to match your actual file name
import { DetailField } from "@/app/types/datadetails";
import { cn } from "@/lib/utils";

export default function ViewDetailsModal({
  open,
  onOpenChange,
  title,
  entityId,
  fetcher,
  mapData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  entityId: number | null;
  fetcher: (id: number) => Promise<{ success: boolean; data?: any }>;
  mapData: (data: any) => DetailField[];
}) {
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<DetailField[]>([]);

  useEffect(() => {
    if (!open || !entityId) return;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetcher(entityId);
        if (res.success && res.data) {
          setFields(mapData(res.data));
        }
      } catch (err) {
        console.error("Failed to load rider details", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [open, entityId, fetcher, mapData]);

  const statusField = fields.find((f) => f.label.toLowerCase() === "status");
  const mainFields = fields.filter((f) => f.label.toLowerCase() !== "status");

  const rows: (DetailField | null)[][] = [];
  for (let i = 0; i < mainFields.length; i += 2) {
    rows.push([mainFields[i], mainFields[i + 1] ?? null]);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "sm:max-w-sm md:max-w-md lg:max-w-lg",           // narrower
          "p-0 overflow-hidden rounded-xl border-none shadow-xl",
          "bg-[#FDFAF5] text-neutral-800",
          "min-h-[320px] max-h-[85dvh] overflow-y-auto"
        )}
      >
        <DialogHeader className="px-5 py-3 bg-[#8B6F47] text-white">
          <DialogTitle className="text-base font-semibold tracking-tigh">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 py-4 space-y-2.5">
          {loading ? (
            <div className="py-10 text-center text-sm text-neutral-500">
              Loading...
            </div>
          ) : fields.length === 0 ? (
            <div className="py-10 text-center text-sm text-neutral-500">
              No details available
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:!grid-cols-2 gap-2.5">
                {rows.map((row, rowIndex) => (
                  <div key={rowIndex} className="contents">
                    {row.map((field, colIndex) =>
                      field ? (
                        <DetailRow key={field.label} {...field} />
                      ) : (
                        <div
                          key={`empty-${rowIndex}-${colIndex}`}
                          className="hidden md:block"
                        />
                      )
                    )}
                  </div>
                ))}
              </div>

              {statusField && (
                <div className="mt-1">
                  <DetailRow {...statusField} />
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-5 py-2.5 text-right text-xs text-neutral-500 border-t border-[#EDE4D9] bg-[#FDF8F0]">
          Rider ID: {entityId ?? "—"}
        </div>
      </DialogContent>
    </Dialog>
  );
}