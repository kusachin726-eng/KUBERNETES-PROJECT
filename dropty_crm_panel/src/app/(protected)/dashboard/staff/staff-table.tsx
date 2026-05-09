// "use client";

// import { useRouter } from "next/navigation";
// import type { ColumnDef } from "@tanstack/react-table";
// import { useState } from "react";
// import { DataTable } from "@/components/data-table";
// import type { Staff } from "@/lib/data/staff";
// import { StaffRoleFilter } from "./staff-role-filter";
// import { Pencil, Trash2 } from "lucide-react";
// import { toast } from "sonner";
// import { can } from "@/lib/permissions/can";
// import { PermissionMap } from "@/lib/permissions/types";
// import ConfirmModal from "@/components/ui/confirmationmodal";
// import { deleteStaffAction } from "./actions";
// import AddEditStaffModal from "./addEditStaffModal";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";


// interface StaffTableProps {
//   staff: Staff[];
//   currentPage: number;
//   totalPages: number;
//   userType: string;
//   permissions: PermissionMap;
// }

// export function StaffTable({
//   staff,
//   currentPage,
//   totalPages,
//   userType,
//   permissions,
// }: StaffTableProps) {
//   const router = useRouter();
//   const canEdit = can(permissions, "staff", "edit");
//   const canDelete = can(permissions, "staff", "delete");
//   const [open, setOpen] = useState(false);
//   const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
//   const [editOpen, setEditOpen] = useState(false);
//   const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

//   const PAGE_SIZE = 10;
// const handleNameClick = (staff: any) => {
//   if (!staff || !staff.id) {
//     console.error("Staff ID missing", staff);
//     return;
//   }

//   router.push(`/dashboard/staff/${staff.id}`);
// };



//   const columns: ColumnDef<Staff>[] = [
//     // {
//     //   header: "S No",
//     //   meta: { width: "6%", align: "left" },
//     //   cell: ({ row }) => (currentPage - 1) * PAGE_SIZE + row.index + 1,
//     // },
//     {
//       accessorKey: "profile",
//       header: "Profile",
//       meta: { width: "30%" },
//     },
//     // {
//     //   accessorKey: "user_type",
//     //   header: "User Type",
//     //   meta: { width: "25%" },
//     // },
//     {
//       header: "Status",
//       meta: { width: "15%" },
//       cell: ({ row }) => {
//        const isActive = row.original.isActive;
//         return (
//           <div
//             className={`inline-flex rounded-[6px] px-2 py-1 text-[10px] font-medium ${
//               isActive
//                 ? "bg-green-100 text-green-700"
//                 : "bg-red-100 text-red-700"
//             }`}
//           >
//             {isActive ? "Active" : "Inactive"}
//           </div>
//         );
//       },
//     },
//     {
//       accessorKey: "createdAt",
//       header: "Created At",
//       meta: { width: "20%" },
//     },
 
//   ];

//   if (canEdit || canDelete) {
//     columns.push({
//       header: "Actions",
//       meta: { width: "20%", align: "center" },
//       // cell: ({ row }) => (
//       //   <div className="flex items-center justify-center gap-2">
//       //     {canEdit && (
//       //       <button
//       //         onClick={() => {
//       //           setSelectedStaff(row.original);
//       //           setEditOpen(true);
//       //         }}
//       //         className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-blue-200 text-blue-600 hover:bg-blue-50"
//       //       >
//       //         <Pencil size={14} />
//       //       </button>
//       //     )}

