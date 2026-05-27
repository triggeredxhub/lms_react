import { api } from "@/lib/api";
import { CommentItem, CommentTargetType } from "@/models/comment/Comment.model";

function normalizeComments(response: unknown): CommentItem[] {
  if (Array.isArray(response)) {
    return response as CommentItem[];
  }

  if (response && typeof response === "object") {
    const values = Object.values(response as Record<string, unknown>);
    const firstArray = values.find(Array.isArray);

    if (Array.isArray(firstArray)) {
      return firstArray as CommentItem[];
    }
  }

  return [];
}

function getCommentListEndpoint(type: CommentTargetType, targetId: string) {
  switch (type) {
    case "announcement":
      return `/comment/get/announcementId/${targetId}/list`;
    case "assignment":
      return `/comment/get/assignmentId/${targetId}/list`;
    case "discussion":
      return `/comment/get/${targetId}/list`;
    case "material":
      return `/comment/get/materialId/${targetId}/list`;
    case "quiz":
      return `/comment/get/quizId/${targetId}/list`;
  }
}

export async function getCommentsByTarget(
  type: CommentTargetType,
  targetId: string,
): Promise<CommentItem[]> {
  const response = await api.get(
    getCommentListEndpoint(type, targetId),
    {},
    true,
  );
  return normalizeComments(response);
}
