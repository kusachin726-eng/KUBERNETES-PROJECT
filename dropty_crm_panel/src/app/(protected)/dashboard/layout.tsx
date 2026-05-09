import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { buildPermissionMap } from "@/lib/permissions/buildPermissionMap";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  // const permissionMap = buildPermissionMap(
  //   session?.permissions ?? []
  // );
  const permissionMap = buildPermissionMap(
    Array.isArray(session?.permissions) ? session.permissions : []
  );

  if (!session) redirect("/login");


  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <div className="flex min-h-screen">
        {/* <Sidebar role={session.user.role} /> */}
        <Sidebar permissions={permissionMap} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
          
            name={session.user.name}
            email={session.user.email}
            role={session.user.role}
          />
          <main className="flex-1 overflow-y-auto p-2 md:p-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
