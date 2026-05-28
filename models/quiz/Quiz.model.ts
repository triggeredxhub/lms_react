export interface Quiz {
  id?: string | number;
  quizId: string | number;
  courseId?: string | number | null;
  quizTitle?: string;
  title?: string;
  description: string | null;
  googleFormUrl?: string | null;
  googleFormId?: string | null;
  maxScore?: number | null;
  opensAt?: string | null;
  closesAt?: string | null;
  due_date?: string | null;
  dueDate?: string | null;
  timeLimit?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  [key: string]: unknown;
}
