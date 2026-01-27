import { api } from "@/lib/api";
import { Course } from "@/models/course/Course.model";
import { CourseFeedItem } from "@/models/course/CourseFeed.model";
import { CoursesResponse } from "@/models/course/CoursesResponse.model";
import { normalizeCourseFeed } from "./courseFeed.normalizer";

export async function getCourse(courseId: string): Promise<Course> {
  const response = await api.get(`/course/${courseId}`, {}, true);
  return response;
}

export async function getCourseClasswork(
  courseId: string,
): Promise<CourseFeedItem[]> {
  const response = await api.get(
    `/course/${courseId}/student_classwork`,
    {},
    true,
  );

  return normalizeCourseFeed(response);
}

export async function getCourseList(): Promise<CoursesResponse> {
  const response = await api.get("/course/student-courses", {}, true);
  return response;
}
