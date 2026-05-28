export type CommentTargetType =
  | "announcement"
  | "assignment"
  | "discussion"
  | "material"
  | "quiz";

export interface CommentItem {
  commentId?: string | number;
  id?: string | number;
  userId?: string | number;
  targetType?: CommentTargetType;
  targetId?: string | number;
  parentId?: string | number | null;
  body?: string | null;
  firstName?: string;
  lastName?: string;
  content?: string | null;
  comment?: string | null;
  text?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  [key: string]: unknown;
}
