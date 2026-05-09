"use server";

import {
  getProfileWithApi,
  updateProfile,
  GetProfileApiResponse,
} from "@/lib/api/profile";

import { revalidatePath } from "next/cache";


// ✅ Properly typed action
export async function getProfileAction(): Promise<GetProfileApiResponse> {
  try {
    const result = await getProfileWithApi();

    console.log("✅ ACTION PROFILE RESULT:", result);

    return result;
  } catch (error) {
    console.error("❌ PROFILE FETCH ERROR:", error);

    return {
      success: false,
      data: null as any, // fallback for TS (optional improvement below)
    };
  }
}


// update api actions





export async function updateProfileAction(
  payload: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string | null;
    gender?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
  }
) {
  try {
    const result = await updateProfile(payload);

    if (!result.success) {
      return {
        success: false,
        message: "Failed to update profile",
      };
    }

    // ✅ Refresh profile page
    revalidatePath("/dashboard/profile");

    return {
      success: true,
      message: "Profile updated successfully",
      data: result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong",
    };
  }
}
// actions for the profile post image
import { uploadProfileImage } from "@/lib/api/profile";

export async function uploadProfileImageAction(
  formData: FormData
) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, message: "No file selected" };
    }

    const result = await uploadProfileImage(file);

    return {
      success: true,
      fileName: result.data,
      message: result.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Upload failed",
    };
  }
}
// action for put request for the profile update




import { updateProfileAvatar } from "@/lib/api/profile";

/* ============================================================
   UPDATE PROFILE AVATAR ACTION
============================================================ */

export async function updateProfileAvatarAction(
  avatarUrl: string
) {
  try {
    const result = await updateProfileAvatar(avatarUrl);

    if (!result.success) {
      return {
        success: false,
        message: "Failed to update avatar",
      };
    }

    // Revalidate profile page so new image appears
    revalidatePath("/dashboard/profile");

    return {
      success: true,
      message: "Avatar updated successfully",
      data: result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong",
    };
  }
}

// get image on profile 
import { getProfileImageBlob } from "@/lib/api/profile";

export async function getProfileImageAction(fileName: string) {
  try {
    const blob = await getProfileImageBlob(fileName);

    const buffer = Buffer.from(await blob.arrayBuffer());

    return {
      success: true,
      imageBase64: buffer.toString("base64"),
      contentType: blob.type,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch image",
    };
  }
}
