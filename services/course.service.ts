import { api } from "@/lib/api";
import { UserRole } from "@/models/auth/User.model";
import { Course } from "@/models/course/Course.model";
import { CourseFeedItem } from "@/models/course/CourseFeed.model";
import { CoursesResponse } from "@/models/course/CoursesResponse.model";

type FeedCollection = {
  announcements: CourseFeedItem[];
  assignments: CourseFeedItem[];
  materials: CourseFeedItem[];
  quizzes: CourseFeedItem[];
};

function pickArray(response: unknown): unknown[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  const record = response as Record<string, unknown>;
  const knownListKeys = ["data", "items", "results", "courses", "users"];

  for (const key of knownListKeys) {
    if (Array.isArray(record[key])) {
      return record[key] as unknown[];
    }
  }

  const firstArray = Object.values(record).find(Array.isArray);
  return Array.isArray(firstArray) ? (firstArray as unknown[]) : [];
}

function toIsoString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toMaybeString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function normalizeCourse(item: unknown): Course | null {
  if (!item || typeof item !== "object") {
    return null;
  }

  const record = item as Record<string, unknown>;
  const id = record.id ?? record.courseId;
  const title = record.title ?? record.courseName;

  if (
    (typeof id !== "string" && typeof id !== "number") ||
    typeof title !== "string"
  ) {
    return null;
  }

  return {
    code: toMaybeString(record.code),
    courseDescription:
      toMaybeString(record.description) ??
      toMaybeString(record.courseDescription),
    courseId: id,
    courseName: title,
    createdAt: toMaybeString(record.createdAt),
    description:
      toMaybeString(record.description) ??
      toMaybeString(record.courseDescription),
    id,
    instructorId:
      typeof record.instructorId === "string" ||
      typeof record.instructorId === "number"
        ? record.instructorId
        : null,
    title,
    updatedAt: toMaybeString(record.updatedAt),
  };
}

function normalizeFeedCollections(
  collections: FeedCollection,
): CourseFeedItem[] {
  const merged = [
    ...collections.announcements,
    ...collections.assignments,
    ...collections.materials,
    ...collections.quizzes,
  ];

  return merged.sort((a, b) => {
    const aTime = new Date(a.updatedAt ?? a.createdAt ?? "").getTime();
    const bTime = new Date(b.updatedAt ?? b.createdAt ?? "").getTime();
    return (
      (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime)
    );
  });
}

function normalizeAnnouncements(response: unknown): CourseFeedItem[] {
  const items: CourseFeedItem[] = [];

  for (const item of pickArray(response)) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const record = item as Record<string, unknown>;
    const id = record.id;

    if (typeof id !== "string" && typeof id !== "number") {
      continue;
    }

    items.push({
      announcementId: id,
      content: toMaybeString(record.body),
      courseId: record.courseId as string | number,
      createdAt: toIsoString(record.createdAt),
      title:
        typeof record.title === "string"
          ? record.title
          : "Untitled announcement",
      type: "announcement",
      updatedAt: toMaybeString(record.updatedAt),
    });
  }

  return items;
}

function normalizeAssignments(response: unknown): CourseFeedItem[] {
  const items: CourseFeedItem[] = [];

  for (const item of pickArray(response)) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const record = item as Record<string, unknown>;
    const id = record.id;

    if (typeof id !== "string" && typeof id !== "number") {
      continue;
    }

    items.push({
      assignmentId: id,
      courseId: record.courseId as string | number,
      createdAt: toIsoString(record.createdAt),
      description: toMaybeString(record.description),
      dueDate: toMaybeString(record.dueAt) ?? "",
      max_score: typeof record.maxScore === "number" ? record.maxScore : 0,
      title:
        typeof record.title === "string" ? record.title : "Untitled assignment",
      type: "assignment",
      updatedAt: toMaybeString(record.updatedAt),
    });
  }

  return items;
}

function normalizeMaterials(response: unknown): CourseFeedItem[] {
  const items: CourseFeedItem[] = [];

  for (const item of pickArray(response)) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const record = item as Record<string, unknown>;
    const id = record.id;

    if (typeof id !== "string" && typeof id !== "number") {
      continue;
    }

    items.push({
      courseId: record.courseId as string | number,
      createdAt: toIsoString(record.createdAt),
      description: toMaybeString(record.description),
      filePath:
        typeof record.fileUrl === "string"
          ? record.fileUrl
          : typeof record.filePath === "string"
            ? record.filePath
            : "",
      materialId: id,
      title:
        typeof record.title === "string" ? record.title : "Untitled material",
      type: "material",
      updatedAt: toMaybeString(record.updatedAt),
    });
  }

  return items;
}

function normalizeQuizzes(response: unknown): CourseFeedItem[] {
  const items: CourseFeedItem[] = [];

  for (const item of pickArray(response)) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const record = item as Record<string, unknown>;
    const id = record.id;

    if (typeof id !== "string" && typeof id !== "number") {
      continue;
    }

    items.push({
      courseId: record.courseId as string | number,
      createdAt: toIsoString(record.createdAt),
      description: toMaybeString(record.description),
      due_date: toIsoString(record.closesAt),
      quizId: id,
      quizTitle:
        typeof record.title === "string" ? record.title : "Untitled quiz",
      timeLimit: 0,
      type: "quiz",
      updatedAt: toIsoString(record.updatedAt),
    });
  }

  return items;
}

function normalizeCoursesResponse(response: unknown): CoursesResponse {
  return {
    courses: pickArray(response)
      .map((item) => normalizeCourse(item))
      .filter((course): course is Course => course !== null),
  };
}

export async function getCourse(courseId: string): Promise<Course> {
  const response = await api.get(`/courses/${courseId}`, {}, true);
  const normalized = normalizeCourse(response);

  if (!normalized) {
    throw new Error("Course details are unavailable.");
  }

  return normalized;
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
  void role;

  const [announcements, assignments, materials, quizzes] = await Promise.all([
    api.get("/announcements", { courseId, limit: 100, page: 1 }, true),
    api.get("/assignments", { courseId, limit: 100, page: 1 }, true),
    api.get("/materials", { courseId, limit: 100, page: 1 }, true),
    api.get("/quizzes", { courseId, limit: 100, page: 1 }, true),
  ]);

  return normalizeFeedCollections({
    announcements: normalizeAnnouncements(announcements),
    assignments: normalizeAssignments(assignments),
    materials: normalizeMaterials(materials),
    quizzes: normalizeQuizzes(quizzes),
  });
}

export async function getCourseList(): Promise<CoursesResponse> {
  const response = await api.get("/courses", { limit: 100, page: 1 }, true);
  return normalizeCoursesResponse(response);
}

export async function getCoursesForRole(
  role: UserRole,
): Promise<CoursesResponse> {
  void role;
  const response = await api.get("/courses", { limit: 100, page: 1 }, true);
  return normalizeCoursesResponse(response);
}
