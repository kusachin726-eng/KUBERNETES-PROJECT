"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";

type Role = {
  title: string;
  permissions: string[];
};

type Props = {
  open: boolean;
  mode: "view" | "edit";
  role: Role | null;
  onClose: () => void;
  onSave?: (updatedPermissions: string[]) => void;
};

const ALL_PERMISSIONS = [
  "View services",
  "Create services",
  "Edit services",
  "Delete services",
  "View bookings",
  "Manage bookings",
  "Manage users",
];

export default function RoleModal({
  open,
  mode,
  role,
  onClose,
  onSave,
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (role) {
      setSelected(role.permissions);
    }
  }, [role]);

  if (!open || !role) return null;

  const togglePermission = (permission: string) => {
    if (mode === "view") return;

    setSelected((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay + Blur */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">
            {mode === "view" ? "View Role" : "Edit Role"} — {role.title}
          </h2>
          <button onClick={onClose} className="text-xl">
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          {ALL_PERMISSIONS.map((permission) => (
            <label key={permission} className="flex gap-2">
              <input
                type="checkbox"
                checked={selected.includes(permission)}
                disabled={mode === "view"}
                onChange={() => togglePermission(permission)}
              />
              {permission}
            </label>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t px-4 py-3">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>

          {mode === "edit" && (
            <Button
              onClick={() => {
                onSave?.(selected);
                onClose();
              }}
            >
              Save Changes
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
