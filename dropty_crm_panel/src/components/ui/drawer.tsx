"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  width?: "sm" | "md" | "lg";
};

const widthMap = {
  sm: "w-[360px]",
  md: "w-[420px]",
  lg: "w-[520px]",
};

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = "md",
}: DrawerProps) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-full bg-white shadow-xl ${widthMap[width]}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b px-4 py-3">
          <div>
            {title && <h2 className="text-sm font-semibold">{title}</h2>}
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="rounded p-1 hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-56px)] overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </>
  );
}