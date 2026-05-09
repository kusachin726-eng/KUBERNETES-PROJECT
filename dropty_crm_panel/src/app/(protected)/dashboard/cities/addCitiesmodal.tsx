"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Toggle from "@/components/ui/toggle";
import { toggleCityStatusAction } from "./action";
import { toast } from "sonner";
import { Plus, X, ChevronDown } from "lucide-react";

interface AddEditCitiesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => Promise<any>;
}

const DEFAULT_COUNTRY_CODE = "IN";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

// State code mapping for auto-fill
const STATE_CODES: Record<string, string> = {
  "Andhra Pradesh": "AP",
  "Arunachal Pradesh": "AR",
  "Assam": "AS",
  "Bihar": "BR",
  "Chhattisgarh": "CG",
  "Goa": "GA",
  "Gujarat": "GJ",
  "Haryana": "HR",
  "Himachal Pradesh": "HP",
  "Jharkhand": "JH",
  "Karnataka": "KA",
  "Kerala": "KL",
  "Madhya Pradesh": "MP",
  "Maharashtra": "MH",
  "Manipur": "MN",
  "Meghalaya": "ML",
  "Mizoram": "MZ",
  "Nagaland": "NL",
  "Odisha": "OR",
  "Punjab": "PB",
  "Rajasthan": "RJ",
  "Sikkim": "SK",
  "Tamil Nadu": "TN",
  "Telangana": "TS",
  "Tripura": "TR",
  "Uttar Pradesh": "UP",
  "Uttarakhand": "UK",
  "West Bengal": "WB",
};

const isValidState = (v: string) =>
  INDIAN_STATES.some((s) => s.toLowerCase() === v.trim().toLowerCase());

const isValidCity = (v: string) => /^[a-zA-Z\s]{3,}$/.test(v.trim());

const isValidStateCode = (v: string) => /^[A-Z]{2}$/.test(v.trim());

const isValidPincode = (v: string) => /^\d{6}$/.test(v.trim());

