import { NextResponse } from "next/server";
import { createFeatureServer } from "@/lib/api/feature";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const title = body?.title ?? body?.name;

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { success: false, message: "Feature title is required" },
        { status: 400 }
      );
    }

    const result = await createFeatureServer({ title });

    // 🔴 VERY IMPORTANT FIX
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Failed to create feature",
        },
        { status: 500 }
      );
    }

    // ✅ REAL SUCCESS
    return NextResponse.json({
      success: true,
      data: result.feature,
    });
  } catch (error: any) {
    console.error("/api/features/create error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
