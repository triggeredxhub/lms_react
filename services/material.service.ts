import { api } from "@/lib/api";
import { Material } from "@/models/material/Material.model";

function normalizeMaterial(response: unknown): Material {
  if (response && typeof response === "object") {
    const record = response as Record<string, unknown>;

    const materialId = record.id ?? record.materialId;

    if (typeof materialId === "string" || typeof materialId === "number") {
      return {
        courseId:
          typeof record.courseId === "string" ||
          typeof record.courseId === "number"
            ? record.courseId
            : null,
        createdAt:
          typeof record.createdAt === "string" ? record.createdAt : null,
        description:
          typeof record.description === "string" ? record.description : null,
        filePath:
          typeof record.fileUrl === "string"
            ? record.fileUrl
            : typeof record.filePath === "string"
              ? record.filePath
              : null,
        fileType:
          typeof record.fileType === "string"
            ? (record.fileType as Material["fileType"])
            : null,
        fileUrl: typeof record.fileUrl === "string" ? record.fileUrl : null,
        id: materialId,
        materialId,
        title:
          typeof record.title === "string" ? record.title : "Untitled material",
        updatedAt:
          typeof record.updatedAt === "string" ? record.updatedAt : null,
      };
    }

    const nestedMaterial = Object.values(record).find(
      (value) =>
        value &&
        typeof value === "object" &&
        (typeof (value as Record<string, unknown>).id === "string" ||
          typeof (value as Record<string, unknown>).id === "number" ||
          typeof (value as Record<string, unknown>).materialId === "string" ||
          typeof (value as Record<string, unknown>).materialId === "number"),
    );

    if (nestedMaterial) {
      return normalizeMaterial(nestedMaterial);
    }
  }

  throw new Error("Material details are unavailable.");
}

export async function getMaterialById(materialId: string): Promise<Material> {
  const response = await api.get(`/materials/${materialId}`, {}, true);

  return normalizeMaterial(response);
}
