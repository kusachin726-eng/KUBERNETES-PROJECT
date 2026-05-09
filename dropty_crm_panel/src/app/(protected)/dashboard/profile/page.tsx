export const dynamic = "force-dynamic";
import { getProfileAction } from "./actions";
import { ProfilePage } from "@/components";
import { ProfileData } from "@/components";
// import { buildProfileImageUrl } from "@/lib/api/profile";


export default async function UserProfilePage() {
  const result = await getProfileAction();

  console.log("🔵 SERVER PROFILE RESULT:", result);

  if (!result.success || !result.data) {
    console.log("❌ PROFILE FAILED OR DATA NULL");
    return <div>Failed to load profile</div>;
  }

  const apiData = result.data;

  console.log("🟢 RAW API DATA:", apiData);

  const initialData: ProfileData = {
    id: apiData.id,

    firstName: apiData.userProfile?.firstName || "",
    lastName: apiData.userProfile?.lastName || "",
    email: apiData.email,

    role: "Admin",
    roleId: undefined,

    mobile: apiData.mobile_number || "",
    country: "",
    city: "",

    gender: apiData.userProfile?.gender || null,
    dateOfBirth: apiData.userProfile?.dateOfBirth || null,
    bio: apiData.userProfile?.bio || null,
 avatarUrl: apiData.userProfile?.avatarUrl,



    isActive: apiData.isProfile ?? false,

    newPassword: "",
    confirmPassword: "",
  };

  console.log("🟡 INITIAL DATA SENT TO CLIENT:", initialData);
  console.log("🟢 GET PROFILE AFTER REFRESH:", apiData.userProfile?.avatarUrl);
  console.log("🟢 FINAL IMAGE URL:", initialData.avatarUrl);



  return <ProfilePage initialData={initialData} />;
}
