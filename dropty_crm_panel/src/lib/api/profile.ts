import "server-only";

import { apiGetJson, apiPutJson ,apiPostFormData } from "@/lib/api/client";
import { getAccessToken } from "@/lib/getAuthToken";
import { redirect } from "next/navigation";

/* ================= TYPES ================= */

export type GetProfileApiResponse = {
  success: boolean;
  data: {
    id: number;
    mobile_number: string;
    email: string;
    userProfile: {
      userId: number;
      firstName: string;
      lastName: string;
      dateOfBirth: string | null;
      gender: string | null;
      bio: string | null;
      avatarUrl: string | null;
    };
    isProfile: boolean;
  } | null;
};

/* ================= API ================= */

export async function getProfileWithApi(): Promise<GetProfileApiResponse> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    redirect("/login");
  }

  const result = await apiGetJson<GetProfileApiResponse>(
    `/api/v1/user/profile`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  console.log("✅ RAW PROFILE API RESPONSE:", result);

  return result;
}


// update user profile
import "server-only";




export type UpdateProfileApiResponse = {
  success: boolean;
  data: {
    id: number;
    userId: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string | null;
    gender: string | null;
    bio: string | null;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
  };
};


export async function updateProfile(
  payload: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string | null;
    gender?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
  }
): Promise<UpdateProfileApiResponse> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  // ✅ Remove undefined values (same as staff)
  const cleanedPayload = Object.fromEntries(
    Object.entries(payload).filter(
      ([_, value]) => value !== undefined
    )
  );

  console.log("📤 PROFILE UPDATE PAYLOAD →", cleanedPayload);

  return await apiPutJson<UpdateProfileApiResponse>(
    `/api/v1/user/profile`,
    cleanedPayload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
// api for post request image
/* ================= UPLOAD PROFILE IMAGE ================= */

export type UploadProfileImageApiResponse = {
  success: boolean;
  message: string;
  data: string; // filename returned from backend
};

export async function uploadProfileImage(
  file: File
): Promise<UploadProfileImageApiResponse> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const formData = new FormData();
  formData.append("file", file);

  return await apiPostFormData<UploadProfileImageApiResponse>(
    `/api/v1/user/profile-image`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
// upload the profile image action (PUT)
/* ============================================================
   UPDATE PROFILE
============================================================ */

// export type UpdateProfileApiResponse = {
//   success: boolean;
//   data: {
//     id: number;
//     userId: number;
//     firstName: string;
//     lastName: string;
//     dateOfBirth: string | null;
//     gender: string | null;
//     bio: string | null;
//     avatarUrl: string | null;
//     createdAt: string;
//     updatedAt: string;
//   };
// };

export async function updateProfileAvatar(
  avatarUrl: string
): Promise<UpdateProfileApiResponse> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  // ✅ First get existing profile
  const profile = await getProfileWithApi();

  if (!profile.success || !profile.data) {
    throw new Error("Failed to fetch profile");
  }

  const existing = profile.data.userProfile;

  return await apiPutJson<UpdateProfileApiResponse>(
    `/api/v1/user/profile`,
    {
      firstName: existing.firstName,
      lastName: existing.lastName,
      dateOfBirth: existing.dateOfBirth ?? "",
      gender: existing.gender ?? "",
      bio: existing.bio ?? "",
      avatarUrl: avatarUrl,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
// get the profile image 
import { apiGetImage } from "./client";


export async function getProfileImageBlob(
  fileName: string,
  size: "small" | "medium" | "large" = "small"
): Promise<Blob> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  return await apiGetImage(
    `/api/v1/storage/image/${fileName}?size=${size}&folder=admin/profile`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}







