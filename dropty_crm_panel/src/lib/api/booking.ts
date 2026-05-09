import { apiGetJson ,apiPostJson } from "@/lib/api/client";

// type BookingApiResponse = {
//   data: {
//     rows: any[];
//     pagination: {
//       totalPages: number;
//       totalCount: number;
//     };
//   };
// };

type BookingApiResponse = {
  data: {
    rows: any[];
    count: number;
  };
};


export async function getBookingsWithApi(
  token: string,
  {
    page = 1,
    limit = 10,
    searchKey = "",
    status = "",
  }: {
    page?: number;
    limit?: number;
    searchKey?: string;
    status?: string;
  }
): Promise<BookingApiResponse> {
  return apiGetJson(
    `/api/v1/admin/booking/list?page=${page}&limit=${limit}&searchKey=${searchKey}&bookingStatus=${status}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

import { getAccessToken } from "../getAuthToken";



export interface BookingDetailsResponse {
  success: boolean;
  data: any; // You can strongly type this later if needed
}

// Get booking details by ID
export async function getBookingById(
  bookingId: number | string
): Promise<BookingDetailsResponse> {
  const accessToken = await getAccessToken();

  console.log("🔐 ACCESS TOKEN:", accessToken);

  if (!accessToken) {
    throw new Error("No access token found");
  }

  return await apiGetJson<BookingDetailsResponse>(
    `/api/v1/admin/booking/details/${bookingId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
// get the crew list in booking details


export interface CrewApiResponse {
  success: boolean;
  data: {
    id: number;
    mobile_number: string;
    email: string | null;
    userProfile: {
      firstName: string;
      lastName: string;
    };
  }[];
}

export async function getCrewList(searchKey:string=""): Promise<CrewApiResponse> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  return apiGetJson<CrewApiResponse>(
    `/api/v1/admin/booking/crewList?searchKey=${searchKey}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
// assign the crew
// ==============================
// Assign Crew To Booking
// ==============================

export interface AssignCrewPayload {
  bookingId: number;
  crewId: number;
}

export interface AssignCrewApiResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    bookingStatus: string;
    updatedAt: string;
    logistics: {
      assignedCrewId: number;
      bookingId: number;
      pickupDate: string;
      pickupTimeSlotStart: string;
      pickupTimeSlotEnd: string;
    };
  };
}

export async function assignCrewToBooking(
  payload: AssignCrewPayload
): Promise<AssignCrewApiResponse> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("No access token found");
  }

  return await apiPostJson<AssignCrewApiResponse>(
    "/api/v1/admin/booking/assignCrew",
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}


