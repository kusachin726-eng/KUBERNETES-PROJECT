"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { addExtraBagFareAction } from "./actions";
import AddEditForm, { FormField } from "@/components/addeditform";
interface AddAirlineFareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  airlineId: number | null;
  airlineName?: string;
}
const fareFields: FormField[] = [
  {
    type: "select",
    name: "flightType",
    label: "Flight Type",
    required: true,
    options: [
      { label: "Domestic", value: "domestic" },
      { label: "International", value: "international" },
    ],
  },
  {
    type: "select",
    name: "baggageType",
    label: "Baggage Type",
    required: true,
    options: [
      { label: "Weight", value: "weight" },
      { label: "Piece", value: "piece" },
    ],
  },
  {
    type: "input",
    name: "additionalKg",
    label: "Additional KG",
    required: true,
  },
  {
    type: "input",
    name: "additionalKgFare",
    label: "Fare (₹)",
    required: true,
  },
];

export default function AddAirlineFareModal({
  open,
  onOpenChange,
  airlineId,
  airlineName,
}: AddAirlineFareModalProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (values: Record<string, any>) => {
    if (!airlineId) {
      toast.error("Airline not selected");
      return;
    }

    if (
      !values.flightType ||
      !values.baggageType ||
      !values.additionalKg ||
      !values.additionalKgFare
    ) {
      setErrors({
        flightType: "Required",
        baggageType: "Required",
        additionalKg: "Required",
        additionalKgFare: "Required",
      });
      return;
    }

    setErrors({});

    try {
      const result = await addExtraBagFareAction(airlineId, {
        flightType: values.flightType,
        baggageType: values.baggageType,
        additionalKg: Number(values.additionalKg),
        additionalKgFare: Number(values.additionalKgFare),
      });

      if (!result.success) {
        toast.error(result.message || "Failed to add fare");
        return;
      }

      toast.success("Fare added successfully");

      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Add Fare {airlineName ? `– ${airlineName}` : ""}
          </DialogTitle>
        </DialogHeader>

        <AddEditForm
          fields={fareFields}
          submitText="Add Fare"
          cancelText="Cancel"
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          errors={errors}
        />
      </DialogContent>
    </Dialog>
  );
}
