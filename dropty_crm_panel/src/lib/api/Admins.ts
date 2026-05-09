import "server-only";
import { apiGetJson, apiPostJson, apiPatchJson, apiDeleteJson } from "@/lib/api/client";
import { getAccessToken } from "@/lib/getAuthToken";
import { redirect } from "next/navigation";
import type { AdminListResult } from "@/lib/data/admin";

// Get Admin
// export async function getAdminsWithApi({
//   page,
//   limit,
//   searchKey,
// }: {
//   page?: number;
//   limit?: number;
//   searchKey?: string;
// }): Promise<AdminListResult> {
//   const accessToken = await getAccessToken();

//   // ✅ Redirect EARLY
//   if (!accessToken) {
//     redirect("/login");
//   }

//   const result: any = await apiGetJson(
//     // `/api/v1/admin/roleAndPermission/adminList?page=${page}&limit=${limit}`,
//     `/api/v1/admin/users/admin?userType=admin&page=${page}&limit=${limit}&searchKey=${searchKey}`,
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     }
//   );

//   const admins = result.data.rows.map((admin: any) => ({
//     id: admin.id,
//     name: admin.name ?? "N/A",
//     email: admin.email ?? "N/A",
//     phone: admin.mobile_number ?? "N/A",
//     createdAt: admin.createdAt,
//     updatedAt: admin.updatedAt,
//     isActive: admin.isActive,
//     role: admin.user_type ?? "N/A",
//   }));

//   return {
//     admins,
//     total: result.data.count,
//   };
// }
export async function getAdminsWithApi({
  page = 1,
  limit = 10,
  searchKey = "",
  isActive,
  sortOrder = "DESC",
}: {
  page?: number;
  limit?: number;
  searchKey?: string;
  isActive?: boolean;
  sortOrder?: "ASC" | "DESC";
}): Promise<AdminListResult> {
  const accessToken = await getAccessToken();

  // ✅ Redirect early if not authenticated
  if (!accessToken) {
    redirect("/login");
  }

  // ✅ BUILD QUERY PARAMS (SAFE & CONSISTENT)
  const params = new URLSearchParams({
    userType: "admin",
    page: String(page),
    limit: String(limit),
    sortOrder, // 🔥 BACKEND SORT
  });

  if (searchKey) {
    params.set("searchKey", searchKey);
  }

  if (isActive !== undefined) {
    params.set("isActive", String(isActive));
  }

  console.log("📤 ADMIN API PARAMS →", Object.fromEntries(params.entries()));

  const result: any = await apiGetJson(
    `/api/v1/admin/users/admin?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const admins = result.data.rows.map((admin: any) => ({
    id: admin.id,
    name: admin.name ?? "N/A",
    email: admin.email ?? "N/A",
    phone: admin.mobile_number ?? "N/A",
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
    isActive: admin.isActive,
    role: admin.user_type ?? "N/A",
  }));

  console.log(
    "📦 Admins from backend:",
    admins.map((a: any) => ({
      id: a.id,
      createdAt: a.createdAt,
      isActive: a.isActive,
    }))
  );

  return {
    admins,
    total: result.data.count,
  };
}


// Create Admin
export async function createAdminWithApi(payload: {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  mobile_number: string;
  password: string;
  // admin_role_id: number;
}): Promise<{ success: boolean; message?: string }> {
  const accessToken = await getAccessToken();

  // ✅ Redirect EARLY
  if (!accessToken) {
    redirect("/login");
  }

  try {
    const result: any = await apiPostJson(
      // "/api/v1/admin/roleAndPermission/createAdmin",
      "api/v1/admin/users/admin/create",
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return {
      success: true,
      message: result?.message ?? "Admin created successfully",
    };
  } catch (error: any) {
    console.error("❌ CREATE ADMIN API ERROR:", error);

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create admin",
    };
  }
}

// Update Admin
export async function updateAdminWithApi(
  adminId: number,
  payload: {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    email: string;
    mobile_number: string;
    password?: string;
    // admin_role_id: number;
    // isActive: boolean;
  }
): Promise<{ success: boolean; message?: string }> {
  const accessToken = await getAccessToken();

  // ✅ Redirect EARLY
  if (!accessToken) {
    redirect("/login");
  }

  try {
    const result: any = await apiPatchJson(
      // `/api/v1/admin/roleAndPermission/updateAdmin/${adminId}`,
      `/api/v1/admin/users/admin/${adminId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return {
      success: true,
      message: result?.message ?? "Admin updated successfully",
    };
  } catch (error: any) {
    console.error("❌ UPDATE ADMIN API ERROR:", error);

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update admin",
    };
  }
}

// Delete Admin
export async function deleteAdminWithApi(
  adminId: number
): Promise<{ success: boolean; message: string }> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return { success: false, message: "Authentication required" };
  }

  try {
    const res = await apiDeleteJson<{
      success: number;
      message: string;
    }>(
      // `/api/v1/admin/roleAndPermission/deleteAdmin/${adminId}`,
      `/api/v1/admin/users/admin/${adminId}`,
      undefined, // ❌ NO BODY
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return {
      success: res.success === 1,
      message: res.message,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Delete failed",
    };
  }
}
// single admin detail
// Get Single Admin By ID
// export async function getAdminByIdWithApi(
//   adminId: number
// ): Promise<{
//   success: boolean;
//   data?: any;
//   message?: string;
// }> {
//   const accessToken = await getAccessToken();

//   if (!accessToken) {
//     redirect("/login");
//   }

//   try {
//     const result: any = await apiGetJson(
//       `/api/v1/admin/roleAndPermission/getAdminById/${adminId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     return {
//       success: result.success === 1,
//       data: result.data,
//     };
//   } catch (error: any) {
//     console.error("❌ GET ADMIN BY ID ERROR:", error);

//     return {
//       success: false,
//       message:
//         error?.response?.data?.message ||
//         error?.message ||
//         "Failed to fetch admin details",
//     };
//   }
// }



export async function getAdminByIdWithApi(adminId: number) {
  const accessToken = await getAccessToken();
  if (!accessToken) redirect("/login");

  try {
    const result: any = await apiGetJson(
      `/api/v1/admin/users/admin/detailsById/${adminId}`, // ✅ FIXED
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch admin",
    };
  }
}
