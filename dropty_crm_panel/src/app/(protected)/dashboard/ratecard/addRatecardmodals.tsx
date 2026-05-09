"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddEditForm, { FormField } from "@/components/addeditform";
import { toast } from "sonner";

interface AddEditRateCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
}

const rateCardFields: FormField[] = [
  {
    type: "input",
    name: "distanceFrom",
    label: "Distance From (km)",
//     inputProps: { type: "number", min: 0 },
  },
  {
    type: "input",
    name: "distanceTo",
    label: "Distance To (km)",
//     inputProps: { type: "number", min: 0 },
  },
  {
    type: "input",
    name: "standardPrice",
    label: "Standard Price",
//     inputProps: { type: "number", min: 0 },
  },
  {
    type: "input",
    name: "expressPrice",
    label: "Express Price",
//     inputProps: { type: "number", min: 0 },
  },
];


function PricingInfoBanner() {
  return (
    <div className="rounded-lg bg-yellow-400 p-4 text-black">
      <h3 className="mb-2 text-lg font-semibold">
        Base Pricing Model (Distance-Based)
      </h3>

      <p className="mb-3 text-sm">
        A flat-fee model for shorter distances and a distance-based pricing
        model beyond a certain range.
      </p>

      <div className="space-y-1 text-sm">
        <p>
          <span className="font-semibold">1: Standard Service:</span>{" "}
          Pickup within 5–24 hours before flight.
        </p>
        <p>
          <span className="font-semibold">2: Express Service:</span>{" "}
          Pickup within 5 hours before flight.
        </p>
      </div>
    </div>
  );
}

export default function AddEditRateCardModal({
  open,
  onOpenChange,
  mode,
  initialValues,
  onSubmit,
}: AddEditRateCardModalProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) setErrors({});
  }, [open]);

  const handleSubmit = async (values: Record<string, any>) => {
    const newErrors: Record<string, string> = {};

    if (values.distanceFrom === "" || values.distanceFrom < 0) {
      newErrors.distanceFrom = "Enter valid distance";
    }

    if (
      values.distanceTo === "" ||
      values.distanceTo <= values.distanceFrom
    ) {
      newErrors.distanceTo =
        "Distance To must be greater than Distance From";
    }

    if (!values.standardPrice || values.standardPrice <= 0) {
      newErrors.standardPrice = "Enter valid standard price";
    }

    if (!values.expressPrice || values.expressPrice <= 0) {
      newErrors.expressPrice = "Enter valid express price";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(values);

    toast.success(
      mode === "add"
        ? "Rate card added successfully"
        : "Rate card updated successfully",
    );

    onOpenChange(false);
  };

  return (

    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-xl"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Rate Card" : "Edit Rate Card"}
          </DialogTitle>
        </DialogHeader>

        <AddEditForm
          fields={rateCardFields}
          errors={errors}
          initialValues={initialValues}
          submitText={mode === "add" ? "Add Rate Card" : "Update Rate Card"}
          cancelText="Cancel"
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );

// return (
//   <Dialog open={open} onOpenChange={onOpenChange}>
//     <DialogContent
//       className="max-w-xl space-y-4"
//       onInteractOutside={(e) => e.preventDefault()}
//       onEscapeKeyDown={(e) => e.preventDefault()}
//     >
//       <DialogHeader>
//         <DialogTitle>
//           {mode === "add" ? "Add Rate Card" : "Edit Rate Card"}
//         </DialogTitle>
//       </DialogHeader>

//       {/* ✅ SHOW ONLY WHEN ADDING */}
//       {mode === "add" && <PricingInfoBanner />}

//       <AddEditForm
//         fields={rateCardFields}
//         errors={errors}
//         initialValues={initialValues}
//         submitText={mode === "add" ? "Add Rate Card" : "Update Rate Card"}
//         cancelText="Cancel"
//         onSubmit={handleSubmit}
//         onCancel={() => onOpenChange(false)}
//       />
//     </DialogContent>
//   </Dialog>
// );
}
