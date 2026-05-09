
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-28" />
      </div>
      <div className="rounded-md border p-4">
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}
