"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import AddEditForm, { FormField } from "@/components/addeditform";
import type { Customer, CustomerProfile } from "@/lib/data/customers";
import {
  createCustomerAction,
  updateCustomerAction,
  fetchSingleCustomerAction,
} from "./actions";

import { useRouter } from "next/navigation";

/* =====================
   HELPERS
===================== */

function splitName(profile?: CustomerProfile | null) {
  return {
    firstName: profile?.firstName ?? "",
    lastName: profile?.lastName ?? "",
  };
}

function formatDateForInput(date?: string | null) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  customer?: Customer | null;
}

export default function AddEditCustomerModal({
  open,
  onOpenChange,
  mode,
  customer,
}: Props) {
  const router = useRouter();

  /* =====================
     FORM FIELDS (DYNAMIC)
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
      type: "select",
      name: "gender",
      label: "Gender",
      options: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Other", value: "other" },
      ],
    },
    {
      type: "input",
      name: "dateOfBirth",
      label: "Date of Birth",
      inputType: "date",
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
      disabled: mode === "edit",
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
  ];
  const [loading, setLoading] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(
    customer ?? null,
  );
  useEffect(() => {
    if (mode !== "edit" || !customer?.id || !open) return;

    const loadCustomer = async () => {
      setLoading(true);
      const data = await fetchSingleCustomerAction(customer.id);
      setEditCustomer(data);
      setLoading(false);
    };

    loadCustomer();
  }, [mode, customer?.id, open]);

  /* =====================
     INITIAL VALUES
  ===================== */
  // const { firstName, lastName } =
  //   mode === "edit" && customer
  //     ? splitName(customer.userProfile)

  //     : { firstName: "", lastName: "" };
  const { firstName, lastName } =
    mode === "edit" && editCustomer
      ? splitName(editCustomer.userProfile)
      : { firstName: "", lastName: "" };

  /* =====================
     SUBMIT HANDLER
  ===================== */
  const handleSubmit = async (values: Record<string, any>) => {
    let result;

    if (mode === "add") {
      result = await createCustomerAction({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email || null,
        gender: values.gender || null,
        dateOfBirth: values.dateOfBirth || null,
        mobile_number: values.mobile_number.trim(),
        isActive: true,
      });
    } else {
      if (!customer) return;

      result = await updateCustomerAction(customer.id, {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email || null,
        gender: values.gender || null,
        dateOfBirth: values.dateOfBirth || null,
        isActive: customer.isActive,
      });
    }
    console.log("the customer is ", result);
    if (!result.success) {
      toast.error(result.message || "Operation failed");
      return;
    }

    toast.success(
      mode === "add"
        ? "Customer added successfully ✅"
        : "Customer updated successfully ✅",
    );

    onOpenChange(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Customer" : "Edit Customer"}
          </DialogTitle>
        </DialogHeader>

        <AddEditForm
          key={mode === "edit" ? customer?.id : "add"}
          fields={fields}
          // initialValues={{
          //   firstName,
          //   lastName,
          //   gender: customer?.userProfile?.gender ?? "",
          //   dateOfBirth: formatDateForInput(customer?.userProfile?.dateOfBirth),
          //   email: customer?.email ?? "",
          //   mobile_number: customer?.mobile_number ?? "",
          // }}
          initialValues={{
            firstName,
            lastName,
            gender: editCustomer?.userProfile?.gender ?? "",
            dateOfBirth: formatDateForInput(
              editCustomer?.userProfile?.dateOfBirth,
            ),
            email: editCustomer?.email ?? "",
            mobile_number: editCustomer?.mobile_number ?? "",
          }}
          submitText={mode === "add" ? "Add Customer" : "Update Customer"}
          cancelText="Cancel"
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
