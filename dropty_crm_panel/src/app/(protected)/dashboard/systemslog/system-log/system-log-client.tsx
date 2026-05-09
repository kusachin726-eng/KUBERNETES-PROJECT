"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SystemLogTable from "./system-logs-table";

export interface SystemLog {
  id: string;
  userName: string;
  userCode: string;
  action: string;
  table: string;
  oldNew?: string;
  ip: string;
  userAgent: string;
  createdAt: string;
}

const BASE_LOGS: SystemLog[] = [
  {
    id: "LOG-8841",
    userName: "Dipti",
    userCode: "ID:001",
    action: "UPDATE",
    table: "users",
    oldNew: `- role: "editor"\n+ role: "admin"`,
    ip: "192.168.1.42",
    userAgent: "Chrome 121 / macOS",
    createdAt: "2026-06-10T14:32:18Z",
  },
  {
    id: "LOG-8840",
    userName: "Guddi Yadav",
    userCode: "ID:004",
    action: "DELETE",
    table: "products",
    oldNew: `- sku: "PRD-99"\n- stock: 0`,
    ip: "10.0.2.15",
    userAgent: "Firefox 122 / Ubuntu",
    createdAt: "2026-06-10T14:29:04Z",
  },
  {
    id: "LOG-8839",
    userName: "Kushagra",
    userCode: "ID:007",
    action: "CREATE",
    table: "orders",
    oldNew: `+ total: 284.5\n+ status: "pending"`,
    ip: "172.31.0.8",
    userAgent: "Safari 17 / iOS",
    createdAt: "2026-06-10T14:21:55Z",
  },
];

const ALL_LOGS: SystemLog[] = [
  ...BASE_LOGS,
  ...BASE_LOGS.map((l, i) => ({ ...l, id: `${l.id}-A${i}` })),
  ...BASE_LOGS.map((l, i) => ({ ...l, id: `${l.id}-B${i}` })),
  ...BASE_LOGS.map((l, i) => ({ ...l, id: `${l.id}-C${i}` })),
];

export default function SystemLogClient({
  currentPage,
  limit,
}: {
  currentPage: number;
  limit: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(currentPage);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const totalCount = ALL_LOGS.length;
  const totalPages = Math.ceil(totalCount / limit);

  const logs = useMemo(() => {
    const start = (page - 1) * limit;
    return ALL_LOGS.slice(start, start + limit);
  }, [page, limit]);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    params.set("limit", String(limit));

    router.push(`?${params.toString()}`);
  };

  return (
    <SystemLogTable
      logs={logs}
      total={totalCount}
      currentPage={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
}
