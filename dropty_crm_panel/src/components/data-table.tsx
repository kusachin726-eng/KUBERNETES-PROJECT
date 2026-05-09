"use client";

import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { RotateCcw, User, CheckCircle, XCircle, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/app/utils/debounce";
import { cn } from "@/lib/utils";
import { RowsPerPageSelect } from "./ui/rowPerPageSelect";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* =====================
   EXTEND COLUMN META
===================== */
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    width?: string | number;
    maxWidth?: string | number;
    align?: "left" | "center" | "right";
  }
}

/* =====================
   PROPS
===================== */
interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  total?: number;

  searchPlaceholder?: string;
  filters?: React.ReactNode;

  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;

  onNameClick?: (row: TData) => void;

  showName?: boolean;
  showMobileVerified?: boolean;
  showUserType?: boolean;
  showRole?: boolean;
  showId?: boolean;

  nameClassName?: string;
  emailClassName?: string;
  phoneClassName?: string;
}

/* =====================
   COMPONENT
===================== */
export function DataTable<TData>({
  columns,
  data,
  searchPlaceholder = "Search…",
  filters,
  currentPage,
  totalPages,
  onPageChange,
  onNameClick,

  showName = true,
  showMobileVerified = false,
  showUserType = false,
  showRole = false,
  showId = true,

  nameClassName,
  total,
  emailClassName,
  phoneClassName,
}: DataTableProps<TData>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const limit = Number(searchParams.get("limit") ?? 10);
  const [searchValue, setSearchValue] = React.useState(
    searchParams.get("searchKey") ?? "",
  );

  const debouncedSearch = useDebounce(searchValue, 300);

  React.useEffect(() => {
    const currentSearch = searchParams.get("searchKey") ?? "";

    if (currentSearch === debouncedSearch.trim()) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (debouncedSearch.trim()) {
      params.set("searchKey", debouncedSearch.trim());
    } else {
      params.delete("searchKey");
    }

    router.replace(`?${params.toString()}`);
  }, [debouncedSearch]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleReset = () => {
    setSearchValue("");
    router.push("?page=1");
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* 1. TOP BAR */}
      <div className="flex flex-col gap-4 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800 lg:flex-row lg:items-center lg:justify-between bg-zinc-50/30 dark:bg-zinc-900/10">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex gap-2">
            <div className="relative w-full sm:w-72 lg:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-9 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-9 text-sm shadow-sm outline-none transition-all focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-700"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchValue("");
                    router.replace("?page=1");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition"
                >
                  <XCircle size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
              {filters}
            </div>
          </div>

          {filters && (
            <Button
              variant="outline"
              onClick={handleReset}
              title="Reset filters"
              className="h-9 w-9 shrink-0 p-0 border-zinc-200 text-primary hover:border-primary hover:bg-primary/5 hover:text-primary"
            >
              <RotateCcw size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* 2. TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left table-fixed">
          <thead className="bg-primary/5 text-xs font-bold uppercase tracking-wider text-primary/70 dark:bg-zinc-900/50 dark:text-zinc-300 border-b-2 border-primary/20">
            {table.getHeaderGroups().map((group) => (
              <tr
                key={group.id}
                className="border-b border-primary/20 dark:border-zinc-800"
              >
                {group.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      width: header.column.columnDef.meta?.width,
                      textAlign: "center",
                    }}
                    className="px-6 py-4 whitespace-nowrap select-none border-r last:border-r-0 border-primary/20 dark:border-zinc-800"
                  >
                    <div className="flex items-center justify-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="group transition-colors hover:bg-primary/5 dark:hover:bg-zinc-900/30"
                >
                  {row.getVisibleCells().map((cell) => {
                    const isProfile = cell.column.id === "profile";

                    if (isProfile) {
                      const r: any = row.original;
                      return (
                        <td
                          key={cell.id}
                          className="px-6 py-3 border-r border-zinc-100 dark:border-zinc-800"
                          style={{ width: cell.column.columnDef.meta?.width }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
                              <User size={18} />
                            </div>
                            <div className="min-w-0">
                              {showName && (
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                  <button
                                    type="button"
                                    className={cn(
                                      "text-sm font-bold cursor-pointer truncate bg-transparent border-none p-0 text-left hover:underline hover:text-blue-600",
                                      nameClassName,
                                    )}
                                    onClick={() => onNameClick?.(r)}
                                  >
                                    {r.name || "N/A"}
                                  </button>
                                  {showId && r.id && (
                                    <span className="text-[8px] font-bold bg-primary/10 px-1.5 py-0.5 rounded">
                                      ID: {r.id}
                                    </span>
                                  )}
                                </div>
                              )}
                              <span className="text-xs text-zinc-500 truncate">
                                {r.email || "N/A"}
                              </span>
                            </div>
                          </div>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={cell.id}
                        className="px-6 py-3 text-center border-r last:border-r-0 border-zinc-100 dark:border-zinc-800"
                        style={{
                          width: cell.column.columnDef.meta?.width,
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-32 text-center text-zinc-500"
                >
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. PAGINATION */}
      {/* {currentPage && totalPages && (
        <div className="flex justify-end border-t px-4 py-3 text-sm">
          <div className="flex items-center gap-4"> */}
      {/* {typeof total === "number" && ( */}
      {/* <RowsPerPageSelect
    value={limit} */}
      {/* // totalCount={total} */}
      {/* /> */}
      {/* )} */}

      {/* <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => onPageChange?.(currentPage - 1)}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange?.(currentPage + 1)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* 3. PAGINATION */}
      {currentPage && totalPages && (
        <div className="flex justify-between items-center border-t px-4 py-3 text-sm">
          {/* LEFT SIDE → TOTAL COUNT */}
          <div className="text-zinc-500">
            {typeof total === "number" && (
              <>
                Total:{" "}
                <span className="font-semibold text-primary">{total}</span>
              </>
            )}
          </div>

          {/* RIGHT SIDE → PAGINATION */}
          <div className="flex items-center gap-4">
            <RowsPerPageSelect value={limit} />

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => onPageChange?.(currentPage - 1)}
                className="disabled:opacity-40"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange?.(currentPage + 1)}
                className="disabled:opacity-40"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
