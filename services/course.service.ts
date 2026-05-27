import { api } from "@/lib/api";
import { UserRole } from "@/models/auth/User.model";
import { Course } from "@/models/course/Course.model";
import { CourseFeedItem } from "@/models/course/CourseFeed.model";
import { CoursesResponse } from "@/models/course/CoursesResponse.model";
import { normalizeCourseFeed } from "./courseFeed.normalizer";

function normalizeCoursesResponse(response: unknown): CoursesResponse {
  if (Array.isArray(response)) {
    return { courses: response as Course[] };
  }

  if (
    response &&
    typeof response === "object" &&
    "courses" in response &&
    Array.isArray((response as CoursesResponse).courses)
  ) {
    return response as CoursesResponse;
  }

  return { courses: [] };
}

export async function getCourse(courseId: string): Promise<Course> {
  const response = await api.get(`/course/${courseId}`, {}, true);
  return response;
}

export async function getCourseClasswork(
  courseId: string,
): Promise<CourseFeedItem[]> {
  return getCourseClassworkForRole(courseId, "student");
}

export async function getCourseClassworkForRole(
  courseId: string,
  role: UserRole,
): Promise<CourseFeedItem[]> {
  const endpointByRole: Record<UserRole, string> = {
    admin: `/course/${courseId}/get_classwork`,
    instructor: `/course/${courseId}/get_classwork`,
    student: `/course/${courseId}/student_classwork`,
  };

  const response = await api.get(endpointByRole[role], {}, true);

  return normalizeCourseFeed(response);
}

export async function getCourseList(): Promise<CoursesResponse> {
  const response = await api.get("/course/student-courses", {}, true);
  return normalizeCoursesResponse(response);
}

export async function getCoursesForRole(
  role: UserRole,
): Promise<CoursesResponse> {
  const endpointByRole: Record<UserRole, string> = {
    admin: "/course/get_by_admin",
    instructor: "/course/my-courses",
    student: "/course/student-courses",
  };

  const response = await api.get(endpointByRole[role], {}, true);
  return normalizeCoursesResponse(response);
}
