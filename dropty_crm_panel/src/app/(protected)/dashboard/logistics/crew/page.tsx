
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { fetchRidersServer } from "@/lib/api/riders";
import RidersClient from "./riderclient";
import { buildPermissionMap } from "@/lib/permissions/buildPermissionMap";

// export default async function RidersPage({
//   searchParams,
// }: {
//   searchParams: Promise<{
//     page?: string;
//     limit?: string;
//     searchKey?: string;
//     status?: string;
//     sortOrder?: "asc" | "desc";
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
//   const searchKey = params.searchKey ?? "";

//   /**
//    * ✅ FIX 1: Default status enforcement
//    * Default = active riders
//    */
//   if (params.status === undefined) {
//     redirect(
//       `/dashboard/logistics/crew?page=${page}&status=active&sortOrder=${params.sortOrder ?? "desc"}`
//     );
//   }

//   const status = params.status ?? "active";
//   let isActive: boolean | undefined;

// if (status === "active") {
//   isActive = true;
// } else if (status === "inactive") {
//   isActive = false;
// } else {
//   isActive = undefined; // blocked or future cases
// }

//   /**
//    * ✅ DEFAULT = DESC
//    */
//   const sortOrder =
//     params.sortOrder === "asc"
//       ? "asc"
//       : params.sortOrder === "desc"
//       ? "desc"
//       : "desc";

//   console.log("📤 RIDERS PAGE PARAMS →", {
//     page,
//     limit,
//     searchKey,
//     status,
//     sortOrder,
//   });

//   /**
//    * ✅ BACKEND SORT + PAGINATION
//    */
//   const {
//     riders,
//     totalPages,
//     totalCount,
//   } = await fetchRidersServer(
//     page,
//     limit,
//     searchKey,
//    isActive,
//     sortOrder
//   );
//   // STEP 2: Map backend riders → UI riders

// const uiRiders = riders.map((rider) => ({
//   id: rider.id,
//   name: rider.name,
//   phone: rider.phone,
//   email: rider.email,
//   createdAt: rider.createdAt,

//   image: rider.avatarUrl ?? "/avatar.png",
//   city: "—",
//   state: "—",
//   country: "—",

//   status: rider.isActive, // ✅ FIXED
// }));


//   /**
//    * ✅ FIX 2: Pagination overflow protection
//    */
//   if (page > totalPages && totalPages > 0) {
//     redirect(
//       `/dashboard/?page=1&status=${status}&sortOrder=${sortOrder}`
//     );
//   }

//   return (
//     // <RidersClient
//     //   riders={riders}          // ✅ DIRECT BACKEND DATA
//     //   currentPage={page}
//     //   totalPages={totalPages}
//     //   totalCount={totalCount}
//     //   searchKey={searchKey}
//     //   status={status}
//     //   permissions={permissionMap}
//     // />
//     <RidersClient
//   riders={uiRiders}   // ✅ FIXED
//   currentPage={page}
//   totalPages={totalPages}
//   totalCount={totalCount}
//   searchKey={searchKey}
//   status={status}
//   permissions={permissionMap}
// />

//   );
// }
export default async function RidersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    searchKey?: string;
    isActive?: string;
    sortOrder?: "asc" | "desc";
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
const searchKey = params.searchKey ?? "";

  /* =========================
     ✅ FIX 1: DEFAULT FILTER
     (SAME AS CUSTOMERS)
  ========================= */

if (params.isActive === undefined) {
  redirect(
    `/dashboard/logistics/crew?page=${page}&limit=${limit}&isActive=true&sortOrder=${params.sortOrder ?? "desc"}`
  );
}


  /* =========================
     ✅ FIX 2: SAFE BOOLEAN
  ========================= */

const isActiveBoolean = params.isActive === "true";
  /* =========================
     ✅ SORT ORDER
  ========================= */
const sortOrder =
  params.sortOrder === "asc"
    ? "asc"
    : "desc";

const {
  riders,
  totalPages,
  totalCount,
} = await fetchRidersServer(
  page,
  limit,
  searchKey,
  isActiveBoolean,
  sortOrder
);


  /* =========================
     ✅ MAP BACKEND → UI
  ========================= */
  const uiRiders = riders.map((rider) => ({
    id: rider.id,
    name: rider.name,
    phone: rider.phone,
    email: rider.email,
    createdAt: rider.createdAt,
    image: rider.avatarUrl ?? "/avatar.png",
    city: "—",
    state: "—",
    country: "—",
    status: rider.isActive, // boolean
  }));

  /* =========================
     ✅ FIX 3: PAGINATION OVERFLOW
  ========================= */

if (page > totalPages && totalPages > 0) {
  redirect(
    `/dashboard/logistics/crew?page=1&limit=${limit}&isActive=${params.isActive}&sortOrder=${sortOrder}`
  );
}


  

  return (
    <RidersClient
      riders={uiRiders}
      currentPage={page}
      totalPages={totalPages}
      totalCount={totalCount}
      searchKey={searchKey}
      isActive={isActiveBoolean}
      permissions={permissionMap}
    />
  );
}
