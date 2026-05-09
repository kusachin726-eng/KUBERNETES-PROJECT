"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import AddEditForm, { FormField } from "@/components/addeditform";
import {
  createAirlineAction,
  fetchSingleAirlineAction,
  updateAirlineAction,
} from "./actions";

interface AddEditAirlineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  airlineId?: number;
}

const addFields: FormField[] = [
  {
    type: "input",
    name: "airlineName",
    label: "Airline Name",
    required: true,
  },
];

const editFields: FormField[] = [
  {
    type: "input",
    name: "airlineName",
    label: "Airline Name",
    required: true,
  },

  {
    type: "select",
    name: "isActive",
    label: "Status",
    options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ],
  },
];

export default function AddEditAirlineModal({
  open,
  onOpenChange,
  mode,
  airlineId,
}: AddEditAirlineModalProps) {
  const router = useRouter();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [initialValues, setInitialValues] = useState<Record<string, any>>({});

  useEffect(() => {
    if (mode !== "edit" || !airlineId) return;

    fetchSingleAirlineAction(airlineId).then((res) => {
      if (!res?.success || !res?.data) return;

      const fare = res.data.extraBagFares?.[0];

      setInitialValues({
        airlineName: res.data.airlineName,
        airlineLogo: res.data.airlineLogo,
        isActive: String(res.data.isActive),
        fare: fare?.additionalKgFare ?? "",
      });
    });
  }, [mode, airlineId]);

  // const handleSubmit = async (values: Record<string, any>) => {
  //   if (!values.airlineName?.trim()) {
  //     setErrors({ airlineName: "Airline name is required" });
  //     return;
  //   }

  //   setErrors({});

  //   const payload = {
  //     airlineName: values.airlineName.trim(),
  //     isActive: values.isActive === "true",
  //   };

  //   try {
  //     if (mode === "add") {
  //       await createAirlineAction({
  //         ...payload,
  //         airlineLogo: "spicejet.png",
  //       });

  //       toast.success("Airline created successfully ✅");
  //     } else {
  //       if (!airlineId) return;

  //       const result = await updateAirlineAction(airlineId, payload);

  //       if (!result.success) {
  //         toast.error(result.message || "Update failed");
  //         return;
  //       }

  //       toast.success("Airline updated successfully");
  //     }

  //     onOpenChange(false);
  //     router.refresh();
  //   } catch (err: any) {
  //     toast.error(err?.message || "Something went wrong");
  //   }
  // };
  const handleSubmit = async (values: Record<string, any>) => {
  if (!values.airlineName?.trim()) {
    setErrors({ airlineName: "Airline name is required" });
    return;
  }

  setErrors({});

  try {
    if (mode === "add") {
      await createAirlineAction({
        airlineName: values.airlineName.trim(),
        airlineLogo: "spicejet.png",
        isActive: true,
      });

      toast.success("Airline created successfully ✅");
    } else {
      if (!airlineId) return;

      const payload = {
        airlineName: values.airlineName.trim(),
        isActive: values.isActive === "true",
      };

      const result = await updateAirlineAction(airlineId, payload);

      if (!result.success) {
        toast.error(result.message || "Update failed");
        return;
      }

      toast.success("Airline updated successfully");
    }

    onOpenChange(false);
    router.refresh();
  } catch (err: any) {
    toast.error(err?.message || "Something went wrong");
  }
};

  const activeFields = mode === "add" ? addFields : editFields;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Airline" : "Edit Airline"}
          </DialogTitle>
        </DialogHeader>

        <AddEditForm
          fields={activeFields}
          initialValues={initialValues}
          submitText={mode === "add" ? "Create Airline" : "Save Changes"}
          cancelText="Cancel"
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          errors={errors}
        />
      </DialogContent>
    </Dialog>
  );
}
