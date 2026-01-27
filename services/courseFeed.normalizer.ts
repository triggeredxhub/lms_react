import { CourseFeedItem } from "@/models/course/CourseFeed.model";

export function normalizeCourseFeed(data: any[]): CourseFeedItem[] {
  return data.map((item) => {
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
