export type CustomerStatus = "active" | "inactive" | "lead";

export type CustomerProfile = {
  firstName?: string | null;
  lastName?: string | null;
  gender?: "male" | "female" | "other" | null;
  dateOfBirth?: string | null;
  avatarUrl?: string | null;
};

export type Customer = {
  id: number;
  country_code: string;
  mobile_number: string;
  email: string | null;
  name: string;
  avatarUrl: string | null;

  isActive: boolean;
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  user_type: "customer";
  admin_role_id: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  

  // ✅ THIS is where gender & DOB live
  userProfile?: CustomerProfile | null;
};

export type GetCustomerApiResponse = {
  success: boolean;
  data: {
    count: number;
    rows: Customer[];
  };
};
