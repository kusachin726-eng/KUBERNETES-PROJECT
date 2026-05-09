import "server-only";

import { apiGetJson ,apiDeleteJson ,apiPatchJson } from "@/lib/api/client";
import type { Staff } from "@/lib/data/staff";
import { getAccessToken } from "@/lib/getAuthToken";
import { redirect } from "next/navigation";

export type GetStaffApiResponse = {
  success: boolean;
  data: {
    rows: Staff[];      
    count: number;
  };
};

// export async function getStaffWithApi({
//   page,
//   limit,
//   userType,
//   searchKey,
// }: {
//   page: number;
//   limit: number;
//   userType: string;
//   searchKey: string;
// }) {
 
//   const accessToken = await getAccessToken();

//   try {
//     const result = await apiGetJson<{
//       success: boolean;
//       data: { rows: Staff[]; count: number };
//     }>(
//       `/api/v1/admin/users?userType=${userType}&page=${page}&limit=${limit}&searchKey=${searchKey}`,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );


//     return {
//       staff: result.data.rows,
//       total: result.data.count,
//       source: "external" as const,
//     };
//   } catch (err: any) {

//     throw err;
//   }
// }
export async function getStaffWithApi({
  page,
  limit,
  userType,
  searchKey = "",
  isActive,
  sortOrder = "DESC",
}: {
  page: number;
  limit: number;
  userType: string;
  searchKey?: string;
  isActive?: boolean;
  sortOrder?: "ASC" | "DESC";
}) {
  const accessToken = await getAccessToken();

  const params = new URLSearchParams({
    userType,
    page: String(page),
    limit: String(limit),
    searchKey,
    sortOrder,
  });

  if (isActive !== undefined) {
    params.set("isActive", String(isActive));
  }

  try {
    const result = await apiGetJson<GetStaffApiResponse>(
      `/api/v1/admin/users?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return {
      staff: result.data.rows,
      total: result.data.count,
      source: "external" as const,
    };
  } catch (err: any) {
    throw err;
  }
}

// delete staff by id 
export type DeleteStaffApiResponse = {
  success: boolean;
  message: string;
};

export async function deleteStaffById(
  userId: number | string
): Promise<DeleteStaffApiResponse> {
  const accessToken = await getAccessToken();

  return await apiDeleteJson<DeleteStaffApiResponse>(
    `/api/v1/admin/users/${userId}`,
    undefined,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
//  update the staff details by id 


export type UpdateStaffApiResponse = {
  success: boolean;
  message: string;
};

export async function updateStaffById(
  userId: number | string,
  payload: {
    email?: string | null;
    isActive?: boolean;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string | null;
    gender?: string | null;
    dateOfBirth?: string | null;
    bio?: string | null;
  }
): Promise<UpdateStaffApiResponse> {
  const accessToken = await getAccessToken();


  const cleanedPayload = Object.fromEntries(
    Object.entries(payload).filter(
      ([_, value]) => value !== undefined
    )
  );

  return await apiPatchJson<UpdateStaffApiResponse>(
    `/api/v1/admin/users/${userId}`,
    cleanedPayload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
// get staff by id 
export type StaffDetailsByIdResponse = {
  success: boolean;
  data: {
    id: number;
    country_code: string;
    mobile_number: string;
    email: string | null;
    isActive: boolean;
    isMobileVerified: boolean;
    isEmailVerified: boolean;
    user_type: string;
    admin_role_id: number | null;
    createdAt: string;
    updatedAt: string;

    userProfile: {
      id: number;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
      gender: string | null;
      dateOfBirth: string | null;
      bio: string | null;
    };
  };
};
export async function getStaffById(
  userId: number | string
): Promise<StaffDetailsByIdResponse> {
  const accessToken = await getAccessToken();

  return await apiGetJson<StaffDetailsByIdResponse>(
    `/api/v1/admin/users/detailsById/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

// update the status of staff 
export type UpdateStaffStatusApiResponse = {
  success: boolean | number;
  message: string;
};

export async function updateStaffStatus(
  userId: number,
  isActive: boolean
): Promise<UpdateStaffStatusApiResponse> {
  const accessToken = await getAccessToken();

  return await apiPatchJson<UpdateStaffStatusApiResponse>(
    `/api/v1/admin/users/changeStatus/${userId}`,
    { isActive },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
