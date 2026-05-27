export interface Quiz {
  quizId: number;
  courseId?: number;
  quizTitle?: string;
  title?: string;
  description: string | null;
  due_date?: string | null;
  dueDate?: string | null;
  timeLimit?: number | null;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}
