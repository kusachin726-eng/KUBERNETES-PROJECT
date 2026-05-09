// import "server-only";
// import { getAccessToken } from "../getAuthToken";
// import { redirect } from "next/navigation";
// import {
//   apiGetJson,
//   apiPostJson,
//   getApiBaseUrl,
//   apiDeleteJson,
//   apiPatchJson,
// } from "./client";

// type ExternalCrewListResponse = {
//   success: boolean;
//   data: {
//     count: number;
//     rows: Array<{
//       id: number;
//       name: string;
//       mobile_number: string;
//       email: string | null;
//       isMobileVerified: boolean;
//       isActive: boolean;
//       createdAt: string;
//       userId?: number;
//       firstName?: string;
//       lastName?: string;
//     }>;
//   };
// };




// export type Rider = {
//   id: string;
//   name: string;
//   phone: string;
//   email: string;
//   isActive: boolean;
//   isMobileVerified: boolean;
//   avatarUrl: string | null;
//   createdAt: string;
// };


// /* =====================
//    FETCH RIDERS (LIST + SEARCH + SORT)
// ===================== */
// export async function fetchRidersServer(
//   page = 1,
//   limit = 10,
//   searchKey = "",
//   isActive?: boolean,
//   sortOrder: "asc" | "desc" = "desc",
// ): Promise<{
//   riders: Rider[];
//   totalCount: number;
//   totalPages: number;
//   page: number;
//   source: "external";
// }> {
//   const accessToken = await getAccessToken();
//   if (!accessToken) redirect("/login");

//   // ✅ SAME SORT MAPPING AS CUSTOMERS / STAFF
//   const apiSortOrder = sortOrder === "asc" ? "ASC" : "DESC";

//   const query = new URLSearchParams({
//     page: String(page),
//     limit: String(limit),
//     sortOrder: apiSortOrder,
//     ...(searchKey ? { searchKey } : {}),
//     ...(isActive !== undefined ? { isActive: String(isActive) } : {}),
//   }).toString();

//   const result = await apiGetJson<ExternalCrewListResponse>(
//     `/api/v1/admin/users/crew?${query}`,
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     },
//   );

//   const riders: Rider[] = result.data.rows.map((row) => ({
//     id: String(row.userId ?? row.id),
//     name:
//       row.firstName && row.lastName
//         ? `${row.firstName} ${row.lastName}`
//         : row.name,
//     isMobileVerified: row.isMobileVerified,
//     phone: row.mobile_number,
//     email: row.email ?? "N/A",
//     city: "—",
//     state: "—",
//     country: "—",
//     isActive: Boolean(row.isActive), // ✅ BOOLEAN → UI, FILTER, SORT
//     image: "/avatar.png",
//     createdAt: row.createdAt,
//   }));

//   const totalCount = result.data.count;
//   const totalPages = Math.ceil(totalCount / limit);

//   return {
//     riders,
//     totalCount,
//     totalPages,
//     page,
//     source: "external",
//   };
// }


// /* =====================
//    CREATE CREW
// ===================== */

// export type CreateRiderPayload = {
//   firstName: string;
//   lastName: string;
//   email: string;
//   mobile_number: string;
//   gender: string;
//   dateOfBirth: string;
// };

// type ExternalCreateCrewResponse = {
//   success: number;
//   message: string;
//   data: {
//     id: number; // userId
//     email: string;
//     mobile_number: string;
//     isActive: boolean;
//     createdAt: string;
//   };
// };

// // export async function createCrewServer(payload: CreateRiderPayload): Promise<{
// //   rider: Rider;
// //   source: "external" | "mock";
// // }> {
// //   const baseUrl = getApiBaseUrl();

// //   // if (!baseUrl) {
// //   //   return {
// //   //     rider: {
// //   //       id: `mock_${Date.now()}`,
// //   //       name: `${payload.firstName} ${payload.lastName}`,
// //   //       isMobileVerified: false,
// //   //       phone: payload.mobile_number,
// //   //       email: payload.email,
// //   //       city: "—",
// //   //       state: "—",
// //   //       country: "—",
// //   //       // status: "active",
// //   //       image: "/avatar.png",
// //   //       createdAt: new Date().toISOString(),
// //   //     },
// //   //     source: "mock",
// //   //   };
// //   // }

