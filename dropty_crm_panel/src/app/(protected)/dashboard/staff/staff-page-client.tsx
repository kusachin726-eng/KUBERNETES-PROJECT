"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StaffTable } from "./staff-table";
import AddEditStaffModal from "./addEditStaffModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PermissionMap } from "@/lib/permissions/types";
import { can } from "@/lib/permissions/can";
import { Staff } from "@/lib/data/staff";

type Props = {
  staff: Staff[];
  total: number;
  currentPage: number;
  totalPages: number;
  userType: string;
  permissions: PermissionMap;
  loggedInUserId: string;
};

export default function StaffPageClient({
  staff,
  total,
  currentPage,
  totalPages,
  userType,
  permissions,
  loggedInUserId,
}: Props) {
  const [open, setOpen] = useState(false);
  const canAdd = can(permissions, "staff", "create");

  return (
    <div className="page-container">
      {/* Header Card */}
      <PageHeader
        title="Staff"
        action={
          canAdd && (
            <Button variant="add" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Staff
            </Button>
          )
        }
      />

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <StaffTable
          staff={staff}
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          userType={userType}
          permissions={permissions}
          loggedInUserId={loggedInUserId}
        />
      </div>

      {/* Add Modal */}
      <AddEditStaffModal
        open={open}
        onOpenChange={setOpen}
        mode="add"
      />
    </div>
  );
}
