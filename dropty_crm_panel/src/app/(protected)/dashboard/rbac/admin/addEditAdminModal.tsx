
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AddEditForm from "@/components/addeditform";

import {
  createAdminAction,
  updateAdminAction,
  getAdminByIdAction,
} from "./actions";

/* =====================
   TYPES
===================== */
type CreateAdminPayload = {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;           // ← changed: remove | null
  email: string;
  mobile_number: string;
  password: string;
};

type AdminFormField =
  | {
      type: "input";
      name: string;
      label: string;
      inputType?: React.HTMLInputTypeAttribute;
      required?: boolean;
      pattern?: {
        value: RegExp;
        message: string;
      };
      validate?: (value: string) => true | string;
      maxLength?: number;
      hideOnEdit?: boolean;
      hideOnAdd?: boolean;
    }
  | {
      type: "select";
      name: string;
      label: string;
      required?: boolean;
      hideOnEdit?: boolean;
      hideOnAdd?: boolean;
      options: { label: string; value: string }[];
    };

interface AddEditAdminModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialValues?: Record<string, any>;
}


/* =====================
   FORM FIELDS
===================== */
const fields: AdminFormField[] = [
  {
    type: "input",
    name: "firstName",
    label: "First Name",
    inputType: "text",
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
    inputType: "text",
    required: true,
    pattern: {
      value: /^[A-Za-z\s]+$/,
      message: "Last name should contain only letters",
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
      { label: "Others", value: "others" },
    ],
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
    name: "mobile_number",
    label: "Mobile Number",
    inputType: "tel",
    required: true,
    maxLength: 10,
    validate: (value: string) => {
      if (!/^\d*$/.test(value)) return "Only numbers are allowed";
      if (value.length !== 10)
        return "Mobile number must be exactly 10 digits";
      return true;
    },
  },
  {
    type: "input",
    name: "password",
    label: "Password",
    inputType: "password",
    required: true, // ❌ unchanged as you asked
  },
];

/* =====================
   COMPONENT
===================== */
export default function AddEditAdminModal({
  open,
  onOpenChange,
  mode,
  initialValues = {},
}: AddEditAdminModalProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formValues, setFormValues] = useState<Record<string, any>>(initialValues);

  /* =====================
     FETCH ADMIN (EDIT MODE)
  ===================== */
  // useEffect(() => {
  //   if (!open || mode !== "edit" || !initialValues?.id) return;

  //   const fetchAdmin = async () => {
  //     setLoading(true);

  //     const res = await getAdminByIdAction(Number(initialValues.id));

  //     if (!res?.success || !res?.data) {
  //       toast.error("Failed to fetch admin details");
  //       setLoading(false);
  //       return;
  //     }

  //     const admin = res.data;

  //     // ✅ Prefill everything EXCEPT password
  //     initialValues.firstName = admin.firstName ?? "";
  //     initialValues.lastName = admin.lastName ?? "";
  //     initialValues.email = admin.email ?? "";
  //     initialValues.mobile_number = admin.mobile_number ?? "";
  //     initialValues.gender = admin.gender ?? "";
  //     initialValues.dateOfBirth = admin.dateOfBirth
  //       ? admin.dateOfBirth.split("T")[0]
  //       : "";

  //     setLoading(false);
  //   };

  //   fetchAdmin();
  // }, [open, mode, initialValues]);
useEffect(() => {
  if (!open || mode !== "edit" || !initialValues?.id) return;

  const fetchAdmin = async () => {
    setLoading(true);

    const res = await getAdminByIdAction(Number(initialValues.id));

    if (!res?.success || !res?.data) {
      toast.error("Failed to fetch admin details");
      setLoading(false);
      return;
    }

    const admin = res.data;

    setFormValues({
      firstName: admin.userProfile?.firstName ?? "",
      lastName: admin.userProfile?.lastName ?? "",
      gender: admin.userProfile?.gender ?? "",
      dateOfBirth: admin.userProfile?.dateOfBirth
        ? admin.userProfile.dateOfBirth.split("T")[0]
        : "",
      email: admin.email ?? "",
      mobile_number: admin.mobile_number ?? "",
      // ❌ password intentionally NOT set
    });

    setLoading(false);
  };

  fetchAdmin();
}, [open, mode, initialValues?.id]);

  const visibleFields = fields.filter((field) => {
    if (mode === "add" && field.hideOnAdd) return false;
    if (mode === "edit" && field.hideOnEdit) return false;
    return true;
  });

  /* =====================
     SUBMIT HANDLER
  ===================== */
  const handleSubmit = async (values: Record<string, any>) => {
    const newErrors: Record<string, string> = {};

    if (!values.email?.trim()) newErrors.email = "Email is required";
    if (!values.mobile_number?.trim())
      newErrors.mobile_number = "Mobile number is required";

    if (mode === "add" && (!values.password || values.password.length < 6)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!values.firstName) newErrors.firstName = "First Name is required";
    if (!values.lastName) newErrors.lastName = "Last Name is required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    try {
      // if (mode === "add") {
      //   const result = await createAdminAction(values);

      //   if (!result.success) {
      //     toast.error(result.message || "Create failed");
      //     return;
      //   }

      //   toast.success("Admin created successfully ✅");
      //   onOpenChange(false);
      //   router.refresh();
      //   return;
      // }
      if (mode === "add") {
  const payload: CreateAdminPayload = {
    firstName: values.firstName,
    lastName: values.lastName,
    gender: values.gender,
    dateOfBirth: values.dateOfBirth || null,
    email: values.email.trim(),
    mobile_number: values.mobile_number,
    password: values.password,
  };

  const result = await createAdminAction(payload);

  if (!result.success) {
    toast.error(result.message || "Create failed");
    return;
  }

  toast.success("Admin created successfully ✅");
  onOpenChange(false);
  router.refresh();
  return;
}


      const editPayload = {
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth || null,
        email: values.email.trim(),
        mobile_number: values.mobile_number,
      };

      const result = await updateAdminAction(
        String(initialValues.id),
        editPayload
      );

      if (!result.success) {
        toast.error(result.message || "Update failed");
        return;
      }

      toast.success("Admin updated successfully ✅");
      onOpenChange(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  /* =====================
     RENDER
  ===================== */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Admin" : "Edit Admin"}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-center py-8">Loading admin details...</p>
        ) : (
          // <AddEditForm
          //   fields={visibleFields}
          //   initialValues={initialValues}
          //   submitText={mode === "add" ? "Create Admin" : "Update Admin"}
          //   cancelText="Cancel"
          //   onSubmit={handleSubmit}
          //   onCancel={() => onOpenChange(false)}
          //   errors={errors}
          // />
          <AddEditForm
  key={mode === "edit" ? initialValues?.id : "add"}
  fields={visibleFields}
  initialValues={formValues}
  submitText={mode === "add" ? "Create Admin" : "Update Admin"}
  cancelText="Cancel"
  onSubmit={handleSubmit}
  onCancel={() => onOpenChange(false)}
  errors={errors}
/>

        )}
      </DialogContent>
    </Dialog>
  );
}
