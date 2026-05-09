"use client";

import { useState } from "react";
import { CustomersTable } from "./customers-table";
import AddEditCustomerModal from "./edit-customer-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PermissionMap } from "@/lib/permissions/types";
import { can } from "@/lib/permissions/can";
import { PageHeader } from "@/components/page-header";

type Props = {
  result: {
    customers: any[];
    total: number;
  };
  currentPage: number;
  totalPages: number;
  permissions: PermissionMap;
};

export default function CustomersPageClient({
  result,
  currentPage,
  totalPages,
  permissions,
}: Props) {
  const { customers } = result;
  const [open, setOpen] = useState(false);

  const canAdd = can(permissions, "customer", "create");

  return (
    <div className="page-container">
      {/* Header with Title and Add Button */}
      {canAdd && (
        <PageHeader
          title="Customers"
          action={
            <Button variant="add" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Customer
            </Button>
          }
        />
      )}

      {/* =====================
          TABLE
      ===================== */}
      <div className="table-card w-full overflow-x-auto">

        <CustomersTable
          customers={customers}
          total={result.total}
          currentPage={currentPage}
          totalPages={totalPages}
          permissions={permissions}
        />
      </div>

      {/* =====================
          ADD CUSTOMER MODAL
      ===================== */}
      <AddEditCustomerModal
        open={open}
        onOpenChange={setOpen}
        mode="add"
        customer={null}
      />
    </div>
  );
}