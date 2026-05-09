
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
         <Skeleton className="h-16 w-16 rounded-full" />
         <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
         </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Skeleton className="h-[400px] w-full" />
        <div className="space-y-6">
           <Skeleton className="h-[200px] w-full" />
           <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    </div>
  );
}
