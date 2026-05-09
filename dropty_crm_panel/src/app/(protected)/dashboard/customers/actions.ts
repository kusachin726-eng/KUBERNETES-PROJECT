
"use server";
import {
  createCustomerWithApi,
  updateCustomerWithApi,
  deleteCustomerWithApi,
  updateCustomerStatusWithApi,
} from "@/lib/api/customers";

/* =====================
   CREATE CUSTOMER
===================== */
export async function createCustomerAction(
  payload: {
    firstName: string;
    lastName: string;
    email?: string | null;
    gender?: string | null;
    dateOfBirth?: string | null;
    mobile_number: string;
    isActive: boolean;
  }
): Promise<{ success: boolean; message?: string }> {
  return createCustomerWithApi(payload);
}

/* =====================
   UPDATE CUSTOMER
===================== */
export async function updateCustomerAction(
  id: number,
  payload: {
    firstName?: string;
    lastName?: string;
    email?: string | null;
    gender?: string | null;
    dateOfBirth?: string | null;
    isActive?: boolean;
  }
): Promise<{ success: boolean; message?: string }> {
  return updateCustomerWithApi(id, payload);
}

/* =====================
   DELETE CUSTOMER
===================== */
export async function deleteCustomerAction(
  id: number
): Promise<{ success: boolean; message?: string }> {
  return deleteCustomerWithApi(id);
}

/* =====================
   UPDATE CUSTOMER STATUS
===================== */
export async function updateCustomerStatusAction(
  customerId: number,
  isActive: boolean
): Promise<{ success: boolean; message?: string }> {
  return updateCustomerStatusWithApi(customerId, isActive);
}
// fetch single customer details

import { fetchSingleCustomerWithApi } from "@/lib/api/customers";

export async function fetchSingleCustomerAction(id: number) {
  return fetchSingleCustomerWithApi(id);
}
