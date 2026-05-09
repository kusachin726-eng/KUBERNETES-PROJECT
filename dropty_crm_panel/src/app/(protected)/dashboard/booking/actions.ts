"use server";

import { getAccessToken } from "@/lib/getAuthToken";
import { getBookingsWithApi ,getCrewList ,assignCrewToBooking } from "@/lib/api/booking";

export async function getBookingsAction({
  page = 1,
  limit = 10,
  searchKey = "",
  status = "", 
}: {
  page?: number;
  limit?: number;
  searchKey?: string;
  status?: string; 
}) {
  const token = await getAccessToken();

  if (!token) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const res = await getBookingsWithApi(token, {
      page,
      limit,
      searchKey,
      status,
    });

    // return {
    //   success: true,
    //   rows: res?.data?.rows ?? [],
    //   totalPages: res?.data?.pagination?.totalPages ?? 1,
    //    total: res?.data?.pagination?.totalCount ?? 0,
    // };

return {
  success: true,
  rows: res?.data?.rows ?? [],
  totalPages: Math.ceil((res?.data?.count ?? 0) / limit),
  total: res?.data?.count ?? 0,
};


  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to fetch bookings",
    };
  }
}
// actions for crew list in booking details page


export async function getCrewListAction(searchKey:string="") {
  try {
    const res = await getCrewList(searchKey);

    return {
      success: true,
      data: res.data ?? [],
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to fetch crew list",
    };
  }
}


export async function assignCrewAction(
  bookingId: number,
  crewId: number
) {
  try {
    const res = await assignCrewToBooking({
      bookingId,
      crewId,
    });

    return {
      success: res.success,
      message: res.message,
      data: res.data,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to assign crew",
    };
  }
}
