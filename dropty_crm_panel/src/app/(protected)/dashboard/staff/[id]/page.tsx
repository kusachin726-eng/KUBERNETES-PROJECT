
// // import { redirect } from "next/navigation";
// // import { getServerAuthSession } from "@/lib/auth";
// // import { getStaffByIdAction } from "../actions";
// // import ProfileDetails from "@/components/ui/profileDetails";
// // import StaffStatusToggle from "./staffStatusToogle";

// // export default async function StaffDetailsPage({
// //   params,
// // }: {
// //   params: Promise<{ id: string }>;
// // }) {
// //   const session = await getServerAuthSession();
// //   if (!session) redirect("/login");

// //   const { id } = await params;
// //   const staffId = Number(id);

// //   if (Number.isNaN(staffId)) {
// //     return (
// //       <div className="p-8 text-center text-sm text-zinc-500">
// //         Invalid staff ID
// //       </div>
// //     );
// //   }

// //   const result = await getStaffByIdAction(staffId);

// //   if (!result.success || !result.data) {
// //     return (
// //       <div className="p-8 text-center text-sm text-zinc-500">
// //         Staff not found
// //       </div>
// //     );
// //   }

// //   const staff = result.data;
// //   const profile = staff.userProfile;

// //   return (
// //     <ProfileDetails
// //       title="Staff Details"
// //       name={`${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`}
// //       subtitle={`Staff ID: ${staff.id}`}
// //       initials={`${profile?.firstName?.[0] ?? ""}${profile?.lastName?.[0] ?? ""}`}
// //       fields={[
// //         { label: "Email", value: staff.email },
// //         { label: "Mobile Number", value: staff.mobile_number },
// //         { label: "Gender", value: profile?.gender },
// //         { label: "Date of Birth", value: profile?.dateOfBirth },
// //         { label: "Bio", value: profile?.bio },
// //         { label: "User Type", value: staff.user_type },
// //         { label: "Status", value: staff.isActive ? "Active" : "Inactive" },
// //       ]}
// //       footer={
// //         <>
// //           <div>
// //             <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
// //               Staff Status
// //             </p>
// //             <p className="text-xs text-zinc-500">
// //               Enable or disable this staff
// //             </p>
// //           </div>

// //           <StaffStatusToggle
// //             staffId={staff.id}
// //             isActive={staff.isActive}
// //           />
// //         </>
// //       }
// //     />
// //   );
// // }
// import { redirect } from "next/navigation";
// import { getServerAuthSession } from "@/lib/auth";
// import { getStaffByIdAction } from "../actions";
// import { ProfilePage, ProfileData } from "@/components";
// import StaffStatusToggle from "./staffStatusToogle";

// export default async function StaffDetailsPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const session = await getServerAuthSession();
//   if (!session) redirect("/login");

//   const { id } = await params;
//   const staffId = Number(id);

//   if (Number.isNaN(staffId)) {
//     return (
//       <div className="p-8 text-center text-sm text-zinc-500">
//         Invalid staff ID
//       </div>
//     );
//   }

//   const result = await getStaffByIdAction(staffId);

//   if (!result.success || !result.data) {
//     return (
//       <div className="p-8 text-center text-sm text-zinc-500">
//         Staff not found
//       </div>
//     );
//   }

//   const staff = result.data;
//   const profile = staff.userProfile;

//   const firstName = profile?.firstName ?? "";
//   const lastName = profile?.lastName ?? "";

//   const profileData: ProfileData = {
//     id: staff.id,
//     fullName:
//       [firstName, lastName].filter(Boolean).join(" ") ||
//       staff.email?.split("@")[0] ||
//       "",
//     email: staff.email ?? "",
//     role: "Staff",
//     mobile: staff.mobile_number ?? "",
//     // country: profile?.country ?? "",
//     // city: profile?.city ?? "",
//     gender: profile?.gender ?? "",
//     dateOfBirth: profile?.dateOfBirth ?? "",
//     isActive: staff.isActive,
//   };

//   return (
//  <ProfilePage
//   title="Staff Profile"
//   subtitle="View staff information"
//   statusTitle="Staff Status"
//   statusDescription="Enable or disable this staff"
//   initialData={profileData}
//   readOnly
//   statusToggle={
//     <StaffStatusToggle
//       staffId={staff.id}
//       isActive={staff.isActive}
//     />
//   }
// />

//   );
// }
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { getStaffByIdAction } from "../actions";
import { ProfilePage, ProfileData } from "@/components";
import StaffStatusToggle from "./staffStatusToogle";

export default async function StaffDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerAuthSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const staffId = Number(id);

  if (Number.isNaN(staffId)) {
    return (
      <div className="p-8 text-center text-sm text-zinc-500">
        Invalid staff ID
      </div>
    );
  }

  const result = await getStaffByIdAction(staffId);

  if (!result.success || !result.data) {
    return (
      <div className="p-8 text-center text-sm text-zinc-500">
        Staff not found
      </div>
    );
  }

  const staff = result.data;
  const profile = staff.userProfile;

  const profileData: ProfileData = {
    id: staff.id,
    firstName: profile?.firstName ?? "",
    lastName: profile?.lastName ?? "",
    email: staff.email ?? "",
    role: "Staff",
    mobile: staff.mobile_number ?? "",
    gender: profile?.gender ?? "",
    dateOfBirth: profile?.dateOfBirth ?? "",
    isActive: staff.isActive,
  };

  return (
    <ProfilePage
      title="Staff Profile"
      subtitle="View staff information"
      statusTitle="Staff Status"
      statusDescription="Enable or disable this staff"
      initialData={profileData}
      readOnly
      statusToggle={
        <StaffStatusToggle
          staffId={staff.id}
          isActive={staff.isActive}
        />
      }
    />
  );
}
