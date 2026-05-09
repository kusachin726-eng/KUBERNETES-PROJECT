"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddEditForm, { FormField } from "@/components/addeditform";
import { toast } from "sonner";
import { createRoleAction, updateRoleAction } from "./actions";
import { useState } from "react";

interface AddEditRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "add" | "edit";
  role?: {
    roleId: number;
    title: string;
  };
  onSuccess?: (updatedRole?: { roleId?: number; title: string }) => void;
}
const roleFields: FormField[] = [
  {
    type: "input",
    name: "title",
    label: "Role Title",
    required: true,
    pattern: {
      value: /^[A-Za-z\s]+$/,
      message: "Only letters are allowed",
    },
  },
];
export default function AddEditRoleModal({
  open,
  onOpenChange,
  mode = "add",
  role,
  onSuccess,
}: AddEditRoleModalProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const handleSubmit = async (values: Record<string, any>) => {
    const newErrors: Record<string, string> = {};
    const title = values.title?.trim();
    if (!title) {
      newErrors.title = "Role title is required";
    }

    else if (title.length > 30) {
      newErrors.title = "Role title cannot exceed 30 characters";
    }

    else if (!/^[A-Za-z\s]+$/.test(title)) {
      newErrors.title = "Only letters are allowed";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // ✏️ EDIT ROLE
    if (mode === "edit" && role) {
      const res = await updateRoleAction({
        roleId: role.roleId,
        title,
      });

      if (!res.success) {
        toast.error(res.message || "Update failed");
        return;
      }

      toast.success("Role updated successfully");
      onSuccess?.({ roleId: role.roleId, title });
      onOpenChange(false);
      return;
    }
    const res = await createRoleAction({ title });

    if (!res.success) {
      toast.error(res.message || "Create failed");
      return;
    }

    toast.success("Role created successfully");
    onSuccess?.({ title });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Role" : "Add Role"}
          </DialogTitle>
        </DialogHeader>

        <AddEditForm
          // title=""
          fields={roleFields}
          initialValues={{
            title: mode === "edit" ? role?.title : "",
          }}
          submitText={mode === "edit" ? "Update Role" : "Create Role"}
          cancelText="Cancel"
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          errors={errors}
        />
      </DialogContent>
    </Dialog>
  );
}
