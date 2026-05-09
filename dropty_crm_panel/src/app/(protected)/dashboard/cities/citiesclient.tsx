"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { CitiesTable } from "./cities-table";
import AddEditCitiesModal from "./addCitiesmodal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { CityUI } from "@/lib/api/cities";
import { PermissionMap } from "@/lib/permissions/types";
import { can } from "@/lib/permissions/can";
import {
  createCityAction,
  deleteCityAction,
  getCityAction,
  updateCityAction,
} from "./action";
import { toast } from "sonner";

interface Props {
  cities: CityUI[];
  total: number;
  currentPage: number;
  totalPages: number;
  permissions: PermissionMap;
}

export default function CitiesClient({
  cities,
  total,
  currentPage,
  totalPages,
  permissions,
}: Props) {
  const [citiesData, setCitiesData] = useState<CityUI[]>(cities);
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CityUI | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const searchKey = searchParams.get("searchKey")?.toLowerCase() ?? "";
  const canAdd = can(permissions, "manage_cities", "create");

  useEffect(() => {
    setCitiesData(cities);
  }, [cities]);

  const filteredCities = useMemo(() => {
    if (!searchKey) return citiesData;

    return citiesData.filter((c) =>
      [c.city, c.state, c.stateCode, c.country, ...(c.pincode ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(searchKey),
    );
  }, [citiesData, searchKey]);

  const onPageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  };

  const handleDeleteCity = async (cityId: string) => {
    const result = await deleteCityAction(cityId);

    if (result?.success) {
      toast.success("City deleted successfully");
      router.refresh(); 
    } else {
      toast.error(result?.message || "Failed to delete city");
    }
  };

  const handleEditCity = async (cityId: string) => {
    const res = await getCityAction(cityId);
    if (!res.success || !res.data) return;

    setSelectedCity(res.data);
    setOpen(true);
  };

  return (
    <div className="page-container">
      {canAdd && (
        <PageHeader
          title="Cities"
          action={
            <Button variant="add" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              Add City
            </Button>
          }
        />
      )}

      <Card>
        <CardContent className="p-0">
          <CitiesTable
            key={filteredCities.map((c) => c.id).join("|")}
            cities={cities}
            permissions={permissions}
            total={total}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            onDelete={handleDeleteCity}
            onEdit={handleEditCity}
          />
        </CardContent>
      </Card>

      <AddEditCitiesModal
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setSelectedCity(null);
        }}
        mode={selectedCity ? "edit" : "add"}
        initialValues={selectedCity ?? undefined}
        onSubmit={async (formData) => {
          const res = selectedCity
            ? await updateCityAction(selectedCity.id, {
                city: formData.city,
                state: formData.state,
                stateCode: formData.stateCode.toUpperCase(),
                country: "India",
                countryCode: "IN",
                pincode: formData.pincode,
              })
            : await createCityAction({
                city: formData.city,
                state: formData.state,
                stateCode: formData.stateCode.toUpperCase(),
                country: "India",
                countryCode: "IN",
                pincode: formData.pincode,
              });

          if (res.success) {
            toast.success(
              selectedCity
                ? "City updated successfully"
                : "City added successfully",
            );
            setOpen(false);
            router.refresh();
          }

          return res;
        }}
      />
    </div>
  );
}
