"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import AddEditForm, { FormField } from "@/components/addeditform";
import { updateFeatureAction } from "./actions";

/* =====================
   TYPES
===================== */
interface AddEditFeatureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  featureId?: number;
  initialValues?: {
    title: string;
    isActive?: boolean;
  };
}

/* =====================
   FORM FIELDS
===================== */
const featureFields: FormField[] = [
  {
    type: "input",
    name: "title",
    label: "Feature Title",
    required: true,
    pattern: {
      value: /^[A-Za-z_\s]+$/,
      message: "Only letters, space and underscore are allowed",
    },
  },
];

/* =====================
   COMPONENT
===================== */
export default function AddEditFeatureModal({
  open,
  onOpenChange,
  mode,
  initialValues,
  featureId,
}: AddEditFeatureModalProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (values: Record<string, any>) => {
    const newErrors: Record<string, string> = {};

    /* =====================
       VALIDATION
    ===================== */
    if (!values.title || !values.title.trim()) {
      newErrors.title = "Feature title is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      /* =====================
         ADD FEATURE
      ===================== */
      if (mode === "add") {
        const res = await fetch("/api/features/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: values.title.trim() }),
        });

        let data: any = null;
        try {
          data = await res.json();
        } catch {}

        if (!res.ok) {
          const message = data?.message || "Failed to create feature";

          if (message.toLowerCase().includes("title")) {
            setErrors({ title: message });
            return;
          }

          toast.error(message);
          return;
        }

        toast.success("Feature added successfully ✅");
      }

      /* =====================
         EDIT FEATURE
      ===================== */
      if (mode === "edit" && featureId) {
        const ok = await updateFeatureAction(featureId, {
          title: values.title.trim(),
        });

        if (!ok) {
          toast.error("Failed to update feature");
          return;
        }

        toast.success("Feature updated successfully ✅");
      }

      onOpenChange(false);
      router.refresh();
    } catch (err: any) {
      console.error("❌ Feature submit error:", err);
      toast.error(err?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Feature" : "Edit Feature"}
          </DialogTitle>
        </DialogHeader>

        <AddEditForm
          fields={featureFields}
          initialValues={initialValues}
          submitText={mode === "add" ? "Create Feature" : "Update Feature"}
          cancelText="Cancel"
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          errors={errors}
        />
      </DialogContent>
    </Dialog>
  );
}
