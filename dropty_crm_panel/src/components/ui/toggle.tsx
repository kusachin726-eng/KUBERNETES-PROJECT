"use client";

import { cn } from "@/lib/utils"; 

interface ToggleProps {
  value: boolean;
  onChange: (newValue: boolean) => void;   
  activeLabel?: string;
  inactiveLabel?: string;


  confirmTitle?: string;
  confirmDescription?: (next: boolean) => string;

  disabled?: boolean;
  size?: "sm" | "md";             
}

export default function Toggle({
  value,
  onChange,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
  disabled = false,
  size = "sm",
}: ToggleProps) {
  const nextValue = !value;

  return (
    <div className="flex flex-col items-start gap-1">
      <span
        className={cn(
          "text-xs font-medium",
          value ? "text-green-600" : "text-red-600"
        )}
      >
        {/* {value ? activeLabel : inactiveLabel} */}
      </span>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(nextValue)}
        className={cn(
          "relative inline-flex items-center rounded-full transition-colors",
          size === "sm" ? "h-5 w-9" : "h-6 w-11",
          value ? "bg-green-500" : "bg-red-500",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span
          className={cn(
            "inline-block rounded-full bg-white shadow transform transition-transform",
            size === "sm" ? "h-4 w-4" : "h-5 w-5",
            value ? "translate-x-4" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}