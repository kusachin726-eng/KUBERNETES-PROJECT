"use server";

import { getAccessToken } from "@/lib/getAuthToken";
import { apiGetJson, apiPostJson, apiPatchJson } from "@/lib/api/client";

export async function getSettingsAction(
  page: number = 1,
  limit: number = 10,
  searchKey: string = "",
) {
  const token = await getAccessToken();
  if (!token) {
    return { success: false, message: "Unauthorized" };
  }

  const result = await apiGetJson<any>(
    `/api/v1/admin/settings/list?page=${page}&limit=${limit}&searchKey=${searchKey}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return {
    success: true,
    data: result.data,
  };
}

export async function addSettingAction(payload: {
  title: string;
  metaData: Record<string, number>;
}) {
  const token = await getAccessToken();
  if (!token) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const res = await apiPostJson(
      "/api/v1/admin/settings",
      {
        ...payload,
        isActive: true,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return { success: true, data: res };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to add setting",
    };
  }
}

export async function updateSettingAction(
  id: string,
  payload: {
    title: string;
    metaData: Record<string, number>;
  },
) {
  const token = await getAccessToken();
  if (!token) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const res = await apiPatchJson(
      `/api/v1/admin/settings/updateSettings/${id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return { success: true, data: res };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to update setting",
    };
  }
}
