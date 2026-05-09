import "server-only";

import { apiGetJson, apiPostJson } from "@/lib/api/client";
import type { RolePermission, UpdateRolePermissionPayload } from "@/lib/data/role-permission";
import { getAccessToken } from "@/lib/getAuthToken";
import { revalidatePath } from "next/cache";

export type GetRolePermissionApiResponse = {
  success: boolean;
  data: {
    rows: RolePermission[];      
    count: number;
  };
};

export async function getRolePermissionWithApi({
  page,
  limit,
  userType,
  searchKey,
}: {
  page: number;
  limit: number;
  userType: string;
  searchKey: string;
}) {
 
  const accessToken = await getAccessToken();

  try {
    const result = await apiGetJson<{
      success: boolean;
      data: { rows: RolePermission[]; count: number };
    }>(
      `/api/v1/admin/roleAndPermission/roleList?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );


    return {
      rolePermission: result.data.rows,
      total: result.data.count,
      source: "external" as const,
    };
  } catch (err: any) {

    throw err;
  }
}


export async function updateRolePermissionWithApi(
  payload: UpdateRolePermissionPayload
) {
  const accessToken = await getAccessToken();

  try {
    const result = await apiPostJson<{
      success: boolean;
      data: any;
    }>(
      "/api/role-permission/update",
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return result;
  } catch (err) {
    throw err;
  }
}

export async function deleteRolePermissionWithApi(
  payload: UpdateRolePermissionPayload
) {
  const accessToken = await getAccessToken();

  try {
    const result = await apiPostJson<{
      success: boolean;
      data: any;
    }>(
      "/api/role-permission/update",
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return result;
  } catch (err) {
    throw err;
  }
}


export type CreateRoleApiResponse = {
  success: boolean;
  message?: string;
  data?: {
    roleId: number;
    roleTitle: string;
    permissions: any[];
  };
};


export async function createRoleWithApi(
  payload: { title: string }
): Promise<CreateRoleApiResponse> {
  const accessToken = await getAccessToken();

  return apiPostJson<CreateRoleApiResponse>(
    "/api/v1/admin/roleAndPermission/createRole",
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );
}


type UpdateRolePayload = {
  roleId: number;
  title: string;
};

export async function updateRoleAction(
  payload: UpdateRolePayload
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
    `/api/v1/admin/roleAndPermission/updateRole/${payload.roleId}`,
    {
      title: payload.title,
    },
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
    message: res.message ?? "Role updated successfully",
  };
}
