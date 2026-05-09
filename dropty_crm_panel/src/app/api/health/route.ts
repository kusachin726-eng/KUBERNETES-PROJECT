import { NextResponse } from "next/server";

export async function GET() {
  // You can add database connectivity checks here in the future
  return NextResponse.json(
    { 
      status: "ok", 
      timestamp: new Date().toISOString(),
      service: "dropty-crm-panel"
    },
    { status: 200 }
  );
}
