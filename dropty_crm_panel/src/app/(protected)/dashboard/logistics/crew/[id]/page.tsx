// import { redirect } from "next/navigation";
// import { getServerAuthSession } from "@/lib/auth";
// import { fetchSingleRiderAction } from "../actions";

// import { ProfilePage, ProfileData } from "@/components";
// import RiderStatusToggle from "./RiderToggle";

// export default async function RiderDetailsPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const session = await getServerAuthSession();
//   if (!session) redirect("/login");

//   const { id } = await params;
//   const riderId = Number(id);

//   if (Number.isNaN(riderId)) {
//     return (
//       <div className="p-8 text-center text-sm text-zinc-500">
//         Invalid rider ID
//       </div>
//     );
//   }

//   const result = await fetchSingleRiderAction(riderId);

//   if (!result.success || !result.data) {
//     return (
//       <div className="p-8 text-center text-sm text-zinc-500">
//         Rider not found
//       </div>
//     );
//   }

//   const rider = result.data;

// const profileData: ProfileData = {
//   id: rider.id,
//   fullName:
//     [rider.firstName, rider.lastName].filter(Boolean).join(" ") ||
//     rider.email?.split("@")[0] ||
//     "",
//   email: rider.email ?? "",
//   role: "Rider", // ✅ FIX
//   mobile: rider.mobile_number ?? "",
//   gender: rider.gender ?? "",
//   dateOfBirth: rider.dateOfBirth ?? "",
//   isActive: rider.isActive,
// };


//   return (
//     <ProfilePage
//       title="Rider Profile"
//       subtitle="View rider information"
//       statusTitle="Rider Status"
//       statusDescription="Enable or disable this rider"
//       initialData={profileData}
//       readOnly
//       statusToggle={
//         <RiderStatusToggle
//           riderId={rider.id}
//           isActive={rider.isActive}
//         />
//       }
//     />
//   );
// }
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { fetchSingleRiderAction } from "../actions";

import { ProfilePage, ProfileData } from "@/components";
import RiderStatusToggle from "./RiderToggle";

export default async function RiderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerAuthSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const riderId = Number(id);

  if (Number.isNaN(riderId)) {
    return (
      <div className="p-8 text-center text-sm text-zinc-500">
        Invalid rider ID
      </div>
    );
  }

  const result = await fetchSingleRiderAction(riderId);

  if (!result.success || !result.data) {
    return (
      <div className="p-8 text-center text-sm text-zinc-500">
        Rider not found
      </div>
    );
  }

  const rider = result.data;

  const profileData: ProfileData = {
    id: rider.id,
    firstName: rider.firstName ?? "",
    lastName: rider.lastName ?? "",
    email: rider.email ?? "",
    role: "Rider",
    mobile: rider.mobile_number ?? "",
    gender: rider.gender ?? "",
    dateOfBirth: rider.dateOfBirth ?? "",
    isActive: rider.isActive,
  };

  return (
    <ProfilePage
      title="Rider Profile"
      subtitle="View rider information"
      statusTitle="Rider Status"
      statusDescription="Enable or disable this rider"
      initialData={profileData}
      readOnly
      statusToggle={
        <RiderStatusToggle
          riderId={rider.id}
          isActive={rider.isActive}
        />
      }
    />
  );
}
