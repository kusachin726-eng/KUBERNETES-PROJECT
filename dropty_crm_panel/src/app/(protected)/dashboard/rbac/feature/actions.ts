"use server";

import { updateFeatureWithApi, deleteFeatureWithApi } from "@/lib/api/feature";

export async function updateFeatureAction(
  id: number,
  values: {
    title?: string;
    isActive?: boolean;
  }
): Promise<boolean> {
  const res = await updateFeatureWithApi(id, values);
  return res.success === true; // ✅ NO ERROR NOW
}


export async function deleteFeatureAction(
  id: number
): Promise<{ success: boolean; message?: string }> {
  return deleteFeatureWithApi(id);
}
