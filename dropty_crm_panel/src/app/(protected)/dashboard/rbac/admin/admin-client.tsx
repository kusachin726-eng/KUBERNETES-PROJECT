"use client";
import { PageHeader } from "@/components/page-header";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/data-table";
import { adminColumns } from "./admin-table";
import AddEditAdminModal from "./addEditAdminModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Admin } from "@/lib/data/admin";
import { deleteAdminAction } from "./actions";
import ConfirmModal from "@/components/ui/confirmationmodal";
import { toast } from "sonner";
import { PermissionMap } from "@/lib/permissions/types";
import { can } from "@/lib/permissions/can";

/* =====================
   TYPES
===================== */

type EditAdminFormData = {
  id: number;
  email?: string;
  mobile_number?: string;
  admin_role_id?: number; // 👈 REQUIRED
  isActive: boolean;
  firstName?: string;
  lastName?: string;
};


/* =====================
   PROPS
===================== */

// interface Props {
//   admins: Admin[];
//   permissions: PermissionMap;
// }

interface Props {
  admins: Admin[];
  total: number;
  currentPage: number;
  limit: number;
  searchKey: string;
  permissions: PermissionMap;
  loggedInAdminId:string;
}


/* =====================
   COMPONENT
===================== */

export default function AdminClient({ 
  admins, 
  permissions,
  total,
  currentPage,
  loggedInAdminId,
  limit,
  searchKey,
}: Props) {
  const router = useRouter();
  const handleNameClick = (admin: any) => {
  if (!admin?.id) return;
  router.push(`/dashboard/rbac/admin/${admin.id}`);
};

const filteredAdmins = admins.filter(
  (admin) => String(admin.id) !== String(loggedInAdminId)
);


  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<EditAdminFormData | null>(null);
  const canAdd = can(permissions, "role_and_permission", "create");
  const totalPages = Math.ceil(total / limit);


  return (
    <div className="page-container">
      {canAdd && (
        <PageHeader
          title="Admins"
          action={
            <Button
              variant="add"
              onClick={() => {
                setMode("add");
                setSelectedAdmin(null);
                setOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Admin
            </Button>
          }
        />
      )}

      {/* TABLE */}
      <div className="table-card">

        <DataTable
        columns={adminColumns(
          (admin) => {
            setMode("edit");
            setSelectedAdmin({
              id: admin.id,
              email: admin.email,
              mobile_number: admin.mobile_number,
              // firstName: admin.name,
              // admin_role_id: admin.adminRole.id,
              isActive: admin.isActive,
            });
            setOpen(true);
          },
          (admin) => {
            setAdminToDelete(admin);
            setDeleteOpen(true);
          },
          permissions
        )}
       data={filteredAdmins} 
         onNameClick={handleNameClick} 
        currentPage={currentPage}
        totalPages={totalPages}
        total={total} 
        // onPageChange={(page) =>
        //   router.push(`?page=${page}&searchKey=${searchKey}`)
        // }
        onPageChange={(page) => {
  const params = new URLSearchParams(window.location.search);
  params.set("page", String(page));
  router.push(`?${params.toString()}`);
}}
      />

      <ConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Admin"
        description="Are you sure you want to delete this admin?"
        confirmText="Delete"
        onConfirm={async () => {
          if (!adminToDelete) return;

          const res = await deleteAdminAction(adminToDelete.id);

          if (res.success) {
            toast.success(res.message);
            router.refresh();
          } else {
            toast.error(res.message || "Delete failed");
          }

          setDeleteOpen(false);
          setAdminToDelete(null);
        }}
      />
      </div>

      {/* MODAL */}
      <AddEditAdminModal
        open={open}
        onOpenChange={setOpen}
        mode={mode}
        initialValues={selectedAdmin ?? {}}
      />
    </div>
  );
}
