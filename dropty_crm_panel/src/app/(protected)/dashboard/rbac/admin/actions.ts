"use server";

import { createAdminWithApi, updateAdminWithApi, deleteAdminWithApi ,getAdminByIdWithApi } from "@/lib/api/Admins";

// Create Admin
export async function createAdminAction(payload: {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  mobile_number: string;
  password: string;
  // admin_role_id: number;
}) {
  return createAdminWithApi(payload);
}


// Update Admin
export async function updateAdminAction(
  adminId: string,
  payload: {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    email: string;
    mobile_number: string;
    password?: string;
    // admin_role_id: number;
    // isActive: boolean;
  }
) {
  return updateAdminWithApi(Number(adminId), payload);
}

// Delete Admin
export async function deleteAdminAction(adminId: number) {
  return deleteAdminWithApi(adminId);
}




// ✅ Get Single Admin
export async function getAdminByIdAction(adminId: number) {
  return getAdminByIdWithApi(adminId);
}


