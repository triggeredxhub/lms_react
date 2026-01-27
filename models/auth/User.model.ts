export type UserRole = "student" | "instructor" | "admin";

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
