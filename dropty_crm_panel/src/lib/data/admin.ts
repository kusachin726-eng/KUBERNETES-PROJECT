export type AdminRole = {
  id: number;
  title: string;
};

export type UserProfile = {
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
} | null;

// export type Admin = {
//   id: number;
//   email: string;
//   mobile_number: string;
//   isActive: boolean;
//   createdAt: string;
//   userProfile: UserProfile;
//   adminRole: AdminRole;
// };

export interface Admin {
  id: number;
  country_code: string;
  mobile_number: string;
  email: string;
  isActive: boolean;
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  user_type: string;
  admin_role_id: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  avatarUrl: string | null;
  adminRole: {
    id: number;
    title: string;
  } | null;
}


export type AdminListResult = {
  admins: Admin[];
  total: number;
};
