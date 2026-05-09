"use server";

import { deleteStaffById, updateStaffById ,getStaffById ,updateStaffStatus } from "@/lib/api/staff";
import { revalidatePath } from "next/cache";

export async function deleteStaffAction(staffId: number) {
  try {
    const result = await deleteStaffById(staffId);

    // Revalidate staff page so table refreshes
    revalidatePath("/dashboard/staff");

    return {
      success: true,
      message: result.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to delete staff",
    };
  }
}

export async function updateStaffAction(
  staffId: number,
  payload: {
    email?: string | null;
    isActive?: boolean;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string | null;
    gender?: string | null;
    dateOfBirth?: string | null;
    bio?: string | null;
  },
) {
  try {
    const result = await updateStaffById(staffId, payload);

    revalidatePath("/dashboard/staff");

    return {
      success: true,
      message: result.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update staff",
    };
  }
}
// get single staff details by id

export async function getStaffByIdAction(staffId: number) {
  try {
    const result = await getStaffById(staffId);

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch staff details",
    };
  }
}
// update the staff status





export async function updateStaffStatusAction(
  userId: number,
  isActive: boolean
) {
  try {
    const result = await updateStaffStatus(userId, isActive);

    if (!(result.success === true || result.success === 1)) {
      return {
        success: false,
        message: result.message || "Failed to update staff status",
      };
    }

    // refresh staff list & details
    revalidatePath("/dashboard/staff");
    revalidatePath(`/dashboard/staff/${userId}`);

    return {
      success: true,
      message: result.message,
      isActive,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong",
    };
  }
}
