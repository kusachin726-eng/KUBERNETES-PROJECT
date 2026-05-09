
// "use client";

// import { useState, useEffect } from "react";
// import { RidersTable } from "./riders-table";
// import AddEditRiderModal from "./addRidermodal";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import type { Rider } from "@/lib/data/rider";
// import { Plus } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { fetchSingleRiderAction } from "./actions";
// import { PermissionMap } from "@/lib/permissions/types";
// import { can } from "@/lib/permissions/can";

// /* =====================
//    TYPES
// ===================== */

// type EditRiderFormData = {
//   id?: number;
//   firstName: string;
//   lastName: string;
//   email: string | null;
//   mobile_number: string;
//   gender: string;
//   dateOfBirth: string | null;
// };

// interface Props {
//   riders: Rider[];
//   totalPages: number;
//   totalCount: number;
//   currentPage: number;
//   searchKey: string;
//   isActive: boolean; // ✅ FIXED
//   permissions: PermissionMap;
// }



// /* =====================
//    COMPONENT
// ===================== */

// export default function RidersClient({
//   riders,
//   currentPage,
//   totalPages,
//   totalCount,
//   isActive,
//   permissions
// }: Props) {

//   const router = useRouter();

//   const [open, setOpen] = useState(false);
//   const [mode, setMode] = useState<"add" | "edit">("add");
//   const [selectedRider, setSelectedRider] = useState<EditRiderFormData | null>(null);
//   const canAdd = can(permissions, "crew", "create");


//   return (
//     <div className="space-y-4">
//       {/* HEADER */}
//       <div className="flex justify-between rounded-[8px]  p-2">
//         <h1 className="page-title">Crews</h1>
//         {canAdd && (
//         <Button
//           variant="add"
//           onClick={() => {
//             setMode("add");
//             setSelectedRider(null);
//             setOpen(true);
//           }}
//         >
//           <Plus className="h-4 w-4" />
//           Add Rider
//         </Button>
//         )}
//       </div>

//       {/* TABLE */}
//       <Card>
//         <CardContent>
//           <RidersTable
//             riders={riders}
//             currentPage={currentPage}
//             totalPages={totalPages}
//               status={status}
//               onPageChange={(page) => {
//              router.push(
//   `/dashboard/logistics/crew?page=${page}&isActive=${isActive}`
// );

//             }}
          
//             onEdit={async (rider) => {
//   try {
 

//     const result = await fetchSingleRiderAction(Number(rider.id));

    

//     if (!result || !result.success || !result.data) {
//       console.error("❌ Failed to load rider details", result);
//       return;
//     }

 

//     setMode("edit");
//     setSelectedRider(result.data);
//     setOpen(true);
//   } catch (error) {
//     console.error("❌ Edit fetch failed:", error);
//   }
// }}

//             permissions={permissions}
//           />
//         </CardContent>
//       </Card>

//       {/* MODAL */}
//       <AddEditRiderModal
//         open={open}
//         onOpenChange={setOpen}
//         mode={mode}
//         initialValues={selectedRider ?? {}}
//       />
//     </div>
//   );
// }
"use client";
import { PageHeader } from "@/components/page-header";

import { useState } from "react";
import { RidersTable } from "./riders-table";
import AddEditRiderModal from "./addRidermodal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Rider } from "@/lib/data/rider";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchSingleRiderAction } from "./actions";
import { PermissionMap } from "@/lib/permissions/types";
import { can } from "@/lib/permissions/can";

type EditRiderFormData = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string | null;
  mobile_number: string;
  gender: string;
  dateOfBirth: string | null;
};

interface Props {
  riders: Rider[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
  searchKey: string;
  isActive: boolean; // ✅ FIXED
  permissions: PermissionMap;
}

export default function RidersClient({
  riders,
  currentPage,
  totalPages,
  totalCount,
  isActive,
  permissions,
}: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedRider, setSelectedRider] =
    useState<EditRiderFormData | null>(null);

  const canAdd = can(permissions, "crew", "create");

  return (
    <div className="page-container">
      <PageHeader
        title="Crew"
        action={
          canAdd && (
            <Button
              variant="add"
              onClick={() => {
                setMode("add");
                setSelectedRider(null);
                setOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Rider
            </Button>
          )
        }
      />

      <Card>
        <CardContent className="p-0">
          <RidersTable
            riders={riders}
            total={totalCount}
            currentPage={currentPage}
            status=""
            totalPages={totalPages}
            isActive={isActive} // ✅ FIXED
            onPageChange={(page) => {
              router.push(
                `/dashboard/logistics/crew?page=${page}&isActive=${isActive}`
              );
            }}
            onEdit={async (rider) => {
              const result = await fetchSingleRiderAction(Number(rider.id));
              if (!result?.success || !result.data) return;
              setMode("edit");
              setSelectedRider(result.data);
              setOpen(true);
            }}
            permissions={permissions}
          />
        </CardContent>
      </Card>

      <AddEditRiderModal
        open={open}
        onOpenChange={setOpen}
        mode={mode}
        initialValues={selectedRider ?? {}}
      />
    </div>
  );
}
