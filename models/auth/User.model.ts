export type UserRole = "student" | "instructor" | "admin";
export type StudentStatus = "regular" | "irregular";

export interface User {
  id?: string | number;
  userId: string | number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  studentStatus?: StudentStatus | null;
  createdAt?: string | null; // ISO string
  updatedAt?: string | null; // ISO string
}
