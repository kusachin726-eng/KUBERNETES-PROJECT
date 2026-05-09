
import "server-only";
import { redirect } from "next/navigation";
import { getAccessToken } from "../getAuthToken";
import { getApiBaseUrl } from "./client";
import {
  apiGetJson,
  apiPostJson,
  apiDeleteJson,
  apiPatchJson,
} from "./client";

/* =====================
   API RESPONSE TYPES
===================== */
type ExternalAirlinesListResponse = {
  success: boolean;
  data: {
    count: number;
    rows: Array<{
      id: number;
      airlineName: string;
      airlineLogo: string;
      isActive: boolean;
      createdAt: string;
      extraBagFares: Array<{
        id: number;
        airlineId: number;
        flightType: "domestic" | "international";
        baggageType: "weight" | "piece";
        additionalKg: string;
        additionalKgFare: string;
      }>;
    }>;
  };
};

/* =====================
   EXPORTED API AIRLINE TYPE
===================== */
export type AirlineApi =
  ExternalAirlinesListResponse["data"]["rows"][number];

/* =====================
   FETCH AIRLINES
===================== */
export async function getAirlinesWithApi({
  page,
  limit,
  searchKey = "",
  isActive,
}: {
  page: number;
  limit: number;
  searchKey?: string;
  isActive?: boolean; // ✅ added
}): Promise<{
  airlines: AirlineApi[];
  total: number;
  totalPages: number;
  page: number;
}> {
  const accessToken = await getAccessToken();
  if (!accessToken) redirect("/login");

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(searchKey ? { searchKey } : {}),
    ...(isActive !== undefined ? { isActive: String(isActive) } : {}),
  }).toString();

  const result = await apiGetJson<ExternalAirlinesListResponse>(
    `/api/v1/admin/airlines?${query}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return {
    airlines: result.data.rows ?? [],
    total: result.data.count ?? 0,
    totalPages: Math.ceil((result.data.count ?? 0) / limit),
    page,
  };
}

// api for adding the airlines



/* =====================
   TYPES
===================== */

export type Airline = {
  id: string;
  airlineName: string;
  airlineLogo: string;
  status: "active" | "inactive";
  createdAt: string;
};

export type CreateAirlinePayload = {
  airlineName: string;
  airlineLogo?: string | null;
  isActive: boolean;
};

type ExternalCreateAirlineResponse = {
  success: boolean;
  message?: string;
  data: {
    id: number;
    airlineName: string;
    airlineLogo: string;
    isActive: boolean;
    createdAt: string;
  };
};

/* =====================
   CREATE AIRLINE
===================== */


export async function createAirlineServer(
  payload: CreateAirlinePayload,
): Promise<{
  airline: Airline;
  source: "external" | "mock";
}> {
  const baseUrl = getApiBaseUrl();

  // 🔹 MOCK MODE
  if (!baseUrl) {
    return {
      airline: {
        id: `mock_${Date.now()}`,
        airlineName: payload.airlineName,
        airlineLogo: payload.airlineLogo || "spicejet.png",
        status: payload.isActive ? "active" : "inactive",
        createdAt: new Date().toISOString(),
      },
      source: "mock",
    };
  }

  const accessToken = await getAccessToken();
  if (!accessToken) redirect("/login");

  const result = await apiPostJson<ExternalCreateAirlineResponse>(
    "/api/v1/admin/airlines",
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = result.data;

  return {
    airline: {
      id: String(data.id),
      airlineName: data.airlineName,
      airlineLogo: data.airlineLogo,
      status: data.isActive ? "active" : "inactive",
      createdAt: data.createdAt,
    },
    source: "external",
  };
}
// delete the airlines


/* =====================
   DELETE AIRLINE
===================== */

type ExternalDeleteAirlineResponse = {
  success: boolean | number;
  message: string;
};

export async function deleteAirlineServer(
  airlineId: number,
): Promise<{
  success: boolean;
  message: string;
  source: "external" | "mock";
}> {
  const baseUrl = getApiBaseUrl();

  // 🔹 MOCK MODE
  if (!baseUrl) {
    return {
      success: true,
      message: "Mock airline deleted successfully",
      source: "mock",
    };
  }

  const accessToken = await getAccessToken();
  if (!accessToken) redirect("/login");

  const result = await apiDeleteJson<ExternalDeleteAirlineResponse>(
    `/api/v1/admin/airlines/${airlineId}`,
    undefined,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return {
    success: result.success === true || result.success === 1,
    message: result.message || "Airline deleted successfully",
    source: "external",
  };
}
// get single airlines details 
export interface InternalSingleAirline {
  id: number;
  airlineName: string;
  airlineLogo?: string;
  isActive: boolean;
  extraBagFares: {
    id: number;
    airlineId: number;
    flightType: string;
    baggageType: string;
    additionalKg: string;
    additionalKgFare: string;
  }[];
}

type ExternalGetSingleAirlineResponse = {
  success: boolean;
  data: {
    id: number;
    airlineName: string;
    airlineLogo: string;
    isActive: boolean;
    createdAt: string;
    extraBagFares: Array<any>;
  };
};



// export async function fetchSingleAirlineServer(
//   airlineId: number,
// ): Promise<{
//   success: boolean;
//   data?: InternalSingleAirline;
//   message?: string;
//   source?: "external" | "mock";
// }> {
//   const baseUrl = getApiBaseUrl();

//   // 🔹 MOCK MODE
//   if (!baseUrl) {
//     return {
//       success: true,
//       data: {
//         id: airlineId,
//         airlineName: "Mock Airline",
//         airlineLogo: "spicejet.png",
//         isActive: true,
//       },
//       source: "mock",
//     };
//   }

//   const accessToken = await getAccessToken();
//   if (!accessToken) redirect("/login");

//   const result = await apiGetJson<ExternalGetSingleAirlineResponse>(
//     `/api/v1/admin/airlines/detailsById/${airlineId}`,
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     },
//   );

//   if (!result.success) {
//     return {
//       success: false,
//       message: "Failed to fetch airline details",
//     };
//   }

//   const data = result.data;

//   return {
//     success: true,
//     data: {
//       id: data.id,
//       airlineName: data.airlineName,
//       airlineLogo: data.airlineLogo,
//       isActive: data.isActive,
//     },
//     source: "external",
//   };
// }
export async function fetchSingleAirlineServer(
  airlineId: number,
): Promise<{
  success: boolean;
  data?: InternalSingleAirline;
  message?: string;
  source?: "external" | "mock";
}> {
  const baseUrl = getApiBaseUrl();

  // 🔹 MOCK MODE
  if (!baseUrl) {
    return {
      success: true,
      data: {
        id: airlineId,
        airlineName: "Mock Airline",
        airlineLogo: "spicejet.png",
        isActive: true,
        extraBagFares: [], // ✅ ADD THIS
      },
      source: "mock",
    };
  }

  const accessToken = await getAccessToken();
  if (!accessToken) redirect("/login");

  const result = await apiGetJson<ExternalGetSingleAirlineResponse>(
    `/api/v1/admin/airlines/detailsById/${airlineId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!result.success) {
    return {
      success: false,
      message: "Failed to fetch airline details",
    };
  }

  const data = result.data;

  return {
    success: true,
    data: {
      id: data.id,
      airlineName: data.airlineName,
      airlineLogo: data.airlineLogo,
      isActive: data.isActive,
      extraBagFares: data.extraBagFares ?? [], // ✅ THIS IS THE FIX
    },
    source: "external",
  };
}
// api for adding the extra fares and details of airlines


