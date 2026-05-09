import RolesPermissionsUI from "./roles-permissions-ui";
import { getRolePermissionWithApi } from "@/lib/api/role-permission";
import { getServerAuthSession } from "@/lib/auth"; 
import { redirect } from "next/navigation";
import { buildPermissionMap } from "@/lib/permissions/buildPermissionMap";

export default async function RolesPermissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ userType?: string; page?: string }>;
}) {
  
  const params = await searchParams;

  const session = await getServerAuthSession();
  if (!session) redirect("/login");
  const permissionsArray = Array.isArray(session.permissions)
        ? session.permissions
        : [];
    
  const permissionMap = buildPermissionMap(permissionsArray);


  const userType = params.userType ?? "all";
  const page = Number(params.page ?? 1);
  const limit = 50;

  const rolePermissionData = await getRolePermissionWithApi({
    page,
    limit,
    userType: userType === "all" ? "" : userType,
    searchKey: "",
  });

  return (
    // <RolesPermissionsUI
    //   rolePermissionData={rolePermissionData.rolePermission}
    // />
    <RolesPermissionsUI
      rolePermissionData={
        rolePermissionData.rolePermission as unknown as any[]
      }
      permissions={permissionMap} 
    />
  );
}
