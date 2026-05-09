"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

export function LogoutButton({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Button
      variant="ghost"
      type="button"
      className={className}
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      {children ?? "Logout"}
    </Button>
  );
}
