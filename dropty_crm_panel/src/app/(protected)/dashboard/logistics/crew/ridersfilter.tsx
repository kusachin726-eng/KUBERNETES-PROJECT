
"use client";


import { TableDropdown ,type DropdownOption } from "@/components/ui/table-dropdown";

interface RiderFiltersProps {
  city: string;
  setCity: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;

  fromDate: string;
  setFromDate: (value: string) => void;

  toDate: string;
  setToDate: (value: string) => void;
}

/* =====================
   DROPDOWN OPTIONS
===================== */
const cityOptions: DropdownOption[] = [
  { label: "All Cities", value: "all" },
  { label: "Delhi", value: "Delhi" },
  { label: "Mumbai", value: "Mumbai" },
  { label: "Bangalore", value: "Bangalore" },
];

const statusOptions: DropdownOption[] = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export default function RiderFilters({
  city,
  setCity,
  status,
  setStatus,
}: RiderFiltersProps) {
  return (
    <>
      {/* <TableDropdown
        value={city}
        onChange={setCity}
        options={cityOptions}
        placeholder="All Cities"
        width="w-[160px]"
      /> */}

      <TableDropdown
        value={status}
        onChange={setStatus}
        options={statusOptions}
        placeholder="All Status"
        width="w-[160px]"
      />
    </>
  );
}
