
// // import CitiesClient from "./citiesclient";
// // import { getServerAuthSession } from "@/lib/auth";
// // import { redirect } from "next/navigation";
// // import { fetchCitiesServer } from "@/lib/api/cities";
// // import { buildPermissionMap } from "@/lib/permissions/buildPermissionMap";

// // export default async function CitiesPage() {
// //   const session = await getServerAuthSession();
// //   if (!session) redirect("/login");

// //   const permissionsArray = Array.isArray(session.permissions)
// //       ? session.permissions
// //       : [];
  
// //   const permissionMap = buildPermissionMap(permissionsArray);
    

// //   const { cities } = await fetchCitiesServer();

// //   return (
// //     <div className="space-y-4">
// //       <CitiesClient cities={cities} permissions={permissionMap} />
// //     </div>
// //   );
// // }
// export const dynamic = "force-dynamic";

// import { redirect } from "next/navigation";
// import { getServerAuthSession } from "@/lib/auth";
// import { fetchCitiesServer } from "@/lib/api/cities";
// import CitiesTableClient from "./citiesclient";
// import { buildPermissionMap } from "@/lib/permissions/buildPermissionMap";

// interface SearchParams {
//   page?: string;
//   limit?: string;
//   searchKey?: string;
//   isActive?: string;
// }

// export default async function CitiesPage({
//   searchParams,
// }: {
//   searchParams: SearchParams;
// }) {
//   const session = await getServerAuthSession();
//   if (!session) redirect("/login");

//   const page = Number(searchParams.page ?? 1);
//   const limit = Number(searchParams.limit ?? 10);
//   const searchKey = searchParams.searchKey ?? "";

//   const isActive =
//     searchParams.isActive !== undefined
//       ? searchParams.isActive === "true"
//       : undefined;

//   const { cities, total } = await fetchCitiesServer({
//     page,
//     limit,
//     searchKey,
//     isActive,
//   });

//   const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;
//   const safeTotal = Number.isFinite(total) ? total : 0;

//   const totalPages = Math.max(1, Math.ceil(safeTotal / safeLimit));

//   if (page > totalPages) {
//     redirect(`/dashboard/cities?page=1&limit=${safeLimit}`);
//   }

//   const permissions = buildPermissionMap(
//     Array.isArray(session.permissions) ? session.permissions : [],
//   );

//   return (
//     <CitiesTableClient
//       cities={cities}
//       total={safeTotal}
//       currentPage={page}
//       totalPages={totalPages}
//       permissions={permissions}
//     />
//   );
// }
export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { fetchCitiesServer } from "@/lib/api/cities";
import CitiesClient from "./citiesclient";
import { buildPermissionMap } from "@/lib/permissions/buildPermissionMap";

export default async function CitiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    searchKey?: string;
    isActive?: string;
  }>;
}) {
  const session = await getServerAuthSession();
  if (!session) redirect("/login");

  /* ✅ IMPORTANT: unwrap searchParams */
  const params = await searchParams;

  const page = Number(params.page ?? 1);
  const limit = Number(params.limit ?? 10);
  const searchKey = params.searchKey ?? "";

  /* ✅ Default isActive like Staff */
  if (params.isActive === undefined) {
    redirect(`/dashboard/cities?page=${page}&isActive=true`);
  }

  const isActive = params.isActive === "true";

  const { cities, total } = await fetchCitiesServer({
    page,
    limit,
    searchKey,
    isActive,
  });

  const totalPages = Math.ceil(total / limit);

  /* ✅ Pagination overflow protection */
  if (page > totalPages && totalPages > 0) {
    redirect(`/dashboard/cities?page=1&isActive=${isActive}`);
  }

  const permissions = buildPermissionMap(
    Array.isArray(session.permissions) ? session.permissions : [],
  );

  return (
    <CitiesClient
      cities={cities}
      total={total}
      currentPage={page}
      totalPages={totalPages}
      permissions={permissions}
    />
  );
}
