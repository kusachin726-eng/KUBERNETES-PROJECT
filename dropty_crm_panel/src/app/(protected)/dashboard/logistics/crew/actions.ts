"use server";

import {
  deleteCrewServer,
  updateCrewServer,
  type UpdateCrewPayload,
    type CreateRiderPayload, 
  updateCrewStatusServer,
  fetchSingleCrewServer,
  validateCrewUniqueField,
  createCrewServer,
} from "@/lib/api/riders";

/* =====================
   DELETE RIDER
===================== */
export async function deleteRiderAction(riderId: string) {
  

  const result = await deleteCrewServer(Number(riderId)); // riderId === userId


  return result;
}

/* =====================
   UPDATE RIDER
===================== */
export async function updateRiderAction(
  riderId: string,
  payload: UpdateCrewPayload,
) {
 

  const result = await updateCrewServer(Number(riderId), payload); // riderId === userId


  return result;
}

/* =====================
   UPDATE RIDER STATUS
===================== */
export async function updateRiderStatusAction(
  userId: number,
  isActive: boolean,
) {
  try {
    return await updateCrewStatusServer(userId, isActive);
  } catch (error) {
   
    return {
      success: false,
      message: "Failed to update rider status",
    };
  }
}

/* =====================
   FETCH SINGLE RIDER
===================== */
export async function fetchSingleRiderAction(userId: number) {
  try {
    const result = await fetchSingleCrewServer(userId);
    return result;
  } catch (error) {
    
    return {
      success: false,
      message: "Failed to fetch rider details",
    };
  }
}

/* =====================
   UNIQUENESS CHECKS (for add/edit form real-time validation)
===================== */

/**
 * Server action — check if email is already taken
 */
export async function checkEmailUniqueAction(email: string, userId?: number) {
  if (!email?.trim() || !email.includes("@")) {
    return { available: true, message: "" };
  }

  try {
    const result = await validateCrewUniqueField("email", email.trim(), userId);

    if (!result.isAvailable) {
      return {
        available: false,
        message: result.errorMessage || "This email is already registered",
      };
    }

    return { available: true, message: "" };
  } catch (err) {
  
    return {
      available: false,
      message: "Cannot check email availability right now",
    };
  }
}

/**
 * Server action — check if mobile number is already taken
 */
export async function checkMobileUniqueAction(mobile: string, userId?: number) {
  if (!mobile?.trim() || mobile.length !== 10 || !/^\d{10}$/.test(mobile)) {
    return { available: true, message: "" };
  }

  try {
    const result = await validateCrewUniqueField(
      "mobile_number",
      mobile.trim(),
      userId,
    );

    if (!result.isAvailable) {
      return {
        available: false,
        message:
          result.errorMessage || "This mobile number is already registered",
      };
    }

    return { available: true, message: "" };
  } catch (err) {
  
    return {
      available: false,
      message: "Cannot check mobile availability right now",
    };
  }
}
// create crew actions


export async function createRiderAction(payload: CreateRiderPayload) {
  
  const result = await createCrewServer(payload);

  if (!result?.rider?.id) {
    throw new Error("Failed to create rider");
  }

  return {
    success: true,
  };
}

