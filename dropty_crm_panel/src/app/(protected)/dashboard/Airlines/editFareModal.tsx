"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddEditForm, { FormField } from "@/components/addeditform";
import { toast } from "sonner";
import { updateExtraBagFareServer } from "@/lib/api/airlines";
import { useEffect, useState } from "react";
import { updateExtraBagFareAction } from "./actions";

interface EditExtraFareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fare: {
    id: number;
    flightType: string;
    baggageType: string;
    additionalKg: string;
    additionalKgFare: string;
  } | null;
}

const fields: FormField[] = [
  {
    type: "input",
    name: "additionalKgFare",
    label: "Price (₹)",
    inputType: "number",
    required: true,
  },
];

export default function EditExtraFareModal({
  open,
  onOpenChange,
  fare,
}: EditExtraFareModalProps) {
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    if (!fare) return;

    setInitialValues({
      additionalKgFare: fare.additionalKgFare,
    });
  }, [fare]);

const handleSubmit = async (values: Record<string, any>) => {
  if (!fare) return;

  const price = Number(values.additionalKgFare);
  if (price <= 0) {
    toast.error("Price must be greater than 0");
    return;
  }

  const result = await updateExtraBagFareAction(fare.id, price);

  if (!result.success) {
    toast.error(result.message || "Update failed");
    return;
  }

  toast.success("Fare updated successfully ✅");
  onOpenChange(false);
};


  if (!fare) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Fare</DialogTitle>
        </DialogHeader>

        {/* READ-ONLY INFO */}
        <div className="px-4 text-sm text-zinc-600 space-y-1">
          <p><b>Flight:</b> {fare.flightType}</p>
          <p><b>Baggage:</b> {fare.baggageType}</p>
          <p><b>Weight:</b> {fare.additionalKg} kg</p>
        </div>

        <AddEditForm
          fields={fields}
          initialValues={initialValues}
          submitText="Update Price"
          cancelText="Cancel"
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
