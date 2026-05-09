
import { apiGetJson, getApiBaseUrl } from "@/lib/api/client";
import type { Customer, GetCustomerApiResponse } from "@/lib/data/customers";
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

  // Call external API
  const external = await apiGetJson<GetCustomerApiResponse>(
    "/api/v1/admin/customer?page=1&limit=1&searchKey"
  );

  return Response.json({
    success: external.success,
    data: {
      count: external.data?.count ?? 0,
      rows: external.data?.rows ?? [],
    },
    source: "external",
  });
}




