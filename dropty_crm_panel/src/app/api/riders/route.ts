import { NextResponse } from "next/server";
import { createCrewServer } from "@/lib/api/riders";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await createCrewServer(body);

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("❌ /api/riders error:", err);

    return NextResponse.json(
      {
        success: 0,
        message: err.message || "Failed to create rider",
      },
      { status: err.status || 400 },
    );
  }
}


import { validateCrewUniqueServer } from "@/lib/api/riders";





export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const email = searchParams.get("email") || undefined;
  const mobile_number = searchParams.get("mobile_number") || undefined;
  const userIdParam = searchParams.get("userId");

  const userId = userIdParam ? Number(userIdParam) : undefined;

  try {
    const result = await validateCrewUniqueServer({
      userId,           // ✅ PASS THIS
      email,
      mobile_number,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      {
        success: 0,
        message: err?.message || "Validation failed",
      },
      { status: 400 },
    );
  }
}