export type AddExtraBagFarePayload = {
  flightType: "domestic" | "international";
  baggageType: "weight" | "bag";
  additionalKg: number;
  additionalKgFare: number;
};

type ExternalAddExtraBagFareResponse = {
  success: boolean;
  data: {
    id: number;
    airlineId: number;
    flightType: "domestic" | "international";
    baggageType: "weight" | "bag";
    additionalKg: string;
    additionalKgFare: string;
    createdAt: string;
  };
};
/* =====================
   ADD EXTRA BAG FARE
===================== */

export async function addExtraBagFareServer(
  airlineId: number,
  payload: AddExtraBagFarePayload,
): Promise<{
  success: boolean;
  data?: ExternalAddExtraBagFareResponse["data"];
  message?: string;
  source: "external" | "mock";
}> {
  const baseUrl = getApiBaseUrl();

  // 🔹 MOCK MODE
  if (!baseUrl) {
    return {
      success: true,
      data: {
        id: Date.now(),
        airlineId,
        flightType: payload.flightType,
        baggageType: payload.baggageType,
        additionalKg: String(payload.additionalKg),
        additionalKgFare: String(payload.additionalKgFare),
        createdAt: new Date().toISOString(),
      },
      source: "mock",
    };
  }

  const accessToken = await getAccessToken();
  if (!accessToken) redirect("/login");

  const result = await apiPostJson<ExternalAddExtraBagFareResponse>(
    `/api/v1/admin/airlines/extra-bag-fare/${airlineId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!result.success) {
    return {
      success: false,
      message: "Failed to add extra bag fare",
      source: "external",
    };
  }

  return {
    success: true,
    data: result.data,
    source: "external",
  };
}


// update airlines
/* =====================
   UPDATE AIRLINE
===================== */

export type UpdateAirlinePayload = {
  airlineName: string;
  isActive: boolean;
};

type ExternalUpdateAirlineResponse = {
  success: boolean;
  data: {
    id: number;
    airlineName: string;
    airlineLogo: string;
    isActive: boolean;
  };
};

export async function updateAirlineServer(
  airlineId: number,
  payload: UpdateAirlinePayload,
): Promise<{
  success: boolean;
  message?: string;
  source: "external" | "mock";
}> {
  const baseUrl = getApiBaseUrl();

  // 🔹 MOCK MODE
  if (!baseUrl) {
    return {
      success: true,
      message: "Mock airline updated successfully",
      source: "mock",
    };
  }

  const accessToken = await getAccessToken();
  if (!accessToken) redirect("/login");

  const result = await apiPatchJson<ExternalUpdateAirlineResponse>(
    `/api/v1/admin/airlines/${airlineId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!result.success) {
    return {
      success: false,
      message: "Failed to update airline",
      source: "external",
    };
  }

  return {
    success: true,
    message: "Airline updated successfully",
    source: "external",
  };
}
// update the extra fare for the airlines


type ExternalUpdateExtraFareResponse = {
  success: boolean;
  message?: string;
  data?: {
    id: number;
    additionalKgFare: string;
  };
};

export async function updateExtraBagFareServer(
  fareId: number,
  payload: { additionalKgFare: number },
): Promise<{
  success: boolean;
  message?: string;
  source: "external" | "mock";
}> {
  const baseUrl = getApiBaseUrl();

  // 🔹 MOCK MODE
  if (!baseUrl) {
    return {
      success: true,
      message: "Mock fare updated successfully",
      source: "mock",
    };
  }

  const accessToken = await getAccessToken();
  if (!accessToken) redirect("/login");

  const result = await apiPatchJson<ExternalUpdateExtraFareResponse>(
    `/api/v1/admin/airlines/extra-bag-fare/${fareId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!result.success) {
    return {
      success: false,
      message: result.message || "Failed to update fare",
      source: "external",
    };
  }

  return {
    success: true,
    message: "Fare updated successfully",
    source: "external",
  };
}
// delete the extra fares 


type ExternalDeleteExtraFareResponse = {
  success: boolean;
  message: string;
};

export async function deleteExtraBagFareServer(
  fareId: number,
): Promise<{
  success: boolean;
  message: string;
  source: "external" | "mock";
}> {
  const baseUrl = getApiBaseUrl();

  // 🔹 MOCK MODE
  if (!baseUrl) {
    return {
      success: true,
      message: "Mock extra bag fare deleted",
      source: "mock",
    };
  }

  const accessToken = await getAccessToken();
  if (!accessToken) redirect("/login");

  const result = await apiDeleteJson<ExternalDeleteExtraFareResponse>(
    `/api/v1/admin/airlines/extra-bag-fare/${fareId}`,
    undefined,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return {
    success: result.success === true,
    message: result.message || "Extra bag fare deleted",
    source: "external",
  };
}
