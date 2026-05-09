"use client";

import { useState, useTransition } from "react";
import Toggle from "@/components/ui/toggle";
import { updateCustomerStatusAction } from "../actions";

export default function CustomerStatusToggle({
  customerId,
  isActive: initialActive,
}: {
  customerId: number;
  isActive: boolean;
}) {
  const [isActive, setIsActive] = useState(initialActive);
  const [isPending, startTransition] = useTransition();

  return (
    <Toggle
      value={isActive}
      disabled={isPending}
      onChange={(next) => {
        setIsActive(next);

        startTransition(async () => {
          const res = await updateCustomerStatusAction(
            customerId,
            next
          );

          if (!res.success) {
            setIsActive((prev) => !prev);
          }
        });
      }}
    />
  );
}