export default function AddEditCitiesModal({
  open,
  onOpenChange,
  mode,
  initialValues,
  onSubmit,
}: AddEditCitiesModalProps) {
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pincodes, setPincodes] = useState<string[]>([]);
  const [pendingPincode, setPendingPincode] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [city, setCity] = useState("");
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [stateSearch, setStateSearch] = useState("");

  useEffect(() => {
    if (!open) return;

    setErrors({});
    setPendingPincode("");
    setStateSearch("");

    if (mode === "edit") {
      setIsActive(
        typeof initialValues?.isActive === "boolean"
          ? initialValues.isActive
          : initialValues?.status === "active",
      );
      setPincodes(initialValues?.pincode ?? []);
      setSelectedState(initialValues?.state ?? "");
      setStateCode(initialValues?.stateCode ?? "");
      setCity(initialValues?.city ?? "");
    } else {
      setIsActive(true);
      setPincodes([]);
      setSelectedState("");
      setStateCode("");
      setCity("");
    }
  }, [open, mode, initialValues]);

  const handleStatusToggle = async (next: boolean) => {
    setIsActive(next);

    if (!initialValues?.id) return;

    const res = await toggleCityStatusAction(initialValues.id);

    if (!res?.success) {
      setIsActive(!next);
      toast.error(res?.message || "Failed to update status");
    }
  };

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    setStateCode(STATE_CODES[state] || "");
    setStateSearch("");
    setIsStateDropdownOpen(false);
  };

  const addPincode = () => {
    const pin = pendingPincode.trim();
    if (!isValidPincode(pin)) return;
    if (pincodes.includes(pin)) return;

    setPincodes([...pincodes, pin]);
    setPendingPincode("");
  };

  const removePincode = (pin: string) => {
    setPincodes(pincodes.filter((p) => p !== pin));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalPincodes = [...pincodes];

    if (pendingPincode.trim()) {
      const pin = pendingPincode.trim();

      if (!isValidPincode(pin)) {
        setErrors({ pincode: "Pincode must be exactly 6 digits" });
        return;
      }

      if (!finalPincodes.includes(pin)) {
        finalPincodes.push(pin);
      }
    }

    const newErrors: Record<string, string> = {};

    if (!selectedState || !isValidState(selectedState))
      newErrors.state = "Please select a valid Indian state";

    if (!city || !isValidCity(city))
      newErrors.city = "City name must be at least 3 characters (letters only)";

    if (!stateCode || !isValidStateCode(stateCode))
      newErrors.stateCode = "State code is required";

    if (finalPincodes.length === 0)
      newErrors.pincode = "At least one pincode is required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      city,
      state: selectedState,
      stateCode: stateCode.toUpperCase(),
      countryCode: DEFAULT_COUNTRY_CODE,
      pincode: finalPincodes,
      isActive,
    };

    const res = await onSubmit(payload);

    if (res?.success === false) {
      setErrors({ city: res.message || "Something went wrong" });
      return;
    }
  };

  const filteredStates = INDIAN_STATES.filter((state) =>
    state.toLowerCase().includes(stateSearch.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0">
        {/* Header with visible color */}
        <DialogHeader className="bg-primary px-6 py-4 rounded-t-lg">
          <DialogTitle className="text-xl font-bold text-white">
            {mode === "add" ? "Add New City" : "Edit City"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {/* City Name - Floating Label */}
          <div className="relative">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder=" "
              className={`peer w-full h-12 px-4 rounded-lg border ${
                errors.city ? "border-red-500" : "border-zinc-300"
              } focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
            />
            <label
              className={`absolute left-4 bg-white px-1 text-zinc-400 transition-all pointer-events-none
                peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-primary
                ${city ? "top-0 -translate-y-1/2 text-xs" : "top-1/2 -translate-y-1/2 text-sm"}
              `}
            >
              City <span className="text-red-500">*</span>
            </label>
            {errors.city && (
              <p className="text-xs text-red-600 mt-1">{errors.city}</p>
            )}
          </div>

          {/* State Dropdown - Floating Label */}
          <div className="relative">
            <input
              type="text"
              value={stateSearch || selectedState}
              onChange={(e) => {
                setStateSearch(e.target.value);
                setIsStateDropdownOpen(true);
              }}
              onFocus={() => setIsStateDropdownOpen(true)}
              placeholder=" "
              className={`peer w-full h-12 px-4 pr-10 rounded-lg border ${
                errors.state ? "border-red-500" : "border-zinc-300"
              } focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
            />
            <label
              className={`absolute left-4 bg-white px-1 text-zinc-400 transition-all pointer-events-none
                peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-primary
                ${stateSearch || selectedState ? "top-0 -translate-y-1/2 text-xs" : "top-1/2 -translate-y-1/2 text-sm"}
              `}
            >
              State <span className="text-red-500">*</span>
            </label>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
            
            {errors.state && (
              <p className="text-xs text-red-600 mt-1">{errors.state}</p>
            )}

            {isStateDropdownOpen && filteredStates.length > 0 && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => {
                    setIsStateDropdownOpen(false);
                    setStateSearch("");
                  }}
                />
                <div className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-zinc-200 bg-white shadow-xl">
                  {filteredStates.map((state) => (
                    <div
                      key={state}
                      onClick={() => handleStateSelect(state)}
                      className={`cursor-pointer px-4 py-3 text-sm hover:bg-primary/10 transition-colors ${
                        selectedState === state
                          ? "bg-primary/5 text-primary font-semibold"
                          : "text-zinc-900"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{state}</span>
                        <span className="text-xs font-medium text-zinc-500">
                          {STATE_CODES[state]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* State Code - Floating Label (Auto-filled) */}
          <div className="relative">
            <input
              type="text"
              value={stateCode}
              readOnly
              placeholder=" "
              className="peer w-full h-12 px-4 rounded-lg border border-zinc-300 bg-zinc-50 cursor-not-allowed text-zinc-600 font-medium"
            />
            <label
              className={`absolute left-4 bg-zinc-50 px-1 text-zinc-400 transition-all pointer-events-none
                ${stateCode ? "top-0 -translate-y-1/2 text-xs" : "top-1/2 -translate-y-1/2 text-sm"}
              `}
            >
              State Code <span className="text-xs text-zinc-500">(Auto-filled)</span>
            </label>
          </div>

          {/* Pincode - Floating Label */}
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={pendingPincode}
                  onChange={(e) => setPendingPincode(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPincode();
                    }
                  }}
                  maxLength={6}
                  placeholder=" "
                  className={`peer w-full h-12 px-4 rounded-lg border ${
                    errors.pincode ? "border-red-500" : "border-zinc-300"
                  } focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                />
                <label
                  className={`absolute left-4 bg-white px-1 text-zinc-400 transition-all pointer-events-none
                    peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-primary
                    ${pendingPincode ? "top-0 -translate-y-1/2 text-xs" : "top-1/2 -translate-y-1/2 text-sm"}
                  `}
                >
                  Pincode <span className="text-red-500">*</span>
                </label>
              </div>
              <Button
                type="button"
                onClick={addPincode}
                disabled={!pendingPincode || pendingPincode.length !== 6}
                className="h-12 px-5 rounded-lg"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {errors.pincode && (
              <p className="text-xs text-red-600 mt-1">{errors.pincode}</p>
            )}

            {pincodes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {pincodes.map((pin) => (
                  <span
                    key={pin}
                    className="flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/30 px-3 py-2 text-sm font-semibold text-primary"
                  >
                    {pin}
                    <X
                      className="h-4 w-4 cursor-pointer hover:text-primary/70 transition-colors"
                      onClick={() => removePincode(pin)}
                    />
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Status Toggle (Edit Mode Only) */}
          {mode === "edit" && (
            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg border border-zinc-200">
              <label className="text-sm font-semibold text-zinc-700">
                Status
              </label>
              <Toggle
                value={isActive}
                onChange={handleStatusToggle}
                activeLabel="Active"
                inactiveLabel="Inactive"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="h-11 px-6 border border-zinc-300 hover:bg-zinc-50"
            >
              Cancel
            </Button>
            <Button type="submit" className="h-11 px-8 font-semibold">
              {mode === "add" ? "Add City" : "Update City"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}