//       //     {canDelete && (
//       //       <button
//       //         onClick={() => {
//       //           setSelectedStaffId(row.original.id);
//       //           setOpen(true);
//       //         }}
//       //         className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-red-200 text-red-600 hover:bg-red-50"
//       //       >
//       //         <Trash2 size={14} />
//       //       </button>
//       //     )}
//       //   </div>
//       // ),
//       cell: ({ row }) => (
//   <div className="flex items-center justify-center gap-2">
//     {canEdit && (
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <button
//             onClick={() => {
//               setSelectedStaff(row.original);
//               setEditOpen(true);
//             }}
//             className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[8px] border border-blue-200 text-blue-600 hover:bg-blue-50"
//           >
//             <Pencil size={14} />
//           </button>
//         </TooltipTrigger>
//         <TooltipContent>
//           <span>Edit Staff</span>
//         </TooltipContent>
//       </Tooltip>
//     )}

//     {canDelete && (
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <button
//             onClick={() => {
//               setSelectedStaffId(row.original.id);
//               setOpen(true);
//             }}
//             className="flex h-8 w-8 items-center cursor-pointer justify-center rounded-[8px] border border-red-200 text-red-600 hover:bg-red-50"
//           >
//             <Trash2 size={14} />
//           </button>
//         </TooltipTrigger>
//         <TooltipContent>
//           <span>Delete Staff</span>
//         </TooltipContent>
//       </Tooltip>
//     )}
//   </div>
// ),

//     });
//   }

//   return (
//     <>
//       <DataTable
//         columns={columns}
//         data={staff}
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={(page) => router.push(`?page=${page}`)}
//         searchPlaceholder="Search staff..."
//         filters={<StaffRoleFilter value={userType} />}
//         showUserType
//         onNameClick={handleNameClick}
//       />
//       <ConfirmModal
//   open={open}
//   onOpenChange={setOpen}
//   title="Delete Staff"
//   description="Are you sure you want to delete this staff member? This action cannot be undone."
//   confirmText="Delete"
//   onConfirm={async () => {
//     if (!selectedStaffId) return;

//     const res = await deleteStaffAction(selectedStaffId);

//     if (!res.success) {
//       toast.error(res.message || "Failed to delete staff");
//       return;
//     }

//     toast.error("Staff deleted successfully"); // 🔴 red toast

//     setOpen(false);
//     setSelectedStaffId(null);
//   }}
// />
//       <AddEditStaffModal
//         open={editOpen}
//         onOpenChange={setEditOpen}
//         mode="edit"
//         initialValues={selectedStaff || {}}
//       />
//     </>
//   );
// }
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "@/components/data-table";
import type { Staff } from "@/lib/data/staff";
import { StaffRoleFilter } from "./staff-role-filter";
import { Pencil, Trash2, ArrowUp } from "lucide-react";
import { toast } from "sonner";
import { can } from "@/lib/permissions/can";
import { PermissionMap } from "@/lib/permissions/types";
import ConfirmModal from "@/components/ui/confirmationmodal";
import { deleteStaffAction } from "./actions";
import AddEditStaffModal from "./addEditStaffModal";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StaffTableProps {
  staff: Staff[];
  currentPage: number;
  totalPages: number;
   total: number;   
  userType: string;
  permissions: PermissionMap;
    loggedInUserId: string;
}

