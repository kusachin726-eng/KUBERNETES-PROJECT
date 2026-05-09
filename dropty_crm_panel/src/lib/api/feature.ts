

import "server-only";

import { getAccessToken } from "../getAuthToken";
import {
  apiPostJson,
  apiPatchJson,
  apiGetJson,
  apiDeleteJson,
  getApiBaseUrl ,
} from "./client";

import type { GetFeaturesApiResponse } from "@/lib/data/features";

/* =====================
   GET FEATURES (LIST)
===================== */

export async function getFeaturesWithApi({
  page,
  limit,
  sortOrder = "DESC",
  isActive,
  searchKey,
}: {
  page: number;
  limit: number;
  sortOrder?: "ASC" | "DESC";
  isActive?: boolean;
  searchKey?: string;
}): Promise<{ features: any[]; total: number } | null> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return null;

  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortOrder,
    });

    if (searchKey) {
      params.append("searchKey", searchKey);
    }

    if (isActive !== undefined) {
      params.append("isActive", String(isActive));
    }

    const result = await apiGetJson<GetFeaturesApiResponse>(
      `/api/v1/admin/roleAndPermission/featureList?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!result?.data) return null;

    return {
      features: result.data.rows,
      total: result.data.count,
    };
  } catch {
    return null;
  }
}

/* =====================
   CREATE FEATURE
===================== */

export type CreateFeaturePayload = {
  title: string;
};

type ExternalCreateFeatureResponse =
  | {
      success: 1;
      data: {
        featureId: number;
        featureTitle: string;
        isActive: boolean;
        createdAt: string;
      };
    }
  | {
      success: 0;
      message: string;
    };

export async function createFeatureServer(
  payload: CreateFeaturePayload
): Promise<{
  success: boolean;
  feature?: {
    id: string;
    title: string;
    isActive: boolean;
    createdAt: string;
  };
  message?: string;
  source?: "external";
}> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    return { success: false, message: "Backend API not available" };
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return { success: false, message: "No access token found" };
  }

  try {
    const result = await apiPostJson<ExternalCreateFeatureResponse>(
      "/api/v1/admin/roleAndPermission/createFeature",
      { title: payload.title },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (result.success === 0) {
      return { success: false, message: result.message };
    }

    return {
      success: true,
      feature: {
        id: String(result.data.featureId),
        title: result.data.featureTitle,
        isActive: result.data.isActive,
        createdAt: result.data.createdAt,
      },
      source: "external",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Create feature failed",
    };
  }
}

/* =====================
   UPDATE FEATURE
===================== */

export async function updateFeatureWithApi(
  featureId: number,
  payload: { title?: string; isActive?: boolean }
): Promise<{ success: boolean; message?: string }> {
  const token = await getAccessToken();
  if (!token) {
    return { success: false, message: "No access token" };
  }

  try {
    const result: any = await apiPatchJson(
      `/api/v1/admin/roleAndPermission/updateFeature/${featureId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    return {
      success: result?.success === true || result?.success === 1,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Update feature failed",
    };
  }
}

/* =====================
   DELETE FEATURE
===================== */

export async function deleteFeatureWithApi(
  featureId: number
): Promise<{ success: boolean; message?: string }> {

  const token = await getAccessToken();

  if (!token) {
    return { success: false, message: "No access token" };
  }

  try {
    const result: any = await apiDeleteJson(
      `/api/v1/admin/roleAndPermission/deleteFeature/${featureId}`,
      undefined,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    return {
      success: result?.success === true || result?.success === 1,
      message: result?.message,
    };

  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Delete feature failed",
    };
  }
}


