
export const dynamic = "force-dynamic";

import { getFeaturesWithApi } from "@/lib/api/feature";
import FeaturesPageClient from "./features-page-client";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { buildPermissionMap } from "@/lib/permissions/buildPermissionMap";

type Props = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    sortOrder?: "asc" | "desc";
    isActive?: string;
    searchKey?: string;
  }>;
};

export default async function FeaturesPage({ searchParams }: Props) {
  const session = await getServerAuthSession();
  if (!session) redirect("/login");

  const permissionMap = buildPermissionMap(
    Array.isArray(session.permissions) ? session.permissions : [],
  );

  const {
    page: pageParam,
    limit: limitParam,
    sortOrder,
    isActive,
    searchKey,
  } = await searchParams;

  const page = Number(pageParam ?? 1);
  const limit = Number(limitParam ?? 10);

  // ✅ FIXED PATH (singular: feature)
  if (isActive === undefined || sortOrder === undefined) {
    if (isActive === undefined || sortOrder === undefined) {
      redirect(
        `/dashboard/rbac/feature?page=${page}&limit=${limit}&isActive=${isActive ?? "true"}&sortOrder=${sortOrder ?? "desc"}&searchKey=${searchKey ?? ""}`,
      );
    }
  }

  const isActiveBoolean = isActive === "true";
  const apiSortOrder = sortOrder === "asc" ? "ASC" : "DESC";

  const result = await getFeaturesWithApi({
    page,
    limit,
    isActive: isActiveBoolean,
    sortOrder: apiSortOrder,
    searchKey,
  });

  if (!result || !result.features) {
    return <div>Loading...</div>;
  }

  const totalPages = Math.ceil(result.total / limit);

  if (page > totalPages && totalPages > 0) {
    redirect(
      `/dashboard/rbac/feature?page=1&limit=${limit}&isActive=${isActive ?? "true"}&sortOrder=${sortOrder ?? "desc"}&searchKey=${searchKey ?? ""}`,
    );
  }

  return (
    <FeaturesPageClient
      result={result}
      currentPage={page}
      totalPages={totalPages}
      permissions={permissionMap}
    />
  );
}
