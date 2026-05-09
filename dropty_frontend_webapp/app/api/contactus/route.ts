import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      mobile_number,
      subject,
    } = body;

    // ✅ Validation (only required fields)
    if (!name || !email || !mobile_number || !subject) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // 🟡 TEMPORARY: simulate DB save
    console.log("Contact form data received:", {
      name,
      email,
      mobile_number,
      subject,
    });

    // Simulate async operation
    await new Promise((res) => setTimeout(res, 500));

    return NextResponse.json(
      { message: "Contact submitted successfully (mock)" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact API error:", error);

    return NextResponse.json(
      { message: "Invalid request" },
      { status: 400 }
    );
  }
}
