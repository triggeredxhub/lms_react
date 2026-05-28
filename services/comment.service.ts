import { api } from "@/lib/api";
import { CommentItem, CommentTargetType } from "@/models/comment/Comment.model";

function normalizeComments(response: unknown): CommentItem[] {
  const source = Array.isArray(response)
    ? response
    : response && typeof response === "object"
      ? ((Object.values(response as Record<string, unknown>).find(
          Array.isArray,
        ) as unknown[] | undefined) ?? [])
      : [];

  const comments: CommentItem[] = [];

  for (const item of source) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const record = item as Record<string, unknown>;
    const id = record.id ?? record.commentId;

    if (typeof id !== "string" && typeof id !== "number") {
      continue;
    }

    comments.push({
      body: typeof record.body === "string" ? record.body : null,
      comment: typeof record.body === "string" ? record.body : null,
      commentId: id,
      content: typeof record.body === "string" ? record.body : null,
      createdAt: typeof record.createdAt === "string" ? record.createdAt : null,
      firstName:
        typeof record.firstName === "string" ? record.firstName : undefined,
      id,
      lastName:
        typeof record.lastName === "string" ? record.lastName : undefined,
      parentId:
        typeof record.parentId === "string" ||
        typeof record.parentId === "number"
          ? record.parentId
          : null,
      targetId:
        typeof record.targetId === "string" ||
        typeof record.targetId === "number"
          ? record.targetId
          : undefined,
      targetType:
        typeof record.targetType === "string"
          ? (record.targetType as CommentTargetType)
          : undefined,
      text: typeof record.body === "string" ? record.body : null,
      updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : null,
      userId:
        typeof record.userId === "string" || typeof record.userId === "number"
          ? record.userId
          : undefined,
    });
  }

  return comments;
}

function normalizeTargetType(type: CommentTargetType): CommentTargetType {
  switch (type) {
    case "discussion":
      return "announcement";
    default:
      return type;
  }
}

export async function getCommentsByTarget(
  type: CommentTargetType,
  targetId: string,
): Promise<CommentItem[]> {
  const response = await api.get(
    "/comments",
    {
      limit: 100,
      page: 1,
      targetId,
      targetType: normalizeTargetType(type),
    },
    true,
  );
  return normalizeComments(response);
}
