export type CommentTargetType =
  | "announcement"
  | "assignment"
  | "discussion"
  | "material"
  | "quiz";

export interface CommentItem {
  commentId?: number;
  id?: number;
  userId?: number;
  firstName?: string;
  lastName?: string;
  content?: string | null;
  comment?: string | null;
  text?: string | null;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}
