



"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import { AirlineApi } from "@/lib/api/airlines";
import {
  addExtraBagFareAction,
  updateExtraBagFareAction,
  deleteExtraBagFareAction,
} from "./actions";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ui/confirmationmodal";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pencil, Trash2, Check, X } from "lucide-react";

/* =====================
   TYPES
===================== */
type BaggageType = "weight" | "bag";

type ExtraBagFare = {
  id: number;
  airlineId: number;
  flightType: "domestic" | "international";
  baggageType: BaggageType;
  additionalKg: string;
  additionalKgFare: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  airline: AirlineApi | null;
};

export default function ViewRateCardDrawer({
  open,
  onClose,
  airline,
}: Props) {
  if (!airline) return null;

  /* =====================
     STATE
  ===================== */
  const [extraBagFares, setExtraBagFares] = useState<ExtraBagFare[]>(
    Array.isArray(airline.extraBagFares)
      ? (airline.extraBagFares as ExtraBagFare[])
      : [],
  );

  const [showAddFare, setShowAddFare] = useState(false);
  const [editingFareId, setEditingFareId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState("");

  const [deleteFareId, setDeleteFareId] = useState<number | null>(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const [newFare, setNewFare] = useState<{
    flightType: "domestic" | "international";
    baggageType: BaggageType;
    additionalKg: string;
    additionalKgFare: string;
  }>({
    flightType: "domestic",
    baggageType: "weight",
    additionalKg: "",
    additionalKgFare: "",
  });

  const router = useRouter();

  /* =====================
     GROUP BY FLIGHT TYPE
  ===================== */
  const faresByFlightType = extraBagFares.reduce(
    (acc, fare) => {
      acc[fare.flightType].push(fare);
      return acc;
    },
    {
      domestic: [] as ExtraBagFare[],
      international: [] as ExtraBagFare[],
    },
  );

  /* =====================
     ADD FARE
  ===================== */
  const handleAddFare = async () => {
    if (!newFare.additionalKg || !newFare.additionalKgFare) {
      toast.error("Please fill all fields");
      return;
    }

    const payload = {
      flightType: newFare.flightType,
      baggageType: newFare.baggageType, // ✅ bag | weight
      additionalKg: Number(newFare.additionalKg),
      additionalKgFare: Number(newFare.additionalKgFare),
    };

    console.log("🚀 ADD EXTRA FARE PAYLOAD:", payload);

    const res = await addExtraBagFareAction(airline.id, payload);

    if (!res?.success || !res.data) {
      toast.error(res?.message || "Failed to add fare");
      return;
    }

    const newFareItem: ExtraBagFare = {
      id: res.data.id,
      airlineId: res.data.airlineId,
      flightType: res.data.flightType,
      baggageType: res.data.baggageType, // ✅ bag
      additionalKg: res.data.additionalKg,
      additionalKgFare: res.data.additionalKgFare,
    };

    setExtraBagFares((prev) => [...prev, newFareItem]);

    toast.success("Fare added successfully ✅");

    setShowAddFare(false);
    setNewFare({
      flightType: "domestic",
      baggageType: "weight",
      additionalKg: "",
      additionalKgFare: "",
    });

    router.refresh();
  };

  /* =====================
     UPDATE FARE
  ===================== */
  const handleSaveEdit = async (fareId: number) => {
    const price = Number(editPrice);

    if (!price || price <= 0) {
      toast.error("Enter a valid fare amount");
      return;
    }

    const res = await updateExtraBagFareAction(fareId, price);

    if (!res.success) {
      toast.error(res.message || "Update failed");
      return;
    }

    setExtraBagFares((prev) =>
      prev.map((fare) =>
        fare.id === fareId
          ? { ...fare, additionalKgFare: String(price) }
          : fare,
      ),
    );

    setEditingFareId(null);
    setEditPrice("");
    toast.success("Fare updated successfully ✅");
  };

  /* =====================
     DELETE FARE
  ===================== */
  const handleDeleteFare = async () => {
    if (!deleteFareId) return;

    const res = await deleteExtraBagFareAction(deleteFareId);

    if (!res.success) {
      toast.error(res.message || "Delete failed");
      return;
    }

    setExtraBagFares((prev) =>
      prev.filter((fare) => fare.id !== deleteFareId),
    );

    toast.success("Fare deleted successfully 🗑️");
    setDeleteFareId(null);
    setOpenDeleteConfirm(false);

    router.refresh();
  };

  /* =====================
     RENDER
  ===================== */
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Rate Card"
      subtitle={airline.airlineName}
      width="lg"
    >
      <ConfirmModal
        open={openDeleteConfirm}
        onOpenChange={setOpenDeleteConfirm}
        title="Delete Fare"
        description="Are you sure you want to delete this fare?"
        confirmText="Delete"
        onConfirm={handleDeleteFare}
      />

      <div className="space-y-4">
        {/* {(["domestic", "international"] as const).map(
          (type) =>
            faresByFlightType[type].length > 0 && (
              <section key={type} className="rounded-lg border bg-white">
                <div className="border-b px-4 py-2 text-sm font-semibold">
                  {type === "international" ? "🌍 International" : "🏠 Domestic"}
                </div>

                <div className="divide-y">
                  {faresByFlightType[type].map((fare) => (
                    <FareRow
                      key={fare.id}
                      fare={fare}
                      editingFareId={editingFareId}
                      editPrice={editPrice}
                      setEditPrice={setEditPrice}
                      onEdit={() => {
                        setEditingFareId(fare.id);
                        setEditPrice(fare.additionalKgFare);
                      }}
                      onCancel={() => setEditingFareId(null)}
                      onSave={() => handleSaveEdit(fare.id)}
                      onDelete={() => {
                        setDeleteFareId(fare.id);
                        setOpenDeleteConfirm(true);
                      }}
                    />
                  ))}
                </div>
              </section>
            ),
        )} */}
        {/* =====================
    DOMESTIC ONLY
===================== */}
{faresByFlightType.domestic.length > 0 && (
  <section className="rounded-lg border bg-white">
    <div className="border-b px-4 py-2 text-sm font-semibold">
      🏠 Domestic
    </div>

    <div className="divide-y">
      {faresByFlightType.domestic.map((fare) => (
        <FareRow
          key={fare.id}
          fare={fare}
          editingFareId={editingFareId}
          editPrice={editPrice}
          setEditPrice={setEditPrice}
          onEdit={() => {
            setEditingFareId(fare.id);
            setEditPrice(fare.additionalKgFare);
          }}
          onCancel={() => setEditingFareId(null)}
          onSave={() => handleSaveEdit(fare.id)}
          onDelete={() => {
            setDeleteFareId(fare.id);
            setOpenDeleteConfirm(true);
          }}
        />
      ))}
    </div>
  </section>
)}


        {/* ADD FARE */}
        <section className="rounded-lg border bg-white">
          {!showAddFare ? (
            <button
              onClick={() => setShowAddFare(true)}
              className="w-full px-4 py-3 text-left text-sm font-medium text-blue-600 hover:bg-blue-50"
            >
              ➕ Add Fare
            </button>
          ) : (
            <div className="bg-gray-50 p-4">
              <div className="grid grid-cols-2 gap-3">
                <Select
                  value={newFare.flightType}
                  onValueChange={(v) =>
                    setNewFare((s) => ({
                      ...s,
                      flightType: v as "domestic",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Flight Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="domestic">Domestic</SelectItem>
                    {/* <SelectItem value="international">
                      International
                    </SelectItem> */}
                  </SelectContent>
                </Select>

                <Select
                  value={newFare.baggageType}
                  onValueChange={(v) =>
                    setNewFare((s) => ({
                      ...s,
                      baggageType: v as BaggageType,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Baggage Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight">Weight</SelectItem>
                    <SelectItem value="bag">Bag</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder={
                    newFare.baggageType === "weight"
                      ? "Additional KG"
                      : "No. of Bags"
                  }
                  value={newFare.additionalKg}
                  onChange={(e) =>
                    setNewFare((s) => ({
                      ...s,
                      additionalKg: e.target.value,
                    }))
                  }
                />

                <Input
                  placeholder={
                    newFare.baggageType === "weight"
                      ? "Fare ₹ / KG"
                      : "Fare ₹ / Bag"
                  }
                  value={newFare.additionalKgFare}
                  onChange={(e) =>
                    setNewFare((s) => ({
                      ...s,
                      additionalKgFare: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="mt-3 flex justify-end gap-2">
                <button
                  onClick={() => setShowAddFare(false)}
                  className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFare}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Fare
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </Drawer>
  );
}

/* =====================
   FARE ROW
===================== */
function FareRow({
  fare,
  editingFareId,
  editPrice,
  setEditPrice,
  onEdit,
  onCancel,
  onSave,
  onDelete,
}: any) {
  return (
    <div className="flex items-center justify-between px-4 py-2 text-sm">
      <span className="text-gray-700">
        {fare.baggageType === "weight" ? (
          <>
            {fare.additionalKg} kg
            <span className="text-xs text-gray-400"> (weight)</span>
          </>
        ) : (
          <>
            1 Bag
            {/* <span className="text-xs text-gray-400">
              (max {fare.additionalKg} kg)
            </span> */}
          </>
        )}
      </span>

      <div className="flex items-center gap-2">
        {editingFareId === fare.id ? (
          <>
            <Input
              className="h-7 w-24 text-sm"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
            />
            <Check
              className="h-4 w-4 cursor-pointer text-green-600"
              onClick={onSave}
            />
            <X
              className="h-4 w-4 cursor-pointer text-gray-500"
              onClick={onCancel}
            />
          </>
        ) : (
          <>
            <span className="font-medium">₹{fare.additionalKgFare}</span>
            <Pencil
              className="h-4 w-4 cursor-pointer text-blue-600"
              onClick={onEdit}
            />
            <Trash2
              className="h-4 w-4 cursor-pointer text-red-500 hover:text-red-600"
              onClick={onDelete}
            />
          </>
        )}
      </div>
    </div>
  );
}

