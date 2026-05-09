"use client";

import { PageHeader } from "@/components/page-header";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

import AddEditSettingsModal from "./addSettingmodals";
import { SettingsTable } from "./setting-table";
import {
  getSettingsAction,
  addSettingAction,
  updateSettingAction,
} from "./actions";

export interface SettingRow {
  id: string;
  slug: string;
  title: string;
  metadata: Record<string, number>;
}

type ApiResponse = {
  rows: any[];
  totalCount: number;
};

export default function SettingsClient({
  currentPage,
  limit,
  searchKey,
}: {
  currentPage: number;
  limit: number;
  searchKey: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<SettingRow[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0); // ✅ SAME AS CITIES
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SettingRow | null>(null);

  const [searchInput, setSearchInput] = useState(searchKey);
  const firstRender = useRef(true);

  const fetchSettings = async () => {
    setLoading(true);

    const res = await getSettingsAction(currentPage, limit, searchKey);

    if (res.success && res.data) {
      const apiData = res.data as ApiResponse;

      const count = apiData.totalCount ?? 0;

      setTotal(count);
      setTotalPages(Math.max(1, Math.ceil(count / limit)));

      setData(
        apiData.rows.map((r) => ({
          id: String(r.id),
          title: r.title,
          slug: r.slug,
          metadata: r.metaData ?? {},
        })),
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, [currentPage, limit, searchKey]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const trimmed = searchInput.trim();
      const currentSearch = searchParams.get("searchKey") ?? "";

      if (trimmed === currentSearch) return;

      const params = new URLSearchParams(searchParams.toString());

      if (trimmed) {
        params.set("searchKey", trimmed);
        params.set("page", "1");
      } else {
        params.delete("searchKey");
        params.set("page", "1");
      }

      router.push(`?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setSearchInput(searchKey);
  }, [searchKey]);

  return (
    <div className="page-container">
      <PageHeader
        title="Settings"
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Add Setting
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <SettingsTable
            settings={data}
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            onPageChange={(page) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", String(page));
              params.set("limit", String(limit));
              if (searchKey) params.set("searchKey", searchKey);
              router.push(`?${params.toString()}`);
            }}
            onEdit={(id) => {
              const item = data.find((s) => s.id === id);
              if (!item) return;
              setSelected(item);
              setOpen(true);
            }}
          />
        </CardContent>
      </Card>

      <AddEditSettingsModal
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setSelected(null);
        }}
        mode={selected ? "edit" : "add"}
        initialValues={selected ?? undefined}
        onSubmit={async (formData) => {
          const res = selected
            ? await updateSettingAction(selected.id, {
                title: formData.title,
                metaData: formData.metadata,
              })
            : await addSettingAction({
                title: formData.title,
                metaData: formData.metadata,
              });

          if (!res.success) {
            toast.error(res.message || "Operation failed");
            return;
          }

          toast.success(
            selected
              ? "Setting updated successfully"
              : "Setting added successfully",
          );

          setOpen(false);
          setSelected(null);
          await fetchSettings();
        }}
      />
    </div>
  );
}
