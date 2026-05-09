"use client";

import { useState, useTransition } from "react";
import Toggle from "@/components/ui/toggle";
import { updateRiderStatusAction } from "../actions";

export default function RiderStatusToggle({
  riderId,
  isActive: initialActive,
}: {
  riderId: number;
  isActive: boolean;
}) {
  const [isActive, setIsActive] = useState(initialActive); // ✅ LOCAL STATE
  const [isPending, startTransition] = useTransition();

  return (
    <Toggle
      value={isActive}
      disabled={isPending}
      onChange={(next) => {
        // ✅ OPTIMISTIC UPDATE (instant UI change)
        setIsActive(next);

        startTransition(async () => {
          const res = await updateRiderStatusAction(riderId, next);

          //  rollback if API fails
          if (!res?.success) {
            setIsActive((prev) => !prev);
          }
        });
      }}
    />
  );
}
