export interface Course {
  id: string | number;
  courseId: string | number;
  code?: string | null;
  title: string;
  courseName: string;
  description: string | null;
  courseDescription: string | null;
  instructorId?: string | number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}
