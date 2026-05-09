import { NextRequest } from "next/server";
import { apiGetJson, getApiBaseUrl } from "@/lib/api/client";
import { getAccessToken } from "@/lib/getAuthToken";

export async function GET(req: NextRequest) {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    return Response.json(
      { success: false, message: "Backend URL not configured" },
      { status: 500 }
    );
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") ?? "1";

  const result = await apiGetJson<any>(
    `/api/v1/admin/settings?page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return Response.json({
    success: true,
    data: {
      count: result.data.count,
      rows: result.data.rows.map((s: any) => ({
        id: String(s.id),
        title: s.title,
        slug: s.slug,
        metadata: {
          baseFare: s.metaData.baseFare,
          extraPerBagFare: s.metaData.extraPerBagFare,
          freeDistancekm: s.metaData.freeDistanceKm,
          perkmfareAfterFree: s.metaData.perKmFareAfterFree,
          gstpercentage: s.metaData.gstPercentage,
          insuranceperbag: s.metaData.insurancePercentage,
          platformFee: s.metaData.platformFee,
          convenienceFee: s.metaData.convenienceFee,
        },
        status: s.isActive ? "active" : "inactive",
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
    },
  });
}