// //   const accessToken = await getAccessToken();
// //   if (!accessToken) {
// //     redirect("/login");
// //   }

// //   const result = await apiPostJson<ExternalCreateCrewResponse>(
// //     "/api/v1/admin/users/crew/create",
// //     payload,
// //     {
// //       headers: {
// //         Authorization: `Bearer ${accessToken}`,
// //       },
// //     },
// //   );



// //   const data = result.data;

// //   return {
// //     rider: {
// //       id: String(data.id), // ✅ backend id === userId
// //       name: `${payload.firstName} ${payload.lastName}`, // backend doesn't return name
// //       isMobileVerified: false,
// //       phone: data.mobile_number,
// //       email: data.email,
// //       city: "—",
// //       state: "—",
// //       country: "—",
// //       status: data.isActive ? "active" : "inactive",
// //       image: "/avatar.png",
// //       createdAt: data.createdAt,
// //     },
// //     source: "external",
// //   };
// // }
// export async function createCrewServer(payload: CreateRiderPayload): Promise<{
//   rider: Rider;
//   source: "external" | "mock";
// }> {
//   const accessToken = await getAccessToken();
//   if (!accessToken) {
//     redirect("/login");
//   }

//   const result = await apiPostJson<ExternalCreateCrewResponse>(
//     "/api/v1/admin/users/crew/create",
//     payload,
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     },
//   );

//   const data = result.data;

//   return {
//     rider: {
//       id: String(data.id), // ✅ backend id === userId
//       name: `${payload.firstName} ${payload.lastName}`,
//       isMobileVerified: false,
//       phone: data.mobile_number,
//       email: data.email,
//       city: "—",
//       state: "—",
//       country: "—",
//       isActive: Boolean(data.isActive), // ✅ FIXED
//       image: "/avatar.png",
//       createdAt: data.createdAt,
//     },
//     source: "external",
//   };
// }

import "server-only";
import { getAccessToken } from "../getAuthToken";
import { redirect } from "next/navigation";
import {
  apiGetJson,
  apiPostJson,
  getApiBaseUrl,
  apiDeleteJson,
  apiPatchJson,
} from "./client";

type ExternalCrewListResponse = {
  success: boolean;
  data: {
    count: number;
    rows: Array<{
      id: number;
      name: string;
      mobile_number: string;
      email: string | null;
      isMobileVerified: boolean;
      isActive: boolean;
      createdAt: string;
      userId?: number;
      firstName?: string;
      lastName?: string;
    }>;
  };
};

export type Rider = {
  id: string;
  name: string;
  phone: string;
  email: string;
  isActive: boolean;
  isMobileVerified: boolean;
  avatarUrl: string | null;
  createdAt: string;
};

