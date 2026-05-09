
// import CustomersPageClient from "./customers-page-client";
// import { getServerAuthSession } from "@/lib/auth";
// import { getCustomersWithApi } from "@/lib/api/customers";
// import { redirect } from "next/navigation";
// import { buildPermissionMap } from "@/lib/permissions/buildPermissionMap";

// type Props = {
//   searchParams: Promise<{
//     page?: string;
//     sortOrder?: "asc" | "desc";
//     isActive?: string;
//     searchKey?: string;
//   }>;
// };

// export default async function CustomersListPage({ searchParams }: Props) {
//   const session = await getServerAuthSession();
//   if (!session) redirect("/login");

//   const permissionMap = buildPermissionMap(
//     Array.isArray(session.permissions) ? session.permissions : []
//   );

//   const {
//     page: pageParam,
//     sortOrder,
//     isActive,
//     searchKey,
//   } = await searchParams;

//   const page = Number(pageParam ?? 1);
//   const limit = 10;
//   const search = searchKey ?? "";

//   /* =========================
//      DEFAULT FILTER
//   ========================= */
//   if (isActive === undefined) {
//     redirect(
//       `/dashboard/customers?page=${page}&isActive=true&sortOrder=${
//         sortOrder ?? "desc"
//       }${search ? `&searchKey=${encodeURIComponent(search)}` : ""}`
//     );
//   }

//   /* =========================
//      SAFE BOOLEAN
//   ========================= */
//   const isActiveBoolean = isActive === "true";

//   /* =========================
//      SORT ORDER
//   ========================= */
//   const apiSortOrder =
//     sortOrder === "asc" ? "ASC" : "DESC";

//   /* =========================
//      FETCH CUSTOMERS
//   ========================= */
//   const result = await getCustomersWithApi({
//     page,
//     limit,
//     isActive: isActiveBoolean,
//     sortOrder: apiSortOrder,
//     searchKey: search,
//   });

//   const totalPages = Math.ceil(result.total / limit);

//   /* =========================
//      PAGINATION OVERFLOW
//   ========================= */
//   if (page > totalPages && totalPages > 0) {
//     redirect(
//       `/dashboard/customers?page=1&isActive=${isActive}&sortOrder=${
//         sortOrder ?? "desc"
//       }${search ? `&searchKey=${encodeURIComponent(search)}` : ""}`
//     );
//   }

//   return (
//     <CustomersPageClient
//       result={result}
//       currentPage={page}
//       totalPages={totalPages}
//       permissions={permissionMap}
//     />
//   );
// }
import CustomersPageClient from "./customers-page-client";
import { getServerAuthSession } from "@/lib/auth";
import { getCustomersWithApi } from "@/lib/api/customers";
import { redirect } from "next/navigation";
import { buildPermissionMap } from "@/lib/permissions/buildPermissionMap";

type Props = {
  searchParams: Promise<{
    page?: string;
    limit?: string; // ✅ ADDED
    sortOrder?: "asc" | "desc";
    isActive?: string;
    searchKey?: string;
  }>;
};

export default async function CustomersListPage({ searchParams }: Props) {
  const session = await getServerAuthSession();
  if (!session) redirect("/login");

  const permissionMap = buildPermissionMap(
    Array.isArray(session.permissions) ? session.permissions : []
  );

  const {
    page: pageParam,
    limit: limitParam, // ✅ ADDED
    sortOrder,
    isActive,
    searchKey,
  } = await searchParams;

  const page = Number(pageParam ?? 1);
  const limit = Number(limitParam ?? 10); // ✅ DYNAMIC LIMIT
  const search = searchKey ?? "";

  /* =========================
     DEFAULT FILTER
  ========================= */
  if (isActive === undefined) {
    redirect(
      `/dashboard/customers?page=${page}&limit=${limit}&isActive=true&sortOrder=${
        sortOrder ?? "desc"
      }${search ? `&searchKey=${encodeURIComponent(search)}` : ""}`
    );
  }

  /* =========================
     SAFE BOOLEAN
  ========================= */
  const isActiveBoolean = isActive === "true";

  /* =========================
     SORT ORDER
  ========================= */
  const apiSortOrder =
    sortOrder === "asc" ? "ASC" : "DESC";

  /* =========================
     FETCH CUSTOMERS
  ========================= */
  const result = await getCustomersWithApi({
    page,
    limit,
    isActive: isActiveBoolean,
    sortOrder: apiSortOrder,
    searchKey: search,
  });

  const totalPages = Math.ceil(result.total / limit);

  /* =========================
     PAGINATION OVERFLOW
  ========================= */
  if (page > totalPages && totalPages > 0) {
    redirect(
      `/dashboard/customers?page=1&limit=${limit}&isActive=${isActive}&sortOrder=${
        sortOrder ?? "desc"
      }${search ? `&searchKey=${encodeURIComponent(search)}` : ""}`
    );
  }

  return (
    <CustomersPageClient
      result={result}
      currentPage={page}
      totalPages={totalPages}
      permissions={permissionMap}
    />
  );
}
