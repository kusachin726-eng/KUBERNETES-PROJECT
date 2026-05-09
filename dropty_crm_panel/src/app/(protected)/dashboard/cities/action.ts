"use server";

import { apiPostJson } from "@/lib/api/client";
import { getAccessToken } from "@/lib/getAuthToken";
import { deleteCityServer } from "@/lib/api/cities";
import { updateCityStatusServer } from "@/app/api/cities/route";
import { getCityByIdServer } from "@/lib/api/cities";
import { updateCityServer } from "@/lib/api/cities";

export type ActionSuccess<T> = {
  success: true;
  data: T;
};

export type ActionError = {
  success: false;
  message: string;
};

export type ActionResult<T> = ActionSuccess<T> | ActionError;

export type CreateCityPayload = {
  city: string;
  state: string;
  stateCode: string;
  country: string;
  countryCode: string;
  pincode: [];
};

export async function createCityAction(
  payload: CreateCityPayload,
): Promise<ActionResult<any>> {
  const token = await getAccessToken();

  if (!token) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const result = await apiPostJson<any>(
      "/api/v1/admin/cities/addCity",
      payload,
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
  } catch (error: any) {
    console.error(" createCityAction failed:", error);
    return {
      success: false,
      message: error.message || "Failed to create city",
    };
  }
}

export async function deleteCityAction(
  cityId: string,
): Promise<ActionResult<null>> {
  try {
    const result = await deleteCityServer(Number(cityId));

    if (result.success === 0) {
      return { success: false, message: result.message };
    }

    return { success: true, data: null };
  } catch (error: any) {
    console.error("deleteCityAction failed:", error);
    return {
      success: false,
      message: error.message || "Failed to delete city",
    };
  }
}

export async function toggleCityStatusAction(
  cityId: string,
): Promise<ActionResult<any>> {
  try {
    const result = await updateCityStatusServer(Number(cityId));

    return {
      success: true,
      data: result.data,
  
    };
  } catch (error: any) {
    console.error(" toggleCityStatusAction failed:", error);
    return {
      success: false,
      message: error.message || "Failed to update city status",
    };
  }
}

export async function getCityAction(
  cityId: string,
): Promise<ActionResult<any>> {
  try {
    const result = await getCityByIdServer(Number(cityId));

    if (!result.success) {
      return { success: false, message: result.message };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error(" getCityAction failed:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch city",
    };
  }
}

export async function updateCityAction(
  cityId: string,
  payload: {
    city: string;
    state: string;
    stateCode: string;
    country: string;
    countryCode: string;
    pincode: string[];
  },
): Promise<ActionResult<any>> {
  try {
    const result = await updateCityServer(Number(cityId), payload);

    if (result.success === 0) {
      return { success: false, message: result.message };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("updateCityAction failed:", error);
    return {
      success: false,
      message: error.message || "Failed to update city",
    };
  }
}
