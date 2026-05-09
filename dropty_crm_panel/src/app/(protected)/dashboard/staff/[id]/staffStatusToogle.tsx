"use client";

import { useState, useTransition } from "react";
import Toggle from "@/components/ui/toggle";
import { updateStaffStatusAction } from "../actions";

export default function StaffStatusToggle({
  staffId,
  isActive: initialActive,
}: {
  staffId: number;
  isActive: boolean;
}) {
  const [isActive, setIsActive] = useState(initialActive); // ✅ LOCAL STATE
  const [isPending, startTransition] = useTransition();

  return (
    <Toggle
      value={isActive}
      disabled={isPending}
      onChange={(next) => {
        // ✅ OPTIMISTIC UPDATE (instant UI)
        setIsActive(next);

        startTransition(async () => {
          const res = await updateStaffStatusAction(staffId, next);

          // rollback if API fails
          if (!res?.success) {
            setIsActive((prev) => !prev);
          }
        });
      }}
    />
  );
}
