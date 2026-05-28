export interface Assignment {
  id?: string | number;
  assignmentId: string | number;
  courseId: string | number | null;
  title: string;
  description: string | null;
  dueAt?: string | null;
  dueDate?: string | null;
  due_date?: string | null;
  maxScore?: number | null;
  max_score?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  [key: string]: unknown;
}