export function StaffTable({
  staff,
  currentPage,
  totalPages,
    total,          
  userType,
  permissions,
  loggedInUserId
}: StaffTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const canEdit = can(permissions, "staff", "edit");
  const canDelete = can(permissions, "staff", "delete");

  const [open, setOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const handleNameClick = (staff: any) => {
    if (!staff?.id) return;
    router.push(`/dashboard/staff/${staff.id}`);
  };
  // ✅ GLOBAL: remove logged-in user from staff list
const filteredStaff = staff.filter(
  (s) => String(s.id) !== String(loggedInUserId)
);


  /* =====================
     COLUMNS
  ===================== */
  const columns: ColumnDef<Staff>[] = [
    {
      accessorKey: "profile",
      header: "Profile",
      meta: { width: "20%" },
    },

    // {
    //   header: "Status",
    //   meta: { width: "15%" },
    //   cell: ({ row }) => {
    //     const isActive = row.original.isActive;
    //     return (
    //       <div
    //         className={`inline-flex rounded-[6px] px-2 py-1 text-[10px] font-medium ${
    //           isActive
    //             ? "bg-green-100 text-green-700"
    //             : "bg-red-100 text-red-700"
    //         }`}
    //       >
    //         {isActive ? "Active" : "Inactive"}
    //       </div>
    //     );
    //   },
    // },
    {
  accessorKey: "isActive", // ✅ REQUIRED (fixes the error)
  header: () => {
    const isActiveParam = searchParams.get("isActive") ?? "true";
    const isActive = isActiveParam === "true";

    return (
      <div
        className="flex items-center justify-center gap-1 cursor-pointer select-none"
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString());

          // 🔁 toggle status filter
          params.set("isActive", isActive ? "false" : "true");

          // 🔥 reset page
          params.set("page", "1");

          router.push(`?${params.toString()}`);
        }}
      >
        <span>Status</span>
        <ArrowUp
          size={14}
          className={`transition-transform duration-200 ${
            isActive ? "rotate-0" : "rotate-180"
          }`}
        />
      </div>
    );
  },
  meta: { width: "15%" },
  cell: ({ row }) => {
    const isActive = row.original.isActive;
    return (
      <div
        className={`inline-flex rounded-[6px] px-2 py-1 text-[10px] font-medium ${
          isActive
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </div>
    );
  },
},


    /* ✅ CREATED AT WITH ARROW */
    {
      accessorKey: "createdAt",
      meta: { width: "20%" },
      header: () => {
        const sortOrder = searchParams.get("sortOrder") ?? "desc";
        const isAsc = sortOrder === "asc";

        return (
          <div
            className="flex items-center justify-center gap-1 cursor-pointer select-none"
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());

              params.set("sortOrder", isAsc ? "desc" : "asc");
              // ❌ DO NOT reset page
              router.push(`?${params.toString()}`);
            }}
          >
            <span>Created At</span>
            <ArrowUp
              size={14}
              className={`transition-transform ${
                isAsc ? "rotate-0" : "rotate-180"
              }`}
            />
          </div>
        );
      },
    },
  ];

  /* =====================
     ACTIONS
  ===================== */
  if (canEdit || canDelete) {
    columns.push({
      header: "Actions",
      meta: { width: "20%", align: "center" },
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          {canEdit && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    setSelectedStaff(row.original);
                    setEditOpen(true);
                  }}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[8px] border border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Pencil size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Edit Staff</TooltipContent>
            </Tooltip>
          )}

          {canDelete && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    setSelectedStaffId(row.original.id);
                    setOpen(true);
                  }}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[8px] border border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Delete Staff</TooltipContent>
            </Tooltip>
          )}
        </div>
      ),
    });
  }

  return (
    <>
      <DataTable
        columns={columns}
        // data={filteredStaff}  
        data={staff}
        currentPage={currentPage}
        totalPages={totalPages}
         total={total} 
        searchPlaceholder="Search staff..."
        filters={<StaffRoleFilter value={userType} />}
        showUserType
        onNameClick={handleNameClick}

        /* ✅ FIXED PAGINATION */
        onPageChange={(page) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("page", String(page));
          router.push(`?${params.toString()}`);
        }}
      />

      {/* DELETE */}
      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title="Delete Staff"
        description="Are you sure you want to delete this staff member?"
        confirmText="Delete"
        onConfirm={async () => {
          if (!selectedStaffId) return;

          const res = await deleteStaffAction(selectedStaffId);
          if (!res.success) {
            toast.error(res.message || "Failed to delete staff");
            return;
          }

          toast.error("Staff deleted successfully");
          setOpen(false);
          setSelectedStaffId(null);
          router.refresh();
        }}
      />

      {/* EDIT */}
      <AddEditStaffModal
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        initialValues={selectedStaff || {}}
      />
    </>
  );
}
