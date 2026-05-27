import { api } from "@/lib/api";
import { Course } from "@/models/course/Course.model";

export interface AdminStats {
  totalCourses?: number;
  totalStudents?: number;
  totalInstructors?: number;
  [key: string]: number | string | null | undefined;
}

export interface AdminStudent {
  studentId?: number;
  userId?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  [key: string]: unknown;
}

function normalizeArrayResponse<T>(response: unknown): T[] {
  if (Array.isArray(response)) {
    return response as T[];
  }

  if (response && typeof response === "object") {
    const values = Object.values(response as Record<string, unknown>);
    const firstArray = values.find(Array.isArray);

    if (Array.isArray(firstArray)) {
      return firstArray as T[];
    }
  }

  return [];
}

export async function getAdminStats(): Promise<AdminStats> {
  const response = await api.get("/admin/get_stats", {}, true);
  return response && typeof response === "object"
    ? (response as AdminStats)
    : {};
}

export async function getAdminCourses(): Promise<Course[]> {
  const response = await api.get("/admin/courses", {}, true);
  return normalizeArrayResponse<Course>(response);
}

export async function getAdminStudents(): Promise<AdminStudent[]> {
  const response = await api.get("/admin/students", {}, true);
  return normalizeArrayResponse<AdminStudent>(response);
}
