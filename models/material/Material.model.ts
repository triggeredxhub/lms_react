export type MaterialType = "pdf" | "doc" | "xlsx" | "ppt";

export interface Material {
  id?: string | number;
  materialId: string | number;
  courseId?: string | number | null;
  title: string;
  description: string | null;
  fileUrl?: string | null;
  fileType?: MaterialType | null;
  filePath?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  [key: string]: unknown;
}
