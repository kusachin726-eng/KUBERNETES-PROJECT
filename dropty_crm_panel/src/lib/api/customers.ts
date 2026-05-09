// import "server-only";

// import { apiGetJson, apiPatchJson, apiDeleteJson } from "@/lib/api/client";
// import { getAccessToken } from "@/lib/getAuthToken";
// import { redirect } from "next/navigation";
// import type { Customer } from "@/lib/data/customers";

// const BASE_URL= process.env.DROPTY_API_BASE_URL;

// /* =====================
//    TYPES
// ===================== */
// export type UpdateCustomerPayload = {
//   [key: string]: any;
// };
// export async function createCustomerWithApi(payload: any) {
//   const token = await getAccessToken();
//   if (!token) return { success: false, message: "Unauthorized" };

//   const res = await fetch(`${BASE_URL}/api/v1/admin/users/customer/create`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(payload),
//   });

//   const data = await res.json();
//   if (!res.ok || data?.success === 0) {
//     return { success: false, message: data?.message };
//   }

//   return { success: true };
// }

// /* =====================
//    UPDATE
// ===================== */
// export async function updateCustomerWithApi(id: number, payload: any) {
//   const token = await getAccessToken();
//   if (!token) return { success: false };

//   const res = await fetch(`${BASE_URL}/api/v1/admin/users/customer/${id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(payload),
//   });

//   if (!res.ok) return { success: false };
//   return { success: true };
// }

// /* =====================
//    DELETE
// ===================== */
// export async function deleteCustomerWithApi(id: number) {
//   const token = await getAccessToken();
//   if (!token) return { success: false };

//   const res = await fetch(`${BASE_URL}/api/v1/admin/users/customer/${id}`, {
//     method: "DELETE",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!res.ok) return { success: false };
//   return { success: true };
// }

// /* =====================
//    STATUS TOGGLE
// ===================== */
// export async function updateCustomerStatusWithApi(
//   customerId: number,
//   isActive: boolean,
// ) {
//   const token = await getAccessToken();
//   if (!token) return { success: false };

//   const res = await fetch(
//     `${BASE_URL}/api/v1/admin/users/customer/changeStatus/${customerId}`,
//     {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ isActive }),
//     },
//   );

//   if (!res.ok) return { success: false };
//   return { success: true };
// }
// // customer with single detail id 
// export async function fetchSingleCustomerWithApi(id: number) {
//   const token = await getAccessToken();
//   if (!token) return null;

//   const res = await fetch(
//     `${BASE_URL}/api/v1/admin/users/customer/detailsById/${id}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       cache: "no-store",
//     },
//   );

//   if (!res.ok) return null;

//   const data = await res.json();
//   return data?.data ?? null;
// }
// /* =====================
//    GET CUSTOMERS (LIST)
// ===================== */
// // export async function getCustomersWithApi({
// //   page,
// //   limit,
// //   searchKey = "",
// // }: {
// //   page: number;
// //   limit: number;
// //   searchKey?: string;
// // }): Promise<{
// //   customers: any[];
// //   total: number;
// // }> {
// //   const token = await getAccessToken();
// //   if (!token) {
// //     return { customers: [], total: 0 };
// //   }

// //   const res = await fetch(
// //     `${BASE_URL}/api/v1/admin/users/customer?page=${page}&limit=${limit}&searchKey=${searchKey}`,
// //     {
// //       headers: {
// //         Authorization: `Bearer ${token}`,
// //       },
// //       cache: "no-store",
// //     },
// //   );

// //   if (!res.ok) {
// //     return { customers: [], total: 0 };
// //   }

// //   const data = await res.json();

// //   return {
// //     customers: data?.data?.rows ?? [],
// //     total: data?.data?.count ?? 0,
// //   };
// // }

// export async function getCustomersWithApi({
//   page,
//   limit,
//   searchKey = "",
//   isActive,
//   sortOrder = "ASC",
// }: {
//   page: number;
//   limit: number;
//   searchKey?: string;
//   isActive?: boolean;
//   sortOrder?: "ASC" | "DESC";
// }): Promise<{
//   customers: any[];
//   total: number;
// }> {
//   const token = await getAccessToken();
//   if (!token) {
//     return { customers: [], total: 0 };
//   }

//   const params = new URLSearchParams({
//     page: String(page),
//     limit: String(limit),
//     searchKey,
//     sortOrder,
//   });

//   if (isActive !== undefined) {
//     params.append("isActive", String(isActive));
//   }

//   const res = await fetch(
//     `${BASE_URL}/api/v1/admin/customer?${params.toString()}`,
//     {
//       headers: {
//         Authorization: `Bearer ${await getAccessToken()}`,
//       },
//       cache: "no-store",
//     }
//   );

//   if (!res.ok) {
//     return { customers: [], total: 0 };
//   }

//   const result = await res.json();

//   return {
//     customers: result.data.rows,
//     total: result.data.count,
//   };
// }

// /* =====================
//    UPDATE CUSTOMER
// ===================== */
// export async function updateCustomerAction(
//   customerId: number,
//   payload: UpdateCustomerPayload
// ): Promise<{ success: boolean; message?: string }> {
//   const accessToken = await getAccessToken();
//   if (!accessToken) return { success: false, message: "Unauthorized" };

