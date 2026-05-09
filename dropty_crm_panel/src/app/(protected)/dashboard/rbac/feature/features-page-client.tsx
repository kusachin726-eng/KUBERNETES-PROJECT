"use client";
import { PageHeader } from "@/components/page-header";

import { useState } from "react";
import { FeatureTable } from "./feature-table";
import AddEditFeatureModal from "./add-edit-feature-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PermissionMap } from "@/lib/permissions/types";
import { can } from "@/lib/permissions/can";

type Props = {
  result: {
    features: any[];
    total: number;
  };
  currentPage: number;
  totalPages: number;
  permissions: PermissionMap;
};

export default function FeaturesPageClient({
  result,
  currentPage,
  totalPages,
  permissions,
}: Props) {
  const { features } = result;
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedFeature, setSelectedFeature] = useState<any | null>(null);
  const canAdd = can(permissions, "role_and_permission", "create");

  return (
    <div className="page-container">
      {canAdd && (
        <PageHeader
          title="Features"
          action={
            <Button
              variant="add"
              onClick={() => {
                setMode("add");
                setSelectedFeature(null);
                setOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Feature
            </Button>
          }
        />
      )}

      {/* TABLE */}
      <div className="table-card">

        <FeatureTable
          features={features}
          currentPage={currentPage}
          totalPages={totalPages}
          total={result.total}   
          permissions={permissions}
          // onEdit={(feature) => {
          //   setMode("edit");
          //   setSelectedFeature(feature);
          //   setOpen(true);
          // }}
        />
      </div>

      {/* MODAL */}
      <AddEditFeatureModal
        open={open}
        onOpenChange={setOpen}
        mode={mode}
        initialValues={selectedFeature ?? {}}
      />
    </div>
  );
}
