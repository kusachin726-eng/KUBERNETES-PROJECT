import "server-only";
import {
  apiGetJson,
  getApiBaseUrl,
  apiPatchJson,
  apiDeleteJson,
  apiPostJson,
} from "@/lib/api/client";
import { getAccessToken } from "@/lib/getAuthToken";
import { redirect } from "next/navigation";

type ExternalCitiesResponse = {
  success: boolean;
  data: {
        totalCount: number;
    rows: Array<{
      id: number;
      city: string;
      state: string;
      stateCode: string;
      country: string;
      countryCode: string;
      pincode: string[];
      isActive: boolean;
      createdAt: string;
    }>;
  };
};

export type CityUI = {
  id: string;
  city: string;
  state: string;
  stateCode: string;
  country: string;
  countryCode: string;
  pincode: string[];
  status: "active" | "inactive";
  createdAt: string;
};

export async function fetchCitiesServer({
  page = 1,
  limit = 10,
  searchKey = "",
  isActive,
}: {
  page?: number;
  limit?: number;
  searchKey?: string;
  isActive?: boolean;
}): Promise<{
  cities: CityUI[];
  total: number;
}> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) throw new Error("DROPTY_API_BASE_URL is not set");

  const accessToken = await getAccessToken();
  if (!accessToken) redirect("/login");

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(searchKey ? { searchKey } : {}),
    ...(isActive !== undefined ? { isActive: String(isActive) } : {}),
  }).toString();

  const result = await apiGetJson<ExternalCitiesResponse>(
    `/api/v1/admin/cities?${query}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const cities: CityUI[] = result.data.rows.map((c) => ({
    id: String(c.id),
    city: c.city,
    state: c.state,
    stateCode: c.stateCode,
    country: c.country,
    countryCode: c.countryCode.toUpperCase(),
    pincode: c.pincode ?? [],
    status: c.isActive ? "active" : "inactive",
    createdAt: c.createdAt,
  }));

  return {
    cities,
  total: Number(result.data.totalCount) || 0,
  };
}

type ExternalDeleteCityResponse = {
  success: number;
  message: string;
};

export async function deleteCityServer(cityId: number) {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) throw new Error("DROPTY_API_BASE_URL not set");

  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error("No access token found");

  const result = await apiDeleteJson<ExternalDeleteCityResponse>(
    `/api/v1/admin/cities/deleteCity/${cityId}`,
    undefined,

    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return result;
}

export async function toggleCityStatusAction(cityId: string) {
  try {
    const token = await getAccessToken();
    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    const result = await apiPatchJson<any>(
      `/api/v1/admin/cities/updateCityStatus/${cityId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      success: true,
      data: result.data,
      message: result.message,
    };
  } catch (error: any) {
    console.error("toggleCityStatusAction failed:", error);

    return {
      success: false,
      message: error.message || "Failed to update city status",
    };
  }
}

type ExternalGetCityResponse =
  | {
      success: true;
      data: {
        id: number;
        city: string;
        state: string;
        country: string;
        countryCode: string;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
      };
    }
  | {
      success: 0;
      message: string;
    };

export async function getCityByIdServer(cityId: number) {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) throw new Error("DROPTY_API_BASE_URL not set");

  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error("Unauthorized");

  const result = await apiGetJson<ExternalGetCityResponse>(
    `/api/v1/admin/cities/getCity/${cityId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return result;
}

type ExternalUpdateCityResponse = {
  success: number;
  message: string;
  data: {
    id: number;
    city: string;
    state: string;
    country: string;
    countryCode: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export async function updateCityServer(
  cityId: number,
  payload: { city: string },
) {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) throw new Error("DROPTY_API_BASE_URL not set");

  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error("Unauthorized");

  const result = await apiPatchJson<ExternalUpdateCityResponse>(
    `/api/v1/admin/cities/updateCity/${cityId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return result;
}
