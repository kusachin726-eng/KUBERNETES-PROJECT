
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* =====================
   ROOT EXPORTS
===================== */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogPortal = DialogPrimitive.Portal;

/* =====================
   OVERLAY
===================== */
export function DialogOverlay({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

/* =====================
   CONTENT (with height props)
===================== */
export function DialogContent({
  className,
  children,
  minHeight = "auto",
  maxHeight = "90dvh",
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  minHeight?: string;
  maxHeight?: string;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />

      <DialogPrimitive.Content
        style={{ minHeight, maxHeight }}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 pb-4",
          "w-full max-w-md md:max-w-lg lg:max-w-xl",
          "overflow-y-auto rounded-xl bg-[#FDFAF5] shadow-2xl border-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:slide-out-to-bottom-[48%] data-[state=open]:slide-in-from-bottom-[48%] duration-200",
          className
        )}
        {...props}
      >
        <VisuallyHidden asChild>
          <DialogPrimitive.Title>Dialog</DialogPrimitive.Title>
        </VisuallyHidden>

        {children}

        <DialogPrimitive.Close className="absolute right-4 top-2 z-10 rounded-full p-1.5 text-neutral-600 hover:text-neutral-900 transition-colors">
          <X className="h-5 w-5"  color="white"/>
          <span className="sr-only" >Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

/* =====================
   HEADER
===================== */
export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
<div
  className={cn(
    "px-6 py-4 rounded-t-xl",
    "bg-primary text-white",
    "border-b border-primary/20",
    "flex items-center justify-between font-semibold",
    className
  )}
  {...props}
/>


  );
}

/* =====================
   TITLE
===================== */
export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-base font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

/* =====================
   DESCRIPTION ✅ REQUIRED
===================== */
export function DialogDescription({
  className,
  ...props
} : React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-neutral-500 mt-1", className)}
      {...props}
    />
  );
}
