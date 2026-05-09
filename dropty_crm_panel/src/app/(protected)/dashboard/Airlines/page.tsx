import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { buildPermissionMap } from "@/lib/permissions/buildPermissionMap";
import { getAirlinesWithApi } from "@/lib/api/airlines";
import { AirlinesTable } from "./airlinesTable";
import AirlinesPageClient from "./AirlinesPageClient";

import { PageHeader } from "@/components/page-header";

type Props = {
  searchParams: Promise<{
    page?: string;
    isActive?: string;
    searchKey?: string;
     limit?: string;
  }>;
};

export default async function AirlinesPage({ searchParams }: Props) {
  const session = await getServerAuthSession();
  if (!session) redirect("/login");

  const permissionMap = buildPermissionMap(
    Array.isArray(session.permissions) ? session.permissions : [],
  );

  const { page: pageParam, isActive, limit: limitParam, searchKey } = await searchParams;

  const page = Number(pageParam ?? 1);
  const limit = Number(limitParam ?? 10);
  const search = searchKey?.trim() ?? "";

  /* ===============================
     ✅ FIX 1: DEFAULT FILTER
     (EXACT same as Customers)
  =============================== */
  if (isActive === undefined) {
    redirect(`/dashboard/Airlines?page=${page}&isActive=true`);
  }

  /* ===============================
     ✅ FIX 2: SAFE BOOLEAN
  =============================== */
  const isActiveBoolean = isActive === "true";

  /* ===============================
     ✅ FETCH AIRLINES
  =============================== */
  const result = await getAirlinesWithApi({
    page,
    limit,
    isActive: isActiveBoolean,
    searchKey: search, // ✅ REAL SEARCH VALUE
  });

  const totalPages = Math.ceil(result.total / limit);

  /* ===============================
     ✅ FIX 3: PAGINATION OVERFLOW
     (THIS was missing earlier)
  =============================== */
  if (page > totalPages && totalPages > 0) {
    redirect(`/dashboard/Airlines?page=1&isActive=${isActive}`);
  }

  return (
    <div className="page-container">
      {/* Header Card */}
      <PageHeader title="Airlines" action={<AirlinesPageClient />} />

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <AirlinesTable
          airlines={result.airlines}
          currentPage={page}
          totalPages={totalPages}
          total={result.total}
          permissions={permissionMap}
        />
      </div>
    </div>
  );
}
