"use server";

import {
  createAirlineServer,
  type CreateAirlinePayload,
  fetchSingleAirlineServer,
  deleteAirlineServer,
  addExtraBagFareServer,
  AddExtraBagFarePayload,
  updateAirlineServer,
  updateExtraBagFareServer,
  deleteExtraBagFareServer,
} from "@/lib/api/airlines";
// action for adding the airlines
export async function createAirlineAction(payload: CreateAirlinePayload) {
  if (!payload.airlineName?.trim()) {
    return {
      success: false,
      message: "Airline name is required",
    };
  }

  const result = await createAirlineServer(payload);

  if (!result?.airline?.id) {
    throw new Error("Failed to create airline");
  }

  return {
    success: true,
  };
}
// api for delete api for airlines
export async function deleteAirlineAction(airlineId: string) {
  const result = await deleteAirlineServer(Number(airlineId));
  return result;
}
// get single airlines details
export async function fetchSingleAirlineAction(airlineId: number) {
  return await fetchSingleAirlineServer(airlineId);
}
// api for adding the fares and other details of api
export async function addExtraBagFareAction(
  airlineId: number,
  payload: AddExtraBagFarePayload,
) {
  return await addExtraBagFareServer(airlineId, payload);
}
// update airlines
export async function updateAirlineAction(
  airlineId: number,
  payload: {
    airlineName: string;
    isActive: boolean;
  },
) {
  return updateAirlineServer(airlineId, payload);
}
// update the extra fare

export async function updateExtraBagFareAction(
  fareId: number,
  additionalKgFare: number,
): Promise<{
  success: boolean;
  message?: string;
}> {
  const result = await updateExtraBagFareServer(fareId, {
    additionalKgFare,
  });

  return {
    success: result.success,
    message: result.message,
  };
}
// delete the extra fares
export async function deleteExtraBagFareAction(fareId: number): Promise<{
  success: boolean;
  message?: string;
}> {
  const result = await deleteExtraBagFareServer(fareId);

  return {
    success: result.success,
    message: result.message,
  };
}
