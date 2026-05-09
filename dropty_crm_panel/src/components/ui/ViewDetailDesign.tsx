
"use client";

import { cn } from "@/lib/utils";
import Toggle from "@/components/ui/toggle";
import type { DetailField } from "@/app/types/datadetails";

export function DetailRow({
  label,
  value,
  status,
  onToggleStatus,
}: DetailField) {
  const isStatus = label.toLowerCase() === "status";

  return (
<div
  className={cn(
    "py-1 px-4",                               // reduced padding
    "rounded-lg bg-white/70 border border-[#F0E9DB]",
    "hover:bg-white/90 transition-colors",
                                // smaller but still consistent
    "flex flex-col justify-center"
  )}
>
  {/* Label – smaller font & margin */}
  <div className="text-[11px] font-medium uppercase tracking-wider text-[#8B6F47] mb-1">
    {label}
  </div>

  {/* Content */}
 {isStatus && status && onToggleStatus ? (
  <div className="flex items-center">
    <Toggle
      value={status === "active"}
      onChange={(newActive) => onToggleStatus(newActive)}
      size="sm"
    />
  </div>
) : (

    <div className="text-sm font-medium text-neutral-900 break-words leading-snug">
      {value ?? "—"}
    </div>
  )}
</div>
  );
}