
"use client";
import { useState, useMemo, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfileData } from "./types";
import { updateProfileAction } from "@/app/(protected)/dashboard/profile/actions";
import { ProfileSidebar } from "./profile-sidebar";
import { GeneralForm } from "./general-form";
import { SecurityForm } from "./security-form";
// import { updateUserProfile } from "@/app/(protected)/dashboard/profile/actions";

interface ProfilePageProps {
  initialData: ProfileData;
  readOnly?: boolean;
  statusToggle?: React.ReactNode;

  /* ✅ NEW (generic UI control) */
  title?: string;
  subtitle?: string;
  statusTitle?: string;
  statusDescription?: string;
}


export function ProfilePage({
  initialData,
  readOnly = false,
  statusToggle,

  /* defaults keep CUSTOMER behavior */
  title,
  subtitle,
  statusTitle = "Customer Status",
  statusDescription = "Enable or disable this customer",
}: ProfilePageProps) {
  const [data, setData] = useState<ProfileData>(initialData);
  const [backup, setBackup] = useState<ProfileData>(initialData);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();


/* ✅ ADD THIS */
useEffect(() => {
  setData(initialData);
  setBackup(initialData);
}, [initialData]);

  const handleChange = (key: keyof ProfileData, value: any) => {
    if (readOnly) return;
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // const handleEdit = () => {
  //   if (readOnly) return;
  //   setBackup(data);
  //   setEditMode(true);
  // };
  const handleEdit = () => {
  if (readOnly) return;

  // ✅ create a deep copy
  setBackup({ ...data });
  setEditMode(true);
};


  // const handleCancel = () => {
  //   setData(backup);
  //   setEditMode(false);
  // };
  const handleCancel = () => {
  setData({ ...backup });
  setEditMode(false);
};


  const isSaveDisabled = useMemo(() => {
    return (
      JSON.stringify(data) === JSON.stringify(backup) || isPending
    );
  }, [data, backup, isPending]);

  // const handleSave = () => {
  //   if (isSaveDisabled) return;

  //   startTransition(async () => {
  //     await updateUserProfile({
  //       firstName: data.firstName,
  //       lastName: data.lastName,
  //       gender: data.gender || undefined,
  //       dateOfBirth: data.dateOfBirth || undefined,
  //     });

  //     router.refresh();
  //     setEditMode(false);
  //   });
  // };
  const handleSave = () => {
  if (isSaveDisabled) return;

  startTransition(async () => {
    const result = await updateProfileAction({
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender || null,
      dateOfBirth: data.dateOfBirth || null,
      bio: data.bio || null,
      avatarUrl: data.avatarUrl || null,
    });

    console.log("UPDATE RESULT:", result);

    if (result.success) {
      router.refresh(); // refetch server data
      setBackup(data);  // update backup
      setEditMode(false);
    }
  });
};


  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {title ?? (readOnly ? "Customer Profile" : "My Profile")}
          </h1>
          <p className="text-sm text-zinc-500">
            {subtitle ??
              (readOnly
                ? "View customer information"
                : "Manage your profile information")}
          </p>
        </div>

        {!readOnly && (
          <div className="flex gap-3">
            {!editMode && (
              <button
                onClick={handleEdit}
                className="h-10 rounded-md bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Edit
              </button>
            )}

            {editMode && (
              <>
                <button
                  onClick={handleCancel}
                  className="h-10 rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  Cancel
                </button>

                <button
                 onClick={handleSave}
                  disabled={isSaveDisabled}
                  className={`h-10 rounded-md px-5 text-sm font-medium text-white ${
                    isSaveDisabled
                      ? "cursor-not-allowed bg-blue-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isPending ? "Saving..." : "Save"}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* CONTENT WITH SIDEBAR */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <ProfileSidebar
          name={`${data.firstName} ${data.lastName}`.trim()}
          email={data.email}
          role={data.role}
          avatarUrl={data.avatarUrl}
          isActive={data.isActive ?? false}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          statusToggle={statusToggle}
          statusTitle={statusTitle}
          statusDescription={statusDescription}
          // onImageUpload logic
        />

        <div className="space-y-6">
          {activeTab === "general" && (
            <GeneralForm
              data={data}
              onChange={handleChange}
              editMode={!readOnly && editMode}
            />
          )}

          {activeTab === "security" && (
            <SecurityForm
              data={data}
              onChange={handleChange}
              editMode={!readOnly && editMode}
            />
          )}
        </div>
      </div>
    </div>
  );
}
