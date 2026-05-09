import { NextRequest } from "next/server";
import { getAccessToken } from "@/lib/getAuthToken";
import {
  apiGetJson,
  apiPatchJson,
  apiPostJson,
  getApiBaseUrl,
} from "@/lib/api/client";

export async function GET(req: NextRequest) {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    return Response.json(
      { success: false, message: "Backend URL not configured" },
      { status: 500 },
    );
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") ?? "1";
  const result = await apiGetJson<any>(`/api/v1/admin/cities?page=${page}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return Response.json({
    success: true,
    data: {
      count: result.data.count,
      rows: result.data.rows.map((c: any) => ({
        id: String(c.id),
        city: c.city,
        state: c.state,
        country: c.country,
        countryCode: c.countryCode.toUpperCase(),
        status: c.isActive ? "active" : "inactive",
        createdAt: c.createdAt,
      })),
    },
  });
}

export async function POST(req: NextRequest) {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    return Response.json(
      { success: false, message: "Backend URL not configured" },
      { status: 500 },
    );
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const payload = await req.json();

  const result = await apiPostJson<any>(
    "/api/v1/admin/cities/addCity",
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return Response.json({
    success: true,
    data: result.data,
  });
}

type ExternalUpdateCityStatusResponse = {
  success: boolean;
  message: string;
  data: {
    id: number;
    isActive: boolean;
  };
};

export async function updateCityStatusServer(
  cityId: number,
): Promise<ExternalUpdateCityStatusResponse> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) throw new Error("DROPTY_API_BASE_URL not set");

  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error("No access token found");

  const result = await apiPatchJson<ExternalUpdateCityStatusResponse>(
    `/api/v1/admin/cities/updateCityStatus/${cityId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return result;
}
