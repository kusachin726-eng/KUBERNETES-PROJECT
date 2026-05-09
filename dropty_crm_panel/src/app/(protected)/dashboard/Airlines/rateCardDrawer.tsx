// "use client";



// import { Drawer } from "@/components/ui/drawer";
// import type { Airline } from "@/lib/data/airlines";

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   airline: Airline | null;
// };

// export function RateCardDrawer({ open, onClose, airline }: Props) {
//   if (!airline) return null;

//   return (
//     <Drawer
//       open={open}
//       onClose={onClose}
//       title="Rate Cards"
//       subtitle={`${airline.name} (${airline.code})`}
//       width="lg"
//     >
//       {/* Add Rate Card button */}
//       <div className="mb-4 flex justify-end">
//         <button className="rounded-lg bg-blue-600 px-3 py-2 text-xs text-white hover:bg-blue-700">
//           + Add Rate Card
//         </button>
//       </div>

//       {/* Placeholder (next step: rate card table) */}
//       <div className="rounded-lg border p-4 text-sm text-gray-500">
//         Rate cards for <b>{airline.name}</b> will be listed here.
//       </div>
//     </Drawer>
//   );
// }
"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import AddEditForm, { FormField } from "@/components/addeditform";
import { toast } from "sonner";

import type { Airline } from "@/lib/data/airlines";

/* =====================
   TYPES
===================== */
type Props = {
  open: boolean;
  onClose: () => void;
  airline: Airline | null;
};

/* =====================
   FORM FIELDS
===================== */
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

export function RateCardDrawer({ open, onClose, airline }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!airline) return null;

  /* =====================
     SUBMIT HANDLER (MOCK)
  ===================== */
  const handleAddFare = (values: Record<string, any>) => {
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

    const payload = {
      airlineId: airline.id,
      flightType: values.flightType,
      baggageType: values.baggageType,
      additionalKg: Number(values.additionalKg),
      additionalKgFare: Number(values.additionalKgFare),
    };

    // 🔹 MOCK ONLY (NO API YET)
    console.log("Add Rate Card Payload:", payload);

    toast.success("Rate card added (mock) ✅");
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Rate Cards"
      // subtitle={airline.airlineName}
      width="lg"
    >
      {/* Existing Rate Cards (placeholder for now) */}
      <div className="mb-6 rounded-lg border p-4 text-sm text-gray-500">
        {/* Rate cards for <b>{airline.airlineName}</b> will be listed here. */}
      </div>

      {/* Add Rate Card Form */}
      <div className="rounded-lg border bg-gray-50 p-4">
        <h3 className="mb-3 text-sm font-semibold">Add Rate Card</h3>

        <AddEditForm
          fields={fareFields}
          submitText="Add Rate Card"
          cancelText="Close"
          onSubmit={handleAddFare}
          onCancel={onClose}
          errors={errors}
        />
      </div>
    </Drawer>
  );
}
