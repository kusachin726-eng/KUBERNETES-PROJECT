

"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import AddEditForm, { FormField } from "@/components/addeditform";
import { updateRiderAction,createRiderAction } from "./actions";
import {
  checkEmailUniqueAction,
  checkMobileUniqueAction,
} from "./actions";
import { useDebounce } from "@/app/utils/debounce";

interface AddEditRiderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialValues?: Record<string, any>;
}

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
      if (!/^\d*$/.test(value)) {
        return "Only numbers are allowed";
      }
      if (value.length !== 10) {
        return "Mobile number must be exactly 10 digits";
      }
      return true;
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

export default function AddEditRiderModal({
  open,
  onOpenChange,
  mode,
  initialValues = {},
}: AddEditRiderModalProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uniquenessErrors, setUniquenessErrors] = useState<Record<string, string>>({});
  const [isChecking, startChecking] = useTransition();

  const [emailValue, setEmailValue] = useState(initialValues.email || "");
  const [mobileValue, setMobileValue] = useState(initialValues.mobile_number || "");

  const debouncedEmail = useDebounce(emailValue, 600);
  const debouncedMobile = useDebounce(mobileValue, 600);
  const router = useRouter();

  
  useEffect(() => {
  
    if (!debouncedEmail || !debouncedEmail.includes("@")) {
      setUniquenessErrors((prev) => ({ ...prev, email: "" }));
      return;
    }

    if (mode === "edit" && debouncedEmail === initialValues?.email) {
      setUniquenessErrors((prev) => ({ ...prev, email: "" }));
      return;
    }

    startChecking(async () => {
      const userId = mode === "edit" ? initialValues?.id : undefined;

      const result = await checkEmailUniqueAction(debouncedEmail, userId);

      setUniquenessErrors((prev) => ({
        ...prev,
        email: result.available ? "" : (result.message || "This email is already taken"),
      }));
    });
  }, [debouncedEmail, mode, initialValues?.email, initialValues?.id]);

 
  useEffect(() => {
    // Skip if not a complete 10-digit number
    if (!debouncedMobile || debouncedMobile.length !== 10 || !/^\d{10}$/.test(debouncedMobile)) {
      setUniquenessErrors((prev) => ({ ...prev, mobile_number: "" }));
      return;
    }

    // In edit mode: skip if value is the same as initial
    if (mode === "edit" && debouncedMobile === initialValues?.mobile_number) {
      setUniquenessErrors((prev) => ({ ...prev, mobile_number: "" }));
      return;
    }

    startChecking(async () => {
      const userId = mode === "edit" ? initialValues?.id : undefined;

      const result = await checkMobileUniqueAction(debouncedMobile, userId);

      setUniquenessErrors((prev) => ({
        ...prev,
        mobile_number: result.available ? "" : (result.message || "This mobile number is already taken"),
      }));
    });
  }, [debouncedMobile, mode, initialValues?.mobile_number, initialValues?.id]);

  const allErrors = { ...errors, ...uniquenessErrors };

 
const handleSubmit = async (values: Record<string, any>) => {
  const newErrors: Record<string, string> = {};

  if (!values.firstName?.trim()) newErrors.firstName = "First name is required";
  if (!values.lastName?.trim()) newErrors.lastName = "Last name is required";

  if (!values.mobile_number?.trim()) {
    newErrors.mobile_number = "Mobile number is required";
  } else if (!/^\d{10}$/.test(values.mobile_number)) {
    newErrors.mobile_number = "Mobile number must be exactly 10 digits";
  }

  // Also block if uniqueness errors exist
  if (uniquenessErrors.email) newErrors.email = uniquenessErrors.email;
  if (uniquenessErrors.mobile_number)
    newErrors.mobile_number = uniquenessErrors.mobile_number;

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});

  const payload = {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email?.trim() || null,
    gender: values.gender?.toLowerCase().trim() || null,
    dateOfBirth: values.dateOfBirth || null,
    mobile_number: values.mobile_number,
  };

  try {
    // ✅ ADD RIDER — SERVER ACTION
    if (mode === "add") {
      const result = await createRiderAction(payload);

  

   if (!result.success) {
  toast.error("Failed to create rider");
  return;
}

      toast.success("Rider created successfully ✅");
      onOpenChange(false);
      router.refresh();

    // ✅ EDIT RIDER — ALREADY CORRECT
    } else {
      const result = await updateRiderAction(
        String(initialValues?.id),
        payload,
      );

      if (!result.success) {
        toast.error(result.message || "Update failed");
        return;
      }

      toast.success("Rider updated successfully ✅");
      onOpenChange(false);
      router.refresh();
    }
  } catch (err: any) {
    toast.error(err?.message || "Something went wrong");
  }
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add Rider" : "Edit Rider"}</DialogTitle>
        </DialogHeader>

        <AddEditForm
          // title=""
          fields={fields}
          initialValues={initialValues}
          submitText={mode === "add" ? "Create Rider" : "Update Rider"}
          cancelText="Cancel"
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          errors={allErrors}
          onFieldChange={(name, value) => {
            if (name === "email") setEmailValue(value);
            if (name === "mobile_number") setMobileValue(value);
          }}
        />

        {isChecking && (
          <div className="mt-2 text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking availability...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}