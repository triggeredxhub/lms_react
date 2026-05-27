import { CourseFeedItem } from "@/models/course/CourseFeed.model";

function toFeedArray(data: unknown): any[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === "object") {
    const values = Object.values(data as Record<string, unknown>);
    const firstArray = values.find(Array.isArray);

    if (Array.isArray(firstArray)) {
      return firstArray as any[];
    }
  }

  return [];
}

export function normalizeCourseFeed(data: unknown): CourseFeedItem[] {
  return toFeedArray(data).map((item) => {
    if (item.announcementId)
      return { ...item, id: item.announcementId, type: "announcement" };
    if (item.materialId)
      return { ...item, id: item.materialId, type: "material" };
    if (item.quizId) return { ...item, id: item.quizId, type: "quiz" };
    if (item.discussionId)
      return { ...item, id: item.discussionId, type: "discussion" };
    if (item.assignmentId)
      return { ...item, id: item.assignmentId, type: "assignment" };

    throw new Error("Unknown feed item");
  });
}