//   try {
//     const result: any = await apiPatchJson(
//       `/api/v1/admin/users/customer/${customerId}`,
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     return {
//       success: result?.success === true || result?.success === 1,
//       message: result?.message,
//     };
//   } catch (err: any) {
//     return {
//       success: false,
//       message: err?.message || "Customer update failed",
//     };
//   }
// }

// /* =====================
//    DELETE CUSTOMER
// ===================== */
// export async function deleteCustomerAction(
//   customerId: number
// ): Promise<{ success: boolean; message?: string }> {
//   const accessToken = await getAccessToken();
//   if (!accessToken) return { success: false, message: "Unauthorized" };

//   try {
//     await apiDeleteJson(
//       `/api/v1/admin/users/customer/${customerId}`,
//       undefined,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     return {
//       success: true,
//       message: "Customer deleted successfully",
//     };
//   } catch (err: any) {
//     return {
//       success: false,
//       message: err?.message || "Customer delete failed",
//     };
//   }
// }
"use server";

import { getAccessToken } from "@/lib/getAuthToken";

const BASE_URL = process.env.DROPTY_API_BASE_URL;

/* =====================
   CREATE
===================== */
export async function createCustomerWithApi(payload: any) {
  const token = await getAccessToken();
  if (!token) return { success: false, message: "Unauthorized" };

  const res = await fetch(`${BASE_URL}/api/v1/admin/users/customer/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || data?.success === 0) {
    return { success: false, message: data?.message };
  }

  return { success: true };
}

/* =====================
   UPDATE
===================== */
export async function updateCustomerWithApi(id: number, payload: any) {
  const token = await getAccessToken();
  if (!token) return { success: false };

  const res = await fetch(`${BASE_URL}/api/v1/admin/users/customer/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) return { success: false };
  return { success: true };
}

/* =====================
   DELETE
===================== */
export async function deleteCustomerWithApi(id: number) {
  const token = await getAccessToken();
  if (!token) return { success: false };

  const res = await fetch(`${BASE_URL}/api/v1/admin/users/customer/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return { success: false };
  return { success: true };
}

/* =====================
   STATUS TOGGLE
===================== */
export async function updateCustomerStatusWithApi(
  customerId: number,
  isActive: boolean,
) {
  const token = await getAccessToken();
  if (!token) return { success: false };

  const res = await fetch(
    `${BASE_URL}/api/v1/admin/users/customer/changeStatus/${customerId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isActive }),
    },
  );

  if (!res.ok) return { success: false };
  return { success: true };
}
/* get single customer details by id */
export async function fetchSingleCustomerWithApi(id: number) {
  const token = await getAccessToken();
  if (!token) return null;

  const res = await fetch(
    `${BASE_URL}/api/v1/admin/users/customer/detailsById/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data?.data ?? null;
}
/* =====================
   GET CUSTOMERS (LIST)
===================== */
// export async function getCustomersWithApi({
//   page,
//   limit,
//   searchKey = "",
// }: {
//   page: number;
//   limit: number;
//   searchKey?: string;
// }): Promise<{
//   customers: any[];
//   total: number;
// }> {
//   const token = await getAccessToken();
//   if (!token) {
//     return { customers: [], total: 0 };
//   }

//   const res = await fetch(
//     `${BASE_URL}/api/v1/admin/users/customer?page=${page}&limit=${limit}&searchKey=${searchKey}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       cache: "no-store",
//     },
//   );

//   if (!res.ok) {
//     return { customers: [], total: 0 };
//   }

//   const data = await res.json();

//   return {
//     customers: data?.data?.rows ?? [],
//     total: data?.data?.count ?? 0,
//   };
// }
// export async function getCustomersWithApi({
//   page,
//   limit,
//   searchKey = "",
//   isActive,
//   sortOrder = "DESC",
// }: {
//   page: number;
//   limit: number;
//   searchKey?: string;
//   isActive?: boolean;
//   sortOrder?: "ASC" | "DESC";
// }): Promise<{
//   customers: any[];
//   total: number;
// }> {
//   const token = await getAccessToken();
//   if (!token) {
//     return { customers: [], total: 0 };
//   }

//   const params = new URLSearchParams({
//     page: String(page),
//     limit: String(limit),
//     searchKey,
//     sortOrder,
//   });

//   if (isActive !== undefined) {
//     params.set("isActive", String(isActive));
//   }

//   const res = await fetch(
//     `${BASE_URL}/api/v1/admin/users/customer?${params.toString()}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       cache: "no-store",
//     }
//   );

//   if (!res.ok) {
//     return { customers: [], total: 0 };
//   }

//   const data = await res.json();

//   return {
//     customers: data?.data?.rows ?? [],
//     total: data?.data?.count ?? 0,
//   };
// }
export async function getCustomersWithApi({
  page,
  limit,
  searchKey,
  isActive,
  sortOrder = "DESC",
}: {
  page: number;
  limit: number;
  searchKey?: string;
  isActive?: boolean;
  sortOrder?: "ASC" | "DESC";
}): Promise<{
  customers: any[];
  total: number;
}> {
  const token = await getAccessToken();
  if (!token) {
    return { customers: [], total: 0 };
  }

  /* =========================
     BUILD QUERY PARAMS
  ========================= */
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortOrder,
  });

  // ✅ ONLY ADD searchKey IF IT EXISTS
  if (searchKey && searchKey.trim()) {
    params.set("searchKey", searchKey.trim());
  }

  // ✅ OPTIONAL FILTER
  if (isActive !== undefined) {
    params.set("isActive", String(isActive));
  }

  /* =========================
     API CALL
  ========================= */
  const res = await fetch(
    `${BASE_URL}/api/v1/admin/users/customer?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return { customers: [], total: 0 };
  }

  const data = await res.json();

  return {
    customers: data?.data?.rows ?? [],
    total: data?.data?.count ?? 0,
  };
}
