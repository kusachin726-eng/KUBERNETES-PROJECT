
// import StaffPageClient from "./staff-page-client";
// import { getServerAuthSession } from "@/lib/auth";
// import { redirect } from "next/navigation";
// import { getStaffWithApi } from "@/lib/api/staff";
// import { buildPermissionMap } from "@/lib/permissions/buildPermissionMap";

// export default async function StaffListPage({
//   searchParams,
// }: {
//   searchParams: Promise<{
//     page?: string;
//     limit?: string;
//     searchKey?:string;
//     userType?: string;
//     sortOrder?: "asc" | "desc";
//     isActive?: string;
//   }>;
// }) {
//   const session = await getServerAuthSession();
//   if (!session) redirect("/login");

//   const permissionMap = buildPermissionMap(
//     Array.isArray(session.permissions) ? session.permissions : []
//   );

//   const params = await searchParams;

//   const page = Number(params.page ?? 1);
//   const limit = Number(params.limit ?? 10);
//   const userType = params.userType ?? "all";
//   const searchKey = params.searchKey?.trim() ?? "";


//   /**
//    * ✅ FIX 1: Default isActive enforcement (same as Customers)
//    */
//   if (params.isActive === undefined) {
//     redirect(
//       `/dashboard/staff?page=${page}&isActive=true&sortOrder=${params.sortOrder ?? "desc"}`
//     );
//   }

//   /**
//    * ✅ Safe boolean conversion (URL = source of truth)
//    */
//   const isActive = params.isActive === "true";

//   /**
//    * ✅ DEFAULT = DESC
//    */
//   const apiSortOrder =
//     params.sortOrder === "asc"
//       ? "ASC"
//       : params.sortOrder === "desc"
//       ? "DESC"
//       : "DESC";

//   console.log("📤 STAFF API PARAMS →", {
//     page,
//     limit,
//     userType,
//     isActive,
//     sortOrder: apiSortOrder,
//   });

// const staffData = await getStaffWithApi({
//   page,
//   limit,
//   userType: userType === "all" ? "" : userType,
//   searchKey,        // ✅ REAL VALUE FROM URL
//   isActive,
//   sortOrder: apiSortOrder,
// });


//   const totalPages = Math.ceil(staffData.total / limit);

//   /**
//    * ✅ FIX 2: Pagination overflow protection
//    */
//   if (page > totalPages && totalPages > 0) {
//     redirect(
//       `/dashboard/staff?page=1&isActive=${params.isActive}&sortOrder=${params.sortOrder ?? "desc"}`
//     );
//   }

//   return (
//     <StaffPageClient
//       staff={staffData.staff}
//       total={staffData.total}
//       currentPage={page}
//       totalPages={totalPages}
//       userType={userType}
//       permissions={permissionMap}
//       loggedInUserId={session.user.id}
//     />
//   );
// }
import StaffPageClient from "./staff-page-client";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getStaffWithApi } from "@/lib/api/staff";
import { buildPermissionMap } from "@/lib/permissions/buildPermissionMap";

export default async function StaffListPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    searchKey?: string;
    userType?: string;
    sortOrder?: "asc" | "desc";
    isActive?: string;
  }>;
}) {
  const session = await getServerAuthSession();
  if (!session) redirect("/login");

  const permissionMap = buildPermissionMap(
    Array.isArray(session.permissions) ? session.permissions : []
  );

  const params = await searchParams;

  const page = Number(params.page ?? 1);
  const limit = Number(params.limit ?? 10);
  const userType = params.userType ?? "all";
  const searchKey = params.searchKey?.trim() ?? "";

  /**
   * ✅ FIX 1: Default isActive enforcement
   */
  if (params.isActive === undefined) {
    redirect(
      `/dashboard/staff?page=${page}&isActive=true&sortOrder=${
        params.sortOrder ?? "desc"
      }`
    );
  }

  /**
   * ✅ Safe boolean conversion
   */
  const isActive = params.isActive === "true";

  /**
   * ✅ DEFAULT = DESC
   */
  const apiSortOrder =
    params.sortOrder === "asc"
      ? "ASC"
      : params.sortOrder === "desc"
      ? "DESC"
      : "DESC";

  console.log("📤 STAFF API PARAMS →", {
    page,
    limit,
    userType,
    isActive,
    sortOrder: apiSortOrder,
  });

  const staffData = await getStaffWithApi({
    page,
    limit,
    userType: userType === "all" ? "" : userType,
    searchKey,
    isActive,
    sortOrder: apiSortOrder,
  });

  /**
   * ✅ REMOVE LOGGED-IN USER FROM LIST
   */
  const filteredStaff = staffData.staff.filter(
    (s) => String(s.id) !== String(session.user.id)
  );

  /**
   * ✅ ADJUST TOTAL COUNT
   */
  const adjustedTotal =
    staffData.total > 0 ? staffData.total - 1 : 0;

  /**
   * ✅ FIXED TOTAL PAGES (NOW BASED ON adjustedTotal)
   */
  const totalPages = Math.ceil(adjustedTotal / limit);

  /**
   * ✅ FIX 2: Pagination overflow protection
   */
  if (page > totalPages && totalPages > 0) {
    redirect(
      `/dashboard/staff?page=1&isActive=${params.isActive}&sortOrder=${
        params.sortOrder ?? "desc"
      }`
    );
  }

  return (
    <StaffPageClient
      staff={filteredStaff}
      total={adjustedTotal}
      currentPage={page}
      totalPages={totalPages}
      userType={userType}
      permissions={permissionMap}
      loggedInUserId={session.user.id}
    />
  );
}
