"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import RolesPermissionsGrid from "./roles-permissions-grid";
import type { RolePermission } from "@/lib/data/role-permission";
import { useEffect } from "react";

import { Search } from "lucide-react";
import { PermissionMap } from "@/lib/permissions/types";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

type PermissionAction = "view" | "add" | "modify" | "delete";

export type PermissionRow = {
  featureId: number; // ✅ REQUIRED
  module: string;
  permissions: {
    view: boolean;
    add: boolean;
    modify: boolean;
    delete: boolean;
  };
};

export type Role = {
  roleId: number; // ✅ REQUIRED
  title: string;
  permissions: PermissionRow[];
};

/* ================= COMPONENT ================= */

export default function RolesPermissionsFilters({
  roles,
  setRoles,
  permissions,
}: {
  roles: Role[];
  // roles: RolePermission[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  permissions: PermissionMap;
}) {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const router = useRouter();

  const filteredRoles = roles.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()),
  );
  const handleReset = () => {
    setSearch("");
    setSelectedRole("all");
    router.refresh();
  };

  return (
    <div className="flex flex-col rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* FILTER BAR */}
      <div className="flex flex-col gap-4 border-b border-zinc-200 p-5 bg-zinc-50/30 dark:border-zinc-800 dark:bg-zinc-900/10 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white dark:bg-zinc-950"
          />
        </div>

        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-zinc-950">
            <SelectValue placeholder="Filter by Role" />
          </SelectTrigger>
          {/* <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {mappedRoles.map((r) => (
              <SelectItem key={r.title} value={r.title}>
                {r.title}
              </SelectItem>
            ))}
          </SelectContent> */}
          <SelectContent>
            <SelectItem value="all">All</SelectItem>

            {roles.map((r) => (
              <SelectItem key={r.roleId} value={r.title}>
                {r.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={handleReset}
          title="Reset filters"
          className="h-10 w-10 shrink-0 p-0 border-zinc-200 text-primary hover:border-primary hover:bg-primary/5 hover:text-primary"
        >
          <RotateCcw size={16} />
        </Button>
      </div>

      {/* GRID */}
      <div className="p-6">
        <RolesPermissionsGrid
          roles={
            selectedRole === "all"
              ? filteredRoles
              : filteredRoles.filter((r) => r.title === selectedRole)
          }
          setRoles={setRoles}
          permissions={permissions}
        />
      </div>
    </div>
  );
}
