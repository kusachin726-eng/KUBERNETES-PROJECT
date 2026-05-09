"use client";


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description: string;

  confirmText?: string;
  cancelText?: string;

  onConfirm: () => void;
  loading?: boolean;

  variant?: "primary" | "secondary";
}

export default function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  loading = false,
  variant = "primary",
}: ConfirmModalProps) {
  const isDanger = confirmText.toLowerCase().includes("delete");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          max-w-sm p-0 overflow-hidden
          rounded-xl border-none shadow-xl
          bg-[#FDFAF5]
        "
      >
        {/* HEADER */}
     <DialogHeader
  className={cn(
    "flex  gap-1 px-5 py-4 rounded-t-xl !justify-start",
    isDanger
      ? "bg-red-100 border-b border-red-200"
      : "bg-primary/10 border-b border-primary/20"
  )}
>

        <AlertTriangle className="h-5 w-5 text-red-500" />
     <DialogTitle className="text-sm font-semibold text-red-600">
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* BODY */}
     <div className="px-5 py-4 text-sm text-neutral-700">

          <DialogDescription className="text-sm text-neutral-700">
            {description}
          </DialogDescription>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 px-5 py-3 border-t bg-[#FDF8F0]">
      <Button
  type="button"
  variant="ghost"
  onClick={() => onOpenChange(false)}
  disabled={loading}
  className="
    border border-gray-400
    text-gray-700
    hover:bg-gray-100
    px-6
  "
>
  {cancelText}
</Button>

         

         <Button
  onClick={onConfirm}
  disabled={loading}
  className="
    bg-red-500
    text-white
    hover:bg-red-600
    
    px-6
  "
>
  {loading ? "Please wait..." : confirmText}
</Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}
