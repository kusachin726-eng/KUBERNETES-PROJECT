import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { fetchSingleCustomerWithApi } from "@/lib/api/customers";
import { ProfilePage, ProfileData } from "@/components";
import CustomerStatusToggle from "./CustomerToogle";

export default async function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerAuthSession();
  if (!session) redirect("/login");

  const { id } = await params;

  const customer = await fetchSingleCustomerWithApi(Number(id));

  if (!customer) {
    return (
      <div className="p-8 text-center text-sm text-zinc-500">
        Customer not found
      </div>
    );
  }

  const firstName = customer.userProfile?.firstName ?? "";
const lastName = customer.userProfile?.lastName ?? "";

const profileData: ProfileData = {
  id: customer.id,
  firstName:
    customer.userProfile?.firstName ??
    customer.email?.split("@")[0] ??
    "",
  lastName: customer.userProfile?.lastName ?? "",
  email: customer.email ?? "",
  role: "Customer",
  mobile: customer.mobile_number ?? "",
  country: customer.userProfile?.country ?? "",
  city: customer.userProfile?.city ?? "",
  gender: customer.userProfile?.gender ?? "",
  dateOfBirth: customer.userProfile?.dateOfBirth ?? "",
  isActive: customer.isActive,
};



  return (
    <ProfilePage
      initialData={profileData}
      readOnly
      statusToggle={
        <CustomerStatusToggle
          customerId={customer.id}
          isActive={customer.isActive}
        />
      }
    />
  );
}
