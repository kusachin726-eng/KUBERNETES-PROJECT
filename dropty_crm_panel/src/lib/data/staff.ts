export type CustomerStatus = "active" | "inactive" | "lead";

export type Staff = {
  status: string;
  id: number;
  country_code: string;
  mobile_number: string;
  email: string | null;
  otp: string | null;
  otp_expires_at: string | null;
  password: string | null;
  isActive: boolean;
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  user_type: string;
  admin_role_id: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type GetStaffApiResponse = {
  success: boolean;
  data: {
    count: number;
    rows: Staff[];
  };
};
