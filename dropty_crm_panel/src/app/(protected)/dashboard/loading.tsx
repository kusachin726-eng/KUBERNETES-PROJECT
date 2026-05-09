
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="page-container space-y-8">
      {/* Header Skeleton */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-100 p-8 shadow-sm dark:bg-zinc-800">
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-6 w-96" />
        </div>
      </div>

      {/* Metrics Skeleton */}
      <div>
        <Skeleton className="mb-4 h-7 w-48" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
             <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Charts Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
         <Skeleton className="h-[400px] rounded-xl" />
         <Skeleton className="h-[400px] rounded-xl" />
      </div>
    </div>
  );
}
