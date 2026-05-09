"use server";

import { pool } from "@/lib/db";

export async function submitContact(formData: FormData) {
  try {
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      mobile_number: String(formData.get("mobile_number") || "").trim(),
      subject: String(formData.get("subject") || "").trim(),
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.mobile_number ||
      !payload.subject
    ) {
      return { ok: false, message: "All fields are required" };
    }

    // ✅ Hardcoded message (as requested)
    const message = "Contact form submission";

    // ✅ Explicitly send created_at using NOW()
    await pool.query(
      `
      INSERT INTO dropty_contactus
      (name, email, mobile_number, subject, message, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      `,
      [
        payload.name,
        payload.email,
        payload.mobile_number,
        payload.subject,
        message,
      ]
    );

    return { ok: true };
  } catch (err: any) {
    console.error("❌ FULL DB ERROR:", {
      message: err?.message,
      code: err?.code,
      detail: err?.detail,
    });

    return { ok: false, message: "Database error" };
  }
}