/* =====================
   FETCH RIDERS (LIST + SEARCH + SORT)
===================== */
export async function fetchRidersServer(
  page = 1,
  limit = 10,
  searchKey = "",
  isActive?: boolean,
  sortOrder: "asc" | "desc" = "desc",
): Promise<{
  riders: Rider[];
  totalCount: number;
  totalPages: number;
  page: number;
  source: "external";
}> {
  const accessToken = await getAccessToken();
  if (!accessToken) redirect("/login");

  const apiSortOrder = sortOrder === "asc" ? "ASC" : "DESC";

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortOrder: apiSortOrder,
    ...(searchKey ? { searchKey } : {}),
    ...(isActive !== undefined ? { isActive: String(isActive) } : {}),
  }).toString();

  const result = await apiGetJson<ExternalCrewListResponse>(
    `/api/v1/admin/users/crew?${query}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const riders: Rider[] = result.data.rows.map((row) => ({
    id: String(row.userId ?? row.id),
    name:
      row.firstName && row.lastName
        ? `${row.firstName} ${row.lastName}`
        : row.name,
    phone: row.mobile_number,
    email: row.email ?? "N/A",
    isActive: Boolean(row.isActive),
    isMobileVerified: row.isMobileVerified,
    avatarUrl: null,
    createdAt: row.createdAt,
  }));

  const totalCount = result.data.count;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    riders,
    totalCount,
    totalPages,
    page,
    source: "external",
  };
}

/* =====================
   CREATE CREW
===================== */

export type CreateRiderPayload = {
  firstName: string;
  lastName: string;
  email: string;
  mobile_number: string;
  gender: string;
  dateOfBirth: string;
};

type ExternalCreateCrewResponse = {
  success: number;
  message: string;
  data: {
    id: number;
    email: string;
    mobile_number: string;
    isActive: boolean;
    createdAt: string;
  };
};

export async function createCrewServer(payload: CreateRiderPayload): Promise<{
  rider: Rider;
  source: "external" | "mock";
}> {
  const accessToken = await getAccessToken();
  if (!accessToken) redirect("/login");

  const result = await apiPostJson<ExternalCreateCrewResponse>(
    "/api/v1/admin/users/crew/create",
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = result.data;

  return {
    rider: {
      id: String(data.id),
      name: `${payload.firstName} ${payload.lastName}`,
      phone: data.mobile_number,
      email: data.email,
      isActive: Boolean(data.isActive),
      isMobileVerified: false,
      avatarUrl: null,
      createdAt: data.createdAt,
    },
    source: "external",
  };
}


type ExternalDeleteCrewResponse = {
  success: number | boolean;
  message: string;
};

export async function deleteCrewServer(userId: number): Promise<{
  success: boolean;
  message: string;
  source: "external" | "mock";
}> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    return {
      success: true,
      message: "Mock crew deleted successfully",
      source: "mock",
    };
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/login");
  }

  const result = await apiDeleteJson<ExternalDeleteCrewResponse>(
    `/api/v1/admin/users/crew/${userId}`,
    undefined,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return {
    success: result.success === 1 || result.success === true,
    message: result.message || "Crew member deleted successfully",
    source: "external",
  };
}

/* =====================
   UPDATE CREW
===================== */

export type UpdateCrewPayload = {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
};

type ExternalUpdateCrewResponse = {
  success: number | boolean;
  message: string;
};

export async function updateCrewServer(
  userId: number,
  payload: UpdateCrewPayload,
): Promise<{
  success: boolean;
  message: string;
  source: "external" | "mock";
}> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    return {
      success: true,
      message: "Mock crew updated successfully",
      source: "mock",
    };
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/login");
  }

  // 🔥 userId === id (no caller change)
  const result = await apiPatchJson<ExternalUpdateCrewResponse>(
    `/api/v1/admin/users/crew/${userId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!(result.success === 1 || result.success === true)) {
    console.error("❌ Update crew failed:", result);
    return {
      success: false,
      message: result.message ?? "Failed to update crew",
      source: "external",
    };
  }

  return {
    success: true,
    message: result.message,
    source: "external",
  };
}

/* =====================
   UPDATE CREW STATUS
===================== */

type ExternalUpdateCrewStatusResponse = {
  success: number | boolean;
  message: string;
  data?: {
    userId: number;
    isActive: boolean;
  };
};

export async function updateCrewStatusServer(
  userId: number,
  isActive: boolean,
): Promise<{
  success: boolean;
  message: string;
  isActive?: boolean;
  source?: "external" | "mock";
}> {
  const baseUrl = getApiBaseUrl();

  // 🔹 MOCK MODE
  if (!baseUrl) {
    return {
      success: true,
      message: "Mock crew status updated",
      isActive,
      source: "mock",
    };
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/login");
  }

  // userId === id (no caller changes)
  const result = await apiPatchJson<ExternalUpdateCrewStatusResponse>(
    `/api/v1/admin/users/crew/changeStatus/${userId}`,
    { isActive },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!(result.success === 1 || result.success === true)) {
    console.error("❌ Update crew status failed:", result);
    return {
      success: false,
      message: result.message ?? "Failed to update crew status",
      source: "external",
    };
  }

  return {
    success: true,
    message: result.message,
    isActive: result.data?.isActive ?? isActive,
    source: "external",
  };
}

/* =====================
   GET SINGLE CREW
===================== */

type ExternalGetSingleCrewResponse = {
  success: number | boolean;
  message?: string;
  data: {
    id: number;
    email: string | null;
    mobile_number: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    userProfile: {
      firstName: string;
      lastName: string;
      gender: string | null;
      dateOfBirth: string | null;
    };
  };
};

type InternalSingleCrew = {
  id: number;
  email: string | null;
  mobile_number: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string | null;
};

