
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, action, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between mb-0 p-3 bg-white rounded-lg border border-zinc-200",
        className
      )}
    >
      <h1 className="text-xl font-semibold text-zinc-900">{title}</h1>
      {action && <div>{action}</div>}
    </div>
  );
}
