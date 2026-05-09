import "server-only";

import { apiPostJson } from "@/lib/api/client";
import type { UserRole } from "@/lib/roles";

type ApiLoginResponse = {
  success: 0 | 1;
  message?: string;
  data?: {
    token: string;
    user: {
      id: number | string;
      email: string;
      role: string;
      admin_role_id?: number | null;
    };
    permissions?: unknown;
  };
};

// function deriveCrmRoleFromPermissions(permissions: unknown): UserRole {
//   console.log('hello from login', permissions);
//   if (!Array.isArray(permissions)) return "agent";

//   const hasFeature = (name: string, predicate?: (p: any) => boolean) =>
//     permissions.some((p: any) => {
//       const featureTitle = String(p?.feature?.title ?? p?.featureName ?? "").toLowerCase();
//       if (featureTitle !== name.toLowerCase()) return false;
//       return predicate ? predicate(p) : true;
//     });

//   // Heuristics: adjust feature names to match your DB values.
//   const canSeeAdmin = hasFeature("manage_admin", (p) => Boolean(p?.canView || p?.canCreate || p?.canEdit || p?.canDelete));
//   if (canSeeAdmin) return "admin";

//   const canSeeCustomers =
//     hasFeature("manage_customers", (p) => Boolean(p?.canView || p?.canCreate || p?.canEdit || p?.canDelete)) ||
//     hasFeature("customers", (p) => Boolean(p?.canView || p?.canCreate || p?.canEdit || p?.canDelete));
//   if (canSeeCustomers) return "manager";

//   return "agent";
// }

function deriveCrmRoleFromPermissions(input: unknown): UserRole {
  const permissions = Array.isArray(input)
    ? input
    : Array.isArray((input as any)?.data?.permissions)
    ? (input as any).data.permissions
    : [];

  if (!permissions.length) return "agent";

  const hasFeature = (name: string, predicate?: (p: any) => boolean) =>
    permissions.some((p: any) => {
      const featureTitle = String(p?.feature?.title ?? "").toLowerCase();
      if (featureTitle !== name.toLowerCase()) return false;
      return predicate ? predicate(p) : true;
    });

  const canSeeAdmin = hasFeature("manage_admins", p =>
    p.canView || p.canCreate || p.canEdit || p.canDelete
  );
  if (canSeeAdmin) return "admin";

  const canSeeCustomers = hasFeature("customer", p =>
    p.canView || p.canCreate || p.canEdit || p.canDelete
  );
  if (canSeeCustomers) return "manager";

  return "agent";
}

export async function loginAdminWithApi(input: {
  login: string;
  password: string;
}): Promise<{
  user: { id: string; email: string; role: UserRole };
  accessToken: string;
  permissions: unknown;
}> {
  const result = await apiPostJson<ApiLoginResponse>(
    "/api/v1/admin/auth/verifyEmailPassword",
    {
      email: input.login,
      password: input.password,
      device_type: "web",
    },
  );

  const token = result.data?.token;
  const user = result.data?.user;

  if (!token || !user?.id || !user.email) {
    throw new Error(result.message || "Login failed");
  }

  const role: UserRole = deriveCrmRoleFromPermissions(result.data?.permissions);
  return {
    user: {
      id: String(user.id),
      email: user.email,
      // role,
      role: (user as any).user_type ?? "guest",

    },
    accessToken: token,
    permissions: result.data?.permissions ?? null,
  };
}
