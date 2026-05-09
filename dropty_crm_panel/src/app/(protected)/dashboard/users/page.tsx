import { PageHeader } from "@/components/page-header";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const session = await getServerAuthSession();
  if (!session) redirect("/login");
  if (session.user.role !== "admin") redirect("/dashboard?forbidden=1");

  return (
    <div className="page-container">
      <PageHeader title="Users" />

      <div className="table-card p-6">
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Hook this page up to an API endpoint to list users.
        </p>
      </div>
    </div>
  );
}
