"use server";

import {
  apiPostJson,
  apiDeleteJson,
  apiPatchJson,
} from "@/lib/api/client";
import { revalidatePath } from "next/cache";
import { getAccessToken } from "@/lib/getAuthToken";
import { createRoleWithApi  } from "@/lib/api/role-permission";

type UpdateRolePermissionPayload = {
  roleId: number;
  permissionData: {
    featureId: number;
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  }[];
};

type DeleteRolePayload = {
  roleId: number;     // 👈 for URL
  title: string;      // 👈 for body
  isActive: boolean;
};


export async function updateRolePermissionsAction(
  payload: UpdateRolePermissionPayload
): Promise<{ success: boolean; message: string }> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return {
      success: false,
      message: "Authentication required",
    };
  }

  const res = await apiPostJson<{
    success: boolean;
    message: string;
  }>(
    "/api/v1/admin/roleAndPermission/updatePermissionRoleFeatures",
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (res.success) {
    revalidatePath("/dashboard/rbac/roles-permission");
  }

  return {
    success: res.success,
    message: res.message ?? "Updated successfully",
  };
}

export async function deleteRoleAction(
  payload: DeleteRolePayload
): Promise<{ success: boolean; message: string }> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return { success: false, message: "Authentication required" };
  }

  const { roleId, ...body } = payload;

  try {
    const res = await apiDeleteJson<{
      success: boolean;
      message: string;
    }>(
      `/api/v1/admin/roleAndPermission/deleteRole/${roleId}`,
      body, // ✅ SECOND ARG = DELETE BODY
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // ✅ THIRD ARG = headers
        },
      }
    );

    return {
      success: res.success,
      message: res.message,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Delete failed",
    };
  }
}


export async function createRoleAction(values: { title: string }) {
  const res = await createRoleWithApi(values);

  return {
    success: res.success,
    message: res.message ?? "Role created successfully",
  };
}


export async function updateRoleAction(payload: {
  roleId: number;
  title: string;
}): Promise<{ success: boolean; message: string }> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return { success: false, message: "Authentication required" };
  }

  const res = await apiPatchJson<{
    success: boolean;
    message: string;
  }>(
    `/api/v1/admin/roleAndPermission/updateRole/${payload.roleId}`,
    { title: payload.title },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return {
    success: res.success,
    message: res.message ?? "Role updated successfully",
  };
}

