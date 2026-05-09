// export type UserRole = "Admin" | "Staff" | "Customer" |"Rider";

// export interface ProfileData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   id?: number;
//   role: UserRole;
//   roleId?: number;
//   mobile?: string;
//   country?: string;
//   city?: string;
//   gender?: string;
//   dateOfBirth?: string;
//   newPassword?: string;
//   confirmPassword?: string;
//   isActive?: boolean;
// }
export type UserRole = "Admin" | "Staff" | "Customer" | "Rider";

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  id?: number;

  role: UserRole;
  roleId?: number;

  mobile?: string;
  country?: string;
  city?: string;

  gender?: string | null;
  dateOfBirth?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;

  newPassword?: string;
  confirmPassword?: string;

  isActive?: boolean;
}
