
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { getAdminByIdAction } from "../actions";
import { ProfilePage, ProfileData } from "@/components";

export default async function AdminDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ UNWRAP PARAMS (MANDATORY IN NEXT 15+)
  const { id } = await params;

  const session = await getServerAuthSession();
  if (!session) redirect("/login");

  const adminId = Number(id);

  if (Number.isNaN(adminId)) {
    return (
      <div className="p-8 text-center text-sm text-zinc-500">
        Invalid admin ID
      </div>
    );
  }

  const result = await getAdminByIdAction(adminId);
  console.log("the result of api" ,result)

  if (!result.success || !result.data) {
    return (
      <div className="p-8 text-center text-sm text-zinc-500">
        Admin not found
      </div>
    );
  }

const admin = result.data;
const profile = admin.userProfile ?? {};

//   const profileData: ProfileData = {
//     id: admin.id,
//     firstName: admin.firstName ?? "",
//     lastName: admin.lastName ?? "",
//     email: admin.email ?? "",
//     role: "Admin",
//     mobile: admin.mobile_number ?? "",
//     gender: admin.gender ?? "",
//     dateOfBirth: admin.dateOfBirth ?? "",
//     isActive: admin.isActive,
//   };
const profileData: ProfileData = {
  id: admin.id,
  firstName: profile.firstName ?? "",
  lastName: profile.lastName ?? "",
  email: admin.email ?? "",
  role: "Admin",
  mobile: admin.mobile_number ?? "",
  gender: profile.gender ?? "",
  dateOfBirth: profile.dateOfBirth ?? "",
  isActive: admin.isActive,
};


  return (
    <ProfilePage
      title="Admin Profile"
      subtitle="View admin information"
      statusTitle="Admin Status"
      statusDescription="Enable or disable this admin"
      initialData={profileData}
      readOnly
    />
  );
}
