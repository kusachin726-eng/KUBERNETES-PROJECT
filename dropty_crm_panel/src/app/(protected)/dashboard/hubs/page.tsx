import { PageHeader } from "@/components/page-header";
import { HubsTable } from "./hubs-table";
import { getServerAuthSession } from "@/lib/auth";
import { fetchHubsServer } from "@/lib/api/hubs";
import { redirect } from "next/navigation";

export default async function HubsPage() {
  const session = await getServerAuthSession();
  if (!session) redirect("/login");

  const role = session.user.role;
  if (!(role === "admin" || role === "manager")) {
    redirect("/dashboard?forbidden=1");
  }

  const { hubs, source } = await fetchHubsServer();

  return (
    <div className="page-container">
      {/* Header Card */}
      <PageHeader title="Hubs" />

      <div className="w-full">
        <HubsTable hubs={hubs} />
      </div>
    </div>
  );
}
