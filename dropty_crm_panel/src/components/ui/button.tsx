import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "submit" | "add" | "primary" | "secondary" | "ghost" | "destructive" | "outline";
    size?: "default" | "sm" | "lg" | "icon";
  };

export function Button({
  className,
  variant = "primary",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // base
        "inline-flex items-center justify-center bg-primary rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
        
        // Sizes
        size === "default" && "h-10 px-4 py-2",
        size === "sm" && "h-8 px-3 text-xs",
        size === "lg" && "h-12 px-8",
        size === "icon" && "h-9 w-9",

        // 🔵 SUBMIT (blue – primary action)
        variant === "submit" &&
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 focus:ring-primary",

        // ➕ ADD (black with icon spacing)
        variant === "add" &&
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 flex items-center gap-2",

        // ⚫ DEFAULT PRIMARY
        variant === "primary" &&
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200",

        // ⚪ SECONDARY
        variant === "secondary" &&
          "bg-white border border-zinc-200 text-zinc-900 shadow-sm hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800",

        // 👻 GHOST
        variant === "ghost" &&
          "bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
          
        // 🔴 DESTRUCTIVE
        variant === "destructive" &&
          "bg-red-600 text-white shadow-sm hover:bg-red-700 dark:bg-red-900 dark:text-red-50 dark:hover:bg-red-900/90",
          
        // OUTLINE
        variant === "outline" &&
          "border border-zinc-200 bg-transparent shadow-sm hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800",

        className
      )}
      {...props}
    />
  );
}
