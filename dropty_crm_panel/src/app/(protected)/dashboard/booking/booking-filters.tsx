"use client";

import {
  TableDropdown,
  type DropdownOption,
} from "@/components/ui/table-dropdown";

interface BookingFiltersProps {
  status: string;
  setStatus: (value: string) => void;
}

/* =====================
   DROPDOWN OPTIONS
===================== */

const statusOptions: DropdownOption[] = [
  { label: "All Status", value: "all" },
  { label: "Requested", value: "REQUESTED" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function BookingFilters({
  status,
  setStatus,
}: BookingFiltersProps) {
  return (
    <TableDropdown
      value={status}
      onChange={setStatus}
      options={statusOptions}
      placeholder="All Status"
      width="w-[160px]"
    />
  );
}
