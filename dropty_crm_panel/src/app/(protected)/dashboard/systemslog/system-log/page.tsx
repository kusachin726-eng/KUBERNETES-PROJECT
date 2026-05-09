import SystemLogClient from "./system-log-client";
import { redirect } from "next/navigation";

const TOTAL_LOGS = 12;

export const dynamic = "force-dynamic";

export default async function SystemLogsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}) {
  const params = await searchParams;

  const page = Number(params.page ?? 1);
  const limit = Number(params.limit ?? 10);

  const totalPages = Math.ceil(TOTAL_LOGS / limit);

  if (page > totalPages) {
    redirect(`/dashboard/system-logs?page=1&limit=${limit}`);
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">System Logs</h1>
      </div>

      <SystemLogClient currentPage={page} limit={limit} />
    </div>
  );
}
