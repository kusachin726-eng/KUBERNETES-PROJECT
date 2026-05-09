
import SettingsClient from "./setting-client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    searchKey?: string;
  }>;
}) {
  const params = await searchParams; 

  const page = Number(params.page ?? 1);
  const limit = Number(params.limit ?? 10);
  const searchKey = params.searchKey ?? "";

  if (page < 1) {
    redirect("/dashboard/settings?page=1");
  }

  return (
    <div className="space-y-4">
      <SettingsClient
        currentPage={page}
        limit={limit}
        searchKey={searchKey}
      />
    </div>
  );
}