function mapExternalCrewToInternal(
  data: ExternalGetSingleCrewResponse["data"],
): InternalSingleCrew {
  return {
    id: data.id,
    email: data.email ?? null,
    mobile_number: data.mobile_number,
    isActive: data.isActive,
    firstName: data.userProfile?.firstName ?? "",
    lastName: data.userProfile?.lastName ?? "",
    gender: data.userProfile?.gender ?? "",
    dateOfBirth: data.userProfile?.dateOfBirth ?? null,
  };
}

export async function fetchSingleCrewServer(userId: number): Promise<{
  success: boolean;
  message?: string;
  data?: InternalSingleCrew;
  source?: "external" | "mock";
}> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    return {
      success: true,
      data: {
        id: userId,
        email: "mock@example.com",
        mobile_number: "9999999999",
        isActive: true,
        firstName: "Mock",
        lastName: "User",
        gender: "male",
        dateOfBirth: null,
      },
      source: "mock",
    };
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/login");
  }

  const result = await apiGetJson<ExternalGetSingleCrewResponse>(
    `/api/v1/admin/users/crew/detailsById/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!(result.success === 1 || result.success === true)) {
    console.error("❌ Crew details API failed:", result);
    return {
      success: false,
      message: result.message ?? "Failed to fetch crew details",
    };
  }

  return {
    success: true,
    data: mapExternalCrewToInternal(result.data),
    source: "external",
  };
}

/* =====================
   VALIDATE UNIQUE (EMAIL / MOBILE)
===================== */
type ValidateUniqueResponse =
  | {
      success: 1;
      message: string;
    }
  | {
      success: 0;
      message: string;
      errors?: Record<string, string>;
    };

export async function validateCrewUniqueField(
  field: "mobile_number" | "email",
  value: string,
  userId?: number,
): Promise<{
  isAvailable: boolean;
  message: string;
  errorField?: string;
  errorMessage?: string;
  source: "external" | "mock";
}> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    const isTaken = value.includes("999") || value.includes("taken");
    return {
      isAvailable: !isTaken,
      message: isTaken ? "Already taken (mock)" : "Available (mock)",
      ...(isTaken && {
        errorField: field,
        errorMessage: `This ${field} is already in use`,
      }),
      source: "mock",
    };
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/login");
  }

  const query = new URLSearchParams({
    [field]: value,
    ...(userId ? { userId: String(userId) } : {}),
  }).toString();

  const endpoint = `/api/v1/admin/crew/validate-unique?${query}`;

  const response = await apiGetJson<ValidateUniqueResponse>(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.success === 1) {
    return {
      isAvailable: true,
      message: response.message || "Available",
      source: "external",
    };
  }

  const errorKey = Object.keys(response.errors || {})[0];
  const errorMsg =
    response.errors?.[errorKey] || response.message || "Already exists";

  return {
    isAvailable: false,
    message: response.message || "Validation failed",
    errorField: errorKey,
    errorMessage: errorMsg,
    source: "external",
  };
}

export async function validateCrewUniqueServer({
  userId,
  email,
  mobile_number,
}: {
  userId?: number;
  email?: string;
  mobile_number?: string;
}) {
  if (!email && !mobile_number) {
    return { success: 1, message: "No fields to validate" };
  }

  const checks: Promise<{
    field: string;
    result: Awaited<ReturnType<typeof validateCrewUniqueField>>;
  }>[] = [];

  if (email) {
    checks.push(
      validateCrewUniqueField("email", email, userId).then((r) => ({
        field: "email",
        result: r,
      })),
    );
  }

  if (mobile_number) {
    checks.push(
      validateCrewUniqueField("mobile_number", mobile_number, userId).then(
        (r) => ({
          field: "mobile_number",
          result: r,
        }),
      ),
    );
  }

  const results = await Promise.all(checks);

  const errors: Record<string, string> = {};

  results.forEach(({ field, result }) => {
    if (!result.isAvailable) {
      errors[field] = result.errorMessage || `This ${field} is already taken`;
    }
  });

  if (Object.keys(errors).length > 0) {
    return {
      success: 0,
      message: "One or more fields are already in use",
      errors,
    };
  }

  return {
    success: 1,
    message: "All fields are available",
  };
}
