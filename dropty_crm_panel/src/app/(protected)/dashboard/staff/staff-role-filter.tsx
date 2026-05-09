"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { TableDropdown } from "@/components/ui/table-dropdown";

const ROLE_OPTIONS = [
  { label: "All User Type", value: "all" },
  { label: "Admin", value: "admin" },
  { label: "Crew", value: "crew" },
  { label: "Airport Crew", value: "airport_crew" },
  { label: "Operations Manager", value: "operations_manager" },
  { label: "Customer Service", value: "customer_service" },
];

export function StaffRoleFilter({ value }: { value: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("userType");
    } else {
      params.set("userType", value);
    }

    router.push(`/dashboard/staff?${params.toString()}`);
  }

  return (
    <TableDropdown
      value={value}
      onChange={handleChange}
      options={ROLE_OPTIONS}
      placeholder="Filter by role"
    />
  );
}
