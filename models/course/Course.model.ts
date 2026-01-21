export interface Course {
  courseId: number;
  courseName: string;
  courseDescription: string | null;
  instructorId?: number;
}
