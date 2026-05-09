import { apiGetJson, apiPostJson, apiPatchJson } from "@/lib/api/client";
export type SettingApiRow = {
  id: number;
  title: string;
  slug: string;
  metaData: Record<string, number>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getSettings() {
  return apiGetJson<{
    success: boolean;
    data: {
      rows: SettingApiRow[];
    };
  }>("/api/v1/admin/settings");
}

export async function getSettingBySlug(slug: string) {
  return apiGetJson<{
    success: boolean;
    data: SettingApiRow;
  }>(`/api/v1/admin/settings/${slug}`);
}

export async function addSetting(payload: {
  title: string;
  metaData: Record<string, number>;
}) {
  return apiPostJson("/api/v1/admin/settings", {
    ...payload,
    isActive: true,
  });
}

export async function updateSetting(
  id: string | number,
  payload: {
    title: string;
    metaData: Record<string, number>;
  },
) {
  return apiPatchJson(`/api/v1/admin/settings/updateSettings/${id}`, payload);
}
