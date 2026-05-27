export interface Material {
  materialId: number;
  courseId?: number;
  title: string;
  description: string | null;
  filePath?: string | null;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}
