// import { getAdminsWithApi } from "@/lib/api/Admins";
// import AdminPageClient from "./admin-client";
// import { buildPermissionMap } from "@/lib/permissions/buildPermissionMap";
// import { getServerAuthSession } from "@/lib/auth";
// import { redirect } from "next/navigation";

// export default async function AdminClient({
//   searchParams,
// }: {
//   searchParams: Promise<{
//     page?: string;
//     searchKey?: string;
//     limit?: string;
//     sortBy?: string;
//     sortOrder?: "asc" | "desc";
//   }>;
// }) {

//   const session = await getServerAuthSession();
//   if (!session) redirect("/login");

//   const permissionsArray = Array.isArray(session.permissions)
//        ? session.permissions
//        : [];
   
//   const permissionMap = buildPermissionMap(permissionsArray);

//  const params = await searchParams;

//   const page = Number(params?.page ?? 1);
//   const searchKey = params?.searchKey ?? "";
//  const limit = Number(params.limit ?? 10); 
//  const sortBy = params?.sortBy;
// const sortOrder = params?.sortOrder;
     
//   // const result = await getAdminsWithApi({ page: 1, limit: 30 });
//   const result = await getAdminsWithApi({
//     page,
//     limit,
//     searchKey,
//   });
//   let sortedAdmins = [...result.admins];

// if (sortBy && sortOrder) {
//   console.log("🔃 Sorting Admins");
//   console.log("Sort By:", sortBy);
//   console.log("Sort Order:", sortOrder);

//   sortedAdmins.sort((a: any, b: any) => {
//     let aValue = a[sortBy];
//     let bValue = b[sortBy];

//     // 🕒 createdAt sorting
//     if (sortBy === "createdAt") {
//       aValue = new Date(aValue).getTime();
//       bValue = new Date(bValue).getTime();
//     }

//     // ✅ boolean status sorting (if needed later)
//     if (typeof aValue === "boolean") {
//       aValue = aValue ? 1 : 0;
//       bValue = bValue ? 1 : 0;
//     }

//     if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
//     if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
//     return 0;
//   });

//   console.log(
//     `✅ Sorted ${sortOrder === "asc" ? "ASCENDING ⬆️" : "DESCENDING ⬇️"}`
//   );
// }


//   return (
//   // <AdminPageClient admins={result.admins} permissions={permissionMap} />
//    <AdminPageClient
//       admins={result.admins}
//       total={result.total}
//       currentPage={page}
//       limit={limit}
//       searchKey={searchKey}
//         loggedInAdminId={session.user.id}
//       permissions={permissionMap}
//     />
//   );
// }





import { getAdminsWithApi } from "@/lib/api/Admins";
import AdminPageClient from "./admin-client";
import { buildPermissionMap } from "@/lib/permissions/buildPermissionMap";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminClient({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    searchKey?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isActive?: string;
  }>;
}) {
  const session = await getServerAuthSession();
  if (!session) redirect("/login");

  const permissionsArray = Array.isArray(session.permissions)
    ? session.permissions
    : [];

  const permissionMap = buildPermissionMap(permissionsArray);

  const params = await searchParams;

  const page = Number(params?.page ?? 1);
  const searchKey = params?.searchKey ?? "";
  const limit = Number(params.limit ?? 10);
  const sortBy = params?.sortBy;
  const sortOrder = params?.sortOrder;
  const isActive = params?.isActive;

  /* =====================
     ✅ URL NORMALIZATION (SAME AS COMMENTED CODE)
  ===================== */
  if (isActive === undefined || sortOrder === undefined) {
    redirect(
      `/dashboard/rbac/admin?page=${page}&limit=${limit}&searchKey=${searchKey}&isActive=${isActive ?? "true"}&sortOrder=${sortOrder ?? "desc"}`
    );
  }

  /* =====================
     ✅ PARSE VALUES
  ===================== */
  const isActiveBoolean = isActive === "true";
  const apiSortOrder = sortOrder === "asc" ? "ASC" : "DESC";

  console.log("📤 ADMIN PAGE PARAMS →", {
    page,
    limit,
    searchKey,
    isActive: isActiveBoolean,
    sortOrder: apiSortOrder,
  });

  /* =====================
     ✅ FETCH ADMINS (SERVER-SIDE SORTING)
  ===================== */
  const result = await getAdminsWithApi({
    page,
    limit,
    searchKey,
    isActive: isActiveBoolean,
    sortOrder: apiSortOrder,
  });

  return (
    <AdminPageClient
      admins={result.admins}
      total={result.total}
      currentPage={page}
      limit={limit}
      searchKey={searchKey}
      loggedInAdminId={session.user.id}
      permissions={permissionMap}
    />
  );
}
