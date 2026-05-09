// // "use client";

// // import { useRouter, useSearchParams } from "next/navigation";
// // import {
// //   Select,
// //   SelectTrigger,
// //   SelectValue,
// //   SelectContent,
// //   SelectItem,
// // } from "@/components/ui/select";

// // interface RowsPerPageSelectProps {
// //   value: number;
// //   options?: number[];
// //   label?: string;
// // }

// // export function RowsPerPageSelect({
// //   value,
// //   options = [10, 25, 50, 75, 100],
// //   label = "Rows per page",
// // }: RowsPerPageSelectProps) {
// //   const router = useRouter();
// //   const searchParams = useSearchParams();

// //   const handleChange = (newLimit: string) => {
// //     const params = new URLSearchParams(searchParams.toString());

// //     params.set("limit", newLimit);
// //     params.set("page", "1"); // reset page on limit change

// //     router.replace(`?${params.toString()}`);
// //   };

// //   return (
// //     <div className="flex items-center gap-2 text-sm">
// //       <span className="text-zinc-600">{label}</span>

// //       <Select value={String(value)} onValueChange={handleChange}>
// //         <SelectTrigger size="sm" className="min-w-[72px]">
// //           <SelectValue />
// //         </SelectTrigger>

// //         <SelectContent align="end">
// //           {options.map((opt) => (
// //             <SelectItem key={opt} value={String(opt)}>
// //               {opt}
// //             </SelectItem>
// //           ))}
// //         </SelectContent>
// //       </Select>
// //     </div>
// //   );
// // }
// "use client";

// import { useRouter, useSearchParams } from "next/navigation";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";

// interface RowsPerPageSelectProps {
//   value: number;
//   totalCount: number;          // ✅ NEW
//   options?: number[];
//   label?: string;
// }

// export function RowsPerPageSelect({
//   value,
//   totalCount,
//   options = [10, 25, 50, 75, 100],
//   label = "Rows per page",
// }: RowsPerPageSelectProps) {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // ✅ REMOVE OPTIONS GREATER THAN TOTAL COUNT
//   // const finalOptions = options.filter(
//   //   (opt) => opt <= totalCount
//   // );

//   // // ✅ ENSURE totalCount ITSELF APPEARS (e.g. 75)
//   // if (!finalOptions.includes(totalCount)) {
//   //   finalOptions.push(totalCount);
//   // }
//   const finalOptions = Array.from(
//   new Set(
//     options.filter(opt => opt <= totalCount).concat(totalCount)
//   )
// ).sort((a, b) => a - b);


//   const handleChange = (newLimit: string) => {
//     const params = new URLSearchParams(searchParams.toString());
//     params.set("limit", newLimit);
//     params.set("page", "1"); // reset page
//     router.replace(`?${params.toString()}`);
//   };

//   return (
//     <div className="flex items-center gap-2 text-sm">
//       <span className="text-zinc-600">{label}</span>

//       <Select value={String(value)} onValueChange={handleChange}>
//         <SelectTrigger size="sm" className="min-w-[72px]">
//           <SelectValue />
//         </SelectTrigger>

//         <SelectContent align="end">
//           {finalOptions.map((opt) => (
//             <SelectItem key={opt} value={String(opt)}>
//               {opt}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </div>
//   );
// }
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface RowsPerPageSelectProps {
  value: number;
  options?: number[];
  label?: string;
}

export function RowsPerPageSelect({
  value,
  options = [10, 25, 50, 75],
  label = "Rows per page",
}: RowsPerPageSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (newLimit: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("limit", newLimit);
    params.set("page", "1"); // reset page on limit change

    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-zinc-600">{label}</span>

      <Select value={String(value)} onValueChange={handleChange}>
        <SelectTrigger size="sm" className="min-w-[72px]">
          <SelectValue />
        </SelectTrigger>

        <SelectContent align="end">
          {options.map((opt) => (
            <SelectItem key={opt} value={String(opt)}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
