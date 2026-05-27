export interface Assignment {
  assignmentId: number;
  courseId: number;
  title: string;
  description: string | null;
  dueDate?: string | null;
  due_date?: string | null;
  max_score?: number | null;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}
