
"use client";

import { useEffect, useState } from "react";
import { updateStaffAction, getStaffByIdAction } from "./actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import AddEditForm, { FormField } from "@/components/addeditform";

interface AddEditStaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialValues?: { id?: number };
}

/* =====================
   STAFF FORM FIELDS
===================== */
const fields: FormField[] = [
  {
    type: "input",
    name: "firstName",
    label: "First Name",
    required: true,
    pattern: {
      value: /^[A-Za-z\s]+$/,
      message: "First name should contain only letters",
    },
  },
  {
    type: "input",
    name: "lastName",
    label: "Last Name",
    required: true,
    pattern: {
      value: /^[A-Za-z\s]+$/,
      message: "Last name should contain only letters",
    },
  },
  {
    type: "input",
    name: "email",
    label: "Email",
    inputType: "email",
    required: true,
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
  },
  {
    type: "input",
    name: "dateOfBirth",
    label: "Date of Birth",
    inputType: "date",
  },
  {
    type: "select",
    name: "gender",
    label: "Gender",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
    ],
  },
];


export default function AddEditStaffModal({
  open,
  onOpenChange,
  mode,
  initialValues,
}: AddEditStaffModalProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [staffData, setStaffData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  /* =====================
     FETCH STAFF BY ID
  ===================== */
  // useEffect(() => {
  //   if (!open || mode !== "edit" || !initialValues?.id) return;

  //   const fetchStaff = async () => {
  //     setLoading(true);

  //     const res = await getStaffByIdAction(initialValues.id);

  //     if (!res.success || !res.data) {
  //       toast.error("Failed to load staff details");
  //       setLoading(false);
  //       return;
  //     }

  //     const staff = res.data;

  //     setStaffData({
  //       id: staff.id,
  //       email: staff.email,
  //       isActive: staff.isActive,
  //       firstName: staff.userProfile?.firstName ?? "",
  //       lastName: staff.userProfile?.lastName ?? "",
  //       gender: staff.userProfile?.gender ?? "",
  //       dateOfBirth: staff.userProfile?.dateOfBirth ?? "",
  //       bio: staff.userProfile?.bio ?? "",
  //     });

  //     setLoading(false);
  //   };

  //   fetchStaff();
  // }, [open, mode, initialValues?.id]);
useEffect(() => {
  if (!open || mode !== "edit") return;

  const staffId = initialValues?.id;
  if (!staffId) return;

  const fetchStaff = async () => {
    setLoading(true);

    const res = await getStaffByIdAction(staffId); // ✅ now number

    if (!res.success || !res.data) {
      toast.error("Failed to load staff details");
      setLoading(false);
      return;
    }

    const staff = res.data;

    setStaffData({
      id: staff.id,
      email: staff.email,
      isActive: staff.isActive,
      firstName: staff.userProfile?.firstName ?? "",
      lastName: staff.userProfile?.lastName ?? "",
      gender: staff.userProfile?.gender ?? "",
      dateOfBirth: staff.userProfile?.dateOfBirth ?? "",
      bio: staff.userProfile?.bio ?? "",
    });

    setLoading(false);
  };

  fetchStaff();
}, [open, mode, initialValues?.id]);

  /* =====================
     RESET STATE ON CLOSE
  ===================== */
  useEffect(() => {
    if (!open) {
      setErrors({});
      setStaffData({});
    }
  }, [open]);

  const normalize = (v: any) => (v === "" ? undefined : v);

  /* =====================
     SUBMIT HANDLER
  ===================== */
  const handleSubmit = async (values: Record<string, any>) => {
    const newErrors: Record<string, string> = {};

    if (!values.firstName?.trim())
      newErrors.firstName = "First name is required";

    if (!values.lastName?.trim())
      newErrors.lastName = "Last name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // ✅ ONLY SEND CHANGED FIELDS
    const payload: Record<string, any> = {};

    if (values.firstName.trim() !== staffData.firstName)
      payload.firstName = values.firstName.trim();

    if (values.lastName.trim() !== staffData.lastName)
      payload.lastName = values.lastName.trim();

    if (normalize(values.email) !== normalize(staffData.email))
      payload.email = values.email?.trim() || null;

    if (normalize(values.gender) !== normalize(staffData.gender))
      payload.gender = values.gender || null;

    if (
      normalize(values.dateOfBirth) !== normalize(staffData.dateOfBirth)
    )
      payload.dateOfBirth = values.dateOfBirth || null;

    if (Object.keys(payload).length === 0) {
      toast.info("No changes detected");
      return;
    }

    try {
      const res = await updateStaffAction(staffData.id, payload);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success("Staff updated successfully");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Staff" : "Edit Staff"}
          </DialogTitle>
        </DialogHeader>

        <AddEditForm
          fields={fields}
          initialValues={mode === "edit" ? staffData : {}}
          submitText={mode === "add" ? "Create Staff" : "Update Staff"}
          cancelText="Cancel"
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          errors={errors}
        />
      </DialogContent>
    </Dialog>
  );
}
