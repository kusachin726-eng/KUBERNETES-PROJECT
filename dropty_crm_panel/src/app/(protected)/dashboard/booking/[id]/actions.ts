"use server";

import { getBookingById } from "@/lib/api/booking";

// get single booking details by id
export async function getBookingByIdAction(bookingId: number) {
  try {
    const result = await getBookingById(bookingId);

    console.log("🟢 BOOKING DETAILS RESULT:", result);

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("❌ BOOKING DETAILS ERROR:", error);

    return {
      success: false,
      message: error?.message || "Failed to fetch booking details",
    };
  }
}
