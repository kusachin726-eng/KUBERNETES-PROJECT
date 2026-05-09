import { apiGetJson, getApiBaseUrl, apiPostJson } from "@/lib/api/client";
import type { RolePermission, GetRolePermissionApiResponse } from "@/lib/data/role-permission";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const baseUrl = getApiBaseUrl();

  // Fallback if base URL is missing
  if (!baseUrl) {
    return Response.json({
      success: true,
      data: {
        count: 0,
        rows: [],
      },
      source: "mock",
    });
  }

  const { searchParams } = new URL(req.url);

  const userType = searchParams.get("userType") ?? "";
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "10";
  const searchKey = searchParams.get("searchKey") ?? "";

  const params = new URLSearchParams({
    userType,
    page,
    limit,
    searchKey,
  });

  // ✅ Forward to external API
  const external = await apiGetJson<GetRolePermissionApiResponse>(
    `/api/v1/admin/roleAndPermission/roleList?${params.toString()}`
  );

  return Response.json({
    success: external.success,
    data: {
      count: external.data?.count ?? 0,
      rows: external.data.rows ?? [],
    },
    source: "external",
  });
}

